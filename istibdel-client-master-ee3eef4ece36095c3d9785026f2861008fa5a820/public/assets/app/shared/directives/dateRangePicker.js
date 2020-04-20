angular.module('istibdel.shared')
    .directive('dateRangePicker', ['$http', '$timeout', function ($http, $timeout) {
        return {
            restrict: 'A',
            scope: {
                onRangeChanged: '&?'
            },
            // template: '<div class="input-group">' +
            // '<input type="text" class="form-control" />' +
            // '<span class="input-group-addon">' +
            // '<span class="icon-calendar3"></span>' +
            // '</span>' +
            // '</div>',
            link: function (scope, element, attr) {
                var currentYear = new Date().getFullYear();
                var startDate=new Date('01/01/'+currentYear);
                var endDate=new Date('12/31/'+currentYear);

                element
                    .on('apply.daterangepicker', function (ev, picker) {
                        $timeout(function () {
                            scope.onRangeChanged({ startDate: picker.startDate, endDate: picker.endDate });
                        });
                    })
                    .daterangepicker({
                        locale: {
                          format: 'DD/MM/YYYY'
                        },
                        startDate: startDate,
                        endDate: endDate });
            }
        };
    }]);