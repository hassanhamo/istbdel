angular.module('istibdel.shared')
    .directive('krCounterUp', function () {
        return {
            restrict: 'A',
            scope: { 
                ngModel: '='
            },
            link: function (scope, element, attr) {
                
                var refresh=function(){
                  $(element).html(scope.ngModel);
                $(element).counterUp({
                    delay: 100,
                    time: 1200
                });  
                }
                scope.$watch('ngModel', refresh, true);
            }
        };
    });