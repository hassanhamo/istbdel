angular.module('istibdel.shared')
    .directive('krSquareImage', function() {
        return {
            restrict: 'A',
            link: function(scope, element, attr) {
                attr.$observe('krSquareImage', function(v){
                    if (v){
                        element.css('background-image', 'url(' + v + ')');
                    }
                });
            }
        };
    });