angular.module('istibdel.category')
    .controller('CategoryShowController', ['$rootScope', '$scope', '$http', '$timeout', '$route', 'Category', 'Annonce',
        function ($rootScope, $scope, $http, $timeout, $route, Category, Annonce) {
            /* intial configuration  */
            $scope.parent = $route.current.locals.category;
            $scope.filters = {
                page: 1,
                pageSize: 9

            };
            /*  */
            /* get category childs */
            var getFav = function (likes) {
                var fQuery = new Annonce.Query();

                fQuery.containedIn('objectId', likes)




                    .find()
                    .then(function (annonces) {

                        $timeout(function () {
                            $scope.favAnnonces = annonces;

                        })
                    });
            }
            /*  */
            var storage = window.localStorage;
            if (storage.getItem('istibdel')) {
                var istibdel = JSON.parse(storage.getItem('istibdel'));
            } else {
                storage.setItem('istibdel', JSON.stringify({
                     likes: [],country:null
                }));
                var istibdel = JSON.parse(storage.getItem('istibdel'));
            }
            getFav(istibdel.likes);
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
                    getFav(istibdel.likes);
                });
            }
            /* get category */
            var query = new Category.Query();

            query.doesNotExist('parent')
                .notEqualTo('name', 'أخرى')


                .ascending(['range'])
                .find()
                .then(function (categories) {

                    $timeout(function () {
                        $scope.categories = categories;

                    })
                });
            /*  */

            /* get category childs */
            var cQuery = new Category.Query();

            cQuery.equalTo('parent', $scope.parent)



                .ascending(['range'])
                .find()
                .then(function (categories) {

                    $timeout(function () {
                        $scope.categoriesChilds = categories;

                    })
                });
            /*  */


            /* refresh items */
            var refresh = function () {
                var query = new Annonce.Query();

                query.equalTo('categoryParent', {
                    "__type": "Pointer",
                    "className": "Category",
                    "objectId": $scope.parent.id
                });
                 if ($scope.category) {
                    query.equalTo('category', {
                        "__type": "Pointer",
                        "className": "Category",
                        "objectId": $scope.category.id
                    });
                } 

                
                query.skip(($scope.filters.page - 1) * $scope.filters.pageSize).limit($scope.filters.pageSize)
                if ($scope.filters.search) {
                    query.matches('name', new RegExp($scope.filters.search, 'i'));
                }
                query.descending('isSpecial');
                query.notEqualTo('isArchived',true)
                query.greaterThan('remainingQuantity',0)
                .count().then(function (count) {
                    $scope.$broadcast('total-updated', {
                        total: count,
                        pageSize: $scope.filters.pageSize
                    });
                });
                query.find()
                    .then(function (annonces) {

                        $timeout(function () {
                            $scope.annonces = annonces;
                        })





                    }, function (error) {
                        $rootScope.errorNotif("حدث خطأ في التحميل");
                    });
            };
            /*  */
            /* change parent */
            $scope.changeParent = function (parent) {
                $scope.category=parent;
                refresh();
                $scope.title=parent.name;
            }


            /*  */



            $scope.$watch('filters', refresh, true);
        }
    ]);