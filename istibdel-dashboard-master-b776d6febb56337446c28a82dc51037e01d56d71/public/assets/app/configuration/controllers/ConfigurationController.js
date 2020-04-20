angular.module('istibdel.configuration')
    .controller('ConfigurationController', ['$rootScope', '$scope', '$http', '$timeout', '$route', 'Configuration',
        function ($rootScope, $scope, $http, $timeout, $route, Configuration) {


            /* intial configuration  */
            $scope.config = $route.current.locals.config || new Configuration();

            /*  */



            /* save item */

            $scope.save = function () {
                $scope.blockPage.block();
                Parse.Cloud.run('putConfig', {data:{ ios_maintenance_mode: $scope.config.maintenance ,android_maintenance_mode: $scope.config.maintenance }

                }, function (result) {



                    $scope.config.save(null, {
                        useMasterKey: true
                    }).then(function () {
                        $scope.blockPage.unblock();

                        $rootScope.successNotif('تم الحفظ');



                    }, function (error) {
                        $scope.blockPage.unblock();

                        $scope.config.revert();
                        $rootScope.errorNotif("حدث خطأ في الحفظ ");

                    });


                });



            };
            /*  */



        }
    ]);