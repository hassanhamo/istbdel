angular.module('istibdel.account', ['ngRoute'])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider
            .when('/account/login', {
                templateUrl: '/template/account/login',
                controller: 'LoginController'
            });
    }]);