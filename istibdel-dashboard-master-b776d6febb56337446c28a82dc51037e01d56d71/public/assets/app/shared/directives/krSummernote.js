angular.module('bhgate.shared')
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