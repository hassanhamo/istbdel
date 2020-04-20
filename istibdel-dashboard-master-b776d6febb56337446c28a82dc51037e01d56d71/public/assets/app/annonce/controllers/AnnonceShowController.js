angular.module('istibdel.annonce')
    .controller('AnnonceShowController', ['$rootScope', '$scope', '$http', '$timeout', '$route', 'Comment', 'Annonce','Report',
        function ($rootScope, $scope, $http, $timeout, $route, Comment, Annonce,Report) {
            /* intial configuration  */
            $scope.annonce = $route.current.locals.annonce;

            $scope.annonceImage = $scope.annonce.images ? $scope.annonce.images[0] : "assets/images/not-found.jpg";


            /*  */
           /* get comments */
           var query = new Comment.Query();
         
           
           query.limit(99999999)
           .ascending(['createdAt'])
           .include('author')
           .equalTo('annonce',$scope.annonce)
           .find()
           .then(function (comments) {
               $timeout(function () {
                   $scope.comments = comments;
               })

           });
           /*  */
            /* get reports */
            var query = new Report.Query();
           
            
            query.limit(99999999)
            .ascending(['createdAt'])
            .include('user')
            .equalTo('annonce',$scope.annonce)
            .find()
            .then(function (reports) {
                $timeout(function () {
                    $scope.reports = reports;
                })
 
            });
            /*  */
           /* show location */
           $scope.showLocation= function(){
               $timeout(function(){
                   $scope.sLocation=true;
               },300)
           }

           /*  */
            /* change  special */
            $scope.changeSpecial= function(item){
                swal({
                    title: "هل أنت متأكد؟",
                    showCancelButton: true,
                    confirmButtonClass: "bg-red",
                    confirmButtonText: "نعم",
                    cancelButtonText: "إلغاء",
                    closeOnConfirm: true
                },
                function () {
                   $timeout(function(){
                    item.isSpecial=!item.isSpecial;
                    item.save();
                   })
                  
                        
                        
                       
                       
                    });
                
            }
 
            /*  */


        }
    ]);