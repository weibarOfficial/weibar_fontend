import FaceModule from './face';

import GiftModule from './gift';

//普通消息控制器
var msgControl = {
	config: {},
	running: false,
	able: true,
	newMsgNum: null,
	addArray: [],
	delArray: [],
	replaceArray: [],
	
	index: 0, // 历史显示消息计数，值越小，距离现在越久。
	oldIndex: 0, // 当前展示最小（最旧）消息索引。

	MSG_TYPE: {
		TEXT: 0,
		PHOTO: 1,
		GIVE: 2,         // 打赏,
		RED_BAG: 3,     // 红包
		VOTE: 5,        // 投票,
		SONG: 4,         // 点歌
		WORDS_AND_PHOTO: 6,
		RED_BAG_GOT: 7
	},
	STATUS: {
        NOT_SHOW: 3,
		BA: 2,
		NOT_BA: 1
	},
	createItem: function (item) {
		this.filterData(item);
		this.addLoopImage(item);
		if (item.type === this.MSG_TYPE.GIVE) {
			if (item.giveInfo && item.giveInfo.goodsId) {
				return this.dsMsg(item);
			} else {
				return '';
			}
		} else if (item.type === this.MSG_TYPE.VOTE) {

		} else if (item.type === this.MSG_TYPE.RED_BAG) {
			return this.redBagMsg(item);
		} else if (item.type === this.MSG_TYPE.SONG) {
		} else if (item.type === this.MSG_TYPE.RED_BAG_GOT) {
			return ''//this.redBagGotMsg(item);
		} else {
			if (item.status === this.STATUS.BA) {
				return this.bpMsg(item);
			}
			return this.normalMsg(item);
		}
	},

	createHtml: function (data) {
		var self = this;
		var html = '';
        data = $.isArray(data) ? data: [data];
		data.forEach(function (item) {
            if(itemCheck(item)){
                html += self.createItem(item);
            }
        });
        function itemCheck(item){
            if (self.willShow(item) && !self.isDulplicate(item)) {
                return true;
            }
            return false;
        }
		return html;
	},
	willShow: function(item){
        var $oldEl = null;
        if(item.status === this.STATUS.NOT_SHOW){
            $oldEl = this.$cnt.find('.j_onWallMsg[mid="' + item.messageId + '"]');
            if($oldEl.length) {
                $oldEl.remove();// 删除一条消息
            }
            return false;
        }else{
            return true;
        }
    },
	isDulplicate: function (item) {
		if (this.$cnt.find('.j_onWallMsg[mid="' + item.messageId + '"]').length) {
			return true;
		}
		return false;
	},
	bpMsg: function (item) {
		var _typeCls = 'longMsg ';
		var _typeIconCls = '';
		var _typeCls = 'txt-Icon ';
		var bNames = '';
		switch (item.theme) {
			case 0: _typeCls += 'themeMsg0'; bNames = '示爱霸屏'; _typeIconCls = 'themeIcon_love'; break;
			case 1: _typeCls += 'themeMsg1'; bNames = '求约霸屏'; _typeIconCls = 'themeIcon_tryst'; break;
			case 2: _typeCls += 'themeMsg2'; bNames = '求婚霸屏'; _typeIconCls = 'themeIcon_propose'; break;
			case 3: _typeCls += 'themeMsg3'; bNames = '女神霸屏'; _typeIconCls = 'themeIcon_beautiful'; break;
			case 4: _typeCls += 'themeMsg4'; bNames = '生日霸屏'; _typeIconCls = 'themeIcon_cake'; break;
			default: _typeCls += 'themeMsgBp'; bNames = '重金霸屏'; _typeIconCls = 'themeIcon_default'; break;
		}
		item._typeCls = _typeCls;
		item._typeIconCls = _typeIconCls;
		item._extroHtml = bNames + item.second + '秒  ' + (item.times > 1 ? item.times + '次' : '');
		item._highLightCls = 'richText';
		return this.normalMsg(item);
	},
	redBagMsg: function (item) {
		item._highLightCls = 'redBagText';
		item._extroHtml = `<i class="newDsIcon_redbag"></i>发出${item.redPackageAmount}元红包`;
		item._contentHtml = item.redPackageTitle;
		return this.normalMsg(item);
	},
	dsMsg: function(item){
		var giftItem = GiftModule.getById(item.giveInfo.goodsId);
		item._highLightCls = 'dsText';
		item._extroHtml = `<img src="${giftItem.goodsImgUrl}" style="height:46px;"/>打赏给 ${item.giveInfo.givenUserName} ${giftItem.goodsName}`;
		item._contentHtml = item.giveInfo.content || giftItem.goodsMsg;
		return this.normalMsg(item);
	},
	normalMsg: function (item) {
		if (item._extroHtml && item._contentHtml) {
			item._extroHtml += ':';
		}
		
		item._index = this.getIndex();
		return template('msgTpl', item);
	},
	appendData: function (data) {
		this.$cnt.append(this.createHtml(data));
	},
	getOld: function () {
		var $oldEl = null;
		this.oldIndex += 1;
		while(this.oldIndex <= this.index) {
			$oldEl = this.$cnt.find('.j_onWallMsg[index=' + this.oldIndex + ']');
			if($oldEl.length) {
				break;
			}
			this.oldIndex += 1;
		}
		return $oldEl;
	},
	getIndex: function () {
		this.index += 1;
		return this.index;
	},
	replaceMsg: function (item) {
		var lastObj = this.getOld();
		var html = this.createItem(item);
		$(lastObj).replaceWith(html);
	},
	replaceData: function(data){
		data = $.isArray(data) ? data: [data];
		data.forEach(function(item){
			this.replaceMsg(item);
		}.bind(this));
	},
	add: function (data) {
		if (this.running){
			this.addArray = this.addArray.concat(data);
		}else{
			var len = this.$cnt.find('.j_onWallMsg').length;
			if (len >= SystemControl.data.msgNum) {
				this.replaceData(data);
				return;
			}else{
				this.appendData(data);
			}
		}
	},
	init: function (data) {
		this.start();
		this.$cnt = $('#msgBox');
	},
	start: function () {
		var t = this;
		// console.log('SystemControl.data',SystemControl.data);
		var delay = SystemControl.data._msgDelay - 1000;

		delay = delay < 1000 ? 1000 : delay;
		setTimeout(function () {
			try { clearTimeout(t.interval) } catch (ex) { }
			t.interval = setTimeout(function delayFn() {
				var len = $('#msgBox').find('.j_onWallMsg').length;
				if (len >= 4 && t.able)
					t.scroll();
				else
					t.interval = setTimeout(delayFn, 1000);
			}, 1000);
		}, delay);
	},
	setAble: function (b) {
		this.able = b;
	},
	remove: function (id) {
		if (this.running)
			return this.delArray.push(id);
		$('#' + id).remove();
	},
	scroll: function () {
		this.running = true;
		var firstChild = this.$cnt.find('.j_onWallMsg')[0];
		if (!$(firstChild).hasClass('module-box')) {
			var node = firstChild.cloneNode(true);
			this.$cnt[0].appendChild(node);
		}
		var t = this;

		if (App.public.isHidden()) {
			this.$cnt.css({ transition: 'none' });
			this.$cnt.css({ transform: 'translate3d(0,0,0)' });
			this.$cnt.animate({
				top: this.$cnt[0].offsetTop - firstChild.offsetHeight - 10
			}, 'normal', function () {
				t.afterScroll();
			});
		} else {
			setTimeout(function () {
				t.afterScroll();
			}, 550);
			this.$cnt.css({ transition: 'transform 0.5s' });
			this.$cnt.css({ transform: 'translate3d(0,' + (this.$cnt[0].offsetTop - firstChild.offsetHeight - 10) + 'px,0)' });
		}
	},
	afterScroll: function () {
		if (this.$cnt.find('.j_onWallMsg')[0])
			$(this.$cnt.find('.j_onWallMsg')[0]).remove();
		this.$cnt.css({ top: 0 });
		this.$cnt.css({ transition: 'none' });
		this.$cnt.css({ transform: 'translate3d(0,0,0)' });
		this.running = false;
		var arr1 = this.addArray;
		var arr2 = this.delArray;
		if (arr1.length > 0) {
			for (var x = 0; x < arr1.length; x++) {
				this.add(arr1[x]);
			}
		}
		if (arr2.length > 0) {
			for (var x = 0; x < arr2.length; x++) {
				this.remove(arr2[x]);
			}
		}
		// this.createAll(this.replaceArray);
		// this.replaceArray = null;
		this.addArray = [];
		this.delArray = [];

		this.start();
	},
	createAll: function (data) {
		// this.filterData(data);
		// var html = template('msgTpl',data);
		// $('#msgBox').html(html);
		// this.setIndex();
		// this.replaceArray = null;	
	},
	addLoopImage: function (data) {
		data = $.isArray(data) ? data : [data];
		data.forEach(function (item) {
			if (item._imgArr && item._imgArr.length) {
				item._imgArr.forEach(function (pic) {
					loopImageControl.add(pic);
				});
			}
		});
	},
	filterData: function (item) {
		item._contentHtml = FaceModule.replaceText(item.content);
		item._extroHtml = '';
		item._dateStr = App.Utils.fmDate(item.createTime, 'MM-DD hh:mm');
		item._sexCls = item.sex === '男' ? 'man' : 'woman';
		item._imgArr = item.msgImgUrl && item.msgImgUrl.split('|');
	},
	firstLoad: function () {

		return this.ajaxLoad({
			endTime: Date.now()
		}).then(function (res) {
			if (res && res.code === 0 && res.data) {
				this.appendData(res.data);
				// this.setIndex();
				this.addLoopImage(res.data);
				return res.data;
			}
		}.bind(this));
	},
	ajaxLoad: function (params) {
		params.count = SystemControl.data.msgNum;
		params.merchantId = Global.merchantId;
		return $.ajax({
			url: '/pc/barrageList',
			data: params,
			dataType: 'json',
			method: 'POST'
		});
	}
}

App.MsgModule = msgControl;
export default msgControl;