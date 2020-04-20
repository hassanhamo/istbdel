angular.module('istibdel.shared')
    .filter('formatName', function () {
        return function (profile) {
            if (!profile) {
                return '';
            }
            return profile.firstName + ' ' + profile.lastName;
        };
    });