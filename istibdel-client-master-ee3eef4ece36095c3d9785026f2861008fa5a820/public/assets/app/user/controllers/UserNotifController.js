angular.module('istibdel.user')
    .controller('UserNotifController', ['$rootScope', '$scope', '$http', '$timeout', '$route', 'Comment', 'User', 'Annonce', 'Purchase', 'Exchange', 'Configuration',
        function ($rootScope, $scope, $http, $timeout, $route, Comment, User, Annonce, Purchase, Exchange, Configuration) {
            /* intial configuration  */
            $scope.config = $route.current.locals.config;
            $scope.user = $route.current.locals.user;
            $scope.tab = $route.current.locals.tab || 1;
            $scope.annonces = [];


            $scope.config.currencyConverter = $scope.config.currencyConverter || 1;
            $scope.user.credit = $scope.user.credit || 0;

            $scope.creditUSD = (Math.round(($scope.config.currencyConverter * $scope.user.credit) * 100) / 100).toString();

            var query = new Configuration.Query();
            query.first().then(function (config) {
                $timeout(function () {

                    $scope.conditionUse = config.conditionUse;
                });
            });






            /* get annonces */
            var getAnnonce = function () {
                var query = new Annonce.Query();


                query.limit(99999999)
                    .descending(['createdAt'])
                    .equalTo('author', {
                        "__type": "Pointer",
                        "className": "_User",
                        "objectId": $scope.user.id
                    })

                    .doesNotExist('exchange')
                    .notEqualTo('isArchived', true);
                var commentQuery = new Comment.Query();
                commentQuery.equalTo('productPurchase', true)
                    .notEqualTo('confirmPurchase', true)
                    .include('annonce,author')
                    .matchesQuery('annonce', query)
                    .find()
                    .then(function (comments) {

                        $scope.comments = comments;

                        var annonceQuery = new Annonce.Query();
                        annonceQuery.limit(99999999)
                            .descending(['createdAt'])
                            .equalTo('author', {
                                "__type": "Pointer",
                                "className": "_User",
                                "objectId": $scope.user.id
                            })
                            .doesNotExist('purchases')
                            .doesNotExist('exchange')
                            .notEqualTo('isArchived', true)
                            .notEqualTo('exchangedAnnonce', [])
                            .exists('exchangedAnnonce')
                            .include('exchangedAnnonce.author')
                            .find()
                            .then(function (annonces) {
                                $timeout(function () {
                                    console.log(annonces[0]);

                                    $scope.annonces = annonces;


                                    $scope.annonceCount = $scope.annonces.length + $scope.comments.length;

                                })

                            });


                    });
            }
            /*  */
            getAnnonce();
            /* get purchase */
            var getPurchase = function () {
                var query = new Purchase.Query();


                query.limit(99999999)
                    .descending(['createdAt'])
                    .equalTo('vendor', {
                        "__type": "Pointer",
                        "className": "_User",
                        "objectId": $scope.user.id
                    })
                    .include('purchaser,annonce')
                    .find()
                    .then(function (annonces) {
                        $timeout(function () {

                            $scope.purchases = annonces;


                            $scope.purchaseCount = annonces.length;

                        })

                    });
            }

            /*  */
            getPurchase();

            /* get exchange */
            var getExchange = function () {
                var query = new Exchange.Query();


                query.limit(99999999)
                    .descending(['createdAt'])
                    .equalTo('vendor', {
                        "__type": "Pointer",
                        "className": "_User",
                        "objectId": $scope.user.id
                    })
                    .include('purchaser,annonce,exchangeAnnonce')
                    .find()
                    .then(function (annonces) {
                        $timeout(function () {

                            $scope.exchanges = annonces;


                            $scope.exchangeCount = annonces.length;

                        })

                    });
            }

            /*  */
            getExchange();


            /* get purchase annonce */
            var getAnnoncePurchase = function () {
                $scope.annoncePurchases = [];
                $scope.annoncePurchaseCount = 0;
                var query = new Purchase.Query();


                query.limit(99999999)
                    .descending(['createdAt'])
                    .equalTo('purchaser', {
                        "__type": "Pointer",
                        "className": "_User",
                        "objectId": $scope.user.id
                    })
                    .include('vendor,annonce')
                    .find()
                    .then(function (annonces) {
                        $timeout(function () {

                            _.each(annonces, function (item) {
                                $scope.annoncePurchases.push(item);
                            });


                            $scope.annoncePurchaseCount += annonces.length;

                        })

                    });
                var query = new Exchange.Query();


                query.limit(99999999)
                    .descending(['createdAt'])
                    .equalTo('purchaser', {
                        "__type": "Pointer",
                        "className": "_User",
                        "objectId": $scope.user.id
                    })
                    .include('vendor,annonce')
                    .find()
                    .then(function (annonces) {
                        $timeout(function () {

                            _.each(annonces, function (item) {
                                $scope.annoncePurchases.push(item);
                            });


                            $scope.annoncePurchaseCount += annonces.length;

                        })

                    });
            }

            /*  */
            getAnnoncePurchase();



            $scope.selectItem = function (annonce, exchange, comment) {
                $scope.annonce = annonce;
                $scope.exchange = exchange;
                $scope.comment = comment;
            }

            /* confirm demande */
            $scope.confirm = function () {
                if ($scope.comment) {

                    var object = new Purchase();
                    object.purchaser = {
                        "__type": "Pointer",
                        "className": "_User",
                        "objectId": $scope.comment.author.id
                    };
                    object.vendor = {
                        "__type": "Pointer",
                        "className": "_User",
                        "objectId": $scope.user.id
                    };
                    object.annonce = {
                        "__type": "Pointer",
                        "className": "Annonce",
                        "objectId": $scope.annonce.id
                    };


                    object.price = $scope.comment.price;
                    object.quantity = $scope.comment.quantity;

                    object.save().then(function (purchase) {
                        $scope.annonce.category.increment("annonceCount", -1);
                        $scope.annonce.category.save();
                        $scope.annonce.categoryParent.increment("annonceCount", -1);
                        $scope.annonce.categoryParent.save();
                        $scope.comment.confirmPurchase = true;
                        $scope.comment.save();
                        $scope.annonce.purchases = $scope.annonce.purchases || [];
                        $scope.annonce.purchases.push(purchase);
                        $scope.annonce.increment('remainingQuantity', -$scope.comment.quantity);
                        $scope.annonce.save().then(function (annonce) {

                            $rootScope.successNotif("تمت الموافقة");
                            getAnnonce();
                        }, function (error) {
                            $rootScope.errorNotif("حدث خطأ في الحفظ");
                        });
                    }, function (error) {
                        $rootScope.errorNotif("حدث خطأ في الحفظ");
                    })
                } else {
                    var object = new Exchange();
                    object.purchaser = {
                        "__type": "Pointer",
                        "className": "_User",
                        "objectId": $scope.exchange.author.id
                    };
                    object.vendor = {
                        "__type": "Pointer",
                        "className": "_User",
                        "objectId": $scope.user.id
                    };
                    object.annonce = {
                        "__type": "Pointer",
                        "className": "Annonce",
                        "objectId": $scope.annonce.id
                    };


                    object.exchangeAnnonce = {
                        "__type": "Pointer",
                        "className": "Annonce",
                        "objectId": $scope.exchange.id
                    };

                    object.save().then(function (exchange) {
                        $scope.annonce.category.increment("annonceCount", -1);
                        $scope.annonce.category.save();
                        $scope.annonce.categoryParent.increment("annonceCount", -1);
                        $scope.annonce.categoryParent.save();
                        $scope.exchange.category.increment("annonceCount", -1);
                        $scope.exchange.category.save();
                        $scope.exchange.categoryParent.increment("annonceCount", -1);
                        $scope.exchange.categoryParent.save();
                        $scope.exchange.exchange = exchange;
                        $scope.exchange.increment('remainingQuantity', -1);
                        $scope.exchange.save();
                        $scope.annonce.increment('remainingQuantity', -1);
                        $scope.annonce.exchange = exchange;
                        $scope.annonce.save().then(function (annonce) {

                            $rootScope.successNotif("تمت الموافقة");
                            getAnnonce();
                        }, function (error) {
                            $rootScope.errorNotif("حدث خطأ في الحفظ");
                        });
                    }, function (error) {
                        $rootScope.errorNotif("حدث خطأ في الحفظ");
                    })

                }
            }

            /*  */

            /* paypal */
            paypal.Button.render({

                // Pass the client ids to use to create your transaction on sandbox and production environments
                env: 'production',
                client: {
                    sandbox: 'AYOXBqzMhvVAe8Kbf8GcrxGuy0WcE-YdWFE729-x_QhO4LR-evZaSuqK61LkgkZVuNQTgRzFJgjlnnhf', // from https://developer.paypal.com/developer/applications/
                    production: 'AbYJUbfgm3t3Qp8aW9PghIyVTQ3aW8oIsY3vcOolbQ7cqaH78eaHWoXE3Yv9VFtf_yvj70AMFLnSvVEU' // from https://developer.paypal.com/developer/applications/
                },

                // Pass the payment details for your transaction
                // See https://developer.paypal.com/docs/api/payments/#payment_create for the expected json parameters

                payment: function (data, actions) {
                    return actions.payment.create({
                        transactions: [{
                            amount: {
                                total: $scope.creditUSD,
                                currency: 'USD'
                            }
                        }]
                    });
                },

                // Display a "Pay Now" button rather than a "Continue" button

                commit: true,

                // Pass a function to be called when the customer completes the payment

                onAuthorize: function (data, actions) {
                    return actions.payment.execute().then(function (response) {
                        console.log('The payment was completed!');
                        $timeout(function () {
                            $scope.infoCredit.hide();
                            var object = new Payment();
                            object.user = $scope.user;
                            object.transactionId = response.id;
                            object.credit = $scope.user.credit;
                            object.save();
                            $scope.user.credit = 0;
                            $scope.user.save();
                            $rootScope.successNotif("تم الإستخلاص");
                        })

                    });
                },

                // Pass a function to be called when the customer cancels the payment

                onCancel: function (data) {
                    console.log('The payment was cancelled!');
                }

            }, '#paypal');
            /*  */


        }
    ]);