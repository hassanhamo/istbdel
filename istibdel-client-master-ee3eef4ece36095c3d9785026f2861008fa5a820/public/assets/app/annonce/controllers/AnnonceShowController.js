angular.module('istibdel.annonce')
    .controller('AnnonceShowController', ['$rootScope', '$scope', '$http', '$timeout', '$route', 'Comment', 'Annonce',
        function ($rootScope, $scope, $http, $timeout, $route, Comment, Annonce) {
            /* intial configuration  */
            $scope.annonce = $route.current.locals.annonce;
            $scope.purchaseQuantity=1;
             
            $scope.annonce.increment('viewCount');
            $scope.annonce.save();



            /*  */
             /* get annonces */
             var getAnnonce = function () {
                var query = new Annonce.Query();
               

                query.limit(99999999)
                    .descending(['createdAt'])
                   
                    .equalTo('author',{"__type":"Pointer","className":"_User","objectId":$rootScope.currentUser.objectId} )
                    .greaterThan('remainingQuantity',0)
                    .find()
                    .then(function (annonces) {
                        $timeout(function () {
                            $scope.annonces = annonces;
                           
                            
                        })


                    });
            }
            /*  */
            getAnnonce();


           
            /* get comments */
            var getComment = function () {
                var query = new Comment.Query();
               

                query.limit(99999999)
                    .ascending(['createdAt'])
                    .include('author')
                    .equalTo('annonce', $scope.annonce)
                    .find()
                    .then(function (comments) {
                        $timeout(function () {
                            $scope.comments = comments;
                            $timeout(function(){
                                var objDiv = document.getElementById("c-body");
                                
                                objDiv.scrollTop = objDiv.scrollHeight;
                            })
                            
                        })


                    });
            }
            /*  */
            getComment();

           
            /* add comment */
            $scope.addComment = function (comment,message) {
                
                var object = new Comment();
                object.annonce = $scope.annonce;
               
                object.author ={"__type":"Pointer","className":"_User","objectId":$rootScope.currentUser.objectId} ;
                if (comment) {
                    if(!message){
                        return
                    }
                    object.content = message;
                } else {
                    object.productPurchase = true;
                    object.content = " شراء عدد"+$scope.purchaseQuantity+"  من المنتج بسعر  " + $scope.purchasePrice + " ريال للوحدة الواحدة ";
                    object.price=$scope.purchasePrice;
                    object.quantity=$scope.purchaseQuantity;
                }
                object.save().then(function (c) {
                    $timeout(function () {
                    getComment();
                    $scope.comment=null;
                    });
                }, function (error) {
                    $rootScope.errorNotif("حدث خطأ في التحميل");
                })

            }

            /*  */

             /* add exchange */
             $scope.addExchange = function (annonce) {
                
                $scope.annonce.exchangedAnnonce = $scope.annonce.exchangedAnnonce||[];
                $scope.annonce.exchangedAnnonce.push(annonce);
                $scope.annonce.save().then(function (a) {
                    $rootScope.successNotif("تم إرسال الإستبدال");
                }, function (error) {
                    $rootScope.errorNotif("حدث خطأ في التحميل");
                })

            }

            /*  */

            $scope.quantityChange=function(){
                if($scope.purchaseQuantity>$scope.annonce.remainingQuantity){
                    $scope.purchaseQuantity=$scope.annonce.remainingQuantity||1;
                }
                if($scope.purchaseQuantity<1){
                    $scope.purchaseQuantity=1;
                }
            }


        }
    ]);