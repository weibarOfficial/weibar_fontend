import './modules/global';

$(function(){
	var swipe={
	    left:function (box) {
	        $('.'+box).on( 'swipeleft', function(e){
	            $(this).find('.infoBox').addClass('delClass');
	            $(this).find(".delImg").fadeIn(600);
	            swipe.right('cy_box');
	        });
	    },
	    right:function (box) {
	        $('.'+box).on( 'swiperight', function(e){
	            $(this).find('.infoBox').removeClass('delClass');
	            $(this).find('.delImg').fadeOut(200);
	        });
	    }
	}

	var historyData = null;
	var loadFlag = false;

	function loadHistory(){
		return $.getJSON('/h5/getLoginLog');
	}
	function loadFunctionList(merchantId){
		return $.getJSON('/h5/getFunctionList', {
			merchantId: merchantId
		});
	}
	function deleteHistoryItem(logId) {
		return $.getJSON('/h5/deleteLoginLog', {
			logId: logId
		});	
	}
	function lazyShowHistory(){
		if (loadFlag && historyData) {
			var $cnt = $('.page2');
			if ( !$cnt.data('inited')) {
				$cnt.data('inited', true);
				$cnt.append(template('historyTpl', historyData));
				swipe.left('cy_box');
			}
		}
	}
	function initEvent(){
		$('.barHead').on('click', '.j_tab_item', function(){
			var el = $(this);
			if (el.hasClass('sel')){
				return;
			}
			el.addClass('sel').siblings().removeClass('sel');
			var idx = el.index() + 1;
			$('.j_tab_content').hide();
			$('.page' + idx).show();
			if (idx > 1) {
				lazyShowHistory();
			}
		});
		$('.page2').on('click', '.j_del', function(){
			var $el = $(this),
				logId = $el.attr('logId');
			WM.Phone.get({
	            type:'confirm',
	            title:'删除足迹',
	            innerHTML:'确定删除此足迹？',
	            click:function(b){
	                var t = this;
	                if(!b){
	                    return this.close();
	                }
	                deleteHistoryItem(logId).then(function(){
	                	showInfo('删除成功');
						t.close();
	                	$el.closest('.cy_box').remove();
	                }, function(){
	                	showInfo('删除失败');
	                })
	            }
	        });
		});
		$(window).bind('resize',function(){
			$('.allMain').css({minHeight:$(window).height()-$('.copy')[0].offsetHeight});	
		});

	}

	function prepareData(data){
		data.forEach(function(item){
			item._timeStr = App.Utils.fmDate(item.lastLogInTime);
		});
	}
	function ajaxError(json){
		showInfo(json && json.message || '数据加载失败', false);
	}

	function loadAllMerchants(){
		$.getJSON('/h5/getAllMerchants').then(function(res){
			if(res && res.code === 0 && res.data && res.data.length){
				var _html = template('merchantTpl',res.data);
				$('.page1').prepend(_html);
			}
		})
	}
	loadHistory().then(function(json){
		if (json && json.code === 0) {
			historyData = json.data;
			if (!historyData || !historyData.length) {
				$('.noData').removeClass('f-none');
				loadAllMerchants();
				return;
			}
			prepareData(historyData);
			$('.loadMore').addClass('f-none');
			$('.page1').append(template('latestTpl', historyData[0]));

			//加载功能列表
			loadFunctionList(historyData[0].merchantId).then(function(json){
				if (json && json.code === 0) {
					$('.page1').append(template('gamesTpl', json));
				} else {
					ajaxError(json);
				}
			}, ajaxError);
		} else {
			ajaxError(json);
		}
	}, ajaxError).always(function(){
		loadFlag = true;
	});
	$('.allMain').css({minHeight:$(window).height()-$('.copy')[0].offsetHeight});
	$('.copy').css({visibility:'visible'});
	
	initEvent();
});
