(function(){
if(typeof WM=='undefined')
	WM = {}
var Phone = {version:2.0};
WM.copyRight = function(){
    var boxH = $('.box').outerHeight(true);
    var winH = $(window).height();
    var bool = winH-boxH>60;
    var html = '';
    html += bool?'<div class="copyRight copyAbs">':'<div class="copyRight copyNor">';
    html += '<div class="copy">©wemew 微喵<span class="copyWemewIcon"></span></div>';
    html += '</div></div>';
    $(html).appendTo($('body'));
}
WM.redraw = function(){
	$('.copyRight').remove();
    WM.copyRight();
}
window.Transition = {
	default:{
			
	},
	go:function(data){
		var old = {};
		var time = ((data.time||500)/1000)+'s';
		var mode = data.mode||'';
		var keep = data.keep==null?false:data.keep;
		var back = data.back==null?false:data.back;
		var index = 0;
		var val = '';
		for(var i in data.style){
			old[i+''] = $(data.obj).css(i+'');
			val += i+' '+time+' '+mode+',';
			index++;	
		}
		val = val.substr(0,val.length-1);
		var onEnd = back?-1:0;
		$(data.obj).bind('webkitTransitionEnd',function(e){
			index--;
			if(back){
				back = false;
				$(data.obj).css(old);
			}else{
				if(index!=onEnd)
					return;	
				$(this).unbind('webkitTransitionEnd');
				if(!keep)
					$(this).css({'-webkit-transition':''});
				$(data.obj).removeClass('open3D');	
				if(data.callback)
					data.callback();	
			}	
		});	
		$(data.obj).addClass('open3D').css({'-webkit-transition':val});	
		$(data.obj).css(data.style);
	},
	double:function(data){
		data.back = true;
		this.go(data);		
	}
}
WM.Phone = Phone;
window.showInfo = function(txt,bool,style){
	bool = bool==null?true:bool;
	return WM.Phone.get({
		type:'showInfo',
		mode:bool,
		innerHTML:txt,
		style:style	
	});
}
Phone.getId = function(){
	return ('Phone'+Math.random()+new Date().getTime()).replace('.','');
}
Phone.getType = function(code){
	return Object.prototype.toString.call(code).replace(/]/,'').split(" ")[1];	
};
Phone.bindEnter = function(e,btn){
	$(e).bind('keydown',function(ev){
		if(ev.keyCode==13){
			$(btn).click();
		}
	})		
}
Phone.extend = function(a,b,bool){
	if(Phone.getType(b)=='Object'){
		for(var i in b){
			if(bool&&Phone.getType(b[i])=='Object'){
				if(!a[i]||Phone.getType(a[i])!='Object')
					a[i] = {};
				Phone.extend(a[i],b[i]);		
			}else	
				a[i] = b[i];	
		}	
	}
}
Phone.setButton = function(e,b,text){
	if(b){
		if(e.old==null)
			return;
		text = text||e.old.value;
		e.onclick = e.old.onclick;	
		if(e.old.jqClick!=null)
			$(e).bind('click',e.old.jqClick['handler']);
		$(e).css({background:e.old.background,color:e.old.color,borderColor:e.old.borderColor}).html(text);	
		e.old = null;
	}else{
		text = text||e.innerHTML;
		e.old = {
			onclick:e.onclick,
			value:e.innerHTML,
			borderColor:$(e).css('borderColor'),
			background:$(e).css('background'),
			color:$(e).css('color')
		}
		if($(e).data('events')!=null)
			e.old.jqClick = $(e).data('events')['click'][0];
		$(e).unbind('click');
		e.onclick = null;
		$(e).css({background:'#999',color:'#f9f9f9',borderColor:'#999'}).html(text);	
	}
}

Phone._setButton = function(e,b,text){
	if(b){
		if(e.old==null)
			return;
		text = text||e.old.value;
		e.onclick = e.old.onclick;	
		if(e.old.jqClick!=null)
			$(e).bind('click',e.old.jqClick['handler']);
		$(e).html(text).removeClass('disabledBtn');	
		e.old = null;
	}else{
		text = text||e.innerHTML;
		e.old = {
			onclick:e.onclick,
			value:e.innerHTML,
			color:$(e).css('color')
		}
		if($(e).data('events')!=null)
			e.old.jqClick = $(e).data('events')['click'][0];
		$(e).unbind('click').addClass('disabledBtn');
		e.onclick = null;
		$(e).html(text);	
	}
}

Phone.setPrice = function(obj){
	var b,p,np,n = 0,newP = '';
	var fn = function(){
		for(var x=np.length-1;x>=0;x--){
			newP = np[x]+newP;
			if(n!=0&&(n+1)%3==0&&x!=0)
				newP = ','+newP;
			n++;		
		}	
	}
	if(Phone.getType(obj)=='String'){
		b = obj.indexOf('￥');
		p = obj.replace('￥','');
		np = p.split('.')[0]+'';
		var end = p.split('.').length>0?'.'+p.split('.')[1]:'';
		fn();
		return (!b?'￥'+newP:newP	)+end;
	}else if(Phone.getType(obj)=='Number'){
		np = (obj+'').split('.')[0]+'';
		var end = p.split('.').length>0?'.'+p.split('.')[1]:'';
		fn();
		return newP+end;
	}else{
		b = $(obj).html().indexOf('￥');
		p = $(obj).html().replace('￥','');
		np = p.split('.')[0]+'';	
		fn();
		if(p.split('.').length>1)
			newP = newP+'.'+p.split('.')[1];
		$(obj).html(!b?'￥'+newP:newP);	
	}

}

Phone.show = function(e,type){
	e = e.length>0?e[0]:e;
	switch(type){
		case '':
			break;
		case 'scale':
			$(e).addClass('Phone_show_scale');
			setTimeout(function(){
				$(e).css({
					'-webkit-transform':'scale(1)',	
					opacity:1,
					'-webkit-transition':'all 0.1s'
				});
			},50);
			break;
		case 'top':
			var len = e.offsetTop;
			$(e).css({top:len+20,opacity:0});
			$(e).animate({
				opacity:1,
				top:len
			},200);	
			break;
		case 'fadeIn':
			$(e).fadeIn();
			break;
	}
}
Phone.hide = function(e,type,fn){
	e = e.length>0?e[0]:e;
	switch(type){
		case '':
			if(fn)
				fn();
			break;
		case 'scale':
			setTimeout(function(){
				$(e).css({
					'-webkit-transform':'scale(2)',	
					opacity:0,
					'-webkit-transition':'all 0.2s'
				});
				setTimeout(function(){
					if(fn)
						fn();			
				},200);
			},50);
			break;
		case 'top':
			var len = e.offsetTop;
			$(e).animate({
				opacity:0,
				top:len-20
			},200);	
			setTimeout(function(){
				if(fn)
					fn();			
			},200);	
			break;
		case 'fadeIn':
			$(e).fadeOut();
			break;	
	}	
}
Phone.moveToCenter = function(e,scrollTop){
	scrollTop = scrollTop||0;
	e = e.length>0?e[0]:e;
	var w = e.offsetWidth==0?$(e).width():e.offsetWidth;
	var h = e.offsetHeight==0?$(e).height():e.offsetHeight;
	$(e).css({top:(($(window).height()-h)/2)+scrollTop,left:($(window).width()-w)/2});	
}
Phone.setCenter = function(e,scrollTop){
	scrollTop = scrollTop||0;
	e = (e.length!=null&&e.length>0)?e[0]:e;
	$(e).css({
		left:'50%',
		top:'50%',
		marginTop:((e.offsetHeight/-2)+scrollTop)+'px',
		marginLeft:e.offsetWidth/-2+'px'
	});
}

Phone.getRandom = function(begin,end){
	return parseInt(Math.random()*((end>begin?end-begin:begin-end)+1)+(end>begin?begin:end));	
}

var _window = function(data){
	this.ready = data.ready==null?function(){}:data.ready;
	this.click = data.click==null?function(){this.close()}:data.click;
	this.moveToCenter = function(){
		if(data.scroll){
			Phone.setCenter($('#'+this.id),$(window).scrollTop());
			$('#'+this.id).css({position:'absolute'});
		}else
			Phone.setCenter($('#'+this.id));
	}
	this.close = function(){
		if($('#'+this.id).length>0){
			$('#'+this.id).remove();
			$('#'+this.coverId).remove();		
		}		
	}
	this.find = function(code){
		if(code==null)
			return $('#'+this.id);
		else
			return $('#'+this.id).find(code);	
	}
	this.id = Phone.getId();
	this.coverId = 'cover'+this.id;
	var cover = '<div class="Phone_cover" id="'+this.coverId+'"></div>';
	var html = '<div class="Phone_all Phone_window" id="'+this.id+'">';	
	if(data.headHide==null||!data.headHide){
		html += '<div class="Phone_window_head">';
		html += '<span>'+(data.title||'')+'</span>';
		html += '</div>';
	}
	html += '<div class="Phone_window_main">';
	html += data.innerHTML;
	html += '</div>';
	html += '</div>';
	$(cover).appendTo($('body'));
	$(html).appendTo($('body'));
	this.moveToCenter();
	this.ready();
}

var box = function(data){
	this.init(data);	
}
box.prototype = {
	init:function(data){
		this.data = data;
		this.canClose = true;
		this.click = data.click==null?function(){this.close()}:data.click;
		this.ready = data.ready==null?function(){}:data.ready;
		this.create(data);
		this.set();	
	},
	create:function(data){
		this.id = Phone.getId();
		this.coverId = 'cover'+this.id;
		var cover = '<div class="Phone_cover" id="'+this.coverId+'"></div>';
		var html = '<div class="Phone_all Phone_box" id="'+this.id+'">';

		if(data.headHide==null||!data.headHide){
			html += '<div class="Phone_box_head">';
			html += '<span>'+(data.title||'')+'</span>';
			html += '</div>';
		}
		
		html += '<div class="Phone_box_main">';
		html += data.innerHTML;
		html += '</div>';
		
		if(data.btnHide==null||!data.btnHide){
			var bt = ['取消','确定'];
			if(data.btnText!=null)
				bt = data.btnText;
				
			html += '<div class="Phone_box_foot">';	
			//var oneWidth = 100/bt.length;
			for(var x=0;x<bt.length;x++){
				html += '<a data-index="'+x+'" class="Phone_button '+(x==0?'Phone_button_n':'Phone_button_y')+' '+(x==bt.length-1?'':'hasBorderRight')+'">'+bt[x]+'</a>';		
			}
			html += '<div style="clear:both"></div>';
			html += '</div>';
			/*
			if(bt.length==3){
				for(var x=0;x<bt.length;x++)
					html += '<a class="Phone_button '+(x==0?'Phone_button_n':'Phone_button_y')+'" style="width:'+(x==1?'33.34':'33.33')+'%; font-size:14px; '+(x==1?'border-right:solid 1px #eee; box-sizing:border-box;':'')+'">'+bt[x]+'</a>';		
			}else{
				html += '<a class="Phone_button Phone_button_n">'+bt[0]+'</a>';
				html += '<a class="Phone_button Phone_button_y">'+bt[1]+'</a>';
			}
			html += '<div style="clear:both"></div>';
			html += '</div>';
			*/
		}
		if(data.coverHide==null||!data.coverHide)
			$(cover).appendTo($('body'));
		$(html).appendTo($('body'));
		this.moveToCenter();
		this.ready();
	},
	getButton:function(){
		return $('#'+this.id).find('.Phone_box_foot .Phone_button');	
	},
	lock:function(b){
		this.canClose = !b;	
	},
	moveToCenter:function(){
		if(this.data.scroll!=null&&this.data.scroll){
			Phone.setCenter($('#'+this.id),$(window).scrollTop());
			$('#'+this.id).css({position:'absolute'});
		}else
			Phone.setCenter($('#'+this.id));
	},
	set:function(){
		var self = this;
		$('#'+this.id).find('.Phone_button').click(function(){
			if(self.click){
				self.click($(this).hasClass('Phone_button_y'),this,$(this).attr('data-index'));	
			}	
		});
		return;
		var a1 = $('#'+this.id).find('.Phone_button_n');
		var a2 = $('#'+this.id).find('.Phone_button_y');
		
		if(a1.length>0){
			a1[0].onclick = function(){
				if(self.click)
					self.click(false,this);
			}
		}
		if(a2.length>0){
			a2[0].onclick = function(){
				if(self.click)
					self.click(true,this);
			}
		}
	},
	find:function(code){
		if(code)
			return $('#'+this.id).find('.Phone_box_main').find(code);
		return ('#'+this.id).find('.Phone_box_main');
	},
	close:function(){
		if(!this.canClose)
			return;
		var self = this;
		if($('#'+self.id).length>0){
			$('#'+this.id).remove();
			$('#'+this.coverId).remove();		
		}	
	}
}

Phone.box = box;

var _showInfo = function(data){
	data.mode = data.mode==null?true:data.mode;
	if($('.Phone_showInfo').length>0)
		$('.Phone_showInfo').remove();
	var id = Phone.getId();
	if(data.mode)
		var html = '<div class="Phone_showInfo Phone_radius" id="'+id+'">';
	else
		var html = '<div class="Phone_showInfo errorMsg Phone_radius" id="'+id+'">';
	if(data.mode)
		html += '<span class="Phone_showInfo_ok"></span>';
	//else
		//html += '<span class="Phone_showInfo_error"></span>';
	html += data.innerHTML;
	html += '</div>';
	$(html).appendTo($('body'));
	Phone.setCenter($('#'+id));
	if(!data.mode)
		$('#'+id).css({top:'92%'});
	if(data.style)
		$('#'+id).css(data.style);
	Phone.show($('#'+id),data.showType);	
	setTimeout(function(){
		Phone.hide($('#'+id),data.showType,function(){
			$('#'+id).remove();
		});	
	},data.delay||1500);
}

Phone.loading = function(data){
	if($('.Phone_loading').length>0)
		$('.Phone_loading').remove();
	this.id = Phone.getId();
	this.coverId = 'cover'+this.id;
	var cover = '<div class="Phone_loading_cover" id="'+this.coverId+'"></div>';
	var html = '<div class="Phone_loading Phone_radius" id="'+this.id+'">';
	html += '<div class="Phone_loading_box">';
	html += '<div class="Phone_loading_leaf Phone_loading_leaf_0"></div>';
    html += '<div class="Phone_loading_leaf Phone_loading_leaf_1"></div>';
    html += '<div class="Phone_loading_leaf Phone_loading_leaf_2"></div>';
    html += '<div class="Phone_loading_leaf Phone_loading_leaf_3"></div>';
    html += '<div class="Phone_loading_leaf Phone_loading_leaf_4"></div>';
    html += '<div class="Phone_loading_leaf Phone_loading_leaf_5"></div>';
    html += '<div class="Phone_loading_leaf Phone_loading_leaf_6"></div>';
    html += '<div class="Phone_loading_leaf Phone_loading_leaf_7"></div>';
    html += '<div class="Phone_loading_leaf Phone_loading_leaf_8"></div>';
    html += '<div class="Phone_loading_leaf Phone_loading_leaf_9"></div>';
    html += '<div class="Phone_loading_leaf Phone_loading_leaf_10"></div>';
    html += '<div class="Phone_loading_leaf Phone_loading_leaf_11"></div>';
	html += '</div>';
	//html += '<div class="Phone_loading_text">数据加载中</div>';
	html += '</div>';
	$(cover).appendTo($('body'));
	$(html).appendTo($('body'));
	Phone.setCenter($('#'+this.id));
	this.close = function(){
		$('#'+this.coverId).remove();
		$('#'+this.id).remove();
	}
}

Phone.loading.getHtml = function(){
	var html = '<div class="Phone_loading Phone_radius">';
	html += '<div class="Phone_loading_box">';
	html += '<div class="Phone_loading_leaf Phone_loading_leaf_0"></div>';
    html += '<div class="Phone_loading_leaf Phone_loading_leaf_1"></div>';
    html += '<div class="Phone_loading_leaf Phone_loading_leaf_2"></div>';
    html += '<div class="Phone_loading_leaf Phone_loading_leaf_3"></div>';
    html += '<div class="Phone_loading_leaf Phone_loading_leaf_4"></div>';
    html += '<div class="Phone_loading_leaf Phone_loading_leaf_5"></div>';
    html += '<div class="Phone_loading_leaf Phone_loading_leaf_6"></div>';
    html += '<div class="Phone_loading_leaf Phone_loading_leaf_7"></div>';
    html += '<div class="Phone_loading_leaf Phone_loading_leaf_8"></div>';
    html += '<div class="Phone_loading_leaf Phone_loading_leaf_9"></div>';
    html += '<div class="Phone_loading_leaf Phone_loading_leaf_10"></div>';
    html += '<div class="Phone_loading_leaf Phone_loading_leaf_11"></div>';
	html += '</div>';
	//html += '<div class="Phone_loading_text">数据加载中</div>';
	html += '</div>';
	return html;
}

Phone.loading.getHtml2 = function(){
	var html = '<div class="Phone_loading_box2">';
	html += '<div class="Phone_loading_leaf Phone_loading_leaf_0"></div>';
    html += '<div class="Phone_loading_leaf Phone_loading_leaf_1"></div>';
    html += '<div class="Phone_loading_leaf Phone_loading_leaf_2"></div>';
    html += '<div class="Phone_loading_leaf Phone_loading_leaf_3"></div>';
    html += '<div class="Phone_loading_leaf Phone_loading_leaf_4"></div>';
    html += '<div class="Phone_loading_leaf Phone_loading_leaf_5"></div>';
    html += '<div class="Phone_loading_leaf Phone_loading_leaf_6"></div>';
    html += '<div class="Phone_loading_leaf Phone_loading_leaf_7"></div>';
    html += '<div class="Phone_loading_leaf Phone_loading_leaf_8"></div>';
    html += '<div class="Phone_loading_leaf Phone_loading_leaf_9"></div>';
    html += '<div class="Phone_loading_leaf Phone_loading_leaf_10"></div>';
    html += '<div class="Phone_loading_leaf Phone_loading_leaf_11"></div>';
	html += '</div>';
	//html += '<div class="Phone_loading_text">数据加载中</div>';
	return html;	
}

imageView = function(src){
	this.init(src);
}
imageView.prototype = {
	init:function(data){
		this.id = Phone.getId();
		this.boxId = 'box'+this.id;
		this.data = data;
		var html = '<div class="imageView_fixAll" id="'+this.id+'">';
		html += '<div class="imageView_fixDiv">';
		html += '<div class="imageView_fixTitle"><span>4/5</span><a class="imageView_fixTitleClose"><i></i></a></div>';
		html += '<div class="imageView_fixBox" id="'+this.boxId+'">';
		for(var i=0;i<this.data.src.length;i++){
			html += '<div class="imageView_fixTable">';
			html += '<span class="imageView_fixSpan">';
			html += '<div class="imageView_loading">图片加载中</div>';
			html += '<img onload="imageView.setImage(this)" src="'+this.data.src[i]+'">';
			html += '</span></div>';
		}
		html += '</div></div></div>';	
		$(html).appendTo($('body'));
		var self = this;
		setTimeout(function(){	
			self.create();		
		},1);
	},
	setTitie:function(num){
		$('#'+this.id).find('.imageView_fixTitle span').html(num+'/'+this.data.src.length);		
	},
	create:function(){
		var t = this;
		$('#'+this.id).find('.imageView_fixTitle a').bind('click',function(){
			t.close();	
		});
		this.setTitie(1);
		
		var _swipe = new Touch.swipe({
			obj:document.getElementById(this.boxId),
			pageName:'imageView_fixTable',
			callback:function(a,b){
				t.setTitie(b+1);
			}
		});
		if(this.data.index!=null){
			_swipe.moveTo(this.data.index);
			this.setTitie(this.data.index+1);
		}
	},
	close:function(){
		$('#'+this.id).remove();
	}
}
imageView.setImage = function(e){
	var mw = 640,mh = $(window).height();
	if(e.width>e.height){
		if(e.width>mw){
			$(e).css({'max-width':mw});	
		}
	}else{
		if(e.width>mh){
			$(e).css({'max-height':mh});	
		}
	}
	$(e.parentNode).find('.imageView_loading').remove();	
}

Phone.showImage = function(src,txt){
	txt = txt||'';
	var loading = Phone.loading.getHtml();
	var html = '<div class="Phone_showImage" onclick="WM.Phone.showImage.close(this)">';
	html += loading;
	html += '<div class="Phone_showImage_box"><img src="'+src+'" onload="WM.Phone.showImage.load(this)" /></div><div class="Phone_showImage_txt"><span>轻触屏幕返回</span></div><div class="Phone_showImage_foot">'+txt+'</div></div>';
	/*
	html += '<div class="Phone_showImage_box"><span><img src="'+src+'" onload="WM.Phone.showImage.load(this)" /></span></div><div class="Phone_showImage_txt">请触屏幕返回</div></div>';
	*/
	$(html).appendTo($('body'));
	$('.Phone_showImage_txt').fadeIn(2000);
}
Phone.showImage.close = function(e){
	$(e).remove();	
}
Phone.showImage.load = function(e){
	//$(e).css({marginTop:e.height/-2});
	$(e.parentNode.parentNode.parentNode).find('.Phone_loading').remove();
	$(e).css({visibility:'visible'});
}

Phone.get = function(data){
	if(data.type==null) return;
	switch(data.type){
		case 'showInfo':
			if($('.Phone_showInfo').length>0)
				$('.Phone_showInfo').remove();
			Phone.extend(data,{
				showType:'fadeIn'	
			});
			return _showInfo(data);
			break;
		case 'window':
			return new _window(data);
			//return new Phone.box(data);
			break;
		case 'confirm':
			return new Phone.box(data);	
			break;
		case 'loading':
			return new Phone.loading(data);	
			break;
		case 'alert':
			data.ready = function(){
				$(this.getButton()[1]).css({
					width:'100%'	
				});
				$(this.getButton()[0]).remove();	
			}
			return new Phone.box(data);
			break;
		case 'imageView':
			if(data.length==0)
				return;
			return new imageView(data);
			break;
		case 'slideBox':
			return new slideBox(data);
			break;
		case 'nav':
			return new SlideNav(data);
			break;
	}
}

Phone.encodeCode = function(val){
	val = val.replace(/"/g, "&quot;");
	val = val.replace(/'/g, "&apos;");
	val = val.replace(/</g, "&lt;");
	val = val.replace(/>/g, "&gt;");
	return val;		
}

Phone.decodeCode = function(val){
	val = val.replace(/&quot;/g, '"');
	val = val.replace(/&apos;/g, "'");
	val = val.replace(/&lt;/g, '<');
	val = val.replace(/&gt;/g, ">");		
	return val;	
}

Html5FileUpload = {
	singleUpload:function(file,index,data,callback){
		data = data||{};
		var isImage = /image\/\w+/.test(file.type);
		var error = data.error||function(){};
		var filter = data.filter||'*';
		var rotate = data.rotate==null?false:data.rotate;
		var minWidth = data.minWidth==null?0:data.minWidth;
		var minHeight = data.minHeight==null?0:data.minHeight;
		var maxWidth = data.maxWidth||99999;
		var maxHeight = data.maxHeight||99999;
		var maxSize = data.size==null||1024; 
		maxSize = maxSize*1024;
		var saveType = data.saveType||'image/jpeg';
		var saveQuality = data.saveQuality==null?0.8:data.saveQuality;		
		var deg = null;
		if(isImage&&filter!='*'){
			var acceptFilter = false,filterError = '';
			for(var x=0;x<filter.length;x++){
				if(filter[x]==file.type){
					filterError += filter[x]+'、';
					acceptFilter = true;
					break;
				}
			}
			if(!acceptFilter){
				error({errorMsg:'请选择'+filterError.substring(0,filterError.length-1)+'格式的图片',errorType:'filter',errorIndex:index});
				return false;
			}
			saveType = data.saveType||file.type;
		}
		if(file.size/(1024*1024)>maxSize){
			error({errorMsg:'图片大小不能超过'+maxSize+'mb',errorType:'size',errorIndex:index});
			return false;	
		}
		if(isImage&&rotate){
			EXIF.getData(file, function() {  
				EXIF.getAllTags(this);
				deg = EXIF.getTag(this, 'Orientation');
			});				
		}
		if(!isImage){
			var fd = new FormData();	
			fd.append(data.fileName||'uploadFile',file);	
			if(data.singleStart)
				data.singleStart(fd);
			return;
		}
		var reader = new FileReader(); 
		reader.onload = function(e){
            var image = new Image();  
            image.src = e.target.result;
            image.onload = function(){
				var isRound = rotate&&deg!=null&&(deg==6||deg==8);
				var imageWidth = nw = this.naturalWidth;  
                var imageHeight = nh = this.naturalHeight;
				var cutWidth,cutHeight;
				if(isRound){
					imageWidth = nw = this.naturalHeight;
					imageHeight = nh = this.naturalWidth;
				}
				if(imageWidth<minWidth){	
					error({errorMsg:'图片宽度不能小于'+minWidth,errorType:'minWidth',errorIndex:index});
					return false;
				}
				if(imageHeight<minHeight){ 	
					error({errorMsg:'图片高度不能小于'+minHeight,errorType:'minHeight',errorIndex:index});
					return false;
				}
				if(imageWidth>maxWidth){ 	
					error({errorMsg:'图片宽度不能大于'+maxWidth,errorType:'maxWidth',errorIndex:index});
					return false;
				}
				if(imageHeight>maxHeight){ 	
					error({errorMsg:'图片高度不能大于'+maxHeight,errorType:'maxHeight',errorIndex:index});
					return false;
				}
				
				if(data.cutWidth!=null&&data.cutHeight==null){
					imageWidth = cutWidth = data.cutWidth>imageWidth?imageWidth:data.cutWidth;
					imageHeight = cutHeight = cutWidth*nh/nw;
				}else if(data.cutHeight!=null&&data.cutWidth==null){
					imageHeight = cutHeight = data.cutHeight>imageHeight?imageHeight:data.cutHeight;
					imageWidth = cutWidth = cutHeight*nw/nh;
				}else if(data.cutWidth==null&&data.cutWidth==null){
					cutWidth = imageWidth;
					cutHeight = imageHeight;
				}else{
					data.cutWidth = data.cutWidth>imageWidth?imageWidth:data.cutWidth;
					data.cutHeight = data.cutHeight>imageHeight?imageHeight:data.cutHeight;
					var dirW = imageWidth/data.cutWidth;
					var dirH = imageHeight/data.cutHeight;
					if(dirW<=dirH){
						imageWidth = cutWidth = data.cutWidth;
						imageHeight = imageWidth*nh/nw;
						cutHeight = data.cutHeight;			
					}else{
						imageHeight = cutHeight = data.cutHeight;
						imageWidth = imageHeight*nw/nh;	
						cutWidth = data.cutWidth;
					}
	
				}
				
				var canvas = document.createElement("canvas");
                var context = canvas.getContext("2d");
                canvas.width = cutWidth;  
                canvas.height = cutHeight;
				var cx = 0,cy = 0;
				if(cutWidth<imageWidth){
					cx = (cutWidth-imageWidth)/2;
				}
				if(cutHeight<imageHeight){
					cy = (cutHeight-imageHeight)/2;
				}
				if(rotate){
					if(deg!=null){
						switch(deg){  
							case 6://需要顺时针（向左）90度旋转  
								deg = 90;
								break;  
							case 8://需要逆时针（向右）90度旋转  
								deg = 270;
								break;  
							case 3://需要180度旋转  
								deg = 180;
								break;
							default:
								deg = 0;  
						}
					}else
						deg = 0;
				}else
					deg = 0;
				Html5FileUpload.rotate(deg,canvas);

				if(isRound){
					context.drawImage(this,cy-cutHeight/2, cx-cutWidth/2,imageHeight, imageWidth);	
				}else
					context.drawImage(this, cx-cutWidth/2,cy-cutHeight/2, imageWidth, imageHeight);	
				var base64 = canvas.toDataURL(saveType, saveQuality);
				if(callback)
					callback(base64);
				if(data.singleStart)
					data.singleStart(base64);
			}
		}
		reader.readAsDataURL(file);	
	},
	upload:function(e,data){
		$(e).bind('change',function(){
			Html5FileUpload._upload(this,data);
			if(data.start)
				data.start();				
		});
	},
	_upload:function(fileObj,data){
		data = data||{};
		var error = data.error||function(){};
		var filter = data.filter||'*';
		if(!fileObj||!fileObj.files){
			return error({errorMsg:'您的浏览器太老了，无法上传图片',errorType:'noSupport'});		
		}
		var fileList = [];
		for(var i=0;i<fileObj.files.length;i++){
			fileList.push(fileObj.files[i]);
		}
		fileObj.value = '';
		var base64List = [];
		for(var x=0;x<fileList.length;x++){
			Html5FileUpload.singleUpload(fileList[x],x,data,function(base64){
				base64List.push(base64);	
				if(data.allStart&&base64List.length==fileList.length)
					data.allStart(base64List);	
			});
		}
	},
	rotate:function(deg,canvas){
		var context = canvas.getContext("2d");
		context.translate(canvas.width/2,canvas.height/2);
		context.rotate(deg * Math.PI / 180);
	}
}

Phone.Html5FileUpload = Html5FileUpload;

Phone.Reload = function(){
	var href = window.location.href;
	if(href.indexOf('?')==-1){
		window.location.href = window.location.href+'?WMReloadTime='+new Date().getTime();	
		return;	
	}
	var hash = href.split('?')[1].split('&');
	var b = false;
	for(var x=0;x<hash.length;x++){
		var e = hash[x].split('=');
		if(e[0]=='WMReloadTime'){
			b = true;
			hash[x] = 'WMReloadTime='+new Date().getTime();
			break;	
		}
	}
	if(!b)
		href += '&WMReloadTime='+new Date().getTime();
	else
		href = href.split('?')[0]+'?'+hash.join('&');
	window.location.href = href;
}

Phone.waiting = function(dt){
	dt = dt||{};
	dt.hasCover = dt.hasCover==null?true:dt.hasCover;
	dt.text = dt.text==null?'':dt.text;
	dt.clickClose = dt.clickClose==null?true:dt.clickClose;
	dt.closeTime = dt.closeTime==null?null:dt.closeTime;
	dt.innerCover = dt.innerCover==null?true:dt.innerCover;
	this.init(dt);
}
Phone.waiting.prototype = {
	close:function(){
		clearTimeout(this.closeTimeout);
		$('#'+this.id).remove();	
	},
	init:function(dt){
		this.closeTimeout = null;
		this.id = WM.Phone.getId();
		var html = '<div class="WM_waiting" id="'+this.id+'">';
		if(dt.hasCover)
			html += '<div class="WM_waitingCover"></div>';	
		html += '<div class="WM_waitingTable">';
		html += '<span class="WM_waitingSpan">';
		html += '<div class="WM_waitingDiv">';
		if(dt.innerCover)
			html += '<span class="WM_waitingInnerCover"></span>';
		html += '<p class="WM_waitingText"><i class="waitingImg"></i>'+dt.text+'</p>';
		html += '</div></span></div></div>';
		$(html).appendTo($('body'));
		if(dt.style)
			$('#'+this.id).css(dt.style);
		if(dt.fontStyle)
			$('#'+this.id).find('.WM_waitingText').css(dt.fontStyle)	
		var t = this;
		if(dt.clickClose){
			$('#'+this.id).find('.WM_waitingTable').click(function(){
				t.close();	
			});
		}
		if(dt.closeTime!=null){
			this.closeTimeout = setTimeout(function(){
				t.close();	
			},dt.closeTime)
		}
	}
}	

Phone.centerImage = function(e){
	$(e).css({position:'absolute'});
	var dir = $(e.parentNode).width()/$(e.parentNode).height();
	if($(e).width()/$(e).height()<=dir){
		$(e).css({width:'100%',height:'auto',left:0});
		var mt = ($(e).height()-$(e.parentNode).height())/-2;
		$(e).css({top:mt,visibility:'visible'});		
	}else{
		$(e).css({height:'100%',width:'auto',top:0});
		var ml = ($(e).width()-$(e.parentNode).width())/-2;
		$(e).css({left:ml,visibility:'visible'});	
	}
}

var SlideNav = function(data){
	this.title = data.title||'微喵';
	this.click = $('#'+data.click);
	this.id = 'WM_nav_box_'+WM.Phone.getId();
	this.coverId = 'WM_nav_cover_'+WM.Phone.getId();
	this.gaming = data.gaming;
	this.game = data.game;
	this.other = data.other;
	this.onWallUrl = data.onWallUrl;
	this.coverClose = typeof data.coverClose=='undefined'?true:data.coverClose;
    this.create();
};
SlideNav.prototype = {
	create:function(){
		var html = '';
		html += '<div class="WM_nav" id="'+this.id+'">';
		html += '<div class="WM_nav_pd15">';
		html += '<div class="WM_nav_title">';
		html += '<span class="WM_nav_titleLine"></span>&nbsp;';
		html += ''+this.title+'</div>';
		html += '<div class="WM_nav_onWall">';
		html += '<span></span>';
		html += '<span>微上墙</span>';
		html += '<a href="'+this.onWallUrl+'"></a>';
		html += '</div>';
		html += '<div class="WM_nav_game">';
		html += '<div class="WM_nav_gameTitle">游戏</div>';
		/*
		if(this.gaming!=''){
			html += this.createGaming(this.gaming);
		}
		 */
		if(this.game!=null||this.game!=''||typeof this.game!='undefined'){
			html += this.createGameList(this.game);
		}
		html += '</div>';
		if(this.other!=null||this.other!=''||typeof this.other!='undefined'){
			html += this.createOther(this.other);
		}
		html += '</div></div>';
		$(html).appendTo($('body'));
		this.show();

	},
	createGaming:function(data){
		var html = '<div class="WM_nav_gaming">';
		html += '<span class="WM_gaming_text">';
		html += '<i>'+data.name+'</i>';
		html += '<i>进行中</i>';
		html += '</span>';
		html += '<span>立即加入</span>';
		html += '<a href="'+data.url+'"></a>';
		html += '</div>';
		return html;
	},
	createGameList:function(data){
		var html = '<div class="WM_game_body WM_body_pd20 clearfix" style="padding-top:0;">';
		for(var key in data){
			html += '<a href="'+data[key]['url']+'" class="WM_game_list">';
			html += '<i class="icon_module '+data[key]['icon']+'"></i>';
			html += '<tt class="ellipsis">'+key+'</tt>';
			html += '</a>';
		}
		html += '</div>';
		return html;
	},
	createOther:function(data){
		var html = '<div class="WM_nav_other">';
		html += '<div class="WM_nav_gameTitle">其他功能</div>';
		html += '<div class="WM_game_body clearfix">';
        for(var key in data){
            html += '<a href="'+data[key]['url']+'" class="WM_game_list">';
            html += '<i class="icon_module '+data[key]['icon']+'"></i>';
            html += '<tt class="ellipsis">'+key+'</tt>';
            html += '</a>';
        }
		html += '</div>';
		return html;
	},
	show:function(){
		var t = this;
		var box = $('#'+this.id);
		$(this.click).on('click',function(){
			if($(this).hasClass('disabled'))
				return;
			$(this).addClass('disabled');
            $('<div class="WM_nav_cover" id="'+t.coverId+'"></div>').appendTo($('body'));
			$(box).css({'transform':'translate3d(0px,0px,0px)','-webkit-transform':'translate3d(0px,0px,0px)'});
            t.coverClick();
		});
	},
	close:function(){
        var box = $('#'+this.id);
        var cover = $('#'+this.coverId);
        $(this.click).removeClass('disabled');
        $(cover).remove();
        $(box).css({'transform':'translate3d(-100%,0px,0px)','-webkit-transform':'translate3d(-100%,0px,0px)'})
	},
    coverClick:function(){
		var coverBox = $('#'+this.coverId);
		var t = this;
        $(coverBox).on('click',function(){
        	if(!t.coverClose)
        		return;
			t.close();
        })
	}
};

var slideBox = function(data){
	this.init(data);
}
slideBox.prototype = {
	init:function(data){
		this.setDefault(data);
		this.create(data);	
		this.setFn(data);	
	},
	setDefault:function(e){
		e.title = e.title==null?'':e.title;	
		e.hasFoot = e.hasFoot==null?true:e.hasFoot;
		e.hasCover = e.hasCover==null?true:e.hasCover;
		e.btnText = e.btnText==null?'确定':e.btnText;
		e.html = e.html==null?'':e.html;
		this.locked = false;
		this.coverBox = null;
	},
	create:function(e){
		this.id = WM.Phone.getId();
		var html = '<div class="wm_slideBox" id="'+this.id+'">';
		if(e.hasCover)
			html += '<div class="wm_slideCover"></div>';	
		html += '<div class="wm_slideMain">';
		if(e.title.length>0){
			html += '<div class="wm_slideTitle"><i class="wm_slideTitleLine"></i>';
			html += e.title;
			html += '<a class="wm_slideCloseBox"><i class="wm_slideClose"></i></a></div>';
		}
		html += '<div class="wm_slideBody">'+e.html+'</div>';
		if(e.hasFoot){
			html += '<div class="wm_slideFoot">';
			html += '<a class="btnNormal">'+e.btnText+'</a>';
			html += '</div>';	
		}
		html += '</div>';
		$(html).appendTo($('body'));
		if(e.style)
			$('#'+this.id).find('.wm_slideMain').css(e.style);
		var t = this;
		if(e.ready)
			e.ready.call(this);
		var t = this;
		setTimeout(function(){
			t.find('.wm_slideMain').addClass('show');
			//t.find('.wm_slideMain').addClass('show');
			setTimeout(function(){
				if(e.onload)
					e.onload.call(t);	
			},150);	
		},50);
	},
	find:function(code){
		if(code==null)
			return $('#'+this.id);
		return $('#'+this.id).find(code);
	},
	getButton:function(){
		return this.find('.wm_slideFoot .btnNormal');
	},
	setFn:function(e){
		var t = this;
		this.find('.wm_slideCloseBox').bind('click',function(){
			t.close(e);	
		});	
		this.find('.wm_slideCover').bind('click',function(){
			t.close(e);	
		});
		this.find('.wm_slideFoot .btnNormal').bind('click',function(){
			if(e.click)
				e.click.call(t);	
		});
	},
	close:function(e){
		if(this.locked)
			return;
		var t = this;
		if(e&&e.onClose)
			e.onClose.call(t);
		t.find().remove();
	},
	lock:function(b){
		this.locked = b;	
	},
	cover:function(b){
		var t = this;
		if(b)
			this.coverBox = new WM.Phone.waiting({text:'处理中',hasCover:false,clickClose:false});
		else{
			try{
				t.coverBox.close();	
			}catch(ex){}	
		}
	}
}
	
// var warnedAbout = {};  
// jQuery.migrateWarnings = [];  
// if ( !jQuery.migrateMute && window.console && window.console.log ) {  
//     //window.console.log("JQMIGRATE: Logging is active");  
// }  
// if ( jQuery.migrateTrace === undefined ) {  
//     jQuery.migrateTrace = true;  
// }  
// jQuery.migrateReset = function() {  
//     warnedAbout = {};  
//     jQuery.migrateWarnings.length = 0;  
// };  
// function migrateWarn( msg) {  
//     var console = window.console;  
//     if ( !warnedAbout[ msg ] ) {  
//         warnedAbout[ msg ] = true;  
//         jQuery.migrateWarnings.push( msg );  
//         if ( console && console.warn && !jQuery.migrateMute ) {  
//             //console.warn( "JQMIGRATE: " + msg );  
//             if ( jQuery.migrateTrace && console.trace ) {  
//                 //console.trace();  
//             }  
//         }  
//     }  
// }  
// function migrateWarnProp( obj, prop, value, msg ) {  
//     if ( Object.defineProperty ) {  
//         try {  
//             Object.defineProperty( obj, prop, {  
//                 configurable: true,  
//                 enumerable: true,  
//                 get: function() {  
//                     //migrateWarn( msg );  
//                     return value;  
//                 },  
//                 set: function( newValue ) {  
//                     migrateWarn( msg );  
//                     value = newValue;  
//                 }  
//             });  
//             return;  
//         } catch( err ) {  
//             // IE8 is a dope about Object.defineProperty, can't warn there  
//         }  
//     }  
//     jQuery._definePropertyBroken = true;  
//     obj[ prop ] = value;  
// }  
  
// if ( document.compatMode === "BackCompat" ) {  
//     migrateWarn( "jQuery is not compatible with Quirks Mode" );  
// }  
  
// var oldFnData = jQuery.fn.data;  
// jQuery.fn.data = function( name ) {  
//     var ret, evt,  
//         elem = this[0];  
//     // Handles 1.7 which has this behavior and 1.8 which doesn't  
//     if ( elem && name === "events" && arguments.length === 1 ) {  
//         ret = jQuery.data( elem, name );  
//         evt = jQuery._data( elem, name );  
//         if ( ( ret === undefined || ret === evt ) && evt !== undefined ) {  
//             migrateWarn("Use of jQuery.fn.data('events') is deprecated");  
//             return evt;  
//         }  
//     }  
//     return oldFnData.apply( this, arguments );  
// }; 

})();

if(!window.App){
	App = {}
}
App.showInfo = window.showInfo;
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
	App.Utils.fmDateShort = function(timestamp){
		var dt = new Date(+timestamp);
		function pd(n){
			return n < 10 ? '0' + n : n;
		}
		return [pd(dt.getMonth() + 1), pd(dt.getDate()) ].join('-') + ' ' + 
			[pd(dt.getHours()), pd(dt.getMinutes()), pd(dt.getSeconds()) ].join(':')
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
}