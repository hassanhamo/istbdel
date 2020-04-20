angular.module('istibdel.shared')
    .provider('ValidationService',
        function () {
            var working = false;
            var formatError = function (msg, fieldName) {
                return msg.replace('%f', fieldName);
            };
            this.$get = ['$parse', function ($parse) {
                return {
                    validate: function ($scope, object, validationRules, errors) {
                        _.each(validationRules, function (v, k) {
                            var expression = $parse(k);
                            var val = expression(object);
                            if (v.required) {
                                if (v.multiLang) {
                                    if (!val || !val.arabicLabel) {
                                        errors.push({
                                            field: k,
                                            message: formatError('rq%f', v.key)
                                        });
                                    }
                                    if (!val || !val.englishLabel) {
                                        errors.push({
                                            field: k,
                                            message: formatError('rq%f', v.key)
                                        });
                                    }
                                } else if (v.isImage) {
                                    var queue = $scope[v.queueKey];
                                    if ((!v || !v.length) && !queue.length) {
                                        errors.push({
                                            field: k,
                                            message: formatError('rq%f', v.key)
                                        });
                                    }
                                } else if (!val) {
                                    errors.push({
                                        field: k,
                                        message: formatError('rq%f', v.key)
                                    });
                                }
                            }
                        });

                        return !errors.length;
                    }
                };
            }];
        });