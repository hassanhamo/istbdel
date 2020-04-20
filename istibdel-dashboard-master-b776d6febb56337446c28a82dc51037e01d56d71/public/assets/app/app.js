(function () {
    var PARSE_SERVER_URL = 'https://istibdel.parse-server.karizma1.com/parse';
    var PARSE_APP_ID = 'WCfqomGyScI1LUCLmZe83XuXKCyVzdLz';
    var PARSE_MASTER_KEY = 'eB0pJR3f1SGFuFLzHmtOi8MfOVipsEd8';

    Parse.initialize(PARSE_APP_ID, '');
    Parse.serverURL = PARSE_SERVER_URL;
    Parse.masterKey = PARSE_MASTER_KEY; 



    angular.module('istibdel', ['ngResource', 'ngRoute','ui.sortable','slick','ngMap','summernote', 'istibdel.shared', 'istibdel.category', 'istibdel.annonce', 'istibdel.user','istibdel.configuration','istibdel.home','istibdel.account','istibdel.notification'])
        .config(['$locationProvider', '$routeProvider', '$httpProvider','$resourceProvider',
            function ($locationProvider, $routeProvider, $httpProvider,$resourceProvider) {

                $routeProvider
                    .when('error', {
                        templateUrl: '/template/error/index'
                    })
                    .otherwise({
                        redirect: '/error'
                    });

                $locationProvider.html5Mode(true);
               

                $httpProvider.interceptors.push(function ($q, $rootScope) {
                    return {
                        'responseError': function (response) {
                            if (response.status);

                            if (response.data && response.data && response.data.errors) {
                                $rootScope.$emit('validation-errors', response.data.errors);
                            }

                            return $q.reject(response);
                        }
                    };
                });
            }
        ])
        .run(['$rootScope', '$http', '$location', '$timeout',
            function ($rootScope, $http, $location, $timeout) {

                // $http.post(parseServerUrl + '/schemas', {
                //     "_method": "GET",
                //     "_ApplicationId": parseAppId,
                //     "_MasterKey": parseMasterKey
                // }).then(function(res){
                //     $rootScope.Schema = res.data.results;
                //     ParseUtils.registerClasses(res.data.results);
                // });
                $http.defaults.headers.common['X-Angular-Ajax-Request'] = '1';
                
                    $rootScope.$on('$routeChangeStart',
                    function () {
                        if (!Parse.User.current()) {
                            if ($location.path() !== '/account/login') {
                                window.location.href ='/account/login';
                            }
                        } else {
                            $rootScope.currentUser = Parse.User.current();
                             $rootScope.isAuthenticated = true;
                            $rootScope.pageLoading = true;
                           
                        }
                       
                    });

                     $rootScope.$on('$routeChangeSuccess',
                    function () {
                        $rootScope.pageLoading = false;
                    });

                $rootScope.$on('$routeChangeError',
                    function () {
                        $rootScope.pageLoading = false;
                    });


                
                moment.locale('ar-ly');
                $rootScope.successNotif=function(title){
                    swal({
                        title: title,
                        text: "",
                        type: "success",
                        timer: 2000,
                        showConfirmButton:false
                    });
                }
                $rootScope.errorNotif=function(title){
                    swal({
                        title: title,
                        text: "",
                        type: "error",
                        timer: 2000,
                        showConfirmButton:false
                    });
                }



            }
        ])
        ;
        
        


})();