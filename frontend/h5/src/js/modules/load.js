function LoadModule(config){
    if (config && config.fromDetail) {
        this.ajaxLoadFn = '_ajaxLoadDetail';
    }else{
        this.ajaxLoadFn = 'ajaxLoad';
    }
    this.options = $.extend({
        activeTimer: false,
        params: null
    },config);
}
LoadModule.prototype = {
    hasMore: true,
    loading: false,
    pageCount: 20,
    nowPage: 1,
    preTimestamp: null,
    nextTimestamp:null,
    $loadingEl: null,
    
    init: function () {
        var self = this;
        this.$loadingEl = $('.loadMore');
        this.initTip = new WM.Phone.waiting({ text: '正在为您加载', hasCover: false, clickClose: false });
        $(window).scroll(function () {
            var t = $(window).scrollTop();
            if (t <= 10) {
                self.loadPrevious();
            }
        });
        this.firstLoad();
    },
    startTimer: function(){
        var self = this;
        if(this.options.activeTimer){
            this.timer = setInterval(function(){
                self.loadNext();
            }, 5000);
        }
    },
    loadNext: function(){
        var self = this;
        this[this.ajaxLoadFn]({
            beginTime: this.nextTimestamp
        }).then(function (res) {
            if (res && res.code === 0) {
                if(res.data && res.data.length){
                    self.nextTimestamp = res.data[res.data.length - 1].createTime;
                    App.MsgModule.appendData(res.data);
                }
                
            } else {
                // App.showInfo(res && res.message || '加载失败', false);
            }
        }, function (res) {
        }).always(function () {
            
        });
    },
    loadPrevious: function () {
        var self = this;
        if (this.loading) {
            return;
        }
        if (!this.hasMore) {
            this.$loadingEl.find('tt').html('没有更多了');
            this.$loadingEl.show().removeClass('animate');
            return;
        }
        this.$loadingEl.find('tt').html('正在为您加载');
        this.$loadingEl.show();
        this.loading = true;
        this[this.ajaxLoadFn]({
            endTime: this.preTimestamp
        }).then(function (res) {
            if (res && res.code === 0) {
                self.checkData(res.data);
                App.MsgModule.prependData(res.data);
            } else {
                App.showInfo(res && res.message || '加载失败', false);
            }
        }, function (res) {
            App.showInfo(res && res.message || '加载失败', false);
        }).always(function () {
            self.$loadingEl.hide();
            self.loading = false;
        });
    },
    checkData: function (data) {
        if (!data || !data.length) {
            this.hasMore = false;
        }
        if (data.length) {
            this.preTimestamp = data[0].createTime;
            if(!this.nextTimestamp){
                this.nextTimestamp = data[data.length - 1].createTime;
            }
        }
        
        return data;
    },
    firstLoad: function () {
        var self = this;
        this.loading = true;
        this[this.ajaxLoadFn]({
            endTime: Date.now()
        }).then(function (res) {
            if (res && res.code === 0) {
                self.checkData(res.data);
                App.MsgModule.appendData(res.data);
                self.initTip.close();
                self.startTimer();
            } else {
                App.showInfo(res && res.message || '加载失败', false);
            }
            
        }, function (res) {
            WM.Phone.get({
                type: 'alert',
                innerHTML: res && res.message || '加载失败，请点击确定重试',
                click: function () {
                    this.close();
                    self.firstLoad();
                }
            })
        }).always(function () {
            self.loading = false;
        });
    },
    ajaxLoad: function (params) {
        params.count = this.pageCount;
        params.merchantId = Global.merchantId;
        return $.ajax({
            url: '/h5/barrageList',
            data: params,
            dataType: 'json',
            method: 'POST'
        });
    },
    _ajaxLoadDetail: function(params){
        params.count = this.pageCount;
        params.toUserId = Global.talkToId;
        params.chatId = Global.chatId;
        return $.ajax({
            url: '/h5/chatList',
            data: params,
            dataType: 'json',
            method: 'POST'
        });
    }
};

App.LoadModule = LoadModule;
export default App.LoadModule;