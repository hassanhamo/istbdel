angular.module('istibdel.shared')
    .directive('deleteBtn', ['$http', '$injector','$timeout', function ($http, $injector,$timeout) {
        return {
            restrict: 'A',
            scope: {
                object: '=deleteBtn',
                array:'='
            },
            link: function (scope, element, attr, ngModel) {
                element.on('click', function () {

                    swal({
                            title: "هل أنت متأكد؟",
                            showCancelButton: true,
                            confirmButtonClass: "bg-red",
                            confirmButtonText: "نعم",
                            cancelButtonText: "إلغاء",
                            closeOnConfirm: false
                        },
                        function () {
                           
                            scope.object.destroy({useMasterKey:true}).then(function (res) {
                                var container = attr.containerId || element.parent();
                                
                                
                                scope.array = _.dropWhile(scope.array, ['id', scope.object.id]);
                                
                                
                            
                                $(container).remove();
                                swal({
                                    title: " تم الحذف",
                                    
                                    type: "success",
                                    timer: 2000,
                                    showConfirmButton:false
                                });
                            }, function (res) {
                                swal({
                                    title: "حدث خطأ!",
                                    type: "error",
                                    timer: 2000,
                                    showConfirmButton:false
                                });
                            });
                        });
                });
            }
        };
    }]);