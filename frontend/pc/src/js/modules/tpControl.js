
var tpControl = {
	data:null,
	showTime:120,
	delay:300,
	first:false,
	errorIndex:null,
	timeout:null,
	countTime:function(){
		var m = this.showTime;
		setTimeout(function repeatFn(){
			if(m<=-1)
				return tpControl.close();
			$('.tpCountTime').html(m);
			m--;
			setTimeout(repeatFn,1000);
		},1000);	
	},
	preloadImg:function(data,callback){
		var index = 0;
		for(var x=0;x<data.length;x++){
			var img = new Image();
			img.onload = img.onerror = function(){
				index++;
				if(index==data.length){
					callback();		
				}
			}	
			img.src = data[x].picture;	
		}
	},
	able:false,
	_init:function(fn1,fn2){
		if($('#tpAll').length>0)
			return;	
		var t = this;
		ajax_getTpUser(function(json){
			if($('#tpAll').length>0)
				return;
			if(typeof json.config=='undefined'||json.config==null){
				$('.onWallPk_icon').removeClass('animate');
				t.error(0);
				if(fn2){
					App.public.showInfo('获取数据失败');
				}
				return;
			}
			if(json.item==null||json.item.length==0){
				$('.onWallPk_icon').removeClass('animate');
				if(fn2){
					App.public.showInfo('没有PK选手');
				}
				return t.error(1);
			}
			if(json.config.isopen==1){
				$('.onWallPk_icon').removeClass('animate');
				if(fn2){
					App.public.showInfo('请在后台开启PK功能');
				}
				return t.error(2);		
			}
			$('.onWallPk_icon').removeClass('disabled');
			tpControl.delay = json.config.jg;
			tpControl.showTime = json.config.xs;
			tpControl.data = tpControl.sort(json.item);
			tpControl.preloadImg(json.item,function(){
				tpControl.create(json.item,json.config.theme);		
			});	
			if(fn1)
				fn1();
		},function(errorMsg){
			if(fn2)
				fn2(errorMsg);			
		});	
	},
	init:function(){
		if($('#tpAll').length>0)
			return;		
		var t = this;
		ajax_getTpUser(function(json){
			if($('#tpAll').length>0)
				return;
			if(typeof json.config=='undefined'||json.config==null){
				$('.onWallPk_icon').removeClass('animate');
				return t.error(0);
			}
			if(json.item==null||json.item.length==0){
				$('.onWallPk_icon').removeClass('animate');
				return t.error(1);
			}
			if(json.config.isopen==1){
				$('.onWallPk_icon').removeClass('animate');
				return t.error(2);		
			}
			$('.onWallPk_icon').removeClass('disabled');
			tpControl.delay = json.config.jg;
			tpControl.showTime = json.config.xs;
			//tpControl.data = tpControl.sort(json.item);
			setTimeout(function(){
				tpControl._init();	
			},tpControl.delay*1000);	
		},function(errorMsg){
			tpControl.error();			
		});			
	},
	sort:function(data){
		if(data==null||data.length==0)
			return [];
		var newArr = [];
		newArr.push.apply(newArr,data);
					
		newArr = newArr.sort(function(a,b){
			return parseFloat(b.votes)-parseFloat(a.votes);		
		});	
		
		for(var x=0;x<data.length;x++){
			var e = data[x];
			for(var y=0;y<newArr.length;y++){
				if(e.tid==newArr[y].tid){
					e.index = y;
					break;		
				}
			}
		}
		this.data = data;
		return data;
	},
	addPoint:function(tid,giftId,date){
		if(date!=null&&tpControl.date!=null){
			if(date<=tpControl.date)
				return;
		}
		if(tid==null||tid=='')
			return;
		if($('#tpAll').length==0)
			return;
		if(tpControl.data==null)
			return;
		var data = this.data;
		var b = false;
		for(var x=0;x<data.length;x++){
			if(data[x].tid==tid){
				b = true;
				var votes = parseInt(allData._newDs[giftId].price);
				data[x].votes += parseInt(votes);
				$('.oneTp[tid="'+tid+'"]').find('.oneTp_point').html(data[x].votes);
				break;
			}
		}
		if($('#tpAll').length==0)
			return;
		if(b)
			this.reset();
	},
	reset:function(){
		var data = this.data;
		var newArr = [];
		newArr.push.apply(newArr,data);
					
		newArr = newArr.sort(function(a,b){
			return parseInt(b.votes)-parseInt(a.votes);		
		});	
		for(var x=0;x<newArr.length;x++){
			var e = newArr[x];
			if(x==0){
				$('.oneTp.bg_tp_no1').removeClass('bg_tp_no1');
				$('.oneTp .pk_title1').removeClass('pk_title1');
				var obj = $('.oneTp[tid="'+e.tid+'"]');
				obj.addClass('bg_tp_no1');
				obj.find('.pk_title').addClass('pk_title1');
			}else if(x==1){
				$('.oneTp.bg_tp_no2').removeClass('bg_tp_no2');
				$('.oneTp .pk_title2').removeClass('pk_title2');
				var obj = $('.oneTp[tid="'+e.tid+'"]');
				obj.addClass('bg_tp_no2');
				obj.find('.pk_title').addClass('pk_title2');
			}else if(x==2){
				$('.oneTp .pk_title3').removeClass('pk_title3');
				var obj = $('.oneTp[tid="'+e.tid+'"]');
				obj.find('.pk_title').addClass('pk_title3');
			}
		}
	},
	create:function(data,theme){
		if($('#tpAll').length>0)
			return;	
		this.data = this.sort(this.data);
		var cName = '';
		if($('#bpControl').hasClass('show'))
			cName += ' hidden';
		var html = '<div id="tpAll" class="'+cName+'">';
		html += '<div id="tpAllVideoBox"></div>';
		html += '<div id="tpHead">';
		html += '<span><img src="'+allImage.logo+'" />'+theme+'</span></div>';
		html += '<div class="tpTitleBox"><span>喜欢Ta就支持Ta，<tt class="tpCountTime">'+this.showTime+'</tt> 秒后返回上墙</span><img src="'+allImage.pk_pcTitleBg+'" /></div>';
		html += '<div id="tpBox"><div class="tpMain">';
		html += '<div id="tpMain">';
		for(var x=0;x<data.length;x++){
			html += this.ceateOne(data[x]);
		}
		html += '</div>';
		html += '</div></div>';
		html += '</div>';
		$(html).appendTo($('#all'));
		setTimeout(function(){
			$('#tpAll').addClass('animate');
		},100);
		this.able = true;
		this.countTime();
		$('#allBox').addClass('hidden');
		if(data.length>2)
			this.start();
	},
	ceateOne:function(e){
		var top = e.index==0?'bg_tp_no1':(e.index==1?'bg_tp_no2':'bg_tp');
		var html = '<div class="oneTp '+top+'"" tid="'+e.tid+'">';		
		html += '<i class="tpBg"></i>';
		if(e.index==0)
			html += '<span class="pk_title pk_title1"></span>';
		else if(e.index==1)
			html += '<span class="pk_title pk_title2"></span>';
		else if(e.index==2)
			html += '<span class="pk_title pk_title3"></span>';
		else 
			html += '<span class="pk_title"></span>';
		html += '<div class="_oneTp">';
		html += '<div class="oneTp_name ellipsis">'+e.title+'</div>';
		html += '<div class="oneTp_img"><img onload="App.public.setImage(this)" src="'+e.picture+'" /></div>';
		html += '<div class="oneTp_bottom ellipsis"><span>'+e.number+'号</span><span>支持点数 <tt class="oneTp_point">'+e.votes+'</tt></span></div>';
		html += '</div></div>';
		return html;
	},
	start:function(){
		//if(!this.able)
			//return;
		this.able = true;
		tpControl.timeout = setTimeout(function(){
			tpControl.run();		
		},4000);
	},
	run:function(){
		if(!this.able)
			return;
		$('#tpMain').css({transition:'transform 1s'});
		var firstChild = $('#tpMain').find('.oneTp')[0];
		var node = firstChild.cloneNode(true);
		$('#tpMain')[0].appendChild(node);
		$('#tpMain').css({transform:'translate3d(-380px,0,0)'});
		setTimeout(function(){
			tpControl.after();	
		},1000);		
	},
	after:function(){
		if(!this.able)
			return;
		if($('#tpMain').find('.oneTp')[0])
			$($('#tpMain').find('.oneTp')[0]).remove();	
		$('#tpMain').css({transition:'none'});
		$('#tpMain').css({transform:'translate3d(0,0,0)'});
		if(!this.able)
			return;
		tpControl.timeout = setTimeout(function(){
			tpControl.run();		
		},4000);
	},
	close:function(){
		this.able = false;
		$('#tpAll').remove();
		$('#allBox').removeClass('hidden');
		setTimeout(function(){
			tpControl._init();		
		},tpControl.delay*1000);
	},
	error:function(x){
		$('.onWallPk_icon').addClass('disabled');
		this.errorIndex = x;
	},
	showNow:function(e){
		if($(e).hasClass('animate'))
			return;
		if($(e).hasClass('disabled')){
			var msg = (this.errorIndex==null||this.errorIndex==0)?'获取数据失败':(this.errorIndex==1?'没有PK选手':'请在后台开启PK功能');
			return App.public.showInfo(msg);	
		}
		$(e).addClass('animate');
		this._init(function(){
			$(e).removeClass('animate');		
		},function(errorMsg){
			$(e).removeClass('animate');
			App.public.showInfo(errorMsg||'操作失败');		
		});		
	},
	_show:function(fn1,fn2){
		clearTimeout(tpControl.timeout);
		if($('#tpAll').length>0)
			return;
		var timeout = null;
		timeout = setTimeout(function(){
			if(fn2)
				fn2();	
		},10000);
		ajax_getTpUser(function(json){
			try{
				clearTimeout(timeout);
			}catch(ex){}
			if($('#tpAll').length>0)
				return;
			if(typeof json.config=='undefined'||json.config==null)
				return fn2('酒吧还没有设置好PK功能，在后台完成设置后可开启');
			if(json.item==null||json.item.length==0)
				return fn2('酒吧还没有设置好PK功能，在后台完成设置后可开启');
			if(json.config.isopen==1){
				return fn2('PK功能已经关闭');	
			}
			tpControl.data = tpControl.sort(json.item);
			tpControl.date = json.date;
			tpControl.preloadImg(json.item,function(){
				fn1();
				tpControl._create(json.item,json.config.theme);	
			});	
		},function(errorMsg){
			if(fn2)
				fn2(errorMsg);			
		});			
	},
	date:null,
	_create:function(data,theme){
		if($('#tpAll').length>0)
			return;	
		this.data = this.sort(this.data);
		var html = '<div id="tpAll">';
		html += '<div class="tpTitleBox"><span>'+theme+'</span><img src="'+allImage.pk_pcTitleBg+'" /></div>';
		html += '<div id="tpBox"><div class="tpMain">';
		html += '<div id="tpMain">';
		for(var x=0;x<data.length;x++){
			html += this.ceateOne(data[x]);
		}
		html += '</div>';
		html += '</div></div>';
		html += '</div>';
		$(html).appendTo($('.oneSwitch_pk .oneSwitchBox'));
		this.able = true;
		if(data.length>2)
			this.start();
	}
};

window.tpControl = tpControl;
export default tpControl;