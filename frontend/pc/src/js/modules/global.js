var App = {
	type:'normal',
	bpFontStyle:''
};

//系统默认设置
App.defaultCfg = {
	title:'',
	bg:0,
	videoCover:5,
	bpType:0,
	fontSize:22,
	_fontSize:26,
	light:10,
    msglight:7,
    sethwBp:true,
	codeOpen:true,
	msgOpen:true,
	msgDelay:5000,
	_msgDelay:3000,
	msgNum:20,
	bpAnimate:true,
	bpAudio:false,
	bgCanvas:1,
	bpCount:true,
	marqueeOpen:true,
	marqueeSize:24,
	marqueeSpeed:1,
	marqueeDelay:8000,
	setEntry:true,
	code:4,
	bpFontSize:0,
	bpFontStyle:0,
	bpHeight:100,
	codeScale:1
};


//公用方法
App.public = {
	setImage:function(e,fn){
		$(e).css({position:'absolute'});
		var width = $(e.parentNode).width(),height = $(e.parentNode).height();
		var dir = width/height;
		var _dir = e.naturalWidth/e.naturalHeight;
		if(_dir<=dir){
			$(e).css({width:'100%',height:'auto',left:0});
			var tHeight = e.naturalHeight*(width/e.naturalWidth);
			var mt = (tHeight-$(e.parentNode).height())/-2;
			$(e).css({top:mt,opacity:'1'}).attr({'data-pave':1});
			if(_dir==dir)
				$(e).attr({'data-pave':0});		
		}else{
			$(e).css({height:'100%',width:'auto',top:0});
			var tWidth = e.naturalWidth*(height/e.naturalHeight);
			var ml = (tWidth-$(e.parentNode).width())/-2;
			$(e).css({left:ml,opacity:'1'}).attr({'data-pave':2});		
		}	
		if(fn)
			fn();		
	},
	centerImage:function(e,fn){
		$(e).css({position:'absolute'});
		var width = $(e.parentNode).width(),height = $(e.parentNode).height();
		var dir = width/height;
		var _dir = e.naturalWidth/e.naturalHeight;
		if(_dir<=dir){
			$(e).css({width:'100%',height:'auto',left:0});
			var tHeight = e.naturalHeight*(width/e.naturalWidth);
			var mt = (tHeight-$(e.parentNode).height())/-2;
			$(e).css({top:mt,visibility:'visible'}).attr({'data-pave':1});
			if(_dir==dir)
				$(e).attr({'data-pave':0});		
		}else{
			$(e).css({height:'100%',width:'auto',top:0});
			var tWidth = e.naturalWidth*(height/e.naturalHeight);
			var ml = (tWidth-$(e.parentNode).width())/-2;
			$(e).css({left:ml,visibility:'visible'}).attr({'data-pave':2});		
		}	
		if(fn)
			fn();		
	},
	getRandom:function(begin,end){
		return parseInt(Math.random()*((end>begin?end-begin:begin-end)+1)+(end>begin?begin:end));	
	},
	getId:function(){
		return ('wemewOnWall'+Math.random()+new Date().getTime()).replace('.','');
	}
};


if(!App.Utils){
	App.Utils = {};
	App.Utils.urlParam = (function(){
		var params = {};
		var str = location.search;
		if (str){
			str = str.substr(1);
		}
		var idx = 0,
			arr = str.split('&');
		for(var i = 0; i < arr.length; i++){
			idx = arr[i].indexOf("=");
			params[arr[i].substring(0,idx)] = decodeURIComponent(arr[i].substring(idx + 1));
		}
		return function(name){
			return name ? params[name] :  params;
		};
	})();
	App.Utils.fmDate = function(timestamp, fm){
		var dt = new Date(+timestamp);
		fm = fm || 'YYYY-MM-DD hh:mm:ss';
		function pd(n){
			return n < 10 ? '0' + n : n;
		}
		
		var result = [dt.getFullYear(), pd(dt.getMonth() + 1), pd(dt.getDate()) ].join('-') + ' ' + 
			[pd(dt.getHours()), pd(dt.getMinutes()), pd(dt.getSeconds()) ].join(':')
		if (fm.indexOf('YYYY') === -1) {
			result = result.replace(/^\d{4}-/,'');
		}
		if (fm.indexOf('ss') === -1) {
			result = result.replace(/:\d{2}$/,'');
		}
		return result;
	};
	App.Utils.getTextLength = function(txt){
		var _len = 0,reg = /^\w$/;
		for(var k=0;k<txt.length;k++){
			if(!reg.test(txt.charAt(k)))
				_len++;
			else
				_len+=0.5;		
		}	
		return _len;
	};
};

window.Global = {
	merchantId: App.Utils.urlParam('merchantId') || 1,
	Merchant: {},
    WS_BASE: 'http://120.79.15.148:8080',
};
if (/DEBUG/i.test(document.location.search)) {// debug
    Global.DEBUG = true;
    Global.WS_BASE = 'http://120.79.153.237:8080';
}


window.App = App;