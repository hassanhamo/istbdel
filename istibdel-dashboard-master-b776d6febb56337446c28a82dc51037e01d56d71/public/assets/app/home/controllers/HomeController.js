angular.module('istibdel.home')
    .controller('HomeController', ['$rootScope', '$scope', '$http', '$timeout', '$route',
        function ($rootScope, $scope, $http, $timeout, $route) {





            var currentYear = new Date().getFullYear();
            $scope.filters = {
                year: currentYear
            };

            $scope.installationGroupBy = 'months';
            $scope.inscriptionGroupBy = 'months';
            $scope.purchaseGroupBy = 'months';
            $scope.exchangeGroupBy = 'months';
            $scope.annonceGroupBy = 'days';
            $scope.userFilter='isActive';
            $scope.userMax=10;
            $scope.annonceFilter='isSeen';
            $scope.annonceMax=10;
           

            $scope.changeInstallationFilter = function (groupBy) {
                $scope.installationGroupBy = groupBy;
                refreshInstallationsChart();
            }; $scope.changeInscriptionFilter = function (groupBy) {
                $scope.inscriptionGroupBy = groupBy;
                refreshInscriptionsChart();
            };
            $scope.changePurchaseFilter = function (groupBy) {
                $scope.purchaseGroupBy = groupBy;
                refreshPurchasesChart();
            };
            $scope.changeExchangeFilter = function (groupBy) {
                $scope.exchangeGroupBy = groupBy;
                refreshExchangesChart();
            };
            $scope.changeAnnonceFilter = function (groupBy) {
                $scope.annonceGroupBy = groupBy;
                refreshAnnoncesChart();
            };
            $scope.changeUserFilter = function (filter) {
                $scope.userFilter = filter;
                refreshUsersChart();
            };
            $scope.changeAnnonceStatFilter = function (filter) {
                $scope.annonceFilter = filter;
                refreshAnnoncesStats();
            };

            $scope.evaluationsFilters = {
                year: currentYear
            };

            var addFilters = function (query) {
                if ($scope.startDate) {
                    query.greaterThanOrEqualTo('createdAt', $scope.startDate);
                }
                if ($scope.endDate) {
                    query.lessThanOrEqualTo('createdAt', $scope.endDate);
                }
            };


            var refreshInstallationsChart = function () {

                Parse.Cloud.run('GetInstallationStats', {
                    groupBy: $scope.installationGroupBy,
                    startDate: $scope.startDate,
                    endDate: $scope.endDate
                }, function (result) {


                    $timeout(function () {
                        $scope.iosInstallationsCount = _.sumBy(result.iosValue, function (item) {
                            return item;
                        });
                        $scope.androidInstallationsCount = _.sumBy(result.androidValue, function (item) {
                            return item;
                        });
                        $scope.installationsCount = result.count;
                    });

                    var lineChartData = {
                        labels: result.labels,
                        datasets: [{
                                label: "Ios",
                                backgroundColor: "rgba(220,220,220,0.2)",
                                borderColor: "rgba(220,220,220,1)",
                                pointBackgroundColor: "rgba(220,220,220,1)",
                                pointBorderColor: "#fff",
                                pointHoverBackgroundColor: "#fff",
                                pointHoverBorderColor: "rgba(220,220,220,1)",
                                data: result.iosValue
                            },
                            {
                                label: "Android",
                                backgroundColor: "rgba(49, 157, 181,0.2)",
                                borderColor: "#319DB5",
                                pointBackgroundColor: "#319DB5",
                                pointBorderColor: "#fff",
                                pointHoverBackgroundColor: "#fff",
                                pointHoverBorderColor: "#319DB5",
                                data: result.androidValue
                            }
                        ]
                    }
                    
                    var ctx = document.getElementById("installation_statistics").getContext("2d");
                    
                    var myLineChart = new Chart(ctx, {
                        type: 'line',
                        data: lineChartData,
                        options: {
                            scales: {
                                xAxes: [{
                                    gridLines: {
                                        color: 'rgba(0,0,0,0.05)'
                                    }
                                }],
                                yAxes: [{
                                    gridLines: {
                                        color: 'rgba(0,0,0,0.05)'
                                    }
                                }]
                            },
                            legend: {
                                display: false
                            },
                            tooltips: {
                                cornerRadius: 0
                            }
                        }
                    });
                });
            };

            var refreshInscriptionsChart = function () {

                Parse.Cloud.run('GetInscriptionStats', {
                    groupBy: $scope.inscriptionGroupBy,
                    startDate: $scope.startDate,
                    endDate: $scope.endDate
                }, function (result) {


                    $timeout(function () {


                        $scope.inscriptionsCount = result.count;
                    });

                    var lineChartData = {
                        labels: result.labels,
                        datasets: [

                            {
                                label: "التسجيلات",
                                backgroundColor: "rgba(49, 157, 181,0.2)",
                                borderColor: "#319DB5",
                                pointBackgroundColor: "#319DB5",
                                pointBorderColor: "#fff",
                                pointHoverBackgroundColor: "#fff",
                                pointHoverBorderColor: "#319DB5",
                                data: result.usersValue
                            }
                        ]
                    }
                    var ctx = document.getElementById("inscription_statistics").getContext("2d");
                    var myLineChart = new Chart(ctx, {
                        type: 'line',
                        data: lineChartData,
                        options: {
                            scales: {
                                xAxes: [{
                                    gridLines: {
                                        color: 'rgba(0,0,0,0.05)'
                                    }
                                }],
                                yAxes: [{
                                    gridLines: {
                                        color: 'rgba(0,0,0,0.05)'
                                    }
                                }]
                            },
                            legend: {
                                display: false
                            },
                            tooltips: {
                                cornerRadius: 0
                            }
                        }
                    });
                });
            };

            var refreshPurchasesChart = function () {

                Parse.Cloud.run('GetPurchaseStats', {
                    groupBy: $scope.purchaseGroupBy,
                    startDate: $scope.startDate,
                    endDate: $scope.endDate
                }, function (result) {


                    $timeout(function () {


                        $scope.purchasesCount = result.count;
                    });

                    var lineChartData = {
                        labels: result.labels,
                        datasets: [

                            {
                                label: "المبيعات",
                                backgroundColor: "rgba(49, 157, 181,0.2)",
                                borderColor: "#319DB5",
                                pointBackgroundColor: "#319DB5",
                                pointBorderColor: "#fff",
                                pointHoverBackgroundColor: "#fff",
                                pointHoverBorderColor: "#319DB5",
                                data: result.purchasesValue
                            }
                        ]
                    }
                    var ctx = document.getElementById("purchase_statistics").getContext("2d");
                    var myLineChart = new Chart(ctx, {
                        type: 'line',
                        data: lineChartData,
                        options: {
                            scales: {
                                xAxes: [{
                                    gridLines: {
                                        color: 'rgba(0,0,0,0.05)'
                                    }
                                }],
                                yAxes: [{
                                    gridLines: {
                                        color: 'rgba(0,0,0,0.05)'
                                    }
                                }]
                            },
                            legend: {
                                display: false
                            },
                            tooltips: {
                                cornerRadius: 0
                            }
                        }
                    });
                });
            };

            var refreshExchangesChart = function () {

                Parse.Cloud.run('GetExchangeStats', {
                    groupBy: $scope.exchangeGroupBy,
                    startDate: $scope.startDate,
                    endDate: $scope.endDate
                }, function (result) {


                    $timeout(function () {


                        $scope.exchangesCount = result.count;
                    });

                    var lineChartData = {
                        labels: result.labels,
                        datasets: [

                            {
                                label: "الإستبدلات",
                                backgroundColor: "rgba(49, 157, 181,0.2)",
                                borderColor: "#319DB5",
                                pointBackgroundColor: "#319DB5",
                                pointBorderColor: "#fff",
                                pointHoverBackgroundColor: "#fff",
                                pointHoverBorderColor: "#319DB5",
                                data: result.exchangesValue
                            }
                        ]
                    }
                    var ctx = document.getElementById("exchange_statistics").getContext("2d");
                    var myLineChart = new Chart(ctx, {
                        type: 'line',
                        data: lineChartData,
                        options: {
                            scales: {
                                xAxes: [{
                                    gridLines: {
                                        color: 'rgba(0,0,0,0.05)'
                                    }
                                }],
                                yAxes: [{
                                    gridLines: {
                                        color: 'rgba(0,0,0,0.05)'
                                    }
                                }]
                            },
                            legend: {
                                display: false
                            },
                            tooltips: {
                                cornerRadius: 0
                            }
                        }
                    });
                });
            };

            var refreshCategoriesChart = function () {

                Parse.Cloud.run('GetCategoriesStats', {

                    startDate: $scope.startDate,
                    endDate: $scope.endDate
                }, function (result) {



                    $timeout(function () {
                        $scope.categoriesLabels = result.labels;

                        $scope.annoncesCount = result.count;
                    });
                    var backgroundColor = [];
                    var hoverBackgroundColor = [];
                    _.each(result.categoriesValue, function (val) {
                        var v1 = Math.round(Math.random() * 255);
                        var v2 = Math.round(Math.random() * 255);
                        var v3 = Math.round(Math.random() * 255);
                        backgroundColor.push("rgba(" + v1 + ", " + v2 + ", " + v3 + ",0.9)");
                        hoverBackgroundColor.push("rgba(" + v1 + ", " + v2 + ", " + v3 + ",1)");
                    });
                    console.log(backgroundColor);

                    var pieData = {
                        labels: result.labels,
                        datasets: [{
                            data: result.categoriesValue,
                            backgroundColor: backgroundColor,
                            hoverBackgroundColor: hoverBackgroundColor
                        }]
                    };


                    var ctx = document.getElementById("categories_statistics").getContext("2d");
                    var myPieChart = new Chart(ctx, {
                        type: 'polarArea',
                        data: pieData,
                        options: {
                            legend: {
                                display: true
                            },
                        }
                    });

                });
            };

            var refreshAnnoncesChart = function () {

                Parse.Cloud.run('GetAnnonceStats', {
                    groupBy: $scope.annonceGroupBy,
                    startDate: $scope.startDate,
                    endDate: $scope.endDate
                }, function (result) {


                    $timeout(function () {


                        $scope.annoncesCount = result.count;
                    });
                    var barChartData = {
                        labels: result.labels,
                        datasets: [{
                            label: 'للإستبدال',
                            backgroundColor: "rgba(123, 54, 181,1)",
                           
                            data: result.isExchangeValue
                        }, {
                            label: 'للبيع',
                            backgroundColor: "rgba(244, 23, 181,1)",
                            
                            data: result.notExchangeValue
                        }, {
                            label: 'جديد',
                            backgroundColor: "rgba(200, 100, 181,1)",
                           
                            data: result.isNewValue
                        }, {
                            label: 'مستعمل',
                            backgroundColor: "rgba(100, 23, 100,1)",
                           
                            data: result.notNewValue
                        }]
                    };

                    var ctx = document.getElementById("annonce_statistics").getContext("2d");
                    window.myBar = new Chart(ctx, {
                        type: 'bar',
                        data: barChartData
                    });


                });
            };

            var refreshUsersChart = function () {
                var order="desc";
                var fun ="getActiveUser";
               switch($scope.userFilter){
                   case 'isActive':
                   order='desc';
                   fun ="getActiveUser";
                   break;
                   case 'notActive':
                   order='asc';
                   fun ="getActiveUser";
                   break;
                   case 'isPurchase':
                   order='desc';
                   fun ="getPurchaseUser";
                   break;
                   case 'notPurchase':
                   order='asc';
                   fun ="getPurchaseUser";
                   break;
                   case 'isSale':
                   order='desc';
                   fun ="getSaleUser";
                   break;
                   case 'notSale':
                   order='asc';
                   fun ="getSaleUser";
                   break;
                   case 'isParticipate':
                   order='desc';
                   fun ="getParticipateUser";
                   break;
                   case 'notParticipate':
                   order='asc';
                   fun ="getParticipateUser";
                   break;
                   default:
                   
               }

                    Parse.Cloud.run(fun, {
                        order:order, 
                        count:$scope.userMax,
                        startDate: $scope.startDate,
                        endDate: $scope.endDate
                    }, function (result) {
    
    
                        $timeout(function () {
    
    
                            $scope.users = result;
                        });
                       
    
    
                    });

                
            };

            var refreshAnnoncesStats = function () {
                var order="desc";
                var fun ="getSeenAnnonces";
               switch($scope.annonceFilter){
                   case 'isSeen':
                   order='desc';
                   fun ="getSeenAnnonces";
                   break;
                   case 'notSeen':
                   order='asc';
                   fun ="getSeenAnnonces";
                   break;
                   case 'isNew':
                   order='desc';
                   fun ="getNewAnnonces";
                   break;
                   case 'isPurchase':
                   order='desc';
                   fun ="getNewPurchaseAnnonces";
                   break;
                   
                   case 'isExchange':
                   order='desc';
                   fun ="getNewExchangeAnnonces";
                   break;
                   
                   default:
                   
               }

                    Parse.Cloud.run(fun, {
                        order:order, 
                        count:$scope.annonceMax,
                        startDate: $scope.startDate,
                        endDate: $scope.endDate
                    }, function (result) {
    
    
                        $timeout(function () {
    
    
                            $scope.annonces = result;
                        });
                       
    
    
                    });

                
            };

           

           

            var refresh = function () {


                refreshInstallationsChart();
                refreshInscriptionsChart();
                refreshPurchasesChart();
                refreshExchangesChart();
                refreshCategoriesChart();
                refreshAnnoncesChart();
                refreshUsersChart();
                refreshAnnoncesStats();
                
            };

            $scope.startDate = moment().startOf('year').toDate();
            $scope.endDate = moment().endOf('year').toDate();

            $scope.years = _.chain(_.range(1, 5)).map(function (n) {
                return currentYear - n;
            }).value();

            $scope.dateRangeChanged = function (startDate, endDate) {
                $scope.selectedRange = 'مخصص';
                $scope.startDate = startDate.toDate();
                $scope.endDate = endDate.toDate();
            };

            $scope.selectRange = function (rangeLabel, range) {
                if (range) {
                    $scope.selectedRange = rangeLabel;
                    $scope.startDate = range[0] ? range[0].toDate() : '';
                    $scope.endDate = range[1] ? range[1].toDate() : '';

                }
            };

            $scope.ranges = {
                'اليوم': [moment(), moment()],
                'أمس': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
                'هذا الأسبوع': [moment().startOf('week'), moment().endOf('week')],
                'هذا الشهر': [moment().startOf('month'), moment().endOf('month')],
                'الشهر الفارط': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
                'هذه السنة': [moment().startOf('year'), moment().endOf('year')],
                'الكل': [moment("20170101", "YYYYMMDD"), moment().endOf('year')]

            };

            $scope.selectedRange = 'هذه السنة';

            $scope.$watch('startDate', function () {
                refresh();
            });

           

           

            // TODO: REMOVE DOM ACCESS FROM CONTROLLER -> Create a directive
            function showChartTooltip(x, y, xValue, yValue) {
                $('<div id="tooltip" class="chart-tooltip">' + yValue + '<\/div>').css({
                    position: 'absolute',
                    display: 'none',
                    top: y - 10,
                    left: x - 10,
                    border: '0px solid #ccc',
                    padding: '2px 6px',
                    'background-color': '#fff'
                }).appendTo('body').fadeIn(200);
            }
            var previousPoint = null;
            $('#installation_statistics, #users_statistics').bind('plothover', function (event, pos, item) {
                $('#x').text(pos.x.toFixed(2));
                $('#y').text(pos.y.toFixed(2));
                if (item) {
                    if (previousPoint != item.dataIndex) {
                        previousPoint = item.dataIndex;
                        $('#tooltip').remove();
                        var x = item.datapoint[0].toFixed(2),
                            y = item.datapoint[1].toFixed(2);
                        showChartTooltip(item.pageX, item.pageY, item.datapoint[0], item.datapoint[1] + '');
                    }
                }
            });

            $('#installation_statistics, #users_statistics').bind('mouseleave', function () {
                $('#tooltip').remove();
            });


        }
    ]);