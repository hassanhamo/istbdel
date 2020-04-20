angular.module('istibdel.home')
.controller('AboutController', ['$rootScope', '$scope', '$http', '$timeout', '$route', 'Category', 'Tag', 'Annonce',
    function ($rootScope, $scope, $http, $timeout, $route, Category, Tag, Annonce) {
    	$scope.config = $route.current.locals.config ;
        


    }
]);