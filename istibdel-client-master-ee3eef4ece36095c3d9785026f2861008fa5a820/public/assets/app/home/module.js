angular.module('istibdel.home', ['ngRoute'])
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: '/template/home/index',
                controller: 'HomeController'
            })
            .when('/about', {
                templateUrl: '/template/home/about',
                controller: 'AboutController',
                resolve: {
                    config: function(Configuration) {
                        var query = new Configuration.Query();
                       
                        return query.first();
                    }
                }
            })
            .when('/condition', {
                templateUrl: '/template/home/condition',
                controller: 'AboutController',
                resolve: {
                    config: function(Configuration) {
                        var query = new Configuration.Query();
                       
                        return query.first();
                    }
                }
            })
            .when('/transfer', {
                templateUrl: '/template/home/transferInfo',
                controller: 'AboutController',
                resolve: {
                    config: function(Configuration) {
                        var query = new Configuration.Query();
                       
                        return query.first();
                    }
                }
            });

    }]);