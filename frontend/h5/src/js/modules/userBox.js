App.UserBoxModule = {
    $box: null,

    imageLoad: false,
    imageData: [],
    ready: true,
    ajaxLoad: false,
    swiper: null,
    loadNum: 3,//每次加载几张图片
    options: {
        fromDetail: false
    },
    init: function (options) {
        $.extend(this.options, options);
        var self = this;
        this.$box = $('.j_userBox').on('click', function () {
            self.close();
        }).on('click','.j_sendGift', function(){
            App.GiftModule.showGiftPanel(self.currEl);
        }).on('click', '.j_talkTo', function(e){
            e.preventDefault();
            var name = self.currEl.attr('data-name'),
                uid = self.currEl.attr('data-uid'),
                pic = self.currEl.attr('data-userpic');
            var merchantId = Global.merchantId;
            location.href = `./talk.html?uid=${uid}&merchantId=${merchantId}`;
        });
        App.MsgModule.getCnt().on('click', '.j_popProfile', function (e) {
            e.preventDefault();
            self.show($(this));
            return false;
        });
    },
    reset: function () {
        this.imageLoad = false;
        this.ajaxLoad = false;
        this.imageData = [];
        this.$box.find('.userBoxAllBg').html('');
        try {
            this.swiper.destroy(true);
        } catch (ex) { }
    },
    setImages: function (n) {
        var one = WM.Phone.loading.getHtml();
        var allImage = $('#swiper-container1 .swiper-slide');
        var newArr = Array.prototype.slice.call(allImage, n, n + this.loadNum);
        for (var x = 0; x < newArr.length; x++) {
            if (!$(newArr[x]).hasClass('loaded')) {
                $(one).insertBefore($(newArr[x]).find('.userBg'));
                $(newArr[x]).addClass('loaded');
                $(newArr[x]).find('img').attr({ src: $(newArr[x]).find('img').attr('_src') });
            }
        }
    },
    imgLoad: function (e) {
        $(e.parentNode).find('.Phone_loading').remove();
        $(e.parentNode).find('.reflectionBox').css({ visibility: 'visible' });
        $(e.parentNode).find('img').css({ visibility: 'visible' });
    },
    load: function (e) {
        this.imageLoad = true;
        this.initImageList();
    },
    showAll: function () {
        $('.userBox .firstSlide').find('.reflectionBox').css({ visibility: 'visible' });
        $('.userBox .firstSlide').find('img').css({ visibility: 'visible' });
        $('.userBox>.Phone_loading').hide();
        $('.userBox').find('.userInfo').show();
    },
    initImageList: function () {
        if (this.imageLoad && this.ajaxLoad) {
            this.imageLoad = false;
            this.ajaxLoad = false;
            var dt = this.imageData;
            var html = '';
            for (var x = 0; x < dt.length; x++)
                html += this.create(dt[x]);
            $(html).appendTo($('#swiper-container1 .swiper-wrapper'));
            this.initSwiper();
            this.showAll();
            this.setImages(0);
        }
    },
    initSwiper: function () {
        var maxLen = $('.swiper-slide').length;
        var self = this;
        this.swiper = new Swiper('#swiper-container1', {
            paginationType: $('.swiper-slide').length > 0 ? 'fraction' : 'bullets',
            onTransitionStart: function (e) {
                if ((e.activeIndex + 1) % self.loadNum == 0)
                    self.setImages(e.activeIndex + 1);
            },
            onInit: function () {
                if (maxLen <= 1) {
                    $('#userTipIndex').html('');
                    return;
                }
                $('#userTipIndex').html(1 + '/' + maxLen + '&nbsp;&nbsp;');
            },
            onSlideChangeEnd: function (e) {
                if (maxLen <= 1)
                    return;
                $('#userTipIndex').html((e.activeIndex + 1) + '/' + maxLen + '&nbsp;&nbsp;');
            }
        });
    },
    close: function () {
        try {
            getUserImage.abort();
        } catch (ex) { }
        $('.userBox').hide();
        this.reset();
        $('.userBoxAllBg').html('');
    },
    create: function (src, bool) {
        if (bool)
            return '<div class="swiper-slide firstSlide loaded"><img src="' + src + '" class="userBg" \
                 onload="App.UserBoxModule.load(this)" onerror="App.UserBoxModule.load(this)"/>\
                 <div class="reflectionBox"><img class="reflection" src="'+ src + '" /></div></div>';

        return '<div class="swiper-slide"><img _src="' + src + '" class="userBg beforeLoad" \
            onerror="App.UserBoxModule.imgLoad(this)" onload="App.UserBoxModule.imgLoad(this)" />\
            <div class="reflectionBox"><img class="reflection beforeLoad" _src="'+ src + '" /></div></div>';
    },
    show: function ($el) {

        this.reset();
        this.currEl = $el;

        var src = $el.attr('data-src') || "";
        var name = $el.attr('data-name') || "";
        var sex = $el.attr('data-sex') || "";
        var age = $el.attr('data-age') || "";
        var cm = $el.attr('data-cm') || "";
        var kg = $el.attr('data-kg') || "";
        var job = $el.attr('data-job') || "";
        var txt = $el.attr('data-txt') || "";
        var tid = $el.attr('data-uid') || "";
        var href = $el.attr('data-url') || "";
        var gradeColor = $el.attr('gradeColor') || '';
        var gradeName = $el.attr('gradeName') || '';
        var userheade = $el.attr('data-userpic') || '';
        var gradeclass = $el.attr('gradeclass') || '';
        var gradeImg = $el.attr('gradeImg') || '';
        if (this.$box.find('.Phone_loading').length === 0) {
            var loading = WM.Phone.loading.getHtml();
            $(loading).appendTo(this.$box);
        } else {
            this.$box.find('.Phone_loading').show();
        }

        var imgHtml = '<div class="swiper-container" id="swiper-container1"><div class="swiper-wrapper">';
        imgHtml += this.create(src, true);
        imgHtml += '</div><div class="swiper-pagination" id="swiper-pagination1" style="position:absolute; bottom:10px;">&nbsp;</div></div>';
        $('.userBoxAllBg').html(imgHtml);
        $('.userInfo .grade_change').html('');
        $('.userInfo .grade_change').append('<img src=' + userheade + ' class="cy_userH" width="40px"/>');
        // $('.userInfo .grade_change').append('<img src=' + gradeImg + ' class="cy_gradeH ' + gradeclass + '" width="50px"/>');
        if (gradeColor != 'qt_color' && gradeName != null && gradeName != '')
            $('.userInfo .grade_change').append('<p class=' + gradeColor + '>' + gradeName + '</p>');
        $('.userInfo .p1').html(name + '<span class="' + (sex == '男' ? 'man' : 'woman') + '">' + sex + '</span>');
        var html = '';
        if (age != null && age != '')
            html += '<span>' + age + '岁&nbsp;&nbsp;/&nbsp;&nbsp;</span>';
        if (cm != null && cm != '')
            html += '<span>' + cm + 'Cm&nbsp;&nbsp;/&nbsp;&nbsp;</span>';
        if (kg != null && kg != '')
            html += '<span>' + kg + 'Kg&nbsp;&nbsp;/&nbsp;&nbsp;</span>';
        if (job != null && job != '')
            html += '<span>' + job + '</span>';
        // if (Global.User.scopeLevel < 13 && this.options.fromDetail !== true) {
        //     html += '<a href="/cwechat/toBuyLevelHome?barid=${barid}" class="iWant">我要升级&gt;</a>'
        // }
        $('.userInfo .p2').html(html + '<p style="clear:both"></p>');
        txt = txt || '';
        $('.userInfo .p3').html(txt);
        if (this.options.fromDetail !== true){
            if (Global.User.userId == tid) {
                // $('.userInfo .aBox').html('<div><a href="' + href + '" class="only">编辑资料</a></div>');
            } else {
                if (Global.isshutup !== true)
                    html = '<div><a class="j_talkTo">私信</a></div><div><a  class="j_sendGift">送礼物</a></div>';
                else
                    html = '<div><a class="only j_sendGift">送礼物</a></div>';

                $('.userInfo .aBox').html(html);
                // if (!$el.hasClass('richerBox'))
                //     $('.userInfo a').eq(1).attr({ src: $el.find('img').attr('src') });
                // else
                //     $('.userInfo a').eq(1).attr({ src: $el.attr('src') });
                // $('.userInfo a').eq(1).attr({ tid: tid });
                // $('.userInfo a').eq(1).attr({ userName: name });
            }
        }
        $('.userBox').show();

        var self = this;
        self.ajax_getUserImage().done(function (imageData) {
            self.imageData = imageData;

            self.initImageList();
        }).fail(function () {
            self.imageData = [];
        }).always(function () {
            self.ajaxLoad = true;
        });
    },
    ajax_getUserImage: function (dt) {
        return (new $.Deferred()).resolve([]);
    }
};

export default App.UserBoxModule;