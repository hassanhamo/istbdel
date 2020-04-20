angular.module('istibdel.category', ['ngRoute'])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider
            
            .when('/categories', {
                templateUrl: '/template/category/index',
                controller: 'CategoryController',
                
            })
            .when('/categories/:id', {
                templateUrl: '/template/category/childs',
                controller: 'CategoryChildsController',
                resolve: {
                    category: function ($route, Category) {
                        return Category.get($route.current.params.id, '');
                    }
                }
                
            });
    }]);