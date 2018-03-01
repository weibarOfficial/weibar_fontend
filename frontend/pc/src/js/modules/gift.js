var GiftModule = {
    giftData: null,
    dtd: new $.Deferred(),
    init: function(options){
        this.ajaxData(options.merchantId);
        return this.dtd;
    },
    ajaxData: function(merchantId){
        var self = this;
        return $.getJSON('/pc/goodsSettingInfo',{
            merchantId: merchantId
        }).then(function(res){
            if(res && res.code === 0 && res.data){
                self.giftData = res.data;
                self.dtd.resolve(res.data);
            }else{
                alert('礼物列表获取失败');
            }
        })
    },
    getById: function(id){
        for(var i=0; i < this.giftData.length; i++){
            if(this.giftData[i].goodsId == id){
                return this.giftData[i];
            }
        }
    },
    getData: function(){
        return this.dtd;
    }
};
export default GiftModule;