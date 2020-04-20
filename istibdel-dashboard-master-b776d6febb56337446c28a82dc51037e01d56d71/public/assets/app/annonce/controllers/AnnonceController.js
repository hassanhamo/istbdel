angular.module('istibdel.annonce')
    .controller('AnnonceController', ['$rootScope', '$scope', '$http', '$timeout', '$route', 'Category','Annonce',
        function ($rootScope, $scope, $http, $timeout, $route, Category,Annonce) {
            /* intial configuration  */
            $scope.filters = {
                page: 1,
                pageSize: 12

            };
            /*  */

             /* get categories */
             var categQuery = new Category.Query();
             categQuery.notEqualTo('name','أخرى')
             .find()
             .then(function (categories) {
                 $timeout(function () {
                     $scope.categories = categories;
                 })

             });
             /*  */

          

            /* refresh items */
            var refresh = function () {
                var query = new Annonce.Query();

              
                if($scope.filters.search){
                    var name =new Annonce.Query();
                    var description =new Annonce.Query();
                    name.matches('name', new RegExp($scope.filters.search, 'i'));
                    description.matches('annonceDescription', new RegExp($scope.filters.search, 'i'));
                    query = Parse
                    .Query
                    .or
                    .apply(null, [name,description]);
                    
                }
                if($scope.filters.category){
                    query.equalTo('category',$scope.filters.category);
                }

                query.count().then(function (count) {
                   
                    $scope.$broadcast('total-updated', {
                        total: count,
                        pageSize: $scope.filters.pageSize
                    });
                });
                query.skip(($scope.filters.page - 1) * $scope.filters.pageSize).limit($scope.filters.pageSize);
                query.descending(['createdAt'])
                    .find()
                    .then(function (annonces) {
                        console.log(annonces);
                        $timeout(function () {
                            $scope.annonces = annonces;
                        })





                    }, function (error) {
                        $rootScope.errorNotif("حدث خطأ في التحميل");
                    });
            };
            /*  */

            /* category dropdown */
            $scope.categoryChange=function(item){
                $scope.filters.category=item;
            }
            /*  */

           


            $scope.$watch('filters', refresh, true);
        }
    ]);