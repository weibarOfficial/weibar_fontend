import '../modules/global';
import Money from '../modules/money';
import '../modules/basicFilter';

import '../modules/face';
import '../modules/upload';
import '../modules/sensitive';
import '../modules/scroll';
import '../modules/userBox';
import LoadModule from '../modules/load';

import '../modules/gift';
import WebsocketModule from '../modules/websocket';


import '../../style/swiper.css';
import '../../style/basic.css';
import '../../style/wmPhone.css';
import '../../style/newTalk.css'

App.MsgFormModule = {
    $msgCnt: null,
    init: function () {
        this.$msgCnt = $('#j_msgFormCnt');
        this.initUpload();
        this.initEvent();

        this.$msgCnt.find('.j_logo').attr('src', Global.User.userPicture)
            .addClass(Global.User.sex === '男' ? 'man': 'woman' );
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
            url: '/h5/addChat',
            method: 'POST',
            data: {
                toUserId: Global.talkToId,
                content: txt,
                chatId: Global.chatId,
                picUrl: img
            }
        }).done(function (res) {
            if (res && res.code === 0) {
                self.resetForm();
                App.MsgModule.appendData(res.data);
            }else{
                App.showInfo( res && res.message , false);
            }
        }).fail(function (res) {
            App.showInfo( res && res.message , false);
        }).always(function () {
            $btn.removeClass('disabled');
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
        this.$cnt = $('#j_msgCnt').show();
        this.$cnt.on('click', '.j_delMsg', function () {
            self.delMsg($(this));
        }).on('click', '.j_showSparmForTa', function () {
            App.SpamScreenModule.showPanel($(this), true);
        }).on('click', '.j_showImage', function () {
            self.showImage($(this));
        });
        this.initFollowMsg();
    },
    getCnt: function () {
        return this.$cnt;
    },
    initFollowMsg: function(){
        var self = this;
        $.post('/h5/getUserInfoByUserId',{
            userId: Global.talkToId
        }).then(function(res){
            if(res && res.code === 0 && res.data){
                var msg = '我已经关注了公众号，你给我发的消息微信将通知到我';
                if (+res.data.status !== 1){ // 1.用户已经关注公众号;2.未关注
                    msg = '我已经取消关注了公众号，你给我发的消息微信无法通知到我';
                }
                document.title = res.data.nickname;

                var $giftTrigger = $('.j_showGiftPanel');
                $giftTrigger.attr('data-userpic', res.data.userPicture)
                    .attr('data-name', res.data.nickname)
                    .attr('data-uid', res.data.userId);

                $('#j_followMsg').html(
                    self.createItem($.extend(res.data,{
                        createTime:Date.now(),
                        _followMsg: true,
                        fromUserId: res.data.userId,
                        fromUserPic: res.data.userPicture,
                        fromUserNickName: res.data.nickname,
                        fromSex: res.data.sex,
                        message: msg
                    }))
                );
            }
        },function(){

        });
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
            }else{
                return '';
            }
        } else {
            return this.normalMsg(item);
        }
    },
    dsMsg: function(item){
        item._isGift = true;
        return this.normalMsg(item);
    },
    normalMsg: function (item) {
        return template('msgTpl', item);
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
            if (self.willShow(item)  && !self.isDulplicate(item)) {
                return true;
            }
            return false;
        }
        return html;
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
        if (this.$cnt.find('.j_row[mid="' + item.id + '"]').size()) {
            return true;
        }
        return false;
    },
    appendData: function (data) {
        this.$cnt.append(this.createHtml(data));
        App.ScrollModule.down();
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



var FollowPop = {
    show:function(){
        var $html = $(template('followPopTpl',{}));
        $html.appendTo($('body'));
        
        this.bindEvent($html);
    },
    bindEvent: function($box){
        $box.find('.j_closePop').on('click', function(){
            $box.remove();
        });
        var pic = './images/wxQrCode.png';
        $('img').load(function(){
            $('.j_loadingTip').remove();
            $box.find('.j_qrCode').attr('src', pic).css('visibility','visible');
        }).attr('src',pic);
    }
}


$(function () {
    var params = App.Utils.urlParam();
    if (!params.uid) {
        alert('url参数uid丢失');
        return;
    }
    Global.talkToId = params.uid;
    Global.merchantId = params.merchantId;
    Promise.all([Global.loadUserInfo(),Global.getChatId(),Money.init()]).then(function(){
        
        App.ScrollModule.init(function () {
            new LoadModule({
                fromDetail: true
            }).init();
        });
        App.MsgModule.init();
        App.MsgFormModule.init();
        App.FaceModule.init($('.j_popFacePanel'), $('#txt'));
        App.UserBoxModule.init({
            fromDetail: true
        });

        App.GiftModule.init({
            fromDetail: true,
            $triggerEl: $('.j_showGiftPanel'),
            params:{
                chatId: Global.chatId
            }
        });

        // 未关注
        if(Global.User.status !== 1) {
            FollowPop.show();
        }
        WebsocketModule.connect({
            privateChat:true,
            chatId: Global.chatId,
            callback: function(json){
                App.MsgModule.appendData(json);
            }
        });
    });
});

