angular.module('istibdel.shared')
    .directive('krModal',['$timeout', function ($timeout) {
        return {
            restrict: 'A',
            link: function (scope, element, attr) {
                scope[attr.krModal] = {
                    show: function() {
                        $(element).modal('show');
                        },
                    
                    hide: function(){
                        $(element).modal('hide');
                       
                        
                       
                    }
                };
            }
        };
    }]);