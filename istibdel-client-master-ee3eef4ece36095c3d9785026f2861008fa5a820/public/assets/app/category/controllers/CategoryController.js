angular.module('istibdel.category')
    .controller('CategoryController', ['$rootScope', '$scope', '$http', '$timeout', '$route', 'Category',
        function ($rootScope, $scope, $http, $timeout, $route, Category) {
            /* intial configuration  */
            $scope.filters = {
                page: 1,
                pageSize: 1000

            };
            /*  */
            $scope.category = {};
            var getChilds = function (category) {
                var query = new Category.Query();

                query.equalTo('parent',category)
                   

                
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


            /* refresh items */
            var refresh = function () {
                var query = new Category.Query();

                query.doesNotExist('parent')
                    .notEqualTo('name', 'أخرى')

                if ($scope.filters.search) {
                    query.matches('name', new RegExp($scope.filters.search, 'i'));
                }
                query.skip(($scope.filters.page - 1) * $scope.filters.pageSize).limit($scope.filters.pageSize);
                query.ascending(['range'])
                    .find()
                    .then(function (categories) {
                        console.log(categories);
                        $timeout(function () {
                            $scope.categories = categories;
                            _.each(categories,function(item){
                                getChilds(item);
                            })
                        })





                    }, function (error) {
                        $rootScope.errorNotif("حدث خطأ في التحميل");
                    });
            };
            /*  */



            $scope.$watch('filters', refresh, true);
        }
    ]);