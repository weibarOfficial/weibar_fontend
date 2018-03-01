import '../modules/global';
import Money from '../modules/money';
import '../modules/basicFilter';
import '../modules/skin';
import '../modules/upload';
import '../modules/sensitive';
import '../modules/scroll';
import '../modules/userBox';
import '../modules/face';
import LoadModule from '../modules/load';

import '../modules/gift';
import '../modules/ds';
import '../modules/spamScreen';
import '../modules/redbag';
import WebsocketModule from '../modules/websocket';

import '../../style/swiper.css';
import '../../style/basic.css';
import '../../style/wmPhone.css';
import '../../style/onWallPhone.css'

App.MsgFormModule = {
    $msgCnt: null,
    init: function () {
        this.$msgCnt = $('#j_msgFormCnt');
        this.initUpload();
        this.initEvent();

        this.$msgCnt.find('.j_logo').attr('src', Global.User.userPicture)
            .addClass(Global.User.sex === '男' ? 'man' : 'woman');
    },
    initUpload: function () {
        var self = this;
        this.uploadInstance = App.UploadModule.instance({
            $input: this.$msgCnt.find('#upload'),
            onStart: function () {
                self.showUploading();
            },
            onError: function (res) {
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
    },
    initEvent: function () {
        var self = this;
        this.$msgCnt.on('click', '.afterUpload', function () {
            self.delImage();
        }).on('click', '#submit', function () {
            self.post($(this));
        }).on('submit', '#form', function () {
            self.post($('#submit'));
            return false;
        }).on('click', '.j_showProfile', function () {
            self.showProfile();
        });
    },
    showUploading: function () {
        this.$msgCnt.find('#txt').addClass('hasImage');
        this.$msgCnt.find('.afterUpload').remove();
        $('<a class="afterUpload"><tt class="onloading"></tt><tt class="slideClose"></tt></a>')
            .appendTo(this.$msgCnt.find('.newFoot-inputBox'));
    },
    uploadSuccess: function (src) {
        this.$msgCnt.find('.afterUpload').html('<img class="img" src="' + src + '" /><tt class="slideClose"></tt>');
    },
    uploadError: function (errorMsg) {
        App.showInfo(errorMsg || '上传失败', false);
        this.clearImg();
    },
    clearImg: function () {
        this.$msgCnt.find('#txt').removeClass('hasImage');
        this.$msgCnt.find('.afterUpload').remove();
    },
    delImage: function () {
        var self = this;
        WM.Phone.get({
            type: 'confirm',
            title: '删除',
            innerHTML: '确定删除此图片?',
            click: function (b) {
                self.uploadInstance.clear();
                self.clearImg();
                this.close();
            }
        })
    },
    resetForm: function () {
        this.clearImg();
        this.$msgCnt.find('#txt').val('');
    },
    post: function ($btn) {
        var self = this;
        if ($btn.hasClass('disabled')) { return; }
        var txt = this.$msgCnt.find('#txt').val();
        var img = this.$msgCnt.find('.afterUpload .img').attr('src');
        txt = txt.replace(/</g, '&lt;').replace(/>/g, '&gt;');
        if (!txt && !img) {
            return App.showInfo('请输入上墙内容或者上传图片', false);
        }
        $btn.addClass('disabled');
        $.ajax({
            url: Global.API_BASE + '/h5/addWordsAndPic',
            method: 'POST',
            data: {
                merchantId: Global.merchantId,
                openId: Global.openId,
                content: txt,
                picUrl: img
            }
        }).done(function (res) {
            if (res && res.code === 0) {
                self.resetForm();
                App.MsgModule.appendData(res.data);
            } else {
                App.showInfo(res && res.message || '消息发送失败', false);
            }
        }).fail(function () {

        }).always(function () {
            $btn.removeClass('disabled');
        });
    },
    showProfile: function () {
        var self = this;
        var data = $.extend({}, Global.User);
        if (data.sex === '男') {
            data.headCls = 'newMy_head_man';
            data.sexCls = 'sex_man';
        } else {
            data.headCls = 'newMy_head_woman';
            data.sexCls = 'sex_woman';
        }
        data.balance = Money.total();
        var _html = template('profileTpl', data);
        WM.Phone.get({
            type: 'slideBox',
            html: _html,
            title: '我',
            style: { padding: 0 },
            hasFoot: false,
            ready: function () {
                var t = this;
                var box = this.find('#j_profilePopPanel');
                this.find('.wm_slideTitle').css({ 'padding': '15px 15px 0 15px' });
                this.find('.wm_slideTitleLine').css({ 'top': '16px', 'left': '10px' });
                this.find('.wm_slideCloseBox').css({ 'top': '7px', 'right': '3px' });
                this.find('.wm_slideBody').css({ 'padding-top': '0' });

                /* 换肤 */
                if (App.skinModule.sel != null) {
                    $(box).find('.oneSkin').eq(App.skinModule.sel).addClass('newMy_sky_sel').siblings('.oneSkin').removeClass('newMy_sky_sel');
                }
                $(box).find('.oneSkin').on('click', function () {
                    if ($(this).hasClass('newMy_sky_sel'))
                        return;
                    $(this).addClass('newMy_sky_sel').siblings('.oneSkin').removeClass('newMy_sky_sel');
                    App.skinModule.change($(this).index());
                    t.close();
                });
                $(box).find('.j_encharge').on('click', function () {
                    self.showEncharge();
                });
                
            }
        });
    },
    showEncharge: function () {
        var data = [10, 20, 50, 100, 200, 500];
        var html = '<div class="recharge j_enchargeBox">';
        html += '<div class="moreList j_enchargeList">';
        for (var i = 0; i < data.length; i++) {
            html += '<div num="' + data[i] + '"  class="oneRow j_preEncharge" style="text-align:center">';
            html += '<span>' + data[i] + '&nbsp;元</span>';
            html += '</div>';
        }
        html += '</div>';
        html += '</div>';
	    $(html).appendTo($('body'));
        setTimeout(function(){
	        $('.j_enchargeList').addClass('change');
	    },50);

        $('.j_enchargeBox').on('click', function(){
            $('.j_enchargeList').removeClass('change');
            setTimeout(function(){
                $('.j_enchargeBox').remove();
            },200);
        }).on('click','.j_preEncharge', function(e){
            e.stopPropagation();
            var num = $(this).attr('num');
            WM.Phone.get({
                type:'confirm',
                title:'提示',
                innerHTML:'确认充值 <strong>'+num+'</strong> 元？',
                click:function(b){
                    if(!b)
                        return this.close();
                    Money.jumpEncharge(num);
                }
            });
        });
    }
};


App.MsgModule = {
    $cnt: null,
    MSG_TYPE: {
        TEXT: 0,
        PHOTO: 1,
        GIVE: 2,         // 打赏,
        RED_BAG: 3,     // 红包
        VOTE: 5,        // 投票,
        SONG: 4,         // 点歌
        WORDS_AND_PHOTO: 6,
        RED_BAG_GOT: 7
    },
    STATUS: {
        REMOVE: 4,
        NOT_SHOW: 3,
        BA: 2,
        NOT_BA: 1
    },
    init: function () {
        var self = this;
        this.$cnt = $('.onWallMain').show();
        this.$cnt.on('click', '.j_delMsg', function () {
            self.delMsg($(this));
        }).on('click', '.j_showSparmForTa', function () {
            App.SpamScreenModule.showPanel($(this), true);
        }).on('click', '.j_showImage', function () {
            self.showImage($(this));
        });
    },
    getCnt: function () {
        return this.$cnt;
    },
    showImage: function (e) {
        var src = $(e).attr('src');
        if (src) {
            WM.Phone.showImage(src);
        }
    },
    createItem: function (item) {
        item = App.BasicFilter(item);
        item.content = App.SensitiveModule.filter(item.content);
        if (item.type === this.MSG_TYPE.GIVE) {
            if (item.giveInfo) {
                return this.dsMsg(item);
            } else {
                return '';
            }
        } else if (item.type === this.MSG_TYPE.VOTE) {

        } else if (item.type === this.MSG_TYPE.RED_BAG) {
            return this.redBagMsg(item);
        } else if (item.type === this.MSG_TYPE.SONG) {
        } else if (item.type === this.MSG_TYPE.RED_BAG_GOT) {
            return item.redPackageGiveUserId === Global.User.userId ? this.redBagGotMsg(item) : '';
        } else {
            if (item.status === this.STATUS.BA) {
                return this.bpMsg(item);
            }
            return this.normalMsg(item);
        }
    },
    redBagGotMsg: function (item) {
        var text = item.nickName + '领取了你的红包';
        if(item.redPackageGiveUserId === Global.User.userId){
            if(item.userId === Global.User.userId){
                text = '你领取了自己的红包';
            }
            return '<div class="getRedBagTxt row">\
                <span><i class="onWall_redBagIconMini"></i>'
            + text + '</span></div>';
        }else{
            return '';
        }
        
    },
    bpMsg: function (item) {
        var bpIcon = 'txt-Icon ';
        var bNames = '';
        switch (item.barpinTheme) {
            case 1: bpIcon += 'txt-cakeIcon'; bNames = '生日霸屏'; break;
            case 2: bpIcon += 'txt-loveIcon'; bNames = '示爱霸屏'; break;
            case 3: bpIcon += 'txt-trystIcon'; bNames = '求约霸屏'; break;
            case 4: bpIcon += 'txt-proposeIcon'; bNames = '求婚霸屏'; break;
            case 5: bpIcon += 'txt-beautifulIcon'; bNames = '女神霸屏'; break;
            default: bpIcon += 'txt-bpIcon'; bNames = '重金霸屏'; break;
        }
        item._bpIcon = bpIcon;
        item._bpTxt = bNames + item.second + '秒  ' + (item.times > 1 ? item.times + '次' : '');
        item._normalMsgCls = '';
        return this.normalMsg(item);
    },
    dsMsg: function (item) {
        item._dsIcon = 'txt-Icon txt-dsIcon';
        item._normalMsgCls = '';
        return this.normalMsg(item);
    },
    normalMsg: function (item) {
        if (typeof item._normalMsgCls === 'undefined') {
            item._normalMsgCls = 'normalMsg';
            if (!item.isSelf && item.msgImgUrl) {
                item._onlyText = '';
            } else {
                item._onlyText = 'onlyText';
            }
        }
        return template('msgTpl', item);
    },
    redBagMsg: function (item) {
        return template('redBagTpl', item);
    },
    createHtml: function (data) {
        var self = this;
        var html = '';
        data = $.isArray(data) ? data : [data];
        data.forEach(function (item) {
            if (itemCheck(item)) {
                html += self.createItem(item);
            }
        });
        function itemCheck(item) {
            if (self.willShow(item) && !self.isForTaBp(item) && !self.isDulplicate(item)) {
                return true;
            }
            return false;
        }
        return html;
    },
    replaceHtml: function (item) {
        var $oldEl = this.$cnt.find('.j_row[mid="' + item.messageId + '"]');
        var _html = this.createItem(item);
        $oldEl.replaceWith(_html);
    },
    willShow: function (item) {
        var $oldEl = null;
        if (item.status === this.STATUS.REMOVE) {
            $oldEl = this.$cnt.find('.j_row[mid="' + item.messageId + '"]');
            if ($oldEl.length) {
                $oldEl.remove();// 删除一条消息
            }
            return false;
        } else if (item.status === this.STATUS.NOT_SHOW) {
            return false;
        } else {
            return true;
        }
    },
    isDulplicate: function (item) {
        if (this.$cnt.find('.j_row[mid="' + item.messageId + '"]').length) {
            return true;
        }
        return false;
    },
    isForTaBp: function (item) {
        var $oldEl = this.$cnt.find('.j_row[mid="' + item.messageId + '"]');
        var status = $oldEl.data('status');
        if (status == this.STATUS.NOT_BA && item.status === this.STATUS.BA) {
            this.replaceHtml(item);
            return true;
        }
        return false;
    },
    appendData: function (data, isForTa) {
        if (isForTa === true) {
            this.$cnt.append(this.replaceHtml(data));
        } else {
            this.$cnt.append(this.createHtml(data));
            App.ScrollModule.down();
        }
    },
    prependData: function (data) {
        this.$cnt.prepend(this.createHtml(data));
    },
    ajaxDelMsg: function (data) {
        return $.ajax({
            url: Global.API_BASE + '/h5/deleteBarrage',
            data: $.extend({
                openId: Global.openId,
                merchantId: Global.merchantId
            }, data)
        });
    },
    delMsg: function ($del) {
        var self = this;
        WM.Phone.get({
            type: 'confirm',
            title: '删除',
            innerHTML: '确定删除此上墙内容？',
            click: function (b) {
                if (!b)
                    return this.close();
                var rowEl = $del.closest('.j_row');
                var mid = rowEl.attr('mid');
                var userId = Global.User.userId;
                if (userId === 'wemewSystem') {
                    rowEl.remove();
                    this.close();
                }
                var t = this;
                WM.Phone.setButton(this.getButton()[1], false);
                self.ajaxDelMsg({
                    messageId: mid
                }).then(function (res) {
                    if (res && res.code === 0) {
                        rowEl.remove();
                        t.close();
                        self.checkNull();
                    } else {
                        WM.Phone.setButton(t.getButton()[1], true);
                        App.showInfo(res && res.message || '删除失败', false);
                    }
                }, function (res) {
                    WM.Phone.setButton(t.getButton()[1], true);
                    App.showInfo(res && res.message || '删除失败', false);
                });
            }
        });
    },

    checkNull: function () {
        if ($('.row').length > 0) {
            return $('#onWallnull').remove();
        }
        if ($('#onWallnull').length > 0)
            return;
        try {
            var barName = document.title;
            $('<div id="onWallnull" style="text-align:center; font-size:13px; color:#fff; padding:20px 0; text-shadow:0 0 5px #000;">欢迎来到' + barName + '</div>').insertBefore($('#first'));
        } catch (ex) { }
    }
};






$(function () {
    Global.login().then(function () {
        $.getJSON('/h5/getMerchantInfoWhenLogin', { merchantId: Global.merchantId }).then(function (res) {
            if (res && res.code === 0 && res.data) {
                document.title = res.data.name;
            }
        });
        Promise.all([Global.loadUserInfo(), Money.init()]).then(function () {
            App.skinModule.init();
            App.ScrollModule.init(function () {
                new LoadModule().init();
            });
            App.MsgModule.init();
            App.MsgFormModule.init();
            App.FaceModule.init($('.j_popFacePanel'), $('#txt'));
            App.RBModule.init();
            App.SpamScreenModule.init();
            App.UserBoxModule.init();

            App.GiftModule.init();
            App.DsModule.init();
            WebsocketModule.connect({
                chatId: Global.merchantId,
                callback: function (json) {
                    App.MsgModule.appendData(json);
                }
            });
        });
    });
});

