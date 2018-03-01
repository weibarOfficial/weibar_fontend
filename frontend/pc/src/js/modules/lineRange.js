
/*控制条*/
var LineRange = function(data){
	if(data.box.length==0)
		return;
	this.id = App.public.getId();
	var html = '<span class="wemewLine" id="'+this.id+'">';
	html += '<span class="wemewLine-line"><span class="wemewLine-hideLine"><tt class="wemewLine-pie"></tt><tt class="wemewLine-color"></tt></span></span>';
	html += '';
	html += '<i class="wemewLine-info"></i>';
	html += '</span>';
	$(html).appendTo(data.box);
	this.range = data.range;
	this.change = data.change||function(){};
	this.unit = data.unit||'';
	this.len = data.range[1]-data.range[0];
	this.isInt = data.isInt==null?false:data.isInt;
	this.init();
	if(data.useRange!=null)
		this.setByRange(data.useRange);
}
LineRange.prototype = {
	init:function(){
		var obj = $('#'+this.id);
		var able = false;
		var width = obj.find('.wemewLine-pie')[0].offsetWidth;
		var half = (width/2)-1;
		var t = this;
		obj.bind('mousedown',function(e){
			able = true;
			$(document).bind('mouseup.wemewLine',function(ev){
				able = false;
				$(document).unbind('mouseup.wemewLine');
			});
			var newX = e.clientX-$(this).offset().left-half;
			newX = newX<0?0:newX;
			newX = newX>(this.offsetWidth-width)?this.offsetWidth-width:newX;
			$(this).find('.wemewLine-pie').css({left:newX});
			t.setByLen(newX);
			return false;		
		}).bind('mousemove',function(e){
			if(able){
				var newX = e.clientX-$(this).offset().left-half;
				newX = newX<0?0:newX;
				newX = newX>(this.offsetWidth-width)?this.offsetWidth-width:newX;
				$(this).find('.wemewLine-pie').css({left:newX});
				t.setByLen(newX);
			}
		});	
	},
	getInfo:function(){
		
	},
	setInfo:function(val){
		if(this.isInt)
			val = parseInt(val);
		var obj = $('#'+this.id);
		obj.find('.wemewLine-info').html(val+this.unit);
	},
	setByLen:function(val){
		var width = $('#'+this.id).find('.wemewLine-hideLine')[0].offsetWidth;
		var pencent = val/width;
		$('#'+this.id).find('.wemewLine-color').css({width:(pencent*100)+'%'});
		val = (this.len*pencent)+this.range[0];
		val = parseFloat(val);
		if(this.isInt)
			val = parseInt(val);
		val = val<this.range[0]?this.range[0]:val;
		val = val>this.range[1]?this.range[1]:val;
		this.change(val);
		this.setInfo(val.toFixed(1));
	},
	setByRange:function(val){
		if(val==null||val.length==0)
			return;
		if(this.range==null||this.range.length==0)
			return;
		val = val<this.range[0]?this.range[0]:val;
		val = val>this.range[1]?this.range[1]:val;
		if(this.isInt)
			val = parseInt(val);
		this.change(val);
		var pencent = (val-this.range[0])/this.len;
		pencent = pencent<0?0:pencent;
		pencent = (pencent*100)+'%';
		$('#'+this.id).find('.wemewLine-color').css({width:pencent});
		$('#'+this.id).find('.wemewLine-pie').css({left:pencent});
		this.setInfo(val);
	},
	setMax:function(){
		this.setByRange(this.range[1]);
	},
	setMin:function(){
		this.setByRange(this.range[0]);	
	}
}

export default LineRange