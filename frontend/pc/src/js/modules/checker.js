
/*选择框*/
var Checker = function(data){
	this.id = App.public.getId();
	var html = '<div class="wemewCheckBox" id="'+this.id+'">';
	for(var x=0;x<data.options.length;x++){
		html += '<span class="wemewCheck">';
		html += '<tt class="wemewCheck-right">&radic;</tt>';
		html += '<span class="wemewCheckInfo">'+data.options[x]+'</span>';	
		html += '</span>';	
	}
	html += '</div>';
	$(html).appendTo(data.box);
	this.multiple = data.multiple==null?false:data.multiple;
	this.notNull = data.notNull==null?false:data.notNull;
	this.check = typeof data.check=='number'?[data.check]:(data.check==null?[]:data.check);
	this.able = true;
	this.change = data.change||function(){};
	this.init();
	this.setCheck();
}
Checker.prototype = {
	setAble:function(bool){
		this.able = bool;	
	},
	getCheck:function(){
		return $('#'+this.id).find('.check').index();
	},
	getValue:function(){
		return $('#'+this.id).find('.check .wemewCheckInfo').text();
	},
	getCheckArray:function(){
		var arr = [];
		var list = $('#'+this.id).find('.check');
		for(var x=0;x<list.length;x++){
			arr.push($(list[x]).index());	
		}
		return arr;	
	},
	getAll:function(){
		var arr = [];
		var list = $('#'+this.id).find('.wemewCheck');
		for(var x=0;x<list.length;x++)
			arr.push($(list[x]).hasClass('check'));
		return arr;	
	},
	fire:function(x){
		$('#'+this.id).find('.wemewCheck')[x].click();	
	},
	setCheck:function(){
		if(this.check.length>0){
			for(var x=0;x<this.check.length;x++){
				$('#'+this.id).find('.wemewCheck')[this.check[x]].click();	
			}
		}
		//$('#'+this.id).find('.wemewCheck')
	},
	init:function(){
		var t = this;
		$('#'+this.id).find('.wemewCheck').bind('click',function(){
			if(!t.able)
				return;
			if(t.multiple){
				if(!$(this).hasClass('check')){
					$(this).addClass('check');
					t.change();
				}else{
					if($('#'+t.id).find('.check').length==1&&t.notNull)
						return;
					$(this).removeClass('check');
					t.change();	
				}	
			}else{
				if(!$(this).hasClass('check')){
					$('#'+t.id).find('.check').removeClass('check');
					$(this).addClass('check');
					t.change();
				}else{
					if(t.notNull)
						return;
					$(this).removeClass('check');
					t.change();
				}
			}
		});
	}
}
export default Checker;