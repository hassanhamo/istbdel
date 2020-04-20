angular.module('istibdel.shared')
    .directive('krSummernote', function () {
        return {
            restrict: 'E',
            templateUrl: '/template/shared/summernote',
            scope: {
                selectedLanguage: '=',
                model: '='
            }
        };
    });