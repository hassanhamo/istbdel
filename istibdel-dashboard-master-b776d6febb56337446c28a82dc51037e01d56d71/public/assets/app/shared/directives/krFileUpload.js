angular.module('istibdel.shared')
.directive('krFileUpload', ['$timeout', function ($timeout) {
    return {
        restrict: 'E',
        templateUrl: '/template/shared/upload',
        scope: {
            name: '=',
            queue: '=?',
            validation: '=?',
            fileSelected: '&?',
            uploadProgress: '&?',
            fileUploaded: '&?',
            thumbnailUploaded: '&?',
            fileRemoved: '&?',
            uploadError: '&?',
            done: '&?',
            fail: '&?',
        },
        link: function (scope, element, attr) {
            var isUploading = false;
            scope.queue = scope.queue || [];
            var automaticUpload = 'auto' in attr;
            var simultaneous = 2;
            var uploadUrl = attr.uploadUrl || '/upload';
            var paramName = attr.paramName || 'files';
            var imageExtensions = ['png', 'jpg', 'jpeg', 'gif', 'tiff'];
            var extensionRegex = /\.(.{1,5})$/;
            var allowedExtensions = 'allowedExtensions' in attr ? attr.allowedExtensions.split(',') : null;
            var globalUploadDeferred;
            var uploadParams = {
                className: attr.className,
                fieldName: attr.fieldName
            };

            scope.label = attr.label;
            scope.multiple = 'multiple' in attr;
            scope.display = attr.display || 'table';
            scope.dnd = 'dnd' in attr;
            scope.type = attr.type || 'image';

            if ('simultaneous' in attr) {
                simultaneous = parseInt(attr.simultaneous, 10);
            }

            var getFileExtension = function (fileInfo) {
                var name = null;
                if (fileInfo.file) {
                    name = fileInfo.file.name;
                } else {
                    if (fileInfo.name.indexOf('.') > 0) {
                        name = fileInfo.name;
                    } else if (fileInfo.url && fileInfo.url.indexOf('.') > 0) {
                        name = fileInfo.url;
                    }
                }

                if (!name) {
                    return null;
                }

                var match = extensionRegex.exec(name);
                if (!match) {
                    return null;
                }

                return match[1].toLocaleLowerCase();
            };

            var setPreview = function (fileInfo, create) {
                if (automaticUpload) {
                    fileInfo.thumbnail = fileInfo.url;
                    //fileInfo.video = fileInfo.url;
                    if (create) {
                        var extension = getFileExtension(fileInfo);
                        if (extension == 'mp4') {
                            var reader = new FileReader();
                            reader.onloadend = function () {

                                ///
                                var video = document.createElement('video');
                                var timeupdate = function () {
                                    if (snapImage()) {
                                        video.removeEventListener('timeupdate', timeupdate);
                                        video.pause();
                                    }
                                };
                                video.addEventListener('loadeddata', function () {
                                    if (snapImage()) {
                                        video.removeEventListener('timeupdate', timeupdate);
                                    }
                                });
                                video.preload = 'metadata';
                                video.src = reader.result;
                                // Load video in Safari / IE11
                                video.muted = true;
                                video.playsInline = true;
                                video.play();
                                var snapImage = function () {
                                    var canvas = document.createElement('canvas');
                                    canvas.width = video.videoWidth;
                                    canvas.height = video.videoHeight;
                                    canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
                                    var image = canvas.toDataURL();
                                  
                                    var parseFile = new Parse.File('_thmbnail',{ base64: image } );
                                    parseFile.save().then(function (savedFile) {

                                        var url = savedFile.url();
                                        fileInfo.videoThumbnail = url;
                                        fileInfo.thumbnail = url;
                                        $timeout(function () {

                                            scope.thumbnailUploaded && scope.thumbnailUploaded({
                                                fileInfo: fileInfo
                                            });
                                        });
                                    });
                                    ///
                                };
                            }
                            reader.readAsDataURL(fileInfo.file);
                        }

                    }
                } else {
                    var extension = getFileExtension(fileInfo);

                    var isImage = extension && imageExtensions.indexOf(extension) >= 0 || (allowedExtensions && _.some(allowedExtensions, function (e) {
                        return imageExtensions.indexOf(e) >= 0;
                    }));

                    if (isImage) {
                        if (fileInfo.url) {
                            fileInfo.thumbnail = fileInfo.url;
                        } else {
                            var reader = new FileReader();
                            reader.onloadend = function () {
                                $timeout(function () {
                                    fileInfo.thumbnail = reader.result;
                                });
                            };
                            reader.readAsDataURL(fileInfo.file);
                        }
                    } else if (extension == 'mp4') {
                        if (fileInfo.url) {
                            fileInfo.video = fileInfo.url;
                        } else {
                            var reader = new FileReader();
                            reader.onloadend = function () {
                                $timeout(function () {
                                    fileInfo.video = reader.result;
                                });
                            };
                            reader.readAsDataURL(fileInfo.file);
                        }
                    } else {
                        fileInfo.thumbnail = '/assets/img/filetypes/png/' + extension + '.png';
                    }
                }
            };

            _.each(scope.queue, function (f) {
                $timeout(function () {
                    f.state = 'uploaded';
                    setPreview(f);
                });
            });

            var handleNewFiles = function (files) {

                if (!scope.multiple) {
                    while (scope.queue.length) {
                        scope.queue.pop();
                    }
                }

                _.each(files, function (f) {
                    var fileInfo = {
                        file: f,
                        state: 'idle',
                        name: f.name,
                        size: f.size
                    };

                    $timeout(function () {
                        setPreview(fileInfo);
                        scope.queue.push(fileInfo);

                        scope.fileSelected && scope.fileSelected({
                            fileInfo: fileInfo
                        });

                        if (automaticUpload) {
                            uploadFiles();
                        }
                    });
                });

            };

            var refreshQueue = function (newQueue) {
                scope.queue = newQueue;
                _.each(scope.queue, function (f) {
                    $timeout(function () {
                        f.state = 'uploaded';
                        setPreview(f);
                    });
                });
            };

            element.on('change', 'input[type=file]', function (e) {
                var newFiles = [];
                _.each(this.files, function (f) {
                    if (!_.some(scope.queue, {
                            file: f
                        })) {
                        newFiles.push(f);
                    }
                });

                handleNewFiles(newFiles);
            });

            var uploadFiles = function (files) {
                if (!globalUploadDeferred) {
                    globalUploadDeferred = Q.defer();
                }

                if (!scope.queue.length || _.every(scope.queue, {
                        state: 'uploaded'
                    })) {
                    globalUploadDeferred.resolve();
                    return globalUploadDeferred.promise;
                }

                if (isUploading) {
                    return globalUploadDeferred.promise;
                }

                var filesUploading = _.filter(scope.queue, {
                    state: 'uploading'
                });
                if (filesUploading >= simultaneous) {
                    return globalUploadDeferred.promise;
                }

                var available = simultaneous - filesUploading.length;
                var nextFiles = _.chain(scope.queue).filter({
                    state: 'idle'
                }).take(available).value();
                _.each(nextFiles, function (f) {

                    f.state = 'uploading';
                    doUploadFile(f);
                });
                return globalUploadDeferred.promise;
            };

            var doUploadFile = function (fileInfo) {

                var parseFile = new Parse.File('_file' + fileInfo.file.name.substring(fileInfo.file.name.lastIndexOf('.')), fileInfo.file);

                var size = fileInfo.size / (1024 * 1000);
                var time = Math.round(5 * size);
                if (scope.$root.vitesse) {
                    time = Math.round(fileInfo.size / (1024 * scope.$root.vitesse));
                }
                var poll = function (t, interval) {
                    $timeout(function () {
                        if (fileInfo.state != 'uploaded')
                            fileInfo.progress = Math.round((t / time) * 95);

                    }, interval);
                };
                for (var i = 1; i <= time; i++) {

                    poll(i, 500 * i);
                }
                var time1 = new Date();
                time1 = time1.getTime();
                parseFile.save().then(function (savedFile) {

                    var url = savedFile.url();
                    $timeout(function () {
                        fileInfo.state = 'uploaded';
                        fileInfo.url = url;
                        setPreview(fileInfo, true);
                    });
                    ///calculate speed upload
                    var time2 = new Date();
                    time2 = time2.getTime();
                    var ms = time2 - time1;
                    var vitesse = (fileInfo.size / ms * 100) / 100;
                    scope.$root.vitesse = vitesse;
                    ///

                    var afterUploadFn = function (savedObject) {
                        $timeout(function () {
                            fileInfo.state = 'uploaded';
                            fileInfo.url = url;
                            scope.fileUploaded && scope.fileUploaded({
                                fileInfo: fileInfo,
                                object: savedObject
                            });

                            if (_.every(scope.queue, {
                                    state: 'uploaded'
                                })) {
                                scope.done && scope.done();
                                globalUploadDeferred.resolve();
                                globalUploadDeferred = null;
                            } else if (_.every(scope.queue, function (i) {
                                    return i.state === 'uploaded' || i.state === 'error';
                                })) {
                                scope.fail && scope.fail();
                                globalUploadDeferred.reject();
                                globalUploadDeferred = null;
                            } else {
                                uploadFiles();
                            }
                        });
                    };

                    if (!uploadParams.className) {
                        afterUploadFn();
                    } else {
                        var obj = new Parse.Object(uploadParams.className);
                        obj.set(uploadParams.fieldName, url);
                        obj.save().then(function (r) {
                            afterUploadFn(r.toPointer());
                        });
                    }
                });

                // var formData = new FormData();
                // formData.append(paramName, fileInfo.file);
                // if (uploadParams.className) {
                //     formData.append('className', uploadParams.className);
                // }

                // if (uploadParams.fieldName) {
                //     formData.append('fieldName', uploadParams.fieldName);
                // }

                // $.ajax({
                //     url: uploadUrl,
                //     data: formData,
                //     type: 'POST',
                //     contentType: false,
                //     processData: false,
                //     xhr: function () {
                //         var xhr = $.ajaxSettings.xhr();
                //         if (xhr.upload) {
                //             xhr.upload.addEventListener('progress', function (event) {
                //                 var percent = 0;
                //                 var position = event.loaded || event.position; /*event.position is deprecated*/
                //                 var total = event.total;
                //                 if (event.lengthComputable) {
                //                     percent = Math.ceil(position / total * 100);
                //                 }
                //                 $($timeout(function () {
                //                     fileInfo.progress = percent;
                //                     scope.uploadProgress && scope.uploadProgress({
                //                         fileInfo: fileInfo
                //                     });
                //                 }));
                //             }, false);
                //         }
                //         return xhr;
                //     },
                //     success: function (res) {
                //         $timeout(function () {
                //             fileInfo.state = 'uploaded';
                //             fileInfo.url = res.url;
                //             scope.fileUploaded && scope.fileUploaded({
                //                 fileInfo: fileInfo,
                //                 object: res.object
                //             });
                //             if (_.every(scope.queue, {
                //                     state: 'uploaded'
                //                 })) {
                //                 scope.done && scope.done();
                //                 globalUploadDeferred.resolve();
                //                 globalUploadDeferred = null;
                //             } else if (_.every(scope.queue, function (i) {
                //                     return i.state === 'uploaded' || i.state === 'error'
                //                 })) {
                //                 scope.fail && scope.fail();
                //                 globalUploadDeferred.reject();
                //                 globalUploadDeferred = null;
                //             } else {
                //                 uploadFiles();
                //             }
                //         });
                //     },
                //     error: function (res) {
                //         $timeout(function () {
                //             fileInfo.state = 'error';
                //         });

                //         scope.uploadError({
                //             fileInfo: fileInfo,
                //             error: res.error
                //         });
                //     }
                // });

            };

            $('body').on('dragover dragend', function () {
                return false;
            });

            $('body').on('drop', function (e) {
                var newFiles = [];
                _.each(this.files, function (f) {
                    if (!_.some(scope.queue, {
                            file: f
                        })) {
                        newFiles.push(f);
                    }
                });

                handleNewFiles(newFiles);
            });

            scope.removeItem = function (item, index) {
                $timeout(function () {
                    _.pull(scope.queue, item);
                    scope.fileRemoved && scope.fileRemoved({
                        fileInfo: item,
                        index: index
                    });
                
                });
            };

            scope.name = {
                upload: uploadFiles,
                refreshQueue: refreshQueue
            };

            scope.$on('$destroy', function () {
                $('body').off('drop dragover dragend');
            });
        }
    };
}]);