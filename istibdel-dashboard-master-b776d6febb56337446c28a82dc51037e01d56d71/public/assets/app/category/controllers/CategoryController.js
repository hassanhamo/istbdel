angular.module('istibdel.category')
    .controller('CategoryController', ['$rootScope', '$scope', '$http', '$timeout', '$route', 'Category',
        function ($rootScope, $scope, $http, $timeout, $route, Category) {
            /* intial configuration  */
            $scope.filters = {
                page: 1,
                pageSize: 1000

            };
            /*  */

            /* get count items */
            var countQuery = new Category.Query();
            countQuery.doesNotExist('parent')
            .notEqualTo('name','أخرى')
                .count().then(function (count) {
                    $scope.$broadcast('total-updated', {
                        total: count,
                        pageSize: $scope.filters.pageSize
                    });

                });
            /*  */

            /* refresh items */
            var refresh = function () {
                var query = new Category.Query();

                query.doesNotExist('parent')
                .notEqualTo('name','أخرى')
                    .count().then(function (count) {
                        $scope.$broadcast('total-updated', {
                            total: count,
                            pageSize: $scope.filters.pageSize
                        });
                    });
                if($scope.filters.search){
                    query.matches('name', new RegExp($scope.filters.search, 'i'));
                }
                query.skip(($scope.filters.page - 1) * $scope.filters.pageSize).limit($scope.filters.pageSize);
                query.ascending(['range'])
                    .find()
                    .then(function (categories) {
                        console.log(categories);
                        $timeout(function () {
                            $scope.categories = categories;
                        })





                    }, function (error) {
                        $rootScope.errorNotif("حدث خطأ في التحميل");
                    });
            };
            /*  */

            /* Start sortable methodes */

            $scope.sortableOptions = {
                placeholder: 'col-md-4 col-xs-4 sortable-placeholder',
                'ui-floating': true
            };

            $scope.sortStop = function () {
                _.each($scope.categories, function (category, index) {
                    $timeout(function () {
                        category.range = index;
                    });
                });


                Parse.Object.saveAll($scope.categories, {
                    useMasterKey: true
                }).then(function () {
                    refresh();
                }, function (error) {

                });
            };
            /* End sortable methodes */

            /* File upload methodes */

            $scope.fileUploaded = function (fileInfo, object) {
                console.log(fileInfo.url);
                $scope.addFiles.push(fileInfo.url);
                $scope.selectedItem.thumbnail = fileInfo.url;
            };

            $scope.fileRemoved = function (fileInfo, index) {
                $scope.deleteFiles.push(fileInfo.url);

                $scope.selectedItem.thumbnail = null;
            };
            /*  */

            /* revert item */
            $scope.cancel = function () {
                $scope.selectedItem.revert();
                
                   
                Parse.Cloud.run("deleteFiles", {
                    "urlFiles": $scope.addFiles
                }).then(function (result) {

                });

            };
            /*  */

            /* hide category */

            $scope.toggle = function (category, isHidden) {
                category.isHidden = isHidden;
                category.save(null, {
                    useMasterKey: true
                }).then(function () {}, function () {
                    category.revert();
                    $timeout(function () {
                    isHidden=!isHidden;
                    });
                    $rootScope.errorNotif("حدث خطأ في الحفظ ");
                });
            };
            /*  */

            /* select item */
            $scope.selectItem = function (item) {
                $scope.modalTitle = "تعديل قسم"
                $scope.deleteFiles = [];
                $scope.addFiles = [];
                if (!item) {
                    item = new Category();
                    $scope.modalTitle = "إضافة قسم"
                }

                $scope.imagesQueue = [];


                if (item.thumbnail) {
                    $scope.imagesQueue.push({
                        name: 'bg',
                        url: item.thumbnail,
                        state: 'uploaded'
                    });
                    $scope.backgroundUploader.refreshQueue($scope.imagesQueue);
                }

                $scope.selectedItem = item;
            };
            /*  */

            /* save item */

            $scope.save = function () {
                $scope.modalUI.block();

                $scope.selectedItem.save(null, {
                    useMasterKey: true
                }).then(function (category) {
                    $scope.modalUI.unblock();
                    
                    Parse.Cloud.run("deleteFiles", {
                        "urlFiles": $scope.deleteFiles
                    }).then(function (result) {

                    });
                    
                    if($scope.modalTitle == "إضافة قسم"){
                       var others = new Category();
                       others.name='أخرى';
                       others.parent=category;
                       others.save();
                    }
                    refresh();
                }, function (error) {
                    $scope.modalUI.unblock();
                    
                    $scope.selectedItem.revert();
                    $rootScope.errorNotif("حدث خطأ في حفظ القسم");
                });

            };
            /*  */


            $scope.$watch('filters', refresh, true);
        }
    ]);