if (!window.App) { window.App = {}; }

window.allImageUrl = './images/';
window.Global = {
    SESSION_KEY_WX_PAY: 'SESSION_KEY_WX_PAY',
    allImageUrl: allImageUrl,
    API_BASE: '',
    WS_BASE: 'http://120.79.15.148:8080',
    merchantId: App.Utils.urlParam('merchantId') || 1,
    chatId: null,
    User: {
        nickname: 'app测试',
        userId: '1511958518205',
        scopeLevel: 3,
        sex: '男',
        userPicture: ''
    },
    login: function(){
        if (this.DEBUG){
            return $.getJSON(Global.API_BASE + '/test/loginByOpenId',{
                openId: Global.openId
            });
        }else{
            return Promise.resolve();
        }
    },
    loadUserInfo: function(){
        return $.getJSON('/h5/getUserInfo').then(function(res){
            if (res  && res.code === 0){
                $.extend(Global.User, res.data);
            }
        });
    },
    getChatId: function(talkToId=Global.talkToId){
        return $.post(`/h5/getChatId?toUserId=${talkToId}`).then(function(res){
            if (res  && res.code === 0){
                Global.chatId = res.data;
                return res.data;
            }else{
                App.showInfo('获取chatId失败',false);
            }
        });
    }
};

App.errorTip = function (msg) {
    return function (res) {
        App.showInfo(res && res.message || msg || '操作失败，请重试。', false);
    };
};

if (!/MicroMessenger/i.test(navigator.userAgent)) {// debug
    Global.DEBUG = true;
    Global.openId = App.Utils.urlParam('openId') || 'ouc82xNQp2oQstpR6g9MD0Dtjupw';
    // Global.WS_BASE = 'http://120.79.153.237:8080';
}

export default window.Global;