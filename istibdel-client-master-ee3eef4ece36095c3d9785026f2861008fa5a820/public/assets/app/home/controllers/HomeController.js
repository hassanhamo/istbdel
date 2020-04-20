angular.module('istibdel.home')
    .controller('HomeController', ['$rootScope', '$scope', '$http', '$timeout', '$route', 'Category', 'Tag', 'Annonce',
        function ($rootScope, $scope, $http, $timeout, $route, Category, Tag, Annonce) {
            /* intial configuration  */
            $scope.filters = {
                page: 1,
                pageSize: 6

            };
           
           
               
            $scope.category={};
            

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

          

            /* get annonces */
            var getAnnonces = function (category, page, limit) {
                page = page || 1;
                limit = limit || 6;
                var annonceQuery = new Annonce.Query();

                if ($scope.filters.search) {


                    annonceQuery.matches('name', new RegExp($scope.filters.search, 'i'));

                }
                if ($scope.filters.tag) {


                    annonceQuery.equalTo('tags', $scope.filters.tag.title);

                }
                if($scope.filters.country){
                    annonceQuery.equalTo('country', $scope.filters.country.name_en);
                }
                if($scope.filters.category){
                    annonceQuery.equalTo('category', {__type: "Pointer", className: "Category", objectId: $scope.filters.category} );
                }
               
                 annonceQuery.greaterThanOrEqualTo('price', $scope.slider.min);
                annonceQuery.lessThanOrEqualTo('price', $scope.slider.max); 
                annonceQuery.equalTo('categoryParent', category);
               
                annonceQuery.descending('isSpecial');
                annonceQuery.notEqualTo('isArchived',true);
                annonceQuery.greaterThan('remainingQuantity',0)
                    .count().then(function (count) {
                        $scope.category[category.id].count = count;
                    });
                annonceQuery.skip((page - 1) * limit).limit(limit)

                    .find()
                    .then(function (annonces) {
                        $timeout(function () {
                            $scope.category[category.id] = $scope.category[category.id] || {};
                            $scope.category[category.id].annonces = annonces;

                            $scope.category[category.id].page = $scope.category[category.id].page || 1;
                        })

                    });
            }
            /*  */
            /* next page annonce */
            $scope.nextPage = function (category) {
                var next = ++$scope.category[category.id].page;
                getAnnonces(category, next, 6);
            }
            /*  */
            /* prev page annonce */
            $scope.prevPage = function (category) {
                var prev = --$scope.category[category.id].page;
                getAnnonces(category, prev, 6);
            }
            /*  */
            /* get categories */
            $scope.refresh = function () {
                var categQuery = new Category.Query();
                categQuery.doesNotExist('parent')
                    .notEqualTo('name', 'أخرى')
                    .find()
                    .then(function (categories) {
                        $timeout(function () {
                            $scope.categories = categories;
                            _.each(categories, function (item) {
                                getAnnonces(item, 1, 6);
                            })
                        })

                    });
            }
            /*  */

            /* get tags */
            var tagRefresh = function () {

                var tagQuery = new Tag.Query();
                tagQuery.limit(1000)
                    .matches('title', new RegExp($scope.filters.search, 'i'))
                    .find()
                    .then(function (tags) {
                        $timeout(function () {
                            $scope.tags = tags;
                        })

                    });

            }
            /*  */








            $scope.$watch('filters.search', tagRefresh, true);
            $scope.$watch('filters.tag', $scope.refresh, true);

           


        }
    ]);