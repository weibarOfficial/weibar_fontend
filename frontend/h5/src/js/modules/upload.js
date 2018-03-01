App.UploadModule = (function () {

    function selectFileImage(file, data) {
        var dtd = $.Deferred();
        var Orientation = null;
        data.width = data.width == null ? 0 : data.width;
        data.height = data.height == null ? 0 : data.height;
        if (file) {
            var rFilter = /^(image\/jpeg|image\/png)$/i; // 检查图片格式  
            if (!rFilter.test(file.type) && file.type != '') {
                dtd.reject('请选择jpeg、png格式的图片');
                return;
            }

            EXIF.getData(file, function () {
                EXIF.getAllTags(this);
                Orientation = +EXIF.getTag(this, 'Orientation');
            });
            dtd.notify();
            var oReader = new FileReader();
            oReader.onload = function (e) {
                var image = new Image();
                image.src = e.target.result;
                image.onerror = function () {
                    dtd.reject('当前文件不可用，请重新选择');
                    return;
                }
                image.onload = function () {
                    var expectWidth = this.naturalWidth;
                    var expectHeight = this.naturalHeight;
                    if (expectWidth < data.width || expectHeight < data.height) {
                        dtd.reject('请上传宽度大于' + data.width + 'px，高度大于' + data.height + 'px 的图片');
                        return;
                    }
                    if (this.naturalWidth > this.naturalHeight && this.naturalWidth > 800) {
                        expectWidth = 800;
                        expectHeight = expectWidth * this.naturalHeight / this.naturalWidth;
                    } else if (this.naturalHeight > this.naturalWidth && this.naturalHeight > 1200) {
                        expectHeight = 1200;
                        expectWidth = expectHeight * this.naturalWidth / this.naturalHeight;
                    }
                    var canvas = document.createElement("canvas"),
                        ctx = canvas.getContext('2d');
                    canvas.width = expectWidth;
                    canvas.height = expectHeight;
                    if (Orientation && Orientation != 1) {
                        switch (Orientation) {
                            case 6:     // 旋转90度
                                canvas.width = expectHeight;
                                canvas.height = expectWidth;
                                ctx.rotate(Math.PI / 2);
                                // (0,-expectHeight) 从旋转原理图那里获得的起始点
                                ctx.drawImage(this, 0, -expectHeight, expectWidth, expectHeight);
                                break;
                            case 3:     // 旋转180度
                                ctx.rotate(Math.PI);
                                ctx.drawImage(this, -expectWidth, -expectHeight, expectWidth, expectHeight);
                                break;
                            case 8:     // 旋转-90度
                                canvas.width = expectHeight;
                                canvas.height = expectWidth;
                                ctx.rotate(3 * Math.PI / 2);
                                ctx.drawImage(this, -expectWidth, 0, expectWidth, expectHeight);
                                break;
                        }
                    } else {
                        ctx.drawImage(this, 0, 0, expectWidth, expectHeight);
                    }
                    var base64 = canvas.toDataURL("image/jpeg", 0.8);
                    dtd.resolve(base64);
                };
            };
            oReader.readAsDataURL(file);
        } else {
            dtd.reject('未指定上传文件');
        }
        return dtd;
    }

    function UploadInstance(options) {
        this.config = $.extend({}, {
            url: '/h5/uploadPic',
            base64: true, // 默认使用base64上传图片
            $input: null, //文件输入框
            filename: 'file', //上传文件名字
            data: null, //上传附加参数
            num: 1,
            width: 200,
            height: 200,
            size: 10 * 1000 * 1024,
            onStart: null,
            onSuccess: null,
            onError: null,
        }, options);
        this.init();
    }
    UploadInstance.prototype = {
        init: function () {
            this.initEvents();
            this.config.url = this.config.base64 ? '/h5/uploadPicBase64' : '/h5/uploadPic';
        },
        initEvents: function () {
            var self = this;
            this.config.$input.on('change', function () {
                self.upload(this.files);
            });
        },
        upload: function (files) {
            var self = this;
            var file = files[0];
            if (file.size > this.config.size) {
                App.showInfo('上传图片不能大于' + this.config.size / (1000 * 1024) + 'M', false);
                return false;
            }
            if (this.config.base64) {
                selectFileImage(file, {
                    width: this.config.width,
                    height: this.config.height
                }).progress(function(){
                    self.config.onStart && self.config.onStart();
                }).then(function (base64Str) {
                    this.start(base64Str);
                }.bind(this), function (msg) {
                    // App.showInfo(msg, false);
                    self.config.onError && self.config.onError({
                        message: msg
                    });
                });
            } else {
                this.config.onStart && this.config.onStart();
                this.start(file);
            }
        },
        start: function (fileData) {
            var self = this;
            var params = {
                url: this.config.url,
                type: 'POST',
                cache: false,
                data: {}
            };
            if (!this.config.base64) {
                params.processData = false;
                params.contentType = false;
                var formData = new FormData();
                if (this.config.data) {
                    for (var p in this.config.data) {
                        formData.append(p, this.config.data[p]);
                    }
                }
                formData.append(this.config.filename, fileData);
                params.data = formData;
            } else {
                $.extend(params.data, this.config.data);
                params.data[this.config.filename] = fileData.replace('data:image/jpeg;base64,', '');
            }
            this.currUpload = $.ajax(params).done(function (res) {
                self.config.onSuccess && self.config.onSuccess(res);
            }).fail(function (res) {
                try {
                    self.config.onError && self.config.onError(JSON.parse(res));
                } catch (e) {
                    self.config.onError && self.config.onError(res);
                }
            }).always(function () {
                self.currUpload = null;
            });
        },
        clear: function () {
            try {
                this.currUpload.abort();
            } catch (ex) { }
        }
    };
    return {
        init: function () { },
        instance: function (args) {
            return new UploadInstance(args);
        }
    };
})();
export default ApplicationCache.UploadModule;