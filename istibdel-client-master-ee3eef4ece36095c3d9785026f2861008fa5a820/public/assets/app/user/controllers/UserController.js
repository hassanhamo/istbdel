angular.module('istibdel.user')
    .controller('UserController', ['$rootScope', '$scope', '$http', '$timeout', '$route','$location', 'User',
        function ($rootScope, $scope, $http, $timeout, $route,$location, User) {
            /* intial configuration  */
            $scope.filters = {
                page: 1,
                pageSize: 12

            };
            /*  */

            

            /* get count items */
            var countQuery = new User.Query();
            countQuery.count().then(function (count) {
               
                    $scope.$broadcast('total-updated', {
                        total: count,
                        pageSize: $scope.filters.pageSize
                    });

                });
            /*  */

            /* refresh items */
            var refresh = function () {
                var query = new User.Query();
                query.notEqualTo('type','admin');

                query.count().then(function (count) {
                    $timeout(function () {
                   $scope.usersCount=count;
                    });
                        $scope.$broadcast('total-updated', {
                            total: count,
                            pageSize: $scope.filters.pageSize
                        });
                    });
                if($scope.filters.search){
                    query.matches('fullName', new RegExp($scope.filters.search, 'i'));
                    
                }
                
                query.skip(($scope.filters.page - 1) * $scope.filters.pageSize).limit($scope.filters.pageSize);
                query.descending(['createdAt'])
                    .find()
                    .then(function (users) {
                        console.log(users);
                        $timeout(function () {
                            $scope.users = users;
                        })





                    }, function (error) {
                        $rootScope.errorNotif("حدث خطأ في التحميل");
                    });
            };
            /*  */

            /* show user */
           $scope.show = function(id){
             
            $location.path('/users/'+id);
           }
            /*  */

           


            $scope.$watch('filters', refresh, true);
        }
    ]);