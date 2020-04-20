angular.module('istibdel.home', ['ngRoute'])
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: '/template/home/index',
                controller: 'HomeController'
            });
    }]);