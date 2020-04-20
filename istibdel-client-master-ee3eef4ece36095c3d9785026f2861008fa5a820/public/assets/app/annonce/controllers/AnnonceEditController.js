angular.module('istibdel.annonce')
    .controller('AnnonceEditController', ['$rootScope', '$scope', '$http', '$location', '$timeout', '$route', 'Category', 'Annonce', 'Configuration', 'Tag',
        function ($rootScope, $scope, $http, $location, $timeout, $route, Category, Annonce, Configuration, Tag) {
            $scope.annonce = $route.current.locals.annonce || new Annonce();
            $scope.annonce.tags = $scope.annonce.tags || [];
            $scope.annonce.images = $scope.annonce.images || [];
            $scope.annonce.quantity = $scope.annonce.quantity || 1;


            var query = new Configuration.Query();
            query.first().then(function (config) {
                $timeout(function () {

                    $scope.conditionUse = config.conditionUse;
                });
            });
            if (!$route.current.locals.annonce) {
                $scope.annonce.isExchange = true;
                $scope.annonce.location = $scope.annonce.location || new Parse.GeoPoint({
                    latitude: 40.0,
                    longitude: -30.0
                });
            }
            if ($scope.annonce.id) {
                if ($scope.annonce.images) {
                    $scope.imagesQueue = _.map($scope.annonce.images, function (img, index) {
                        return {
                            name: index.toString(),
                            url: img,
                            state: 'uploaded'
                        };
                    });
                }

            }
            $scope.fileUploaded = function (fileInfo, object) {

                $scope.annonce.images.push(fileInfo.url);
            };

            $scope.fileRemoved = function (fileInfo, index) {
                $scope.annonce.images = _.dropWhile($scope.annonce.images, function (item) {
                    return item == fileInfo.url;
                });
            };
            $scope.fileError = function (error, data) {
                if (error = 'max file') {
                    $rootScope.errorNotif("الحد الاقصى للصور هو " + data.max + " صور");
                }


            }
            $scope.category = {};
            /* get childs */
            var getChilds = function (category) {
                var query = new Category.Query();

                query.equalTo('parent', category)



                    .find()
                    .then(function (categories) {
                        console.log(categories);
                        $timeout(function () {
                            $scope.category[category.id] = categories;
                        })





                    }, function (error) {
                        $rootScope.errorNotif("حدث خطأ في التحميل");
                    });

            }
            /*  */
            /* get categories */

            var categQuery = new Category.Query();
            categQuery.doesNotExist('parent')
                .notEqualTo('name', 'أخرى')
                .find()
                .then(function (categories) {
                    $timeout(function () {
                        $scope.categories = categories;
                        _.each(categories, function (item) {
                            getChilds(item);
                        })
                    })

                });
            /*  */

            /* select category */
            $scope.selectCategory = function (parent, child) {
                $scope.annonce.category = child;
                $scope.annonce.categoryParent = parent;
            }
            /*  */

            $scope.locationChange = function (location, country, locality) {
                console.log(country);
                console.log(locality);
                $timeout(function () {
                    $scope.annonce.location.latitude = location.lat();
                    $scope.annonce.location.longitude = location.lng();
                    $scope.annonce.country = country;
                    $scope.annonce.locality = locality;
                })

            }

            $scope.getTags = function () {
                var tagsQuery = new Tag.Query();
                tagsQuery.matches('title', new RegExp($scope.tag, 'i'))
                    .limit(5)
                    .find().then(function (tags) {
                        $timeout(function () {
                            $scope.tags = tags;
                        })

                    }, function (error) {

                    })
            }

            $scope.addTag = function (tag) {
                if (tag || $scope.tag) {
                    $timeout(function () {
                        $scope.annonce.tags.push(tag || $scope.tag);
                        $scope.tag = "";
                    })
                }



            }
            $scope.deleteTag = function (tag) {

                $timeout(function () {
                    $scope.annonce.tags = _.filter($scope.annonce.tags, function (item) {
                        return item != tag;
                    })

                })


            }

            $scope.save = function () {
                $scope.annonce.author = {
                    "__type": "Pointer",
                    "className": "_User",
                    "objectId": $rootScope.currentUser.objectId
                };
                $scope.annonce.remainingQuantity = $scope.annonce.remainingQuantity >= 0 ? $scope.annonce.remainingQuantity : $scope.annonce.quantity;
                $scope.annonce.save().then(function (annonce) {
                    $scope.annonce = annonce;
                    console.log(annonce.id);
                    document.location.href = '/annonces/' + annonce.id;
                    //$rootScope.successNotif("تم الحفظ");

                }, function (error) {
                    $rootScope.errorNotif("حدث خطأ في الحفظ");
                })
            }

            $scope.delete = function (archived) {
                swal({
                        title: "هل أنت متأكد؟",
                        showCancelButton: true,
                        confirmButtonClass: "bg-red",
                        confirmButtonText: "نعم",
                        cancelButtonText: "إلغاء",
                        closeOnConfirm: false
                    },
                    function () {

                        $scope.annonce.isArchived = archived || false;
                        $scope.annonce.save().then(function () {

                            $rootScope.successNotif("تم الحذف");
                            $location.path('/users/' + $rootScope.currentUser.objectId);
                        }, function (res) {
                            $rootScope.errorNotif("حدث خطأ في الحذف");
                        });
                    });

            }
            $scope.quantityChange = function () {
                if ($scope.annonce.quantity > 1) {
                    $timeout(function () {
                        $scope.annonce.isExchange = false;
                    })
                }
            }


            $scope.$watch('tag', $scope.getTags, true);
        }





    ]);