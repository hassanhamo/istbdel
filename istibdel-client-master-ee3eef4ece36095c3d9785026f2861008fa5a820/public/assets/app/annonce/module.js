angular.module('istibdel.annonce', ['ngRoute'])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider
            
            .when('/annonces/edit/new', {
                templateUrl: '/template/annonce/edit',
                controller: 'AnnonceEditController',
                
            })
            .when('/annonces/edit/:id', {
                templateUrl: '/template/annonce/edit',
                controller: 'AnnonceEditController',
                resolve: {
                    annonce: function ($route, Annonce) {
                        return Annonce.get($route.current.params.id, 'author,categoryParent','category');
                    }
                }
            })
            .when('/annonces/search' ,{
                templateUrl: '/template/annonce/search',
                controller: 'AnnonceSearchController',
                resolve: {
                    data: function ($route) {
                        return {keyWord:$route.current.params.keyWord,
                            priceMin:$route.current.params.priceMin,
                            priceMax:$route.current.params.priceMax,
                            categoryId:$route.current.params.categoryId,
                            categoryParentId:$route.current.params.categoryParentId,
                            country:$route.current.params.country,
                            locality:$route.current.params.locality};
                    }
                } 
            })
            .when('/annonces/:id', {
                templateUrl: '/template/annonce/show',
                controller: 'AnnonceShowController',
                resolve: {
                    annonce: function ($route, Annonce) {
                        return Annonce.get($route.current.params.id, 'author,categoryParent','category');
                    }
                }
            })
           
           ;
    }]);