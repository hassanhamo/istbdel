angular.module('istibdel.configuration', ['ngRoute'])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider
            
            .when('/configurations', {
                templateUrl: '/template/configuration/index',
                controller: 'ConfigurationController',
                resolve: {
                    config: function(Configuration) {
                        var query = new Configuration.Query();
                       
                        return query.first();
                    }
                }
            })
           ;
    }]);