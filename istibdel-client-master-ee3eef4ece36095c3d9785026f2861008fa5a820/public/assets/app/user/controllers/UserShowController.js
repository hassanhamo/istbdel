angular.module('istibdel.user')
    .controller('UserShowController', ['$rootScope', '$scope', '$http', '$timeout', '$route', 'Comment', 'User','Annonce','Payment',
        function ($rootScope, $scope, $http, $timeout, $route, Comment, User,Annonce,Payment) {
            /* intial configuration  */
            $scope.config = $route.current.locals.config ;
            $scope.user = $route.current.locals.user;
            $scope.config.currencyConverter=$scope.config.currencyConverter||1;
            $scope.user.credit=$scope.user.credit||0;

            $scope.creditUSD=(Math.round(($scope.config.currencyConverter * $scope.user.credit)*100)/100).toString();
           
           $scope.tab= $route.current.locals.tab||1;
           if ($scope.user.id) {
            if ($scope.user.avatar) {
                $scope.imagesQueue =  [{
                        name: 'av',
                        url: $scope.user.avatar,
                        state: 'uploaded'
                    }];
                
            }

        }
        $scope.fileUploaded = function (fileInfo, object) {

            $scope.user.avatar=fileInfo.url;
        };

        $scope.fileRemoved = function (fileInfo, index) {
            $scope.user.avatar=null;
        };

         /* get fav annonces */
         var getFav = function (likes) {
            var query = new Annonce.Query();
            
             
             query.limit(99999999)
             .descending(['createdAt'])
             .containedIn('objectId', istibdel.likes)
             .find()
             .then(function (annonces) {
                 $timeout(function () {
                     $scope.favAnnonces = annonces;
                     $scope.favCount=annonces.length;
                    
                 })
  
             });
            }
             /*  */

           /* get fav */
           var storage = window.localStorage;
           if (storage.getItem('istibdel')) {
               var istibdel = JSON.parse(storage.getItem('istibdel'));
           } else {
               storage.setItem('istibdel', JSON.stringify({
                   likes: []
               }));
               var istibdel = JSON.parse(storage.getItem('istibdel'));
           }
          
           getFav(istibdel.likes);

           $scope.isLike = function (annonce) {
            
                            var likes = istibdel.likes;
                            if (likes.indexOf(annonce.id) >= 0) {
                                return 'col-red';
                            } else {
                                return '';
                            }
                        }
                        $scope.like = function (annonce) {
                            $timeout(function () {
                                var likes = istibdel.likes;
                                if (likes.indexOf(annonce.id) >= 0) {
                                    likes[likes.indexOf(annonce.id)] = null;
                                    likes = _.filter(likes, function (item) {
                                        return item;
                                    });
                                } else {
                                    likes.push(annonce.id);
                                }
            
                                storage.setItem('istibdel', JSON.stringify({
                                    likes: likes
                                }));
                                getFav(istibdel.likes);
                            });
                        }
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
                     $scope.annonceCount=annonces.length;
                     var purchase =_.filter(annonces,function(item){
                         return item.purchases || item.exchange; 
                     })
                 })
  
             });
             /*  */
            
           $scope.save=function(){
               $scope.user.save(null,{useMasterKey:true}).then(function(){
                $rootScope.successNotif("تم الحفظ");
            },function(error){
                $rootScope.errorNotif("حدث خطأ في الحفظ");
            })
           }


           /* paypal */
           paypal.Button.render({

            // Pass the client ids to use to create your transaction on sandbox and production environments
            env: 'sandbox',
            client: {
                sandbox:    'AWIzBYAMpg-Qc_LnPYbSJuubCwFIH14BLt0TspNqWh4bh4brPj6sdwC0TZ_tWBUa8XyNw_SbQYxA0I7c', // from https://developer.paypal.com/developer/applications/
                production: 'AWIzBYAMpg-Qc_LnPYbSJuubCwFIH14BLt0TspNqWh4bh4brPj6sdwC0TZ_tWBUa8XyNw_SbQYxA0I7c'  // from https://developer.paypal.com/developer/applications/
            },
    
            // Pass the payment details for your transaction
            // See https://developer.paypal.com/docs/api/payments/#payment_create for the expected json parameters
    
            payment: function(data, actions) {
                return actions.payment.create({
                    transactions: [
                        {
                            amount: {
                                total:    $scope.creditUSD,
                                currency: 'USD'
                            }
                        }
                    ]
                });
            },
    
            // Display a "Pay Now" button rather than a "Continue" button
    
            commit: true,
    
            // Pass a function to be called when the customer completes the payment
    
            onAuthorize: function(data, actions) {
                return actions.payment.execute().then(function(response) {
                    console.log('The payment was completed!');
                    $timeout(function(){
                        $scope.infoCredit.hide();
                        var object = new Payment();
                        object.user=$scope.user;
                        object.transactionId=response.id;
                        object.credit=$scope.user.credit;
                        object.save();
                        $scope.user.credit=0;
                        $scope.user.save();
                        $rootScope.successNotif("تم الإستخلاص");
                    })
                   
                });
            },
    
            // Pass a function to be called when the customer cancels the payment
    
            onCancel: function(data) {
                console.log('The payment was cancelled!');
            }
    
        }, '#paypal');
           /*  */


        }
    ]);