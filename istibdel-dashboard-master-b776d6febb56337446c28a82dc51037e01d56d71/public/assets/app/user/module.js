angular.module('istibdel.user', ['ngRoute'])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider
            
            .when('/users', {
                templateUrl: '/template/user/index',
                controller: 'UserController',
                
            })
            .when('/users/:id', {
                templateUrl: '/template/user/show',
                controller: 'UserShowController',
                resolve: {
                    user: function ($route, User) {
                        return User.get($route.current.params.id);
                    }
                }
            });
    }]);