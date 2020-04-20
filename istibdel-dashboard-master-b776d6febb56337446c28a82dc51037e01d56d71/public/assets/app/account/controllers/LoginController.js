angular.module('istibdel.account')
    .controller('LoginController', ['$rootScope', '$scope', '$http', '$location', '$timeout',
        function ($rootScope, $scope, $http, $location, $timeout) {
            

            $scope.login = function () {
                $scope.ui.block();
                $scope.error = false;
                Parse.User.logIn($scope.loginDetails.username, $scope.loginDetails.password).then(function (user) {
                    $scope.ui.unblock();
                    if(user.get("type")=='admin'){
                    $timeout(function () {
                       
                        $rootScope.currentUser = user;
                        $scope.loginDetails = null;
                        window.location.href ='/';
                    });
                    }
                    else{
                         $scope.logout();
                         $timeout(function () {
                         $scope.error = true;
                        });


                    }
                }, function (error) {
                    $timeout(function () {
                        $scope.ui.unblock();
                        $scope.error = error.message;
                    });
                });
            };

            $scope.logout = function () {
                Parse.User.logOut().then(function () {
                    $timeout(function () {
                        $rootScope.currentUser = null;
                      
                        window.location.href ='/account/login';
                    });
                });
            };
        }
        
    ]);