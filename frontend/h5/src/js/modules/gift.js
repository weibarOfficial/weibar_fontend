import Money from './money';

App.GiftModule = {
    dtd: new $.Deferred(),
    data: null,
    options: {
        fromDetail: false,
        params: null
    },
    // 1:群聊打赏；2:私聊打赏
    GIVE_TYPE:{
        PUBLIC: 1,
        PRIVITE: 2
    },
    init: function (options) {
        var self = this;
        $.extend(this.options, options);
        this.loadData();
        if(this.options.fromDetail){
            this.options.giveType = this.GIVE_TYPE.PRIVITE;
            options.$triggerEl && options.$triggerEl.on('click', function(){
                self.showGiftPanel($(this));
            });
        }else{
            this.options.giveType = this.GIVE_TYPE.PUBLIC;
        }
    },
    loadData: function () {
        var self = this;
        $.ajax({
            url: Global.API_BASE + '/h5/goodsSettingInfo',
            data: {
                merchantId: Global.merchantId
            },
            dataType: 'json'
        }).done(function (res) {
            if (res && res.code === 0) {
                self.data = res.data;
                self.dtd.resolve(res.data);
            } else {
                self.dtd.reject(res && res.message || '礼物加载失败');
            }
        }).fail(function (res) {
            self.dtd.reject(res && res.message || '礼物加载失败');
        });
    },
    getData: function () {
        return this.dtd;
    },
    getAllGiftHtml: function () {
        return this.getData().then(function (data) {
            // 打赏礼物
            var html = '';
            html += '<div class="wm_slideRowTitle" style="padding:0;margin:5px 0;">礼物</div>';
            html += '<div class="wm_otherBar" style="padding:0;margin:5px 0;">\
                        <div class="dsObjMain" style="padding:0;margin:0;">\
                            <div class="dsObjBox dsObjBox2">';
            data.forEach(function (item) {
                html += '<a class="oneDsObj" data-id="' + item.goodsId + '" data-price="' + item.goodsAmount + '">\
                            <span class="oneDsObjSpan"><img src="'+ item.goodsImgUrl + '" style="max-width:100%"/></span>\
                            <tt class="ellipsis">'+ item.goodsName + '</tt>\
                            <tt class="ellipsis" style="margin-top:0;height:12px;line-height:12px;">￥'+ item.goodsAmount + '</tt><i class="oneDsObjNum"></i></a>';
            });
            html += '</div></div></div>';
            return html;
        }, function () {
            return null;
        });
    },

    showGiftPanel: function ($el) {
        var self = this;
        var userPic = $el.attr('data-userpic') || "";
        var name = $el.attr('data-name') || "";
        var tid = $el.attr('data-uid') || "";
        


        var html = '<div style="text-align:center">\
                        <img src="'+ userPic +'" style="border-radius:4px; width:60px; height:60px" />\
                        <p style="margin-top:5px;">'+ name + '</p>\
                    </div>';
        
        this.getAllGiftHtml().then(function (_html) {
            if (!_html) {
                return App.showInfo('打赏礼物暂不可用，请稍后重试');
            }
            html += _html;
            // 对TA赠言;
            html += '<div style="margin-top:8px" id="dsWordBox"><input type="text" class="inputNormal" id="dsWord" maxlength="60" placeholder="留言，30字以内" style="font-size:13px; text-indent:14px; box-sizing:border-box; height:40px; line-height:41px; padding:0px" /></div>';
            if(!self.options.fromDetail){
                html += '<a class="isShowToPc sel"><i class="icon_gift_select"></i>在大屏幕上显示</a>';	
            }            
            html += '<div id="j_priceBox"></div>'

            var dsNum = 1;
            self.dsParams = {
                userIdGiven: tid
            };
            var panel = WM.Phone.get({
                type: 'slideBox',
                title: '送礼物',
                html: html,
                btnText: '购买礼物',
                ready: function () {
                    var t = this;
                    this.find('.wm_slideBody').css({ 'padding-top': 0 });

                    this.find('.oneDsObj').bind('click', function () {
                        if (!$(this).hasClass('sel'))
                            $(this.parentNode).find('.oneDsObj').removeClass('sel').attr({ 'data-num': 0 });
                        
                        $(this).addClass('sel').attr({ 'data-num': dsNum }).find('.oneDsObjNum').html(dsNum);
                        var money = $.trim($(this).attr('data-price')) * dsNum;
                        
                        // $('#price > span').html(money.toFixed(2));
                        Money.updatePay(money);

                        self.dsParams.goodsId = $(this).attr('data-id');
                    });
                    this.find('.isShowToPc').bind('click',function(){
                        if($(this).hasClass('sel'))
                            return $(this).removeClass('sel');
                        $(this).addClass('sel');			
                    });
                    Money.createDom(this.find('#j_priceBox'));
                },
                click: function () {
                    
                    var txt = $.trim(this.find('#dsWord').val()); //文字;
                    var giftId = self.dsParams.goodsId;

                    var t = this;
                    
                    var _len = App.Utils.getTextLength(txt);
                    if (_len > 30)
                        return showInfo('留言不能超过30字', false, { top: '86%' });
                    //系统检测
                    if (!App.SensitiveModule.valide(txt))
                        return showInfo('请勿发布广告等不适内容', false, { top: '86%' });
                    if (giftId == '' || typeof giftId == 'undefined')
                        return showInfo('请选择礼物', false, { top: '86%' });
                    //转义
                    self.dsParams.content = txt.replace(/</g, '&lt;').replace(/>/g, '&gt;');
                    
                    self.dsParams.giveType = this.find('.isShowToPc').hasClass('sel') ? self.GIVE_TYPE.PUBLIC: self.GIVE_TYPE.PRIVITE;

                    var btn = this.getButton();
                    if (btn.hasClass('disabled')){
                        return;
                    }
                    btn.addClass('disabled');
                    // WM.Phone.setButton(btn, false);
                    this.cover(true);
                    
                    self.ajaxDsMsg(self.dsParams).done(function (res) {
                        if (res && res.code === 0 && res.data && res.data.banlanceEnough) {
                            Money.updateBalance();
                            panel.close();
                            if(self.options.fromDetail){
                                res.data.privateChat && App.MsgModule.appendData(res.data.privateChat);
                            }else if(self.dsParams.giveType === self.GIVE_TYPE.PUBLIC) {
                                res.data.barrageInfo && App.MsgModule.appendData(res.data.barrageInfo);
                            }
                        } else if (res && res.code === 0 && res.data && !res.data.banlanceEnough) {
                            // App.showInfo('余额不足请先充值', false, { top: '86%' });
                            Money.requireEncharge(res.data.minRechargeAmount, res.data.wechatMpPrePay.wxPayMpOrderResult);
                        } else {
                            App.showInfo('操作失败', false, { top: '86%' });
                        }

                    }).fail(function (res) {
                        App.showInfo(res && res.message || '操作失败', false, { top: '86%' });
                    }).always(function () {
                        // WM.Phone.setButton(btn, true);
                        btn.removeClass('disabled');
                        t.cover(false);
                    });
                }
            });
        });
    },
    ajaxDsMsg: function(data){
        return $.ajax({
            url: Global.API_BASE + '/h5/give',
            method: 'POST',
            dataType: 'json',
            data: $.extend(data, {
                merchantId: Global.merchantId
            },this.options.params)
        });
    }
};

export default App.GiftModule;