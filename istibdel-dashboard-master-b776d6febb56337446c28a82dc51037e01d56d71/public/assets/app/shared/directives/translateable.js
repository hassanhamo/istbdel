angular.module('surek.shared')
    .directive('translateable', function () {
        return {
            restrict: 'C',
            link: function (scope, element, attr) {
                element.tooltip({
                    title: 'هذا الحقل قابل للترجمة',
                    container: 'body'
                });
            }
        };
    });