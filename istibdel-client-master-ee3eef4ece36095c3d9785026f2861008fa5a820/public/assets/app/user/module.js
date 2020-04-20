angular.module('istibdel.user', ['ngRoute'])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider
            
            .when('/users', {
                templateUrl: '/template/user/index',
                controller: 'UserController',
                
            })
            .when('/users/:id', {
                templateUrl: '/template/user/show',
                controller: 'UserShowController',
                resolve: {
                    user: function ($route, User) {
                        return User.get($route.current.params.id);
                    },
                    config: function(Configuration) {
                        var query = new Configuration.Query();
                       
                        return query.first();
                    },
                    tab:function(Configuration) {
                       
                       
                        return 1;
                    }
                }
            })
            .when('/profile/:id', {
                templateUrl: '/template/user/profile',
                controller: 'UserProfileController',
                resolve: {
                    user: function ($route, User) {
                        return User.get($route.current.params.id);
                    }
                }
            })
            .when('/users3/:id', {
                templateUrl: '/template/user/show',
                controller: 'UserShowController',
                resolve: {
                    user: function ($route, User) {
                        return User.get($route.current.params.id);
                    },
                    config: function(Configuration) {
                        var query = new Configuration.Query();
                       
                        return query.first();
                    },
                    tab:function(Configuration) {
                       
                       
                        return 3;
                    }
                }
            })
            .when('/usersNotif/:id', {
                templateUrl: '/template/user/notification',
                controller: 'UserNotifController',
                resolve: {
                    user: function ($route, User) {
                        return User.get($route.current.params.id);
                    },
                    config: function(Configuration) {
                        var query = new Configuration.Query();
                       
                        return query.first();
                    }
                }
            });
    }]);