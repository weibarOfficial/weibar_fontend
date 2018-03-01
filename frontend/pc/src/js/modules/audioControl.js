//音频js
var audioControl = {
	preload:function(data){
		data.onComplete = data.onComplete||function(){}
		var audioList = data.src||[];
		var hasAudio = !!(document.createElement('audio').canPlayType);
		if(!hasAudio){
			return data.onComplete();
		}
		if(audioList.length==0)
			return data.onComplete();
		var x = 0;
		var html = '<audio id="audioPreload" style="display:none; width:0; height:0"></audio>';	
		$(html).appendTo($('body'));
		(function(){
			$('#audioPreload').unbind('canplaythrough').bind('canplaythrough',function(){
				x++;	
				if(x>=audioList.length){
					$('#audioPreload').remove();
					return data.onComplete();
				}
				$('#audioPreload').attr({src:audioList[x]});
			});
			$('#audioPreload').unbind('stalled error').bind('stalled',function(){
				x++;	
				if(x>=audioList.length){
					$('#audioPreload').remove();
					return data.onComplete();
				}
				$('#audioPreload').attr({src:audioList[x]});	
			});
			$('#audioPreload').attr({src:audioList[x]});
		})();
	},
	play:function(src){
		if(src!=null&&src.length>0){
			$('#dsAudio').remove();
			var html = '<audio id="dsAudio" style="display:none; width:0; height:0" autoplay="autoplay" src="'+src+'" loop></audio>';
			$(html).appendTo($('body'));
		}
	},
	close:function(){
		$('#dsAudio').remove();	
	}
}
window.audioControl = audioControl;
export default audioControl;