angular.module('istibdel.user')
    .controller('UserProfileController', ['$rootScope', '$scope', '$http', '$timeout', '$route', 'Comment', 'User', 'Annonce', 'Purchase', 'Exchange', 'Rating',
        function ($rootScope, $scope, $http, $timeout, $route, Comment, User, Annonce, Purchase, Exchange, Rating) {
            /* intial configuration  */

            $scope.user = $route.current.locals.user;
            $scope.tab = 1;



            /* get fav */
            var storage = window.localStorage;
            if (storage.getItem('istibdel')) {
                var istibdel = JSON.parse(storage.getItem('istibdel'));
            } else {
                storage.setItem('istibdel', JSON.stringify({
                    likes: []
                }));
                var istibdel = JSON.parse(storage.getItem('istibdel'));
            }

            // getFav(istibdel.likes);

            $scope.isLike = function (annonce) {

                var likes = istibdel.likes;
                if (likes.indexOf(annonce.id) >= 0) {
                    return 'col-red';
                } else {
                    return '';
                }
            }
            $scope.like = function (annonce) {
                $timeout(function () {
                    var likes = istibdel.likes;
                    if (likes.indexOf(annonce.id) >= 0) {
                        likes[likes.indexOf(annonce.id)] = null;
                        likes = _.filter(likes, function (item) {
                            return item;
                        });
                    } else {
                        likes.push(annonce.id);
                    }

                    storage.setItem('istibdel', JSON.stringify({
                        likes: likes
                    }));
                    // getFav(istibdel.likes);
                });
            }
            /*  */












            /* get annonces */
            var query = new Annonce.Query();


            query.limit(99999999)
                .descending(['createdAt'])
                .equalTo('author', {
                    "__type": "Pointer",
                    "className": "_User",
                    "objectId": $scope.user.id
                })
                .find()
                .then(function (annonces) {
                    $timeout(function () {
                        $scope.annonces = [];
                        $scope.annonceCount = 0;
                        $scope.purchaseCount = 0;
                        $scope.exchangeCount = 0;

                        _.each(annonces, function (item) {
                            if (item.purchases) {
                                $scope.purchaseCount += item.purchases.length;
                            }
                            if (item.exchange) {
                                $scope.exchangeCount++;
                            }
                            if (item.remainingQuantity > 0) {
                                $scope.annonceCount++;
                                $scope.annonces.push(item);
                            }
                        })
                    })

                });
            /*  */


            /* get purchase annonce */


            $scope.annoncePurchaseCount = 0;
            var query = new Purchase.Query();


            query.limit(99999999)
                .descending(['createdAt'])
                .equalTo('purchaser', {
                    "__type": "Pointer",
                    "className": "_User",
                    "objectId": $scope.user.id
                })

                .count()
                .then(function (count) {
                    $timeout(function () {




                        $scope.annoncePurchaseCount += count;

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

                .count()
                .then(function (count) {
                    $timeout(function () {




                        $scope.annoncePurchaseCount += count;

                    })

                });
            /*  */

            /* set rate user */
            $scope.saveRate = function () {

                if ($rootScope.currentUser && $scope.user && $scope.rate) {
                    var query = new Rating.Query();
                    query.equalTo('user_id', {
                            "__type": "Pointer",
                            "className": "_User",
                            "objectId": $rootScope.currentUser.objectId
                        })
                        .equalTo('user_id_to', {
                            "__type": "Pointer",
                            "className": "_User",
                            "objectId": $scope.user.id
                        })
                        .first().then(function (rat) {
                            var rate = rat;
                            if (!rate) {
                                rate = new Rating();
                                rate.user_id = {
                                    "__type": "Pointer",
                                    "className": "_User",
                                    "objectId": $rootScope.currentUser.objectId
                                };
                                rate.user_id_to = {
                                    "__type": "Pointer",
                                    "className": "_User",
                                    "objectId": $scope.user.id
                                };

                            }
                            rate.rate = $scope.rate;
                            rate.review = $scope.review;
                            rate.save().then(function () {
                                $rootScope.successNotif("تم التقييم");
                            }, function (error) {
                                $rootScope.errorNotif("حدث خطأ");
                            })


                        })
                } else {
                    $rootScope.errorNotif("حدث خطأ");
                }




            }
            /*  */

        }












    ]);