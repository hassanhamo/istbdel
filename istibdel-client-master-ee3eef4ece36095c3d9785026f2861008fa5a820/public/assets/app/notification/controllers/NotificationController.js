angular.module('istibdel.notification')
    .controller('NotificationController', ['$rootScope','$scope', '$http', '$timeout', '$location',
        function ($rootScope,$scope, $http, $timeout, $location) {
            $scope.notification = {
                device: 'الكل',
                users: 'الكل'
            };
            moment.locale('ar');
            $scope.userMax = 10;
            $scope.notif = function () {
                $location.path('/notifications');
            }
            $scope.deviceChange = function (device) {
                $timeout(function () {
                    $scope.notification.device = device;
                })

            }
            $scope.usersChange = function (users) {
                $timeout(function () {
                    $scope.notification.users = users;
                })

            }
            $scope.send = function () {
                $scope.blockPage.block();
                var order = "desc";
                var fun = "getActiveUser";
                switch ($scope.notification.users) {
                    case 'الأكثر نشاطا':
                        order = 'desc';
                        fun = "getActiveUser";
                        break;
                    case 'الأقل نشاطا':
                        order = 'asc';
                        fun = "getActiveUser";
                        break;
                    case 'الأكثر شراء':
                        order = 'desc';
                        fun = "getPurchaseUser";
                        break;
                    case 'الأقل شراء':
                        order = 'asc';
                        fun = "getPurchaseUser";
                        break;
                    case 'isSale':
                        order = 'desc';
                        fun = "الأكثر بيعا";
                        break;
                    case 'الأقل بيعا':
                        order = 'asc';
                        fun = "getSaleUser";
                        break;
                    case 'الأكثر مشاركة':
                        order = 'desc';
                        fun = "getParticipateUser";
                        break;
                    case 'الأقل مشاركة':
                        order = 'asc';
                        fun = "getParticipateUser";
                        break;
                    default:

                }
                console.log($scope.startDate);
                console.log($scope.endDate);

                Parse.Cloud.run(fun, {
                    order: order,
                    count: $scope.userMax,
                    startDate: $scope.startDate,
                    endDate: $scope.endDate
                }, function (result) {


                   


                        var users = _.map(result, function (item) {
                            return item[0].id;
                        });
                        var query = new Parse.Query(Parse.Installation);
                        if ($scope.notification.users !== 'الكل') {
                            query.containedIn('userId', users);
                        }
                        if ($scope.notification.device == 'أبل') {
                            query.equalTo('deviceType', 'ios');
                        }
                        if ($scope.notification.device == 'أندرويد') {
                            query.equalTo('deviceType', 'android');
                        }
                        Parse.Push.send({
                            where: query,
                            data: {
                                alert: $scope.notification.message,
                                sound: 'default'
                            }
                        }, {
                            useMasterKey: true,
                            success: function () {
                                $timeout(function () {
                                    $scope.blockPage.unblock();
                                    $scope.notification.message = null;
                                    $rootScope.successNotif('تم إرسال الإشعار')
                                });
                            },
                            error: function (error) {
                                $timeout(function () {
                                    $scope.blockPage.unblock();
                                    $rootScope.errorNotif("حدث خطأ في الإرسال");
                                });
                            }
                        });
                    });



               


            };
        }
    ]);