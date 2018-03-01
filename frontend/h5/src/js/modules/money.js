var moneyModule = {
    data:{
        balance: 0 // 单位：元
    },
    init: function(){
        return this.loadData();
    },
    loadData: function(){
        var self = this;
        return $.post('/h5/getUserBalance').then(function(res){
            if(res && res.code === 0 && res.data){
                self.data.balance = res.data.balance;
            }
        });
    },
    total: function(){
        return this.data.balance;
    },
    add: function(val){
        this.data.balance += val;
    },
    sub: function(val){
        this.data.balance = Math.max(this.data.balance - val, 0);
        this.data.balance = +this.data.balance.toFixed(2);
    },
    createDom: function($cnt){
        var total = this.data.balance;
        var _html = `<div id="priceBox" data-wxpay="0" class="moneyChecked">
                        <div class="myRedBagBox">
                            <div class="myRedBagTxt j_isChecked">
                                <span class="myCheckBlack"></span>
                                <span class="myCheckText">账户余额：￥<span id="j_balance">${total}元</span>
                                </span>
                            </div>
                            <div class="myRedBagTxt j_delMoney" style="text-align:right"></div>
                        </div>
                        <div class="lineDiv">需微信支付</div>
                        <div class="lineDiv" id="price">￥<span  id="j_price">0</span></div>
                    </div>`;
        $cnt.html(_html);
        $cnt.find('.j_isChecked').on('click', function(){
            var priceBox = $(this).closest('#priceBox');
            priceBox.toggleClass('moneyChecked');
            if (priceBox.hasClass('moneyChecked')) {
                var wxPay = Math.max(priceBox.data('allprice') - balanceTotal, 0);
                priceBox.data('wxpay', wxPay);
                $('#j_price').html( wxPay.toFixed(2));
            } else {
                $('#j_price').html(priceBox.data('allprice').toFixed(2));
            }
        });
    },
    
    updatePay: function(all){
        all = Math.max(all, 0);
        all = +Number(all).toFixed(2);
        var priceBox = $('#priceBox');
        priceBox.data('allprice', all);
        priceBox.find('.j_delMoney').html("-" + all + '元');
        var wxPay = 0;
        if (priceBox.hasClass('moneyChecked')) {
            wxPay = this.data.balance - all >= 0 ? 0: (all - this.data.balance);
        }else{
            wxPay = all;
        }
        priceBox.data('wxpay', wxPay);
        $('#j_price').html(wxPay.toFixed(2));
    },
    updateBalance: function(){
        this.sub($('#priceBox').data('allprice'));
    },
    requireEncharge: function(amount, payData){
        // var wxPay = $('#priceBox').data('wxpay');
        // var allPrice = $('#priceBox').data('allprice');
        WM.Phone.get({
            type:'confirm',
            title:'支付确认',
            innerHTML: `您的账户余额已不足,还需支付${amount}元，是否前往微信支付？`,
            click:function(bb){
                this.close();
                if(bb){
                    sessionStorage.setItem(Global.SESSION_KEY_WX_PAY, JSON.stringify(payData));
                    window.location.href = `./pay.html?returnurl=` + encodeURIComponent(document.location.href);
                }
            }
        });
    },
    directEncharge: function(amount){
        WM.Phone.get({
            type: 'confirm',
            title: '余额不足',
            innerHTML: '是否前往微信支付？充值金额 ' + amount + '元？',
            click: function (b) {
                this.close();
                if(b){
                   window.location.href = `./pay.html?amount=${amount*100}&returnurl=` + encodeURIComponent(document.location.href);
                }
            }
        });
    },
    jumpEncharge: function(amount){
        window.location.href = `./pay.html?amount=${amount*100}&returnurl=` + encodeURIComponent(document.location.href);
    }
};
export default moneyModule;