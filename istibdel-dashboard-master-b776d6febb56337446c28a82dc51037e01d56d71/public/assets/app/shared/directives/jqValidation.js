angular.module('surek.shared')
    .directive('jqValidation', function () {
        return {
            restrict: 'A',
            link: function (scope, element, attr) {
                element.validate();
            }
        };
    });