//模块控制器
var moduleControl = {
	loadImage:function(src,fn){
		var img = new Image();
		img.onload = img.onerror = function(){
			if(fn)
				fn();
			this.onload = this.onerror = null;	
		}
		img.src = src;
	},
	autoTime :1000*60*3,
	timeout:null,
	running:false,
	color:['#00101c','#150023','190007'],
	swiper:null,
	duration:null,
	ajaxDelay:10000,
	title:['今夜红人榜','互动土豪榜'],
	hotStart:false,
	richStart:false,
	hotTimeout:null,
	richTimeout:null,
	closeHot:function(){
		this.hotStart = false;
		var t = this;
		try{
			clearTimeout(t.hotTimeout);	
		}catch(ex){}
	},
	closeRich:function(){
		this.richStart = false;
		var t = this;
		try{
			clearTimeout(t.richTimeout);	
		}catch(ex){}
	},
	_start:function(x){
		var t = this;
		if(x==0){
			if($('.onWallHot_icon').hasClass('disabled'))
				return;
			try{
				clearTimeout(t.hotTimeout);	
			}catch(ex){}
			this.hotTimeout = setTimeout(function(){
				moduleControl.add($('.onWallHot_icon')[0],0,true);
			},moduleControl.autoTime);				
		}else if(x==1){
			if($('.onWallRich_icon').hasClass('disabled'))
				return;
			try{
				clearTimeout(t.richTimeout);	
			}catch(ex){}
			this.richTimeout = setTimeout(function(){
				moduleControl.add($('.onWallRich_icon')[0],1,true);
			},moduleControl.autoTime);		
		}
	},
	startHot:function(){
		if(this.hotStart)
			return;
		this.hotStart = true;
		this._start(0);	
	},
	startRich:function(){
		if(this.richStart)
			return;
		this.richStart = true;
		this._start(1);
	},
	init:function(val){
		return;
		if(val!=null&&val.length>0){
			val = val.split(';');
			var len = $('._onWallModule').length;
			for(var x=0;x<len;x++){
				if(val.length>x){
					if(val[x]==1){
						$('._onWallModule').eq(x).removeClass('disabled');
						if(x==0)
							this.startHot();
						else if(x==1)
							this.startRich();
					}else{
						$('._onWallModule').eq(x).addClass('disabled');
						if(x==0)
							this.closeHot();
						else if(x==1)
							this.closeRich();	
					}
				}
			}
		}
	},
	getData:function(type,callback){
		var t = this;
		if(type==1){
			(function(){
				var arg = arguments.callee;
				ajax_getRichUser(function(data){
					if(data==null||data.length==0)
						data = [];
					callback(data);			
				},function(){
					callback([]);	
				});				
			})();
		}else if(type==0){
			(function(){
				var arg = arguments.callee;
				ajax_getHotUser(function(data){
					if(data==null||data.length==0)
						data = [];
					for(var x=0;x<data.length;x++){
						if(data[x].img==null||data[x].img=='')
							data[x].img = data[x].head;	
					}
					if(data.length>0){
						moduleControl.loadImage(data[0].img,function(){
							callback(data);	
						});	
					}else
						callback(data);	
				},function(){
					callback([]);	
				});				
			})();
		}
	},
	showRich:function(data,id){
		var html = '<div class="module-slide-page">';
		if(data.length>0)
			html += '<tt id="module-slide-page">1</tt>';
		var len = Math.ceil(data.length/3);
		html += ' / '+len+'</div>';
		html += '';
		html += '<div id="'+id+'moduleSwiper" class="moduleSwiper"><div class="swiper-wrapper">';
		var index = 1;
		for(var x=0;x<data.length;x++){
			var e = data[x];
			if(x%3==0)
				html += '<div class="swiper-slide"><div class="module-slide module-rich"  data-index="'+index+'"><span class="tableSpan">';
			html += '<div class="module-rich-one">';
			var sex = e.sex;
			html += '<span class="module-rich-span1"><i class="module-rich-user"><img class="module-rich-userImg" src="'+e.head+'" />';
			if(x<=2){
				html += '<i class="module_richTop'+(x+1)+'"></i>';	
			}else
				html += '<i class="module_richNoTop"></i>';	
			html += '</i></span>';
			html += '<span class="module-rich-span2 ellipsis">'+e.userName+'</span>';
			html += '<span class="module-rich-span3"><tt>霸屏</tt><b>'+e.bpNum+'次</b></span>';
			html += '<span class="module-rich-span4"><tt>打赏</tt><b>'+e.dsNum+'次</b></span>';
			html += '<div class="clear"></div>';
			html += '</div>';
			if((x+1)%3==0||((x+1)%3!=0&&x==data.length-1)){
				html += '</span></div></div>';	
				index++;
			}
		}
		html += '</div>';
		html += '</div>';
		return html;	
	},
	showHot:function(data,id){
		var html = '<div class="module-slide-page">';
		if(data.length>0)
			html += '<tt id="module-slide-page">1</tt>';
		html += ' / '+data.length+'</div>';
		html += '<div id="'+id+'moduleSwiper" class="moduleSwiper"><div class="swiper-wrapper">';
		for(var x=0;x<data.length;x++){
			var e = data[x];
			html += '<div class="swiper-slide">';
			html += '<div class="module-hot module-slide" data-index="'+(x+1)+'">';
			html += '<span class="module-hot-userBox">';
			html += '<tt></tt>';
			html += '<span class="module-hot-user">';
			html += '<img class="'+e.sex+'" src="'+e.head+'" />';
			html += '<p class="module-hot-userName ellipsis">'+e.userName+'</p>';	
			html += '<p class="module-hot-bp1 ellipsis">收到霸屏 '+e.getBpNum+'次</p>';
			html += '<p class="module-hot-bp2 ellipsis">收到历史霸屏 '+e.getAllBpNum+'次</p>';
			html += '</span></span>';
			html += '';
			html += '<img data-src="'+e.head+'" class="module-hot-bigImg" src="'+e.img+'" onerror="moduleControl.errorImg(this)" />';
			html += '';
			html += '</div></div>';
		}
		html += '</div></div>';
		return html;
	},
	errorImg:function(e){
		$(e).attr({src:$(e).attr('data-src')});
	},
	initSwiper:function(id,data){
		if($('#'+id+'moduleSwiper').find('.swiper-slide').length<1){
			return;	
		}
		var parent = $('#'+id);
		this.isClose = false;
		var t = this;
		this.Swiper = new Swiper('#'+id+'moduleSwiper', {
			effect:'cube',
			speed:700,
			auto:'auto',
			autoplay:8000,
			autoplayDisableOnInteraction:false,
			autoplayStopOnLast:true,
			cube:{
				shadow: false
			},
			onInit:function(e){
				var obj = $(parent.find('.swiper-slide')[e.activeIndex]);
				var index = $(obj).find('.module-slide').attr('data-index');
				$(obj).find('.module-hot').addClass('animate');
				if($(obj).find('.module-rich-one').length>0){
					var arr = $(obj).find('.module-rich-one');
					for(var x=0;x<arr.length;x++){
						$(arr[x]).addClass('animate'+(x+1));	
					}
				}else{
					try{
						var _index = parseInt(index);	
						if(data.length>_index){
							moduleControl.loadImage(data[_index].img);	
						}
					}catch(ex){}
				}
				parent.find('#module-slide-page').text(index);				
			},
			onSlideChangeEnd:function(e){
				if(t.isClose)
					return;
				var obj = $(parent.find('.swiper-slide')[e.activeIndex]);
				var index = $(obj).find('.module-slide').attr('data-index');
				$(obj).find('.module-hot').addClass('animate');
				if($(obj).find('.module-rich-one').length>0){
					var arr = $(obj).find('.module-rich-one');
					for(var x=0;x<arr.length;x++){
						$(arr[x]).addClass('animate'+(x+1));	
					}
				}else{
					try{
						var _index = parseInt(index);	
						if(data.length>_index){
							moduleControl.loadImage(data[_index].img);	
						}
					}catch(ex){}
				}
				parent.find('#module-slide-page').text(index);
			}
		});			
	},
	initCircle:function(time,id){
		Circles.create({
			id:id+'module-circle',
			radius:18,
			value:100,
			maxValue:100,
			width:2,
			text:function(value){
				return '';
			},
			colors:['#666','#fff'],
			duration:time
		});			
	},
	add:function(e,type,isAuto){
		isAuto = isAuto==null?false:isAuto;
		if($(e).hasClass('disabled')){
			if(isAuto)
				return;
			return App.public.showInfo('请在后台开通模块组件');	
		}
			
		if($(e).hasClass('run')){
			if(isAuto)
				return;
			return App.public.showInfo('当前有组件正在显示');
		}
		
		if(this.running){
			if(isAuto)
				return $(e).addClass('wait');
			return App.public.showInfo('当前有组件正在显示');
		}
		this._add(type,e,isAuto);
	},
	_add:function(type,e,isAuto){
		this.running = true;
		var t = this;
		$(e).addClass('animate');
		this.getData(type,function(data){
			$(e).removeClass('animate');
			var newId = App.public.getId();
			var val = '';
			var time = 8000;
			var _time = 0;
			if(data.length>0){
				if(type==0){
					time = time*data.length;
					time = time +((data.length-1)*700);
					val = t.showHot(data,newId);
				}else{
					time = time*Math.ceil(data.length/3);
					time = time +((Math.ceil(data.length/3)-1)*700);
					val = t.showRich(data,newId);
				}
			}else{
				var info = type==0?'没有红人榜数据':'没有土豪榜数据';
				if(!isAuto)
					App.public.showInfo(info);
				t.running = false;
				$(e).removeClass('run');
				t.close(e);
				//$(e).removeClass('wait');
				//t.check();
				return;	
			}
			time = time-150;
			var html = '<div id="'+newId+'" class="module-box"><div class="module-title">'+t.title[type]+'<span id="'+newId+'module-circle" class="module-circle"></span></div><div class="module-main">'+val+'</div></div>';
			$('#moduleBox').html(html);
			var color = t.color[App.public.getRandom(0,t.color.length-1)];
			$('#'+newId).find('.module-title').css({background:color});
			$('#msgBoxAll').removeClass('show').addClass('hide');
			$('#moduleBox').removeClass('hide').addClass('show');
			setTimeout(function(){
				t.initSwiper(newId,data);
				t.initCircle(time,newId);
				t.count(e,time,isAuto);				
			},500);
		});	
	},
	count:function(e,time){
		var t = this;
		setTimeout(function(){
			t.close(e);	
		},time);	
	},
	check:function(){
		var arr = $('._onWallModule.wait');
		if(arr.length>0){
			var e = arr[0];
			var type = $(e).attr('data-module');
			this._add(type,e,true);	
		}
	},
	resetSwiper:function(){
		if(this.Swiper!=null){
			var t = this;
			try{
				t.Swiper.update();		
			}catch(ex){}
		}
	},
	close:function(e,fn){
		var t = this;
		this.isClose = true;
		try{
			t.Swiper.stopAutoplay();
			t.Swiper.destory();
			t.Swiper = null;
		}catch(ex){}
		$(e).removeClass('run wait');
		if(!$(e).hasClass('disabled')){
			if($(e).hasClass('onWallHot_icon')){
				this._start(0);
			}else if($(e).hasClass('onWallRich_icon')){
				this._start(1);
			}
		}
		$('#msgBoxAll').removeClass('hide').addClass('show');
		$('#moduleBox').removeClass('show').addClass('hide');
		setTimeout(function(){
			t.running = false;
			t.check();
		},1000);	
	}
}
export default moduleControl;