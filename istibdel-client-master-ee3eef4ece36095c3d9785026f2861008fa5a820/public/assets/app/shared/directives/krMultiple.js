angular.module('istibdel.shared')
.directive('krMultiple', function () {
    return  {
        restrict: 'A',
        scope: {
            krMultiple: '='
        },
        link: function (scope, element) {
        
            var unwatch = scope.$watch('krMultiple', function (newValue) {
               
                if(newValue) {
                    element.attr('multiple', 'multiple');
                } else {
                    element.removeAttr('multiple');
                }
            });
        }
    };
});