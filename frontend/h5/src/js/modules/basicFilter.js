App.BasicFilter = (function () {
    return function (item) {
        item._sexCls = (item.sex || item.fromSex) === '男' ? 'man' : 'woman';
        item._isSelf = (item.fromUserId == Global.User.userId || item.userId == Global.User.userId);
        item._ownerCls = item._isSelf ? 'myTxt' : 'other';
        
        item._timeStr = App.Utils.fmDate(item.createTime, 'MM-DD hh:mm');
        item._hasTextCls = item.content ? 'hasText' : '';
        var imgArr = item.msgImgUrl && item.msgImgUrl.split('|');
        if (imgArr && imgArr.length > 1) {
            item._imgArr = imgArr;
        }
        //允许为TA霸屏
        if (imgArr && !item._isSelf && item.status === App.MsgModule.STATUS.NOT_BA && 
            item.type !== App.MsgModule.MSG_TYPE.GIVE) {
            item._forTaBp = true;
        } else {
            item._hideLineCls = 'f-hidden';
        }

        if(item.content){
            item.content = App.FaceModule.replaceText(item.content);
        }else if(item.message){
            item.message = App.FaceModule.replaceText(item.message);
        }
        
        return item;
    }
})();
export default ApplicationCache.BasicFilter;