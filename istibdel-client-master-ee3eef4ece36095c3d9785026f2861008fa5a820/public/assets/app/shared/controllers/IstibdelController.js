angular.module('istibdel.shared')
  .controller('IstibdelController', ['$rootScope', '$scope', '$http', '$timeout','$location', 
    function ($rootScope,$scope, $http,$timeout,$location,$translate) {
     
     $scope.logout = function () {
     	 $http.get('/account/logout')
        .then(function (res) {
           
            document.location.href = '/';

        },
        function (res) {
            $scope.error = res.data.error;
           
        }).$promise;
               
            };




    }
  ]);