import Money from './money';

// 打赏模块
App.DsModule = {
    artistList: null,
    dtd: new $.Deferred(),
    dsParams: null,
    minSlider: 4,
    init: function (e) {
        var self = this;
        $('.j_showDsPanel').on('click', function () {
            self.create($(this));
        });
        this.ajaxArtistList();
    },
    create: function ($el) {
        var self = this;
        var html = '<div class="group_scroll">\
                        <div class="one_group sel"><span class="group_name">艺人</span>\
                        <span class="group_line"></span>\
                        </div>\
                    </div>';
        // 艺人
        html += '<div class="art_user" id="art_user"></div>';
        Promise.all([App.GiftModule.getAllGiftHtml(), this.dtd]).then(function (result) {
            var _html = result[0];
            if (!_html) {
                return App.showInfo('打赏礼物暂不可用，请稍后重试');
            }
            html += _html;
            // 对TA赠言;
            html += '<div style="margin-top:8px" id="dsWordBox"><input type="text" class="inputNormal" id="dsWord" maxlength="60" placeholder="请输入打赏上墙语，30字以内" style="font-size:13px; text-indent:14px; box-sizing:border-box; height:40px; line-height:41px; padding:0px" /></div>';
            html += '<div id="j_priceBox"></div>'

            var dsNum = 1;
            self.dsParams = {};
            var panel = WM.Phone.get({
                type: 'slideBox',
                title: '打赏',
                html: html,
                btnText: '购买打赏',
                ready: function () {
                    var t = this;
                    this.swiper = null;
                    this.find('.wm_slideBody').css({ 'padding-top': 0 });
                    this.find('.one_group').eq(0).addClass('sel');
                    var html = self.create_user();
                    this.find('#art_user').html($(html));


                    Money.createDom(this.find('#j_priceBox'));

                    this.swiper = new Swiper('#swiper1', {
                        effect: 'coverflow',
                        grabCursor: true,
                        centeredSlides: true,
                        slidesPerView: 'auto',
                        //slideToClickedSlide:true,
                        coverflow: {
                            rotate: 0,
                            stretch: 0,
                            depth: 100,
                            modifier: 0,
                            slideShadows: true
                        }
                    });

                    this.find('.oneDsObj').bind('click', function () {
                        if (!$(this).hasClass('sel'))
                            $(this.parentNode).find('.oneDsObj').removeClass('sel').attr({ 'data-num': 0 });
                        
                        $(this).addClass('sel').attr({ 'data-num': dsNum }).find('.oneDsObjNum').html(dsNum);
                        var money = +$(this).attr('data-price') * dsNum;
                        
                        // $('#price > span').html(money.toFixed(2));
                        Money.updatePay(money);

                        self.dsParams.goodsId = $(this).attr('data-id');
                    });
                    
                    this.find('.j_artistHead').on('click', function(){
                        self.showImages(this);
                    });
                },
                click: function () {
                    var showId = $.trim(this.find('.swiper-slide1.swiper-slide-active').attr('art_id'));// 艺人id;
                    var txt = $.trim(this.find('#dsWord').val()); //文字;
                    var giftId = self.dsParams.goodsId;

                    var t = this;
                    if (showId == '' || typeof showId == 'undefined')
                        return showInfo('请选择打赏的艺人', false, { top: '86%' });
                    self.dsParams.userIdGiven = showId;


                    var _len = App.Utils.getTextLength(txt);
                    if (_len > 30)
                        return showInfo('上墙语不能超过30字', false, { top: '86%' });
                    //系统检测
                    if (!App.SensitiveModule.valide(txt))
                        return showInfo('请勿发布广告等不适内容', false, { top: '86%' });
                    if (giftId == '' || typeof giftId == 'undefined')
                        return showInfo('请选择礼物', false, { top: '86%' });
                    //转义
                    self.dsParams.content = txt.replace(/</g, '&lt;').replace(/>/g, '&gt;');
                    
                    var btn = this.getButton()[0];
                    WM.Phone.setButton(btn, false);
                    this.cover(true);
                    
                    self.ajaxDsMsg(self.dsParams).done(function (res) {
                        if (res && res.code === 0 && res.data && res.data.banlanceEnough) {
                            Money.updateBalance();
                            panel.close();
                            res.data.barrageInfo && App.MsgModule.appendData(res.data.barrageInfo);
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
                },
                onClose: function () {
                    if (this.swiper != null)
                        this.swiper.destroy(false);
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
                merchantId: Global.merchantId,
                giveType: App.GiftModule.GIVE_TYPE.PUBLIC
            })
        });
    },
    ajaxArtistList: function(){
        var self = this;
        $.getJSON(Global.API_BASE + '/h5/getArtistList',{
            merchantId: Global.merchantId
        }).then(function(res){
            if(res && res.code === 0){
                self.artistList = res.data;
                self.dtd.resolve(res.data);
            }else{
                self.dtd.reject('艺人列表获取失败');
            }
        },function(){
            self.dtd.reject('艺人列表获取失败');
        });
        return this.dtd;
    },
    setImages: function (e) {
        var w = 90, h = 125,$el = $(e);
        var dir = w / h;
        if ($el.width() / $el.height() <= dir) {
            $el.css({ width: '100%', height: 'auto', left: 0 });
            var mt = ($el.height() - h) / -2;
            $el.css({ top: mt, visibility: 'visible' });
        } else {
            $el.css({ height: '100%', width: 'auto', top: 0 });
            var ml = ($el.width() - w) / -2;
            $el.css({ left: ml, visibility: 'visible' });
        }
    },
    showImages: function (e, event) {
        if ($(e).parents('.swiper-slide1').hasClass('swiper-slide-active')) {
            var _src = $(e).attr('src');
            WM.Phone.showImage(_src);
        }
    },
    create_user: function () { // 艺人
        var data = this.artistList;
        var cName = data.length < this.minSlider ? 'swiper-container-less' : 'swiper-container-more';
        var html = '';
        html += '<div class="swiper-container swiper1" id="swiper1">';
        html += '<div class="swiper-wrapper swiper-container-less">';
        for (var i = 0; i < data.length; i++) {
            var dt = data[i];
            var text = dt.name;
            text = (dt.type == null || typeof dt.type == 'undefined') ? dt.name : dt.type + '-' + dt.name;
            html += '<div class="swiper-slide swiper-slide1" art_id="' + dt.userId + '">';
            html += '<img class="art_user_head j_artistHead" src="' + dt.imgUrl + '" onload="App.DsModule.setImages(this)" />';
            html += '<div class="art_user_name">' + text + '</div>';
            html += '</div>'
        }
        html += '</div></div>';
        return html;
    }
};


export default App.DsModule;