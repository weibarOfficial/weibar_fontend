/*开关*/
var Switcher = function(data){
	this.id = App.public.getId();
	var html = '<label for="'+this.id+'" class="wemewSwitchLabel">';
	html += '<input id="'+this.id+'" class="wemewSwitchInput" type="checkbox">';
	html += '<div class="wemewSwitchDiv"></div>';
	html += '</label>';
	$(html).appendTo(data.box);
	this.click = data.click||function(){};
	this.able = true;
	this.init();
	if(data.able!=null)
		this.setAble(data.able);
	if(data.check!=null)
		this.setCheck(data.check);
}
Switcher.prototype = {
	setAble:function(bool){
		this.able = bool;	
	},
	setCheck:function(bool){
		bool = bool=='true'?true:bool;
		bool = bool=='false'?false:bool;
		$('#'+this.id)[0].checked = bool;
		this.click(bool);	
	},
	init:function(){
		var t = this;
		$('#'+this.id).bind('change',function(){
			if(!t.able)
				return false;
			t.click(this.checked);
		});	
	}
};
export default Switcher;