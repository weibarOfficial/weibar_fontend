

//跑马灯控制器
var marqueeControl = {
	list:[],
	_list:[],
	able:true,
	timeout:null,
	runTimeout:null,
	isExe:false,
	createExe:function(){
		this.isExe = true;
		$('#marqueeBox').remove();
		$('<div class="marqueeBox marqueeBoxExe" id="marqueeBox"><div class="marquee"></div></div>').appendTo($('#all'));
	},
	create:function(){
		$('#marqueeBox').remove();
		$('<div class="marqueeBox" id="marqueeBox"><div class="marquee"></div></div>').appendTo($('#onWallHead'));	
	},
	stop:function(){
		$('.onWallHeadBox').removeClass('posLeft');
		this.able = false;	
		clearTimeout(this.timeout);
		clearTimeout(this.runTimeout);
		$('.marqueeBox').removeClass('show');
		$('.marquee').html('');
		$('.marquee').css({transition:'none'});	
		$('.marquee').css({transform:'translate3d(0,0,0)'});
	},
	open:function(){
		this.able = true;
		$('.onWallHeadBox').addClass('posLeft');
		this.start(true);
	},
	setAble:function(b){
		if(b)
			return this.open();
		this.stop();		
	},
	init:function(){
		var _qixiBar = typeof qixiBar=='undefined'?'false':qixiBar;
		_qixiBar = allData.barName.indexOf('胡桃里')!=-1?'false':_qixiBar;
		var t = this;
		var timeout = false;
		setTimeout(function(){
			timeout = true;
		},1000*60*10);
		setTimeout(function(){
			ajax_getMarquee(function(arr){
				arr = (typeof arr=='undefined'||arr==null||arr.length==0)?[]:arr;
				
				/*
				if(typeof _qixiBar!='undefined'&&_qixiBar=='true'){
					if(typeof sysDate!='undefined'){
						var nowDate = sysDate.split(' ');
						if(nowDate.length>0){
							if(nowDate[0]=='2017-08-26'||nowDate[0]=='2017-08-27'||nowDate[0]=='2017-08-28'){
								arr.push('七夕【霸屏】示爱！霸屏排序末位逢7中奖！');
								arr.push('霸屏中奖者，点击手机右侧"中奖查询"兑奖');	
							}else if(nowDate[0]=='2017-08-24'||nowDate[0]=='2017-08-25'){
								arr.push('本周六至下周一，七夕霸屏狂送礼，等你哦~');	
							}
						}
					}
				}
				*/
				t._list = arr;
				setTimeout(arguments.callee,60000);
			},function(){
				setTimeout(arguments.callee,60000);	
			});
		},60000);	
		if(allData.marqueeList!=null&&allData.marqueeList.length>0)
			this.list = allData.marqueeList;
		/*
		var that = this;
		try{
			if(typeof _qixiBar!='undefined'&&_qixiBar=='true'){
				if(typeof sysDate!='undefined'){
					var nowDate = sysDate.split(' ');
					if(nowDate.length>0){
						if(nowDate[0]=='2017-08-26'||nowDate[0]=='2017-08-27'||nowDate[0]=='2017-08-28'){
							that.list.push('七夕【霸屏】示爱！霸屏排序末位逢7中奖！');
							that.list.push('霸屏中奖者，点击手机右侧"中奖查询"兑奖');	
						}else if(nowDate[0]=='2017-08-24'||nowDate[0]=='2017-08-25'){
							that.list.push('本周六至下周一，七夕霸屏狂送礼，等你哦~');	
						}
					}
				}
			}
		}catch(ex){}
		*/
	},
	start:function(bool){
		var t = this;
		if(this.isExe)
			systemControl.data.marqueeDelay = 20000;
		var delay = systemControl.data.marqueeDelay-1000;
		delay = delay<5000?5000:delay;
		t.timeout = setTimeout(function(){
			if(!t.isExe)
				$('.marqueeBox').css({left:$('.onWallHeadBox p')[0].offsetWidth+50});
			if(t._list!=null&&t._list.length>0)
				t.list = t._list;
			try{clearTimeout(t.timeout)}catch(ex){}
			t.timeout = setTimeout(function(){
				if(t.list.length>0&&t.able)
					t._start();
				else{
					t.start();
				}
				//else
					//t.timeout = setTimeout(arguments.callee,1000);			
			},500);				
		},bool==true?0:delay);		
	},
	getWidth:function(){
		var arr = $('.marquee .oneMarquee');
		var w = 0;
		for(var x=0;x<arr.length;x++){
			w += arr[x].offsetWidth+250;	
		}
		return w;
	},
	_start:function(){
		var t = this;
		var html = '';
		for(var x=0;x<this.list.length;x++){
			html += '<span class="oneMarquee">'+this.list[x]+'</span>';
		}
		$('.marquee').html(html+'<div style="clear:both"></div>');
		$('.marqueeBox').addClass('show');
		var width = t.getWidth();
		//$('.marquee').css({width:width});
		t.run(width);
	},
	run:function(width){
		var t = this;
		width += $(window).width();
		var speed = (15-systemControl.data.marqueeSpeed)*(width/1000);
		$('.marquee').css({transition:'transform '+speed+'s linear'});
		$('.marquee').css({transform:'translate3d('+(width*-1)+'px,0,0)'});
		this.runTimeout = setTimeout(function(){
			$('.marqueeBox').removeClass('show');
			$('.marquee').css({transition:'none'});	
			$('.marquee').css({transform:'translate3d(0,0,0)'});
			t.start();	
		},speed*1000);	
	}
}

export default marqueeControl;