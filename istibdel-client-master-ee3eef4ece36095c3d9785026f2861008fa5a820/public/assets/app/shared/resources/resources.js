(function () {

    var schema = [{
        "className": "_User",
        "fields": {
            "objectId": {
                "type": "String"
            },
            "createdAt": {
                "type": "Date"
            },
            "updatedAt": {
                "type": "Date"
            },
            "ACL": {
                "type": "ACL"
            },
            "username": {
                "type": "String"
            },
            "password": {
                "type": "String"
            },
            "email": {
                "type": "String"
            },
            "emailVerified": {
                "type": "Boolean"
            },
            "authData": {
                "type": "Object"
            },
            "avatar": {
                "type": "String"
            },
            "adresse": {
                "type": "String"
            },
            "isBlocked": {
                "type": "Boolean"
            },
            "fullName": {
                "type": "String"
            },
            "credit":{
                "type":"Number"
            },
            "rate":{
                "type":"Number"
            }
        },
        "classLevelPermissions": {
            "find": {
                "*": true
            },
            "get": {
                "*": true
            },
            "create": {
                "*": true
            },
            "update": {
                "*": true
            },
            "delete": {
                "*": true
            },
            "addField": {
                "*": true
            }
        }
    }, {
        "className": "_Session",
        "fields": {
            "objectId": {
                "type": "String"
            },
            "createdAt": {
                "type": "Date"
            },
            "updatedAt": {
                "type": "Date"
            },
            "ACL": {
                "type": "ACL"
            },
            "restricted": {
                "type": "Boolean"
            },
            "user": {
                "type": "Pointer",
                "targetClass": "_User"
            },
            "installationId": {
                "type": "String"
            },
            "sessionToken": {
                "type": "String"
            },
            "expiresAt": {
                "type": "Date"
            },
            "createdWith": {
                "type": "Object"
            }
        },
        "classLevelPermissions": {
            "find": {
                "*": true
            },
            "get": {
                "*": true
            },
            "create": {
                "*": true
            },
            "update": {
                "*": true
            },
            "delete": {
                "*": true
            },
            "addField": {
                "*": true
            }
        }
    }, {
        "className": "_Role",
        "fields": {
            "objectId": {
                "type": "String"
            },
            "createdAt": {
                "type": "Date"
            },
            "updatedAt": {
                "type": "Date"
            },
            "ACL": {
                "type": "ACL"
            },
            "name": {
                "type": "String"
            },
            "users": {
                "type": "Relation",
                "targetClass": "_User"
            },
            "roles": {
                "type": "Relation",
                "targetClass": "_Role"
            }
        },
        "classLevelPermissions": {
            "find": {
                "*": true
            },
            "get": {
                "*": true
            },
            "create": {
                "*": true
            },
            "update": {
                "*": true
            },
            "delete": {
                "*": true
            },
            "addField": {
                "*": true
            }
        }
    }, {
        "className": "_Installation",
        "fields": {
            "objectId": {
                "type": "String"
            },
            "createdAt": {
                "type": "Date"
            },
            "updatedAt": {
                "type": "Date"
            },
            "ACL": {
                "type": "ACL"
            },
            "installationId": {
                "type": "String"
            },
            "deviceToken": {
                "type": "String"
            },
            "channels": {
                "type": "Array"
            },
            "deviceType": {
                "type": "String"
            },
            "pushType": {
                "type": "String"
            },
            "GCMSenderId": {
                "type": "String"
            },
            "timeZone": {
                "type": "String"
            },
            "localeIdentifier": {
                "type": "String"
            },
            "badge": {
                "type": "Number"
            },
            "appVersion": {
                "type": "String"
            },
            "appName": {
                "type": "String"
            },
            "appIdentifier": {
                "type": "String"
            },
            "parseVersion": {
                "type": "String"
            }
        },
        "classLevelPermissions": {
            "find": {
                "*": true
            },
            "get": {
                "*": true
            },
            "create": {
                "*": true
            },
            "update": {
                "*": true
            },
            "delete": {
                "*": true
            },
            "addField": {
                "*": true
            }
        }
    }, {
        "className": "Category",
        "fields": {
            "objectId": {
                "type": "String"
            },
            "createdAt": {
                "type": "Date"
            },
            "updatedAt": {
                "type": "Date"
            },
            "ACL": {
                "type": "ACL"
            },
            "name": {
                "type": "String",
               
            },
            "thumbnail": {
                "type": "String",
               
            },
            "range": {
                "type": "Number"
            },
            "parent": {
                "type": "Pointer",
                "targetClass": "Category"
            },
            "isHidden": {
                "type": "Boolean"
            },
            "annonceCount": {
                "type": "Number"
            },
            "icon": {
                "type": "String",
               
            }
        },
        "classLevelPermissions": {
            "find": {
                "*": true
            },
            "get": {
                "*": true
            },
            "create": {},
            "update": {},
            "delete": {},
            "addField": {}
        }
    }, {
        "className": "Rating",
        "fields": {
            "objectId": {
                "type": "String"
            },
            "createdAt": {
                "type": "Date"
            },
            "updatedAt": {
                "type": "Date"
            },
            "ACL": {
                "type": "ACL"
            },
            "review": {
                "type": "String",
               
            },
            "rate": {
                "type": "Number"
            },
            "user_id": {
                "type": "Pointer",
                "targetClass": "_User"
            },
            "user_id_to": {
                "type": "Pointer",
                "targetClass": "_User"
            }
        },
        "classLevelPermissions": {
            "find": {
                "*": true
            },
            "get": {
                "*": true
            },
            "create": {},
            "update": {},
            "delete": {},
            "addField": {}
        }
    }, {
        "className": "Annonce",
        "fields": {
            "objectId": {
                "type": "String"
            },
            "createdAt": {
                "type": "Date"
            },
            "updatedAt": {
                "type": "Date"
            },
            "ACL": {
                "type": "ACL"
            },
            "name": {
                "type": "String",
               
            },
            "purchase": {
                "type": "Pointer",
                "targetClass": "Purchase"
               
            },
            "exchange": {
                "type": "Pointer",
                "targetClass": "Exchange"
               
            },
            "viewCount": {
                "type": "Number"
            },
            "price": {
                "type": "String"
            },
            "author": {
                "type": "Pointer",
                "targetClass": "_User"
            },
            "isExchange": {
                "type": "Boolean",
               
            },
            "isArchived": {
                "type": "Boolean",
               
            },
            "adresse": {
                "type": "String"
            },
            "status": {
                "type": "String"
            },
            "location": {
                "type": "GeoPoint"
            },
            "images": {
                "type": "Array"
            },
            "tags": {
                "type": "Array"
            },
            "annonceDescription": {
                "type": "String"
            },
            "category": {
                "type": "Pointer",
                "targetClass": "Category"
            },
            "categoryParent": {
                "type": "Pointer",
                "targetClass": "Category"
            },
            "exchangedAnnonce": {
                "type": "Array"
            },
            "country": {
                "type": "String"
            },
            "locality": {
                "type": "String"
            },
            "reports": {
                "type": "Array"
            },
            "quantity": {
                "type": "Number"
            },
            "remainingQuantity": {
                "type": "Number"
            },
            "purchases": {
                "type": "Array"
            }
        },
        "classLevelPermissions": {
            "find": {
                "*": true
            },
            "get": {
                "*": true
            },
            "create": {},
            "update": {},
            "delete": {},
            "addField": {}
        }
    }, {
        "className": "Comment",
        "fields": {
            "objectId": {
                "type": "String"
            },
            "createdAt": {
                "type": "Date"
            },
            "updatedAt": {
                "type": "Date"
            },
            "ACL": {
                "type": "ACL"
            },
            "content": {
                "type": "String",
               
            },
            "annonce": {
                "type": "Pointer",
                "targetClass": "Annonce"
            },
            "author": {
                "type": "Pointer",
                "targetClass": "_User"
            },
            "productPurchase": {
                "type": "Boolean"
            },
            "confirmPurchase": {
                "type": "Boolean"
            },
            "quantity": {
                "type": "Number"
            },
            "price": {
                "type": "Number"
            }
        },
        "classLevelPermissions": {
            "find": {
                "*": true
            },
            "get": {
                "*": true
            },
            "create": {},
            "update": {},
            "delete": {},
            "addField": {}
        }
    }, {
        "className": "Purchase",
        "fields": {
            "objectId": {
                "type": "String"
            },
            "createdAt": {
                "type": "Date"
            },
            "updatedAt": {
                "type": "Date"
            },
            "ACL": {
                "type": "ACL"
            },
            "price": {
                "type": "Number",
               
            },
            "annonce": {
                "type": "Pointer",
                "targetClass": "Annonce"
            },
            "purchaser": {
                "type": "Pointer",
                "targetClass": "_User"
            },
            "vendor": {
                "type": "Pointer",
                "targetClass": "_User"
            },
            "quantity": {
                "type": "Number"
            }
        },
        "classLevelPermissions": {
            "find": {
                "*": true
            },
            "get": {
                "*": true
            },
            "create": {},
            "update": {},
            "delete": {},
            "addField": {}
        }
    }, {
        "className": "Exchange",
        "fields": {
            "objectId": {
                "type": "String"
            },
            "createdAt": {
                "type": "Date"
            },
            "updatedAt": {
                "type": "Date"
            },
            "ACL": {
                "type": "ACL"
            },
            "exchangeAnnonce": {
                "type": "Pointer",
                "targetClass": "Annonce"
            },
            "annonce": {
                "type": "Pointer",
                "targetClass": "Annonce"
            },
            "purchaser": {
                "type": "Pointer",
                "targetClass": "_User"
            },
            "vendor": {
                "type": "Pointer",
                "targetClass": "_User"
            }
        },
        "classLevelPermissions": {
            "find": {
                "*": true
            },
            "get": {
                "*": true
            },
            "create": {},
            "update": {},
            "delete": {},
            "addField": {}
        }
    }, {
        "className": "Tag",
        "fields": {
            "objectId": {
                "type": "String"
            },
            "createdAt": {
                "type": "Date"
            },
            "updatedAt": {
                "type": "Date"
            },
            "ACL": {
                "type": "ACL"
            },
            "title": {
                "type": "String",
               
            }
        },
        "classLevelPermissions": {
            "find": {
                "*": true
            },
            "get": {
                "*": true
            },
            "create": {},
            "update": {},
            "delete": {},
            "addField": {}
        }
    }, {
        "className": "Payment",
        "fields": {
            "objectId": {
                "type": "String"
            },
            "createdAt": {
                "type": "Date"
            },
            "updatedAt": {
                "type": "Date"
            },
            "ACL": {
                "type": "ACL"
            },
            "user": {
                "type": "Pointer",
                "targetClass": "_User"
               
            },
            "transactionId": {
                "type": "String"
            },
            "credit": {
                "type": "Number"
            }
        },
        "classLevelPermissions": {
            "find": {
                "*": true
            },
            "get": {
                "*": true
            },
            "create": {},
            "update": {},
            "delete": {},
            "addField": {}
        }
    }, {
        "className": "Configuration",
        "fields": {
            "objectId": {
                "type": "String"
            },
            "createdAt": {
                "type": "Date"
            },
            "updatedAt": {
                "type": "Date"
            },
            "ACL": {
                "type": "ACL"
            },
            "contacts": {
                "type": "Object"
            },
            "aboutApp": {
                "type": "String"
            },
            "conditionUse": {
                "type": "String"
            },
            "maintenance":{
                "type":"Boolean"
            },
            "transferInformation":{
                "type":"String"
            },
            "mediationRatio":{
                "type":"Number"
            },
            "currencyConverter":{
                "type":"Number"
            }
        },
        "classLevelPermissions": {
            "find": {
                "*": true
            },
            "get": {
                "*": true
            },
            "create": {},
            "update": {},
            "delete": {},
            "addField": {
                "*": true
            }
        }
    
    }];

    function extendParseQuery($q, $timeout) {

        var originalFind = Parse.Query.prototype.find;
        Parse.Query.prototype.find = function (options) {
            options = options || {};
            options.useMasterKey = true;

            var deferred = $q.defer();
            originalFind.apply(this, [options]).then(function (res) {
                deferred.resolve(res);
            }, function (error) {
                deferred.reject(error);
            });

            return deferred.promise;
        };

        Parse.Query.prototype.paged = function (page, pageSize) {
            return this.skip((page - 1) * pageSize).limit(pageSize);
        };

        Parse.Query.prototype.search = function (keywords, fields, multiLanguage) {
            if (!keywords) {
                return this;
            }
            if (multiLanguage) {
                var arabicQuery = new Parse.Query('Language');
                arabicQuery.matches('arabicLabel', new RegExp(keywords, 'i'));

                var englishQuery = new Parse.Query('Language');
                englishQuery.matches('englishLabel', new RegExp(keywords, 'i'));

                var subQuery = Parse.Query.or(arabicQuery, englishQuery);

                return this.matchesQuery(fields[0], subQuery);
            }
            return this.matches(fields[0], new RegExp(keywords, 'i'));
        };
   
    }

    function extendParseObject() {
        // recursive revert
        var originalRevert = Parse.Object.prototype.revert;
        var newRevert = function (o) {
            originalRevert.apply(o);
            var classInfo = _.find(schema, {
                className: o.className
            });
            _.each(classInfo.fields, function (v, k) {
                if (v.type === 'Pointer' && o[k]) {
                    originalRevert.apply(o[k]);
                    newRevert(o[k]);
                }
            });
        };
        Parse.Object.prototype.revert = function () {
            newRevert(this);
        };
       
    }

    _.each(schema, function (classInfo) {
        var className = classInfo.className;
        var properties = {};

        var ClassType = Parse.Object.extend(className, {}, {
            Query: function () {
                var query = new Parse.Query(className);
                return query;
            },
            get: function (id, includes, useMasterKey) {
                var query = new Parse.Query(className);
                query.equalTo('objectId', id);
                if (includes) {
                    query.include(includes);
                }
                return query.first({
                    useMasterKey: !!useMasterKey
                });
            }
        });

        _.each(classInfo.fields, function (v, k) {
            if (k === 'ACL' || k === 'className') {
                return;
            }

            Object.defineProperty(ClassType.prototype, k, {
                configurable: true,
                enumerable: true,
                get: function () {
                    return this.get(k);
                },
                set: function (newValue) {
                    if (newValue === undefined || newValue === null) {
                        this.unset(k);
                    } else {
                        this.set(k, newValue);
                    }
                }
            });
        });

        if (className === '_User') {
            className = 'User';
        } else if (className === '_Installation') {
            className = 'Installation';
        }

        angular.module('istibdel.shared')
            .provider(className, function () {
                this.$get = [function () {
                    return ClassType;
                }];
            });
    });

    angular.module('istibdel.shared')
        .run(['$q', '$timeout', function ($q, $timeout) {
            extendParseQuery($q, $timeout);
            extendParseObject();
        }]);
})();