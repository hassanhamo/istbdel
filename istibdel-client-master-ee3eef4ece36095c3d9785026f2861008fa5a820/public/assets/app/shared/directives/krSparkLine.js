angular.module('istibdel.shared')
    .directive('krSparkLine', function () {
        return {
            restrict: 'A',
            
            
            link: function (scope, element, attr) {
                
               $(element).sparkline([0, 5, 6, 10, 9, 12, 4, 9], {
                        type: 'bar',
                        height: '30',
                        barWidth: '4',
                        resize: true,
                        barSpacing: '5',
                        barColor: attr.barColor
                    });
            }
        };
    });