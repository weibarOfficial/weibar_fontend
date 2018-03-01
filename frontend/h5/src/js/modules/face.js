var FaceModule = {
    faceUrl: './images/faces/',
	newFace:{
		'ic_emoji_666':'[666]','ic_emoji_bishi':'[鄙视你]',
		'ic_emoji_bukaixin':'[不开心]','ic_emoji_dai':'[呆]',
		'ic_emoji_haixiu':'[害羞]','ic_emoji_huaji':'[滑稽]',
		'ic_emoji_keai':'[可爱]','ic_emoji_kelian':'[可怜]',
		'ic_emoji_ku':'[哭]','ic_emoji_liulei':'[流泪]',
		'ic_emoji_memeda':'[么么哒]','ic_emoji_mengbi':'[懵逼]',
		'ic_emoji_nu':'[怒]','ic_emoji_se':'[色]',
		'ic_emoji_shuai':'[衰]','ic_emoji_tanqi':'[叹气]',
		'ic_emoji_tiaopi':'[调皮]','ic_emoji_wabizi':'[挖鼻子]',
		'ic_emoji_weiqu':'[很委屈]','ic_emoji_weixiao':'[微笑]',
		'ic_emoji_wulian':'[捂脸]','ic_emoji_wuzui':'[捂嘴]',
		'ic_emoji_xiao':'[笑]','ic_emoji_xiaoku':'[笑哭]',
		'ic_emoji_yun':'[晕]','ic_emoji_zaijian':'[再见了]',
		'ic_emoji_zhuakuang':'[抓狂]'
	},
	init:function($trigger,$input){
        this.$input = $input;
        this.$trigger = $trigger;
        this.initDom();
        this.initEvent();
	},
    initDom: function(){

		var html = '';
		var x = 0,y = 0,b = false;
		for(var i in this.newFace){
			if(x%7==0)
				html += '<div>',b = true;
			html += '<a index="'+i+'" class="j_addFace"><img src="'+this.faceUrl+i+'.png" /></a>';
			if((x+1)%7==0)
				html += '</div>',b = false;	
			x++;
		}
		if(b){
			while(x%7!=0){
				html += '<a></a>';
				x++;	
			}
			html += '</div>';
		}
		$('#allFace').html(html+'<div style="clear:both"></div>');
    },
    initEvent: function(){
        var self = this;
        this.$trigger.on('click', function(){
            self.show();
        });
        this.$cnt = $('#allFace').on('click','.j_addFace', function(){
            self.setFace($(this));
        });
    },
	show:function(){
		if($('#allFace').hasClass('hide')){
			$('#allFace').removeClass('hide');
			$(window).bind('mousedown.face',function(e){
				var target = e.target;
				if(target.id=='txt'||target.id=='allFace')
					return;
				if($('#allFace').find(target).length>0)
					return;
				$(window).unbind('mousedown.face');
				setTimeout(function(){
					$('#allFace').addClass('hide');	
				},250);	
			});
		}else{
			this.closeFace();
		}
	},
	closeFace:function(){
		$(window).unbind('mousedown.face');
		$('#allFace').addClass('hide');			
	},
	insertHtml:function(str){
		this.isShow(false);
		var obj = this.$input[0];
		if(document.selection){
			var sel = document.selection.createRange();
			sel.text = str;
			this.$input.blur();
		}else if (typeof obj.selectionStart == 'number' && typeof obj.selectionEnd == 'number'){
			var startPos = obj.selectionStart,
				endPos = obj.selectionEnd,
				cursorPos = startPos,
				tmpStr = obj.value;
			obj.value = tmpStr.substring(0, startPos) + str + tmpStr.substring(endPos, tmpStr.length);
			cursorPos += str.length;
			obj.selectionStart = obj.selectionEnd = cursorPos;
			this.$input.blur();
		}else {
			obj.value += str;
			this.$input.blur();
		}
        this.isShow(true);
	},
	isShow:function(bool){
		if(bool)
            $('.wallHead,.fixedIcon').css('display','block');
		else
            $('.wallHead,.fixedIcon').css('display','none');
	},
	setFace:function(e){
		var val = this.newFace[$(e).attr('index')];
		this.insertHtml(val);
	},
	
	replaceText:function(val){
		if(val){
			var arr = this.newFace;
			for(var i in arr){
				while(val.indexOf(arr[i])!=-1){
					val = val.replace(arr[i],'<img class="emoji_face" src="'+this.faceUrl+''+i+'.png" />');
			
				}
			}	
			return val;
		}else{
			return "";
		}		
	}
}
export default App.FaceModule = FaceModule;