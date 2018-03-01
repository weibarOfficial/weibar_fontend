App.skinModule = {
    data: [{
        url: 'http://img.wemew.com/wemew/wechat/images/newMy_skin_sky.png',
        text: '星空'
    }, {
        url: 'http://img.wemew.com/wemew/wechat/images/newMy_skin_night.png',
        text: '雨夜'
    }, {
        url: 'http://img.wemew.com/wemew/wechat/images/newMy_skin_magic.png',
        text: '魔法'
    }],
    sel: 0,
    _init: function () {
        var x = localStorage.getItem('_skinBg');
        x = x == null ? 3 : x;
        this.change(x);
    },
    init: function () {
        // return this._init();
        var x = localStorage.getItem('skinBg');
        x = x == null ? 0 : x;
        this.change(x);
    },
    change: function (type) {
        this.sel = type;
        localStorage.setItem('skinBg', type);
        type = type == 0 ? 'skinBg-sky' : (type == 1 ? 'skinBg-night' : 'skinBg-magic');
        $('body').removeClass('skinBg-sky skinBg-night skinBg-magic').addClass(type);
    },
    show: function () {
        var html = '<div class="FuckUser">';
        html += '<div class="FuckHead">皮肤<a class="FuckYou_close"></a></div>';
        html += '';
        html += '</div>';
        html += '<div class="skin-img">';
        html += '<a><img src="' + allImageUrl + 'skinSky-sel.png" /><i class="skin-sel"></i><p>星空</p></a>';
        html += '<a><img src="' + allImageUrl + 'skinNight-sel.png" /><i class="skin-sel"></i><p>雨夜</p></a>';
        html += '<a><img src="' + allImageUrl + 'skinMagic-sel.png" /><i class="skin-sel"></i><p>魔法</p></a>';
        html += '</div>';
        WM.Phone.get({
            type: 'slideBox',
            position: 'absolute',
            style: { padding: 0 },
            hasFoot: false,
            html: html,
            ready: function () {
                var t = this;
                this.find('.wm_slideBody').css({ padding: 0, 'border-radius': '4px 4px 0 0' });
                this.find('.FuckYou_close').bind('click', function () {
                    t.close();
                });
                if (skin.sel != null) {
                    this.find('.skin-img a').eq(skin.sel).addClass('sel-skin');
                }
                this.find('.skin-img a').bind('click', function () {
                    if ($(this).hasClass('sel-skin'))
                        return t.close();
                    t.find('.sel-skin').removeClass('sel-skin');
                    $(this).addClass('sel-skin');
                    skin.change($(this).index());
                    t.close();
                });
            }
        });
    }
};

export default App.skinModule;