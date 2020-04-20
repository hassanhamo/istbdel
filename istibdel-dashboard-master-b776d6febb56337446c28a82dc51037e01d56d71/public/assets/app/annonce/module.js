angular.module('istibdel.annonce', ['ngRoute'])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider
            
            .when('/annonces', {
                templateUrl: '/template/annonce/index',
                controller: 'AnnonceController',
                
            })
            .when('/annonces/:id', {
                templateUrl: '/template/annonce/show',
                controller: 'AnnonceShowController',
                resolve: {
                    annonce: function ($route, Annonce) {
                        return Annonce.get($route.current.params.id, 'author,category');
                    }
                }
            });
    }]);