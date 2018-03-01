
//背景控制
var bgControl = {
	playList:null,
	playData:null,
	type:null,
	init:function(playList,playData){
		this.playList = playList;
		this.playData = playData;
		$('<img class="onWallBg" src="'+allImage.bg+'" />').appendTo($('#bgControl'));
		this.ready = true;
		if(this.type!=null)
			this.use(this.type);
	},
	use:function(x){
		this.type = x;
		if(!this.ready)
			return;
		if(x==0){
			//视频	
			$('#bgControl img').hide();	
			if(this.playList==null||this.playList.length==0)
				App.public.showInfo('请在秉烛科技后台选择背景视频');
			$('<div id="BgVideoBox"><div class="BgVideoBoxCover"></div></div>').appendTo($('#bgControl'));
			if(SystemControl.data.videoCover!=null){
				this.setVideoLight(SystemControl.data.videoCover);
			}
			videoControl.loop.play(this.playList,this.playData,'BgVideoBox');	
		}else if(x==1){
			//图片
			$('#bgControl img').show();
			videoControl.loop.close();
			$('#BgVideoBox').remove();	
		}else{
			$('#bgControl img').hide();
			videoControl.loop.close();
			$('#BgVideoBox').remove();
		}	
	},
	setVideoLight:function(x){
		var _x = (10-x)/10;
		$('.BgVideoBoxCover').css({opacity:_x});	
	}
}

window.bgControl = bgControl;
export default bgControl;