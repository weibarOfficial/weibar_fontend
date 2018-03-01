//需要在使用此js之前引入jquery
$.fn.dragmove=function(data){return this.each(function(){var $document=$(document),$this=$(this),active,startX,startY;$this.on("mousedown touchstart",function(e){active=true;startX=(e.originalEvent.pageX)-$this.offset().left;startY=(e.originalEvent.pageY)-$this.offset().top;if("mousedown"==e.type){click=$this}if("touchstart"==e.type){touch=$this}if(window.mozInnerScreenX==null){return false}});var box=data.box||$("body");$document.on("mousemove touchmove",function(e){if(data.beforeMove){if(!data.beforeMove()){active=false}}if(!active){return}var less={x1:box.offset().left,x2:box.offset().left+box.width()-$this.width(),y1:box.offset().top,y2:box.offset().top+box.height()-$this.height()};var x=(e.originalEvent.pageX)-startX;var y=(e.originalEvent.pageY)-startY;if(data.limit){x=x<less.x1?less.x1:x;x=x>less.x2?less.x2:x;y=y<less.y1?less.y1:y;y=y>less.y2?less.y2:y};if(data.onMove){data.onMove(x,y)};if("mousemove"==e.type&&active){click.offset({left:x,top:y})}if("touchmove"==e.type&&active){click.offset({left:x,top:y})}}).on("mouseup touchend",function(){active=false})})};(function(factory){if(typeof define==="function"&&define.amd){define(["jquery"],factory)}else{if(typeof exports==="object"){module.exports=factory}else{factory(jQuery)}}}(function($){var toFix=["wheel","mousewheel","DOMMouseScroll","MozMousePixelScroll"],toBind=("onwheel" in document||document.documentMode>=9)?["wheel"]:["mousewheel","DomMouseScroll","MozMousePixelScroll"],slice=Array.prototype.slice,nullLowestDeltaTimeout,lowestDelta;if($.event.fixHooks){for(var i=toFix.length;i;){$.event.fixHooks[toFix[--i]]=$.event.mouseHooks}}var special=$.event.special.mousewheel={version:"3.1.11",setup:function(){if(this.addEventListener){for(var i=toBind.length;i;){this.addEventListener(toBind[--i],handler,false)}}else{this.onmousewheel=handler}$.data(this,"mousewheel-line-height",special.getLineHeight(this));$.data(this,"mousewheel-page-height",special.getPageHeight(this))},teardown:function(){if(this.removeEventListener){for(var i=toBind.length;i;){this.removeEventListener(toBind[--i],handler,false)}}else{this.onmousewheel=null}$.removeData(this,"mousewheel-line-height");$.removeData(this,"mousewheel-page-height")},getLineHeight:function(elem){var $parent=$(elem)["offsetParent" in $.fn?"offsetParent":"parent"]();if(!$parent.length){$parent=$("body")}return parseInt($parent.css("fontSize"),10)},getPageHeight:function(elem){return $(elem).height()},settings:{adjustOldDeltas:true,normalizeOffset:true}};$.fn.extend({mousewheel:function(fn){return fn?this.bind("mousewheel",fn):this.trigger("mousewheel")},unmousewheel:function(fn){return this.unbind("mousewheel",fn)}});function handler(event){var orgEvent=event||window.event,args=slice.call(arguments,1),delta=0,deltaX=0,deltaY=0,absDelta=0,offsetX=0,offsetY=0;event=$.event.fix(orgEvent);event.type="mousewheel";if("detail" in orgEvent){deltaY=orgEvent.detail*-1}if("wheelDelta" in orgEvent){deltaY=orgEvent.wheelDelta}if("wheelDeltaY" in orgEvent){deltaY=orgEvent.wheelDeltaY}if("wheelDeltaX" in orgEvent){deltaX=orgEvent.wheelDeltaX*-1}if("axis" in orgEvent&&orgEvent.axis===orgEvent.HORIZONTAL_AXIS){deltaX=deltaY*-1;deltaY=0}delta=deltaY===0?deltaX:deltaY;if("deltaY" in orgEvent){deltaY=orgEvent.deltaY*-1;delta=deltaY}if("deltaX" in orgEvent){deltaX=orgEvent.deltaX;if(deltaY===0){delta=deltaX*-1}}if(deltaY===0&&deltaX===0){return}if(orgEvent.deltaMode===1){var lineHeight=$.data(this,"mousewheel-line-height");delta*=lineHeight;deltaY*=lineHeight;deltaX*=lineHeight}else{if(orgEvent.deltaMode===2){var pageHeight=$.data(this,"mousewheel-page-height");delta*=pageHeight;deltaY*=pageHeight;deltaX*=pageHeight}}absDelta=Math.max(Math.abs(deltaY),Math.abs(deltaX));if(!lowestDelta||absDelta<lowestDelta){lowestDelta=absDelta;if(shouldAdjustOldDeltas(orgEvent,absDelta)){lowestDelta/=40}}if(shouldAdjustOldDeltas(orgEvent,absDelta)){delta/=40;deltaX/=40;deltaY/=40}delta=Math[delta>=1?"floor":"ceil"](delta/lowestDelta);deltaX=Math[deltaX>=1?"floor":"ceil"](deltaX/lowestDelta);deltaY=Math[deltaY>=1?"floor":"ceil"](deltaY/lowestDelta);if(special.settings.normalizeOffset&&this.getBoundingClientRect){var boundingRect=this.getBoundingClientRect();offsetX=event.clientX-boundingRect.left;offsetY=event.clientY-boundingRect.top}event.deltaX=deltaX;event.deltaY=deltaY;event.deltaFactor=lowestDelta;event.offsetX=offsetX;event.offsetY=offsetY;event.deltaMode=0;args.unshift(event,delta,deltaX,deltaY);if(nullLowestDeltaTimeout){clearTimeout(nullLowestDeltaTimeout)}nullLowestDeltaTimeout=setTimeout(nullLowestDelta,200);return($.event.dispatch||$.event.handle).apply(this,args)}function nullLowestDelta(){lowestDelta=null}function shouldAdjustOldDeltas(orgEvent,absDelta){return special.settings.adjustOldDeltas&&orgEvent.type==="mousewheel"&&absDelta%120===0}}));

var tools = {
    text:'大屏幕公共组件以后都写在这里'
}
tools.QR = function(data){
    data = data||{};
    this.id = new Date().getTime();
    this.type = 1;
    this.scale = 1;
    var t = this;
    if(data.src==null||data.src.length==0||data.src.indexOf('.')==-1)
        return alert('请设置正确的二维码路径');
    var img = new Image();
    img.onload = img.onerror = function(){
        t.init(data);
    }
    img.src = data.src;
}
tools.QR.prototype = {
    init: function (data) {
		data.resize = data.resize==null?true:data.resize;
        data.box = data.box || $('body');
        this.box = data.box;
        this.create(data);
        var t = this;
        if (data.style) {
            $('#' + this.id).css(data.style);
        } else {
            $('#' + this.id).css(this.style);
        }
		if(data.resize){
			$(window).bind('resize', function () {
				t.resize(data);
			});
		}
        if (data.position){
            this.position = data.position;
            var left = data.position.left;
            var top = data.position.top;
        }else{
            var left = $(this.box).width() - this.position.right - $('#' + this.id).width();
            var top = $(this.box).height() - this.position.bottom - $('#' + this.id).height();
        }
        $('#' + this.id).css({left: left, top: top});
        $('#' + this.id).dragmove({
            box: data.box,
			onMove:function(x,y){
				if(data.onMove)
					data.onMove(x,y);		
			}
        });
        $('#' + this.id).mousewheel(function (event, delta) {
            if (t.type == 0)
                return;
            if (delta >= 1)
                t.scale += 0.1;
            else
                t.scale -= 0.1;
            t.scale = t.scale > 3 ? 3 : t.scale;
            t.scale = t.scale < 0.5 ? 0.5 : t.scale;
            $('#' + t.id).css({'transform': 'scale(' + t.scale + ')'});
			if(data.onMousewheel)
				data.onMousewheel.call(t);
        });
		if(data.scale){
			this.scale = parseFloat(data.scale);
			$('#' + this.id).css({'transform': 'scale(' + this.scale + ')'});
		}
		if(data.init)
			data.init();
    },
    resize: function (data) {
        if (data.position&&$('.WM_QR_mini').css("display") == 'none'){
            $('#' + this.id).css({left: data.position.left, top: data.position.top});
        } else if ($('.WM_QR_mini').css("display") !== 'none'||!data.position){
            this.position = {
                right: 50, bottom: 50
            };
            var left = $(this.box).width() - this.position.right - $('#' + this.id).width();
            var top = $(this.box).height() - this.position.bottom - $('#' + this.id).height();
            $('#' + this.id).css({left: left, top: top});
        }


    },
    position: {
        right: 50, bottom: 50
    },
    style: {
        position: 'absolute',
        "background-repeat": "no-repeat",
        top: "0px",
        left: '10px'
    },
    width: '260px',

    create: function (data) {
        var wd = data.width ? data.width : this.width;
        var html = '<div class="WM_QR" id="' + this.id + '">';
        html += '<div class="WM_QR_mini" style="display: none;" title="点击放大"><span></span></div>';
        html += '<div class="_WM_QR" >';
        html += '<a class="WM_QR_hide" title="隐藏" ><span></span></a>';
        html += '<div class="WM_QR_main" title="按住左键可拖动，滚轮可以放大缩小">';
        html += '<div class="WM_QR_box" style="width:280px;height:280px"><img src="' + data.src + '" width="100%"/></div>';
        html += '<div class="WM_QR_foot" style="font-size: 18px;" >' + (data.text || '扫码上墙') + '</div>';
        html += '</div>';
        html += '</div></div>';
        $(html).appendTo(data.box);
        var t = this;
        $('#' + this.id).find('.WM_QR_hide').click(function () {
            t.hide();
        });
        $('#' + this.id).find('.WM_QR_mini').click(function () {
            t.show();
        });
    },
    hide: function () {
        if(!$('#' + this.id).position()){
            return
        }
        var oldLeft = $('#' + this.id).position().left;
        var oldTop = $('#' + this.id).position().top;
        this.position = {
            right: 35, bottom: 15
        }
        this.type = 0;
		$('#' + this.id).addClass('onHide');
        $('#' + this.id).find('._WM_QR').hide();
        $('#' + this.id).find('.WM_QR_mini').show();
        var left = $(this.box).width() - this.position.right - $('#' + this.id).width();
        var top = $(this.box).height() - this.position.bottom - $('#' + this.id).height();
        $('#' + this.id).offset({left: left, top: top}, 'fast');
        $('#' + this.id).css({'transform': 'scale(1)'});
        this.position = {
            right: oldLeft, bottom: oldTop
        }
    },
    show: function () {
        this.type = 1;
		$('#' + this.id).removeClass('onHide');
        $('#' + this.id).find('._WM_QR').show();
        $('#' + this.id).find('.WM_QR_mini').hide();
        var left = this.position.right;
        var top = this.position.bottom;
        $('#'+this.id).offset({left:left,top:top});
        $('#' + this.id).css({'transform': 'scale('+this.scale+')'});
    },
	moveTo:function(x,y){
		$('#'+this.id).offset({left:x,top:y});	
	}
}

tools.loadImage = function(src,fn){
	var img = new Image();
	img.onload = img.onerror = function(){
		if(fn)
			fn();
	}
	img.src = src;
};