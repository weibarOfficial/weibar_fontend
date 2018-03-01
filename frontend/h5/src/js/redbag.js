$(function () {
    template.defaults.imports.dateFormat = App.Utils.fmDate;

    var redBag = {
        init: function(){
            var _this = this;
            this.loadData().then(function(res){
                _this.createDom(res);
            });
        },
        initEvent: function(){
            var setCopy = function(){
                $('.wm_main').css({minHeight:$(window).height()-30-$('.copyNormal')[0].offsetHeight});
                $('.copyNormal').css({visibility:'visible'});		
            };

            $(".look").on("click",function () {
                $('.detailRed').slideToggle();
            });
            $('.onWall_redBagDetailHead').on('load', setCopy);
        },
        createDom: function(res){
            var _html = template('pageTpl', res);
            $('.wm_main').append(_html);
            this.initEvent();
        },
        loadData: function(){
            var params = App.Utils.urlParam();
            return $.getJSON('/h5/getRedPackageList', {
                redPackageId: params.rbid
            }).then(function(res){
                if (res && res.code === 0){
                    return res.data;
                }
            },function(res){
                App.showInfo(res && res.message || '红包详情获取失败', false);
            });
        }
    };

    redBag.init();
});