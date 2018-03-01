App.RichNotice = {
    deleteId: [],
    list: [],
    noImgSrc: '',//删除图片替代路径
    timer: null,
    toDel: function (id) {
        if (this.deleteId.indexOf(id) == -1) {
            this.deleteId.push(id);
        }
    },
    checkDelete: function (e) {
        if (typeof e.tid == 'undefined' || e.tid == null || e.tid == '')
            return true;
        if (this.deleteId.length == 0)
            return true;
        return this.deleteId.indexOf(e.tid) == -1;
    },
    noImg: function (e) {
        $(e).attr({ src: rich.noImgSrc });
    },
    setImage: function (e) {
        var dir = $(e.parentNode).width() / $(e.parentNode).height();
        if ($(e).width() / $(e).height() <= dir) {
            $(e).css({ width: '100%', left: 0 });
            var mt = ($(e).height() - $(e.parentNode).height()) / -2;
            $(e).css({ marginTop: mt, 'visibility': 'visible' });
        } else {
            $(e).css({ height: '100%' });
            var ml = ($(e).width() - $(e.parentNode).width()) / -2;
            $(e).css({ marginLeft: ml, 'visibility': 'visible' });
        }
    },
    add: function (dt) {
        if(dt.status === App.MsgModule.STATUS.BA || 
            (dt.status === App.MsgModule.STATUS.NOT_BA && dt.type === App.MsgModule.MSG_TYPE.GIVE)){
            this.list.push(dt);
        }  
    },
    init: function () {
        var self = this;
        setTimeout(function checkList() {
            if (self.list.length > 0) {
                var dt = self.list.shift();
                self.show(dt);
            } else
                setTimeout(checkList, 500);
        }, 500);
    },
    show: function (dt) {
        if (dt.msgType == 'ds')
            return this.dsShow(dt);
        if (dt.num > 1 && dt.msgType != 'ds' && dt.msgType != 'cake') {
            rich.loop(dt);
        }
        if(dt.num>1&&dt.msgType!='ds'&&dt.msgType!='cake'){
			rich.loop(dt);	
		}
        if ($('#rich').length > 0)
            return;
        var hasImage = dt.src != null && $.trim(dt.src).length > 0;
        var html = '<div id="rich">';
        if (hasImage) {
            var _src = dt.src;
            if (dt.src.split(',').length > 1)
                _src = dt.src.split(',')[0];
            html += '<div class="richImage">';
            html += '<img onload="rich.setImage(this)" onerror="rich.noImg(this)"  src="' + _src + '" /></div>';
            html += '<div class="richInfo">';
        } else
            html += '<div class="richInfo noImage">';
        if (dt.msg != null && dt.msg.length > 0)
            html += '<div class="richTxt">' + dt.msg + '</div>';
        if (hasImage) {
            var str = (dt.bpForName != null) ? '为 ' + dt.bpForName + ' ' : '';
            if (dt.msg != null && dt.msg.length > 0) {
                html += '<div class="richTime">' + str + '重金霸屏 <b id="richTime">' + dt.richTime + '</b> 秒</div>';
            }
            else
                html += '<div class="richTime noText">' + str + '重金霸屏 <b id="richTime">' + dt.richTime + '</b> 秒</div>';
        }
        html += '<div class="richUser">';
        html += '<a id="' + dt.userId + '" onclick="rich.clickUserHead(this)"><img class="' + dt.sex + '" src="' + dt.head + '" /></a>';
        html += '<div><span class="tableSpan"><tt class="richUserName">' + dt.userName + '</tt>';
        if (!hasImage) {
            var str = (dt.bpForName != null) ? '为 ' + dt.bpForName + ' ' : '';
            html += '<tt class="richTime">' + str + '重金霸屏 <b id="richTime">' + dt.richTime + '</b> 秒</tt>';
        }
        //if(dt.richSit!=null&&dt.richSit!='')
        //html += '<tt class="richSit">座席：<i>'+dt.richSit+'</i></tt>';
        html += '</span></div></div>';

        html += '</div></div>';

        $(html).appendTo($('body'));
        setTimeout(function () {
            Transition.go({
                obj: $('#rich')[0],
                style: { '-webkit-transform': 'scale(1)', 'opacity': 1 }
            });
            rich.count(dt.richTime, false, dt);
        }, 50);
    },
    count: function (time, type, e) {
        time = parseInt(time);
        setTimeout(function () {
            if (!type) {
                var b = rich.checkDelete(e);
                if (!b) {
                    return rich.close(type);
                }
            }
            if (time == -1)
                return rich.close(type);
            setTimeout(arguments.callee, 1000);
            $('#richTime').html(time);
            time--;
        }, 0);
    },
    close: function (type) {
        if (type) {
            return $('#ds').fadeOut(function () {
                $('#ds').remove();
                rich.init();
            });
        }
        //$('.onWall_newIcon2').removeClass('disabled');
        $('#rich').fadeOut(function () {
            $('#rich').remove();
            rich.init();
        });
    },
    dsShow: function (dt, bool) {
        bool = bool == null ? false : bool;
        if (bool)
            dt.giftId = 'cake';
        var className, giftName, countTime;
        var _dsDt = giftData.normal;
        if (parseInt(dt.giftId) > 11) {
            _dsDt = giftData.newDs;
        }
        if (dt.giftId != null && dt.giftId !== '') {
            className = _dsDt[dt.giftId].iconName;
            giftName = _dsDt[dt.giftId].name;
            countTime = _dsDt[dt.giftId].time;
        } else
            rich.close(true);
        //src = ds.imageUrl+className;

        var html = '<div id="ds">';
        //html += '<img class="'+className+'" src="'+src+'.png" />';
        if (dt.src != null && dt.src.length > 0)
            html += '<div class="richImage"><img onload="rich.setImage(this)" src="' + dt.src + '"></div><div class="richInfo">';
        else
            html += '<div class="richInfo noImage">';
        if (bool)
            html += '<div class="dsTxt">为 <tt>' + dt.toName + '</tt> 霸屏：</div>';
        else
            html += '<div class="dsTxt">重金打赏：<tt>' + dt.showName + '</tt></div>';
        html += '<div class="dsObj">' + giftName + '</div>';

        if (dt.msg != null && dt.msg.length > 0)
            html += '<div class="dsTxt" style="margin-top:14px; color:#fff; font-size:14px">' + dt.msg + '</div>';

        html += '<div class="richUser">';
        html += '<a id="' + dt.userId + '" onclick="rich.clickUserHead(this)"><img class="' + dt.sex + '" src="' + dt.head + '"></a>';
        html += '<div><span class="tableSpan"><tt class="richUserName"><tt>' + dt.userName + '</tt>剩余 <b id="richTime" class="dsTime">' + countTime + '</b> 秒</tt></span></div>';
        html += '</div></div></div>';

        $(html).appendTo($('body'));

        setTimeout(function () {
            Transition.go({
                obj: $('#ds')[0],
                style: { '-webkit-transform': 'scale(1)', 'opacity': 1 }
            });
            rich.count(countTime, true, dt);
        }, 50)
    },
    loop: function (dt) {
        setTimeout(function () {
            dt.num = parseInt(dt.num) - 1;
            rich.add(dt);
        }, (parseInt(dt.richTime) - 5) * 1000);
    }
};

export default  = RichNotice;