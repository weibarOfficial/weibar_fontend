/*----------通用手机ajax*------------*/

//获取视频缩略图
var ajax_getVideoFace = function(videoUrl,fn1,fn2){
	$.post('/cwechat/CutImg?upFilePath='+videoUrl,function(result){
		if(result.isResultTrue){
			var re = JSON.parse(result.resultMsg);
			fn1(re.sImgUrl,re.cImgUrl,re.bImgUrl);
		}else{
			fn2(result.resultMsg);
		}
	});
}

//获取打赏数据
var ajax_getDsData = function(barId,fn1,fn2){
	$.post('/cwechat/toGetAllGiftList',{barId:barId},function(result){
		if(result.isResultTrue){
			var ret = JSON.parse(result.resultMsg);
			fn1(ret);
		}else{
			fn2(result.resultMsg);
		}
	});
	
}

//获取用户信息
var ajax_getMyInfo = function(barId,fn){
	barId = (typeof barId=='undefined'||barId==null)?'':barId;
	$.post('/cwechat/getMyFree',{barId:barId},function(result){
		if(result.isResultTrue){
			var obj = result.resultMsg.split(";");
			//返回这个
			var dt = {
				redBagMoney:obj[0],//我的红包金额
				freeCake:obj[1],//免费蛋糕次数
				free:obj[2],//霸屏免费
				freeDs:obj[3],//打赏免费
				freeTime:obj[4],// 单次最大时长,
				cash:obj[5]
			}
			fn(dt);
		}
	});
}

//获取用户所有图片
var ajax_getUserImage = function(userId,barId,fn1,fn2){
	/*
		用window.getUserImage接收ajax
	*/
	//数组格式 大图路径
	window.getUserImage = $.post("/onWallImgUrl",{userId:userId,barId:barId},function(data){
		if(data != null){
			fn1(data);
		}else{
			fn2();
		}
	});
}

//系统过滤
var ajax_word = function(wordId){
	$.post("/addwordtimes",{id:wordId},function(result){
		
	});
}

//缩略图鉴黄
var ajax_checkImage = function(srcList,fn1,fn2){
	/*
	成功 fn1();
	鉴黄 返回false fn2('请勿上传色情视频');
	请求失败 fn2();
	*/	
	$.post("/upload/autoCheckPictrueList",{stringBases:srcList},function(data){
		if(data.isResultTrue){
			fn1(data.resultMsg);
		}else{
			fn2('请勿上传色情视频');
		}
	});
}

//删除图片
var ajax_delImage = function(imgUrl){
	$.post("/cwechat/delweionwallimg",{imgUrl:imgUrl},function(result){
     	
    });
}

//删除视频
var ajax_delVideo = function(url){
	$.post("/cwechat/delweionwallimg",{imgUrl:url},function(result){
     	
    });
}

//普通上传图片
var ajax_imageUpload = function(base64,rotate,ajaxName,fn1,fn2){
	base64 = base64.split('base64,');
	if(base64.length<1)
		return fn2();
	base64 = base64[1];
	var resultMsg = null;
	window[ajaxName+''] = $.post("/upload/base64Img2OSS",{strImg:base64,angel:rotate},function(result) {
		resultMsg = $.parseJSON(result.resultMsg);
		if(result.isResultTrue){
			fn1(resultMsg.sImgUrl,resultMsg.cImgUrl,resultMsg.bImgUrl);
		}else{
			fn2(result.resultMsg);
		}
	});
}