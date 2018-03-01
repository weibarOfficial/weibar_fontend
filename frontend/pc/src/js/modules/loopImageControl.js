
//轮播图控制
var loopImageControl = {
	running:false,
	loaded:0,
	timeout:null,
	lastIndex:null,
	imgList:[],
    delay: 4000,
	init:function(){
		this.create();		
	},
	create:function(){
		$('<div id="rightBox" class="show"><div id="beforeImageLoad"><span>图片加载中</span></div><div id="imageBox"></div></div>').appendTo($('#onWallMain'));
		// this.imgList = [];//allData.loopImageList;
		this.imgList = (this.imgList==null||this.imgList.length==0)?[]:this.imgList;
		$(this.createImage()).appendTo($('#imageBox'));	
		basicControl.checkCode();	
	},
	setList:function(list,num){
		num = num==null?20:num;
		var arr = [];
		for(var x=0;x<list.length;x++){
			var e = list[x];
			if(e.split(',').length>1){
				var splitSrc = e.split(',');
				for(var j=0;j<splitSrc.length;j++){
					arr.push(splitSrc[j]);		
				}
			}else
				arr.push(e);
		}
		arr = arr.slice(0,20);
		return arr;
	},
	createImage:function(){
		// this.imgList = allData.loopImageList;
		// this.imgList = (this.imgList==null||this.imgList.length==0)?[]:this.imgList;
		var list = this.imgList;
		if(list.length==0){
			return '<div class="defaultImage loopDiv"><img onload="loopImageControl.load(this)" src="'+allImage.loopErrorSrc+'" /></div>';		
		}
		var html = '';
		list = this.setList(list);
		for(var x=0;x<list.length;x++){
			html += '<div class="loopDiv" data-index="'+x+'" type="0"><img onload="loopImageControl.load(this)" onerror="loopImageControl.error(this)" src="'+list[x]+'" /></div>';	
		}
		return html;
	},
	load:function(e){
		App.public.centerImage(e);
		this.loaded++;
		if(this.loaded>=this.imgList.length){
			this.loadOver();	
		}
	},
	error:function(e){
		$(e).attr({src:allImage.loopErrorSrc});	
	},
	getOne:function(){
		var arr = $('#imageBox').find('.loopDiv[type="0"]');
		var index = App.public.getRandom(0,arr.length-1);
		var obj = arr[index];
		return obj;
	},
	loadOver:function(){
		$('#imageBox').addClass('show');
		$('#beforeImageLoad').remove();	
		this.loop();
		this.resize();
	},
	loop:function(){
		if($('#imageBox').find('.loopDiv').length<=1)
			return $('#imageBox').find('.loopDiv').addClass('show');
		if(this.running)
			return;
		this.running = true;
		var t = this;
		var type = 0;
		this.timeout = setTimeout(function loopFn(){
			//$('#imageBox').find('.animateBig').removeClass('animateBig');
			//$('#imageBox').find('.animateSmall').removeClass('animateSmall');
			$('#imageBox').find('.showBig').removeClass('showBig');
			var one = t.getOne();
			if(type==1)
				$(one).addClass('showBig');
			$('#imageBox').find('.animateImage').removeClass('animateImage animateBig animateSmall').attr({type:0});
			$(one).addClass('animateImage').attr({type:1});
			$(one).addClass(type==0?'animateBig':'animateSmall');
			type = type==0?1:0;
			if($('#imageBox').find('.loopDiv').length>=2)
				t.timeout = setTimeout(loopFn,loopImageControl.delay);
			else{
				t.running = false;	
			}
		},0);			
	},
	resetAll:function(){
		var arr = $('#imageBox').find('.loopDiv img');
		for(var x=0;x<arr.length;x++){
			App.public.centerImage(arr[x]);
		}		
	},
	resize:function(){
		var t = this;
		$(window).unbind('resize.loopImage').bind('resize.loopImage',function(){
			t.resetAll();				
		});		
	},
	add:function(src){
		if($('#imageBox').find('.loopDiv').length>20)
			this.replace(src);
		else{
			var index = this.getMaxIndex()+1;
			var html = '<div class="loopDiv" data-index="'+index+'" type="0"><img onload="loopImageControl.load(this)" onerror="loopImageControl.error(this)" src="'+src+'" /></div>';	
			$(html).appendTo($('#imageBox'));
			if($('#imageBox').find('.loopDiv').length>0)
				$('#imageBox').find('.defaultImage').remove();	
		}	
	},
	replace:function(src){
		var obj = this.getLast();
		if(obj==null)
			return;
		var index = this.getMaxIndex()+1;
		$(obj).html('<img onload="loopImageControl.load(this)" onerror="loopImageControl.error(this)" src="'+src+'" />').attr({'data-index':index});			
	},
	getLast:function(){
		var arr = $('#imageBox').find('.loopDiv');
		if(arr.length==0)
			return null;
		var last = parseInt($(arr[0]).attr('data-index'));
		var lastObj = arr[0];
		for(var i = 1; i < arr.length; i++) {
			if (last > parseInt($(arr[i]).attr('data-index'))) {
				last = parseInt($(arr[i]).attr('data-index'));
				lastObj = arr[i];
			}
		}
		return lastObj;
	},	
	getMaxIndex:function(){
		var arr = $('#imageBox').find('.loopDiv');
		if(arr.length==0)
			return 0;
		var last = parseInt($(arr[0]).attr('data-index'));
		for(var i = 1; i < arr.length; i++) {
			if (last < parseInt($(arr[i]).attr('data-index'))) {
				last = parseInt($(arr[i]).attr('data-index'));
			}
		}
		return last;		
	},
	hide:function(){
		$('#rightBox').hide();
		$(window).unbind('resize.loopImage');	
	},
	show:function(){
		$('#rightBox').show();
		this.resize();
	},
	close:function(){
		this.loaded = 0;
		this.running = false;
		this.lastIndex = null;
		clearTimeout(this.timeout);
		$(window).unbind('resize.loopImage');
		$('#rightBox').remove();
	},
	open:function(){
		this.create();	
	},
	reset:function(imageList){
		if(imageList==null)
			return;
		allData.loopImageList = imageList;
		this.running = false;
		clearTimeout(this.timeout);
		$(window).unbind('resize.loopImage');
		this.loaded = 0;
		$('#imageBox').html(this.createImage());
	}
};
window.loopImageControl = loopImageControl;
export default loopImageControl;