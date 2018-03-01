import Money from '../modules/money';
App.SpamScreenModule = {
    bpThemes: null,
    bpTimes: null,
    init: function () {
        var self = this;
        $('.j_showSparmPanel').on('click', function () {
            self.showPanel($(this));
        });
    },
    ajaxBpTimes: function () {
        if (this.bpTimes) {
            return Promise.resolve(this.bpTimes);
        } else {
            return $.ajax({
                url: Global.API_BASE + '/h5/priceTimeInfo',
                data: {
                    merchantId: Global.merchantId
                },
                dataType: 'json'
            }).then(function (res) {
                if (res && res.code === 0) {
                    return res.data;
                } else {
                    return null;
                }
            });
        }
    },
    bpParams: {},
    showPanel: function ($el, isForTa) {
        var self = this;
        if (isForTa) {
            var mid = $el.closest('.j_row').attr('mid');
            var pic = $el.closest('.j_row').find('.j_pic').attr('src');
        }
        
        Promise.all([this.ajaxBpTheme(),this.ajaxBpTimes()]).then(function (dataArray) {
            
            this.bpThemes = dataArray[0];
            this.bpTimes = dataArray[1];
            var html = template('spamPanelTpl', {
                bpTimes: this.bpTimes,
                bpThemes: this.bpThemes,
                isForTa: isForTa,
                pic: pic
            });
            var self = this;
            var panel = WM.Phone.get({
                type: 'slideBox',
                title: isForTa ? '以下图片将霸屏显示' : '霸屏',
                btnText: '购买霸屏',
                html: html,
                onload: function () {
                    Money.createDom(this.find('#j_priceBox'));
                },
                ready: function () {
                    self.bpParams = {
                        times: this.find('#select').val()
                    };
                    if (isForTa) {
                        self.bpParams.messageId = mid;
                    }
                    var t = this;
                    var showNum = 1;
                    this.find('.wm_slideFoot .btnNormal').css({ margin: 0 });
                    this.find('.wm_slideBody').css({ 'overflow-x': 'inherit' });

                    // 霸屏次数
                    this.find('#select').on('change', function () {
                        var num = +$(this).val();
                        var v2 = $(this).find('option:selected').text();
                        t.find('#bpText1').html(v2).attr('data-num', num);
                        self.bpParams.times = num;
                        if (t.find('.oneBpTime.sel').length == 0)
                            return;
                        var bpMoney = t.find('.oneBpTime.sel').attr('data-price');
                        bpMoney = parseFloat(bpMoney);

                        var all = bpMoney * num;
                        Money.updatePay(all);
                    });

                    // 一次霸屏时间
                    this.find('.oneBpTime').click(function () {
                        if ($(this).hasClass('BpTimeNotCheck'))
                            return showInfo('该时长管理员不可选，可登录微喵后台取消该限制', false);
                        $(this).addClass('sel').siblings('.oneBpTime').removeClass('sel');
                        var bpMoney = $(this).attr('data-price');
                        var bpTime = $(this).attr('data-time');
                        bpTime = bpTime == undefined ? 0 : bpTime;
                        if (bpTime < 30)
                            t.find('.oneBpType').removeClass('sel');
                        bpMoney = parseFloat(bpMoney);

                        var all = bpMoney * self.bpParams.times;
                        Money.updatePay(all);

                        self.bpParams.second = bpTime;
                    });

                    // 霸屏类型
                    this.find('.oneBpType').on('click', function () {
                        var bpTime = self.bpParams.second;
                        if (bpTime < 30)
                            return App.showInfo('霸屏时长大于30秒才可使用霸屏主题', false);
                        if ($(this).hasClass('sel')) {
                            $(this).removeClass('sel').siblings('.oneBpType').removeClass('sel');
                            delete self.bpParams.theme;
                        } else {
                            $(this).addClass('sel').siblings('.oneBpType').removeClass('sel');
                            self.bpParams.theme = $(this).data('type');
                        }
                    });

                    
                    self.$uploadBox = this.find('.j_uploadBox').on('click', '.j_delImage', function () {
                        self.delImage($(this));
                    });
                    if (!isForTa) {
                        // 初始化图片上传
                        self.uploadInstance = App.UploadModule.instance({
                            $input: this.find('.j_file'),
                            onStart: function () {
                                self.showUploading();
                            },
                            onError: function (err) {
                                self.uploadError(res && res.message);
                            },
                            onSuccess: function (res) {
                                if (res && res.code === 0 && res.data) {
                                    self.uploadSuccess(res.data);
                                } else {
                                    self.uploadError(res && res.message);
                                }
                            }
                        });
                    }
                },
                onClose: function () {
                    self.uploadInstance && self.uploadInstance.clear();
                },
                click: function (b) {
                    var t = this;
                    if (!self.bpParams.second)
                        return App.showInfo('请选择霸屏时长', false, { top: '86%' });

                    var imgArr = $('.oneUploadImg.show');
                    var videoArr = $('.oneUploadVideo');
                    var txt = '';
                    if (isForTa) {
                        // txt = $.trim(t.find('.isForTaInput').val());
                        txt = $.trim(t.find('#_bpWord').val());
                        if (!txt) {
                            return App.showInfo('请输入霸屏语', false, { top: '86%' });
                        }
                    } else {
                        txt = $.trim(t.find('#_bpWord').val());
                        if (txt.length == 0 && imgArr.length == 0 && videoArr.length == 0) {
                            return App.showInfo('请输入霸屏语或者上传图片', false, { top: '86%' });
                        }
                    }
                    if (App.Utils.getTextLength(txt) > 40) {
                        return App.showInfo('霸屏上墙语不能超过40字', false, { top: '86%' });
                    }

                    txt = txt.replace(/</g, '&lt;').replace(/>/g, '&gt;');
                    //系统词语检测
                    if (!App.SensitiveModule.valide(txt)) {
                        return showInfo('请勿发布广告等不适内容', false, { top: '86%' });
                    }
                    self.bpParams.content = txt;

                    var btn = this.getButton()[0];
                    WM.Phone.setButton(btn, false);
                    this.cover(true);
                    self.ajaxBpMsg(self.bpParams, isForTa).done(function (res) {
                        if (res && res.code === 0 && res.data && res.data.banlanceEnough) {
                            Money.updateBalance();
                            App.MsgModule.appendData(res.data.barrageInfo, isForTa);
                            panel.close();
                        } else if (res && res.code === 0 && res.data && !res.data.banlanceEnough) {
                            // App.showInfo('余额不足请先充值', false, { top: '86%' });
                            Money.requireEncharge(res.data.minRechargeAmount, res.data.wechatMpPrePay.wxPayMpOrderResult);
                        } else {
                            App.showInfo('操作失败', false, { top: '86%' });
                        }

                    }).fail(function (res) {
                        App.showInfo(res && res.message || '操作失败', false, { top: '86%' });
                    }).always(function () {
                        WM.Phone.setButton(btn, true);
                        t.cover(false);
                    });
                }
            });
        }.bind(this));
    },
    ajaxBpMsg: function (data, isForTa) {
        return $.ajax({
            url: (isForTa ? '/h5/barping' : '/h5/addBarping'),
            method: 'POST',
            dataType: 'json',
            data: $.extend(data, {
                merchantId: Global.merchantId
            })
        });
    },
    ajaxBpTheme: function(){
        if(this.bpThemes){
            return Promise.resolve(this.bpThemes);
        }
        return $.ajax({
            url: '/h5/barpinThemes',
            method: 'POST',
            dataType: 'json',
            data: {
                merchantId: Global.merchantId
            }
        }).then(function (res) {
            if (res && res.code === 0) {
                return res.data;
            } else {
                return null;
            }
        });
    },
    showUploading: function () {
        delete this.bpParams.picUrl;
        this.$uploadBox.find('.j_loading').show();
    },
    uploadSuccess: function (src) {
        this.bpParams.picUrl = src;
        this.$uploadBox.find('.j_loading').hide();
        this.$uploadBox.append('<div class="oneUpload show"><a class="iconDeleBox j_delImage"><i class="iconDele"></i></a>\
            <img class="img" src="'+ src + '" /></div>');
    },
    uploadError: function (errorMsg) {
        App.showInfo(errorMsg || '上传失败', false);
        this.$uploadBox.find('.j_loading').hide();
    },
    delImage: function ($el) {
        var self = this;
        WM.Phone.get({
            type: 'confirm',
            title: '删除',
            innerHTML: '确定删除此图片?',
            click: function (b) {
                self.uploadInstance.clear();
                $el.closest('.oneUpload').remove();
                this.close();
                delete self.bpParams.picUrl;
            }
        });
    }
};

export default App.SpamScreenModule;