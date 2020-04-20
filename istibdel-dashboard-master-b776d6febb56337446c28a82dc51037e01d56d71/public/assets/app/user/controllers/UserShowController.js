angular.module('istibdel.user')
    .controller('UserShowController', ['$rootScope', '$scope', '$http', '$timeout', '$route', 'Comment', 'User','Annonce',
        function ($rootScope, $scope, $http, $timeout, $route, Comment, User,Annonce) {
            /* intial configuration  */
            $scope.user = $route.current.locals.user;
            $scope.isBlocked=!$scope.user.isBlocked;
            var blocked= $scope.isBlocked;
            /*  */

            /* switch function  */
            $scope.blocked= function(){
                $scope.user.isBlocked= !$scope.isBlocked;
                $scope.user.save(null, {
                    useMasterKey: true
                }).then(function(){
                    if ($scope.isBlocked != blocked) {
                        
                        if ($scope.user.isBlocked) {
                            
                            Parse.Cloud.run("sendPush", {
                                type: "5",
                                alert: "لقد تم حظرك ",
                              
                                listUserId: [$scope.user.id]
                            }).then(function (result) {

                            });
                        } else {
                           
                            Parse.Cloud.run("sendPush", {
                                type: "6",
                                alert: "لقد تم رفع حظرك ",
                                
                                listUserId: [$scope.user.id]
                            }).then(function (result) {

                            });
                        }
                    }
                    var blocked=$scope.isBlocked;
                },function(error){
                    $rootScope.errorNotif("حدث خطأ في الحفظ");
                });
            }
            /*  */

             /* set credit user  */
             $scope.setCredit= function(){
                $scope.user.credit=0;
                $scope.user.save(null, {
                    useMasterKey: true
                }).then(function(){
                   
                            
                            Parse.Cloud.run("sendPush", {
                                type: "7",
                                alert: "لقد تم قضاء الدين ",
                              
                                listUserId: [$scope.user.id]
                            }).then(function (result) {

                            });
                       
                           
                },function(error){
                    $rootScope.errorNotif("حدث خطأ في الحفظ");
                });
            }
            /*  */

           /* get comments */
           var query = new Comment.Query();
          
           
           query.limit(99999999)
           .ascending(['createdAt'])
           .include('annonce')
           .equalTo('author', {"__type":"Pointer","className":"_User","objectId":$scope.user.id})
           .find()
           .then(function (comments) {
               $timeout(function () {
                   $scope.comments = comments;
               })

           });
           /*  */

            /* get annonces */
            var query = new Annonce.Query();
            
             
             query.limit(99999999)
             .descending(['createdAt'])
             .equalTo('author', {"__type":"Pointer","className":"_User","objectId":$scope.user.id})
             .find()
             .then(function (annonces) {
                 $timeout(function () {
                     $scope.annonces = annonces;
                 })
  
             });
             /*  */
           


        }
    ]);