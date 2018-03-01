//表情切换

var control = {
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
	face:["[笑哈哈]","[得瑟]","[得意地笑]","[转圈]","[挤地铁]","[我忍了]","[粉爱你]","[粉红兔火车]","[转圈圈]","[鼓掌]","[压力]","[抢镜]","[草泥马]","[神马]","[多云]","[给力]","[围观]","[v5]","[小熊猫]","[粉红兔微笑]","[动感光波]","[囧]","[互粉]","[礼物]","[微笑]","[呲牙笑]","[大笑]","[羞羞]","[小可怜]","[抠鼻孔]","[惊讶]","[大眼睛羞涩]","[吐舌头]","[闭嘴]","[鄙视]","[爱你哦]","[泪牛满面]","[偷笑]","[嘴一个]","[生病]","[装可爱]","[切~]","[右不屑]","[左不屑]","[嘘]","[雷人]","[呕吐]","[委屈]","[装可爱]","[再见]","[疑问]","[困]","[money]","[装酷]","[色眯眯]","[ok]","[good]","[nonono]","[赞一个]","[弱]"],
	init:function(){
		var html = '';
		var x = 0,y = 0,b = false;
		for(var i in this.newFace){
			if(x%7==0)
				html += '<div>',b = true;
			html += '<a index="'+i+'" onclick="control.setFace(this)"><img src="'+this.faceUrl+i+'.png" /></a>';
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
		$('.allFace').html(html+'<div style="clear:both"></div>');
	},
	show:function(){
		if($('.allFace').hasClass('hide')){
			$('.allFace').removeClass('hide');
			$(window).bind('mousedown.face',function(e){
				var target = e.target;
				if(target.id=='txt'||target.id=='allFace')
					return;
				if($('#allFace').find(target).length>0)
					return;
				$(window).unbind('mousedown.face');
				setTimeout(function(){
					$('.allFace').addClass('hide');	
				},250);	
			});
		}else{
			control.closeFace();
		}
	},
	closeFace:function(){
		$(window).unbind('mousedown.face');
		$('.allFace').addClass('hide');			
	},
	insertHtml:function(str,id){
		this.isShow(false);
		var obj = document.getElementById(id);
		if(document.selection){
			var sel = document.selection.createRange();
			sel.text = str;
			$('#txt').blur();
		}else if (typeof obj.selectionStart == 'number' && typeof obj.selectionEnd == 'number'){
			var startPos = obj.selectionStart,
				endPos = obj.selectionEnd,
				cursorPos = startPos,
				tmpStr = obj.value;
			obj.value = tmpStr.substring(0, startPos) + str + tmpStr.substring(endPos, tmpStr.length);
			cursorPos += str.length;
			obj.selectionStart = obj.selectionEnd = cursorPos;
			$('#txt').blur();
		}else {
			obj.value += str;
			$('#txt').blur();
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
		this.insertHtml(val,'txt');
	},
	initFace:function(list){
		var arr = this.face;
		for(var i=0;i<list.length;i++){
			var val = list[i].innerHTML;
			for(var j=0;j<arr.length;j++){
				while(val.indexOf(arr[j])!=-1){
					val = val.replace(arr[j],'<img style="width:22px; height:22px; vertical-align:middle; margin:0 2px" src="'+this.faceUrl+'/'+(j+1)+'.png" />');
				}	
			}
			list[i].innerHTML = val;
		}
	},
	replaceText:function(val){
		if(val==null||val.length==0)
			return '';
		if(val.indexOf('[')==-1||val.indexOf(']')==-1)
			return val;
		if(val!=null){
			var arr = this.face;
			for(var i=0;i<arr.length;i++){
				while(val.indexOf(arr[i])!=-1){
					val = val.replace(arr[i],'<img style="width:22px; height:22px; vertical-align:middle; margin:0 2px; visibility:visible" src="'+this.faceUrl+'/'+(i+1)+'.png" />');
			
				}
			}	
			return this.newReplaceText(val);
		}else{
			return "";
		}
		
	},
	newReplaceText:function(val){
		if(val!=null){
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
/*
var control = {
	face:["[笑哈哈]","[得瑟]","[得意地笑]","[转圈]","[挤地铁]","[我忍了]","[粉爱你]","[粉红兔火车]","[转圈圈]","[鼓掌]","[压力]","[抢镜]","[草泥马]","[神马]","[多云]","[给力]","[围观]","[v5]","[小熊猫]","[粉红兔微笑]","[动感光波]","[囧]","[互粉]","[礼物]","[微笑]","[呲牙笑]","[大笑]","[羞羞]","[小可怜]","[抠鼻孔]","[惊讶]","[大眼睛羞涩]","[吐舌头]","[闭嘴]","[鄙视]","[爱你哦]","[泪牛满面]","[偷笑]","[嘴一个]","[生病]","[装可爱]","[切~]","[右不屑]","[左不屑]","[嘘]","[雷人]","[呕吐]","[委屈]","[装可爱]","[再见]","[疑问]","[困]","[money]","[装酷]","[色眯眯]","[ok]","[good]","[nonono]","[赞一个]","[弱]"],
	init:function(){
		var html = '';
		for(var i=1;i<=this.face.length;i++){
			html += '';
			html += '<a index="'+i+'" onclick="control.setFace(this)"><img src="'+this.faceUrl+i+'.png" /></a>';
			html += '';	
		}
		$('.allFace').html(html+'<div style="clear:both"></div>');	
	},
	show:function(){
		if($('.allFace').hasClass('hide')){
			$('.allFace').removeClass('hide');
			$(window).bind('mousedown.face',function(e){
				var target = e.target;
				if(target.id=='txt'||target.id=='allFace')
					return;
				if($('#allFace').find(target).length>0)
					return;
				$(window).unbind('mousedown.face');
				setTimeout(function(){
					$('.allFace').addClass('hide');	
				},250);	
			});
		}else{
			control.closeFace();
		}
	},
	closeFace:function(){
		$(window).unbind('mousedown.face');
		$('.allFace').addClass('hide');			
	},
	insertHtml:function(str,id){
		this.isShow(false);
		var obj = document.getElementById(id);
		if(document.selection){
			var sel = document.selection.createRange();
			sel.text = str;
			$('#txt').blur();
		}else if (typeof obj.selectionStart == 'number' && typeof obj.selectionEnd == 'number'){
			var startPos = obj.selectionStart,
				endPos = obj.selectionEnd,
				cursorPos = startPos,
				tmpStr = obj.value;
			obj.value = tmpStr.substring(0, startPos) + str + tmpStr.substring(endPos, tmpStr.length);
			cursorPos += str.length;
			obj.selectionStart = obj.selectionEnd = cursorPos;
			$('#txt').blur();
		}else {
			obj.value += str;
			$('#txt').blur();
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
		this.insertHtml(this.face[parseInt($(e).attr('index'))-1],'txt');
	},
	initFace:function(list){
		var arr = this.face;
		for(var i=0;i<list.length;i++){
			var val = list[i].innerHTML;
			for(var j=0;j<arr.length;j++){
				while(val.indexOf(arr[j])!=-1){
					val = val.replace(arr[j],'<img style="width:22px; height:22px; vertical-align:middle; margin:0 2px" src="'+this.faceUrl+'/'+(j+1)+'.png" />');
				}	
			}
			list[i].innerHTML = val;
		}
	},
	replaceText:function(val){
		if(val!=null){
			var arr = this.face;
			for(var i=0;i<arr.length;i++){
				while(val.indexOf(arr[i])!=-1){
					val = val.replace(arr[i],'<img style="width:22px; height:22px; vertical-align:middle; margin:0 2px; visibility:visible" src="'+this.faceUrl+'/'+(i+1)+'.png" />');
			
				}
			}	
			return val;
		}else{
			return "";
		}
		
	}
}
*/
//加载
var loading = {
	hasMore:true,
	loading:false,
	pageCount:10,
	nowPage:1,
	top:0,
	setData:function(data){
		var loc = '';
		var newArr = data;
		for(var x=newArr.length-1;x>=0;x--){
			var e = newArr[x];
			e.location = '';
			if(e.type==1){
				if(loc=='')
					loc = e.text;		
			}else{
				if(e.userId!=my.userId){
					if(x>0&&newArr[x-1].userId==e.userId){
							
					}else{
						e.location = loc;	
						loc = '';		
					}
				}else
					loc = '';
			}
		}
		return newArr;
	},
	create:function(data){
		if(data.type==1){
			return '';
			/*
			if(data.userId==my.userId){
				return '';
			}else{
				return this.createSystem(data);
			}
			*/
		}
		var html = '';
		var obj = data.userId==my.userId?my:other;
		if(data.userId==my.userId){
			obj.userName = $.trim($('#my').val());
			obj.txt = $.trim($('#myTxt').val());
		}else{
			obj.userName = $.trim($('#other').val());
			obj.txt = $.trim($('#otherTxt').val());
		}
		var bool = data.userId==my.userId?true:false;
		html += bool?'<div class="myTxt row" tid="'+data.id+'">':'<div class="other row" tid="'+data.id+'">';
		html += '<a userId="'+obj.userId+'" data-src="'+obj.src+'" data-name="'+obj.userName+'" data-age="'+obj.age+'" data-job="'+obj.job+'" data-kg="'+obj.kg+'" data-sex="'+obj.sex+'" data-cm="'+obj.cm+'" data-txt="'+obj.txt+'" data-url="" onclick="active.show(this)"><img class="face '+obj.sex+'" src="'+obj.msrc+'" /></a>';
		html += '<span class="content">';
		html += '<tt class="name"><i class="time">'+data.time+' '+(data.location||'')+'</i></tt>';
		html += '<tt class="txt">';
		html += '<span class="'+(bool?'imArrMe':'imArrYou')+'"></span>';
		html += '<span class="txtSpan">';
		var reg = /^[0-9]+$/;

		if(data.type==3||reg.test(data._src)){
			if(parseInt(data._src)<12){
				html += '';	
			}else{
				html += '<img src="'+(allImageUrl+gif[data._src].img)+'.gif" />';
			}
			if(newDs[data._src])
				html += '<p style="color:#f4a4be; text-align:center">送礼：'+newDs[data._src].name+'</p>';
			//html += '送礼：'+newDs[data._src].name;
			if(data.text!=null&&data.text.length>0){
				html += '<tt class="dsLine"></tt>'+data.text;	
			}
		}else{
			html += control.replaceText(data.text);
			//图片
			if(data.src!=null&&$.trim(data.src).length>0)
				html += '<img onclick="showImage(this)" class="bg" _src="'+data._src+'" src="'+data.src+'" onload="setMargin(this)" onerror="setMargin(this)" />';
		}
		html += '</span>';
		if(!bool){
			html += '<tt class="action"><span class="aBlack" onclick="onWall.toBlack(this)">拉黑</span></tt>';	
			html += '<tt class="action" style="right:-90px;"><span class="aBlack" onclick="onWall.toReport(this)">举报</span></tt>';	
		}
		html += '</tt></span></div>';
		html += '';
		return html;

	},
	createSystem:function(data){
		return '<div class="systemRow row"><span>'+data.text+'</span></div>'; 	
	},
	init:function(){
		if($('.row').length<this.pageCount)
			return this.hasMore = false;
		$(window).bind('scroll',function(){
			var t = $(window).scrollTop();
			if(t==0)
				loading.load();			
		});
	},
	load:function(){
		if(this.loading)
			return;
		if(!this.hasMore)	
			return $('.loadMore tt').html('没有更多了'),$('.loadMore').show().removeClass('animate');
		$('.loadMore tt').html('微喵为您加载'),$('.loadMore').show();	
		this.loading = true;
		ajax_loadMore(this.nowPage,function(data){
			loading.nowPage++;
			loading.top = document.body.offsetHeight-$(window).height();
			loading.top = loading.top<0?0:loading.top;
			var html = '';
			if(data!=null&&data.length>0){
				//for(var x=0;x<data.length;x++){
				data = loading.setData(data);
				for(var x=data.length-1;x>=0;x--){
					html += loading.create(data[x]);	
				}
				if(data.length<loading.pageCount)
					loading.hasMore = false;	
			}
			if(html=='')
				loading.hasMore = false;
			else{
				$(html).insertAfter($('#first'));
				setTimeout(function(){
					$(window).scrollTop(document.body.offsetHeight-$(window).height()-loading.top);	
				},1);	
			}
			if(loading.hasMore)	
				$('.loadMore').hide();
			else
				$('.loadMore tt').html('没有更多了'),$('.loadMore').removeClass('animate');	
			loading.loading = false;
		},function(errorMsg){
			showInfo(errorMsg||'加载失败',false);
			$('.loadMore').hide();
			loading.loading = false;	
		});
	},
	firstLoad:function(callback){
		this.loading = true;
		ajax_loadMore(this.nowPage,function(data){
			data = data==null?[]:data;
			loading.nowPage++;
			var html = '';
			if(data!=null&&data.length>0){
				data = loading.setData(data);
				for(var x=data.length-1;x>=0;x--){
					html += loading.create(data[x]);
				}
				if(data.length<loading.pageCount)
					loading.hasMore = false;	
			}else{
				loading.hasMore = false;	
			}
			if($('.row').length>1){
				$(html).insertBefore($('.row')[1]);		
			}else
				$(html).appendTo($('.all'));	
			loading.loading = false;
			if(callback)
				callback();
		},function(errorMsg){
			WM.Phone.get({
				type:'alert',
				innerHTML:errorMsg||'加载失败，请点击确定重试',
				click:function(){
					this.close();
					loading.firstLoad();	
				}
			})
			loading.loading = false;	
		});		
	}
}


//socket
var webSocket = {
	connect:function(host){
	    if ('WebSocket' in window) {
	        this.socket = new WebSocket(host);
	    } else if ('MozWebSocket' in window) {
	        this.socket = new MozWebSocket(host);
	    } else {
	        return;
	    }
	    this.socket.onopen = function(){
			//链接开始
			webSocket.onOpen();	
	    };
	    this.socket.onclose = function(){
	  		initWebSocket(host);
	    };
		this.socket.onerror = function(){

		};
		this.socket.onmessage = function(msg){
			webSocket.onMessage(msg);	
		}	
	},
	close:function(){
		this.socket.close();		
	},
	init:function(data){
		data = data||{};
		this.data = data;
		this.onOpen = data.onOpen||function(){};
		this.onMessage = data.onMessage||function(){};
		this.connect(data.url||'');	
	},
	send:function(msg){
		this.socket.send(msg);
	}
}

var initWebSocket = function(host){
	webSocket.init({
		url:host,	
		onOpen:function(){},
		onMessage:function(msg){
			//有新消息 只推送对方发的新消息
			// if(msg.type==1){
			// 	var arr = msg.split('<>');
			// 	var dt = {
			// 		sendId:other.userId,
			// 		id:arr[0],//消息id
			// 		text:arr[1],//文字
			// 		src:arr[2],//小图
			// 		_src:arr[3],//大图
			// 		time:arr[4]//时间
			// 	}
			// 	var html = '';
			// 	html += loading.create(dt);	
			// 	$(html).appendTo($('.all'));
			// 	onWallScroll.down();			
			// }else if(msg.type==2){

			// }
			var arr = msg.data.split('<>');
			var sid = arr[5];
			//if(sid==other.userId){
			var dt = {
				userId:sid,
				id:arr[0],//消息id
				text:arr[1]!="undefined"?arr[1]:null,//文字
				src:arr[2]!="undefined"?arr[2]:null,//小图
				_src:arr[2]!="undefined"?arr[2].replace("_100_100", ""):null,//大图
				time:arr[3]//时间
			}
			var html = '';
			html += loading.create(dt);	
			$(html).appendTo($('.all'));
			onWallScroll.down();
			ajax_changeRead(arr[0]);
			//}		
		}
	});
}

//敏感词
var keyWord = {
	systemWord:{},
	check:function(val){
		if($.trim(val).length==0)
			return true;
		if(this.systemWord==null||this.systemWord=='')
			return true;
		for(var x in this.systemWord){
			var arr = this.systemWord[x].split(' ');
			var newArr = [];
			for(var y=0;y<arr.length;y++){
				var e = $.trim(arr[y]);
				if(e.length>0)
					newArr.push(e);	
			}
			var bool = false;
			for(var i=0;i<newArr.length;i++){
				var e = $.trim(newArr[i]);
				if(val.indexOf(e)==-1)
					bool = true;	
			}
			if(!bool){
				ajax_word(x);
				return false;	
			}
				
		}
		return true;
	},
	list:[],
	replace:function(val){
		if(this.list.length==0)
			return val;
		for(var x=0;x<this.list.length;x++){
			var e = this.list[x];
			if(val.indexOf(e)!=-1){
				var len = e.length;
				var res = '';
				for(var i=0;i<len;i++)
					res += '*';
				var reg = new RegExp(e,"g");
				val = val.replace(reg,res);
			}
		}
		return val;
	}
}

//字符串长度
var getTextLength = function(txt){
	var _len = 0,reg = /^[A-Za-z]+$/;
	for(var k=0;k<txt.length;k++){
		if(!reg.test(txt.charAt(k)))
			_len++;
		else
			_len+=0.5;		
	}	
	return _len;
}

var showImage = function(e){
	WM.Phone.showImage($(e).attr('_src'));
}

//上传
var upload = {
	start:function(){
		$('#txt').addClass('hasImage');
		$('<a class="afterUpload" onclick="upload.del(this)"><tt class="onloading"></tt><tt class="slideClose"></tt></a>').appendTo($('.newFoot-inputBox'));
	},
	done:function(src,cSrc,bigSrc){
		$('.afterUpload').html('<img class="img" src="'+src+'" bigSrc="'+bigSrc+'" /><tt class="slideClose"></tt>');	
	},
	error:function(errorMsg){
		showInfo(errorMsg||'上传失败',false);
		$('#txt').removeClass('hasImage');
		$('.afterUpload').remove();
	},
	del:function(e){
		WM.Phone.get({
			type:'confirm',
			title:'删除',
			innerHTML:'确定删除此图片?',
			click:function(b){
				if(!b)
					return this.close();
				try{
					ajaxUpload.abort();
					//$('#upload').fileupload('stop');
				}catch(ex){}
				this.close();
				$('#txt').removeClass('hasImage');
				if($(e).find('.img').length>0){
					var src = $(e).find('.img').attr('bigSrc');
					ajax_delImage(src);	
				}
				$(e).remove();
			}
		})	
	},
	clear:function(){
		try{
			ajaxUpload.abort();
		}catch(ex){}
		$('#txt').removeClass('hasImage');
		$('.afterUpload').remove();
	}
}
var imageUpLoad = function(e){
	if(typeof isshutup!='undefined'&&isshutup)
		return showInfo('该酒吧禁止私聊',false);
	upload.start();
	selectFileImage(e,{
		width:400,height:400,
		error:function(errorMsg){upload.error(errorMsg||'请上传宽高大于400px的图片')},
		callback:function(base64,rotate){
			ajax_imageUpload(base64,rotate,'ajaxUpload',function(src,cSrc,bigSrc){
				upload.done(src,cSrc,bigSrc);
			},function(errorMsg){
				showInfo(errorMsg||'上传失败');
				upload.error();
			})
		}
	})
}

//上墙操作
var onWall = {
	submit:function(e){
		if(typeof isshutup!='undefined'&&isshutup)
			return showInfo('该酒吧禁止私聊',false);
		var txt = $.trim($('#txt').val());
		txt = txt.replace(/</g,'&lt;');
		txt = txt.replace(/>/g,'&gt;');
		var img = $('.afterUpload .img');
		if(txt.length==0&&img.length==0)
			return showInfo('请输入文字或者上传图片',false);
		if(img.length>0&&($(img).attr('bigSrc')=='undefined'||$(img).attr('bigSrc')==undefined))
			return showInfo('您上传的图片不可用，请重新上传');
		var imgSrc = img.length>0?$(img).attr('src'):null;
		var bigSrc = img.length>0?$(img).attr('bigSrc'):null;
		//系统词语检测
		if(!keyWord.check(txt))
			return showInfo('请勿发布广告等不适内容',false);
		WM.Phone.setButton(e,false);
		//敏感词
		txt = keyWord.replace(txt);
		ajax_submit(txt,bigSrc,function(tid,time){
			upload.clear();
			WM.Phone.setButton(e,true);	
			$('#txt').val('');
		},function(errorMsg){
			WM.Phone.setButton(e,true);
			showInfo(errorMsg||'发送失败',false);
		});		
	},
	remove:function(tid){
		$('.row[tid="'+tid+'"]').remove();
	},
	add:function(tid,time,val,src,bigSrc){
		if($('.row[tid="'+tid+'"]').length>0)
			return;
		var html = createOne('myMsg',{
			'tid':tid,
			'userId':my.userId, 
			'userName':$.trim($('#my_name').val()), 
			'age':my.age,
			'job':my.job,
			'kg':my.kg,
			'sex':my.sex,
			'cm':my.cm,
			'txt':$.trim($('#my_txt').val()),
			'url':my.url,
			'head':my.head,
			'bigHead':my.bigHead,
			'time':time,
			'msg':val,
			'src':src,
			'bigSrc':bigSrc	
		},true);
		$(html).appendTo($('.onWallMain'));	
		onWallScroll.down();	
	},
	setMargin:function(e){
		try{
			var parent = e.parentNode;
			if(!$(parent).hasClass('txtSpan'))
				parent = parent.parentNode.parentNode;
			var txt = $(parent).text();
			if($.trim(txt).length>0||$(parent).find('img').length>1)
				$(e).addClass('hasMargin');
		}catch(ex){}
		$(e).css({'visibility':'visible'});
	},
	toBlack:function(e){
		WM.Phone.get({
			type:'confirm',
			title:'拉黑',
			innerHTML:'确定拉黑?',
			click:function(b){
				if(!b)
					return this.close();
				var t = this;
				WM.Phone.setButton(this.getButton()[1],false);
				ajax_toBlack(other.userId,function(){
					t.close();
					showInfo('操作成功',true);	
				},function(errorMsg){
					showInfo(errorMsg||'操作失败',false);
					WM.Phone.setButton(t.getButton()[1],true);
				});	
			}
		})		
	},
	toReport:function(e){
		WM.Phone.get({
			type:'confirm',
			title:'举报',
			innerHTML:'该用户涉嫌色情、广告、骚扰等行为，请确认举报?',
			click:function(b){
				if(!b)
					return this.close();
				var t = this;
				WM.Phone.setButton(this.getButton()[1],false);
				ajax_toReport(my.userId,other.userId,function(){
					t.close();
					showInfo('操作成功',true);	
				},function(errorMsg){
					showInfo(errorMsg||'操作失败',false);
					WM.Phone.setButton(t.getButton()[1],true);
				});	
			}
		})	
	},
	del:function(e){
		WM.Phone.get({
			type:'confirm',
			title:'删除',
			innerHTML:'确定删除此消息？',
			click:function(b){
				if(!b)
					return this.close();
				var parent = e.parentNode.parentNode.parentNode;
				var tid = $(parent).attr('tid');
				var t = this;
				WM.Phone.setButton(this.getButton()[1],false);
				ajax_del(tid,false,function(){
					$(parent).remove();	
					t.close();
				},function(errorMsg){
					WM.Phone.setButton(t.getButton()[1],true);
					showInfo(errorMsg||'删除失败',false);
				});
			}
		});		
	},
	hide:function(e){
		$(e.parentNode.parentNode.parentNode).hide();		
	},
	showMenu:function(){
		return;
		if($('.forAction').hasClass('hide'))
			return $('.forAction').removeClass('hide'),$('.faceCover').hide(),$('.allFace').addClass('hide');
		$('.forAction').addClass('hide');		
	},
	closeMenu:function(){
	},
	count:function(con,fn){
		con = con||10;
		var time = setTimeout(function(){
			$('#submit').html(con+'s');
			if(con==0){
				clearTimeout(time);
				if(fn)
					fn();	
				return;
			}
			con--;
			time = setTimeout(arguments.callee,1000);	
		},0);	
	},
	showImage:function(e){
		var src = $(e).attr('bigSrc');
		if(src!=null&&src!=''&&src!='undefined')
			WM.Phone.showImage(src);
	}
}

//推送普通消息
var sendMsg = function(dt){
	return;
	dt.barId = "${weionwall.barbase.id}";
	dt.user = copyMy();
	var newData = {bp:'',normal:[dt]}
	var dtMsg = JSON.stringify(newData);
	webSocket.send(dtMsg,true);
}

//拼消息
var createSystem = function(){
	return '';	
}
var createOne = function(id,data){
	var reg = new RegExp("\\[([^\\[\\]]*?)\\]", 'igm');
	var html = document.getElementById(id).innerHTML;
	
	//霸屏消息 data.richTime-霸屏时间
	var msg = '';
	msg += data.msg;
	
	var val = html.replace(reg, 
		function(node,key){ 
			return { 
				'tid':data.tid,
				'userId':data.userId, 
				'userName':data.userName, 
				'age':data.age||'',
				'job':data.job||'',
				'kg':data.kg||'',
				'sex':data.sex||'',
				'cm':data.cm||'',
				'txt':data.txt||'',
				'head':data.head,
				'bigHead':data.bigHead,
				'time':data.time,
				'msg':msg
			}[key]; 
		}
	);		
	return val;
}

var setMargin = function(e){
	var txt = $(e.parentNode).text();
	if($.trim(txt).length>0||$(e.parentNode).find('img').length>1)
		$(e).addClass('hasMargin');
}

var onWallScroll = {
	len:300,
	delay:100,
	animateTime:150,
	timeout:null,
	top:0,
	init:function(fn){
		$(window).bind('scroll',function(){
			onWallScroll.top = $(window).scrollTop();	
		});	
		setTimeout(function(){
			$('html,body').stop().animate({scrollTop:$(document).height()-$(window).height()},onWallScroll.animateTime);
			if(fn)
				setTimeout(function(){fn()},onWallScroll.animateTime)			
		},500);	
	},
	down:function(){
		try{clearTimeout(onWallScroll.timeout)}catch(ex){}
		this.timeout = setTimeout(function(){
			var h = $(document).height()-$(window).height();
			$('html,body').stop().animate({scrollTop:h},onWallScroll.animateTime);	
			return;
			if(h-onWallScroll.top<=onWallScroll.len){
				$('html,body').stop().animate({scrollTop:h},onWallScroll.animateTime);		
			}			
		},onWallScroll.delay);
	}
}

var active = {
	imgLoad:function(e){
		$(e.parentNode).find('.Phone_loading').remove();
		$(e.parentNode).find('.reflectionBox').css({visibility:'visible'});
		$(e.parentNode).find('img').css({visibility:'visible'});
	},
	load:function(e){
		this.set('imageLoad');
	},
	showAll:function(){
		$('.userBox .firstSlide').find('.reflectionBox').css({visibility:'visible'});
		$('.userBox .firstSlide').find('img').css({visibility:'visible'});
		$('.userBox>.Phone_loading').hide();
		$('.userBox').find('.userInfo').show();		
	},
	imageLoad:false,
	imageData:[],
	ready:true,
	ajaxLoad:false,
	swiper:null,
	loadNum:3,//每次加载几张图片
	reset:function(){
		this.imageLoad = false;
		this.ajaxLoad = false;
		this.imageData = [];
		try{
			active.swiper.destroy(true);		
		}catch(ex){}
	},
	setImages:function(n){
		var one = WM.Phone.loading.getHtml();
		var allImage = $('#swiper-container1 .swiper-slide');
		var newArr = Array.prototype.slice.call(allImage,n,n+this.loadNum);
		for(var x=0;x<newArr.length;x++){
			if(!$(newArr[x]).hasClass('loaded')){
				$(one).insertBefore($(newArr[x]).find('.userBg'));
				$(newArr[x]).addClass('loaded');
				$(newArr[x]).find('img').attr({src:$(newArr[x]).find('img').attr('_src')});		
			}	
		}
	},
	set:function(type){
		this[type] = true;
		if(this.imageLoad&&this.ajaxLoad){
			this.imageLoad = false;
			this.ajaxLoad = false;
			var dt = this.imageData;
			var html = '';
			for(var x=0;x<dt.length;x++)
				html += this.create(dt[x]);
			$(html).appendTo($('#swiper-container1 .swiper-wrapper'));
			this.initSwiper();
			this.showAll();
			this.setImages(0);
		}
	},
	initSwiper:function(){
		var maxLen = $('.swiper-slide').length;
		this.swiper = new Swiper('#swiper-container1',{
			paginationType: $('.swiper-slide').length>0?'fraction':'bullets',
			onTransitionStart:function(e){
				if((e.activeIndex+1)%active.loadNum==0)
					active.setImages(e.activeIndex+1);		
			},
			onInit:function(){
				if(maxLen<=1)return;
				$('#userTipIndex').html(1+'/'+maxLen+'&nbsp;&nbsp;');
			},
			onSlideChangeEnd:function(e){
				if(maxLen<=1)
					return;
				$('#userTipIndex').html((e.activeIndex+1)+'/'+maxLen+'&nbsp;&nbsp;');
			}
		});			
	},
	close:function(){
		try{
			getUserImage.abort();	
		}catch(ex){}
		$('.userBox').hide();
		this.reset();
		$('.userBoxAllBg').html('');
	},
	create:function(src,bool){
		if(bool)
			return '<div class="swiper-slide firstSlide loaded"><img src="'+src+'" class="userBg" onload="active.load(this)" /><div class="reflectionBox"><img class="reflection" src="'+src+'" /></div></div>';
		
		return '<div class="swiper-slide"><img _src="'+src+'" class="userBg beforeLoad" onerror="active.imgLoad(this)" onload="active.imgLoad(this)" /><div class="reflectionBox"><img class="reflection beforeLoad" _src="'+src+'" /></div></div>';
	},
	show:function(e){
		this.reset();
		$('.userBoxAllBg').html('');
		var src = $(e).attr('data-src')||"";
		var name = $(e).attr('data-name')||"";
		var sex = $(e).attr('data-sex')||"";
		var age = $(e).attr('data-age')||"";
		var cm = $(e).attr('data-cm')||"";
		var kg = $(e).attr('data-kg')||"";
		var job = $(e).attr('data-job')||"";
		var txt = $(e).attr('data-txt')||"";
		var tid = $(e).attr('userId')||"";
		var href = $(e).attr('data-url')||"";

		if($('.userBox>.Phone_loading').length==0){
			var loading = WM.Phone.loading.getHtml();
			$(loading).appendTo($('.userBox'));
		}else
			$('.userBox>.Phone_loading').show();
		var imgHtml = '<div class="swiper-container" id="swiper-container1"><div class="swiper-wrapper">';
		imgHtml += this.create(src,true);
		imgHtml += '</div><div class="swiper-pagination" id="swiper-pagination1" style="position:absolute; bottom:10px;">&nbsp;</div></div>';
		$('.userBoxAllBg').html(imgHtml);
		$('.userInfo .p1').html(name+'<span class="'+sex+'">'+(sex=='woman'?'女士':'男士')+'</span>');
		var html = '';
		if(age!=null&&age!='')
			html += '<span>'+age+'岁&nbsp;&nbsp;/&nbsp;&nbsp;</span>';
		if(cm!=null&&cm!='')
			html += '<span>'+cm+'Cm&nbsp;&nbsp;/&nbsp;&nbsp;</span>';
		if(kg!=null&&kg!='')
			html += '<span>'+kg+'Kg&nbsp;&nbsp;/&nbsp;&nbsp;</span>';
		if(job!=null&&job!='')
			html += '<span>'+job+'</span>';
		$('.userInfo .p2').html(html+'<p style="clear:both"></p>');
		txt = txt||'';
		$('.userInfo .p3').html(txt);
		$('.userBox').show();
		//$('#swiper-pagination1').css({bottom:$('.userInfo')[0].offsetHeight+40})
		
		ajax_getUserImage(tid,barbaseId,function(imageData){
			active.imageData = imageData;
			active.set('ajaxLoad');
		},function(){
			active.imageData = [];
			active.set('ajaxLoad');
		});
	}	
}

var setInput = function(){
	var u = navigator.userAgent;
    var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
    var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
	var inter = null;
	var timeout = null;
	$('#txt').bind('click',function(ev){
		if(isiOS){		
			timeout = setTimeout(function(){
				document.body.scrollTop = document.body.scrollHeight;
			},500);		
		}
	}).bind('blur',function(){
	});	
}

var ds = {
	isFull:false,
	show:function(e,toUser){
		this.isFull = false;
		var src = other.msrc;
		var userName = $.trim($('#other').val());
		var html = '<div style="text-align:center"><img src="'+src+'" style="border-radius:4px; width:60px; height:60px" /><p style="margin-top:5px;">'+userName+'</p></div>';	
		
		html += '<div class="wm_slideRowTitle">礼物</div>';
		html += '<div class="wm_otherBar"><div class="dsObjMain">';
		
		var strShow1 = '';

		var dsVal0 = '',dsVal1 = '',dsVal2 = '',_first = '';
		for(var i in newDs){
			var ii = parseInt(i);
			if(newDs[i].check==1){
				if(ii==35){
					_first += '<a class="oneDsObj" data-num="0" data-tid="'+i+'" data-price="'+newDs[i].price+'"><span class="oneDsObjSpan"><span class="'+newDs[i].iconName+'"></span></span><tt class="ellipsis">'+newDs[i].name+'</tt><i class="oneDsObjNum"></i></a>';
				}else if(ii==34){
					dsVal0 += '<a class="oneDsObj" data-num="0" data-tid="'+i+'" data-price="'+newDs[i].price+'"><span class="oneDsObjSpan"><span class="'+newDs[i].iconName+'"></span></span><tt class="ellipsis">'+newDs[i].name+'</tt><i class="oneDsObjNum"></i></a>';
				}else{
					if(ii>=30){
						dsVal1 += '<a class="oneDsObj" data-num="0" data-tid="'+i+'" data-price="'+newDs[i].price+'"><span class="oneDsObjSpan"><span class="'+newDs[i].iconName+'"></span></span><tt class="ellipsis">'+newDs[i].name+'</tt><i class="oneDsObjNum"></i></a>';
					}else{
						if(ii>=12)
							dsVal2 += '<a class="oneDsObj" data-num="0" data-tid="'+i+'" data-price="'+newDs[i].price+'"><span class="oneDsObjSpan"><span class="'+newDs[i].iconName+'"></span></span><tt class="ellipsis">'+newDs[i].name+'</tt><i class="oneDsObjNum"></i></a>';	
					}
				}
			}	
		}
		strShow1 = _first+dsVal0+dsVal1+dsVal2;

		if(strShow1=='')
			strShow1 = '<div class="notValue">没有可用的礼物</div>';
		else
			strShow1 = '<div class="dsObjBox dsObjBox2">'+strShow1+'</div>';
		html += strShow1;
		
		html += '</div></div>';
		
		html += '<div style="margin-top:12px" id="dsWordBox"><input type="text" class="inputNormal" id="dsWord" maxlength="60" placeholder="请输入留言，30字以内" style="font-size:13px; text-indent:14px; box-sizing:border-box; height:40px; line-height:41px; padding:0px" /></div>';
		
		if(screenOpen=='true')	
			html += '<a class="isShowToPc sel"><i class="icon_gift_select"></i>在大屏幕上显示</a>';
		
		html += setMoney.create(my.redBagMoney,my.cash,true,null,false);
		var btnText = '购买礼物';
		var dsNum = 1;
		WM.Phone.get({
			type:'slideBox',
			title:'送礼物',
			html:html,
			btnText:btnText,
			ready:function(){
				var t = this;
				this.find('.oneDsObj').bind('click',function(){
					if($(this.parentNode).hasClass('dsObjBox2')){
						if(!$(this).hasClass('sel'))
							$(this.parentNode).find('.oneDsObj').removeClass('sel').attr({'data-num':0});
						dsNum = parseInt($(this).attr('data-num'));
						dsNum = dsNum<0?0:dsNum;
						dsNum++;
						dsNum = dsNum>99?99:dsNum;
						$(this).addClass('sel').attr({'data-num':dsNum}).find('.oneDsObjNum').html(dsNum);
						var money = $.trim($(this).attr('data-price'))*dsNum;
						setMoney.math(my.redBagMoney,my.cash,true,money,my.isAdmin&&my.free>0);
					}else{
						if($(this).hasClass('sel'))
							return;
						$(this.parentNode).find('.sel').removeClass('sel');
						$(this).addClass('sel');
					}
				});
				setMoney.checked(my.redBagMoney,my.cash,true,'ds');
				this.find('.isShowToPc').bind('click',function(){
					if($(this).hasClass('sel'))
						return $(this).removeClass('sel');
					$(this).addClass('sel');			
				});
			},
			click:function(){
				var userId = null;
				userId = other.userId;
				var giftId = this.find('.dsObjBox2 .sel').attr('data-tid');
				if(giftId==null)
					return showInfo('请选择礼物',false,{top:'86%'});
				var txt = '';
				//普通礼物 文字检测
				if(!this.find('.dsObjBox2 .sel').hasClass('comboGift')){
					txt = $.trim($('#dsWord').val());
					var _len = getTextLength(txt);
					if(_len>30)
						return showInfo('留言不能超过30字',false,{top:'86%'});
					//系统检测
					if(!keyWord.check(txt))
						return showInfo('请勿发布广告等不适内容',false,{top:'86%'});
					//转义
					txt = txt.replace(/</g,'&lt;');
					txt = txt.replace(/>/g,'&gt;');
					//敏感词
					txt = keyWord.replace(txt);
				}
				var btn = this.getButton()[0];
				WM.Phone.setButton(btn,false);
				this.cover(true);
				var t = this;
				var moneyMsg = setMoney.getMsg();
				var isShowToPc = false;
				if($('.isShowToPc').length>0)
					isShowToPc = $('.isShowToPc').hasClass('sel');
				dsNum = dsNum<1?1:dsNum;
				dsNum = dsNum>99?99:dsNum;
				ajax_ds('',userId,txt,giftId,isShowToPc,moneyMsg.type,dsNum,function(url,waitNum){
					if(moneyMsg.bool){
						return window.location.href = url;
					}

					waitNum = (waitNum==null||waitNum.length==0)?0:parseInt(waitNum);
					var _price = $('#price').html();
					WM.Phone.get({
						type:'confirm',
						title:'支付确认',
						innerHTML:(waitNum>3?'当前排队'+waitNum+'人，':'')+'确定支付 '+moneyMsg.price+'?',
						click:function(bb){
							this.close();
							if(!bb){
								t.cover(false);
								return WM.Phone.setButton(btn,true);
							}
							window.location.href = url;
						}
					});	
				},function(errorMsg){
					t.cover(false);
					WM.Phone.setButton(btn,true);
					showInfo(errorMsg||'操作失败',false,{top:'86%'});
				});
			}		
		});
	},
	dsToUser:function(e){
		this.show(e,true);
	},
	math:function(e){
		var newPrice = $(e.parentNode).find('.sel').attr('data-price');
		newPrice = parseFloat(newPrice);
		price = newPrice-my.redBagMoney;
		this.isFull = price<=0?true:false;
		var dVal = price<0?newPrice:my.redBagMoney;
		if(dVal>0)
			$('#delMoney').html('-'+dVal.toFixed(2));
		price = price<0?0:price.toFixed(2);
		//price = $(e.parentNode).find('.sel').attr('data-price');
		$('#price').html('￥'+parseFloat(price).toFixed(2));		
	}
}

var coefficient = 10;
var setMoney = {
    create:function(m1,m2,bool,money,isAdmin){
        // m1--代金券 m2--现金余额 bool true--可用m1、m2 false--只可用m2 isAdmin true--是管理员 false--非管理员
        money = money==null?'0':parseFloat(money).toFixed(2);
        var html = '';
        if(isAdmin){
            html += '<div id="priceBox" data-type="3" type="3" style="display:none;">';
            html += '<div class="lineDiv">需微信支付</div>';
            html += '<div class="lineDiv" id="price">￥0</div>';
            html += '</div>';
        }else{
            var msg = setMoney.get(m1,m2,bool);
            if(msg.money>0){
                html += '<div id="priceBox" data-type="'+msg.type+'" type="3">';
                html += '<div class="myRedBagBox">';
                html += '<div class="myRedBagTxt isChecked">';
                html += '<span class="myCheckBlack"></span>';
                if(msg.type=='1')
                    html += '<span class="myCheckText">'+msg.name+'：'+msg.money+'</span>';
                else if(msg.type=='2')
                    html += '<span class="myCheckText">'+msg.name+'：￥'+msg.money+'</span>';
                html += '</div>';
                html += '<div class="myRedBagTxt" id="delMoney"></div>';
                html += '</div>';
                html += '<div class="lineDiv">需微信支付</div>';
                html += '<div class="lineDiv" id="price">￥'+money+'</div>';
                html += '</div>';
            }else{
                html += '<div id="priceBox" data-type="3" type="3">';
                html += '<div class="lineDiv">需微信支付</div>';
                html += '<div class="lineDiv" id="price">￥'+money+'</div></div>';
            }
        }
        return html;
    },
    get:function(m1,m2,bool){
        // m1--代金券 m2--现金余额 bool true--可用m1、m2 false--只可用m2;
        var strName='',strMoney='',type='';
        if(bool){
            strName = m1>0?'我的喵币':'现金余额';
            strMoney = m1>0?parseFloat(m1*coefficient).toFixed(1):parseFloat(m2).toFixed(2);
            type = m1>0?'1':'2';
        }else{
            strName = '现金余额';
            strMoney = parseFloat(m2).toFixed(2);
            type = '2';
        }
        return {
            name:strName,
            money:strMoney,
            type:type
        }
    },
    math:function(m1,m2,bool,money){
        var msg = setMoney.get(m1,m2,bool);
        if(msg.money<=0||!$('#priceBox').hasClass('moneyChecked')){
            if(parseFloat(money)<=0){
                $('#price').html('￥0');
            }else{
                $('#price').html('￥'+parseFloat(money).toFixed(2));
            }
            $('#delMoney').html('');
            return false
        }
        var bl;
        if(msg.type=='1')
            bl = parseFloat(msg.money)>parseFloat(money*coefficient);
        else if(msg.type=='2')
            bl = parseFloat(msg.money)>parseFloat(money);
        if(bl){
            var _p = parseFloat(money);
            if(msg.type=='1'){
                _p = _p<=0?'':'-'+parseFloat(money*coefficient).toFixed(1);
            }else if(msg.type=='2'){
                _p = _p<=0?'':'-'+parseFloat(money).toFixed(2);
            }
            $('#delMoney').html(_p);
            $('#price').html('￥0');
        }else{
            var newPrice;
            if(msg.type=='1'){
                newPrice = (msg.money/coefficient)-money;
            }else if(msg.type=='2'){
                newPrice = msg.money-money;
            }
            $('#delMoney').html('-'+msg.money);
            $('#price').html('￥'+parseFloat(Math.abs(newPrice)).toFixed(2));
        }
    },
    checked:function(m1,m2,bool,type){
        var money = 0;
        var type2 = $('#priceBox').attr('data-type');
        $('.isChecked').on('click',function(){
            switch(type){
                case 'song':  // 点歌
                    money = $.trim($('.listChecked').attr('price'));
                    break;
                case 'bp':   // 霸屏
                    var price = $.trim($('.oneBpTime.sel').attr('data-price'));
                    var repeat = $.trim($('#bpText1').attr('data-num'));
                    money = price*repeat;
                    break;
                case 'ds':  // 打赏
                    money = $.trim($('.dsObjBox2').find('.oneDsObj.sel').attr('data-price'));
					var dsNum = $.trim($('.dsObjBox2').find('.oneDsObj.sel').attr('data-num'));
					money *= dsNum;
                    break;
                case 'hb':  // 红包
                    money = $.trim($('#rgMoney').val());
                    break;
                case 'cake':  // 生日蛋糕
                    money = giftData.normal['cake'].price;
                    break;
                default:
                    money = 0;
                    break;
            }
            money = money==''||money==null||typeof money=='undefined'?0:money;
            var parent = $(this).parents('#priceBox');
            if($(parent).hasClass('moneyChecked')){
                $(parent).removeClass('moneyChecked');
                $('#delMoney').html('');
                if(money<=0){
                    $('#price').html('￥0');
                }else{
                    $('#price').html('￥'+parseFloat(money).toFixed(2));
                }
                $('#priceBox').attr('type','3');
            }else{
                $(parent).addClass('moneyChecked');
                setMoney.math(m1,m2,bool,money);
                $('#priceBox').attr('type',type2);
            }
        })
    },
    getMsg:function(){
        var elPrice = $('#price');
        var price = $(elPrice).html();
        var bool = $.trim(($(elPrice).html()).replace('￥',''))<=0;
        var type = $('#priceBox').attr('type');
        return {
            price:price,
            bool:bool,
            type:type
        }
    }
};


$(function(){
	setInput();	
})

