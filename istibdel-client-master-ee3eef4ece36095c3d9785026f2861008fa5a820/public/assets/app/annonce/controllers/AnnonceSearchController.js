angular.module('istibdel.annonce')
    .controller('AnnonceSearchController', ['$rootScope', '$scope', '$http', '$timeout', '$route', 'Category', 'Tag', 'Annonce',
        function ($rootScope, $scope, $http, $timeout, $route, Category, Tag, Annonce) {
            /* intial configuration  */
            $scope.filters = {
                page: 1,
                pageSize: 12

            };

            $scope.filters.keyWord = $route.current.locals.data.keyWord ;
            $scope.filters.priceMin = $route.current.locals.data.priceMin?parseInt($route.current.locals.data.priceMin):0 ;
            $scope.filters.priceMax = parseInt($route.current.locals.data.priceMax) ;
            $scope.filters.categoryId = $route.current.locals.data.categoryId ;
            $scope.filters.categoryParentId = $route.current.locals.data.categoryParentId ;
            $scope.filters.country = $route.current.locals.data.country ;
            $scope.filters.city = $route.current.locals.data.city ;
            console.log( $scope.filters);
           
                $scope.slider = {
                min: 0,
                max: 50000,

                options: {
                    floor: 0,
                    ceil: 50000,
                     step: 1
                }
            };
             $scope.refresh=function(){
                var annonceQuery = new Annonce.Query();

                if ($scope.filters.keyWord) {


                    annonceQuery.matches('name', new RegExp($scope.filters.keyWord, 'i'));

                }
                
                if($scope.filters.country){
                    annonceQuery.equalTo('country', $scope.filters.country);
                }
                if($scope.filters.locality){
                    annonceQuery.equalTo('locality', $scope.filters.locality);
                }
                if($scope.filters.categoryId){
                    annonceQuery.equalTo('category', {__type: "Pointer", className: "Category", objectId: $scope.filters.categoryId} );
                }
                if($scope.filters.categoryParentId){
                    annonceQuery.equalTo('categoryParent', {__type: "Pointer", className: "Category", objectId: $scope.filters.categoryParentId} );
                }
               
                 annonceQuery.greaterThanOrEqualTo('price',  $scope.filters.priceMin);
                annonceQuery.lessThanOrEqualTo('price',  $scope.filters.priceMax)
                annonceQuery.descending('isSpecial')
                annonceQuery.notEqualTo('isArchived',true)
                annonceQuery.greaterThan('remainingQuantity',0)
                
                    .count().then(function (count) {
                        $scope.$broadcast('total-updated', {
                            total: count,
                            pageSize: $scope.filters.pageSize
                        });
                        $scope.count = count;
                    });
                annonceQuery.skip(($scope.filters.page - 1) *  $scope.filters.pageSize).limit($scope.filters.pageSize)

                    .find()
                    .then(function (annonces) {
                        $timeout(function () {
                            $scope.annonces = annonces;
                           
                        })

                    });
             }
             
            

            var storage = window.localStorage;
            /* storage.setItem('istibdel',JSON.stringify({likes:["HJzSRxIiTp","MfNCMLscph"]}));  */
            if (storage.getItem('istibdel')) {
                var istibdel = JSON.parse(storage.getItem('istibdel'));
            } else {
                storage.setItem('istibdel', JSON.stringify({
                    likes: [],
                    country: null
                }));
                var istibdel = JSON.parse(storage.getItem('istibdel'));
            }
            $scope.category = {};

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
                });
            }

            /* get childs */
            var getChilds = function (category) {
                var query = new Category.Query();

                query.equalTo('parent', category)



                    .find()
                    .then(function (categories) {
                        console.log(categories);
                        $timeout(function () {
                            $scope.category[category.id] = categories;
                        })





                    }, function (error) {
                        $rootScope.errorNotif("حدث خطأ في التحميل");
                    });

            }
            /*  */

            /* get categories */

            var categQuery = new Category.Query();
            categQuery.doesNotExist('parent')
                .notEqualTo('name', 'أخرى')
                .find()
                .then(function (categories) {
                    $timeout(function () {
                        $scope.categories = categories;
                        _.each(categories, function (item) {
                            getChilds(item);
                        })
                    })

                });
            /*  */
            $scope.select=function(show){
                $timeout(function(){
                    $scope.show= show && !$scope.show;
                     $scope.showC= !show &&!$scope.showC
                     
               
                   
                    
                
                 });
               
            }

             /* select category */
             $scope.selectCategory = function (parent, child) {
                
                $timeout(function(){
                    $scope.show=!$scope.show
                $scope.filters.category = child;
                $scope.filters.categoryParent = parent;
               
                    
                        $scope.categ=child||parent;
                   
                    
                
                 })
               
            }
            /*  */
            /* select country */
             $scope.countryChange = function (item) {
                
                $timeout(function(){
                    $scope.showC=!$scope.showC
                $scope.filters.country = item;
                
                   
                    
                
                 })
               
            }
            /*  */

           
           

         








            $scope.$watch('filters', $scope.refresh, true);
          
            


        }
    ]);