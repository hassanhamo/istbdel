angular.module('istibdel.shared')
    .directive('krChart', function () {
        return {
            restrict: 'A',
            scope: { 
              labels:'=',
              series:'=',
              unit:'=?'  
            },
            link: function (scope, element, attr) {
                
                new Chartist.Line('#ct-visits', {
                    labels:scope.labels,
                    series:scope.series
                }, {
                    top: 0,
                    low: 1,
                    showPoint: true,
                    fullWidth: true,
                    plugins: [
                        Chartist.plugins.tooltip()
                    ],
                    axisY: {
                        labelInterpolationFnc: function (value) {
                            return (value / 1) + scope.unit;
                        }
                    },
                    showArea: true
                });
            }
        };
    });