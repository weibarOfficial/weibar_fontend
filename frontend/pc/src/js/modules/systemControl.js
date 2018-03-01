import LineRange from './lineRange';
import Switcher from './switcher';
import Checker from './checker';

import bpControl from './bpControlCore';
import canvasRichBg from './bpControl.bpBg';
// import bgControl from './bgControl';
import basicControl from './basicControl';
import msgControl from './msgControl'


//显示设置控制器
var systemControl = {
	data:{
		'title':null,
		'fontSize':null,
		'_fontSize':null,
		'light':null,
		'msglight':null,
		'sethwBp':null,
		'codeOpen':null,
		'msgOpen':null,
		'msgDelay':null,
		'_msgDelay':null,
		'bg':null,
		'videoCover':null,
		'bpType':null,
		'bpCount':null,
		'msgNum':null,
		'bpAudio':null,
		'bgCanvas':null,
		'marqueeOpen':null,
		'marqueeSize':null,
		'marqueeSpeed':null,
		'marqueeDelay':null,
		'setEntry':null,
		'code':null,
		'wxLeft':null,
		'wxTop':null,
		'bpFontSize':null,
		'bpFontStyle':null,
		'bpHeight':null,
		'codeScale':null
	},
	_init:function(){
		var e = this.data;
		$('html').css({'font-size':e._fontSize+'px'});
		basicControl.setLight((10-e.light)/10);
        basicControl.msgLight((10-e.msglight)/10);
		bpControl.setAudio(e.bpAudio);
	},
	checkHeight:function(e){
		if($(e).find('.secondMenu').height()>=window.innerHeight-52){
			$(e).find('.secondMenuInner').css({'max-height':window.innerHeight-52,'padding-right':10});	
		}
		var height = $(e).offset().top+$(e).find('.secondMenu').height()+52;	
		var _height = $(e).find('.secondMenu').height()+52;
		if(height>=window.innerHeight-10){
			var _top = window.innerHeight-height-1;
			$(e).find('.secondMenu').css({top:_top});
			$(e).find('.secondMenu .iBorder').addClass('borderCenter');
			var i1 = $(e).find('.secondMenu .iBorder i').eq(0);
			var i2 = $(e).find('.secondMenu .iBorder i').eq(1);
			$(i1).css({height:(_top*-1)-1});	
			$(i2).css({height:_height-(_top*-1)-42,marginTop:42});
		}
		else{
			$(e).find('.secondMenu').css({top:-1});
			$(e).find('.secondMenu .iBorder i').css({height:'100%',marginTop:0})
			$(e).find('.secondMenu .iBorder').removeClass('borderCenter');
		}		
	},
	init:function(bool){
		bool = bool==null?false:bool;	
		this.initData();
		if(bool)
			return this._init();
		var e = this.data;
		var t = this;
		$('.oneMenu').bind('mouseover',function(){
			t.checkHeight(this);
			$(this).addClass('sel');
			$(this).find('.secondMenu').show();		
		}).bind('mouseleave',function(){
			$(this).removeClass('sel');
			$(this).find('.secondMenu').hide();	
		});
		
		this.bg = new Checker({
			box:$('#setBg'),
			options:['视频','图片','黑色背景','无背景'],
			check:e.bg,
			notNull:true,
			multiple:false,
			change:function(){
				var x = this.getCheck();
				bgControl.use(x);
				t.saveData('bg',x);
				if(x!=3){
					$('body').removeClass('opacity');
					bpControl.isOpacity = 'false';
					$('.bpCover').removeClass('opacity');	
				}else{
					$('body').addClass('opacity');
					bpControl.isOpacity = 'true';
					if(e.bpType!=1)
						$('.bpCover').addClass('opacity');	
				}
				
				if(x==1){
					$('#forBgVideo').hide();
					$('#forBgCanvas').show();
					bgCanvas.setAble(true);
					bgCanvas.use(e.bgCanvas);
				}else{
					if(x==0){
						$('#forBgVideo').show();	
					}else
						$('#forBgVideo').hide();
					bgCanvas.setAble(false);
					$('#forBgCanvas').hide();
				}
				t.checkHeight($('.oneMenu')[1]);
			}
		});
		
		//屏幕亮度
		this.videoCover = new LineRange({
			box:$('#setVideoCover'),
			range:[4,10],
			isInt:true,
			useRange:e.videoCover,
			change:function(x){
				$('#setVideoCoverInfo').text(x);
				bgControl.setVideoLight(x);

				t.saveData('videoCover',x);
			}
		});
		
		this.bgCanvas = new Checker({
			box:$('#setBpCanvas'),
			options:['雪花','五星','圆点','无'],
			check:e.bgCanvas,
			notNull:true,
			multiple:false,
			change:function(){
				var x = this.getCheck();
				t.saveData('bgCanvas',x);
				bgCanvas.use(x);
			}
		});

		//字体大小
		/*
		this.fontSize = new Checker({
            box:$('#setFont'),
            options:['小','中','大'],
            check:e._fontSize,
            notNull:true,
            multiple:false,
            change:function(){
            	var x = this.getCheck();
            	console.log(x);
            	t.saveData('_fontSize',x);
            }
		})
		 */

		this.fontSize = new LineRange({
			box:$('#setFont'),
			range:[20,34],
			useRange:e._fontSize,
			change:function(x){
				var _x = parseFloat(x).toFixed(1);
				$('#setFontInfo').text(_x+'px');
				$('html').css({'font-size':_x+'px'});
				t.saveData('_fontSize',_x);
			}
		});

		this.bpFontStyle = new Checker({
			box:$('#setBpFontStyle'),
			options:['微软雅黑','墨字体','少女体','饰艺体','综艺体'],
			check:e.bpFontStyle,
			notNull:true,
			multiple:false,
			change:function(){
				var x = this.getCheck();
				t.saveData('bpFontStyle',x);
				var fontName = ['','bpFontStyle_mo','bpFontStyle_shaonv','bpFontStyle_sy','bpFontStyle_zy'];
				App.bpFontStyle = fontName[x];
			}
		});

		//屏幕亮度
		this.light = new LineRange({
			box:$('#setLight'),
			range:[2,10],
			isInt:true,
			useRange:e.light,
			change:function(x){
				$('#setLightInfo').text(x);
				var _x = (10-x)/10;
				basicControl.setLight(_x);
				t.saveData('light',x);
			}
		});
        //消息亮度
        this.msglight = new LineRange({
            box:$('#msgLight'),
            range:[2,10],
            isInt:true,
            useRange:e.msglight,
            change:function(x){
                $('#msgLightInfo').text(x);
                var _x = (10-x)/10;
                basicControl.msgLight(_x);
                t.saveData('msglight',x);

            }
        });
		
		//二维码和轮播图
		this.codeOpen = new Switcher({
			box:$('#setCode'),
			check:e.codeOpen,
			click:function(b){
				$('#setCodeInfo').text(b?'显示':'隐藏');
				basicControl.setAble(b);
				t.saveData('codeOpen',b);
			}
		});
		
		//霸屏风格
		this.bpType = new Checker({
			box:$('#setBpType'),
			options:['酷炫','简洁'],
			check:e.bpType,
			notNull:true,
			multiple:false,
			change:function(){
				var x = this.getCheck();
				t.saveData('bpType',x);
				if(x==1) // 简洁霸屏
					$('.bpCover').removeClass('opacity');
				else{
					if(e.bg==3){
						$('.bpCover').addClass('opacity');
						bpControl.isOpacity = 'true';
					}
				}
			}
		});
		
		//霸屏字体大小
		this.bpFont = new Checker({
			box:$('#setBpFont'),
			options:['大','中','小'],
			check:e.bpFontSize,
			notNull:true,
			multiple:false,
			change:function(){
				var x = this.getCheck();
				t.saveData('bpFontSize',x);
			}
		});
		
		//土豪倒计时
		this.bpCount = new Switcher({
			box:$('#setBpCount'),
			options:['酷炫','简洁'],
			check:e.bpCount,
			click:function(b){

				$('#setBpCountInfo').text(b?'开启':'关闭');
				bpControl.setCount(b);
				t.saveData('bpCount',b);
			}
		});
        //万圣节开关
        // this.bpCount = new Switcher({
        //     box:$('#sethwBp'),
        //     options:[],
        //     check:e.sethwBp,
        //     click:function(b){
        //         halloweenFlag =b;
        //         // $('#setBpCountInfo').text(b?'开启':'关闭');
        //         // bpControl.setCount(b);
        //         t.saveData('sethwBp',b);
        //     }
        // });
		//霸屏高度
		this.bpHeight = new LineRange({
			box:$('#setBpHeight'),
			range:[70,100],
			isInt:true,
			useRange:e.bpHeight,
			change:function(x){
				$('#setBpHeightInfo').text(x+'%');
				$('.bpMain').css({
					top:((100-x)/-2)+'%',
					'transform':'scaleY('+(x/100)+')'
				});
				t.saveData('bpHeight',x);
			}
		});
		
		//消息滚动
		this.msgOpen = new Switcher({
			box:$('#setMsg'),
			check:e.msgOpen,
			click:function(b){
				$('#setMsgInfo').text(b?'开启':'关闭');
				msgControl.setAble(b);
				t.saveData('msgOpen',b);
				if(!b)
					$('.setMsg').hide();	
				else
					$('.setMsg').show();
			}
		});
		
		/*滚动消息
		this.setMsgType = new Checker({
			box:$('#setMsgType'),
			options:['全部消息','霸屏、打赏类消息'],
			check:e.setMsgType,
			notNull:true,
			multiple:false,
			change:function(){
				var x = this.getCheck();
			}
		});
		*/
		
		//消息滚动间隔
		this.msgDelay = new LineRange({
			box:$('#setMsgDelay'),
			range:[2,8],
			useRange:parseInt(e._msgDelay/1000),
			isInt:true,
			change:function(x){
				$('#setMsgDelayInfo').text(x+'秒');
				t.saveData('_msgDelay',x*1000);	
			}
		});
		
		//消息最大数量
		this.msgNum = new LineRange({
			box:$('#setMsgNum'),
			range:[10,20],
			useRange:e.msgNum,
			isInt:true,
			change:function(x){
				// msgControl.setMsgNum(x);TODO
				$('#setMsgNumInfo').text(x+'条');
				t.saveData('msgNum',x);	
			}
		});

		//音频
		this.bpAudio = new Switcher({
			box:$('#setBpAudio'),
			check:e.bpAudio,
			click:function(b){
				$('#setBpAudioInfo').text(b?'开启':'关闭');
				bpControl.setAudio(b);
				t.saveData('bpAudio',b);			
			}
		});
		
		//跑马灯显示
		this.marqueeOpen = new Switcher({
			box:$('#setMqShow'),
			check:e.marqueeOpen,
			click:function(b){
				$('#setMqShowInfo').text(b?'开启':'关闭');
				t.saveData('marqueeOpen',b);
				// marqueeControl.setAble(b);
				if(!b)
					$('.setMq').hide();	
				else
					$('.setMq').show();	
			}
		});
		
		//跑马灯字体
		this.marqueeSize = new LineRange({
			box:$('#setMqSize'),
			range:[20,30],
			useRange:e.marqueeSize,
			isInt:true,
			change:function(x){
				$('#setMqSizeInfo').text(x+'px');
				$('.marquee').css({'font-size':x+'px'});
				t.saveData('marqueeSize',x);	
			}
		});
		
		//跑马灯速度
		this.marqueeSpeed = new LineRange({
			box:$('#setMqSpeed'),
			range:[1,4],
			useRange:e.marqueeSpeed,
			isInt:true,
			change:function(x){
				$('#setMqSpeedInfo').text(x);
				t.saveData('marqueeSpeed',x);		
			}
		});
		
		//跑马灯显示间隔
		this.marqueeDelay = new LineRange({
			box:$('#setMqDelay'),
			range:[5,30],
			useRange:parseInt(e.marqueeDelay/1000),
			isInt:true,
			change:function(x){
				$('#setMqDelayInfo').text(x+'秒');
				t.saveData('marqueeDelay',x*1000);		
			}
		});
		
		//快捷键开关
		this.setEntry = new Switcher({
			box:$('#setEntry'),
			check:e.setEntry,
			click:function(b){
				t.saveData('setEntry',b);
				// entryControl.setAble(b);TODO
			}
		});
		
		$('#setOnWallTitle').val(e.title);
		$('.onWallHeadTitle').text(e.title);
		$('#setOnWallTitle').bind('input propertychange',function(){
			$('.onWallHeadTitle').text(this.value);
			t.saveData('title',this.value);
			return false;
		});
		
		$('.secondMenu').hide().css({visibility:'visible'});
		$('#systemControl').bind('mouseover',function(){
			$('.systemControlSpan tt').html('<i class="sj3"></i><i class="sj4"></i>');
			$('#systemControl').css({transform:'translate(0,0)'});	
		}).bind('mouseleave',function(){
			$('.systemControlSpan tt').html('<i class="sj1"></i><i class="sj2"></i>');
			$('.secondMenuInner').css({'max-height':'auto','padding-right':0});
			$('#systemControl').css({transform:'translate(-120px,0)'});
		});
	},
	saveData:function(name,val){
		this.data[name] = val;
		if(localStorage){
			name = name=='title'?Global.Merchant.name:name;
			localStorage.setItem(name,val);	
		}
	},
	getData:function(name){
		if(typeof localStorage=='undefined')
			return null;
		var _name = name=='title'?allData.barName:name;
		var val = localStorage.getItem(_name);
		if(val!=null){
			val = val==='true'?true:val;
			val = val==='false'?false:val;
			return val;
		}
		if(name=='title')
			val = '欢迎光临'+Global.Merchant.name;
		else
			val = App.defaultCfg[name];
		val = val==='true'?true:val;
		val = val==='false'?false:val;
		return val;
	},
	initData:function(){
		for(var i in this.data){
			if(i!='wxLeft'&&i!='wxTop')
				this.data[i] = this.getData(i);
			else{
				this.data[i] = localStorage.getItem(i);	
			}
		}	
	},
	setDefault:function(){
		App.public.showInfo('已经为您还原到系统默认设置');
		var e = App.defaultCfg;
		var title = '欢迎光临'+Global.Merchant.name;
		$('#setOnWallTitle').val(title);
		$('.onWallHeadTitle').text(title);
		this.saveData('title',title);
		this.fontSize.setByRange(e._fontSize);
		this.light.setByRange(e.light);
        this.msglight.setByRange(e.msglight);
        this.sethwBp.setByRange(e.sethwBp);
		this.bpHeight.setByRange(e.bpHeight);	
		this.codeOpen.setCheck(e.codeOpen);
		this.bgCanvas.fire(e.bgCanvas);
		this.bg.fire(e.bg);
		this.bpType.fire(e.bpType);
		this.bpFont.fire(e.bpFontSize);
		this.msgOpen.setCheck(e.msgOpen);
		this.msgDelay.setByRange(parseInt(e._msgDelay/1000));
		this.msgNum.setByRange(e.msgNum);
		this.bpAudio.setCheck(e.bpAudio);
		this.marqueeOpen.setCheck(e.marqueeOpen);
		this.marqueeSize.setByRange(parseInt(e.marqueeSize));
		this.marqueeSpeed.setByRange(parseInt(e.marqueeSpeed));
		this.marqueeDelay.setByRange(parseInt(e.marqueeDelay/1000));
		keyBroadControl.resetCode();
	}
};

window.SystemControl = systemControl;
export default systemControl;