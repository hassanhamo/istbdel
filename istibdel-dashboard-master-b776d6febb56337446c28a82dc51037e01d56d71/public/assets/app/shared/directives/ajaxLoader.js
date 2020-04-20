angular.module('surek.shared')
    .directive('ajaxLoader', function () {
        return {
            restrict: 'E',
            template: '<center>Loading...</center>'
        };
    });