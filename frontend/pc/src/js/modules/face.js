
//表情
var face = {
	faceUrl:'//www.yylive.com/static/images/faces/',
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
	init:function(list){
		var arr = this.arr;
		for(var i=0;i<list.length;i++){
			var val = list[i].innerHTML;
			for(var j=0;j<arr.length;j++){
				while(val.indexOf(arr[j])!=-1){
					val = val.replace(arr[j],'<img style="width:30px;height:30px;" src="'+this.faceUrl+(j+1)+'.png" />');	
				}	
			}
			list[i].innerHTML = val;
		}
	},
	replaceText:function(val){
		if(val){
			var arr = this.newFace;
			for(var i in arr){
				while(val.indexOf(arr[i])!=-1){
					val = val.replace(arr[i],'<img style="width:30px;height:30px; margin:0 3px; display:inline-block; position:relative; top:4px" src="'+this.faceUrl+''+i+'.png" />');
			
				}
			}	
			return val;
		}else{
			return "";
		}		
	}
};

export default face;
