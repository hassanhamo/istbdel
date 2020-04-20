angular.module('b4bhcom.shared')
    .directive('slick', function () {
        return {
            restrict: 'E',
            link: function (scope, element, attr) {
                $(element).slick({
                    centerMode: true,
                    centerPadding: '20%',
                    slidesToShow: 2,
                    responsive: [{
                        breakpoint: 1367,
                        settings: {
                            centerPadding: '15%'
                        }
                    }, {
                        breakpoint: 1025,
                        settings: {
                            centerPadding: '0'
                        }
                    }, {
                        breakpoint: 767,
                        settings: {
                            centerPadding: '0',
                            slidesToShow: 1
                        }
                    }]
                });

                
              
               
            }
        };
    });