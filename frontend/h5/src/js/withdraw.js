$(function () {
    var config = {
        min: 1,
        max: 200
    }
    var sel = function (t) {
        if ($(t).find('i').hasClass('selNoSelect')) {
            $(t).find('i').removeClass('selNoSelect').addClass('selSelect');
            var allMoney = parseFloat($('#allMoney').html());
            if (allMoney > config.max)
                App.showInfo('每次提现最大金额' + config.max + '元', false);
            var m = allMoney > config.max ? config.max : allMoney;
            $('#money').val(parseFloat(m).toFixed(2));
        } else {
            $(t).find('i').removeClass('selSelect').addClass('selNoSelect');
            $('#money').val('');
        }
        checkInput();
    }
    var checkInput = function () {
        var val = $.trim($('#money').val());
        if (val == 0)
            $('#getMoneyBtn').addClass('disabled');
        else {
            if (parseFloat(val))
                return $('#getMoneyBtn').removeClass('disabled');
            $('#getMoneyBtn').addClass('disabled');
        }
    }

    var getMoney = function () {
        if ($('#getMoneyBtn').hasClass('disabled'))
            return showInfo('请输入提现金额', false);
        var money = $.trim($('#money').val());
        if (isNaN(money))
            return showInfo('请正确设置提现金额', false);
        money = parseFloat(money);
        if (money < config.min)
            return showInfo('每次提现最小金额不能小于' + config.min + '元', false);
        if (money > config.max)
            return showInfo('每次提现最大金额不能大于' + config.max + '元', false);
        if (!/^[+]?([0-9]+(.[0-9]{1,2})?)$/.test(money))
            return showInfo('提现金额最多输入两位小数', false);
        if (money > parseFloat($('#allMoney').text()))
            return showInfo('可提现的余额不足', false);
        WM.Phone.get({
            type: 'confirm',
            title: '提现',
            innerHTML: '确定提现 ' + money.toFixed(2) + '元？',
            click: function (b) {
                this.close();
                if (!b)
                    return;
                var newAllMoney = parseFloat($('#allMoney').text()) - money;
                WM.Phone.setButton($('#getMoneyBtn')[0], false, '操作中');
                ajax_getMoney(money).then(function (res) {
                    if(res && res.code === 0){
                        App.showInfo('提现成功');
                        setTimeout(function () {
                            WM.Phone.Reload();
                        }, 1300);
                    }else{
                        App.showInfo(res && res.message || '操作失败', false);    
                    }
                }, function (res) {
                    App.showInfo(res && res.message || '操作失败', false);
                    setTimeout(function () {
                        WM.Phone.Reload();
                    }, 1300);
                });
            }
        });
    }

    function ajax_getMoney(money){
        return $.post('/h5/withdraw',{
            amount: money
        });
    }
    
    var withdraw = {
        init: function(){
            this.initBalance();
            this.setCopyRight();
            this.initEvent();
        },
        initEvent: function(){
            $('#getMoneyBtn').on('click', function(){
                var $el = $(this);
                if(!$el.hasClass('disabled')){
                    getMoney();
                }
            });
            $('#money').bind('input', function () {
                checkInput();
            });
            $('#getAll').on('click', function(){
                sel($(this));
            });
        },
        doWithdraw: function(){

        },
        initBalance: function(){
            this.loadBanlance().then(function(json){
                $('#allMoney').html(json.balance);
                if (json.balance > config.min) {
                    $('#getMoneyBtn').removeClass('disabled');
                }
            })
        },
        loadBanlance: function(){
            return $.post('/h5/getUserBalance').then(function(res){
                if(res && res.code === 0 && res.data){
                    return res.data;
                }
            });
        },
        setCopyRight: function(){
            $('.wm_main').css({minHeight:$(window).height()-$('.copyNormal')[0].offsetHeight-40});
	        $('.copyNormal').css({visibility:'visible'});	
        }
    };

    withdraw.init();
});