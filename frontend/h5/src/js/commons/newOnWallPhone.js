//排序
var px = function(list,parent){
	return;
	newSitData = [];
	var change = function(code){
		var arr = big;
		var reg = /^[A-Za-z]+$/;
		if(reg.test(code))
			code = code.toUpperCase();
		for(var i=0;i<big.length;i++){
			if(big[i]==code){
				var n = i;
				return n<10?'0'+n:n; 
			}
		}
		return '00';
	}
	var big = '0 1 2 3 4 5 6 7 8 9 A B C D E F G H I J K L M N O P Q R S T U V W X Y Z';
	big = big.split(' ');
	var reg= /^[A-Za-z0-9]+$/;
	var newArray = [],newList = [];
	for(var i in allSit){
		var one = $.trim(allSit[i]);
		var end = '';
		var len = 5-one.length;
		for(var k=0;k<len;k++)
			end += '00';
		var newOne = '';
		for(var x=0;x<one.length;x++){
			if(reg.test(one[x]))
				newOne += change(one[x]);
			else
				newOne += '37';	
		}
		newOne = newOne.substring(0,newOne.length-1)+end+newOne[newOne.length-1];
		//newOne += end;
		newOne = parseInt(newOne);
		//newList.push(newOne);
		newArray.push({
			tid:i,
			span:$.trim(allSit[i]),
			val:newOne,
			sel:false
		});
	}

	if(newArray.length==0){
		$('.forAction a.footTable').addClass('disabled');
		return;
	}

	newArray.sort(function(n1,n2){
		if(n1.val<n2.val)
			return -1;
		if(n1.val>n2.val)
			return 1;
		else
			return 0;
	})
	for(var y=0;y<newArray.length;y++){
		newSitData.push([newArray[y].tid,newArray[y].span]);
	}
}

var toBottom = function(bool,h2){
	h2 = h2==null?$('body')[0].scrollHeight:h2;
	if(bool){
		var h1 = $(window).height();
		var h3 = $(window).scrollTop();
		if(h1+h3>=h2-300)
			$('body').scrollTop($('body')[0].scrollHeight);	
		return;	
	}
	$('body').scrollTop($('body')[0].scrollHeight);		
}

//随机数
var getRandom = function(begin,end){
	return parseInt(Math.random()*((end>begin?end-begin:begin-end)+1)+(end>begin?begin:end));
}

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
		var u = navigator.userAgent;
    	var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
    	//var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
        var isiOS =/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)
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
			if(isiOS)
				$('.newWallHead').hide();
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

//加载更多
var loading = {
	hasMore:true,
	loading:false,
	pageCount:10,
	nowPage:1,
	top:0,
	createAdvert:function(){
		return '';
		if(this.list.length==0)
			return '';
		var one = this.list[getRandom(0,this.list.length-1)];
		var obj = {
			msg:$.trim($('#'+one.id).html())		
		};
		obj.msg += '<img onclick="onWall.showImage(this)" class="advert" bigSrc="'+one.src+'" src="'+one.src+'" onload="onWall.setMargin(this)" onerror="onWall.setMargin(this)" />';
		obj.head = advertSrc;
		return createOne('advert',obj);	
	},
	create:function(data){
		if($('.row[tid="'+data.tid+'"]').length>0)
			return '';
		var one = {};
		WM.Phone.extend(one,data,true);
		//text:文字 image news interact
		if(data.msgType=='interact'){
			one.interactName = data.userName;
			return createInteract(one);
		}
		one.msg = control.replaceText(one.msg);

		//isRich 是否霸屏消息
		var isRich = data.msgType=='bp'?true:false;

		if(one.userId==my.userId)
			return createOne('myMsg',one,false,isRich);
		else
			return createOne((my.isAdmin&&my.adminDel)?'otherMsgForAdmin':'otherMsg',one,false,isRich);
	},
	init:function(){
		this.list = [];
		if(typeof advertData!='undefined'&&advertData!=null){
			for(var x=0;x<advertData.length;x++){
				this.list.push({
					id:advertData[x].id,
					src:advertData[x].src
				});	
			}
		}
		if($('.onWallMain .row').length<this.pageCount)
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
			var n = 0;
			if(data!=null&&data.length>0){
				if(loading.nowPage==3&&data.length<3){
					html += loading.createAdvert();	
				}
				for(var x=data.length-1;x>=0;x--){
					n++;
					if(loading.nowPage==3&&n+2==data.length&&data.length>=3){
						html += loading.createAdvert();	
					}
					html += loading.create(data[x]);
					if(x==0)
						lastTime = data[x]._time;		
				}
				if(data.length<loading.pageCount)
					loading.hasMore = false;	
			}
			if(html==''){
				loading.hasMore = false;
				$('.loadMore tt').html('没有更多了');
				$('.loadMore').removeClass('animate');
				loading.loading = false;	
			}
			else{
				onLoadMore(data,function(){		
					$(html).insertAfter($('#first'));
					setTimeout(function(){
						if(loading.hasMore)	
							$('.loadMore').hide();
						else
							$('.loadMore tt').html('没有更多了'),$('.loadMore').removeClass('animate');
						loading.loading = false;
						$(window).scrollTop(document.body.offsetHeight-$(window).height()-loading.top);		
					},1);	
				});
			}
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
				for(var x=data.length-1;x>=0;x--){
					html += loading.create(data[x]);
					if(x==0)
						lastTime = data[x]._time;	
				}
				if(data.length<loading.pageCount)
					loading.hasMore = false;	
			}else{
				loading.hasMore = false;	
			}
			onLoadMore(data,function(){
				if($('.onWallMain .row').length>0){
					$(html).insertBefore($('.onWallMain .row')[0]);		
				}else
					$(html).appendTo($('.onWallMain'));	
				loading.loading = false;
				if(callback)
					callback();	
			});
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

var onLoadMore = function(data,fn){
	return fn();
	var imgList = [];
	for(var x=0;x<data.length;x++){
		if(data[x].normalSrc!=null&&data[x].normalSrc.length>0)
			imgList.push(data[x].normalSrc);	
	}
	if(imgList.length==0)
		return fn();
	var index = 0;
	var len = imgList.length;
	for(var y=0;y<len;y++){
		var img = new Image();
		img.onload = img.onerror = function(){
			index++;
			this.onload = this.onerror = null;
			if(index==len)
				fn();			
		}
		img.src = imgList[y];
	}
}


//普通消息上传图片
var upload = {
	start:function(){
		$('#txt').addClass('hasImage');
		$('.afterUpload').remove();
		$('<a class="afterUpload" onclick="upload.del(this)"><tt class="onloading"></tt><tt class="slideClose"></tt></a>').appendTo($('.newFoot-inputBox'));
	},
	done:function(src,cimgurl,bigSrc){
		$('#upload')[0].outerHTML = '<input id="upload" accept="image/*" class="file" type="file" onchange="imageUpLoad(this)">';
		$('.afterUpload').html('<img class="img" src="'+src+'" bigSrc="'+bigSrc+'" cimgurl="'+cimgurl+'" /><tt class="slideClose"></tt>');	
	},
	error:function(errorMsg){
		showInfo(errorMsg||'上传失败',false);
		$('#txt').removeClass('hasImage');
		$('.afterUpload').remove();
		$('#upload')[0].outerHTML = '<input id="upload" accept="image/*" class="file" type="file" onchange="imageUpLoad(this)">';
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

//上墙操作
var onWall = {
	submit:function(e){
		if($(e).hasClass('disabled'))
			return false;
		$('#txt').blur();
		var txt = $.trim($('#txt').val());
		txt = txt.replace(/</g,'&lt;');
		txt = txt.replace(/>/g,'&gt;');
		var img = $('.afterUpload .img');
		if(txt.length==0&&img.length==0)
			return showInfo('请输入上墙内容或者上传图片',false);
		if(img.length>0&&($(img).attr('bigSrc')=='undefined'||$(img).attr('bigSrc')==undefined))
			return showInfo('您上传的图片不可用，请重新上传');
		var imgSrc = img.length>0?$(img).attr('src'):null;
		var bigSrc = img.length>0?$(img).attr('bigSrc'):null;
		var cimgurl = img.length>0?$(img).attr('cimgurl'):null;
		//系统词语检测
		if(!keyWord.check(txt))
			return showInfo('请勿发布广告等不适内容',false);
		$(e).addClass('disabled');
		//敏感词
		txt = keyWord.replace(txt);
		ajax_submit(txt,bigSrc,function(tid,time,text,isCheck){
			upload.clear();
			checkNull();
			onWall.count(10,function(){
				$(e).removeClass('disabled');
				$(e).html('<i class="newIc-submit"></i>');
				//WM.Phone._setButton(e,true);	
			});
			var val = control.replaceText(text);
			$('#txt').val('');
			upload.clear();
			onWall.closeMenu();
			var msgType = 'text',message = txt;
			if(txt.length>0&&bigSrc!=null)
				msgType = 'news';
			else if(txt.length==0){
				msgType = 'image';
				message = bigSrc;
			}
			sendMsg({
				type:msgType,
				id:tid,
				timeStr:time,
				simgurl:imgSrc,
				cimgurl:cimgurl,
				imgurl:bigSrc,
				message:message,
				msg:text,
				isCheck:isCheck
			});
			if(isCheck=='false'||isCheck==false){
				//onWall.add(tid,time,val,src,bigSrc);
			}
		},function(errorMsg){
			$(e).removeClass('disabled');
			showInfo(errorMsg||'上墙失败',false);
		});	
		return false;	
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
			'bigSrc':bigSrc,
			'grade':my.grade
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
		var able = true;
		WM.Phone.get({
			type:'confirm',
			title:'拉黑',
			btnText:['取消','拉黑三天','永久拉黑'],
			innerHTML:'确定将此用户拉入黑名单？',
			click:function(b,btn,btnIndex){
				if(!b)
					return this.close();
				if(!able)
					return;
				var parent = e.parentNode.parentNode.parentNode;
				var userId = $(parent).attr('userId');
				var t = this;
				WM.Phone.setButton(btn,false);
				able = false;
				ajax_black(userId,btnIndex,function(){
					t.close();
				},function(errorMsg){
					able = true;
					WM.Phone.setButton(t.getButton()[1],true);
					showInfo(errorMsg||'操作失败',false);
				});
			}
		})		
	},
	del:function(e){
		WM.Phone.get({
			type:'confirm',
			title:'删除',
			innerHTML:'确定删除此上墙内容？',
			click:function(b){
				if(!b)
					return this.close();
				var parent = e.parentNode.parentNode.parentNode;
				var tid = $(parent).attr('tid');
				var userId = $(parent).attr('userid');
				if(userId=='wemewSystem'){
					$(parent).remove();
					this.close();
				}
				var t = this;
				WM.Phone.setButton(this.getButton()[1],false);
				ajax_del(tid,false,function(){
					$(parent).remove();	
					t.close();
					checkNull();
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
		return;
		$('.forAction').addClass('hide');
		$('.allFace').addClass('hide');
		$('.faceCover').hide();
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
	},
	setRefresh:function(delay){
		setTimeout(function(){
			ajax_refresh(function(dt){
				var html = '';
				if(dt!=null&&dt.length>0){
					checkNull();
					for(var x=dt.length-1;x>=0;x--){
						html += onWall.addNew(dt[x]);
						if(x==0)
							timeStr = dt[x].time;	
					}
				}
				$(html).appendTo($('.onWallMain'));
				onWallScroll.down();
			});	
			setTimeout(arguments.callee,delay||8000);
		},delay||8000);
	},
	addNew:function(dt){
		if($('.row[tid="'+dt.tid+'"]').length>0){
			return '';
		}	
		if(dt.msgType=='interact'){
			dt.interactName = dt.userName;
			return createInteract(dt);
		}
		if(dt.msgType=='redBag'){
			return createOne('redBagModel',dt,dt.userId==my.userId,false);

		}
		dt.msg = control.replaceText(dt.msg);
		//isRich 是否霸屏消息
		var isRich = dt.msgType=='bp'?true:false;
		if(dt.userId==my.userId)
			return createOne('myMsg',dt,true,isRich);
		else
			return createOne((my.isAdmin&&my.adminDel)?'otherMsgForAdmin':'otherMsg',dt,false,isRich);
	},
	toApply:function(e){
		WM.Phone.get({
			type:'confirm',
			title:'通过审核',
			innerHTML:'确定通过审核？',
			click:function(b){
				if(!b)
					return this.close();
				var parent = e.parentNode.parentNode.parentNode;
				var tid = $(parent).attr('tid');
				var t = this;
				WM.Phone.setButton(this.getButton()[1],false);
				ajax_apply(tid,function(msgData){
					$(parent).remove();	
					t.close();
					//接收消息推送
					sendMsg(msgData,false);
				},function(errorMsg){
					WM.Phone.setButton(t.getButton()[1],true);
					showInfo(errorMsg||'删除失败',false);
				});
			}
		});			
	},
    onceBP:function(e){
        WM.Phone.get({
            type:'confirm',
            title:'再霸一次',
            innerHTML:'请确保大屏幕处于开启状态，每条霸屏消息管理员只能再次霸屏一次',
            click:function(b){
                if(!b)
                    return this.close();
                var parent = e.parentNode.parentNode.parentNode;
                var tid = $(parent).attr('tid');
                var t = this;
                WM.Phone.setButton(this.getButton()[1],false);
                ajax_onceBP(tid,function(msgData){
                    t.close();
                },function(errorMsg){
                    WM.Phone.setButton(t.getButton()[1],true);
                    showInfo(errorMsg||'操作失败',false);
                });
            }
        });
    }
}

//聊天界面
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
				if(maxLen<=1){
					$('#userTipIndex').html('');
					return;
				}
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
		if($(e).attr('userId')=='wemewSystem')
			return;
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
        var gradeColor= $(e).attr('gradeColor')||'';
        var gradeName= $(e).attr('gradeName')||'';
        var userheade =$(e).attr('userheade')||'';
        var gradeclass =$(e).attr('gradeclass')||'';
        var gradeImg =$(e).attr('gradeImg')||'';
		if($('.userBox>.Phone_loading').length==0){
			var loading = WM.Phone.loading.getHtml();
			$(loading).appendTo($('.userBox'));
		}else
			$('.userBox>.Phone_loading').show();
		var imgHtml = '<div class="swiper-container" id="swiper-container1"><div class="swiper-wrapper">';
		imgHtml += this.create(src,true);
		imgHtml += '</div><div class="swiper-pagination" id="swiper-pagination1" style="position:absolute; bottom:10px;">&nbsp;</div></div>';
		$('.userBoxAllBg').html(imgHtml);
        $('.userInfo .grade_change').html('');
        $('.userInfo .grade_change').append('<img src='+userheade+' class="cy_userH" width="40px"/>');
        $('.userInfo .grade_change').append('<img src='+gradeImg+' class="cy_gradeH '+gradeclass+'" width="50px"/>');
        if(gradeColor!='qt_color'&&gradeName!=null&&gradeName!='')
            $('.userInfo .grade_change').append('<p class='+gradeColor+'>'+gradeName+'</p>');
		$('.userInfo .p1').html(name+'<span class="'+sex+'">'+(sex=='woman'?'女士':'男士')+'</span>');
		var html = '';
		// html+='<p class="p1">'+name+'<span class="'+sex+'">'+(sex=='woman'?'女士':'男士')+'</span>'</p>'
		if(age!=null&&age!='')
			html += '<span>'+age+'岁&nbsp;&nbsp;/&nbsp;&nbsp;</span>';
		if(cm!=null&&cm!='')
			html += '<span>'+cm+'Cm&nbsp;&nbsp;/&nbsp;&nbsp;</span>';
		if(kg!=null&&kg!='')
			html += '<span>'+kg+'Kg&nbsp;&nbsp;/&nbsp;&nbsp;</span>';
		if(job!=null&&job!='')
			html += '<span>'+job+'</span>';
		if(my.scopeLevel<13){
            html+='<a href="/cwechat/toBuyLevelHome?barid=${barid}" class="iWant">我要升级</a>'
		}
		$('.userInfo .p2').html(html+'<p style="clear:both"></p>');
		txt = txt||'';
		$('.userInfo .p3').html(txt);
		if(my.userId==tid){
			$('.userInfo .aBox').html('<div><a href="'+href+'" class="only">编辑资料</a></div>');
		}else{
			if(typeof isshutup!='undefined'&&!isshutup)
				_html = '<div><a href="'+href+'">私信</a></div><div><a onclick="ds.dsToUser(this)">送礼物</a></div>';
			else
				_html = '<div><a onclick="ds.dsToUser(this)" class="only">送礼物</a></div>';
			/*
			if(typeof isDsToUser!='undefined'&&isDsToUser)
				_html = '<div><a href="'+href+'">私信</a></div><div><a onclick="ds.dsToUser(this)">送礼物</a></div>';
			*/
			$('.userInfo .aBox').html(_html);
			if(!$(e).hasClass('richerBox'))
				$('.userInfo a').eq(1).attr({src:$(e).find('img').attr('src')});
			else
				$('.userInfo a').eq(1).attr({src:$(e).attr('src')});
			$('.userInfo a').eq(1).attr({tid:tid});
			$('.userInfo a').eq(1).attr({userName:name});
		}
		$('.userBox').show();
		//$('#swiper-pagination1').css({bottom:$('.userInfo')[0].offsetHeight+40})
		
		var t = this;
		ajax_getUserImage(tid,barbaseId,function(imageData){
			active.imageData = t.setDt(imageData);
			active.set('ajaxLoad');
		},function(){
			active.imageData = [];
			active.set('ajaxLoad');
		});
	},
	setDt:function(dt){
		var newArr = [];
		for(var x=0;x<dt.length;x++){
			var e = dt[x];
			if(e.split(',').length>1){
				var splitSrc = e.split(',');
				for(var k=0;k<splitSrc.length;k++){
					newArr.push(splitSrc[k]);		
				}
			}else
				newArr.push(e);
		}
		return newArr;
	}
}

//地理位置
var address = {
	isIn:null,
	getLocation:function(){
		if(navigator.geolocation){
			navigator.geolocation.getCurrentPosition(address.showMap,address.err,{timeout:4000,maximumAge:30000});
		}else{
			address.callback(false);
		}	
	},
	showMap:function(value){
		var lng = value.coords.longitude;
		var lat = value.coords.latitude;
		ajax_map(lat,lng,function(b){
			address.callback(b);	
		});
	},
	err:function(){
		address.isIn = false;
	},
	callback:function(bool){
		address.isIn = bool;
	}
}

//打赏JS
var ds = {
	isFull:false,
	show:function(e,toUser){
		toUser = toUser==null?false:toUser;
		this.isFull = false;
		if(!toUser){
			if($(e).hasClass('disabled')||$('.wemewPhoneDs').hasClass('disabled'))
				return showInfo('大屏幕未开启，不能打赏',false);
		}
		var html = '<div class="wm_slideRowTitle">艺人</div>';
		html += '<div class="wm_otherBar"><div class="dsObjMain">';
		var strShow = '';
		for(var i in giftData.show){
			strShow += '<a class="oneDsObj" data-tid="'+i+'"><span class="oneDsObjSpan"><img src="'+giftData.show[i].src+'" /></span><tt class="ellipsis">'+giftData.show[i].name+'</tt><i class="icon_gift_select"></i></a>';		
		}
		if(strShow=='')
			strShow = '<div class="notValue">没有可打赏的艺人</div>';
		else
			strShow = '<div class="dsObjBox dsObjBox1">'+strShow+'</div>';
		html += strShow;
		html += '</div></div>';
		if(toUser){
			var src = $(e).attr('src');
			var userName = $(e).attr('userName');
			html = '<div style="text-align:center"><img src="'+src+'" style="border-radius:4px; width:60px; height:60px" /><p style="margin-top:5px;">'+userName+'</p></div>';	
		}
		
		html += '<div class="wm_slideRowTitle">礼物</div>';
		html += '<div class="wm_otherBar"><div class="dsObjMain">';
		
		var strShow1 = '';
		
		var dsVal0 = '',dsVal1 = '',dsVal2 = '',_first = '';
		for(var i in giftData.newDs){
			var ii = parseInt(i);
			if(giftData.newDs[i].check==1){
				if(ii==35){
					_first += '<a class="oneDsObj" data-num="0" data-tid="'+i+'" data-price="'+giftData.newDs[i].price+'"><span class="oneDsObjSpan"><span class="'+giftData.newDs[i].iconName+'"></span></span><tt class="ellipsis">'+giftData.newDs[i].name+'</tt><i class="oneDsObjNum"></i></a>';
				}else if(ii==34){
					dsVal0 += '<a class="oneDsObj" data-num="0" data-tid="'+i+'" data-price="'+giftData.newDs[i].price+'"><span class="oneDsObjSpan"><span class="'+giftData.newDs[i].iconName+'"></span></span><tt class="ellipsis">'+giftData.newDs[i].name+'</tt><i class="oneDsObjNum"></i></a>';
				}else{
					if(ii>=30){
						dsVal1 += '<a class="oneDsObj" data-num="0" data-tid="'+i+'" data-price="'+giftData.newDs[i].price+'"><span class="oneDsObjSpan"><span class="'+giftData.newDs[i].iconName+'"></span></span><tt class="ellipsis">'+giftData.newDs[i].name+'</tt><i class="oneDsObjNum"></i></a>';
					}else{
						if(ii>=12)
							dsVal2 += '<a class="oneDsObj" data-num="0" data-tid="'+i+'" data-price="'+giftData.newDs[i].price+'"><span class="oneDsObjSpan"><span class="'+giftData.newDs[i].iconName+'"></span></span><tt class="ellipsis">'+giftData.newDs[i].name+'</tt><i class="oneDsObjNum"></i></a>';	
					}
				}
			}	
		}
		strShow1 = _first+dsVal0+dsVal1+dsVal2;

		if(strShow1=='')
			strShow1 = '<div class="notValue">没有可打赏的礼物</div>';
		else
			strShow1 = '<div class="dsObjBox dsObjBox2">'+strShow1+'</div>';
		html += strShow1;
		
		html += '</div></div>';
		
		var plaVal = '请输入打赏上墙语，30字以内';
		if(toUser)
			plaVal = '留言';
		html += '<div style="margin-top:12px" id="dsWordBox"><input type="text" class="inputNormal" id="dsWord" maxlength="60" placeholder="'+plaVal+'" style="font-size:13px; text-indent:14px; box-sizing:border-box; height:40px; line-height:41px; padding:0px" /></div>';
		
		if(toUser){
			if(!$('.wemewPhoneBp').hasClass('disabled'))
				html += '<a class="isShowToPc sel"><i class="icon_gift_select"></i>在大屏幕上显示</a>';	
		}
		
		var _b = my.isAdmin&&my.free>0;
		if(toUser)
			_b = false;
		html += setMoney.create(my.redBagMoney,my.cash,true,null,_b);
		var btnText = (my.isAdmin&&my.free>0)?'免费打赏<tt class="litFont">今日剩余'+my.free+'次</tt>':'购买打赏';
		if(toUser){
			btnText = '购买礼物';
			//btnText = (my.isAdmin&&my.free>0)?'免费送礼<tt class="litFont">今日剩余'+my.free+'次</tt>':'购买礼物';	
		}
		var dsNum = 1;
		WM.Phone.get({
			type:'slideBox',
			title:toUser?'送礼物':'打赏',
			html:html,
			btnText:btnText,
			ready:function(){
				var t = this;
				//this.find('.dsObjBox1').css({});
				this.find('.oneDsObj').bind('click',function(){
					if($(this.parentNode).hasClass('dsObjBox2')){
						if(!$(this).hasClass('sel'))
							$(this.parentNode).find('.oneDsObj').removeClass('sel').attr({'data-num':0});
						dsNum = parseInt($(this).attr('data-num'));
						dsNum = dsNum<0?0:dsNum;
						
						dsNum++;
						dsNum = dsNum>99?99:dsNum;
						if(my.isAdmin&&my.free>0&&!toUser){
							if(dsNum>1)
								showInfo('管理员每次只能打赏1个礼物',false);
							dsNum = 1;
						}
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
				var showId = null;
				if(toUser)
					showId = $(e).attr('tid');
				else
					showId = this.find('.dsObjBox1 .sel').attr('data-tid');
				if(showId==null)
					return showInfo('请选择打赏的艺人',false,{top:'86%'});
				var giftId = this.find('.dsObjBox2 .sel').attr('data-tid');
				if(giftId==null){
					return showInfo('请选择礼物',false,{top:'86%'});
				}
				var txt = '';
				//普通礼物 文字检测
				if(!this.find('.dsObjBox2 .sel').hasClass('comboGift')){
					txt = $.trim($('#dsWord').val());
					var _len = getTextLength(txt);
					if(_len>30){
						return showInfo((toUser?'留言':'上墙语')+'不能超过30字',false,{top:'86%'});
					}
					//系统检测
					if(!keyWord.check(txt))
						return showInfo('请勿发布广告等不适内容',false,{top:'86%'});
					//转义
					txt = txt.replace(/</g,'&lt;');
					txt = txt.replace(/>/g,'&gt;');
					//敏感词
					txt = keyWord.replace(txt);
				}
				var moneyMsg = setMoney.getMsg();
				var btn = this.getButton()[0];
				WM.Phone.setButton(btn,false);
				this.cover(true);
				var t = this;
				var userId = '';
				var isShowToPc;
				if(toUser){
					userId = showId;
					showId = '';
				}
				if($('.isShowToPc').length>0)
					isShowToPc = $('.isShowToPc').hasClass('sel');
				else{
					if(toUser)
						isShowToPc = false;
					else
						isShowToPc = true;	
				}
				dsNum = dsNum<1?1:dsNum;
				dsNum = dsNum>99?99:dsNum;
				if(my.isAdmin&&my.free>0&&!toUser)
					dsNum = 1;
				var jsonData = {
					showId:showId,userId:userId,txt:txt,giftId:giftId,isShowPc:isShowToPc,type:moneyMsg.type,dsNum:dsNum,
					source:3,barId:barbaseId
				}
				ajax_ds(jsonData,function(url,waitNum){
					if(!toUser){
						if(my.isAdmin&&my.free>dsNum||moneyMsg.bool){
							return window.location.href = url;	
						}
					}else{
						if(moneyMsg.bool){
							return window.location.href = url;
						}
					}
					/*
					if((my.isAdmin&&my.free>0)||moneyMsg.bool){
						window.location.href = url;
						ajax_dsPay(url,function(toPay){
							if(toPay){
								window.location.href = url;
								return;	
							}
							if(my.isAdmin&&my.freeDs>0)
								my.freeDs = my.freeDs-1;
							else if(moneyMsg.bool){
								var _money = t.find('.dsObjBox2 .oneDsObj.sel').attr('data-price');
								_money = parseFloat(_money);
								if(moneyMsg.type==1){
									my.redBagMoney -= _money;	
								}else if(moneyMsg.type==2){
									my.cash -= _money;
								}	
							}
							t.cover(false);
							t.close();
							showInfo('打赏成功');				
						},function(errorMsg){
							t.cover(false);
							WM.Phone.setButton(btn,true);
							showInfo(errorMsg||'操作失败',false);
						});
						return;
					}
					*/
					waitNum = (waitNum==null||waitNum.length==0)?0:parseInt(waitNum);
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
		if(my.isAdmin&&my.free>0){
			
		}else{
			if(isOpenRedBag){
				var newPrice = $(e.parentNode).find('.sel').attr('data-price');
				newPrice = parseFloat(newPrice);
				price = newPrice-my.redBagMoney;
				this.isFull = price<=0?true:false;
				var dVal = price<0?newPrice:my.redBagMoney;
				if(dVal>0)
					$('#delMoney').html('-'+dVal.toFixed(2));
				price = price<0?0:price.toFixed(2);
			}else
				price = $(e.parentNode).find('.sel').attr('data-price');				
		}
		$('#price').html('￥'+parseFloat(price).toFixed(2));		
	}
}

//霸屏
var rich = {
	delBp:function(){

	},
	deleteId:[],
	toDel:function(id){
		if(this.deleteId.indexOf(id)==-1){
			this.deleteId.push(id);
		}
	},
	checkDelete:function(e){
		if(typeof e.tid=='undefined'||e.tid==null||e.tid=='')
			return true;
		if(this.deleteId.length==0)
			return true;
		return this.deleteId.indexOf(e.tid)==-1;
	},
	noImgSrc:'',//删除图片替代路径
	noImg:function(e){
		$(e).attr({src:rich.noImgSrc});
	},
	list:[],
	setImage:function(e){
		var dir = $(e.parentNode).width()/$(e.parentNode).height();
		if($(e).width()/$(e).height()<=dir){
			$(e).css({width:'100%',left:0});
			var mt = ($(e).height()-$(e.parentNode).height())/-2;
			$(e).css({marginTop:mt,'visibility':'visible'});			
		}else{
			$(e).css({height:'100%'});
			var ml = ($(e).width()-$(e.parentNode).width())/-2;
			$(e).css({marginLeft:ml,'visibility':'visible'});				
		}			
	},
	add:function(dt){
		dt.num = (dt.num==null||dt.num==''||parseInt(dt.num)<1)?1:parseInt(dt.num);
		this.list.push(dt);
	},
	init:function(){
		setTimeout(function(){
			if(rich.list.length>0){
				var dt = rich.list[0];
				rich.list.shift();
				rich.show(dt);
			}else
				setTimeout(arguments.callee,500);
		},500);		
	},
	show:function(dt){
		if(dt.msgType=='ds')
			return this.dsShow(dt);
		if(dt.msgType=='cake'){
			cakeAnimate.show();
			return this.dsShow(dt,true);
		}
		if(dt.msgType!='bp')
			return rich.init();
		if(dt.num>1&&dt.msgType!='ds'&&dt.msgType!='cake'){
			rich.loop(dt);	
		}
		if($('#rich').length>0)
			return;
		//$('.onWall_newIcon2').addClass('disabled');
		//$($('.newActive')[0].parentNode.parentNode).addClass('disabled');
		var hasImage = dt.src!=null&&$.trim(dt.src).length>0;
		var html = '<div id="rich">';
		if(hasImage){
			var _src = dt.src;
			if(dt.src.split(',').length>1)
				_src = dt.src.split(',')[0];
			html += '<div class="richImage">';
			html += '<img onload="rich.setImage(this)" onerror="rich.noImg(this)"  src="'+_src+'" /></div>';
			html += '<div class="richInfo">';
		}else
			html += '<div class="richInfo noImage">';
		if(dt.msg!=null&&dt.msg.length>0)
			html += '<div class="richTxt">'+dt.msg+'</div>';
		if(hasImage){
			var str = (dt.bpForName!=null)?'为 '+dt.bpForName+' ':'';
			if(dt.msg!=null&&dt.msg.length>0){
				html += '<div class="richTime">'+str+'重金霸屏 <b id="richTime">'+dt.richTime+'</b> 秒</div>';
			}
			else
				html += '<div class="richTime noText">'+str+'重金霸屏 <b id="richTime">'+dt.richTime+'</b> 秒</div>';
		}
		html += '<div class="richUser">';
		html += '<a id="'+dt.userId+'" onclick="rich.clickUserHead(this)"><img class="'+dt.sex+'" src="'+dt.head+'" /></a>';
		html += '<div><span class="tableSpan"><tt class="richUserName">'+dt.userName+'</tt>';	
		if(!hasImage){
			var str = (dt.bpForName!=null)?'为 '+dt.bpForName+' ':'';
			html += '<tt class="richTime">'+str+'重金霸屏 <b id="richTime">'+dt.richTime+'</b> 秒</tt>';
		}
		//if(dt.richSit!=null&&dt.richSit!='')
			//html += '<tt class="richSit">座席：<i>'+dt.richSit+'</i></tt>';
		html += '</span></div></div>';
		
		html += '</div></div>';
		
		$(html).appendTo($('body'));
		setTimeout(function(){
			Transition.go({
				obj:$('#rich')[0],
				style:{'-webkit-transform':'scale(1)','opacity':1}
			});		
			rich.count(dt.richTime,false,dt);	
		},50);
	},
	count:function(time,type,e){
		time = parseInt(time);
		setTimeout(function(){
			if(!type){
				var b = rich.checkDelete(e);
				if(!b){
					return rich.close(type);
				}
			}
			if(time==-1)
				return rich.close(type);
			setTimeout(arguments.callee,1000);
			$('#richTime').html(time);
			time--;
		},0);
	},
	close:function(type){
		if(type){
			return $('#ds').fadeOut(function(){
				$('#ds').remove();
				rich.init();
			});
		}
		//$('.onWall_newIcon2').removeClass('disabled');
		$('#rich').fadeOut(function(){
			$('#rich').remove();
			rich.init();
		});
	},
	dsShow:function(dt,bool){
		bool = bool==null?false:bool;
		if(bool)
			dt.giftId = 'cake';
		var className,giftName,countTime;
		var _dsDt = giftData.normal;
		if(parseInt(dt.giftId)>11){
			_dsDt = giftData.newDs;
		}
		if(dt.giftId!=null&&dt.giftId!==''){
			className = _dsDt[dt.giftId].iconName;	
			giftName = _dsDt[dt.giftId].name;
			countTime = _dsDt[dt.giftId].time;	
		}else
			rich.close(true);
		//src = ds.imageUrl+className;
		
		var html = '<div id="ds">';
		//html += '<img class="'+className+'" src="'+src+'.png" />';
		if(dt.src!=null&&dt.src.length>0)
			html += '<div class="richImage"><img onload="rich.setImage(this)" src="'+dt.src+'"></div><div class="richInfo">';
		else
			html += '<div class="richInfo noImage">';
		if(bool)
			html += '<div class="dsTxt">为 <tt>'+dt.toName+'</tt> 霸屏：</div>';
		else	
			html += '<div class="dsTxt">重金打赏：<tt>'+dt.showName+'</tt></div>';
		html += '<div class="dsObj">'+giftName+'</div>';
		
		if(dt.msg!=null&&dt.msg.length>0)
			html += '<div class="dsTxt" style="margin-top:14px; color:#fff; font-size:14px">'+dt.msg+'</div>';
		
		html += '<div class="richUser">';
		html += '<a id="'+dt.userId+'" onclick="rich.clickUserHead(this)"><img class="'+dt.sex+'" src="'+dt.head+'"></a>';
		html += '<div><span class="tableSpan"><tt class="richUserName"><tt>'+dt.userName+'</tt>剩余 <b id="richTime" class="dsTime">'+countTime+'</b> 秒</tt></span></div>';
		html += '</div></div></div>';

		$(html).appendTo($('body'));
		
		setTimeout(function(){
			Transition.go({
				obj:$('#ds')[0],
				style:{'-webkit-transform':'scale(1)','opacity':1}
			});
			rich.count(countTime,true,dt);	
		},50)
	},
	loop:function(dt){
		setTimeout(function(){
			dt.num = parseInt(dt.num)-1;
			rich.add(dt);
		},(parseInt(dt.richTime)-5)*1000);	
	}
}

//设置功能按钮状态
var setActive = function(bool){
	if(bool==true||bool=='true'){
		$('.wemewPhoneBp').removeClass('disabled');	
		$('.wemewPhoneDs').removeClass('disabled');
		$('.Cake').removeClass('disabled');
		return;
	}
	$('.wemewPhoneBp').addClass('disabled');
	$('.wemewPhoneDs').addClass('disabled');
	$('.Cake').addClass('disabled');
}

//广告和敏感词屏蔽
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


//聊天消息提醒
var onWallTalkNum = function(x){
	x = (x==null||x=='null'||$.trim(x).length==0)?0:parseInt(x);
	$('#onWallTalkNum').html(x);
	my.noRead = x;
	if(x>0)
		$('#onWallTalkNum').show();
	else
		$('#onWallTalkNum').hide();
}

//检测消息是否为空
var checkNull = function(){
	if($('.row').length>0){
		return $('#onWallnull').remove();	
	}
	if($('#onWallnull').length>0)
		return;
	try{
		var barName = document.title.split('_')[0];
		$('<div id="onWallnull" style="text-align:center; font-size:13px; color:#fff; padding:20px 0; text-shadow:0 0 5px #000;">欢迎来到'+barName+'</div>').insertBefore($('#first'));
	}catch(ex){}
}

//游戏入口
var showAllGame = function(){
	var html = '<div class="allGameIcon">';
	var gameHtml = '';
	for(var x in gameUrl){
		if(gameUrl[x].url!=null&&$.trim(gameUrl[x].url).length>0)
			gameHtml += '<div class="gameIcon"><a href="'+gameUrl[x].url+'"><span class="icon_module '+gameUrl[x].icon+'"></span><tt>'+x+'</tt></a></div>';	
	}
	if(gameHtml.length==0)
		gameHtml += '<div style="text-align:center; width:100%;">酒吧未开通游戏功能</div>';
	else
		gameHtml += '<div style="clear:both"></div>';
	html += gameHtml;	
	html += '</div>';
	
	WM.Phone.get({
		type:'window',
		headHide:true,
		ready:function(){
			this.find('.Phone_window_main').css({paddingTop:10,paddingBottom:10});
			var t = this;
			$('#cover'+this.id).bind('click',function(){
				try{
					t.swiper.destroy(true);		
				}catch(ex){}
				t.close();	
			});	
		},
		innerHTML:html
	});	
}

//socket
var webSocket = {
	msgList:[],
	connect:function(host){
		this.socket = new WebSocket(host);
	    this.socket.onopen = function(){
			//链接开始
			webSocket.onOpen();	
			while(webSocket.msgList.length>0){
				webSocket.send(webSocket.msgList[0],true);
				webSocket.msgList.shift();	
			}
	    };
	    this.socket.onclose = function(){
	  		initWebSocket();
	    };
		this.socket.onerror = function(){
			webSocket.close();
		};
		this.socket.onmessage = function(msg){
			webSocket.onMessage(msg);	
		}
	},
	close:function(){
		var t = this;
		try{
			t.socket.close();
		}catch(ex){}
	},
	init:function(data){
		if(this.socket!=null&&this.socket.readyState!=null&&this.socket.readyState==1)
			return;
		data = data||{};
		this.data = data;
		this.onOpen = data.onOpen||function(){};
		this.onMessage = data.onMessage||function(){};
		this.connect(data.url||'');	
	},
	send:function(msg,save){
		if(this.socket==null||this.socket.readyState==null||this.socket.readyState==0||this.socket.readyState==3){
			if(save)
				webSocket.msgList.push(msg);
			return initWebSocket();
		}else if(this.socket.readyState==2){
			if(save)
				webSocket.msgList.push(msg);
			webSocket.close();	
		}else
			webSocket.socket.send(msg);
	}
}

var cakeAnimate = {
	num:30,
	timeout:null,
	close:function(){
		try{$('#'+this.id).remove();}catch(ex){}
		clearTimeout(this.timeout);	
	},
	create:function(){
		this.close();
		this.id = WM.Phone.getId();
		var html = '<div style="position:fixed; left:0; top:0; width:0; height:0;  z-index:99999;" id="'+this.id+'">';
		for(var x=0;x<this.num;x++){
			var tx = WM.Phone.getRandom(0,$(window).width()-22);
			var ty = WM.Phone.getRandom(100,400)*-1;
			var time = WM.Phone.getRandom(15,25);
			time = time/10;
			html += '<span class="oneCake" style="position:fixed; left:'+tx+'px; top:0; transition:'+time+'s all linear; transform:translate3d(0px,'+ty+'px,0)"></span>';		
		}	
		html += '</div>';
		$(html).appendTo($('body'));		
	},
	show:function(){
		this.create();
		var t = this;
		var arr = $('#'+this.id).find('.oneCake');
		setTimeout(function(){
			for(var x=0;x<t.num;x++){
				$(arr[x]).css({
					transform:'translate3d(0,'+$(window).height()+'px,0)'	
				});		
			}		
		},60);	
		this.timeout = setTimeout(function(){
			t.close();			
		},3000);
	}
}

var imageUpLoad = function(e){
	upload.start();
	selectFileImage(e,{
		width:400,height:400,
		error:function(errorMsg){upload.error(errorMsg||'请上传宽高大于400px的图片')},
		callback:function(base64,rotate){
			ajax_imageUpload(base64,rotate,'ajaxUpload',function(src,cimgurl,bigSrc){
				upload.done(src,cimgurl,bigSrc);
			},function(errorMsg){
				showInfo(errorMsg||'上传失败');
				upload.error();
			})
		}
	})
}

//就座消息
var createInteract = function(data,isNew){
	var reg = new RegExp("\\[([^\\[\\]]*?)\\]", 'igm');
	var html = document.getElementById('interact').innerHTML;
	var isMe = data.userId==my.userId?'':'点击互动';
	var action = '',type = '';
	var url  = '/cwechat/getnearMyInfo';
	var url = my.url;
	if(data.userId==my.userId){
		type += 'myTxt';
		action += '<span class="aDel" onclick="onWall.del(this)">删除</span>';
		if(typeof isCheckPage!='undefined'&&isCheckPage)
			action += '<span class="aApply" onclick="onWall.toApply(this)">通过</span>';
	}else{
		url = '/cwechat/talkhome?sendid='+data.userId+'';
		type += 'other';
		if(my.isAdmin&&my.adminDel){
			type += ' adminer';
			action += '<span class="aDel" onclick="onWall.del(this)">删除</span>';
			action += '<span class="aBlack" onclick="onWall.toBlack(this)">拉黑</span>';	
			if(typeof isCheckPage!='undefined'&&isCheckPage)
				action += '<span class="aApply" onclick="onWall.toApply(this)">通过</span>';
		}
	}
	
	var val = html.replace(reg, 
		function(node,key){ 
			return { 
				//'richMan':richManId.indexOf(data.userId)!=-1?'richMan':'',
				'sitName':data.userId!=my.userId?data.userName:(isNew?'<span class="textGreen">大屏幕显示</span>':''),
				'tid':data.tid,
				'sitType':type,
				'userId':data.userId, 
				'userName':data.userName, 
				'age':data.age||'',
				'job':data.job||'',
				'kg':data.kg||'',
				'sex':data.sex||'',
				'cm':data.cm||'',
				'txt':data.txt||'',
				'url':url,
				'head':data.head,
				'bigHead':data.bigHead,
				'time':data.time,
				'sitMsg':data.sitMsg,
				'sitNumber':data.sitNumber,
				'sitId':data.sitNumber,
				isMe:isMe,
				action:action,
                'grade':data.grade,
                'gradeName':data.gradeName,
                'cy_test_grade':data.cy_test_grade,
				'gradeColor':data.gradeColor
			}[key]; 
		}
	);
	return val;		
}

var replaceAll = function(val){
	val = val.replace(/</g,'&lt;');
	val = val.replace(/>/g,'&gt;');	
	val = val.replace(/"/g, "&quot;");
	val = val.replace(/'/g, "&apos;");
	return val;
}

//添加消息
var createOne = function(id,data,isNew,isRich){
	if(data.msgType=='redBag')
		return createRedBag(data,isNew);
	if(data.msgType=='openRedBag'){
		if(data.sendId==my.userId&&data.getId!=my.userId){
			data.getterName = data.getterName.replace(/"/g, "");
			data.getterName = data.getterName.replace(/'/g, "");
			return '<div class="getRedBagTxt row"><span><i class="onWall_redBagIconMini"></i>'+data.getterName+'领取了你的红包</span></div>';
		}
		return ''; 	
	}
	var reg = new RegExp("\\[([^\\[\\]]*?)\\]", 'igm');
	var html = document.getElementById(id).innerHTML;
	isRich = isRich==null?false:isRich;
	var url = my.url;
	if(data.userId!=my.userId){
		url = '/cwechat/talkhome?sendid='+data.userId+'';
	}
	data.time = '&nbsp;&nbsp;'+data.time;	
	var isLoveNight = data.msgType=='loveNight';
	var loveNightTag = isLoveNight?'loveNightTag':'';
	var fullRow = 'fullRow';
	var msg = '';
	var src = data.src||'',bigSrc = data.bigSrc||'',normalSrc = data.normalSrc||'',showMsg = data.msg;
	var _msgType = '';
	if(data.msgType=='bp'){
		var bNames = '重金霸屏';	
		loveNightTag = 'txt-bpIcon txt-Icon';
		if(data.theme!=null&&data.theme>=0){
			if(data.theme==0)
				loveNightTag = 'txt-loveIcon txt-Icon',bNames = '示爱霸屏';
			else if(data.theme==1)	
				loveNightTag = 'txt-trystIcon txt-Icon',bNames = '求约霸屏';
			else if(data.theme==2)	
				loveNightTag = 'txt-proposeIcon txt-Icon',bNames = '求婚霸屏';
			else if(data.theme==3)	
				loveNightTag = 'txt-beautifulIcon txt-Icon',bNames = '女神霸屏';
			else if(data.theme==4)	
				loveNightTag = 'txt-byIcon txt-Icon',bNames = '毕业季霸屏';
			else if(data.theme==5)	
				loveNightTag = 'txt-cakeIcon txt-Icon',bNames = '生日霸屏';
			else if(data.theme==6)	
				loveNightTag = 'txt-qixi txt-Icon',bNames = '七夕霸屏';
			else if(data.theme==7)
				loveNightTag = 'txt-gq txt-Icon',bNames = '中秋遇国庆';
			else if(data.theme==7)	
				loveNightTag = 'txt-gq txt-Icon',bNames = '中秋遇国庆霸屏';
		}
		var bpFor = data.bpForName!=null?('为 '+data.bpForName+' '):'';
		bpFor += bNames;
		//if(data.bpForName!=null)
			//bpFor += '<br />';
		if(data.showNum>1){
			msg += '<p class="txtSpanTop pr25"><span class="txtSpanBp">'+bpFor+''+data.richTime+'秒 '+data.showNum+'次：</span></p>';	
		}else
			msg += '<p class="txtSpanTop pr25"><span class="txtSpanBp">'+bpFor+''+data.richTime+'秒</span></p>';
	}else if(data.msgType=='song'){
		loveNightTag = 'txt-songIcon txt-Icon';
		msg += '<p class="txtSpanTop pr25"><span class="txtSpanBp">'+data.songName+'_'+data.singer+'</span></p>';
	}else if(data.msgType=='ds'){
		loveNightTag = 'txt-dsIcon txt-Icon';
		msg = '';
		//还要修改
		var _dsDt = giftData.newDs;
		if(parseInt(data.giftId)>11){
			_dsDt = giftData.newDs;	
			if(showMsg==null||showMsg.length==0)
				showMsg = '';
				//showMsg = _dsDt[data.giftId].msg;				
		}
		var giftClass,giftName;
		giftClass = _dsDt[data.giftId].iconName;
		giftName = _dsDt[data.giftId].name;
		giftName += data.showNum>1?(' '+data.showNum+'次'):'';
		msg += '<p class="txtSpanTop pr25">打赏给&nbsp;"'+data.showName+'"&nbsp;<i class="'+giftClass+'"></i>&nbsp;'+giftName+'</p>';
		//msg += '<img onclick="onWall.showImage(this)" class="bg" src="'+data.showSrc+'" bigSrc="'+data.showBigSrc+'" />';
		src = data.showSrc;
		bigSrc = data.showBigSrc;	
		//showMsg = data.showTxt;		
	}else if(data.msgType=='cake'){
		loveNightTag = 'txt-bpIcon txt-Icon';
		msg = '<p class="txtSpanTop pr25"><span class="txtSpanBp">为&nbsp;"'+data.toName+'"&nbsp;霸屏&nbsp;<i class="newDsIcon_Birthdaycake"></i>&nbsp;生日蛋糕</span></p>';
	}else if(isLoveNight){
		msg = '<img onclick="gotoLoveNight()" class="lovebg" src="'+data.normalSrc+'" />';
	}else{
		fullRow = 'normalMsg';
		/*
		if(data.msg!=null&&data.msg.length>0)
			msg = '<p class="txtSpanTop">'+data.msg+'</p>';
		*/
	}
	if(src!=null&&$.trim(src).length>0){
		if(fullRow!='normalMsg')
			fullRow = '';
		if(data.videoUrl!=null&&data.videoUrl!=''){
			msg += '<div><a class="oneVideoBox" onclick="getPoster.play(this)">';
			msg += '<i class="videoPlay"></i>';
			var _src = (bigSrc==null||bigSrc=='')?src:bigSrc;
			msg += '<img class="bg" bigSrc="'+bigSrc+'" videoUrl="'+data.videoUrl+'" src="'+_src+'" />';
			msg += '</a></div>';
		}else{
			if(!isLoveNight){
				if(src.split(',').length>1){
					var splitSrc = src.split(',');
					var splitBs = bigSrc.split(',');
					for(var x=0;x<splitSrc.length;x++){
						if(normalSrc[x]){
							msg += '<div class="someImgBox"><img onclick="onWall.showImage(this)" bigSrc="'+(splitBs[x]||'')+'" src="'+splitSrc[x]+'" miniSrc="'+splitSrc[x]+'" /></div>';				
						}	
					}
					msg += '<div class="clear"></div>';
				}else
					msg += '<img onclick="onWall.showImage(this)" class="bg" bigSrc="'+bigSrc+'" src="'+normalSrc+'" miniSrc="'+src+'" />';
			}
		}	
	}
	
	if(fullRow=='normalMsg'){
		
		//if(src!=null&&$.trim(src).length>0&&showMsg!=null&&showMsg.length>0)
			//fullRow.replace('onlyText','');
		if(my.userId!=data.userId&&src!=null&&$.trim(src).length>0)
			fullRow += '';
		else
			fullRow += ' onlyText';
		msg = '';
		var _cna = 'bg';
		if(showMsg!=null&&showMsg.length>0)
			_cna += ' hasText';
		if(src!=null&&$.trim(src).length>0){
			msg = '<img onclick="onWall.showImage(this)" class="'+_cna+'" bigSrc="'+bigSrc+'" src="'+normalSrc+'" miniSrc="'+src+'" />';
		}
		if(showMsg!=null&&showMsg.length>0)	
			msg += '<tt>'+showMsg+'</tt>';
		msg += '<p class="clear"></p>';
		if(src!=null&&$.trim(src).length>0&&my.userId!=data.userId){
			if(data.userId=='wemewSystem')
				msg += '<b style="visibility:hidden" class="fgLine"><img src="'+allImageUrl+'fgLine.png" /></b>';
			else
				msg += '<b class="fgLine"><img src="'+allImageUrl+'fgLine.png" /></b>';	
		}
	}
	
	if(id!='advert'&&!isRich&&data.msgType!='cake'&&data.msgType!='song'&&data.msgType!='ds'&&!isLoveNight&&my.userId!=data.userId&&data.bpForName==null&&data.src!=null&&$.trim(data.src).length>0){
		if(typeof isCheckPage=='undefined'&&data.userId!='wemewSystem'){
			msg += '<span class="forTaBp _forTaBp">';
			msg += '<a onclick="interact._showMoney(this,true)">为TA霸屏</a>';
			msg += '</span>';
		}
	}

	if(showMsg!=null&&showMsg.length>0){
		if(data.msgType=='bp'||data.msgType=='cake'||data.msgType=='ds'||data.msgType=='song'){
			if(data.src==null||$.trim(data.src).length==0)
				msg += '<b class="fgLine"><img src="'+allImageUrl+'fgLine.png"></b>';
			
			msg += '<p class="txtSpanDown">'+showMsg+'</p>';	
		}
	}

	var actionTxt = '';
	if(data.userId==my.userId){
		actionTxt += '<span class="aDel" onclick="onWall.del(this)">删除</span>';
		if(typeof isCheckPage!='undefined'&&isCheckPage)
			actionTxt += '<span class="aApply" onclick="onWall.toApply(this)">通过</span>';		
	}else {
        if (my.isAdmin && my.adminDel) {
            actionTxt += '<span class="aDel" onclick="onWall.del(this)">删除</span>';
			if(data.userId!='wemewSystem'){
				actionTxt += '<span class="fgAction"></span>';
            	actionTxt += '<span class="aBlack" onclick="onWall.toBlack(this)">拉黑</span>';
			}
            if (typeof isCheckPage != 'undefined' && isCheckPage)
                actionTxt += '<span class="fgAction"></span><span class="aApply" onclick="onWall.toApply(this)">通过</span>';
        }
	}
	if (my.isAdmin && my.isRepeat) {
		if(data.msgType=='bp'||data.msgType=='ds')
			actionTxt += '<span class="fgAction"></span><span class="aBlack" onclick="onWall.onceBP(this)">再霸一次</span>';
	}
	actionTxt += '<div style="clear:both;"></div>';
	
	data.userName = data.userName.replace(/"/g, "");
	data.userName = data.userName.replace(/'/g, "");
	
	data.txt = data.txt.replace(/"/g, "");
	data.txt = data.txt.replace(/'/g, "");
	
	if(data.msgType=='bp'&&data.pascreenSort!=-1){
		if(typeof data.pascreenSort!='undefined'&&data.pascreenSort!=-1)
			data.time += ' 第'+data.pascreenSort+'位霸屏'	;
	}
	
	var val = html.replace(reg, 
		function(node,key){ 
			return {
				'isFull':fullRow,
				'loveNightTag':loveNightTag,
				'isLoveNight':isLoveNight?'loveNight':'',
				//'richMan':richManId.indexOf(data.userId)!=-1?'richMan':'',
				'isNew':isNew?'<span class="textGreen">大屏幕显示</span>':(data.userId==my.userId?'':data.userName),
				'tid':data.tid,
				'userId':data.userId, 
				'userName':data.userName, 
				'age':data.age||'',
				'job':data.job||'',
				'kg':data.kg||'',
				'sex':data.sex||'',
				'cm':data.cm||'',
				'txt':data.txt||'',
				'url':url,
				'head':data.head,
				'bigHead':data.bigHead,
				'time':data.time,
				'msg':msg,
				'action':actionTxt,
				'grade':data.grade,
                'gradeName':data.gradeName,
				'cy_test_grade':data.cy_test_grade,
                'gradeColor':data.gradeColor
			}[key]; 
		}
	);		
	return val;
}

//红包消息
var createRedBag = function(data,isNew){
	if(data.msgType=='openRedBag'){
		var getterName = data.getterName||'';
		getterName = replaceAll(getterName);
		if(data.sendId==my.userId&&data.getId!=my.userId)
			return '<div class="getRedBagTxt row"><span><i class="onWall_redBagIconMini"></i>'+getterName+'领取了你的红包</span></div>';
		return ''; 	
	}
	var reg = new RegExp("\\[([^\\[\\]]*?)\\]", 'igm');
	var html = document.getElementById('redBagModel').innerHTML;
	var isRich = false;
	var url = my.url;
	if(data.userId!=my.userId){
		url = '/cwechat/talkhome?sendid='+data.userId+''	
	}
	
	//霸屏消息 data.richTime-霸屏时间
	var msg = '';
	msg += data.msg;

	var actionTxt = '';
	
	if(data.userId==my.userId){
		actionTxt += '<span class="aDel" onclick="onWall.del(this)">删除</span>';		
	}else{
		if(my.isAdmin&&my.adminDel){	
			actionTxt += '<span class="aDel" onclick="onWall.del(this)">删除</span>';
			actionTxt += '<span class="aBlack" onclick="onWall.toBlack(this)">拉黑</span>';
		}
	}

	actionTxt += '<div style="clear:both;"></div>';
	
	var userName = data.userName||'';
	userName = replaceAll(userName);
	var userTxt = data.txt||'';
	userTxt = replaceAll(userTxt);
	var val = html.replace(reg, 
		function(node,key){ 
			return { 
				'rbId':data.rbId,
				'isNew':isNew?'<span class="textGreen">大屏幕显示</span>':(data.userId==my.userId?'':data.userName),
				'tid':data.tid,
				'userId':data.userId, 
				'userName':userName, 
				'age':data.age||'',
				'job':data.job||'',
				'kg':data.kg||'',
				'sex':data.sex||'',
				'cm':data.cm||'',
				'txt':userTxt||'',
				'url':url,
				'head':data.head,
				'bigHead':data.bigHead,
				'time':data.time,
				'msg':msg,
				'action':actionTxt,
                'grade':data.grade,
                'gradeName':data.gradeName,
                'cy_test_grade':data.cy_test_grade,
                'gradeColor':data.gradeColor
			}[key]; 
		}
	);		
	return val;	
}

//互动
var interact = {
	closeOther:function(e){
		var arr = $('.signSitRow');
		for(var x=0;x<arr.length;x++){
			if(arr[x]!=e)
				this.close(arr[x]);	
		}
	},
	close:function(e){
		window.Transition.go({
			obj:$(e).find('.signSitActive')[0],
			style:{'-webkit-transform':'translate(0,100%)'},
			time:200	
		});			
	},
	show:function(e){
		if(typeof isCheckPage!='undefined')
			return;
		var parent = e.parentNode.parentNode.parentNode.parentNode;
		if($(parent).attr('userId')==my.userId)
			return showInfo('不能和自己互动',false);
		this.closeOther(parent);
		window.Transition.go({
			obj:$(e.parentNode).find('.signSitActive')[0],
			style:{'-webkit-transform':'translate(0,0)'},
			time:250	
		});				
	},
	signUp:function(e){
		return;
	},
	selWine:function(e){
		if($(e.parentNode).hasClass('sel')){
			$(e.parentNode).removeClass('sel');
			$(e.parentNode).find('i').removeClass('iconSelectYes');
		}else{
			$(e.parentNode).addClass('sel');
			$(e.parentNode).find('i').addClass('iconSelectYes');
		}
		this.countPrice();	
	},
	countPrice:function(arr){
		var arr = $('.wineList div.sel'),price = 0;
		for(var x=0,len = arr.length;x<len;x++){
			price += parseFloat(wineData[$(arr[x]).attr('tid')].price);		
		}
		price = price.toFixed(2);
		$('#price').html('￥'+price);
	},
	sendWine:function(e){
		return;			
	},
	math:function(time,num){
		time = parseInt(time);
		num = parseInt(num); 
		var money = 0;
		if(interact.priceType==1)
			return parseFloat(time*interact.onePrice*num).toFixed(2);
		else
			return parseFloat((2*time-10)*interact.onePrice*num).toFixed(2);
	},
	warning:function(){
		if(typeof qixiBar!='undefined'&&qixiBar=='true'){
			if(typeof sysDate=='undefined')
				return;
			var nowDate = sysDate.split(' ');
			if(nowDate.length==0)
				return;
			if(nowDate[0]!='2017-08-26'&&nowDate[0]!='2017-08-27'&&nowDate[0]!='2017-08-28')
				return;
			if(localStorage){
				var ls = localStorage.getItem(nowDate[0]+'wemewActive_729_warning');
				if(ls!=null&&ls==1)
					return;
			}
			if(localStorage){
				localStorage.setItem(nowDate[0]+'wemewActive_729_warning',1);
			}
			alert('温馨提示："霸屏抢楼"活动中使用连续霸屏仅算1个霸屏排序哦！');
		}
		
	},
	//土豪霸屏
	_showMoney:function(e,bool){
        if($(e).hasClass('disabled')||$('.wemewPhoneBp').hasClass('disabled'))
            return showInfo('大屏幕未开启，不能霸屏',false);
        var isForTa = bool==null?false:bool;
        if(active_showMoney!="true")
            return showInfo('该酒吧没有开通土豪霸屏功能',false);
        my.freeTime = (my.freeTime==null||my.freeTime==''||my.freeTime<0)?-1:my.freeTime;
        var html='',htmlBpTime='',htmlBpType='';
        var bpTypeArr = [
		/*{
			index:4,
            name:'bpTypeby',
            text:'毕业季霸屏'
		},
		{
			index:6,
            name:'bpTypeqixi',
            text:'七夕霸屏'
		},
		
		{
			index:7,
            name:'bpTypeGq',
            text:'中秋遇国庆'
		},
		*/
		{
			index:5,
            name:'bpTypecake',
            text:'生日霸屏'
		},{
			index:0,
        	name:'bpTypeLove',
			text:'示爱霸屏'
		},{
			index:1,
        	name:'bpTypeyh',
			text:'求约霸屏'
		},{
			index:2,
            name:'bpTypeqh',
            text:'求婚霸屏'
		},{
			index:3,
            name:'bpTypens',
            text:'女神霸屏'
		}
		];
			
        // 霸屏时间字符串开始;
		var title = '霸屏';
		if(isForTa){
            var src = $(e.parentNode.parentNode).find('.bg').attr('miniSrc');
			if(src==null||src=='')
				src = $(e.parentNode.parentNode).find('.bg').attr('src');
            title = '此照片将霸屏显示';
            html += '<div style="text-align:center; padding:0px 0 5px 0"><img src="'+src+'" style="border-radius:50%; width:46px; height:46px" /></div>'
        }
        htmlBpTime += '<div class="bpTimeTitle">';
        htmlBpTime += '<div>霸屏时长</div>';
        htmlBpTime += '<div style="position:relative;">';
        htmlBpTime += '<div class="bpTimeTitleSelect">';
        htmlBpTime += '<div class="bpTimeText"><i id="bpText1" data-num="1">连续霸屏</i><i></i></div>';
        if(!my.isAdmin||my.free==null||my.free==0){
            htmlBpTime += '<select id="select" class="bpSelect">';
			var selectArr = [{num:'1',text:'1次霸屏'},{num:'2',text:'2连霸屏'},{num:'3',text:'3连霸屏'},{num:'4',text:'4连霸屏'},{num:'5',text:'5连霸屏'},{num:'10',text:'10连霸屏'}];
			for(var i=0;i<selectArr.length;i++){
				var dt = selectArr[i];
				htmlBpTime += '<option value="'+dt.num+'">'+dt.text+'</option>';
			}
			htmlBpTime += '</select>';
        }
        htmlBpTime += '</div></div></div>';
        htmlBpTime += '<div class="wm_otherBar">';
        htmlBpTime += '<div class="bpTimeList dsObjMain">';
        htmlBpTime += '<div class="wInfinity dsObjBox dsObjBox1">';
		
		//价格排序
//		bpTimes = bpTimes.sort(function(a,b){
//			return parseFloat(b.price)-parseFloat(a.price);		
//		})
		
        for(var i=0;i<bpTimes.length;i++){
        	var ee = bpTimes[i];
        	var cName = (my.isAdmin&&my.free>0&&my.freeTime!=-1&&ee.time>my.freeTime)?'BpTimeNotCheck':'';
			/* 一条霸屏时长 */
            htmlBpTime += '<div class="oneBpTime '+cName+'" data-price="'+ee.price+'" index="'+i+'" data-time="'+ee.time+'">';
            htmlBpTime += '<div class="bpTimeBigBox">';
            htmlBpTime += '<div class="bpTimeSmallBox table">';
            htmlBpTime += '<div class="tableCell black">'+ee.time+'秒</div>';
            htmlBpTime += '</div></div>';
            htmlBpTime += '<div class="bpTimePrice table">';
            htmlBpTime += '<div class="tableCell grey">¥'+ee.price+'</div>';
            htmlBpTime += '</div>';
            htmlBpTime += '<i class="bpTimeSelect"></i>';
            htmlBpTime += '</div>';
            // 一条霸屏时长结束;
		}
        htmlBpTime += '</div>';
        htmlBpTime += '</div>';
        htmlBpTime += '</div>';
		// 霸屏主题字符串开始;
		htmlBpType += '<div class="bpTimeTitle" style="padding-bottom:5px">';
		htmlBpType += '<div>霸屏主题</div>';
		htmlBpType += '</div>';
        htmlBpType += '<div class="wm_otherBar">';
		htmlBpType += '<div class="bpTypeList">';
		htmlBpType += '<div class="wInfinity dsObjBox dsObjBox1">';
		for(var i=0;i<bpTypeArr.length;i++){
            // 一条霸屏主题
			var dt = bpTypeArr[i];
			htmlBpType += '<div class="oneBpType" data-type='+dt.index+'>';
			htmlBpType += '<div class="bpTypeIcon">';
			htmlBpType += '<span class="'+dt.name+'"></span>';
			htmlBpType += '</div>';
			htmlBpType += '<div class="bpTypeName">'+dt.text+'</div>';
			htmlBpType += '<i class="bpTimeSelect"></i>';
			htmlBpType += '</div>';
		}
		htmlBpType += '</div></div>';
        html += htmlBpTime+htmlBpType;
        html += '<div class="showMoney" style="margin:0">';
		
		var activeText = ['我做鬼也要和你在一起！','万圣不鬼混，活该你单身','天黑请闭眼，单身请睁眼。','嫑轻易和我鬼混，太帅你承受不来','今天也是漂酿的小仙女~鬼'];

		var ranNum = parseInt(Math.random()*5);
		
		var halloweenWord = '';
		
		if(activeText[ranNum])
			halloweenWord = activeText[ranNum];
		
        if(isForTa){
            html += '<div><input class="inputNormal isForTaInput" placeholder="霸屏语，30字以内，可以为空" maxlength="60" class="textarea" style="border-radius:4px; font-size:13px;"></div>';
        }else{
			html += '<div><input type="text" class="inputNormal" id="_bpWord" maxlength="60" placeholder="请不要发布广告涉黄等内容，霸屏不支持退款" style="font-size:13px; text-indent:14px; box-sizing:border-box; height:40px; line-height:41px; padding:0px" /></div>';
			var _tVal = isUploadVideo=='true'?'可以上传1张图片或者1个视频':'可以上传1张图片';
			_tVal += '，霸屏10秒以上可以上传多图';
			html += '<div class="textRed" id="newImgUploadTxt" style="margin-top:6px; font-size:12px">'+_tVal+'</div>';
			html += '<div class="wm_otherBar" style="margin-top:0px"><div class="uploadMain">';
			html += '<div class="uploadImgBox">';
			
			var _cName = isUploadVideo=='true'?'iconBaPing':'iconImImgBaPing';
			var _acc = 'accept="image/*"';
			if(isUploadVideo=='true'){
				_acc = '';
			}
			
			html += '<div class="_oneUpload"><input type="file" class="file" onchange="newImgUpload.upload(this)" '+_acc+' /><i class="'+_cName+'"></i></div>';
			html += '</div></div></div>';
        }
        html += '</div>';
        var myRedBagTxt = '';
        var newClassName = '';
        var isFull = false;
		html += setMoney.create(my.redBagMoney,my.cash,true,null,my.isAdmin&&my.free>0);
        var btnTxt = my.isAdmin&&my.free>0?'免费霸屏<tt class="litFont">今日剩'+my.free+'次</tt>':'购买霸屏';
        var isAjax = false;
        var setPrice = function(price){
            if(isOpenRedBag){
                var delMoney = price<my.redBagMoney?price:my.redBagMoney;
                $('#delMoney').html('-'+parseFloat(delMoney).toFixed(2));
                price = parseFloat(price-my.redBagMoney);
                price = price<0?0:price;
                isFull = price<=0?true:false;
            }
            $('#price').html('￥'+price.toFixed(2));
		};
        WM.Phone.get({
            type:'slideBox',
            title:title,
            btnText:btnTxt,
            html:html,
			onload:function(){
				try{
					if(typeof qixiBar!='undefined'&&qixiBar=='true'){
						if(loveYou.date=='2017-08-26'||loveYou.date=='2017-08-27'||loveYou.date=='2017-08-28'||loveYou.date=='2017-08-29'){
							if(localStorage){
								var showTs = localStorage.getItem(loveYou.date+'qixi_warning');
								if(showTs==null){
									alert('温馨提示：要参加"霸屏抢楼"活动每次霸屏金额必须大于等于 10元 才算排序哦！');
									localStorage.setItem(loveYou.date+'qixi_warning',1);		
								}
							}		
						}	
					}	
				}catch(ex){}
			},
            ready:function(){
				try{
					newImgUpload.max = 1;
				}catch(ex){}
				this.find('.wm_slideFoot .btnNormal').css({margin:0});
            	var t = this;
                this.find('.wm_slideBody').css({'overflow-x':'inherit'});
                var showNum = 1;
                this.find('.bpTimeTitleSelect').on('click',function(){
                	if(my.isAdmin&&my.free>0)
                		return showInfo('管理员不能设置连续霸屏',false);
				});
                this.find('#select').on('change',function(){
					interact.warning();
                    var v1 = $(this).val();
                    var v2 = $(this).find('option:selected').text();
                    t.find('#bpText1').html(v2).attr('data-num',v1);
					if(t.find('.oneBpTime.sel').length==0)
						return;
                    var bpMoney = t.find('.oneBpTime.sel').attr('data-price');
                    bpMoney = parseFloat(bpMoney);
                    var num = $.trim(t.find('#bpText1').attr('data-num'));
                    var all = bpMoney*num;
                    setMoney.math(my.redBagMoney,my.cash,true,all);
                });
                setMoney.checked(my.redBagMoney,my.cash,true,'bp');
                this.find('.oneBpTime').click(function(){
                	if($(this).hasClass('BpTimeNotCheck'))
                		return showInfo('该时长管理员不可选，可登录微喵后台取消该限制',false);
                	$(this).addClass('sel').siblings('.oneBpTime').removeClass('sel');
                	var bpMoney = $(this).attr('data-price');
                	var bpTime = $(this).attr('data-time');
                    bpTime = bpTime==undefined?0:bpTime;
                	if(bpTime<30)
                		t.find('.oneBpType').removeClass('sel');
                    bpMoney = parseFloat(bpMoney);
                    var num = $.trim(t.find('#bpText1').attr('data-num'));
                    var all = bpMoney*num;
                    setMoney.math(my.redBagMoney,my.cash,true,all);
					newImgUpload.change(bpTime);
				});
                this.find('.oneBpType').on('click',function(){
                	var bpTime = t.find('.oneBpTime.sel').attr('data-time');
                	bpTime = bpTime==undefined?0:bpTime;
                	if(bpTime<30)
                		return showInfo('霸屏时长大于30秒才可使用霸屏主题',false);
                	if($(this).hasClass('sel')){
                        $(this).removeClass('sel').siblings('.oneBpType').removeClass('sel');
					}else{
                        $(this).addClass('sel').siblings('.oneBpType').removeClass('sel');
					}
				})
            },
            onClose:function(){
                newImgUpload.clear();
            },
            click:function(b){
                var t = this;
                var v1 = $.trim(t.find('.oneBpTime.sel').attr('index'));
                if(v1==-1)
                    return showInfo('请选择霸屏时长',false,{top:'86%'});
                if(v1==''||v1==null)
                    return showInfo('请选择霸屏时长',false,{top:'86%'});
                //var img = $('.showMoneyHasImage').find('.img');
				var imgArr = $('.oneUploadImg.show');
				var videoArr = $('.oneUploadVideo');
                var txt = '';
                if(isForTa){
                    txt = $.trim(t.find('.isForTaInput').val());
                }else{

                    txt = $.trim(t.find('#_bpWord').val());
                    if(txt.length==0&&imgArr.length==0&&videoArr.length==0)
                        return showInfo('请输入霸屏语或者上传图片',false,{top:'86%'});
                }

                var _len = getTextLength(txt);
                if(_len>40)
                    return showInfo('霸屏上墙语不能超过40字',false,{top:'86%'});
                var time = $.trim(t.find('.oneBpTime.sel').attr('data-time'));
                txt = txt.replace(/</g,'');
                txt = txt.replace(/>/g,'');
                //敏感词
                txt = keyWord.replace(txt);
				var imgSrcList = '';
				for(var j=0;j<imgArr.length;j++){
					if($(imgArr[j]).find('.img').attr('bigSrc')!='undefined'&&$(imgArr[j]).find('.img').attr('bigSrc')!=undefined){
						if(j>0)
							imgSrcList += ',';
						imgSrcList += $(imgArr[j]).find('.img').attr('bigSrc');
					}
				}
				/*
                var imgSrc = img.length>0?img.attr('bigSrc'):"";

                if(img.length>0&&($(img).attr('bigSrc')=='undefined'||$(img).attr('bigSrc')==undefined))
                    return showInfo('您上传的图片不可用，请重新上传',false,{top:'86%'});
				*/
                var msgId="",userId="";
                if(isForTa){
                    imgSrcList = $(e.parentNode.parentNode.parentNode.parentNode.parentNode).find('.bg').attr('bigSrc');
                    if(imgSrcList=='undefined'||imgSrcList==undefined)
                        return showInfo('此图片不可用',false,{top:'86%'});
                    msgId = $(e.parentNode.parentNode.parentNode.parentNode.parentNode).attr('tid');
                    userId = $(e.parentNode.parentNode.parentNode.parentNode.parentNode).attr('userId');
                }
                //系统词语检测
                if(!keyWord.check(txt))
                    return showInfo('请勿发布广告等不适内容',false,{top:'86%'});
                isAjax = true;
				var moneyMsg = setMoney.getMsg();
                var _price = t.find('#price').html();
                var showNum = $.trim(this.find('#bpText1').attr('data-num'))==undefined?'1':$.trim(this.find('#bpText1').attr('data-num'));
                var theme  = this.find('.oneBpType.sel').attr('data-type')==undefined?null:this.find('.oneBpType.sel').attr('data-type');
                var dt = {
                    sit:my.sit,
                    time:time,
                    imgSrc:imgSrcList,
                    txt:txt,
                    msgId:msgId,
                    userId:userId,
                    showNum:showNum,
                    videoUrl:null,
                    theme:theme,
					type:moneyMsg.type,
					barId:barbaseId
                }
                if(uploadVideo.hasVideo){
					if(videoArr.length>0)
						dt.imgSrc = videoArr.find('.img').attr('bigSrc')||videoPosterBigImg;	
                    dt.videoUrl = uploadVideo.videoUrl;
				}
				var _Val = [];
				var _spSrc = dt.imgSrc.split(',');
				for(var j=0;j<_spSrc.length;j++){
					if(_spSrc[j].length>0&&_spSrc[j]!='')
						_Val.push(_spSrc[j]);	
				}
				if(txt.length==0&&_Val.length==0)
                	return showInfo('请输入霸屏语或者上传图片',false,{top:'86%'});
				dt.imgSrc = _Val.join(',');
                var btn = this.getButton()[0];
                WM.Phone.setButton(btn,false);
                this.cover(true);
                ajax_rich(dt,function(isFree,url,waitNum){
                    //跳转支付
                    if((my.isAdmin && my.free>=showNum) || moneyMsg.bool){
                    	window.location.href = url;
						/*ajax_bpPay(url,function(toPay){
							if(toPay){
								window.location.href = url;
								return;	
							}
							if(my.isAdmin&&my.freeDs>0)
								my.free = my.free-1;
							else if(moneyMsg.bool){
								var _money = parseInt(t.find('#select').val())*t.find('.oneBpTime.sel').attr('data-price');
								_money = parseFloat(_money);
								if(moneyMsg.type==1){
									my.redBagMoney -= _money;			
								}else if(moneyMsg.type==2){
									my.cash -= _money;
								}	
							}
							t.cover(false);
							t.close();
							showInfo('霸屏成功');				
						},function(errorMsg){
							t.cover(false);
							WM.Phone.setButton(btn,true);
							showInfo(errorMsg||'操作失败',false);
						});*/
                        return;
                    }
					waitNum = (waitNum==null||waitNum.length==0)?0:parseInt(waitNum);
                    WM.Phone.get({
                        type:'confirm',
                        title:'支付确认',
                        innerHTML:(waitNum>3?'当前排队'+waitNum+'人，':'')+'确定支付 '+moneyMsg.price+'?',
                        click:function(bb){
                            this.close();
                            if(!bb){
                                t.cover(false);
                                isAjax = false;
                                return WM.Phone.setButton(btn,true);
                            }
                            window.location.href = url;
                        }
                    });
                },function(errorMsg,bool){
                    isAjax = false;
                    WM.Phone.setButton(btn,true);
                    t.cover(false);
                    showInfo(errorMsg||'操作失败',false,{top:'86%'});
                    if(isForTa&&bool){
                        var row = e.parentNode.parentNode.parentNode.parentNode.parentNode;
                        if(row!=null){
                            var uid = $(row).attr('tid');
                            ajax_del(uid,true,function(){
                                $(row).remove();
                            },function(errorMsg){});
                        }
                    }
                });
            }
        });
	},
	showMoney:function(e,bool){
		return this._showMoney(e,bool);
	},
	sendCake:function(e){
		return;
	}
}


//获取缩略图
var getPoster = {
	isIos:function(){
		var u = navigator.userAgent;
    	//var isIos = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
        var isIos =/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)
		return isIos;
	},
	num:2,
	errorNum:0,
	getMiddle:function(video,duration,dt){
		var time = duration/(getPoster.num+1);
		var start = 0,srcTime = [];
		for(var x=0;x<getPoster.num;x++){
			start += time;
			srcTime.push(start);
		}	
		var index = 0;
		var srcList = [];
		(function(){
			var arg = arguments.callee;
			video.currentTime = srcTime[index];
			video.play();
			video.pause();
			setTimeout(function(){
				var src = getPoster.getSrc(video,400);
				srcList.push(src);
				index++;
				if(index>=getPoster.num){
					$('#preloadVideoBox').remove();	
					if(dt.complete)
						dt.complete(srcList);	
				}else{
					setTimeout(arg,60);
				}
			},400);
		})();
	},
	init:function(dt){
		var html = '<div id="preloadVideoBox" style="visibility:hidden; position:absolute; width:0; height:0; overflow:hidden;"><video id="preloadVideo"></video></div>';
		$(html).appendTo($('body'));
		
		var timeout = null;
		$('#preloadVideo').unbind('canplaythrough').bind('canplaythrough',function(){
			$('#preloadVideo').unbind('canplaythrough error stalled');
			var loadTime = this.buffered.end(0)-0.1;
			loadTime = loadTime<0?0.1:loadTime;
			if(loadTime>0)
				this.currentTime = loadTime;
			var t = this;
			setTimeout(function(){
				var src = getPoster.getSrc(t,800);	
				$('#preloadVideoBox').remove();
				if(dt.complete)
					dt.complete(src);				
			},500);
		});
		$('#preloadVideo').unbind('error stalled').bind('error stalled',function(){
			$('#preloadVideoBox').remove();
			getPoster.errorNum++;
			if(getPoster.errorNum<3){
				try{
					clearTimeout(timeout);	
				}catch(ex){}
				timeout = setTimeout(function(){
					getPoster.init(dt);		
				},60);	
			}else{
				if(dt.error)
					dt.error();		
			}
		});
		$('#preloadVideo').attr({src:dt.src});
		$('#preloadVideo')[0].load();
		if(getPoster.isIos()){
			WM.Phone.get({
				title:'视频上传',
				type:'alert',
				innerHTML:'<div style="text-align:center">点击确定开始上传视频</div>',
				click:function(){
					try{
						$('#preloadVideo')[0].load();
					}catch(ex){}
					this.close();	
				}
			});	
		}
	},
	getSrc:function(video,cutWidth,cutHeight){
		var width = nw = $(video).width();
		var height = nh = $(video).height();
		if(cutWidth!=null&&cutHeight==null){
			width = cutWidth = cutWidth>width?width:cutWidth;
			height = cutHeight = cutWidth*nh/nw;
		}else if(cutHeight!=null&&cutWidth==null){
			height = cutHeight = cutHeight>height?height:cutHeight;
			width = cutWidth = cutHeight*nw/nh;
		}else if(cutWidth==null&&cutWidth==null){
			cutWidth = width;
			cutHeight = height;
		}else{
			cutWidth = cutWidth>width?width:cutWidth;
			cutHeight = cutHeight>height?height:cutHeight;
			var dirW = width/cutWidth;
			var dirH = height/cutHeight;
			if(dirW<=dirH){
				width = cutWidth;
				height = width*nh/nw;		
			}else{
				height = cutHeight;
				width = height*nw/nh;
			}
		}
		var canvas = document.createElement("canvas");
        var context = canvas.getContext("2d");
		canvas.width = cutWidth;  
        canvas.height = cutHeight;	
		var cx = 0,cy = 0;
		if(cutWidth<width){
			cx = (cutWidth-width)/2;
		}
		if(cutHeight<height){
			cy = (cutHeight-height)/2;
		}
		context.drawImage(video,cx,cy,width,height);
		var dataUrl = canvas.toDataURL('image/jpeg',0.8);
		delete canvas;
		return dataUrl;		
	},
	play:function(e){
		var img = $(e).find('.bg');
		if(img.length==0)
			return;
		var url = img.attr('videoUrl');
		if(url==null||url=='null'||url==''||url=='undefined')
			return;
		var lo = new WM.Phone.loading();
		
		var html = '<div id="_preloadVideoBox" style="visibility:hidden; position:absolute; width:0; height:0; overflow:hidden;"><video id="_preloadVideo"></video></div>';	
		$(html).appendTo($('body'));
		$('#_preloadVideo').unbind('canplaythrough').bind('canplaythrough',function(){
			lo.close();
			$('#_preloadVideoBox').remove();
			$('#videoBox video').attr({src:url});
			$('#videoBox').show();
		});
		$('#_preloadVideo').unbind('stalled error').bind('stalled error',function(){
			lo.close();
			$('#_preloadVideoBox').remove();
			return showInfo('视频加载失败',false);
		});
		$('#_preloadVideo').attr({src:url});
		$('#_preloadVideo')[0].load();
	},
	close:function(){
		$('#videoBox video').removeAttr('src');
		$('#videoBox').hide();	
	}
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
	down:function(bool){
		bool = bool==null?false:bool;
		try{clearTimeout(onWallScroll.timeout)}catch(ex){}
		this.timeout = setTimeout(function(){
			var h = $(document).height()-$(window).height();
			if(bool||h-onWallScroll.top<=onWallScroll.len){
				$('html,body').stop().animate({scrollTop:h},onWallScroll.animateTime);		
			}			
		},onWallScroll.delay);
	}
}

//显示游戏
var allGame = {
	game:[],
	other:[],
	max:8,
	init:function(){
		if(activeUrl.gameUrl==null||activeUrl.gameUrl=='')
			return;
		for(var i in activeUrl.gameUrl){
			var e = activeUrl.gameUrl[i];
			if(e.url!=null&&e.url!=''&&e.url!='null'){
				e.name = i;
				this.game.push(e);		
			}
		}
		if(activeUrl.otherUrl==null||activeUrl.otherUrl=='')
			return;
		for(var i in activeUrl.otherUrl){
			var e = activeUrl.otherUrl[i];
			if(e.url!=null&&e.url!=''&&e.url!='null'){
				e.name = i;
				this.other.push(e);		
			}
		}
	},
	show:function(){
		var html = '';
		var useSwp = false;
		if(this.game.length>this.max){
			useSwp = true;
			html = '<div class="swiper-container" id="swiper-containerGame" style="padding-bottom:15px">';	
			html += '<div class="swiper-pagination" id="swiper-paginationGame" style="bottom:0px">&nbsp;</div>';
			html += '<div class="swiper-wrapper">';		
		}else
			html += '<div class="allGameDiv">';
		for(var x=0;x<this.game.length;x++){
			if(x%this.max==0&&useSwp){
				html += '<div class="swiper-slide">';
			}	
			var e = this.game[x];
			html += '<a class="newModuleSpan" href="'+e.url+'">';
			html += '<i class="newModuleIcon icon_module '+e.icon+'"></i>';
			html += '<tt class="ellipsis">'+e.name+'</tt>';
			html += '</a>';
			if(((x+1)%this.max==0&&x>0)||x==this.game.length-1){
				html += '<div style="clear:both"></div>';
				if(useSwp)
					html += '</div>';
			}
		}
		if(useSwp)
			html += '</div></div>';
		else
			html += '</div>';
		html += '<div class="wm_slideRowTitle" style="margin-top:5px">其他功能</div>';
		var useSwp2 = false;
		if(this.other.length>this.max){
			useSwp2 = true;
			html += '<div class="swiper-container" id="swiper-containerOther" style="padding-bottom:15px">';	
			html += '<div class="swiper-pagination" id="swiper-paginationOther" style="bottom:0px">&nbsp;</div>';
			html += '<div class="swiper-wrapper">';		
		}else
			html += '<div class="allGameDiv">';
		for(var x=0;x<this.other.length;x++){
			if(x%this.max==0&&useSwp2){
				html += '<div class="swiper-slide">';
			}	
			var e = this.other[x];
			html += '<a class="newModuleSpan" href="'+e.url+'">';
			html += '<i class="newModuleIcon icon_module '+e.icon+'"></i>';
			html += '<tt class="ellipsis">'+e.name+'</tt>';
			html += '</a>';
			if(((x+1)%this.max==0&&x>0)||x==this.other.length-1){
				html += '<div style="clear:both"></div>';
				if(useSwp2)
					html += '</div>';
			}
		}
		if(useSwp2)
			html += '</div></div>';
		else
			html += '</div>';
		WM.Phone.get({
			type:'slideBox',
			title:'游戏',
			html:html,
			hasFoot:false,
			ready:function(){
				if(useSwp){
					new Swiper('#swiper-containerGame',{
						pagination : '#swiper-paginationGame'
					});		
				}
				if(useSwp2){
					new Swiper('#swiper-containerOther',{
						pagination : '#swiper-paginationOther'
					});		
				}
			}
		});
	}
}

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

//改变白天黑夜的样式
var changeColor = function(e){
	if($(e).hasClass('onWallPhoneIcon_sun')){
        $(e).removeClass('onWallPhoneIcon_sun').addClass('onWallPhoneIcon_night');
        $('body').addClass('onWall_night');
        localStorage.setItem('cName','onWall_night');
	}else{
        $('body').removeClass('onWall_night');
        $(e).removeClass('onWallPhoneIcon_night').addClass('onWallPhoneIcon_sun');
        localStorage.setItem('cName','');
	}
}

// 储存状态
var setStorage = function(){
    var cName = localStorage.getItem('cName')==null?'':localStorage.getItem('cName');
    var cName2 = cName==''?'onWallPhoneIcon_sun':'onWallPhoneIcon_night';
    $('body').attr('class',cName);
    $('#isNight').attr('class',cName2);
};

//我的
var mySlider = function(e){
	var closeId = WM.Phone.getId();
	var nickName = $.trim($('#my_name').val());
	var ms = $.trim($('#my_txt').val());
	var sexName = my.sex=='man'?'icon_sex_man':'icon_sex_women';
	var html='<div class="mySlider">';
	html += '<div class="mySlider_title">我<a class="my_icon_close" id="'+closeId+'"></a></div>';
	html += '<div class="mySlider_msg">';
	html += '<div class="msg_userHead">';
	html += '<img src="'+my.head+'" alt="">';
	html += '<div class="icon_sex '+sexName+'"></div></div>';
	html += '<div class="userContent">';
	html += '<div class="userTableCell">';
	html += '<span>'+nickName+'<i class="userNameIcon"></i></span>';
	html += '<span>'+my.age+'岁&nbsp;'+my.cm+'cm&nbsp;'+my.kg+'kg</span>';
	html += '<span>'+ms+'</span>';
	html += '</div></div>';
	html += '<div class="userLink"><a href="'+my.url+'">编辑资料</a></div>';
	html += '</div>';
	html += '<div class="mySlider_footer">';
	var one = '';
	for(var i=0;i<msg.length;i++){
		html += '<a href="'+msg[i].url+'">';
        html += '<span class="icon_span"><i class="'+msg[i].icon+'"></i></span>';
        html += '<span>'+msg[i].text+'</span>';
		html += '</a>';
	}
	html += '</div></div>';
    WM.Phone.get({
        type:'slideBox',
        html:html,
		style:{padding:0},
        hasFoot:false,
		ready:function(){
        	var t = this;
            this.find('.wm_slideBody').css({padding:0,'border-radius':'4px 4px 0 0'});
            this.find('#'+closeId).on('click',function(){
                t.close();
            });
            if(my.noRead&&my.noRead>0){
                this.find('.my_icon_msg').parents('.icon_span').append($('<b class="my_noRead">'+my.noRead+'</b>'));
            }
            if(my.isAdmin&&my.adminCheck){
                this.find('.my_icon_check').parents('a').show();
            }else{
                this.find('.my_icon_check').parents('a').hide();
            }
		}
    });
}

//跑马灯
var marquee = {
	inter:null,
	_init:function(delay){
		var _qixiBar = typeof qixiBar=='undefined'?'false':qixiBar;
		_qixiBar = document.title.indexOf('胡桃里')!=-1?'false':_qixiBar;
		/*
		var mTime = new Date();
		var hor = parseInt(mTime.getHours());
		var b = false;
		if(hor>=12&&hor<=15){
			b = true;
			if(b==23){
				if(parseInt(mTime.getMinutes())>0)
					b = false;		
			}
		}
		*/
		ajax_getMarquee(function(arr){
			if(arr==null||arr.length==0)
				arr = [];
			/*
			if(typeof _qixiBar!='undefined'&&_qixiBar=='true'){
				if(typeof sysDate!='undefined'){
					var nowDate = sysDate.split(' ');
					if(nowDate.length>0){
						if(nowDate[0]=='2017-08-26'||nowDate[0]=='2017-08-27'||nowDate[0]=='2017-08-28'){
							arr.push('七夕【霸屏】示爱！霸屏排序末位逢7中奖！');
							arr.push('霸屏中奖者，点击手机右侧"中奖查询"兑奖');	
						}else if(nowDate[0]=='2017-08-24'||nowDate[0]=='2017-08-25'){
							arr.push('本周六至下周一，七夕霸屏狂送礼，等你哦~');	
						}
					}
				}
			}
			*/
			/*
			if(typeof sysDate!='undefined'){
				var nowDate = sysDate.split(' ');	
				if(nowDate.length>0&&nowDate[0]=='2017-07-28'){
					if(b&&typeof isActiveBar!='undefined'&&isActiveBar=='true')
						arr.push('本周六狂送10万元YSL口红，要来玩哦~');			
				}
			}
			*/
			if(arr.length==0)
				return;
			marquee.create(arr);
			setTimeout(function(){
				$('.marqureeBox').addClass('show');
				$('.wm_main').addClass('hasMarquree');
				$('.fixedIcon').addClass('hasMarquree');				
			},100);
			marquee.run(delay);	
		},function(){
			
		});	
	},
	init:function(arr){
		if(arr==null||arr.length==0)
			return;
		var newArr = [];
		for(var i=0;i<arr.length;i++){
			if(arr[i].content!=null&&arr[i].content!=''){
				if(arr[i].content.indexOf('关注公众号"微喵WEMEW"')==-1){
					newArr.push(arr[i].content);
				}
			}
		}
		marquee.create(newArr);
		setTimeout(function(){
			$('.marqureeBox').addClass('show');
			$('.wm_main').addClass('hasMarquree');
			$('.fixedIcon').addClass('hasMarquree');				
		},100);
		marquee.run(6000);			
	},
	create:function(arr){
		var html = '';
		for(var x=0;x<arr.length;x++){
			html += '<li><span class="tableSpan">'+arr[x]+'</span></li>';	
		}
		$('.marqureeUl').html(html);
	},
	run:function(delay){
		if($('.marqureeUl li').length<=1)
			return;
		delay = delay||6000;
		setTimeout(function(){
			if($('.marqureeUl li').length<=1){
				if($('.marqureeUl li').length==0){
					$('.marqureeBox').removeClass('show');
					$('.wm_main').removeClass('hasMarquree');
					$('.fixedIcon').removeClass('hasMarquree');
				}
				return;	
			}
			$('.marqureeUl').css({transition:'transform 0.5s'});
			setTimeout(function(){
				$('.marqureeUl').css({transform:'translate(0,-32px)'});	
				setTimeout(function(){
					$('.marqureeUl').css({transition:'none'});
					setTimeout(function(){
						var first = $('.marqureeUl li')[0];
						$('.marqureeUl')[0].appendChild(first);
						$('.marqureeUl').css({transform:'translate(0,0)'});		
					},200);	
				},600)
			},100);
			setTimeout(arguments.callee,delay);					
		},delay);	
	}
}

//皮肤
var skin = {
	sel:0,
	_init:function(){
		var x = localStorage.getItem('_skinBg');
		x = x==null?3:x;
		this.change(x);
	},
	_change:function(type){
		this.sel = type;
		localStorage.setItem('_skinBg',type);
		type = type==0?'skinBg-sky':(type==1?'skinBg-night':(type==2?'skinBg-magic':'skinBg-halloween'));
		$('body').removeClass('skinBg-sky skinBg-night skinBg-magic skinBg-halloween').addClass(type);
	},
	init:function(){
		// return this._init();
		var x = localStorage.getItem('skinBg');
		x = x==null?0:x;
		this.change(x);
	},
	change:function(type){
		return this._change(type);
		this.sel = type;
		localStorage.setItem('skinBg',type);
		type = type==0?'skinBg-sky':(type==1?'skinBg-night':'skinBg-magic');
		$('body').removeClass('skinBg-sky skinBg-night skinBg-magic').addClass(type);
	},
	show:function(){
		var html = '<div class="FuckUser">';
		html += '<div class="FuckHead">皮肤<a class="FuckYou_close"></a></div>';
		html += '';
		html += '</div>';
		html += '<div class="skin-img">';
		html += '<a><img src="'+allImageUrl+'skinSky-sel.png" /><i class="skin-sel"></i><p>星空</p></a>';
		html += '<a><img src="'+allImageUrl+'skinNight-sel.png" /><i class="skin-sel"></i><p>雨夜</p></a>';
		html += '<a><img src="'+allImageUrl+'skinMagic-sel.png" /><i class="skin-sel"></i><p>魔法</p></a>';
		html += '</div>';	
		WM.Phone.get({
			type:'slideBox',
			position:'absolute',
			style:{padding:0},
			hasFoot:false,
			html:html,
			ready:function(){
				var t = this;
				this.find('.wm_slideBody').css({padding:0,'border-radius':'4px 4px 0 0'});
				this.find('.FuckYou_close').bind('click',function(){
					t.close();
				});
				if(skin.sel!=null){
					this.find('.skin-img a').eq(skin.sel).addClass('sel-skin');
				}
				this.find('.skin-img a').bind('click',function(){
					if($(this).hasClass('sel-skin'))
						return t.close();	
					t.find('.sel-skin').removeClass('sel-skin');
					$(this).addClass('sel-skin');
					skin.change($(this).index());
					t.close();
				});
			}
		});	
	}
}

var preloadImage = function(imgList){
	for(var x=0;x<imgList.length;x++){
		var img = new Image();
		img.src = imgList[x];
	}
}

var setGoldUser = function(user){
	if(user==null)
		return;
	user = user.length>0?user[0]:user;
	var img = new Image();
	img.onload = function(){
		$('.fixedIcon-gold').html('<img class="goldUser" src="'+user.head+'" /><img class="newIc-gold" src="'+allImageUrl+'newIc-gold-hollow.png" />');	
	}
	img.src = allImageUrl+'newIc-gold-hollow.png';
}

//fixed定位时ios确保输入框可见
var setInput = function(){
	var u = navigator.userAgent;
    var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
    //var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
    var isiOS =/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)
	var inter = null;
	var timeout = null
	$('#txt').bind('click',function(ev){
		if(isiOS){		
			timeout = setTimeout(function(){
				document.body.scrollTop = document.body.scrollHeight;
			},500);		
		}
		clearInterval(inter);
		$('.fixedIcon').hide();
		var oHeight = window.innerHeight;
		inter = setInterval(function(){
			if(window.innerHeight==oHeight){
				clearInterval(inter);
				$('.fixedIcon').show();	
			}
		},500);
	}).bind('blur',function(){
		if(isiOS){
			clearTimeout(timeout);
		}
		clearInterval(inter);
		$('.newWallHead').show();
		$('.fixedIcon').show();
	});	
}

var otherMenu = {
	type:0,
	init:function(){
		$('#txt').unbind('focus').bind('focus',function(){
			otherMenu.hide();	
		});		
	},
	show:function(){
		if($('.otherMenu').length==0)
			return;
		if(this.type==1)
			return;
		var width = $('.otherMenu')[0].offsetWidth-15;
		$('.newFoot-inputBox').css({'padding-right':width+'px'});
		$('.otherMenu').addClass('show');
		$('.newIc-showBox').addClass('hide');
		this.type = 1;
	},
	hide:function(){
		if(this.type==0)
			return;
		$('.newFoot-inputBox').css({'padding-right':0});
		$('.otherMenu').removeClass('show');
		$('.newIc-showBox').removeClass('hide');
		this.type = 0;	
	}
}

// 土豪榜
var richer = {
    show:function(){
        if(richerData==null||richerData==undefined)
            return showInfo('正在初始化榜单数据',false);
        if(typeof richerData.all=='undefined'||richerData.all==''||richerData.all==null)
        	richerData.all = [];
        if(typeof richerData.now=='undefined'||richerData.now==''||richerData.now==null)
        	richerData.now = [];
        var html = '';
        html += '<div class="richer">';
        html += '<div class="richerHead">壕榜<a class="richerClose"></a></div>';
        html += '<div class="richerTitle">';
        html += '<a class="richerChecked">今夜壕榜<img class="checkedImg" src="'+allImageUrl+'richer_checked.png?id=44" alt=""></a>';
        html += '<a>总壕榜<img class="checkedImg" src="'+allImageUrl+'richer_checked.png?id=44" alt=""></a>';
        html += '</div>';
        html += '<div class="richerContent">';
        for(var i=0;i<3;i++){
            if(i==0){
                html += '<div class="richerBox richerCenter">';
                html += '<img class="richerImg richerIcon" src="'+allImageUrl+'richer_first.png?id=1" alt="">';
            }else if(i==1){
                html += '<div class="richerBox richerLeft">';
                html += '<img class="richerImg richerIcon" src="'+allImageUrl+'richer_third.png?id=12" alt="">';
            }else if(i==2){
                html += '<div class="richerBox richerRight">';
                html += '<img class="richerImg richerIcon" src="'+allImageUrl+'richer_second.png?id=232" alt="">';
            }
            html += '<img class="richerImg richerHeadImg" alt="">';
            html += '<div class="richerText">';
            html += '<div class="mt35 pd10">';
            html += '<span class="richerName">--</span>';
            // html += '<span class="richerBp">--</span>';
            // html += '<span class="richerDs">--</span>';
            html += '</div></div></div>';
        }
        html += '</div></div>';
        WM.Phone.get({
            type:'slideBox',
            position:'absolute',
            style:{padding:0},
            hasFoot:false,
            html:html,
            ready:function(){
                var t = this;
                this.find('.wm_slideBody').css({padding:0,'border-radius':'4px 4px 0 0'});
                this.find('.richerClose').bind('click',function(){
                    t.close();
                });
                var now = richerData.now,all = richerData.all;
                var center = this.find('.richerCenter');
                var left = this.find('.richerLeft');
                var right = this.find('.richerRight');
                var setNull = function(){
                    t.find('.richerHeadImg').hide().attr('src','');
                    t.find('.richerName').css('visibility','hidden').html();
                    // t.find('.richerBp').css('visibility','hidden').html();
                    // t.find('.richerDs').css('visibility','hidden').html();
					t.find('.richerBox').unbind('click');
                };
                var setNow = function(){
                    for(var i=0;i<now.length;i++){
                    	var style = now[i].sex?'2px solid #2193fe':'2px solid #ff5092';
                        t.find('.richerHeadImg').eq(i).show().css({'border':style}).attr('src',now[i].shead);
                        // t.find('.richerHeadImg').eq(i).show().attr('src',now[i].shead);
                        var cName = now[i].sex?'richerMan':'richerWomen';
                        t.find('.richerName').eq(i).css('visibility','visible').html('<i class="richerNameText">'+now[i].nickname+'</i>');
                        // t.find('.richerBp').eq(i).css('visibility','visible').html('霸屏'+now[i].bptimes+'次');
                        // t.find('.richerDs').eq(i).css('visibility','visible').html('打赏'+now[i].dstimes+'次');
                    }
					for(var i=0;i<now.length;i++){
						(function(i){
							var e = now[i];
							var url = my.url;
							if(e.id!=my.userId){
								url = '/cwechat/talkhome?sendid='+e.id+'';
							}
							t.find('.richerBox').eq(i).attr({'src':e.shead,'userId':e.id,'data-src':e.head,'data-age':e.age||'','data-job':e.job||'','data-kg':e.kg||'','data-sex':e.sex?'man':'woman','data-cm':e.cm||'','data-txt':e.txt||'','data-url':url}).bind('click',function(){
								active.show(this);	
							});
						})(i);
					}
                }
                var setAll = function(){
                    for(var i=0;i<all.length;i++){
                        var style = all[i].sex?'2px solid #2193fe':'2px solid #ff5092';
                        t.find('.richerHeadImg').eq(i).show().css({'border':style}).attr('src',all[i].shead);
                        // t.find('.richerHeadImg').eq(i).show().attr('src',all[i].shead);
                        var cName = all[i].sex?'richerMan':'richerWomen';
                        t.find('.richerName').eq(i).css('visibility','visible').html('<i class="richerNameText">'+all[i].nickname+'</i>');
                        // t.find('.richerBp').eq(i).css('visibility','visible').html('霸屏'+all[i].bptimes+'次');
                        // t.find('.richerDs').eq(i).css('visibility','visible').html('打赏'+all[i].dstimes+'次');
                    }
					for(var i=0;i<all.length;i++){
						(function(i){
							var e = all[i];
							var url = my.url;
							if(e.id!=my.userId){
								url = '/cwechat/talkhome?sendid='+e.id+'';
							}
							t.find('.richerBox').eq(i).attr({'src':e.shead,'userId':e.id,'data-src':e.head,'data-age':e.age||'','data-job':e.job||'','data-kg':e.kg||'','data-sex':e.sex?'man':'woman','data-cm':e.cm||'','data-txt':e.txt||'','data-url':url}).bind('click',function(){
								active.show(this);	
							});
						})(i);
					}
                }
                setNull();
                setNow();
                this.find('.richerTitle').find('a').on('click',function(){
                    $(this).addClass('richerChecked').siblings('a').removeClass('richerChecked');
                    setNull();
                    if($(this).index()==0){
                        setNow();
                    }else if($(this).index()==1){
                        setAll();
                    }
                })
            }
        });
    }
};


//撩啦
/*
100m以内 500m以内 1km以内 1km以外
*/
var newTalk = {
	wait:null,
	address:false,
	ready:false,
	user1:null,
	user2:null,
	idList:[],
	allUser:null,
	getLen:function(len){
		len = (len==null||len.length==0)?0:parseFloat(len);
		if(len<1000)
			return len+'m';
		else
			return parseFloat(len/1000).toFixed(1)+'km';
	},
	ajax:function(fn){
		if(this.wait!=null)
			return;
		this.wait = new WM.Phone.waiting({text:'正在获取用户',hasCover:false,clickClose:false});
		ajax_getAllUser(function(user1,user2,headUser){
			newTalk.ready = true;
			user1 = user1==null?[]:user1;   // 场内
			user2 = user2==null?[]:user2;   // 理我最近
			user1 = newTalk.delUser(user1,headUser);
			user2 = newTalk.delUser(user2,headUser);
			newTalk.user1 = user1;
			newTalk.user2 = user2;
			for(var i=0;i<user1.length;i++)
				newTalk.idList.push(user1[i].userId);
			var newArr = [],newUser2 = [],newId = [];
			for(var x=0;x<user1.length;x++){
				var e = user1[x];
				if(newId.indexOf(e.userId)==-1&&e.userId!=my.userId){
					newArr.push(e);	
					newId.push(e.userId);		
				}
			}
			for(var y=0;y<user2.length;y++){
				var e = user2[y];
				if(newId.indexOf(e.userId)==-1&&e.userId!=my.userId){
                    newUser2.push(e);
					newId.push(e.userId);	
				}
			}
            newTalk.user1 =newArr;
            newTalk.user2 =newUser2;
			if(fn)
				fn();
		},function(){
            newTalk.user1 = [];
			newTalk.user2 = [];
			if(fn)
				fn();
		});
		newTalk.getStorage();
	},
	delUser:function(user,headUser){
		var arr = [];
		for(var i=0;i<user.length;i++){
			if(headUser.indexOf(user[i].userId)==-1){
				arr.push(user[i]);
			}
		}
		return arr;
	},
	pickUser:function(type){
		if(type==1)
			return this.user1;
		else if(type==2)
			return this.user2;
		else if(type=='man'||type=='woman'){
			var newArr = [];
			var arr = this.allUser;
			for(var x=0;x<arr.length;x++){
				var e = arr[x];
				if(e.sex==type)
					newArr.push(e);		
			}
			return newArr;
		}
	},
	_pickUser:function(type){
        var arr1=[],arr2=[];
        if(type=='all'){
        	arr1 = this.user1;
        	arr2 = this.user2;
		}else{
            for(var x=0;x<this.user1.length;x++){
                var e1 = this.user1[x];
                if(e1.sex==type){
                    arr1.push(e1);
                }
            }
            for(var x1=0;x1<this.user2.length;x1++){
                var e2 = this.user2[x1];
                if(e2.sex==type){
                    arr2.push(e2);
                }
            }
		}
        return {
            user1:arr1,
            user2:arr2
        }
	},
	sex:'all',  //all--全部 man--男 woman--女
	_create:function(dt,type,bool){   // bool true--场内 false-理我最近
		var str = '';
        str += '<div class="newTalkList">';
		for(var x=0;x<dt.length;x++){
			var e = dt[x];
			var cName = e.sex=='man'?'awayMan':'awayWomen';
			//type=insite
			if(type=='all'){
                var url = '/cwechat/talkhome?sendid='+e.userId;
                if(bool)
                    url += '&type=insite';
                str += '<a class="FuckOne '+e.sex+'" userId="'+e.userId+'" data-src="'+e.bigHead+'" data-name="'+e.userName+'" data-age="'+e.age+'" data-job="'+e.job+'" data-kg="'+e.kg+'" data-sex="'+e.sex+'" data-cm="'+e.cm+'" data-txt="'+e.txt+'" data-url="'+url+'" onclick="active.show(this)"><span class="FuckOneSpan"><img src="'+e.head+'" />';
                if(e.len!=null)
                    str += '<i><b class="ellipsis '+cName+'">'+this.getLen(e.len)+'</b></i>';
                str += '</span><tt class="ellipsis">'+dt[x].userName+'</tt></a>';
            }else if(type==e.sex){
                var url = '/cwechat/talkhome?sendid='+e.userId;
                if(bool)
                    url += '&type=insite';
                str += '<a class="FuckOne '+e.sex+'" userId="'+e.userId+'" data-src="'+e.bigHead+'" data-name="'+e.userName+'" data-age="'+e.age+'" data-job="'+e.job+'" data-kg="'+e.kg+'" data-sex="'+e.sex+'" data-cm="'+e.cm+'" data-txt="'+e.txt+'" data-url="'+url+'" onclick="active.show(this)"><span class="FuckOneSpan"><img src="'+e.head+'" />';
                if(e.len!=null)
                    str += '<i><b class="ellipsis '+cName+'">'+this.getLen(e.len)+'</b></i>';
                str += '</span><tt class="ellipsis">'+dt[x].userName+'</tt></a>';
			}
		}
		str += '</div>';
		str = dt.length==0?'<div class="noFuckUser">没有用户</div>':str;
		return str;	
	},
	show:function(){
		if(typeof isshutup!='undefined'&&isshutup)
			return showInfo('私聊功能已关闭');
        //ajax_sendPos(); // 发送地理位置;
		//if(!newTalk.address)
			//return showInfo('正在获取您的地理位置,请稍候',false);
		if(!newTalk.ready){	
			newTalk.ajax(function(){
				if(newTalk.wait!=null)
					newTalk.wait.close();
				newTalk.show();	
			});
			return;
		}
        var list = newTalk._pickUser(this.sex);
		var selectVal = '<select><option value="all">全部</option><option value="woman">女性</option><option value="man">男性</option></select>';
		var clearPos = '<span class="clearPos">清除地理位置并退出</span>';
		// var html = '<div class="FuckUser">';
		// html += '<div class="FuckHead">撩啦<a class="FuckYou_close"></a></div>';
		// html += '</div>';
        list.user1 = list.user1.slice(0,32);
        list.user2 = list.user2.slice(0,32);
		var html= '';
		html += '<div class="FuckMain">';
		html += '<div id="wrapper1"><div id="scroller">';
		html += '<div class="FuckUserAll">';
		html += '<div class="user1">';
        html += '<div class="FuckTitle">'+clearPos+'<span class="FuckUser1">场内</span><a><i>全部<tt class="arrowDown"></tt></i>'+selectVal+'</a></div>';
        html += '<div class="NewTalkUser1">'+this._create(list.user1,this.sex,true)+'</div>';
		html += '</div>';
		html += '<div class="user2">';
        html += '<div class="FuckTitle"><span class="FuckUser2">附近</span></div>';
        html += '<div class="NewTalkUser2">'+this._create(list.user2,this.sex,false)+'</div>';
		html += '</div>';
		html += '</div>';
		html += '</div></div>';
		html += '</div>';
		WM.Phone.get({
			type:'slideBox',
			// position:'absolute',
			// style:{padding:0},
			title:'私聊',
			hasFoot:false,
			html:html,
			ready:function(){
				//iscroll
				document.getElementById('wrapper1').addEventListener('touchmove', function (e) { e.preventDefault();}, false);
				this.scrollObj = new iScroll('wrapper1',{ 
					checkDOMChanges:true,
					vScrollbar:false,
					hScroll:false,
					bounce:false
				});
				
				var t = this;
				// this.find('.wm_slideBody').css({padding:0,'border-radius':'4px 4px 0 0'});
				this.find('.FuckYou_close').bind('click',function(){
					t.close();
				});
				newTalk.setSelect(t);
				this.find('select').bind('change',function(){
					var newData = newTalk._pickUser(this.value);
					newTalk.sex = this.value;
                    localStorage.setItem('sex',this.value);
					$('.FuckTitle a i').html($(this).find('option:selected').html()+'<tt class="arrowDown"></tt>');
					// $('.FuckUser1').html('场内'+' '+newData.user1.length);
					// $('.FuckUser2').html('附近'+' '+newData.user2.length);
                    newData.user1 = newData.user1.slice(0,32);
                    newData.user2 = newData.user2.slice(0,32);
					var user1 = newTalk._create(newData.user1,this.value,true);
					var user2 = newTalk._create(newData.user2,this.value,false);
					t.find('.NewTalkUser1').html(user1);
					t.find('.NewTalkUser2').html(user2);
					t.scrollObj.refresh();	
				});
				this.find('.clearPos').on('click',function(){  // 清除地理位置
                    if($(this).hasClass('a'))
                        return;
                    $(this).addClass('a');
                    ajax_clearPos(function(){
                        t.close();
                    },function(){
                        t.close();
                    });
				})
			},
			onClose:function(){
				if(this.scrollObj)
					this.scrollObj.destroy();		
			}
		});	
	},
	setSelect:function(t){
		var sex = newTalk.sex;
		for(var i=0;i<t.find('select option').length;i++){
			if(t.find('select option').eq(i).val()==sex){
                t.find('select option[value="'+sex+'"]').prop('selected',true);
                t.find('.FuckTitle a i').html(t.find('select option[value="'+sex+'"]').html()+'<tt class="arrowDown"></tt>');
			}
		}
	},
	getStorage:function(){
		var sex = localStorage.getItem('sex');
		sex = sex==null?'all':sex;
		this.sex = sex;
    }
}

//点歌
var mySongs = {
    isFull:false,
	init:function(){
    	if(songsReady==true||songsReady=='true')
    		return showInfo('请管理员后台进行点歌设置，方可使用',false);
		var tCover = new WM.Phone.waiting({text:'微喵正在为您加载',hasCover:false,clickClose:false});
		ajax_songsReady(function(data){
			var html = '<div class="songsBox">';
			html += '<div class="songsNav clearfix">';
			html += '<a class="checked">我要点歌&nbsp;'+data.all.length+'<div class="chose"></div></a>';
			html += '<a>今夜已点&nbsp;'+data.checked.length+'<div class="chose"></div></a>';
			html += '</div>';
			html += '<div class="songsBody">';
			if(data.all.length==0)
				html += '<div class="songsBodyBox list" style="padding:15px 0;text-align:center;display:block;">没有歌曲列表</div>';
			else
				html += mySongs.create(data.all,true);
			if(data.checked.length==0)
				html += '<div class="songsBodyBox listed" style="padding:15px 0;text-align:center;display:none;">没有已点列表</div>';
			else
				html += mySongs.create(data.checked,false);
			html += '</div>';
			html += '</div>';
			var shtml = '<div>'+html+'</div>';
			mySongs._init(shtml,data);
			tCover.close();			
		},function(msg){
			tCover.close();
			showInfo(msg||'操作失败',false);
		});		
	},
    _init:function(html,data){
        var boxId = WM.Phone.getId();
       var btnText = (my.isAdmin&&my.free>0)?'免费点歌<tt class="litFont">今日剩余'+my.free+'次</tt>':'购买点歌';
        WM.Phone.get({
            type:'slideBox',
            hasFoot:true,
            title:'点歌',
            btnText:btnText,
            html:html,
            ready:function(){
                var t = this;
				if(data.all.length>0){
					document.getElementById('wrapper1').addEventListener('touchmove',function (e){ e.preventDefault();},false);
					t.scrollObj = new iScroll('wrapper1',{
						checkDOMChanges:true,
						vScrollbar:false,
						hScroll:false,
						bounce:false
					});
				}
				if(data.checked.length>0){
					document.getElementById('wrapper2').addEventListener('touchmove',function (e){ e.preventDefault();},false);
					t.scrollObj2 = new iScroll('wrapper2',{
						checkDOMChanges:true,
						vScrollbar:false,
						hScroll:false,
						bounce:false
					});
				}
				if(t.find('.songsBodyBox').hasClass('list'))
					t.find('.wm_slideFoot').hide();
				mySongs.change(t);
				mySongs.chose(t);
				setMoney.checked(my.redBagMoney,my.cash,true,'song');
            },
            click:function(){
                var t = this;
                var songId = this.find('.listChecked').attr('sid');
                var text = $.trim(this.find('#dgWord').val());
                var price = this.find('.listChecked').attr('price');
                if(typeof songId=='undefined')
                    return showInfo('请选择要点的歌曲',false);
                //系统检测
                if(!keyWord.check(text))
                    return showInfo('请勿发布广告等不适内容',false);
                //转义
                text = text.replace(/</g,'&lt;');
                text = text.replace(/>/g,'&gt;');
                //敏感词
                text = keyWord.replace(text);
                var btn = this.getButton()[0];
                var moneyMsg = setMoney.getMsg();
                WM.Phone.setButton(btn,false);
                this.cover(true);
                ajax_songs(songId,text,moneyMsg.type,function(url){
                    if(my.isAdmin&&my.free>0||moneyMsg.bool){
                    	window.location.href = url;
						/*ajax_songPay(url,function(toPay){
							if(toPay){
								window.location.href = url;
								return;	
							}
							var _money = t.find('.isClick.listChecked').attr('price');
							_money = parseFloat(_money);
							if(moneyMsg.type==1){
								my.redBagMoney -= _money;			
							}else if(moneyMsg.type==2){
								my.cash -= _money;
							}	
							t.cover(false);
							t.close();
							showInfo('点歌成功');	
						},function(errorMsg){
							t.cover(false);
                    		WM.Phone.setButton(btn,true);
                    		showInfo(errorMsg||'操作失败',false,{top:'86%'});	
						});*/
                        return;
                    }
                    WM.Phone.get({
                        type:'confirm',
                        title:'支付确认',
                        innerHTML:'确定支付 '+moneyMsg.price+'?',
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
            },
            onClose:function(){
                if(this.scrollObj)
                    this.scrollObj.destroy();
                if(this.scrollObj2)
                    this.scrollObj2.destroy();
            }
        });
    },
    create:function(dt,bool){
        var html = '';
        var isShow = bool?'block':'none';
        var checked = bool?'isClick':'';
        var sid = bool?'wrapper1':'wrapper2';
        var sid2 = bool?'scroller1':'scroller2';
        html += '<div class="songsBodyBox" style="display:'+isShow+'">';
        html += '<div class="songsList" style="max-height:204px;overflow-x:hidden;overflow-y:auto;">';
        html += '<div id="'+sid+'" style="max-height:204px;"><div id="'+sid2+'">';
        for(var i=0;i<dt.length;i++){
            html += '<div class="oneList clearfix '+checked+'" sid="'+dt[i].id+'" price="'+dt[i].price+'">';
            var str = '';
            if(dt[i].singer!=''||dt[i].singer!=null){
                str += '<i>&nbsp;-&nbsp;'+dt[i].singer+'</i>'
            }
            html += '<span class="songsName">'+(i+1)+'&nbsp;'+dt[i].songName+''+str+'</span>';
            if(bool)
                html += '<span class="iconChecked"></span>';
            html += '</div>';
        }
        html += '</div>';
        html += '</div>';
        html += '</div>';
        if(bool){
            html += '<div style="margin-top:12px" id="dsWordBox">';
            html += '<input type="text" class="inputNormal" id="dgWord" maxlength="60" placeholder="请输入点歌上墙语，30字以内" style="font-size:13px; text-indent:14px; box-sizing:border-box; height:40px; line-height:41px; padding:0px">';
            html += '</div>';
            html += setMoney.create(my.redBagMoney,my.cash,true,null,my.isAdmin&&my.free>0);
        }
        html += '</div>';
        return html;
    },
    change:function(t){
        t.find('.songsNav a').on('click',function(){
            $(this).addClass('checked').siblings('a').removeClass('checked');
            var index = $(this).index();
            t.find('.songsBodyBox').hide();
            t.find('.songsBodyBox').eq(index).show();
            if(index==0){
                if(t.find('.songsBodyBox').hasClass('list')){
                    t.find('.wm_slideFoot').hide();
                }else{
                    t.find('.wm_slideFoot').show();
                }
            }else if(index==1){
                t.find('.wm_slideFoot').hide();
            }
        })
    },
    chose:function(t){
        t.find('.isClick').on('click',function(){
            $(this).addClass('listChecked').siblings('.isClick').removeClass('listChecked');
            // mySongs.math($(this));
			var money = $(this).attr('price');
			setMoney.math(my.redBagMoney,my.cash,true,money);
        })
    },
    math:function(e){
        var price = 0;
        if(isOpenRedBag){
            var newPrice = $(e).attr('price');
            newPrice = parseFloat(newPrice);
            price = newPrice-my.redBagMoney;
            this.isFull = price<=0?true:false;
            var dVal = price<0?newPrice:my.redBagMoney;
            if(dVal>0)
                $('#delMoney').show().html('-'+dVal.toFixed(2));
            else
                $('#delMoney').hide().html('0.00');
            price = price<0?0:price.toFixed(2);
        }else
            price = $(e).attr('price');
        $('#songPrice').html('￥'+parseFloat(price).toFixed(2)); 
    }
}

//现金转喵币的比例 1:10
var coefficient = 10;
//设置显示金额
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
                case 'newDs':
                	money = $.trim($('.one_gift.sel').attr('price'));
                	break;
                case 'dj':
                    money = $.trim($('.cy_check:checked').attr('price'));
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
/* 喵币充值 */
var CZ = {
	coefficient:10,
	data:[100,500,1000,5000,10000],
	init:function(){
		this.show();
	},
	create:function(){
	    var html = '<div class="recharge" onclick="CZ.hide();">';
	    html += '<div class="moreList">';
	    for(var i=0;i<this.data.length;i++){
	        var dt = this.data[i],coe=this.coefficient;
	        html += '<div num="'+dt+'" price="'+(dt/coe)+'" class="oneRow" onclick="CZ.checked(this,event);">';
	        html += '<span>'+dt+'&nbsp;个</span>';
			var tt = dt/coe;
	        html += '<span>'+tt+'&nbsp;元</span>';
	        html += '</div>';
	    }
	    html += '</div>';
	    html += '</div>';
	    return html;
	},
	show:function(){
	    var html = this.create();
	    $(html).appendTo($('body'));
	    setTimeout(function(){
	        $('.moreList').addClass('change');
	    },50);
	},
	hide:function(){
	    $('.moreList').removeClass('change');
	    setTimeout(function(){
	        $('.recharge').remove();
	    },200);
	},
	checked:function(e,event){
	    event.stopPropagation();
	    var num=$.trim($(e).attr('num')),price=$.trim($(e).attr('price'));
	    WM.Phone.get({
	        type:'confirm',
	        title:'确认充值',
	        innerHTML:'确认充值'+num+'个喵币('+price+'元)？',
	        click:function(b){
	            if(!b)
	                return this.close();
	            var self = this;
	            WM.Phone.setButton(this.getButton()[1],false);
	            ajax_mbChecked(price,function(url){
	            	window.location.href = url;
	            },function(msg){
	                showInfo(msg||'充值失败，请稍后重试',false);
	                WM.Phone.setButton(self.getButton()[1],true);
	            })
	        }
	    });
	}
}

//新-我的
var newMy = {
	init:function(){
		this.create();
	},
	showNumber:function(number){
		if(number>0){
			$('.my_icons').find('.my_msg_radio').show();
		}else{
			$('.my_icons').find('.my_msg_radio').hide();
		}
	},
	create:function(){
		var boxId = WM.Phone.getId();
		var nickName = $.trim($('#my_name').val());
		var ms = $.trim($('#my_txt').val());
		var headName = my.sex=='man'?'newMy_head_man':'newMy_head_women';
		var sexName = my.sex=='man'?'sex_man':'sex_women';
		var mb = newMyMsg.mb;
        var grade_style = cy_get_grade_style.get(my.grade)
		var newG=grade_style.newG;
		var imgUrl=grade_style.imgUrl;
		var fColor=grade_style.fColor;
		var fBg=grade_style.fBg;
		var html = '<div class="newMy_box" id="'+boxId+'">';


		// 我
		html += '<div class="newMy_msg">';
		html += '<div class="newMy_msgHead">';
		html += '<img class="'+headName+'" src="'+my.head+'" alt="">';
		if(my.grade>3){
            html +='<span class="my_grade cy_pa">';
            html += '<img  src='+imgUrl+'  width="60px" alt="">';
            html +='</span>';
		}
		html += '</div>';
		html += '<div class="newMy_content">';
		html += '<div class="newMy_table">'
		html += '<div class="newMy_cell">';
		html += '<span>'+nickName+'<i class="newMy_sex '+sexName+'"></i></span>';
		html += '<span style="color: #ff4b69;">'+newG+'</span>';
		html += '</div>';
		html += '</div>';
		html += '</div>';
		html += '<div class="newMy_msg_link">';
		html += '<a href="'+my.url+'">编辑资料</a>';
		html += '</div>';

		html += '</div>';


        html += '<div class="dj_tq">';
        html += '<div class="" style="border-top: 1px solid #ececec;padding: 18px 0 0px 0">';
        html += '<div class="mb_content">';
        html += '<div class="dj_icons"></div>';
        html += '<div class="mb_text">';
        html += '我的等级&nbsp;&nbsp;<span>lv'+my.scopeLevel+'</span>';
        html += '<div class="newMy_msg_link cy_my_btn">';
        html += '<a href='+my.gradeUrl+' class="lookG">升级和特权</a>';
        html += '</div>';
        html += '</div>';
        html += '</div>';
        html += '</div>';
        html += '</div>';
		//喵币
    	html += '<div class="newMy_mb">';
    	html += '<div class="mb_content">';
    	html += '<div class="mb_icons"></div>';
    	html += '<div class="mb_text">';
    	html += '喵币&nbsp;&nbsp;<span>1元=10喵币</span>';
    	html += '<div class="mb_recharge">';
    	html += '<a class="recharge_a">充值</a>';
    	html += '<a></a>';
    	html += '<a href="'+mb.detailUrl+'">明细</a>';
    	html += '</div>';
    	html += '</div>';
    	html += '<div class="mb_number"><span id="mb_number">'+parseFloat(my.redBagMoney*CZ.coefficient).toFixed(1)+'</span>个</div>';
    	html += '</div>';
    	html += '<div class="newMy_line"></div>';
    	html += '</div>'
    	// 主题
    	html += '<div class="newMy_mb" style="margin-top:0;padding-top:0;">';
    	html += '<div class="mb_content">';
    	html += '<div class="mb_icons my_skin"></div>';
    	html += '<div class="mb_text">皮肤</div>';
    	html += '<div class="mb_number clearfix">';
    	for(var i=0;i<newMyMsg.skin.length;i++){
    		var e = newMyMsg.skin[i];
    		if(i==0)
    			html += '<div class="oneSkin newMy_sky_sel">';
    		else
    			html += '<div class="oneSkin">';
    		html += '<img src="'+e.url+'" alt="">';
    		html += '<span>'+e.text+'</span>';
    		html += '<i class="sky_sel"></i>';
    		html += '</div>';
    	}
    	html += '</div>';
    	html += '</div>';
    	html += '</div>';
    	//审核之类的列表
    	html += '<div class="newMy_my clearfix">';
    	for(var i=0;i<newMyMsg.msg.length;i++){
    		var dt = newMyMsg.msg[i];
			html += '<div class="my_one">';
			html += '<div class="my_link">';
			html += '<span class="'+dt.icon+'"></span>';
			html += '<span class="my_one_text">'+dt.text+'</span>';
			html += '<a class="my_toLink" _href="'+dt.url+'"></a>'
			html += '</div>';
			html += '</div>';
    	}
    	html += '</div>';

		html += '</div>';
		WM.Phone.get({
			type:'slideBox',
			html:html,
			title:'我',
			style:{padding:0},
			hasFoot:false,
			ready:function(){
				var t = this;
				var box = this.find('#'+boxId);
				this.find('.wm_slideTitle').css({'padding':'15px 15px 0 15px'});
				this.find('.wm_slideTitleLine').css({'top':'16px','left':'10px'});
				this.find('.wm_slideCloseBox').css({'top':'7px','right':'3px'});
				this.find('.wm_slideBody').css({'padding-top':'0'});
				if(my.noRead&&my.noRead>0){
					this.find('.my_icon_msg').parents('.my_one').append('<b class="msg_number"></b>');
				}
				/* 换肤 */
				if(skin.sel!=null){
					$(box).find('.oneSkin').eq(skin.sel).addClass('newMy_sky_sel').siblings('.oneSkin').removeClass('newMy_sky_sel');
				}
				$(box).find('.oneSkin').on('click',function(){
					if($(this).hasClass('newMy_sky_sel'))
						return;
					$(this).addClass('newMy_sky_sel').siblings('.oneSkin').removeClass('newMy_sky_sel');
					skin.change($(this).index());
					t.close();
				});
				$(box).find('.recharge_a').on('click',function(){
					CZ.init();
				});
				$(box).find('.my_toLink').on('click',function(){
					var href = $(this).attr('_href');
					var text = $(this).parents('.my_link').find('.my_one_text').html();
					/*
					var text = $(this).parents('.my_link').find('.my_one_text').html();
					
					if(text.indexOf('消息')!=-1&&isshutup)
						return showInfo('该功能已关闭',false);
					*/
					if(text.indexOf('附近的人')!=-1){
						t.close();
						newTalk.show();
						return;
					}
					
					window.location.href = href;
				})
			}
		});
		$('.lookG').on("click",function () {
			$(".wm_slideBox").hide();

        })
	}
}

var setTips = {
	show:function(){
		var tips = localStorage.getItem('tips');
		if(tips=='tips'){
			$('.newMy_tips').hide();
		}else{
			$('.newMy_tips').show();			
		}
	},
	hide:function(e){
		$(e).remove();
		localStorage.setItem('tips','tips');
	}
}

/* 新的打赏 */
var newDsZgj = {
	group:{},
	minSlider:4,
	getGroup:function(group){
		newDsZgj.group = group;
		/*
		ajax_getGroup(function(group){
			newDsZgj.group = group;
		},function(){
			setTimeout(function(){
				newDsZgj.getGroup();
			},500);
		})
		*/
	},
	init:function(e){
		this.create(e);
	},
	create:function(e){
		if($(e).hasClass('disabled')||$('.wemewPhoneDs').hasClass('disabled'))
			return showInfo('大屏幕未开启，不能打赏',false);
		var bool = $.isEmptyObject(newDsZgj.group);
		if(bool)
			return showInfo('数据加载中',false);
		var group = newDsZgj.group,html='';
		/* 分组 */
		html += '<div class="art_group clearfix">';
		html += '<div class="group_scroll">';
		for(var key in group){
			if(group[key].groupArt instanceof Array){
				if(group[key].groupArt.length>0){
					html += '<div class="one_group" group_id="'+key+'">';
					html += '<span class="group_name">'+group[key].groupName+'</span>';
					html += '<span class="group_line"></span>';
					html += '</div>';
				}
			}
		}
		html += '</div></div>'
		// 艺人
		html += '<div class="art_user" id="art_user"></div>';
		// 打赏礼物
		html += '<div class="wm_slideRowTitle" style="padding:0;margin:5px 0;">礼物</div>';
		html += '<div class="wm_otherBar" style="padding:0;margin:5px 0;"><div class="dsObjMain" style="padding:0;margin:0;">';
		
		var strShow1 = '';
		var dsVal0 = '',dsVal1 = '',dsVal2 = '',_first = '';
		for(var i in giftData.newDs){
			var ii = parseInt(i);
			if(giftData.newDs[i].check==1){
				if(ii>=36&&ii<=38){
					_first += '<a class="oneDsObj" data-num="0" data-tid="'+i+'" data-price="'+giftData.newDs[i].price+'"><span class="oneDsObjSpan"><span class="'+giftData.newDs[i].iconName+'"></span></span><tt class="ellipsis">'+giftData.newDs[i].name+'</tt><i class="oneDsObjNum"></i></a>';
				}else if(ii==34){
					dsVal0 += '<a class="oneDsObj" data-num="0" data-tid="'+i+'" data-price="'+giftData.newDs[i].price+'"><span class="oneDsObjSpan"><span class="'+giftData.newDs[i].iconName+'"></span></span><tt class="ellipsis">'+giftData.newDs[i].name+'</tt><i class="oneDsObjNum"></i></a>';
				}else{
					if(ii>=30){
						dsVal1 += '<a class="oneDsObj" data-num="0" data-tid="'+i+'" data-price="'+giftData.newDs[i].price+'"><span class="oneDsObjSpan"><span class="'+giftData.newDs[i].iconName+'"></span></span><tt class="ellipsis">'+giftData.newDs[i].name+'</tt><i class="oneDsObjNum"></i></a>';
					}else{
						if(ii>=12)
							dsVal2 += '<a class="oneDsObj" data-num="0" data-tid="'+i+'" data-price="'+giftData.newDs[i].price+'"><span class="oneDsObjSpan"><span class="'+giftData.newDs[i].iconName+'"></span></span><tt class="ellipsis">'+giftData.newDs[i].name+'</tt><i class="oneDsObjNum"></i></a>';	
					}
				}
			}	
		}
		strShow1 = _first+dsVal0+dsVal1+dsVal2;
		/*
		for(var i in giftData.newDs){
			var ii = parseInt(i);
			if(ii>=30&&giftData.newDs[i].check==1)
				strShow1 += '<a class="oneDsObj" data-num="0" data-tid="'+i+'" data-price="'+giftData.newDs[i].price+'"><span class="oneDsObjSpan"><span class="'+giftData.newDs[i].iconName+'"></span></span><tt class="ellipsis">'+giftData.newDs[i].name+'</tt><i class="oneDsObjNum"></i></a>';		
		}
		for(var i in giftData.newDs){
			var ii = parseInt(i);
			if(i!=-1&&ii<30&&parseInt(i)>=12&&giftData.newDs[i].check==1)
				strShow1 += '<a class="oneDsObj" data-num="0" data-tid="'+i+'" data-price="'+giftData.newDs[i].price+'"><span class="oneDsObjSpan"><span class="'+giftData.newDs[i].iconName+'"></span></span><tt class="ellipsis">'+giftData.newDs[i].name+'</tt><i class="oneDsObjNum"></i></a>';		
		}
		*/
		if(strShow1=='')
			strShow1 = '<div class="notValue">没有可打赏的礼物</div>';
		else
			strShow1 = '<div class="dsObjBox dsObjBox2">'+strShow1+'</div>';
		html += strShow1;
		
		html += '</div></div>';
		// 对TA赠言;
		html += '<div style="margin-top:8px" id="dsWordBox"><input type="text" class="inputNormal" id="dsWord" maxlength="60" placeholder="请输入打赏上墙语，30字以内" style="font-size:13px; text-indent:14px; box-sizing:border-box; height:40px; line-height:41px; padding:0px" /></div>';
        html += setMoney.create(my.redBagMoney,my.cash,true,null,my.isAdmin&&my.freeDs>0);
		var btnText = (my.isAdmin&&my.free>0)?'免费打赏<tt class="litFont">今日剩余'+my.free+'次</tt>':'购买打赏';
		var dsNum = 1;
		WM.Phone.get({
			type:'slideBox',
			title:'打赏',
			html:html, 
			btnText:btnText,
			ready:function(){
				var t = this;
				this.swiper = null,this.swiper2 = null;
				var gift_list = newDsZgj.get_gift();
				this.find('.wm_slideBody').css({'padding-top':0});
				this.find('.one_group').eq(0).addClass('sel');
				var first_id = this.find('.one_group.sel').attr('group_id');
				var first_user = group[first_id].groupArt;
				var html = newDsZgj.create_user(first_user);
				this.find('#art_user').html($(html));
				this.swiper = new Swiper('#swiper1',{
					effect:'coverflow',
					grabCursor: true,
					centeredSlides: true,
					slidesPerView:'auto',
					//slideToClickedSlide:true,
					coverflow: {
						rotate:0,
						stretch:0,
						depth:100,
						modifier:0,
						slideShadows : true
					}
				});
			    this.find('.one_group').on('click',function(){
					if($(this).hasClass('sel'))
						return;
					$(this).addClass('sel').siblings('.one_group').removeClass('sel');
					t.find('#art_user').html('');
					var _group_id = $(this).attr('group_id');
					var group_user = newDsZgj.group[_group_id].groupArt;
					var html = newDsZgj.create_user(group_user);
					if(html&&t.swiper!=null)
						t.swiper.destroy(false);
					t.find('#art_user').html($(html));
					t.swiper = new Swiper('#swiper1',{
						effect:'coverflow',
						grabCursor: true,
						centeredSlides: true,
						slidesPerView:'auto',
						//slideToClickedSlide:true,
						coverflow: {
							rotate:0,
							stretch:0,
							depth:100,
							modifier:0,
							slideShadows :true
						}
					});
			    });
                this.find('.oneDsObj').bind('click',function(){
					if($(this.parentNode).hasClass('dsObjBox2')){
						if(!$(this).hasClass('sel'))
							$(this.parentNode).find('.oneDsObj').removeClass('sel').attr({'data-num':0});
						dsNum = parseInt($(this).attr('data-num'));
						dsNum = dsNum<0?0:dsNum;
						dsNum++;
						dsNum = dsNum>99?99:dsNum;
						if(my.isAdmin&&my.free>0){
							if(dsNum>1)
								showInfo('管理员每次只能打赏1个礼物',false);
							dsNum = 1;
						}
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
			},
			click:function(){
				var showId = $.trim(this.find('.swiper-slide1.swiper-slide-active').attr('art_id'));// 艺人id;
				var txt = $.trim(this.find('#dsWord').val()); //文字;
				var giftId = $.trim(this.find('.dsObjBox2 .sel').attr('data-tid'));// 礼物id;
				var t = this;
				if(showId==''||typeof showId=='undefined')
					return showInfo('请选择打赏的艺人',false,{top:'86%'});
				var _len = getTextLength(txt);
				if(_len>30)
					return showInfo('上墙语不能超过30字',false,{top:'86%'});
				//系统检测
				if(!keyWord.check(txt))
					return showInfo('请勿发布广告等不适内容',false,{top:'86%'});
				if(giftId==''||typeof giftId=='undefined')
					return showInfo('请选择礼物',false,{top:'86%'});
				//转义
				txt = txt.replace(/</g,'&lt;');
				txt = txt.replace(/>/g,'&gt;');
				//敏感词
				txt = keyWord.replace(txt);
				var moneyMsg = setMoney.getMsg();
				var btn = this.getButton()[0];
				WM.Phone.setButton(btn,false);
				this.cover(true);
				dsNum = dsNum<1?1:dsNum;
				dsNum = dsNum>99?99:dsNum;
				if(my.isAdmin&&my.free>0)
					dsNum = 1;
				var jsonData = {
					showId:showId,userId:'',txt:txt,giftId:giftId,isShowPc:true,type:moneyMsg.type,dsNum:dsNum,
					source:3,barId:barbaseId
				}
				ajax_ds(jsonData,function(url,waitNum){
					if(my.isAdmin&&my.free>=dsNum||moneyMsg.bool)
						return window.location.href = url;
					waitNum = (waitNum==null||waitNum.length==0)?0:parseInt(waitNum);
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
			},
			onClose:function(){
				if(this.swiper!=null)
					this.swiper.destroy(false);
				if(this.swiper2!=null)
					this.swiper2.destroy(false);
			}
		});
	},
	setImages:function(e){
		var w = 90,h = 125;
		var dir = w/h;
		if($(e).width()/$(e).height()<=dir){
			$(e).css({width:'100%',height:'auto',left:0});
			var mt = ($(e).height()-h)/-2;
			$(e).css({top:mt,visibility:'visible'});			
		}else{
			$(e).css({height:'100%',width:'auto',top:0});
			var ml = ($(e).width()-w)/-2;
			$(e).css({left:ml,visibility:'visible'});				
		}
	},
	showImages:function(e,event){
		if($(e).parents('.swiper-slide1').hasClass('swiper-slide-active')){
			var _src = $(e).attr('_src');
			WM.Phone.showImage(_src);
		}
	},
	create_user:function(data){ // 艺人
		if(data==null||data.length==0)
			return newDsZgj.art_no_user();
		var cName = data.length<newDsZgj.minSlider?'swiper-container-less':'swiper-container-more';
		var html = '';
		html += '<div class="swiper-container swiper1" id="swiper1">';
		html += '<div class="swiper-wrapper swiper-container-less">';
		for(var i=0;i<data.length;i++){
			var dt = data[i];
			var text = dt.name;
			text = (dt.type==null||typeof dt.type=='undefined')?dt.name:dt.type+'-'+dt.name;
			html += '<div class="swiper-slide swiper-slide1" art_id="'+dt.id+'">';
			html += '<img class="art_user_head" src="'+dt.chead+'" onload="newDsZgj.setImages(this)" onclick="newDsZgj.showImages(this,event)" _src="'+dt.chead+'" alt="">';
			html += '<div class="art_user_name">'+text+'</div>';
			html += '</div>'
		}
		html += '</div></div>';
		return html;
	},
	art_no_user:function(){
		var html = '<div class="art_no_user">';
		html += '<div class="not_icons"></div>';
		html += '<div class="not_text">列表为空</div>';
		html += '<div class="not_add_tips">请管理员到后台添加艺人</div>';
		html += '</div>';
		return html;
	},
	get_gift:function(){
		var gift = giftData.newDs;
        var arr = [];
        for(var key in gift){
        	if(key!=-1&&parseInt(key)>=12&&gift[key].check==1){
        		arr.push({
        			group_id:key,
        			group_list:gift[key]
        		});
        	}
        }
        var result = [];
        for(var i=0,len=arr.length;i<len;i+=8){
            result.push(arr.slice(i,i+8));
        }
        return result;
	},
	create_gift:function(){  // 礼物
		var gift = newDsZgj.get_gift();
		if(gift==null||gift.length==0)
			return false;
		var html = '';
		html += '<div class="swiper-container swiper2" id="swiper2">';
		html += '<div class="swiper-wrapper wiper-wrapper2" id="wiper-wrapper">';
		for(var i=0;i<gift.length;i++){
			html += '<div class="swiper-slide swiper-slide2 clearfix">';
			for(var j=0;j<gift[i].length;j++){
				var group_id = gift[i][j].group_id;
				var group_list = gift[i][j].group_list;
				html += '<div class="one_gift" group_id="'+group_id+'" check="'+group_list.check+'" name="'+group_list.name+'" nickname="'+group_list.nickname+'" price="'+group_list.price+'" time="'+group_list.time+'">';
				html += '<span class="ds_icons '+group_list.iconName+'"><span class="one_select"></span></span>';
				html += '<span class="gift_name">'+group_list.name+'</span>';
				html += '<span class="gift_price">¥'+group_list.price+'</span>';
				html += '</div>';
			}
			html += '</div>';
		}
		html += '</div>';
		html += '<div class="swiper-pagination pagination2" id="pagination2"></div>';
		html += '</div>';
		return html;
	}
}


//等级=====================

var cy_get_grade_style={
	get:function (data) {
		var grade_style={};
        grade_style.newG="青铜1级";
        grade_style.imgUrl=''+allGradeImageUrl+'/qt1.png';
        grade_style.fColor="qt_color";
        grade_style.fBg='qt_bg';
        switch (data){
            case 1 :
                grade_style.newG ="青铜1级" ;
                grade_style.imgUrl=''+allGradeImageUrl+'/qt1.png'
                grade_style.fColor="qt_color"
                grade_style.fBg='qt_bg';
                break;
            case 2 :
                grade_style.newG ="青铜2级" ;
                grade_style.imgUrl=''+allGradeImageUrl+'/qt2.png'
                grade_style.fColor="qt_color"
                grade_style.fBg='qt_bg';
                break;
            case 3 :
                grade_style.newG ="青铜3级" ;
                grade_style.imgUrl=''+allGradeImageUrl+'/qt3.png'
                grade_style.fColor="qt_color"
                grade_style.fBg='qt_bg';
                break;
            case 4 :
                grade_style.newG ="白银4级" ;
                grade_style.imgUrl=''+allGradeImageUrl+'/by1.png'
                grade_style.fColor="by_color"
                grade_style.fBg='by_bg';
                break;
            case 5 :
                grade_style.newG ="白银5级" ;
                grade_style.imgUrl=''+allGradeImageUrl+'/by2.png'
                grade_style.fColor="by_color"
                grade_style.fBg='by_bg';
                break;
            case 6 :
                grade_style.newG ="白银6级" ;
                grade_style.imgUrl=''+allGradeImageUrl+'/by3.png'
                grade_style.fColor="by_color"
                grade_style.fBg='by_bg';
                break;
            case 10 :
                grade_style.newG ="铂金10级" ;
                grade_style.imgUrl=''+allGradeImageUrl+'/bj1.gif'
                grade_style.fColor="bj_color"
                grade_style.fBg='bj_bg';
                break;
            case 11 :
                grade_style.newG ="铂金11级" ;
                grade_style.imgUrl=''+allGradeImageUrl+'/bj2.gif'
                grade_style.fColor="bj_color"
                grade_style.fBg='bj_bg';
                break;
            case 12 :
                grade_style.newG ="铂金12级" ;
                grade_style.imgUrl=''+allGradeImageUrl+'/bj3.gif'
                grade_style.fColor="bj_color"
                grade_style.fBg='bj_bg';
                break;
            case 7 :
                grade_style.newG ="黄金7级" ;
                grade_style.imgUrl=''+allGradeImageUrl+'/hj1.gif'
                grade_style.fColor="hj_color"
                grade_style.fBg='hj_bg';
                break;
            case 8 :
                grade_style.newG ="黄金8级" ;
                grade_style.imgUrl=''+allGradeImageUrl+'/hj2.gif'
                grade_style.fColor="hj_color"
                grade_style.fBg='hj_bg';
                break;
            case 9 :
                grade_style.newG ="黄金9级" ;
                grade_style.imgUrl=''+allGradeImageUrl+'/hj3.gif'
                grade_style.fColor="hj_color"
                grade_style.fBg='hj_bg';
                break;
            case 13 :
                grade_style.newG ="钻石13级" ;
                grade_style.imgUrl=''+allGradeImageUrl+'/zs1.gif'
                grade_style.fColor="zs_color"
                grade_style.fBg='zs_bg';
                break;
            case 14 :
                grade_style.newG ="钻石14级" ;
                grade_style.imgUrl=''+allGradeImageUrl+'/zs2.gif'
                grade_style.fColor="zs_color";
                grade_style.fBg='zs_bg';
                break;
            case 15 :
                grade_style.newG ="钻石15级" ;
                grade_style.imgUrl=''+allGradeImageUrl+'/zs3.gif'
                grade_style.fColor="zs_color";
                grade_style.fBg='zs_bg';
                break;
        }
        return grade_style;
    }
}
var cy_crade_pop={
    colorArr:[],
    type:0,
    _loadImage:function(src,fn){
        var img = new Image();
        img.onload = img.onerror = function(){
            if(fn)
                fn();
        }
        img.src = src;
    },
    great:function (data) {
        this.type=0;
        if(data.type){
            this.type=data.type;
        }
        var old =cy_get_grade_style.get(data.oldGrade).newG;
        var newG=cy_get_grade_style.get(data.grade).newG;
        $("#cy_grade_pop").remove();
        var html='';
        html+='<div id="cy_grade_pop" class="cy_pa">'
		//万圣节领积分
		if(this.type==3){

        	html+='<div style="width: 100%;margin:0 auto;position: fixed;top: 0;z-index:9999999;height: 100%" class="cy_animation cy_hw">';
            html+='<img activeId='+data.activeId+' src="'+allGradeImageUrl+'/double11.gif" class="_getScope" width="100%" style="height: 100%" alt="">';
            html+='<div class="cy_btn" style="width:100%;height: 80px;background:rgba(255,255,255,0);position: absolute;bottom: 0;">'
            html+=' </div>'
            html+='</div>';
		}else{
            html+='<div class="cy_grade_box cy_animation">'
            html+='<header class="cy_header cy_clearfix">'
            html+='<h6 class="cy_fl cy_title" style="">'+data.title+'</h6>'
            html+='<span class="cy_fr cy_grade_popClose cy_pa"><i class="wm_slideClose"></i></span>'
            html+='</header>'
            html+='<div class="cy_text_box">'
            if(this.type==0||this.type=='0'){
                //升级
                html+='<p class="cy_text">恭喜您，您已升级到lv'+data.grade+'，您的默认头衔由'+old+'升级为'+newG+'</p>';
                html+='<div class="pop_btn_box cy_pr" style="padding: 35px 0">'
                html+='<a class="cy_goLook cy_pa" href="javascript:void(0)">如何更快升级</a>'
                html+='</div>'
                // html+='<p class="cy_text"></p>';
            }else if(this.type==1){
                //续费
                html+='<p class="cy_text">您的'+old+'月租礼包将于'+data.expireTime+'到期，如果不进行续费您会根据现在等级恢复到默认头衔，而丧失当前特权</p>';
                html+='<div class="pop_btn_box">'
                html+='<a class="cy_cancel">取消</a>'
                html+='<a class="cy_goBuy" href='+my.goBuyUrl+'>续费</a>'
                html+='</div>'
            }else if(this.type==2){
                //领取积分
                html+='<p class="cy_text">'+data.words+''+data.integral+'积分</p>';
                html+='<div class="pop_btn_box cy_pr" style="padding: 35px 0">'
                html+='<a class="cy_getScope _getScope cy_pa" activeId='+data.activeId+' href="javascript:void(0)">领取积分</a>'
                html+='</div>'
            }
            html+='</div>'
            html+='</div>'
            html+='</div>'
		}
        html+= '</div>'
        $('body').append(html);
        var timer =null;
		if(this.type==3){
			timer =setTimeout(function () {
				$('.cy_hw').removeClass('cy_animation');
				$('.cy_hw').addClass('cy_zoomOut');
                cy_crade_pop.close();
                clearTimeout(timer);
            },5000);
		}
        $(".cy_grade_popClose").on("click",function () {
            cy_crade_pop.close();
            var levelInfo =localStorage.getItem('prelevel');
            var scope =localStorage.getItem('scope');
            if(levelInfo){
                cy_crade_pop.great(JSON.parse(levelInfo))
                localStorage.removeItem('prelevel');
            }else {
                if(scope){
                    cy_crade_pop.great(JSON.parse(scope))
                }
                localStorage.removeItem('scope');
			}



        })
		$('.cy_goLook ').on('click',function () {
            cy_crade_pop.close();
            localStorage.removeItem('prelevel');
            my.grade=data.grade
            window.location.href=my.gradeUrl;
            // var scope =localStorage.getItem('scope');
            // if(scope){
            //     cy_crade_pop.great(JSON.parse(scope))
            // }
            //
            // localStorage.removeItem('scope');
        })
        $('._getScope').on("click",function () {
            cy_crade_pop.close();
            clearTimeout(timer);
        })
		$('.cy_btn').on('click',function () {
			var activeId =$(this).attr('activeId');
            window.location.href='https://las.secoo.com/api/topic/topic_list_new?id=18892&pageid=18892'
            cy_crade_pop.close();
            clearTimeout(timer);
        })
		$(".cy_cancel").on('click',function () {
            cy_crade_pop.close();
            var levelInfo =localStorage.getItem('prelevel');
            if(levelInfo){
                cy_crade_pop.great(JSON.parse(levelInfo))
                localStorage.removeItem('prelevel');
			}else {
                var scope =localStorage.getItem('scope');
                if(scope){
                    cy_crade_pop.great(JSON.parse(scope))
                }
                localStorage.removeItem('scope');
			}


        })
    },
    close:function () {
        $("#cy_grade_pop").remove();
    }
}

var zdRicher = {
	able:false,
	ready:false,
	nowUser:null,
	change:function(e){
		if($(e).hasClass('show'))
			return;
		$('.nav-sel.show').removeClass('show');
		$(e).addClass('show');	
		$('.newRicherMenu.show').removeClass('show');
		$('.newRicherMenu').eq($(e).index()).addClass('show');
	},
	create:function(e){
		zdRicher.ready = true;
		var ht1 = '',ht2 = '',ht3 = '';
		var nowUser = zdRicher.nowUser;
		if(nowUser!=null&&nowUser.length>0){
			var now = nowUser[0];
			//var attr = 'src="'+now.shead+'" userId="'+now.id+'" data-src="'+now.shead+'" data-age="'+now.age+'" data-job="'+now.job+'"  data-kg="'+now.kg+'" data-sex="'+(now.sex?'man':'woman')+'" data-cm="'+now.cm+'" data-txt="'+now.txt+'"  data-url="/cwechat/talkhome?sendid='+now.id+'"';
			$('.newRicher_no1Span').attr({
				'src':now.shead||'','userId':now.id,'data-src':now.shead,'data-age':now.age||'','data-job':now.job||'',
				'data-kg':now.kg||'','data-sex':now.sex?'man':'woman','data-cm':now.cm||'','data-txt':now.txt||'','data-url':'/cwechat/talkhome?sendid='+now.id,'data-name':now.nickname
			});
			$('.newRicher_no1Span').unbind('click').bind('click',function(){
				active.show(this);
			});
			$('.richerPhone_no1User').attr({src:now.shead});
			ht1 += '<p class="ellipsis">'+now.nickname+'</p>';
			ht1 += '<p>打赏'+now.dstimes+'次&emsp;霸屏'+now.bptimes+'次</p>';
			ht1 += '<tt class="richerPhone_bz"></tt>';
		}else{
			$('.richerPhone_no1User').attr({src:allImageUrl+'richer_noUser.png'});
			ht1 += '<div>今夜榜主空缺，虚位以待</div>';
		}
		$('.richerPhone_no1Info').html(ht1);
		
		var list = e.all;
		var hasMy = false;
		if(list!=null&&list.length>0){
			for(var x=0;x<list.length;x++){
				if(x>=20)
					break;
				var one = list[x];
				if(one.id==my.userId)
					hasMy = true;
				var tN = one.id==my.userId?'tRed':'';
				var attr = 'src="'+one.shead+'" userId="'+one.id+'" data-src="'+one.shead+'" data-age="'+(one.age||'')+'" data-job="'+(one.job||'')+'"  data-kg="'+(one.kg||'')+'" data-sex="'+(one.sex?'man':'woman')+'" data-cm="'+(one.cm||'')+'" data-txt="'+(one.txt||'')+'"  data-url="/cwechat/talkhome?sendid='+one.id+'" data-name="'+one.nickname+'"';
				if(x==0)
					ht2 += '<div class="richerPhone_one top1"><tt class="'+tN+'">'+(x+1)+'</tt><span '+attr+' onclick="active.show(this)"><i class="richerPhone_first"></i>';
				else if(x==1)
					ht2 += '<div class="richerPhone_one top2"><tt class="'+tN+'">'+(x+1)+'</tt><span '+attr+' onclick="active.show(this)"><i class="richerPhone_second"></i>';
				else if(x==2)
					ht2 += '<div class="richerPhone_one top3"><tt class="'+tN+'">'+(x+1)+'</tt><span '+attr+' onclick="active.show(this)"><i class="richerPhone_thrid"></i>';
				else
					ht2 += '<div class="richerPhone_one noTop"><tt class="'+tN+'">'+(x+1)+'</tt><span '+attr+' onclick="active.show(this)">';
				
				ht2 += '<img src="'+one.shead+'" /></span><div><p class="ellipsis '+tN+'">'+one.nickname+'</p><p class="ellipsis">打赏'+one.dstimes+'次&emsp;霸屏'+one.bptimes+'次</p></div></div>';	
			}
		}else{
			ht2 += '<div class="noRicherData">没有壕榜用户记录</div>';
		}
		
		if(!hasMy&&list!=null&&list.length>0){
			var rank = e.myrank;
			rank.number = -1;
			ht2 += '<div class="richerPhone_one noTop"><tt class="tRed" style="'+(rank.number==-1?'font-size:10px':'')+'">'+(rank.number==-1?'未上榜':rank.number)+'</tt><span>';
			ht2 += '<img src="'+my.head+'" /></span><div><p class="ellipsis tRed">'+$.trim($('#my_name').val())	+'</p><p class="ellipsis">打赏'+rank.dstimes+'次&emsp;霸屏'+rank.bptimes+'次</p></div></div>';
		}
		$('.richerPhone_list').html(ht2);
		
		var vip = e.vip;
		if(vip!=null&&vip.length>0){
			for(var i=0;i<vip.length;i++){
				if(i>=20)
					break;
				var one = vip[i];
				var attr = 'src="'+one.shead+'" userId="'+one.id+'" data-src="'+one.shead+'" data-age="'+(one.age||'')+'" data-job="'+(one.job||'')+'"  data-kg="'+(one.kg||'')+'" data-sex="'+(one.sex?'man':'woman')+'" data-cm="'+(one.cm||'')+'" data-txt="'+(one.txt||'')+'"  data-url="/cwechat/talkhome?sendid='+one.id+'" data-name="'+one.nickname+'"';
				ht3 += '<div class="vipPhone_one"><span '+attr+' onclick="active.show(this)"><img class="vipPhone_hat" src="'+cy_get_grade_style.get(one.level).imgUrl+'" /><img class="vipPhone_head" src="'+one.shead+'" /></span><div><p class="ellipsis">'+one.nickname+'</p><p class="ellipsis">打赏'+(one.dstimes||0)+'次&emsp;霸屏'+(one.bptimes||0)+'次</p>';
				if(one.id==my.userId)
					ht3 += '<a data-id="'+one.id+'" onclick="zdRicher.clear(this)"><i class="icon_foot"></i>清除足迹</a>';
				ht3 += '</div></div>';	
			}
		}else
			ht3 += '<div class="noRicherData">没有钻石级用户到店记录</div>';
		$('.vipPhone_list').html(ht3);
	},
	close:function(){
		$('#newRicherAll').hide();
		$('.newRicherAll').removeClass('animate');	
		//$('.newRicherAll').css({'-webkit-transition':'none'}).removeClass('animate');
	},
	show:function(){
		if(!zdRicher.ready){
			var tCover = new WM.Phone.waiting({text:'微喵正在为您加载',hasCover:false,clickClose:false});
			ajax_getNewRicher(function(data){
				zdRicher.create(data);
				setTimeout(function(){
					tCover.close();
					zdRicher._show();	
				},200);
			},function(errorMsg){
				tCover.close();
				showInfo(errorMsg||'操作失败',false);
			});
			return;
		}	
		this._show();
	},
	_show:function(){
		$('#newRicherAll').show();
		//$('.newRicherAll').css({'-webkit-transition':'-webkit-transform 0.1s linear'});
		setTimeout(function(){
			$('.newRicherAll').addClass('animate');	
		},50);		
	},
	clear:function(e){
		WM.Phone.get({
			type:'confirm',
			title:'清除确认',
			innerHTML:'确定清除您的到店记录吗？',
			click:function(bb){
				var id = $(e).attr('data-id');
				if(!bb)
					return this.close();
				var btn = this.getButton()[1];
				WM.Phone.setButton(btn,false);
				var t = this;
				ajax_clearVipIn(id,function(){
					t.close();
					$(e.parentNode.parentNode).remove();
					if($('.vipPhone_one').length==0)
						$('.vipPhone_list').html('<div class="noRicherData">没有钻石级用户到店记录</div>');
				},function(errorMsg){
					WM.Phone.setButton(btn,true);
					showInfo(errorMsg||'操作失败');
				});
			}
		});
	}
}


