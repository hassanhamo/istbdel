angular.module('istibdel.shared')
.directive('rangeSlider',['$timeout', function ($timeout) {
    return {
        restrict: 'A',
        scope: { model: '=?' },
        link: function (scope, element, attr) {
             $(element).rangeslider({
                polyfill: false,
               
                onInit: function () {
                    this.output = $('<div class="range-output" />').insertBefore(this.$range).html(this.$element.val());
                    var radiustext = attr.title;
                    $('.range-output').after('<i class="data-radius-title">' + radiustext + '</i>');
                },
                onSlide: function (position, value) {
                   
                    this.output.html(value);
                    $timeout(function () {
                    scope.model=value;
                   
                   
                    });

                }
            });
 

 
        }
    };
}]);