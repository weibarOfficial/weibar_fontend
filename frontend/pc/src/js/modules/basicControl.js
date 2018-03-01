import moduleControl from './moduleControl';
import marqueeControl from './marqueeControl';
import loopImageControl from './loopImageControl';

//构建初始页面
var basicControl = {
	able:true,
	setType:function(type){
		return;
		if(App.type==type)
			return;
		App.type = type;
		marqueeControl.stop();
		if(type=='disco'){
			$('body').addClass('disco');
			loopImageControl.close();
		}else{
			$('body').removeClass('disco');	
			loopImageControl.open();
		}
		this.createHead();
		marqueeControl.create();
		marqueeControl.open();
	},
	setAble:function(b){
		this.able = b;
		this.checkCode();
		moduleControl.resetSwiper();
	},
	checkCode:function(){
		if(basicControl.able){
			$('#msgBoxMain').removeClass('full');
			$('#rightBox').addClass('show');
		}else{
			$('#msgBoxMain').addClass('full');
			$('#rightBox').removeClass('show');
		}
	},
	resize:function(){
		var t = this;
		$(window).bind('resize',function(){
			t.setZoom();
		});		
	},
	setZoom:function(obj){
		obj = obj||$('#all');
		var w = $(window).width();
		var h = $(window).height();
		var maxWidth = 1200;
		var maxHeight = 653;
		window.zoom = 1;
		
		if(h>w+150){
			zoom = w/maxWidth;
			obj.css({zoom:zoom});
			$('.systemControlSpan').css({zoom:zoom});				
		}else{
			zoom = h/maxHeight;
			if(w/h>3&&w/maxWidth>2){
				zoom += 0.1;
			}
			obj.css({zoom:zoom});
			$('.systemControlSpan').css({zoom:zoom});			
		}
		/*
		if(w>=h+300&&w>1100){
			zoom = h/maxHeight;
			if(w/h>3&&w/maxWidth>2){
				zoom += 0.1;
			}
			obj.css({zoom:zoom});
			$('.systemControlSpan').css({zoom:zoom});	
		}else{
			zoom = w/maxWidth;
			obj.css({zoom:zoom});
			$('.systemControlSpan').css({zoom:zoom});	
		}
		*/
	},
	init:function(){
		//$('<img class="onWallBg" src="'+allImage.bg+'" />').appendTo($('#all'));
		this.createHead();
		//this.createFoot();
		this.createMain();
		this.createBg();
		this.createBp();
		this.createMarquee();
		/*
		if(App.type=='disco'){
			$('body').addClass('disco');	
		}
		*/
		this.checkCode();
		this.resize();
		this.setZoom();
	},
	setLogo:function(e){
		var width = e.width<=46?58:e.width+14;
		$('.onWallHeadBox p').css({paddingLeft:width});		
	},
	createHead:function(){
		$('#onWallHead').remove();
		$('<div id="onWallHead"><div class="_onWallHead"><div class="onWallHeadBox posLeft"><p><img src="'+Global.Merchant.logoUrl+'" class="logo" onload="basicControl.setLogo(this)"><tt class="onWallHeadTitle"></tt></p></div></div></div>').appendTo($('#all'));
	},
	createFoot:function(data){
		var html = '<div id="foot"><div><a data-time="'+data.bp.time+'" class="module_btn module_btn_bp sel" title="上墙消息" data-id="module_btn_bp"><tt id="module_btn_bp"></tt></a>';
		if(typeof data.yr!='undefined'&&data.yr.able==1){
			html += '<a class="module_btn module_btn_ds" data-id="module_btn_ds" title="艺人" data-time="'+data.yr.time+'"></a>';
			$('<div class="oneSwitch oneSwitch_yr _oneSwitch"><div class="oneSwitchBox"></div></div>').appendTo($('.switchBox'));	
		}
		if(typeof data.pk!='undefined'&&data.pk.able==1){
			html += '<a class="module_btn module_btn_pk" data-id="module_btn_pk" title="PK" data-time="'+data.pk.time+'"></a>';	
			$('<div class="oneSwitch oneSwitch_pk _oneSwitch"><div class="oneSwitchBox"></div></div>').appendTo($('.switchBox'));
		}
		if(typeof data.rb!='undefined'&&data.rb.able==1){
			html += '<a class="module_btn module_btn_rb" data-id="module_btn_rb" title="红包" data-time="'+data.rb.time+'"></a>';	
			$('<div class="oneSwitch oneSwitch_rb _oneSwitch"><div class="oneSwitchBox"></div></div>').appendTo($('.switchBox'));
		}
		if(typeof data.song!='undefined'&&data.song.able==1){
			html += '<a class="module_btn module_btn_song" data-id="module_btn_song" title="点歌" data-time="'+data.song.time+'"></a>';
			$('<div class="oneSwitch oneSwitch_song _oneSwitch"><div class="oneSwitchBox"></div></div>').appendTo($('.switchBox'));	
		}
		if(typeof data.richer!='undefined'&&data.richer.able==1){
			html += '<a class="module_btn module_btn_richer" data-id="module_btn_richer" title="壕榜" data-time="'+data.richer.time+'"></a>';
			$('<div class="oneSwitch oneSwitch_richer _oneSwitch"><div class="oneSwitchBox"></div></div>').appendTo($('.switchBox'));	
		}
		html += '</div><div>yylive 秉烛科技<span class="copyWemewIcon"></span></div></div>';
		$(html).appendTo($('#all'));
		/*
		$('<div id="foot"><div>©wemew 秉烛科技<span class="copyWemewIcon"></span></div><div><a class="module_btn module_btn_bp sel" title="上墙消息"></a><a class="module_btn module_btn_ds" title="艺人"></a><a class="module_btn module_btn_pk" title="PK"></a><a class="module_btn module_btn_rb" title="红包"></a><a class="module_btn module_btn_song" title="点歌"></a></div></div>').appendTo($('#all'));
		*/
		$('.module_btn').bind('click',function(){
			moduleSwitch.show(this,1);	
		});
	},
	createMain:function(){
		$('<div id="onWallMain"><div id="msgBoxMain"><div id="moduleBox"></div><div id="msgBoxAll"><div id="msgBox"></div></div></div></div>').appendTo($('#allBox'));	
	},
	createBg:function(){
		$('<div id="bgControl"></div>').appendTo($('body'));
	},
	createBp:function(){
		$('<div id="bpControl"><div class="bpCover"></div><div class="bpMain"></div></div>').appendTo($('#all'));	
	},
	createMarquee:function(){
		$('#marqueeBox').remove();
		$('<div class="marqueeBox" id="marqueeBox"><div class="marquee"></div></div>').appendTo($('#onWallHead'));	
	},
	setLight:function(x){
		$('.lightCover').css({background:'rgba(0,0,0,'+x+')'});	
	},
    msgLight:function(x){
		var html='';
		html+='.onWallMsg{background:rgba(0,0,0,'+x+')}'
        html+='.onWallMsg.themeMsg0{background:rgba(62,7,78,'+x+')}'
        html+='.onWallMsg.themeMsg1{background:rgba(7,11,71,'+x+')}'
        html+='.onWallMsg.themeMsg2{background:rgba(81,29,3,'+x+')}'
        html+='.onWallMsg.themeMsg3{background:rgba(81,10,18,'+x+')}'
        html+='.onWallMsg.themeMsg4{background:rgba(45,38,34,'+x+')}'
        html+='.onWallMsg.themeMsg5{background:rgba(79,80,59,'+x+')}'
        html+='.onWallMsg.themeMsg6{background:rgba(0,0,0,'+x+')}'
        html+='.onWallMsg.themeMsg7{background:rgba(0,0,0,'+x+')}'
        html+='.onWallMsg.themeMsgBp{background:rgba(0,0,0,'+x+')}'
        html+='.onWallMsg.songMsg{background:rgba(0,0,0,'+x+')}'
		$('#msglight').html(html)

    }
}
window.basicControl = basicControl;
export default basicControl;