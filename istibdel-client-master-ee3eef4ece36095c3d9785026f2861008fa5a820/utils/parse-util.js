var Parse = require('parse/node');
var _ = require('lodash');
var Q = require('q');

function readFields(obj, entity) {
    _.each(obj, function (value, key) {
        if (key == 'createdAt' || key == 'updatedAt') {
            return;
        }

        if (key.indexOf('_') === 0) {
            return;
        }

        if (typeof (value) === 'object') {
            if (value.className) {
                var Entity = Parse.Object.extend(value.className);
                var e = new Entity();
                e.id = value.objectId;
                entity.set(key, e);
            }
            else {
                entity.set(key, value);
            }
        }
        else {
            entity.set(key, value);
        }
    });
}

function readIncludes(req) {
    if (!req.query.include) {
        return [];
    }

    return req.query.include.split(',');
}

function handleParseError(err, res, next) {
    res.status(500);
    res.json({ error: err });
}

function toCamelCase(str) {
    return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function (letter, index) {
        return index == 0 ? letter.toLowerCase() : letter.toUpperCase();
    }).replace(/\s+/g, '');
}

var PagedResponse = function (className, req, res, next, callback) {
    var findQuery = new Parse.Query(className);
    var totalQuery = new Parse.Query(className);

    var page = parseInt(req.query.page, 10);
    var pageSize = parseInt(req.query.pageSize, 10);
    var search = req.query.search;
    var filter = req.query.filter;
    var orQueries = [];
    var andQueries = [];

    var includes = readIncludes(req);
    findQuery.include(includes);
    
    if (search) {
        var hash = {};
        var parts = search.split(',');
        _.each(parts, function (p) {
            var expr = p.split(':');
            hash[expr[0]] = expr[1];
        });

        _.each(hash, function (v, k) {
            var query = new Parse.Query(className);
            query.matches(k, '.*' + decodeURIComponent(v) + '.*');
            orQueries.push(query);
        });

        findQuery = Parse.Query.or.apply(null, orQueries);
        totalQuery = Parse.Query.or.apply(null, orQueries);
    }

    if (filter) {
        var hash = {};
        var parts = filter.split(',');
        _.each(parts, function (p) {
            var expr = p.split(':');
            hash[expr[0]] = expr[1];
        });

        _.each(hash, function (v, k) {

            if (k.indexOf('.') > 0) {
                var subQueryParts = k.split('.');
                var cls = subQueryParts[0];
                var field = subQueryParts[1];

                var subQuery = new Parse.Query(cls);
                subQuery.equalTo(field, v);

                findQuery.matchesQuery(toCamelCase(cls), subQuery);
                totalQuery.matchesQuery(toCamelCase(cls), subQuery);
            }
            else {
                var number = parseInt(v, 10);
                v = number === NaN ? decodeURIComponent(v) : number;

                findQuery.equalTo(k, v);
                totalQuery.equalTo(k, v);
            }
        });
    }

    var findPromise = findQuery.descending("createdAt");
    if (pageSize) {
        findPromise = findQuery.skip((page - 1) * pageSize)
            .limit(pageSize);
    }

    findPromise = findQuery.find();


    var totalPromise = totalQuery.count();

    return Q.all([findPromise, totalPromise]).then(function (r) {
        var result = r[0];
        var count = r[1];
        var output = { totalCount: count, items: result }
        if (callback) {
            callback(output);
        }
        else {
            res.json(output);
        }
    }, function (err) {
        next(err);
    });
};

var GetById = function (className, id, req, res, next) {
    var query = new Parse.Query(className);
    query.equalTo('objectId', id);

    var includes = readIncludes(req);
    query.include(includes);

    return query.first({
        success: function (obj) {
            res.json(obj);
        },
        error: function (res) {
            next(res);
        }
    });
};

var Save = function (className, obj, req, res, next) {
    var Entity = Parse.Object.extend(className);

    var newObj = new Entity();
    readFields(obj, newObj);

    newObj.save(null, {
        success: function (r) {
            res.json(r);
        },
        error: function (r, error) {
            handleParseError(error.message, res, next);
        }
    });
};

var SendPush = function (req, res, next) {
    var query = new Parse.Query(Parse.Installation);

    if (req.body.target !== 'All') {
        if (req.body.target === 'iOS') {
            query.equalTo('deviceType', 'ios');
        }
        else if (req.body.target === 'Android') {
            query.equalTo('deviceType', 'android');
        }
    }

    Parse.Cloud.useMasterKey();
    Parse.Push.send({
        where: query,
        data: { alert: req.body.notification }
    }, {
            useMasterKey: true,
            success: function () {
                res.json({ success: true });
            },
            error: function (error) {
                res.json({ success: false, error: error });
            }
        });
};

var GetChartData = function (className, year, req, res, next) {
    var isInstallation = className === '_Installation';

    var query = new Parse.Query(className);
    var startDate = new Date(year, 1, 1);
    var endDate = new Date(year, 12, 31);
    query.greaterThanOrEqualTo('createdAt', startDate);
    query.lessThanOrEqualTo('createdAt', endDate);
    query.limit(99999999);
    if (isInstallation) {
        query.select('deviceType');
    }
    else {
        query.select('createdAt');
    }

    query.find({
        success: function (r) {

            if (isInstallation) {
                var iOs = _.filter(r, function (item) { return item.get('deviceType') === 'ios'; });
                var android = _.filter(r, function (item) { return item.get('deviceType') === 'android'; });

                var iOsGroupedByMonth = _.groupBy(iOs, function (item) {
                    return new Date(item.createdAt).getMonth();
                });

                var androidGroupedByMonth = _.groupBy(android, function (item) {
                    return new Date(item.createdAt).getMonth();
                });

                var iosOutput = [], androidOutput = [];
                _.each(iOsGroupedByMonth, function (v, k) {
                    iosOutput[k] = v.length;
                });

                _.each(androidGroupedByMonth, function (v, k) {
                    androidOutput[k] = v.length;
                });

                var months = _.range(0, 12);
                _.each(months, function (m) {
                    if (iosOutput[m] === undefined) {
                        iosOutput[m] = 0;
                    }
                    if (androidOutput[m] === undefined) {
                        androidOutput[m] = 0;
                    }
                });
                res.json({ ios: iosOutput, android: androidOutput });
            }
            else {
                var groupedByMonth = _.groupBy(r, function (item) {
                    return new Date(item.createdAt).getMonth();
                });
                var output = [];
                _.each(groupedByMonth, function (v, k) {
                    output[k] = v.length;
                });

                var months = _.range(0, 12);
                _.each(months, function (m) {
                    if (output[m] === undefined) {
                        output[m] = 0;
                    }
                });
                res.json(output);
            }
        },
        error: function (r) {
            res.status(500).json({ error: r.message });
        }
    })
};

var GetUserStats = function (req, res, next) {
    var startDate = null,
        endDate = null;

    if (req.query.startDate) {
        startDate = new Date(req.query.startDate);
    }
    if (req.query.endDate) {
        endDate = new Date(req.query.endDate);
    }

    var totalUsersQuery = new Parse.Query(Parse.User);

    var dealersCountQuery = new Parse.Query(Parse.User);
    dealersCountQuery.equalTo('usertype', 1);

    var customersCountQuery = new Parse.Query(Parse.User);
    customersCountQuery.equalTo('usertype', 0);

    if (startDate) {
        totalUsersQuery.greaterThanOrEqualTo('createdAt', startDate);
        dealersCountQuery.greaterThanOrEqualTo('createdAt', startDate);
        customersCountQuery.greaterThanOrEqualTo('createdAt', startDate);
    }

    if (endDate) {
        totalUsersQuery.lessThanOrEqualTo('createdAt', endDate);
        dealersCountQuery.lessThanOrEqualTo('createdAt', endDate);
        customersCountQuery.lessThanOrEqualTo('createdAt', endDate);
    }

    Q.all([totalUsersQuery.count(), dealersCountQuery.count(), customersCountQuery.count()]).then(function (result) {
        var total = result[0];
        var dealers = result[1];
        var customers = result[2];
        res.json({
            total: total,
            dealers: dealers,
            customers: customers
        });
    }, function (err) {
        res.json({ error: err.message });
    });
};

var GetOrderStats = function (req, res, next) {
    var startDate = null,
        endDate = null;

    if (req.query.startDate) {
        startDate = new Date(req.query.startDate);
    }

    if (req.query.endDate) {
        endDate = new Date(req.query.endDate);
    }

    var countQuery = new Parse.Query('demande');
    var revenueQuery = new Parse.Query('demande');

    if (startDate) {
        countQuery.greaterThanOrEqualTo('createdAt', startDate);
        revenueQuery.greaterThanOrEqualTo('createdAt', startDate);
    }

    if (endDate) {
        countQuery.lessThanOrEqualTo('createdAt', endDate);
        revenueQuery.lessThanOrEqualTo('createdAt', endDate);
    }

    revenueQuery.limit(99999);

    Q.all([countQuery.count(), revenueQuery.find()]).then(function (result) {
        var count = result[0];
        var orders = result[1];

        var revenue = _.sumBy(orders, function (o) { return o.get('price'); });
        var groups = _.groupBy(orders, function (o) {
            return o.get('user').id;
        });

        var customers = _.keys(groups).length;
        res.json({
            count: count,
            revenue: revenue,
            customers: customers
        });
    }, function (err) {
        res.json({ error: err.message });
    });
};

var GetInstallationStats = function (req, res, next) {
    var startDate = null,
        endDate = null;

    if (req.query.startDate) {
        startDate = new Date(req.query.startDate);
    }

    if (req.query.endDate) {
        endDate = new Date(req.query.endDate);
    }

    var totalQuery = new Parse.Query('_Installation');
    var iosQuery = new Parse.Query('_Installation');
    var androidQuery = new Parse.Query('_Installation');

    iosQuery.equalTo('deviceType', 'ios');
    androidQuery.equalTo('deviceType', 'android');

    if (startDate) {
        totalQuery.greaterThanOrEqualTo('createdAt', startDate);
        iosQuery.greaterThanOrEqualTo('createdAt', startDate);
        androidQuery.greaterThanOrEqualTo('createdAt', startDate);
    }

    if (endDate) {
        totalQuery.lessThanOrEqualTo('createdAt', endDate);
        iosQuery.lessThanOrEqualTo('createdAt', endDate);
        androidQuery.lessThanOrEqualTo('createdAt', endDate);
    }

    Q.all([totalQuery.count(), iosQuery.count(), androidQuery.count()]).then(function (result) {
        var total = result[0];
        var ios = result[1];
        var android = result[2];

        res.json({
            total: total,
            ios: ios,
            android: android
        });
    }, function (err) {
        res.json({ error: err.message });
    });
};

var ActivateUser = function (req, res, next) {
    var userId = req.params.userId;
    var query = new Parse.Query(Parse.User);
    query.equalTo('objectId', userId);
    query.first().then(function (user) {
        user.set('account_state', 1);
        user.set('subscriptionDate', new Date());
        user.save().then(function (u) {

            var pushQuery = new Parse.Query(Parse.Installation);
            pushQuery.equalTo('user', u);

            Parse.Cloud.useMasterKey();
            Parse.Push.send({
                where: pushQuery,
                data: { activationAccount: true, alert: "لقد تم تفعيل اشتراكك" }
            }, {
                    useMasterKey: true,
                    success: function () {
                        res.json(u);
                    },
                    error: function (error) {
                        res.json({ error: error.message });
                    }
                });
        });
    }, function (error) {
        res.json({ error: error.message });
    });
};

var GetMostActiveDealer = function (req, res, next) {
    var startDate = null,
        endDate = null;

    if (req.query.startDate) {
        startDate = new Date(req.query.startDate);
    }

    if (req.query.endDate) {
        endDate = new Date(req.query.endDate);
    }

    var ordersQuery = new Parse.Query('demande');

    if (startDate) {
        ordersQuery.greaterThanOrEqualTo('createdAt', startDate);
    }

    if (endDate) {
        ordersQuery.lessThanOrEqualTo('createdAt', endDate);
    }

    ordersQuery.include('annonce.dealer').limit(99999);

    ordersQuery.find().then(function (orders) {
        var groupedByUser = _.groupBy(orders, function (o) {
            return o.get('annonce') ? o.get('annonce').get('dealer').id : null;
        });

        var result = [];
        _.each(groupedByUser, function (userOrders, userId) {
            if (!userId || !userOrders.length || !userOrders[0].get('annonce')) {
                return;
            }

            result.push({
                dealer: userOrders[0].get('annonce').get('dealer'),
                ordersCount: userOrders.length,
                earnings: _.sumBy(userOrders, function (o) { return o.get('price'); })
            });
        });

        result = _.sortBy(result, 'earnings').reverse();
        var top3 = _.take(result, 3);
        res.json(top3);
    }, function (error) {
        res.json({ error: error.message });
    });
};

var GetTopAnnouncements = function (req, res, next) {
    var startDate = null,
        endDate = null;

    if (req.query.startDate) {
        startDate = new Date(req.query.startDate);
    }

    if (req.query.endDate) {
        endDate = new Date(req.query.endDate);
    }

    var ordersQuery = new Parse.Query('demande');

    if (startDate) {
        ordersQuery.greaterThanOrEqualTo('createdAt', startDate);
    }

    if (endDate) {
        ordersQuery.lessThanOrEqualTo('createdAt', endDate);
    }

    ordersQuery.include('annonce.dealer').limit(99999);

    ordersQuery.find().then(function (orders) {
        var groupedByAnnouncement = _.groupBy(orders, function (o) {
            return o.get('annonce') ? o.get('annonce').id : null;
        });

        var result = [];
        _.each(groupedByAnnouncement, function (announcementOrders, announcementId) {
            if (!announcementId || !announcementOrders.length || !announcementOrders[0].get('annonce')) {
                return;
            }

            result.push({
                announcement: announcementOrders[0].get('annonce'),
                ordersCount: announcementOrders.length,
                earnings: _.sumBy(announcementOrders, function (o) { return o.get('price'); })
            });
        });

        result = _.sortBy(result, 'earnings').reverse();
        var top3 = _.take(result, 3);
        res.json(top3);
    }, function (error) {
        res.json({ error: error.message });
    });
};


module.exports = {
    pagedResponse: PagedResponse,
    getById: GetById,
    save: Save,
    sendPush: SendPush,
    getChartData: GetChartData,
    getUserStats: GetUserStats,
    getOrderStats: GetOrderStats,
    getInstallationStats: GetInstallationStats,
    activateUser: ActivateUser,
    getMostActiveDealer: GetMostActiveDealer,
    getTopAnnouncements: GetTopAnnouncements
};