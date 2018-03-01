import '../style/index.styl';

import './modules/global';
import './modules/browser';
import GiftModule from './modules/gift';
import Face from './modules/face';
import LineRange from './modules/lineRange';
import Switcher from './modules/switcher';
import Checker from './modules/checker';


import SliderAnimate from './modules/sliderAnimate';

import videoControl from './modules/videoControl';
import moduleControl from './modules/moduleControl';
// import marqueeControl from './modules/marqueeControl';
import canvasRichBg from './modules/bpControl.bpBg';
import bgControl from './modules/bgControl';
import msgControl from './modules/msgControl';
import loopImageControl from './modules/loopImageControl';

import BpControlModule from  './modules/bpControlCore';
import './modules/bpControl';

import  './modules/bpControl.bpBg';
import SystemControl from  './modules/systemControl';

import tpControl from './modules/tpControl';
import audioControl from './modules/audioControl';
import basicControl from './modules/basicControl';

import WebsocketModule from './modules/websocket';


/*模块*/
var moduleSwitch = {
	index:0,
	createQ:function(id,time){
		Circles.create({
			id:id,
			radius:16,
			value:100,
			maxValue:100,
			width:1,
			text:function(value){
				return '';
			},
			colors:['rgba(255,255,255,0.2)','rgba(255,255,255,0.8)'],
			duration:time*1000
		});
	},
	callback:function(e){
		moduleSwitch.index = $(e).index();
		$('.module_btn.sel').html('');
		$('.module_btn.sel').removeClass('sel');
		$(e).addClass('sel').removeClass('run');
		moduleSwitch.clear($(e).index(),e);
		moduleSwitch.countTime();
	},
	clear:function(index,e){
		try{
			//clearInterval(pointSong.cy_timer);
			cy_myYr.mySwiper.destory();
		}catch(ex){}
		if(!$(e).hasClass('module_btn_pk'))
			tpControl.able = false;
		var arr = $('.oneSwitch');
		for(var x=0;x<arr.length;x++){
			if(x!=0&&x!=index)
				$(arr[x]).html('<div class="oneSwitchBox"></div>');	
		}
	},
	error:function(e,errorMsg){
		if(errorMsg)
			App.public.showInfo(errorMsg);
		$(e).removeClass('run');
		var index = $(e).index();
		var newIndex = index+1>=$('.module_btn').length?0:index+1;	
		moduleSwitch.show($('.module_btn')[newIndex]);
	},
	ajax:function(e,num){
		num = num==null?0:num;
		$(e).addClass('run');
		var index = $(e).index();
		if($(e).hasClass('module_btn_bp')){
			moduleSwitch._show(e);	
		}else if($(e).hasClass('module_btn_ds')){
			cy_myYr.ajax(function(){
				moduleSwitch._show(e);	
			},function(errorMsg){
				errorMsg = num==1?errorMsg:false;
				moduleSwitch.error(e,errorMsg);
			});
		}else if($(e).hasClass('module_btn_pk')){
			tpControl._show(function(){
				moduleSwitch._show(e);
			},function(errorMsg){
				errorMsg = num==1?errorMsg:false;
				moduleSwitch.error(e,errorMsg);	
			});
		}else if($(e).hasClass('module_btn_rb')){
			hitRed.ajax(function(){
				moduleSwitch._show(e);	
			},function(errorMsg){
				errorMsg = num==1?errorMsg:false;
				moduleSwitch.error(e,errorMsg);
			});
		}else if($(e).hasClass('module_btn_song')){
			pointSong.ajax(function(){
				moduleSwitch._show(e);	
			},function(errorMsg){
				errorMsg = num==1?errorMsg:false;
				moduleSwitch.error(e,errorMsg);
			});
		}else if($(e).hasClass('module_btn_richer')){
			newRicher.ajax(function(){
				moduleSwitch._show(e);	
			},function(errorMsg){
				errorMsg = num==1?errorMsg:false;
				moduleSwitch.error(e,errorMsg);
			});
		}
	},
	show:function(e,num){
		num = num==null?0:num;
		if($(e).hasClass('sel'))
			return;
		if($('.module_btn.run').length>0)
			return App.public.showInfo('正在获取数据');
		if(this.index==$(e).index())
			return;
		clearTimeout(this.timeout);
		this.ajax(e,num);
	},
	_show:function(e){
		var index = $(e).index();
		var show = $('.oneSwitch._show');
		if(show.length>0){
			show = show[0];
			$(show).removeClass('_show').addClass('onClose');
			setTimeout(function(){
				$(show).removeClass('onClose').css({'-webkit-transform':'translate3d(100%,0,0)'});
			},700);
		}
		
		if($('.oneSwitch').length>index){
			
			var module = $('.oneSwitch')[index]
			$(module).addClass('onShow');
			setTimeout(function(){
				$(module).removeClass('onShow').css({'-webkit-transform':'translate3d(0,0,0)'}).addClass('_show');
				moduleSwitch.callback(e,index);
			},700);
		}
	},
	timeout:null,
	countTime:function(){
		if($('.module_btn').length<=1)
			return;
		clearTimeout(this.timeout);
		var time = $.trim($('.module_btn.sel').attr('data-time'));
		var id = $('.module_btn.sel').attr('data-id');
		$('.module_btn.sel').html('<tt id="'+id+'"></tt>');
		moduleSwitch.createQ(id,time);
		var index = $('.module_btn.sel').index();
		this.timeout = setTimeout(function(){
			var index = $('.module_btn.sel').index();
			var newIndex = index+1>=$('.module_btn').length?0:index+1;
			moduleSwitch.show($('.module_btn')[newIndex]);
		},time*1000);	
	}
}

var hitRed={
	ajax:function(fn1,fn2){
		var timeout = null;
		timeout = setTimeout(function(){
			if(fn2)
				fn2();
		},10000);
		ajax_getRedBag(function(data){
			try{
				clearTimeout(timeout);
			}catch(ex){}
			hitRed.init(data,fn1,fn2);
		},function(errorMsg){
			fn2(errorMsg);
		});
	},
	init:function (data,callback,error) {
		if(!data){
		   return error('红包榜需要至少3位金主支持才能展示，发动现场金主发红包');
		}
		if(data.length<3)
			return error('红包榜需要至少3位金主支持才能展示，发动现场金主发红包');
		var src1 = allImage.hb_hby,src2 = allImage.hb_jb;
		var html='';
		html+='<div class="hitRedBox _myContainer">';
		html+='<div class="_redRain pa">';
		html+='<div class="_activeAnimate">';
		html+='<img src="'+src1+'" class="_active_img1 _active_img" alt="">';
		html+='<img src="'+src2+'" class="_active_img _active_img2" alt="">';
		html+='<img src="'+src1+'" class="_active_img3 _active_img" alt="">';
		html+='<img src="'+src2+'" class="_active_img _active_img4" alt="">';
		html+='<img src="'+src1+'" class="_active_img5 _active_img" alt="">';
		html+='<img src="'+src2+'" class="_active_img _active_img6" alt="">';
		html+='<img src="'+src1+'" class="_active_img7 _active_img" alt="">';
		html+='<img src="'+src2+'" class="_active_img _active_img8" alt="">';
		html+='<img src="'+src1+'" class="_active_img3 _active_img9" alt="">';
		html+='<img src="'+src2+'" class="_active_img _active_img10" alt="">';
		html+='<img src="'+src1+'" class="_active_img11 _active_img" alt="">';
		html+='<img src="'+src2+'" class="_active_img _active_img12" alt="">';
		html+='<img src="'+src1+'" class="_active_img13 _active_img" alt="">';
		html+='<img src="'+src2+'" class="_active_img _active_img14" alt="">';
		html+='<img src="'+src1+'" class="_active_img13 _active_img" alt="">';
		html+='<img src="'+src2+'" class="_active_img _active_img14" alt="">';
		html+='</div>';
		html+='</div>';
		html+='<img src="'+allImage.hb_tz+'" class="hitRedBg pa" alt="">';
		html+='<div class="hitRedRender clearfix">';
		html+='<div class="tc pr red_title_box ">';
		html+='<h3 class="red_title pa">快来一起砸红包</h3>';
		html+='</div>';
		html+='<div class="_boxRed2 pr">';
		html+='</div>';
		html+='<div class="_boxRed1 pr">';
		html+='</div>';
		html+='<div class="_boxRed3 pr">';
		html+='</div>';
		html+='</div>';

		$('.oneSwitch_rb .oneSwitchBox').html(html);
		for(var i=0;i<data.length;i++){
		   switch(i){
			   case 0:
				   var html1='';
				   html1+='<h3 userId="'+data[0].id+'"  class="pa winer1 ellipsis">'+data[0].name+'</h3>';
				   html1+='<p class="pa red_cont1">'+data[0].num+'个</p>';
				   html1+='<p class="pa red_money1">'+data[0].money+'元</p>';
				   html1+='<img src="'+data[0].shead+'" class="winer_header1 pa" alt="">';
				   html1+='<img src="'+allImage.hb_no1+'" class="red_1 pa" width="400px" alt="">';
				   $("._boxRed1").append(html1);
				   break;
			   case 1:
				   var html1='';
				   html1+='<h3 userId="'+data[1].id+'" class="pa winer2 ellipsis">'+data[1].name+'</h3>';
				   html1+='<p class="pa red_cont">'+data[1].num+'个</p>';
				   html1+='<p class="pa red_money">'+data[1].money+'元</p>';
				   html1+='<img src="'+data[1].shead+'" class="winer_header pa" alt="">';
				   html1+='<img src="'+allImage.hb_no2+'" class="red_2 pa" width="400px" alt="">';
				   $("._boxRed2").append(html1);
				   break;
			   case 2:
				   var html1='';
				   html1+='<h3 userId="'+data[2].id+'" class="pa winer2 ellipsis">'+data[2].name+'</h3>';
				   html1+='<p class="pa red_cont">'+data[2].num+'个</p>';
				   html1+='<p class="pa red_money">'+data[2].money+'元</p>';
				   html1+='<img src="'+data[2].shead+'" class="winer_header pa" alt="">';
				   html1+='<img src="'+allImage.hb_no3+'" class="red_3 pa" width="400px" alt="">';
				   $("._boxRed3").append(html1);
				   break;
		   }
	   }
	   callback();
	}
}

var txtLoop={
	len:1,
	removearr:[],
	append:[],
	scroll:function (data) {
		var height=0;
		if(data.len)
			this.len=data.len;
		for(var i=0;i<this.len;i++){
			var child = data.list[i];
			// var node = child.cloneNode(true);
			// data.box[0].appendChild(node);
			height+=child.offsetHeight
		}
		var offsetTop=data.box[0].offsetTop;
		data.box.css({transition:'transform 1s'});

		data.box.css({transform:'translate3d(0,'+(offsetTop-height-12)+'px,0)'});

		setTimeout(function(){
			txtLoop.after(data.box,data.list);
		},1100);
	},
	after:function (box,list) {
		if(box.length==0)
			return;
		box.css({top:0});
		box.css({transition:'none'});
		setTimeout(function () {
			box.css({transform:'translate3d(0,0,0)'});
			for(var j=0;j<txtLoop.len;j++){
				list.eq(j).remove()
                var child = list[j];
                var node = child.cloneNode(true);
                box[0].appendChild(node);
			}
		},10)
	}
}

var pointSong = {
	ajax:function(fn1,fn2){
		var timeout = null;
		timeout = setTimeout(function(){
			if(fn2)
				fn2();	
		},10000);
		ajax_getSong(function(data){
			try{
				clearTimeout(timeout);
			}catch(ex){}
			pointSong.init(data,fn1,fn2);
		},function(errorMsg){
			fn2(errorMsg);
		});
	},
	init:function (msg,fn1,fn2) {
		clearInterval(pointSong.cy_timer);
		if(msg.isopen==0)
			return fn2('点歌功能已经关闭，在后台完成设置后可开启');
		var data = msg.data;
		if(!data||data.length==0)
			return fn2('酒吧还没有设置好点歌歌单，在后台完成设置后可开启');
		var html='';
		html+='<div class="_songBox clearfix">';
		html+='<div class="_guideBox">';

		html+='</div>';
		html+='<div class="pr _songListBox" style="overflow: hidden;">';
		html+='<div class=" pa" id="colee">';
		html+=' <ul class="_songList" style="width: 70%" id="colee1">';
		var jj = '(',ll = ')';
	   for(var i=0;i<data.length;i++){
		   var _item=data[i];
		   html+='<li class="tc _songName ellipsis">'+(i+1)+'-'+(jj+_item.songname+ll)+'-'+_item.singer+' </li>';
	   }

		html+='</ul>';
		html+='</div>';
		html+='</div>';
		html+=' </div>';
		$(".oneSwitch_song .oneSwitchBox").html(html);
		if($('._songName').length>5){
			pointSong.cy_timer=setInterval(function () {
				if($('._songList').length==0)
					return clearInterval(pointSong.cy_timer);
				txtLoop.scroll({
					box:$('._songList'),
					list:$('._songList ._songName')
				})
			},2200)
		}else{
			clearInterval(pointSong.cy_timer);
		}
		fn1();
	},
	cy_timer:null
}

var newRicher = {
	ajax:function(fn1,fn2){
		var timeout = null;
		timeout = setTimeout(function(){
			if(fn2)
				fn2();	
		},10000);	
		ajax_getRicherList(function(data){
			try{
				clearTimeout(timeout);
			}catch(ex){}
			newRicher.init(data,fn1,fn2);
		},function(errorMsg){
			fn2(errorMsg);
		});		
	},
	init:function(e,callback,error){
		try{
			if(e==null||(e.now.length==0&&e.all.length==0))
				return error('酒吧还没有壕榜用户');
		}catch(ex){
			return error('酒吧还没有壕榜用户');
		}
		var html = '<div id="zd_richer">';
		html += '<div class="zd_richer_head"><span><tt class="zd_richer_wing zd_richer_wing1"></tt>总壕榜<tt class="zd_richer_wing zd_richer_wing2"></tt></span></div>';
		html += '<div class="zd_richer_main">';
		html += '<div class="zd_richer_left"><span class="zd_richer_leftSpan"><img class="richer_no0" src="'+allImage.richer_no0+'" />';
		if(e.now.length>0)
			html += '<img class="zd_richer_top1" src="'+e.now[0].shead+'" /><tt class="ellipsis">'+e.now[0].nickname+'</tt>';
		else
			html += '<img class="zd_richer_top1" src="'+allImage.richer_noUser+'" /><tt class="ellipsis">虚位以待</tt>';
		html += '</span></div>';
		html += '<div class="zd_richer_right"><div class="zd_richer_rows">';
		var list = e.all;
		for(var x=0;x<list.length;x++){
			if(x>=9)
				break;
			var src = allImage.richer_pt,ct = 'richOtherText';
			if(x==0)
				ct = 'rich1Text',src = allImage.richer_no1;
			if(x==1)
				ct = 'rich2Text',src = allImage.richer_no2;
			if(x==2)
				ct = 'rich3Text',src = allImage.richer_no3;
			html += '<span><img class="richer_no" src="'+src+'" /><img class="zd_richer_face" src="'+list[x].shead+'" /><tt class="'+ct+'">'+list[x].nickname+'</tt>';
			if(x>2)
				html += '<i class="richOtherText">'+(x+1)+'</i>';
			html += '</span>';
		}
		html += '</div></div><div style="clear:both;"></div>';
		html += '</div></div>';
		$(".oneSwitch_richer .oneSwitchBox").html(html);
		if(e.now.length==0)
			$('.zd_richer_leftSpan').addClass('show');
		callback();
		setTimeout(function(){
			var delay = 0;
			if(e.now.length>0)
				$('.zd_richer_leftSpan').addClass('animate'),delay = 1000;
			var ones = $('.zd_richer_rows span');
			for(var x=0;x<ones.length;x++){
				(function(x){
					setTimeout(function(){
						$(ones[x]).addClass('animate');	
					},(x*200)+delay);
				})(x);	
			}			
		},500);
	}
}

var cy_myYr={
	ajax:function(fn1,fn2){
		var timeout = null;
		timeout = setTimeout(function(){
			if(fn2)
				fn2();	
		},10000);
		ajax_getYR(function(data){
			try{
				clearTimeout(timeout);
			}catch(ex){}
			cy_myYr.init(data,fn1,fn2);
		},function(errorMsg){
			fn2(errorMsg);
		});
	},
	init:function (data,callback,error) {
		if(!data||data.length==0)
			return error('酒吧还没有设置打赏艺人，在后台完成设置后可开启');
		var html='';
		html+='<div class="cy_yr_swiper-container">'
		html+='<div class="swiper-wrapper">'
		for(var i=0;i<data.length;i++){
			var item=data[i]
			html+='<div class=" clearfix swiper-slide">'
			html+='<div class="myActor">'
			html+='<div class="cy-yr-box1">'
			html+='<div class="yr_guide pr">'
			html+='<div class="pa _arrow">'

			html+='</div>'
			html+='</div>'
			html+='</div>'
			html+='<div class="photo">'
			html+='<img src="'+allImage.ds_yr_zp+'" class="pa ds_yr_zp"  width="340px" height="500px" alt="">'
			html+='<div class="pr cy_actorImg">'
			html+='<img onload="App.public.setImage(this)" src="'+item.head+'" class="pa  _actorImg" alt="">'
			html+='</div>'
			html+='<h3 class="yr_name ellipsis">'+(item.job+'-'+item.name)+'</h3>'
			html+='</div>'

			html+='<div class="goodList pr tc">'
			html+='<div class="_listTitle pa">'

			html+='</div>'
			html+='<div class="cy-yr-bg">'

			html+='</div>'
			html+='<div class="pa loopTxtBox" >'

			html+='<ul class="yr_textloop" id='+item.name+'>'
			if(!item.gift||item.gift.length==0){
                html+='<li class="noGoods pr tc">'
                html+='<p class="tc cy_noGoods">没有礼物数据</p>'
                html+='</li>'
			}else{
                var cy_len=item.gift.length>4?4:item.gift.length
                for(var j=0;j<cy_len;j++){
                    if(parseInt(item.gift[j].giftId)<12)
                        continue;
                    var gift=item.gift[j];
                    html+='<li class="goodsName pr tc">'
//                    html+='<div class="pa cy_lw_img">'
                    html+='<img src="'+(allData.allImageUrl+allData.newDs[gift.giftId].iconName)+'.png"class="pa lw-img" alt="">'
//                    html+='</div>'
                    html+='<p class="pa _name">'+allData.newDs[gift.giftId].name+' &nbsp;&nbsp;&nbsp;<span class="cy_gift_num">X&nbsp;'+gift.num+'</span></p>'
                    html+='</li>'
                }
			}

			html+=' </ul>'

			html+=' </div>'
			html+='</div>'
			html+='</div>'
			html+='</div>'
		}
		html+='</div>'
		html+='</div>'
		$('.oneSwitch_yr .oneSwitchBox').html(html);
		this.mySwiper = new Swiper ('.cy_yr_swiper-container', {
            effect : 'cube',
            cube: {
                slideShadows: false,
                shadow: true,
                shadowOffset: 10,
                shadowScale: 0.2
            },
			autoplay : 6000,
			speed:2500,
			loop: true,
		})
		callback();
	},
	mySwiper:null
};






//窗口焦点
App.public.isHidden = (function(){
	var hidden = '';
	if (typeof document.hidden!=="undefined") {
		hidden = "hidden";
	}else if(typeof document.mozHidden!=="undefined") {
		hidden = "mozHidden";
	}else if(typeof document.msHidden!=="undefined") {
		hidden = "msHidden";
	}else if(typeof document.webkitHidden!=="undefined") {
		hidden = "webkitHidden";
	}else{
		return function(){
			return true;	
		}
	}
	return function(){
		return document[hidden+''];	
	}
})();

//提示消息
App.public._showInfo = function(data){
	var val = '',showClose = false,autoClose = true;
	if(typeof data=='string'){
		val = data;
	}else{
		val = data.txt;
		showClose = data.showClose==null?false:data.showClose;
		autoClose = data.autoClose==null?true:data.autoClose;
	}
	var self = this,timeout;
	if($('.wemewOnWall_showInfo').length>0)
		$('.wemewOnWall_showInfo').remove();
	var id = App.public.getId();
	var html = '<div id="'+id+'" class="wemewOnWall_showInfo"><div class="wemewOnWall_showInfo_main">'+val;
	if(showClose)
		html += '<span class="wemewOnWall_showInfo_close" title="关闭">&times;</span>';
	html += '</div></div>';
	$(html).appendTo($('#all'));
	this.close = function(){
		$('#'+id).find('.wemewOnWall_showInfo_close').unbind('click');
		$('#'+id).animate({
			opacity:0	
		},200,function(){
			$('#'+id).remove();	
		});	
	}
	$('#'+id).find('.wemewOnWall_showInfo_close').bind('click',function(){
		try{
			clearTimeout(timeout);
			self.close();	
		}catch(ex){}
	})
	if(autoClose){
		timeout = setTimeout(function(){
			self.close();
		},3000);
	}
}
App.public.showInfo = function(data){
	new App.public._showInfo(data);	
}

//cookie
App.public.cookie = {
	setCookie:function(name,value,day){
		var dt = new Date();
		dt.setDate(dt.getDate()+day);
		value = value+"";
		document.cookie = name+"="+value+";expires="+dt.toGMTString();
		dt = void(0);	
	},
	getCookie:function(name){
		var cookies = document.cookie.split(";");
		for(var i=0;i<cookies.length;i++){
			cookies[i] = cookies[i].replace(/[ ]/g,"");
			var str = cookies[i].split("=");
			if(str[0]==name){
				return str[1];
			}
		}
		return null;	
	},
	delCookie:function(name){
		this.setCookie(name,'',-1);	
	}	
};




//入口控制器
var entryControl = {
	able:true,
	setAble:function(b){
		this.able = b;	
		if(!b){
			$('.entryNum').hide();	
			$('#onActive').css({top:-220});
			$('.choujiang').css({top:-80});
			$('.sideSpan .sideSpanText tt').css({marginTop:20});		
		}else{
			$('.entryNum').show();
			$('#onActive').css({top:-260});
			$('.choujiang').css({top:-100});
			$('.sideSpan .sideSpanText tt').css({marginTop:10});
		}
	},
	create:function(){
		var html = '';
		for(var i in allData.openActive){
			var e = allData.openActive[i];
			if(e.url!=null&&e.url.length>0){
				html += '<a class="activeSpan" href="'+e.url+'"><i class="icon_module '+e.icon+'"></i>';	
				html += '<span class="">'+i+'</span></a>';
			}
		}
		$('.allActive').html(html+'<div class="clear"></div>');
	},
	init:function(num){
		entryControl.create();
		var width = $('.sideSpan')[0].offsetWidth;
		width -= $('.sideSpanText')[0].offsetWidth;	
		this.width = width;
		$('.sideSpan').css({transform:'translate('+width+'px,0)'});
		$('.sideSpan').addClass('init');
		var t = this;
		$('.sideSpan').bind('mouseover',function(){
			t.show();				
		}).bind('mouseleave',function(){
			t.hide();
		});
		num = num==null?3:num;
		this.set(num);
		this.setAble(this.able);
	},
	timeout:null,
	show:function(){
		clearTimeout(this.timeout);
		$('.sideButton').addClass('show');
		$('.sideSpan').addClass('sideShow').css({transform:'translate(0,0)'});
	},
	hide:function(){
		this.timeout = setTimeout(function(){
			$('.sideButton').removeClass('show');			
		},400);
		$('.sideSpan').removeClass('sideShow').css({transform:'translate('+this.width+'px,0)'});
	},
	set:function(start){
		var allActive = $('.allActive .activeSpan');
		for(var x=0;x<allActive.length;x++){
			start = start==10?17:start;
			var key1 = start>=17?'':97+start-1;
			var key2 = 49+start-1;
			$(allActive[x]).attr({keyCode:start,key1:key1,key2:key2});
			var txt = $(allActive[x]).find('span').text();
			var val = start>=17?String.fromCharCode(key2):start;
			$(allActive[x]).find('span').html(txt+'<tt class="entryNum">&nbsp;'+val+'</tt>');
			start++;
		}
		var t = this;
		$(window).bind('keydown',function(ev){
			if(ev.target.id=='setOnWallTitle')
				return;
			if(!entryControl.able)
				return;
			if(ev.keyCode==0)
				return;
			switch(ev.keyCode){
				case 48:
				case 96:
					if($('#onActive').length>0){
						return window.location.href = $('#onActive').attr('href');		
					}
					break;
				case 97:
				case 49:
					return window.location.href = $('.choujiang').attr('href');
					break;
				case 98:
				case 50:
					if($('.sideSpan').hasClass('sideShow'))
						t.hide();
					else
						t.show();
					return;	
					break;
			}
			for(var x=0;x<allActive.length;x++){
				var e = allActive[x];
				var key1 = $(allActive[x]).attr('key1');
				var key2 = $(allActive[x]).attr('key2');
				if((key1!=''&&ev.keyCode==key1)||(key2!=''&&ev.keyCode==key2)){
					return window.location.href = $(allActive[x]).attr('href');	
				}
			}
		})	
	}
}

//推送控制器
var socketControl = {
	isClose:false,
	interval:null,
	timeout:null,
	init:function(){
		try{
			clearTimeout(socketControl.timeout);
			clearInterval(socketControl.interval);
		}catch(ex){}
		if(typeof WebSocket=='undefined'){
			return alert('您的浏览器太老了，请升级您的浏览器！360、QQ浏览器请使用急速模式');	
		}
		var socket = new WebSocket(allData.ws);
		socket.onopen = function(){
			if(socketControl.isClose){
				console.log('socket断线重连');
				getData();
			}
			socketControl.isClose = false;
		};
		
		socket.onmessage = function(msg){
			try{
				if(msg&&msg.data){
					var dt = JSON.parse(msg.data);	
					if(typeof dt.isDelete!='undefined'&&dt.isDelete!=null&&dt.isDelete!=''){
						bpControl.toDel(dt.msgid);
						return;	
					}
				}
			}catch(ex){}
			getMessage(msg.data);
		};
		socket.onerror = function(){
			socketControl.isClose = true;	
		};
		socket.onclose = function(){
			socketControl.isClose = true;
			try{
				clearTimeout(socketControl.timeout);
				clearInterval(socketControl.interval);
			}catch(ex){}
			socketControl.timeout = setTimeout(function(){
				socketControl.init(allData.ws);	
			},500);
		}
		this.interval = setInterval(function(){
			try{
				socket.send('');
			}catch(ex){}
		},10000);
	}
}

//加载控制器
var loadControl = {
	init:function(){},
	loadDsVideo:function(data){
		data.onComplete = data.onComplete||function(){}	
		var dsDataVideo = [];
		for(var x in allData.dsData){
			dsDataVideo.push(allData.videoUrl+allData.dsData[x].src);	
		}
		videoControl.preload({
			src:dsDataVideo,
			noSupport:function(){
				data.onComplete();
			},
			onError:function(){
				data.onComplete();
			},
			onFail:function(){},
			onComplete:function(_result){
				var _x = 0;
				for(var x in allData.dsData){
					allData.dsData[x].data = _result.length>_x?_result[_x]:null;
					_x++;
				}	
				data.onComplete();
			}
		});
	},
	loadBpVideo:function(data){
		data.onComplete = data.onComplete||function(){}	
		var bpDataVideo = [];
		//bpDataVideo.push(allData.videoUrl+pkVideoBg);
		for(var x=0;x<allData.bpVideoBg.length;x++){
			var oneSrc = allData.bpVideoBg[x];
			if(oneSrc.indexOf('/')==-1)
				oneSrc = allData.videoUrl+oneSrc;
			bpDataVideo.push(oneSrc);					
		}
		videoControl.preload({
			src:bpDataVideo,
			noSupport:function(){
				data.onComplete();
			},
			onError:function(){
				data.onComplete();
			},
			onFail:function(){},
			onComplete:function(_result,playList){
				data.onComplete();
				allData.bpVideoBgData = _result;
				if(data.type!=null&&data.type=='exe')
					return;
				bgControl.init(playList,_result);
			}
		});
	},
	loadThemeVideo:function(data){
		data.onComplete = data.onComplete||function(){}	
		var themeDataVideo = [];
		for(var x=0;x<allData.themeVideo.length;x++)
			themeDataVideo.push(allData.videoUrl+allData.themeVideo[x]);
		for(var y=0;y<allData.themeBgVideo.length;y++)
			themeDataVideo.push(allData.videoUrl+allData.themeBgVideo[y]);
		videoControl.preload({
			src:themeDataVideo,
			noSupport:function(){
				data.onComplete();
			},
			onError:function(){
				data.onComplete();
			},
			onFail:function(){},
			onComplete:function(_result){
				data.onComplete();
			}
		});		
	},
	loadThemeBgVideo:function(data){
		data.onComplete = data.onComplete||function(){}	
		var themeDataVideo = [];
		for(var x=0;x<allData.themeBgVideo.length;x++)
			themeDataVideo.push(allData.videoUrl+allData.themeBgVideo[x]);
		videoControl.preload({
			src:themeDataVideo,
			noSupport:function(){
				data.onComplete();
			},
			onError:function(){
				data.onComplete();
			},
			onFail:function(){},
			onComplete:function(_result){
				data.onComplete();
			}
		});		
	},
	preloadVideo:function(data){
		data.onComplete = data.onComplete||function(){}	
		var dsDataVideo = [];
		for(var x in allData.dsData){
			dsDataVideo.push(allData.videoUrl+allData.dsData[x].src);	
		}
		var bpDataVideo = [];
		for(var x=0;x<allData.bpVideoBg.length;x++){
			var oneSrc = allData.bpVideoBg[x];
			if(oneSrc.indexOf('/')==-1)
				oneSrc = allData.videoUrl+oneSrc;
			bpDataVideo.push(oneSrc);	
		}
		var index = 0;
		var check = function(){
			if(index>=2)
				data.onComplete();	
		}
		videoControl.preload({
			src:dsDataVideo,
			noSupport:function(){
				index++;
				check();
			},
			onError:function(){
				index++;
				check();
			},
			onFail:function(){},
			onComplete:function(_result){
				var _x = 0;
				for(var x in allData.dsData){
					allData.dsData[x].data = _result.length>_x?_result[_x]:null;
					_x++;
				}	
				index++;
				check();
			}
		});
		videoControl.preload({
			src:bpDataVideo,
			noSupport:function(){
				index++;
				check();
			},
			onError:function(){
				index++;
				check();
			},
			onFail:function(){},
			onComplete:function(_result,playList){
				index++;
				check();
				if(data.type!=null&&data.type=='exe')
					return;
				bgControl.init(playList,_result);
			}
		});
	},
	preloadImage:function(config){
		// GiftModule.getData().then(function(giftList){
		// 	if(giftList && giftList.length){
		// 		loadImages(giftList, function(){
					config.onComplete && config.onComplete();
		// 		})
		// 	}
		// });
		function loadImages(list, callback){
			
			var length = list.length;
			var index = 0;
			list.forEach(function(item){
				var img = new Image();
				img.onload = img.onerror = function(){
					index++;
					if(index === length){
						callback && callback();
					}
					this.onload = this.onerror = null;			
				}
				img.src = item.goodsBigUrl;
			})
			
		}
	}
}

//转换普通消息
var setNormalMsg = function(data){
	if(data==null||data==''||data.length==0)
		return [];
	var newArray = [];
	for(var x=0;x<data.length;x++){
		var e = data[x];
		e.user = (typeof e.user=='undefined'||e.user==null)?{}:e.user;
		var msg = null;
		if(e.type=='ds'){
			//打赏 的文字消息
			msg = e.forusername;
		}else{
			//文字 图文 霸屏 蛋糕 的文字消息
			msg = (e.type=='text'||e.type=='news'||e.type=='bp'||e.type=='cake'||e.type=='redBag')?e.message:'';
			msg = (typeof msg=='undefined'||msg==null||msg=='undefined')?'':msg;
		}
		//点歌
		if(e.type=='song')
			msg = e.message||'';
		var newData = {
			/*
			所有消息格式
			text-文字消息 image-图片 news-图文 
			interact-就座 bp-霸屏 ds-打赏 cake-送蛋糕 loveNight-不回家
			redBag-红包 openRedBag-某人抢了红包
			*/
			singer:e.imgurl,
			songName:e.formsg,
			msgType:e.type,
			//消息id
			tid:e.id,
			//红包id
			rbId:e.rbId||'',
			//抢红包人的id
			getId:e.getId||'',
			//抢红包人的昵称
			getterName:e.getterName||'',
			//发红包人的id
			sendId:e.sendId||'',
			redBagMoney:e.forusername,
			//用户信息
			userId:e.user.id||'',
			userName:e.user.nickname||'',
			age:e.user.age||'',
			job:e.user.zy||'',
			kg:e.user.weight||'',
			sex:e.user.sex?'man':'woman',
			cm:e.user.height||'',
			txt:e.user.admireta||'',
			level:e.user.level||null,
			url:'',
			head:e.user.shead||'',
			bigHead:e.user.head||'',
			time:e.timeStr||'',
			
			msg:msg,
			//小图路径
			src:e.simgurl,
			//大图路径
			bigSrc:e.type=='image'?e.message:e.imgurl,	
			//霸屏时间
			richTime:e.pasecond|'',
			//霸屏次数
			showNum:(e.showNum==null||e.showNum==''||parseInt(e.showNum)<1)?1:parseInt(e.showNum),
			//视频路径
			videoUrl:e.videoUrl||'',
			
			//打赏属性
			showName:e.message,//乐队名称
			showTxt:e.formsg,//节目描述
			gift:e.pasecond,//礼物类型0-3
			giftId:e.pasecond,//礼物类型0-3
			showSrc:e.simgurl,//节目小图
			showBigSrc:e.imgurl,//节目原图
			
			//为TA霸屏	
			bpForName:e.forusername,//为谁霸屏
			bpForSrc:e.simgurl,//当时的小图片
			bpForBigSrc:e.imgurl,//当时的原图
			bpForTxt:e.formsg||'',//当时的文字
			
			//就座
			sitMsg:e.message,
			sitId:e.imgurl,
			sitNumber:e.imgurl,
			
			//蛋糕
			toName:e.forusername,
			_time:e.time||'',
			//主题
			theme:(e.theme==null||e.theme.length==0)?-1:e.theme,
			pascreenSort:(typeof e.pascreenSort=='undefined'||e.pascreenSort==null||e.pascreenSort=='')?-1:e.pascreenSort
		}
		newData.src = newData.bigSrc;
		newArray.push(newData);
	}
	return newArray;
}

//转换霸屏类消息
var setBpMsg = function(data,date){
	if(data==null||data==''||data.length==0)
		return [];
	var newArray = [];
	for(var x=0;x<data.length;x++){
		if(data[x].type==8)
			continue;
		var e = data[x];
		var newData = {
			videoUrl:e.videoUrl,
			msgType:e.type==1?'bp':(e.type==5?'cake':(e.type==6?'loveNight':'ds')),
			theme:e.theme,
			tid:e.id,
			toName:e.obj,
			src:e.picUrl,
			dsSrc:e.sPicUrl||'',
			head:e.user.head,
			userName:e.user.nickname,
			level:e.user.level||null,
			sit:'',
			sex:e.user.sex?'man':'woman',
			richTime:e.pasecond,
			num:e.showNum,
			bpForName:(e.obj!=null&&e.obj.length>0)?e.staticfileid:null,
			giftId:e.pasecond,
			showName:'',
			maxLoop:e.maxLoop==null?1:e.maxLoop,
			msg:e.msg,
			pascreenSort:(typeof e.pascreenSort=='undefined'||e.pascreenSort==null||e.pascreenSort=='')?-1:e.pascreenSort,
			qixi:e.giftName,
			pid:e.staticfileid,
			examine:e.examine,
			source:e.source,
			newDate:date||null
		}
		if(newData.msgType=='ds'){
			newData.showName = e.msg;
			newData.msg = e.dsmsg
		}
		newArray.push(newData);
	}
	return newArray;
}




//其他视频
var jPlayerVideo = {
	preload:function(data){
		var url = data.url;
		if(url==null||url.length==0){
			if(data.error)
				data.error();
			return;
		}
		var videoType = this.getType(url);
		if(videoType.length==0){
			if(data.error)
				data.error();
			return;
		}
		$('#jPlayerPreloadBox').remove();
		$('<div id="jPlayerPreloadBox"><div id="jPlayerPreload"></div></div>').appendTo($('body'));
		$('#jPlayerPreload').jPlayer({
			ready: function(){
				var jt = {};
				jt[videoType+''] = url;
				$(this).jPlayer("setMedia",jt);
			},
			progress:function(){
				if(data.complete)
					data.complete();
				$('#jPlayerPreload').jPlayer('destroy');
				$('#jPlayerPreloadBox').remove();
			},
			error:function(){
				if(data.error)
					data.error();
				$('#jPlayerPreload').jPlayer('destroy');
				$('#jPlayerPreloadBox').remove();
			},
			preload:'auto',
			swfPath:jPlayerVideo.swfUrl,
			solution:'flash,html',
			supplied:'m4v,ogv,webmv,flv',
			volume:0,
			wmode:"window"
		});			
	},
	swfUrl:'jquery.jplayer.swf',
	getType:function(url){
		var videoType = url.split('/');
		videoType = videoType[videoType.length-1];
		videoType = videoType.split('.');
		if(videoType.length<2)
			return '';
		videoType = videoType[1];
		videoType = videoType=='mp4'?'m4v':(videoType=='ogv'?'ogv':(videoType=='webm'?'webmv':(videoType=='flv'?'flv':'')));
		return videoType;	
	},
	init:function(url){
		if(url==null||url.length==0)
			return this.close();
		var videoType = this.getType(url);
		if(videoType.length==0)
			return this.close();

		$('#jPlayerBox').jPlayer({
			ready: function(){
				var jt = {};
				jt[videoType+''] = url;
				$(this).jPlayer("setMedia",jt).jPlayer('play');
			},
			error:function(){
				jPlayerVideo.close();
			},
			preload:'auto',
			swfPath:jPlayerVideo.swfUrl,
			solution:'flash,html',
			supplied:'m4v,ogv,webmv,flv',
			size:{},
			volume:0,
			wmode:"window",
			loop:true
		});	
	},
	_fullScreen:function(obj,father){
		$(obj).css({position:'absolute'});
		var ow = obj.offsetWidth,oh = obj.offsetHeight;	
		var objDir = ow/oh;	
		var winW = father.offsetWidth;
		var winH = father.offsetHeight;
		var dir = winW/winH;
		if(objDir<=dir){
			$(obj).css({width:winW,height:winW/objDir,left:0,top:'50%',marginLeft:0});
			var h = winW/objDir;
			$(obj).css({marginTop:h/-2,visibility:'visible'});					
		}else{		
			$(obj).css({height:winH,width:winH*objDir,top:0,left:'50%',marginTop:0});
			var w = winH*objDir;
			$(obj).css({marginLeft:w/-2,visibility:'visible'});				
		}		
	},
	fullScreen:function(obj,father){
		jPlayerVideo._fullScreen(obj,father);
		$(window).bind('resize.jplayerFullScreen',function(){
			jPlayerVideo._fullScreen(obj,father);	
		});
	},
	close:function(){
		$(window).unbind('resize.jplayerFullScreen');
		try{
			$('#jPlayerBox').jPlayer('destroy').remove();
		}catch(ex){}
	}
}

//等级=====================

var cy_get_grade_style={
    get:function (data) {
        var grade_style={};
        grade_style.newG="青铜1级";
        grade_style.imgUrl=''+allData.allImageUrl+'level/qt1.png';
        grade_style.fColor="qt_color";
        grade_style.fBg='qt_bg';
        switch (data){
            case 1 :
                grade_style.newG ="青铜1级" ;
                grade_style.imgUrl=''+allData.allImageUrl+'level/qt1.png'
                grade_style.fColor="qt_color"
                grade_style.fBg='qt_bg';
                break;
            case 2 :
                grade_style.newG ="青铜2级" ;
                grade_style.imgUrl=''+allData.allImageUrl+'level/qt2.png'
                grade_style.fColor="qt_color"
                grade_style.fBg='qt_bg';
                break;
            case 3 :
                grade_style.newG ="青铜3级" ;
                grade_style.imgUrl=''+allData.allImageUrl+'level/qt3.png'
                grade_style.fColor="qt_color"
                grade_style.fBg='qt_bg';
                break;
            case 4 :
                grade_style.newG ="白银4级" ;
                grade_style.imgUrl=''+allData.allImageUrl+'level/by1.png'
                grade_style.fColor="by_color"
                grade_style.fBg='by_bg';
                break;
            case 5 :
                grade_style.newG ="白银5级" ;
                grade_style.imgUrl=''+allData.allImageUrl+'level/by2.png'
                grade_style.fColor="by_color"
                grade_style.fBg='by_bg';
                break;
            case 6 :
                grade_style.newG ="白银6级" ;
                grade_style.imgUrl=''+allData.allImageUrl+'level/by3.png'
                grade_style.fColor="by_color"
                grade_style.fBg='by_bg';
                break;
            case 10 :
                grade_style.newG ="铂金10级" ;
                grade_style.imgUrl=''+allData.allImageUrl+'level/bj1.gif'
                grade_style.fColor="bj_color"
                grade_style.fBg='bj_bg';
                break;
            case 11 :
                grade_style.newG ="铂金11级" ;
                grade_style.imgUrl=''+allData.allImageUrl+'level/bj2.gif'
                grade_style.fColor="bj_color"
                grade_style.fBg='bj_bg';
                break;
            case 12 :
                grade_style.newG ="铂金12级" ;
                grade_style.imgUrl=''+allData.allImageUrl+'level/bj3.gif'
                grade_style.fColor="bj_color"
                grade_style.fBg='bj_bg';
                break;
            case 7 :
                grade_style.newG ="黄金7级" ;
                grade_style.imgUrl=''+allData.allImageUrl+'level/hj1.gif'
                grade_style.fColor="hj_color"
                grade_style.fBg='hj_bg';
                break;
            case 8 :
                grade_style.newG ="黄金8级" ;
                grade_style.imgUrl=''+allData.allImageUrl+'level/hj2.gif'
                grade_style.fColor="hj_color"
                grade_style.fBg='hj_bg';
                break;
            case 9 :
                grade_style.newG ="黄金9级" ;
                grade_style.imgUrl=''+allData.allImageUrl+'level/hj3.gif'
                grade_style.fColor="hj_color"
                grade_style.fBg='hj_bg';
                break;
            case 13 :
                grade_style.newG ="钻石13级" ;
                grade_style.imgUrl=''+allData.allImageUrl+'level/zs1.gif'
                grade_style.fColor="zs_color"
                grade_style.fBg='zs_bg';
                break;
            case 14 :
                grade_style.newG ="钻石14级" ;
                grade_style.imgUrl=''+allData.allImageUrl+'level/zs2.gif'
                grade_style.fColor="zs_color";
                grade_style.fBg='zs_bg';
                break;
            case 15 :
                grade_style.newG ="钻石15级" ;
                grade_style.imgUrl=''+allData.allImageUrl+'level/zs3.gif'
                grade_style.fColor="zs_color";
                grade_style.fBg='zs_bg';
                break;
        }
        return grade_style;
    }
}


//就座送酒控制器
var sitWineControl = {
	checkDelay:3000,
	actionDelay:5000,
	running:false,
	showTime:3500,//显示时间
	list:[],
	addSign:function(tid,name,sitNumber,txt){
		if(tid=='')
			return this.list.push({tid:tid||'',name:name});
		var bool = false;
		for(var x=0;x<this.list.length;x++){
			if(this.list[x].tid==tid)
				return;	
		}
		this.list.push({tid:tid||'',name:name,sitNumber:sitNumber,txt:txt});
	},
	removeList:function(x){
		if(x==0)
			this.list.shift();
		else
			this.list.splice(x,1);	
	},
	start:function(){
		var t = this;
		this.close();
		setTimeout(function repeatFn(){
			if(t.runnig||t.list.length==0)
				return setTimeout(repeatFn,t.checkDelay);
			if(t.list.length>0){
				var e = t.list.shift();
				t.create();
				if(e.tid==''){
					t.wineShow(e.name);
				}else{
					t.signShow(e.name,e.sitNumber);
				}
			}
		},t.checkDelay);	
	},
	create:function(){
		var html = '<div class="signUpBg1"><img src="'+allImage.signUpBg1+'" /></div>';
		html += '<div class="signUpBg2"><img src="'+allImage.signUpBg2+'" /></div>';
		html += '<div class="sendWineBg1"><img src="'+allImage.sendWineBg1+'" /></div>';
		html += '<div class="sendWineBg2"><img src="'+allImage.sendWineBg2+'" /></div>';
		html += '<div class="signShow"></div>';
		$(html).appendTo($('body'));
	},
	close:function(){
		$('.signUpBg1').remove();
		$('.signUpBg2').remove();
		$('.sendWineBg1').remove();
		$('.sendWineBg2').remove();
		$('.signShow').remove();
	},
	showBg:function(type){
		var e1,e2;
		if(type==0)
			e1 = $('.signUpBg1'),e2 = $('.signUpBg2');
		else
			e1 = $('.sendWineBg1'),e2 = $('.sendWineBg2');
		e1.addClass('open');
		e2.addClass('open');
	},
	closeBg:function(type){
		var e1,e2;
		if(type==0)
			e1 = $('.signUpBg1'),e2 = $('.signUpBg2');
		else
			e1 = $('.sendWineBg1'),e2 = $('.sendWineBg2');
		e1.removeClass('open');
		e2.removeClass('open');		
	},
	init:function(){
		this.start();
	},
	wineShow:function(userName){
		this.running = true;
		var html = '<span class="span">';
		html += '<tt class="wineOnWall"></tt>'+userName+'</span>';
		$('.signShow').html(html);	
		this.action(1);		
	},
	signShow:function(userName,sitNumber){
		this.running = true;
		var html = '<span class="span">';
		html += '<tt class="signOnWall"></tt>'+userName;
		html += '&nbsp;在&nbsp;'+sitNumber+'&nbsp;求现场拼桌</span>';
		$('.signShow').html(html);
		this.action(0);
	},
	action:function(type){
		var a1 = false,a2 = false,t = this;
		setTimeout(function(){
			var height = $('.signShow span')[0].offsetHeight;
			var w = ($('.signShow').width()-$('.signShow span')[0].offsetWidth)/2;
			$('.signShow span').css({marginTop:height/-2,left:w});
			$('.signShow span').addClass('open');	
			setTimeout(function(){
				t.showBg(type);
				setTimeout(function(){
					a1 = true;
					if(a1&&a2){
						a1 = false,a2 = false;
						t.closeBg(type);
						t.running = false;
						t.start();	
					}
				},3500);	
			},1000);
			setTimeout(function(){
				setTimeout(function(){
					$('.signShow').addClass('signLeave');	
					setTimeout(function(){
						a2 = true;
						if(a1&&a2){
							a1 = false,a2 = false;
							t.closeBg(type);
							t.running = false;
							t.start();	
						}
						$('.signShow').html('').removeClass('signLeave');	
					},500);
				},t.showTime);		
			},1000);
		},50);		
	}
}

//键盘控制器
var keyBroadControl = {
	code:4,
	set:function(type){
		if(type=='top'){
			this.code = this.code==1?3:(this.code==2?4:(this.code==3?1:2));
		}else{
			this.code = this.code==1?2:(this.code==2?1:(this.code==3?4:3));	
		}
		this._set();
		SystemControl.saveData('code',this.code);
	},
	setQR:function(){
		if(typeof QR=='undefined'||QR==null)
			return;
		if(QR.type==0)
			return;
		var scale = 1;
		var width = 0,_width = 0,height = 0,_height = 0;
		if(typeof QR!='undefined'&&QR!=null){
			width = QR.scale*$('.WM_QR').width();
			height = QR.scale*$('.WM_QR').height();	
			var _width = $(window).width()*22/100;
			var _height = 40;
		}
		
		if(this.code==1){
			var left = 35+((_width-width)/2);
			$('.WM_QR').offset({left:left,top:60});
		}
		else if(this.code==3){
			var left = 35+((_width-width)/2);
			var top = $(window).height()-height-60;
			$('.WM_QR').offset({left:left,top:top});
		}
		else if(this.code==2){
			var left = $(window).width()-((_width+width)/2)-20;
			$('.WM_QR').offset({left:left,top:60});
		}
		else if(this.code==4){
			var top = $(window).height()-height-60;
			var left = $(window).width()-((_width+width)/2)-20;
			$('.WM_QR').offset({left:left,top:top});
		}
	},
	_set:function(b){
		if(this.code==1||this.code==2){
			//$('#codeBox img').css({marginTop:0});
			//$('#codeBox').css({bottom:'auto',top:0});	
			$('#imageBox').css({top:'auto',bottom:0});
			$('#beforeImageLoad').css({top:'auto',bottom:0});	
		}else{
			//$('#codeBox').css({bottom:0,top:'auto'});	
			//$('#codeBox img').css({marginTop:10});	
			$('#imageBox').css({top:0,bottom:'auto'});	
			$('#beforeImageLoad').css({top:0,bottom:'auto'});				
		}
		if(this.code==1||this.code==3){
			$('#msgBoxMain').css({left:'auto',right:0});
			$('#rightBox').css({right:'auto',left:0});			
		}else{
			$('#msgBoxMain').css({left:0,right:'auto'});
			$('#rightBox').css({right:0,left:'auto'});		
		}
		this.setQR();
		if(!b)
			keyBroadControl.resetCode();
	},
	setPosition:function(){
		$(window).bind('keydown',function(ev){
			if(App.type=='normal'){
				if(ev.keyCode==38||ev.keyCode==40){
					keyBroadControl.set('top');		
				}
				else if(ev.keyCode==37||ev.keyCode==39){
					keyBroadControl.set('left');		
				}
			}
		});	
	},
	init:function(){	
		//$('#codeBox img').css({'transform':'scale('+scale+')'});
		/*
		$('body').mousewheel(function(event, delta) {
			if(delta==1)
				scale += 0.1;
			else
				scale -= 0.1;
			scale = scale>3?3:scale;
			scale = scale<0.5?0.5:scale;
			$('#codeBox img').css({'transform':'scale('+scale+')'});
			SystemControl.saveData('codeScale',scale);
		});
		*/
		var scale = parseFloat(SystemControl.data.codeScale);
		scale = scale==null?0.7:scale;
		this.code = SystemControl.data.code;
		//this._set(true);
		//this.setPosition();
		window.QR = new tools.QR({
			src: Global.Merchant.qrcodeUrl,
			scale:scale,
			resize:false,
			init:function(){
				keyBroadControl._set(true);
				keyBroadControl.setPosition();	
				try{
					if(SystemControl.data.wxLeft!=null&&SystemControl.data.wxTop!=null){
						QR.moveTo(SystemControl.data.wxLeft,SystemControl.data.wxTop);	
					}		
				}catch(ex){}
			},
			onMove:function(x,y){
				SystemControl.saveData('wxLeft',x);
				SystemControl.saveData('wxTop',y);
			},
			onMousewheel:function(){
				var _scale = this.scale;
				SystemControl.saveData('codeScale',_scale);
			}
		})
		/*
		if(SystemControl.data.wxLeft!=null&&SystemControl.data.wxTop!=null){
			$('#codeBox img').offset({left:SystemControl.data.wxLeft,top:SystemControl.data.wxTop});	
		}
		
		//移动二维码
		$('#codeBox img').dragmove({
			onMove:function(x,y){
				SystemControl.saveData('wxLeft',x);
				SystemControl.saveData('wxTop',y);	
			}
		}).css({'cursor':'move'});
		*/
	},
	resetCode:function(){
		SystemControl.saveData('wxLeft',null);
		SystemControl.saveData('wxTop',null);
		/*
		$('#codeBox img').css({position:'static'});
		SystemControl.saveData('wxLeft',null);
		SystemControl.saveData('wxTop',null);
		*/
	}
}



/*弹幕*/
var danmu = {
	isOpen:true,
	line:3,
	speed:120,
	getRandom:function(begin,end){
		return parseInt(Math.random()*((end>begin?end-begin:begin-end)+1)+(end>begin?begin:end));
	},
	reset:function(){
		var box = document.getElementById('danmuText');
		var html = '';
		for(var x=0;x<this.line;x++){
			html += '<div class="danmuLine" style="position:absolute;"></div>';
		}
		$(box).html(html);
	},
	init:function(){
		/*
		if($('.exeCode').length>0){
			var scale = localStorage.getItem('codeScale');
			scale = scale==null?1:scale;
			if(isNaN(scale))
				scale = 1;
			scale = parseFloat(scale);
			$('.exeCode').css({'transform':'scale('+scale+')'});
			$('body').mousewheel(function(event, delta) {
				if(delta==1)
					scale += 0.1;
				else
					scale -= 0.1;
				scale = scale>3?3:scale;
				scale = scale<0.5?0.5:scale;
				$('.exeCode').css({'transform':'scale('+scale+')'});
				SystemControl.saveData('codeScale',scale);
			});
		}
		var _x = localStorage.getItem('exeCodeX');
		var _y = localStorage.getItem('exeCodeY');
		if(_x!=null&&_y!=null)
			$('#text').offset({left:_x,top:_y});

		$('.exeCodeBox').dragmove({
			box:$('#all'),
			onMove:function(x,y){
				SystemControl.saveData('exeCodeX',x);
				SystemControl.saveData('exeCodeY',y);			
			}
		}).css({'cursor':'move'});
		
		
		$('#text').dragmove({
			box:$('#all'),
			onMove:function(x,y){
				SystemControl.saveData('exeCodeX',x);
				SystemControl.saveData('exeCodeY',y);			
			}
		}).css({'cursor':'move'});
		*/
		
		var box = document.getElementById('danmuText');
		var html = '';
		for(var x=0;x<this.line;x++){
			html += '<div class="danmuLine" style="position:absolute;"></div>';
		}
		$(html).appendTo(box);
		$(window).bind('resize.danmu',function(){
			danmu.reset();	
		});
		this.loop();
	},
	addToLine:function(line,html,left){
		var obj = $(html).appendTo(line);
		var height = obj[0].offsetHeight;
		var top = 0;
		height = height<=50?200:height;
		if(line.offsetHeight>height){
			top	= danmu.getRandom(0,(line.offsetHeight-height));
		}
		$(obj).css({top:top,left:left+120}).addClass('visible');
		danmu.x = danmu.x==null?0:danmu.x;
		danmu.move(obj[0]);	
	},
	getLineLeft:function(e){
		var width = 0;
		if($(e).children().length>0){
			var lastChild = $(e).children().last();
			var oneWidth = lastChild.offset().left;
			width += oneWidth;	
			var offWidth = lastChild[0].offsetWidth;
			offWidth = offWidth<450?450:offWidth;
			width += offWidth;	
		}
		width = width-(window.innerWidth/2);
		width = width<0?0:width;
		return width;	
	},
	getLeft:function(){
		var allLine = $('.danmuLine');
		var left = {textLeft:[],maxLeft:0,picLeft:0};
		for(var x=0;x<allLine.length;x++){
			var e = allLine[x];	
			var width = this.getLineLeft(e);
			if(left.maxLeft<width){
				left.maxLeft = width;	
			}
			if(e.parentNode.id=='danmuText')
				left.textLeft.push(width);
			else if(e.parentNode.id=='danmuPicture')
				left.picLeft = width;
		}
		return left;		
	},
	getPicLine:function(){
		var leftData = this.getLeft();
		return {line:$('#danmuPicture .danmuLine')[0],left:leftData.maxLeft}
	},
	getTextLine:function(){
		var leftData = this.getLeft();
		var textLine = $('#danmuText .danmuLine');
		var useList = [];
		var use = null;
		var w = 0;
		for(var x=0;x<textLine.length;x++){
			var e = textLine[x];
			var width = 0;
			if($(e).children().length==0)
				useList.push(e);
			else{
				width = leftData.textLeft[x];	
			}
			if(x==0){
				w = width;
				use = textLine[x];	
			}
			if(w>width){
				use = e;
				w = width;	
			}
		}
		var maxLeft = leftData.maxLeft;
		if(leftData.maxLeft>leftData.picLeft||leftData.picLeft==0){
			maxLeft = w;
			maxLeft = maxLeft<leftData.picLeft?leftData.picLeft:maxLeft;
			maxLeft += danmu.getRandom(50,100);
		}else{
			maxLeft += danmu.getRandom(0,300);	
		}
		if(useList.length>0){
			ret = {
				line:useList[danmu.getRandom(0,useList.length-1)],
				left:maxLeft		
			}
		}else{
			ret = {
				line:use,
				left:maxLeft		
			}				
		}
		return ret;
	},
	getTransformX:function(e){
		var transformX = $(e).css('transform');
		if(transformX=='none')
			return 0;
		transformX = transformX.replace('matrix(','');
		transformX = transformX.replace(')','');
		transformX = transformX.split(',');
		transformX = transformX[4];
		return transformX;	
	},
	_add:function(dt){
		// var ret;
		// if(dt.src!=null&&dt.src!='')
		// 	ret = this.getPicLine();
		// else
		// 	ret = this.getTextLine();
		var ret = this.getTextLine();
		var html = this.create(dt);
		var obj = this.addToLine(ret.line,html,ret.left);		
	},
	addPic:function(dt){
		var src = dt.src;
		var img = new Image();
		img.onload = function(){
			danmu._add(dt);		
		}
		img.onerror = function(){
			this.src = allImage.noImgSrc;	
		}
		img.src = src;
	},
	move:function(obj){
		var left = obj.offsetLeft+obj.offsetWidth+window.innerWidth;
		left = left*-1;
		var time = Math.abs(left)/this.speed;
		$(obj).css({transition:'transform '+time+'s linear'});
		$(obj).css({transform:'translate3d('+left+'px,0,0)'});
		$(obj).one("webkitTransitionEnd",function(){
			$(this).remove();
		})
	},
	bpMsg:function(e){
		var html = '';
		var val = '重金霸屏';
		if(e.theme>=0){
			if(e.theme==0)	
				val = '示爱霸屏';
			else if(e.theme==1)	
				val = '求约霸屏';
			else if(e.theme==2)	
				val = '求婚霸屏';
			else if(e.theme==3)	
				val = '女神霸屏';
			else if(e.theme==4)	
				val = '毕业季霸屏';
			else if(e.theme==5)	
				val = '生日霸屏';
			else if(e.theme==6)	
				val = '七夕霸屏';
		}
		var str = '';
		if(e.msgType=='bp'&&typeof e.pascreenSort!='undefined'&&e.pascreenSort!=-1){
			var style = 'position:absolute;height:40px;line-height:40px;top:-60px;left:30px;text-align:left;';
			style += 'font-size:1.0rem;color:#fff;text-shadow:0 0 5px rgba(0,0,0,1);';
			str += '<span style="'+style+'">第 '+e.pascreenSort+' 位霸屏</span>'
		}
		if(e.bpForName!=null){
			html += '<span class="oneText bpStyle">为 '+e.bpForName+' '+val+''+e.richTime+'秒：'+e.msg+' '+str+'</span>';
			html += '<img src="'+e.bpForBigSrc+'" alt="" class="bpBg">';
			/*
			html += '<p class="msgText richText">为 '+e.bpForName+' '+val+''+e.richTime+'秒：'+e.msg+'</p>';
			html += '<p class="forTaBp_line"></p>';
			html += '<p class="forTaBp_text">';
			html += '<img class="forTaBp_image" src="'+e.bpForBigSrc+'" />';
			html += '<span>'+e.bpForTxt+'</span>';
			html += '<p class="clear"></p>';
			html += '</p>';
			*/
		}else{
			html += '<span class="oneText bpStyle">'+val+''+e.richTime+'秒：'+e.msg+' '+str+'</span>';
			//html += '<p class="msgText richText">'+val+''+e.richTime+'秒：'+e.msg+'</p>';
			if(e.src!=null&&e.src.length>0){
				var splitSrc = e.src.split(',');
				if(splitSrc.length>1){
					html += '<img src="'+splitSrc[0]+'" alt="" class="bpBg">';
				}else
					html += '<img src="'+e.src+'" alt="" class="bpBg">';
			}
				//html += '<img class="msgImage" src="'+e.src+'" />';
		}
		return html;
	},
	dsMsg:function(e){
		var html = '';
		if(parseInt(e.giftId)<=11)
			html = '<span class="oneText dsStyle"><i class="'+allData.dsData[e.giftId].iconName+'"></i>打赏给 "'+e.showName+'" '+allData.dsData[e.giftId].name+'：'+e.msg+'</span>';
			//html = '<p class="msgText dsText"><i class="'+allData.dsData[e.giftId].iconName+'"></i>打赏给 "'+e.showName+'" '+allData.dsData[e.giftId].name+'：'+e.msg+'</p>';
		else{
			var msg = e.msg;
			if(msg==null||msg.length==0)
				msg = '';
			html = '<span class="oneText dsStyle"><i class="'+allData.newDs[e.giftId].iconName+'"></i>打赏给 "'+e.showName+'" '+allData.newDs[e.giftId].name+'：'+msg+'</span>';
			//html = '<p class="msgText dsText"><i class="'+allData.newDs[e.giftId].iconName+'"></i>打赏给 "'+e.showName+'" '+allData.newDs[e.giftId].name+'：'+msg+'</p>';
		}
		return html;
	},
	cakeMsg:function(e){
		//var html = '<p class="msgText dsText"><i class="'+allData.dsData['cake'].iconName+'"></i>为 '+e.toName+' 霸屏 生日蛋糕：'+e.msg+'</p>';
		var html = '<span class="oneText bpStyle"><i class="'+allData.dsData['cake'].iconName+'"></i>为 '+e.toName+' 霸屏 生日蛋糕：'+e.msg+'</span>';
		return html;
	},
	loveNightMsg:function(e){
		// var html = '<div class="msgLove" style="margin-left:20px;">';
		// html += '<p><tt class="loveNightMsgTop"></tt></p>';
		// html += '<div><img onload="App.public.centerImage(this)" src="'+e.src+'" /></div>';
		// html += '</div>';
		var html = '<span class="oneText hbStyle">眼缘</span>';
		html += '<img src="'+e.src+'" alt="" class="bpBg">';
		return html;
	},
	sitMsg:function(e){
		var html = '<p class="msgText sitText"><span class="sitNumber">'+e.sitNumber+'</span>';
		var sitMsg = e.sitMsg;
		if(e.sitMsg==null||e.sitMsg.length==0)
			sitMsg = '签到就座';
		html += '<br />'+sitMsg;
		html += '</p>';
		sitWineControl.addSign(e.tid,e.userName,e.sitNumber,e.sitMsg);
		return html;
	},
	redBagMsg:function(e){
		// var html = '<p class="msgText redBagText"><i class="newDsIcon_redbag"></i>发出'+e.redBagMoney+'元红包：'+e.msg+'</p>';
		var html = '<span class="oneText hbStyle"><i class="newDsIcon_redbag"></i>发出'+e.redBagMoney+'元红包：'+e.msg+'</span>';
		return html;		
	},
	songMsg:function(e){
		// var html = '<p class="msgText songText">点了一首歌 '+(e.songName+'_'+e.singer)+'：'+e.msg+'</p>';
		var html = '<span class="oneText dgStyle">点了一首歌 '+(e.songName+'_'+e.singer)+'：'+e.msg+'</span>';
		return html;		
	},
	normalMsg:function(e){
		if(e.msgType=='song')
			return this.songMsg(e);
		// var html = '<p class="msgText">'+e.msg+'</p>';
		var html = '';
		if(e.msg!=''&&e.msg!=null){
            html = '<span class="oneText normalStyle">'+e.msg+'</span>';
		}
		if(e.src!=null&&e.src.length>0){
			// html += '<img class="msgImage" src="'+e.src+'" />';
			html += '<img src="'+e.src+'" alt="" class="bpBg">'
		}
		return html;
	},
	create:function(e){
		e.msg = Face.replaceText(e.msg);
        var hat = cy_get_grade_style.get(e.level).imgUrl;
		var cName = 'onWallMsg danmuMsg';
		if(e.msgType=='bp'){
			cName += ' longMsg';
			if(e.theme==0)
				cName += ' themeMsg0';
			else if(e.theme==1)
				cName += ' themeMsg1';
			else if(e.theme==2)
				cName += ' themeMsg2';
			else if(e.theme==3)
				cName += ' themeMsg3';
			else if(e.theme==4)
				cName += ' themeMsg4';
			else if(e.theme==5)
				cName += ' themeMsg5';
			else if(e.theme==6)
				cName += ' themeMsg6';
			else
				cName += ' themeMsgBp';	
		}else if(e.msgType=='song')
			cName += ' songMsg';
		var html = '<div class="'+cName+'" id="'+e.tid+'">';
		if(e.msgType=='bp'){
			var val = '<span class="themeIcon themeIcon_default"></span>';
			if(e.theme==0)
				val = '<span class="themeIcon themeIcon_love"></span>';	
			else if(e.theme==1)
				val = '<span class="themeIcon themeIcon_tryst"></span>';
			else if(e.theme==2)
				val = '<span class="themeIcon themeIcon_propose"></span>';
			else if(e.theme==3)
				val = '<span class="themeIcon themeIcon_beautiful"></span>';
			else if(e.theme==4)
				val = '<span class="themeIcon themeIcon_by"></span>';
			else if(e.theme==5)
				val = '<span class="themeIcon themeIcon_cake"></span>';
			else if(e.theme==6)
				val = '<span class="themeIcon themeIcon_qixi"></span>';
			else if(e.theme==7)
				val = '<span class="themeIcon themeIcon_gq"></span>';
			// html += val;
		}
		
/*		html += '<img class="userHead '+e.sex+'" src="'+e.head+'" />';
		html += '<div class="onWallMsgInfo">';
		html += '<span class="userName">'+e.userName+'</span>';
		if(e.msgType=='bp'&&typeof e.pascreenSort!='undefined'&&e.pascreenSort!=-1){
			html += '<span class="msgTime">';
			html += '第 '+e.pascreenSort+' 位霸屏 ';
			html += e.time+'</span>';
		}else{
			html += '<span class="msgTime">'+e.time+'</span>';	
		}
		*/
		//html += '<span class="msgTypeime">'+e.time+'</span>';

		if(e.level>3){
            html += '<img class="userHead" src="'+e.head+'" />';
            html += '<img class="danmuuserGrade" src="'+hat+'" />';
		}else{
            html += '<img class="userHead '+e.sex+'" src="'+e.head+'" />';
		}
		html += '<div class="onWallMsgInfo">';
		html += '<div class="onWallMsgMain">';		
		html += '<div class="onWallMsgMain">';
		if(e.msgType=='bp')
			html += this.bpMsg(e);	
		else if(e.msgType=='ds')
			html += this.dsMsg(e);
		else if(e.msgType=='cake')
			html += this.cakeMsg(e);
		else if(e.msgType=='loveNight')
			html += this.loveNightMsg(e);
		else if(e.msgType=='redBag')
			html += this.redBagMsg(e);
		else if(e.msgType=='interact')
			html += this.sitMsg(e);
		else
			html += this.normalMsg(e);
		html += '</div>';
		html += '</div></div>';
		return html;
	},
	add:function(e){
		if(this.isLoop=='true')
			return this.newAdd(e);
		this.toAdd(e);
	},
	toAdd:function(dt,isLoop){
		isLoop = isLoop==null?false:isLoop;
		if(!isLoop){
			if(dt.msgType=='richUser'||dt.msgType=='redBag'||dt.msgType=='song')
				bpControl.add(dt);
			if(dt.msgType=='richUser'||dt.msgType=='openRedBag')
				return;
		}
		if(!this.isOpen||this.isOpen=='false')
			return;
		// if(dt.src!=null&&dt.src.length>0)
		// 	this.addPic(dt);
		// else
		// 	this._add(dt);		
		this._add(dt);
	},
	isLoop:'false',
	loopRunning:false,
	msgArray:[],
	max:25,
	index:0,
	newAdd:function(e){
		e.running = true;
		danmu.msgArray.unshift(e);
		if(danmu.msgArray.length>danmu.max){
			danmu.msgArray.pop();
		}
		danmu.index++;
		danmu.index = danmu.index>=danmu.msgArray.length?0:danmu.index;
		danmu.toAdd(e);
		this.loop();
	},
	loop:function(){
		if(this.isLoop=='false'||this.msgArray.length==0||this.loopRunning)
			return;
		this.loopRunning = true;
		var fn = function(){
			if(danmu.msgArray.length==0){
				danmu.loopRunning = false;
				return;
			}
			if($('.danmuMsg').length>4)
				return setTimeout(fn,500);
			// var arg = arguments.callee;
			danmu.index = danmu.index>=danmu.msgArray.length?0:danmu.index;
			try{
				var e = danmu.msgArray[danmu.index];
				if($('#'+e.tid).length==0)
					danmu.toAdd(e,true);
			}catch(ex){}
			danmu.index++;	
			danmu.index = danmu.index>=danmu.msgArray.length?0:danmu.index;	
			var delay = danmu.getRandom(2000,6000);
			setTimeout(fn,delay);		
		}
		fn();
	}
}

//loading
var wemewLoading = {
	next:0,
	now:0,
	speed:50,
	timeout:null,
	isOver:false,
	animate:function(){
		if(this.next-this.now<=0)
			return;
		var time = (this.next-this.now)*this.speed;
		var percent = this.next;
		this.now = this.next;
		this.running = true;
		$('#wemewLoadingline2').stop().animate({left:percent+'%'},time);
		$('#wemewLoadingGif').stop().animate({left:percent+'%'},time,function(){
			wemewLoading.running = false;
			if(percent>=100){
				setTimeout(function(){
					if(!wemewLoading.isOver){
						wemewLoading.close();
						try{
							clearTimeout(wemewLoading.timeout);	
						}catch(ex){}
						wemewLoading.complete();
						return;						
					}				
				},500);
			}
			if(wemewLoading.next>percent)
				wemewLoading.animate();			
		});		
	},
	to:function(percent){
		percent = percent>100?100:percent;
		if(percent-this.now<=0)
			return;
		this.next = percent;	
		if(this.running)
			return;
		this.animate();
	},
	add:function(percent){
		this.next += percent;
		this.next = this.next>100?100:this.next;
		if(this.running)
			return;
		this.animate();
	},
	close:function(){
		wemewLoading.isOver = true;
		$('#wemewLoading').remove();		
	},
	complete:function(){},
	outTime:function(time){
		this.timeout = setTimeout(function(){
			if(!wemewLoading.isOver){
				wemewLoading.close();
				wemewLoading.complete();
			}
		},time||16000);		
	}
}

var wemewSWF = {
	hasFlash:true,
	swfVersionStr:"0",
	params:{
		quality:'high',
		loop:'true',
		play:'false',
		wmode:'transparent',
		scale:'showall',
		menu:'false',
		devicefont:'false',
		salign:'',
		allowscriptaccess:'sameDomain'
	},
	error:function(){
		return;
		var html = '<div class="SWFerror">';
		html += '<a class="errorClose" onclick="wemewSWF.closeError()">&times;</a>';
		html += '<div class="errorHead">重要提醒</div>';
		html += '<div class="errorMain">';
		if(location.href.indexOf('reqform=exe')!=-1){
			html += '<p style="color:#ff4b69">尊敬的用户，系统检测到您的秉烛科技客户端版本过低无法支持秉烛科技的新版打赏特效。</p><p style="margin-top:15px">为了不影响您的使用体验，请登录 <a target="_blank" href="http://www.wemew.cn">秉烛科技官网</a> 下载最新版的秉烛科技客户端。</p>';
		}else{
			html += '<p style="color:#ff4b69">尊敬的用户，系统检测到您的浏览器无法支持秉烛科技新版打赏特效。</p>';
			html += '<p style="margin:15px 0">1、如果您是直接用浏览器打开的（未使用第三方插件），请在 浏览器设置--高级--内容设置--Flash--选择允许所有网站运行Flash，不询问，然后刷新页面重试</p>';
			html += '<p>2、如果您使用了<b style="color:#ff4b69">第三方插件（vj黑科技等）</b>，可能是当前使用的插件无法支持Flash，为了不影响您的使用体验建议您使用秉烛科技客户端（秉烛科技官网、后台均可下载）代替现有的插件</p>';	
		}
		html += '<div class="errorCount"><tt>10</tt>秒后自动关闭</div>';
		html += '</div>';
		html += '</div>';
		$(html).appendTo($('body'));
		var t = 10;
		this.inter = setInterval(function(){
			t--;
			if(t<=-1){
				clearInterval(wemewSWF.inter);
				wemewSWF.closeError();
				return;
			}
			$('.errorCount tt').html(t);			
		},1000);
	},
	closeError:function(){
		clearInterval(wemewSWF.inter);
		$('.SWFerror').remove();
	},
	check:function(){
		var hasFlash = 0;//是否安装了flash
		var flashVersion = 0;//flash版本
		if(document.all) {
			var swf = new ActiveXObject('ShockwaveFlash.ShockwaveFlash');
			if(swf){
				hasFlash = 1;
				VSwf = swf.GetVariable("$version");
				flashVersion = parseInt(VSwf.split(" ")[1].split(",")[0]);
			}
		}else{
			if(navigator.plugins && navigator.plugins.length > 0) {
				var swf = navigator.plugins["Shockwave Flash"];
				if(swf){
					hasFlash = 1;
					var words = swf.description.split(" ");
					for (var i = 0; i < words.length; ++i) {
					if (isNaN(parseInt(words[i]))) continue;
						flashVersion = parseInt(words[i]);
					}
				}
			}
		}
		this.hasFlash = hasFlash;
		if(!hasFlash){
			this.error();
		}
	},
	index:null,
	getData:function(index){
		var dt = allData.newDs[index];
		var dir = dt.width/dt.height;
		var height = window.innerHeight;
		var width = height*dir;
		return {
			height:height,
			width:width
		}	
	},
	reset:function(){
		$(window).unbind('resize.swf').bind('resize.swf',function(){
			if(wemewSWF.index==null)
				return;
			var dt = wemewSWF.getData(wemewSWF.index);
			$('#SWF').css({width:dt.width,height:dt.height});	
		});	
	},
	_init:function(index,fn1,fn2){
		if(!this.hasFlash){
			if(fn2)
				fn2();	
			return;
		}
		this.index = index;
		var dt = allData.newDs[index];
		var xiSwfUrlStr = "";
		var flashvars = {};
		var attributes = {
			id:'miniSWF',
			name:'miniSWF',
			align:'middle'	
		};
		var newData = this.getData(index);
		swfobject.embedSWF(
			allData.swfUrl+dt.url+'.swf', "flashContent",
			newData.width, newData.height,
			wemewSWF.swfVersionStr, xiSwfUrlStr,
			flashvars, wemewSWF.params, attributes,
			function(ret){
				if(ret.success){
					var e = document.getElementById('miniSWF');
					e.style.display = 'block';
					var isLoad = false;
					var lastTime = setTimeout(function(){
						if(isLoad)
							return;
						isLoad = true;
						if(fn1)fn1();
						setTimeout(function(){
							$(e).addClass('show');
							e.Play();
							//wemewSWF.reset();
						},700);						
					},8000);
					setTimeout(function repeatFn(){
						if(isLoad)
							return;
						if(typeof e.PercentLoaded!='undefined'&&e.PercentLoaded()>=60){
							isLoad = true;
							clearTimeout(lastTime);
							if(fn1)fn1();
							setTimeout(function(){
								$(e).addClass('show');
								e.Play();
								//wemewSWF.reset();
							},700);
						}else
							setTimeout(repeatFn,100);			
					},100);
				}else{
					$('#miniSWF').remove();
					if(fn2)fn2();
				}
			}
		);		
	},
	init:function(index,fn1,fn2){
		if(!this.hasFlash){
			if(fn2)
				fn2();	
			return;
		}
		this.index = index;
		var dt = allData.newDs[index];
		var xiSwfUrlStr = "";
		var flashvars = {};
		var attributes = {
			id:'SWF',
			name:'SWF',
			align:'middle'	
		};
		var newData = this.getData(index);
		swfobject.embedSWF(
			allData.swfUrl+dt.url+'.swf', "flashContent",
			newData.width, newData.height,
			wemewSWF.swfVersionStr, xiSwfUrlStr,
			flashvars, wemewSWF.params, attributes,
			function(ret){
				if(ret.success){
					var e = document.getElementById('SWF');
					e.style.display = 'block';
					var isLoad = false;
					var lastTime = setTimeout(function(){
						if(isLoad)
							return;
						isLoad = true;
						if(fn1)fn1();
						setTimeout(function(){
							$(e).addClass('show');
							e.Play();
							wemewSWF.reset();
						},700);						
					},8000);
					setTimeout(function repeatFn(){
						if(isLoad)
							return;
						if(typeof e.PercentLoaded!='undefined'&&e.PercentLoaded()>=60){
							isLoad = true;
							clearTimeout(lastTime);
							if(fn1)fn1();
							setTimeout(function(){
								$(e).addClass('show');
								e.Play();
								wemewSWF.reset();
							},700);
						}else
							setTimeout(repeatFn,100);			
					},100);
				}else{
					$('#SWF').remove();
					if(fn2)fn2();
				}
			}
		);
	},
	end:function(){
		$(window).unbind('resize.swf');
		$('#SWF').remove();
		$('.dsControlCover').remove();
		$('#flashContent').remove();
		$('.noSWFimg').remove();
		$('#dsControl').remove();
	}
}

var _loadImage = function(src,fn){
	var img = new Image();
	img.onload = img.onerror = function(){
		if(fn)
			fn();
	}
	img.src = src;
}


var allInit = function(){
	// ajax_first();
	basicControl.init();
	SystemControl.init();
	videoControl.init();
	// entryControl.init();
	msgControl.init();
	GiftModule.init({
		merchantId:Global.merchantId
	});
	// sendOpen(6000,true);
	// socketControl.init();
}


var complete = function(){
	// loopAjax(10000);//轮询支付类
	loopImageControl.init();
	keyBroadControl.init();
	// marqueeControl.init();
	bpControl.init();
	sitWineControl.init();
	msgControl.firstLoad();
	Promise.resolve({
		bp:{able:1,time:20},
        yr:{able:0,time:20},
        pk:{able:0,time:20},
        rb:{able:0,time:60},
        song:{able:0,time:120}
	}).then(function(data){
		console.log(data);
		basicControl.createFoot(data);
		moduleSwitch.countTime();
	},function(){
		
	});
}

var startGame = function(){
	bpControl.saveBp.load();
	wemewSWF.check();
	allInit();
	//超时
	wemewLoading.outTime(16000);
	wemewLoading.complete = function(){
		complete();
	}
	loadControl.preloadImage({
		onComplete:function(){
			wemewLoading.add(25);
		}
	});
	loadControl.loadDsVideo({
		onComplete:function(){
			wemewLoading.add(25);		
		}
	});
	loadControl.loadBpVideo({
		onComplete:function(){
			wemewLoading.add(25);		
		}
	});
	loadControl.loadThemeVideo({
		onComplete:function(){
			wemewLoading.add(25);		
		}
	});	

	WebsocketModule.connect({
		chatId: Global.merchantId,
		callback: function(json){
			msgControl.add(json);
			console.log(json);
			bpControl.toAdd(json);
		}
	});
}

$(function(){
	if(App.Browser.chrome==0){
		App.Browser.checkChrome(startGame);	
	}else{
		$.getJSON('/pc/getMerchant',{
			merchantId: Global.merchantId
		}).then(function(res){
			if(res && res.code === 0 && res.data){
				$.extend(Global.Merchant, res.data);
				document.title =  res.data.name;
				startGame();
			}else{
				alert('酒吧信息获取失败！')
			}
		},function(){
			alert('酒吧信息获取失败！')
		})
	}
		
});