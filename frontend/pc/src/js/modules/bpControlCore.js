import SystemControl from './systemControl';
import GiftModule from './gift';

var TYPE = App.MsgModule.MSG_TYPE;
var STATUS = App.MsgModule.STATUS;

var bpControl = {
	miniBp: {
		able: true,
		use: function (e) {
			this.able = true;
			var html = '<div id="miniBp"><div id="miniBpBox"></div></div>';
			$(html).appendTo($('#all'));
			if (e.msgType == 'cake') {
				e.msgType = 'bp';
				e.theme = 5;
			}
			if (e.msgType == 'loveNight') {
				e.msgType = 'bp';
				e.msg = '眼缘';
				e.theme = -1;
			}


			if (e.msgType == 'bp') {
				e.fuckTime = e.richTime;
				this.bp(e);
			}
			else if (e.msgType == 'ds') {
				e.giftTime = e.fuckTime = allData.newDs[e.giftId].time;
				this.ds(e);
			}
			else if (e.msgType == 'richUser' || e.msgType == 'redBag' || e.msgType == 'song') {
				e.fuckTime = 10;
				this.active(e);
			}
		},
		bp: function (e) {
			var html = '<div class="miniRow">';
			html += '<div class="miniRow_user"><span class="miniRow_headBox ' + e.sex + '"></span>';
			html += '<img class="miniRow_head" src="' + e.head + '" /></div>';

			var tVal = e.userName;
			try {
				if (typeof e.pascreenSort != 'undefined' && e.pascreenSort != null && e.pascreenSort != -1)
					tVal += ' 第' + e.pascreenSort + '位霸屏';
			} catch (ex) { }
			html += '<div class="miniRow_userName">' + tVal + '</div>';


			var cName = 'miniRow_msg';
			if (e.src != null && e.src.length > 0)
				cName += ' hasImage';
			html += '<div class="' + cName + '"><div class="miniRow_text">';
			if (e.msg != null && e.msg.length > 0) {
				var len = bpControl.getTextLength(e.msg);
				var lenName = '';
				if (len <= 8)
					lenName = 'miniFont8';
				else if (len <= 16)
					lenName = 'miniFont16';
				else if (len <= 24)
					lenName = 'miniFont24';
				else if (len <= 40)
					lenName = 'miniFont40';
				html += '<div class="table"><span class="tableSpan ' + lenName + '">' + e.msg + '</span></div>';
			} else
				html += '<span class="miniBp_noText"></span>';
			html += '</div>';
			if (e.src != null && e.src.length > 0) {
				if (e.videoUrl != null && e.videoUrl != '')
					html += '<div class="miniRow_bpVideo"><video id="miniBpVideo" src="' + e.videoUrl + '" loop="loop" poster="' + e.src + '"></video></div>';
				else {
					if (e.allSrc != null && e.allSrc != '') {
						html += '<div>';
						var splitSrc = e.allSrc.split(',');
						for (var x = 0; x < splitSrc.length; x++) {
							html += '<div class="miniRow_bpImg"><img src="' + splitSrc[x] + '" /></div>';
						}
						html += '</div>';
					} else
						html += '<div class="miniRow_bpImg"><img src="' + e.src + '" /></div>';
				}
				//html += '<div class="miniRow_bpImg"><img src="'+e.src+'" /></div>';
			}
			html += '</div>';
			html += '<div class="miniRow_foot">';
			var theme = bpControl.getBPname(e);
			var _icon = 'miniBpIcon_bp';
			if (e.theme >= 0) {
				if (e.theme == 0)
					_icon = 'miniBpIcon_love';
				else if (e.theme == 1)
					_icon = 'miniBpIcon_date';
				else if (e.theme == 2)
					_icon = 'miniBpIcon_marry';
				else if (e.theme == 3)
					_icon = 'miniBpIcon_beauty';
				else if (e.theme == 4)
					_icon = 'miniBpIcon_by';
				else if (e.theme == 5)
					_icon = 'miniBpIcon_birthday';
				else if (e.theme == 6)
					_icon = 'miniBpIcon_qixi';
			}
			if (e.bpForName != null)
				theme = '为 ' + e.bpForName + ' ' + theme;
			html += '<p><span class="' + _icon + '"></span>' + theme + '倒计时 <b id="bpTime">' + e.richTime + '</b> 秒</p>';
			html += '</div></div>';
			$('#miniBpBox').html(html);
			var t = this;
			if (e.videoUrl != null && e.videoUrl.length > 0) {
				bpControl.loadVideo($('#miniBpVideo'), e, function () {
					if ($('#miniBpVideo').length > 0) {
						$('#miniBpVideo')[0].volume = 0;
						$('#miniBpVideo')[0].play();
					}
					t.after(e);
				});
			} else
				this.after(e);
		},
		ds: function (e) {
			var html = '<div class="miniRow"><div class="miniRow_ds_cover"></div>';
			html += '<div class="miniRow_ds"><div class="miniRow_left">';
			html += '<div class="miniRow_ds_name">' + e.userName + '</div>';
			html += '<div class="miniRow_user miniDs">';
			html += '<span class="miniRow_headBox ' + e.sex + '"></span>';
			html += '<img class="miniRow_head" src="' + e.head + '" />';
			html += '</div>';
			html += '<div class="miniRow_leftInfo table">';
			html += '<span class="tableSpan"><p>打赏' + allData.newDs[e.giftId].name + '<span class="miniBp_jt"></span></p>';
			if (e.msg != null && e.msg.length > 0)
				html += '<div>' + e.msg + '</div>';
			html += '</span>';
			html += '</div></div>';
			html += '<div class="miniRow_right"><div class="miniRow_ds_name">' + e.showName + '</div>';
			html += '<div class="miniRow_user miniDs"><span class="miniRow_headBox man"></span><img class="miniRow_head" src="' + (e.dsSrc || '') + '" /></div>';
			html += '<div class="miniSWFBox"><div id="flashContent"></div></div>';
			html += '</div></div></div>';
			$('#miniBpBox').html(html);

			var t = this;

			wemewSWF._init(e.giftId, function () {
				//处理flash
				$('#miniBpBox').addClass('show');
				$('.miniRow').addClass('animate');
				t.countTime(e.fuckTime, e);
				if (e.msgType == 'bp' || e.msgType == 'ds') {
					var _num = e.num;
					var _tid = e.tid;
					if (e.isAuto == false && typeof e.tid != 'undefined') {
						ajax_bp(_tid, _num, function () { });
					}
					if (usedId.indexOf(e.tid) == -1 && e.isFail == false && e.isAuto == false && e.isRepeat != true) {
						usedId.push(e.tid);
					}
				}
			}, function () {
				var imgs = allData.allImageUrl + allData.newDs[e.giftId].img;
				_loadImage(imgs, function () {
					$('#miniBpBox').addClass('show');
					$('.miniRow').addClass('animate');
					$('#flashContent').html('<img src="' + imgs + '" />');
					t.countTime(e.fuckTime, e);
					if (e.msgType == 'bp' || e.msgType == 'ds') {
						var _num = e.num;
						var _tid = e.tid;
						if (e.isAuto == false && typeof e.tid != 'undefined') {
							ajax_bp(_tid, _num, function () { });
						}
						if (usedId.indexOf(e.tid) == -1 && e.isFail == false && e.isAuto == false && e.isRepeat != true) {
							usedId.push(e.tid);
						}
					}
				});

			});
		},
		active: function (e) {
			if (e.msgType == 'richUser')
				return activeControl.richer(e);
			var html = '<div class="miniRow">';
			html += '<div class="miniRow_user">';
			html += '<span class="miniRow_headBox ' + e.sex + '"></span><img class="miniRow_head" src="' + e.head + '" /></div>';
			html += '<div class="miniRow_userName">' + e.userName + '</div>';
			html += '<div class="miniRow_msg miniRow_active">';
			var s1 = '', s2 = '', s3 = '', s4 = '', src = '';
			if (e.msgType == 'redBag') {
				s1 = 'miniActive_rbBorder1', s2 = 'miniActive_rbBorder2',
					s3 = 'miniBp_redBager', s4 = 'miniBp_rb';
				src = allData.allImageUrl + 'miniBp_rb.png';
			} else if (e.msgType == 'song') {
				s1 = 'miniActive_songBorder1', s2 = 'miniActive_songBorder2',
					s3 = 'miniBp_singer', s4 = 'miniBp_song';
				src = allData.allImageUrl + 'miniBp_song.png';
				var len = bpControl.getTextLength(e.msg);
				var lenName = '';
				if (len <= 8)
					lenName = 'miniFont8';
				else if (len <= 16)
					lenName = 'miniFont16';
				else if (len <= 24)
					lenName = 'miniFont24';
				else if (len <= 40)
					lenName = 'miniFont40';
				html += '<div class="miniActive_text"><div class="table"><span class="tableSpan ' + lenName + '">' + e.msg + '</span></div></div>';
			} else if (e.msgType == 'richUser') {
				s1 = 'miniActive_richBorder1', s2 = 'miniActive_richBorder2',
					s3 = 'miniBp_richer', s4 = 'miniBp_yb';
				src = allData.allImageUrl + 'miniBp_yb.png';
			}
			html += '<div class="miniActive_borderBox"><span class="miniActive_border1 ' + s1 + '"></span><span class="miniActive_border2 ' + s2 + '"></span>';
			html += '<span class="' + s3 + '"></span><span class="' + s4 + '"></span>';
			html += '</div></div>';

			html += '<div class="miniActive_area">';
			for (var x = 1; x < 11; x++) {
				html += '<img class="mini_active_img mini_active_img' + x + '" src="' + src + '" />';
			}
			html += '</div>';
			if (e.msgType == 'song') {
				html += '<div class="miniRow_foot miniRow_active">';
				html += '<p><' + e.songName + '>——' + e.singer + '</p>';
				html += '</div>';
			}
			html += '</div>';
			$('#miniBpBox').html(html);
			var x = 0;
			var inter = setInterval(function () {
				if (x == 0) {
					$('#miniBpBox .miniActive_border1').hide();
					$('#miniBpBox .miniActive_border2').show();
					x = 1;
				} else {
					$('#miniBpBox .miniActive_border1').show();
					$('#miniBpBox .miniActive_border2').hide();
					x = 0;
				}
			}, 500);
			setTimeout(function () {
				clearInterval(inter);
			}, 10000);
			this.after(e);
		},
		after: function (dt) {
			if (dt.msgType == 'bp') {
				var b = bpControl.checkDelete(dt);
				var t = this;
				if (!b) {
					return t.close(function () {
						bpControl.clear();
						setTimeout(function () {
							bpControl.start();
						}, 500);
					});
				}
			}
			if (dt.msgType == 'bp' || dt.msgType == 'ds') {
				var _num = dt.num;
				var _tid = dt.tid;
				var isLoop = dt.isLoop;

				if (dt.isAuto == false && typeof dt.tid != 'undefined') {
					setTimeout(function () {
						ajax_bp(_tid, _num, function () { });
					}, 1000);
				}
				if (dt.isFail == false && dt.isAuto == false && dt.isRepeat != true && typeof dt.tid != 'undefined' && usedId.indexOf(dt.tid) == -1) {
					usedId.push(dt.tid);
				}
			}
			var t = this;
			setTimeout(function () {
				$('#miniBpBox').addClass('show');
				$('.miniRow').addClass('animate');
				$('.miniRow_bpVideo').addClass('animate');
				if ($('.miniRow_bpImg').length > 0) {
					$($('.miniRow_bpImg')[0]).addClass('animate');
					if ($('.miniRow_bpImg').length > 1)
						t.changeImg($('.miniRow_bpImg')[0]);
				}
				if (SystemControl.data.bg == 0)
					videoControl.loop.stop();
				var showTime = dt.fuckTime;
				t.countTime(showTime, dt);
			}, 0);
		},
		changeImg: function (e) {
			var t = this;
			if (!this.able)
				return;
			setTimeout(function () {
				var index = $(e).index() + 1;
				index = index >= $(e.parentNode).find('.miniRow_bpImg').length ? 0 : index;
				var newImg = $(e.parentNode).find('.miniRow_bpImg')[index];
				$(newImg).removeClass('remove').addClass('animate');
				$(e).addClass('remove').removeClass('animate');
				t.changeImg(newImg);
			}, 5000);
		},
		countTime: function (showTime, e) {
			var t = this;
			$('.danmuBox').addClass('hide');
			showTime = parseInt(showTime);
			setTimeout(function () {
				setTimeout(function () {
					if (e.msgType == 'bp') {
						var b = bpControl.checkDelete(e);
						if (!b) {
							return t.close(function () {
								bpControl.clear();
								setTimeout(function () {
									bpControl.start();
								}, 500);
							});
						}
					}
					showTime--;
					if (showTime == -1) {
						t.close(function () {
							bpControl.clear();
							setTimeout(function () {
								bpControl.start();
							}, 500);
						});
						return;
					}
					if (e.msgType == 'bp') {
						bpControl.saveBp.save(e, showTime);
					}
					$('#bpTime').html(showTime);
					setTimeout(arguments.callee, 1000);
				}, 1000);
			}, 1000);
		},
		close: function (fn) {
			this.able = false;
			$('.miniRow').addClass('close');
			setTimeout(function () {
				$('#miniBp').remove();
				if (fn)
					fn();
			}, 450);
		}
	},
	delBp: function () {
		bpControl.saveBp.clear();
		bpControl.clear();
		setTimeout(function () {
			bpControl.start();
		}, 500);
	},
	deleteId: [],
	toDel: function (id) {
		if (this.deleteId.indexOf(id) == -1) {
			this.deleteId.push(id);
		}
	},
	checkDelete: function (e) {
		if (typeof e.tid == 'undefined' || e.tid == null || e.tid == '')
			return true;
		if (this.deleteId.length == 0)
			return true;
		return this.deleteId.indexOf(e.tid) == -1;
	},
	saveBp: {
		load: function () {
			var e = localStorage.getItem('bpObj');
			var time = localStorage.getItem('bpTime');
			try {
				if (e != null && e != '' && time != null && time != 0 && parseInt(time) > 1) {
					e = JSON.parse(e);
					e.fuckTime = e.richTime = parseInt(time) + 1;
					e.isRepeat = true;
					e.num = 1;
					e.maxLoop = 1;
					ajax_isDel(e.tid, function (bool) {
						if (bool == 'true')
							return bpControl.add(e);
						bpControl.saveBp.clear();
					}, function () { });
				}
			} catch (ex) { }
		},
		save: function (e, time) {
			try {
				var obj = JSON.stringify(e);
				localStorage.setItem('bpObj', obj);
				localStorage.setItem('bpTime', time);
			} catch (ex) { }
		},
		clear: function () {
			localStorage.setItem('bpObj', '');
			localStorage.setItem('bpTime', 0);
		}
	},
	usedId: [],
	config: {},
	noImg: function (e) {
		$(e).attr({ src: allImage.noImgSrc });
	},
	setImageAnimate: function (b) {
		SystemControl.data.bpAnimate = b;
	},
	setAudio: function (b) {
		SystemControl.data.bpAudio = b;
	},
	setCount: function (b) {
		this.isCount = b;
	},
	imageAnimateTimeout: null,
	able: true,
	isCount: true,
	used: [],
	list: [],
	maxNum: 10,
	manage: {
		loadTime: 8000,//加载超时放弃
		isLoad: false,
		timeout: null,
		startCount: function (img, fn) {
			this.isLoad = false;
			this.timeout = setTimeout(function () {
				//App.public.showInfo('用户霸屏图片加载失败，请检查您的网络')
				if (!bpControl.manage.isLoad && fn)
					fn();
			}, this.loadTime);
		},
		stopCount: function () {
			this.isLoad = true;
			clearTimeout(this.timeout);
		},
		addFail: function (dt) {
			bpControl.list.push(dt);
		}
	},
	bVideo: function (e) {
		if ($(e).width() / $(e).height() >= 1) {
			$(e).css({ width: 900 });
		} else {
			$(e).css({ height: '100%' });
		}
	},
	getBPname: function (item) {
		var bNames = '';
        switch (item.barpinTheme) {
            case 1: bNames = '生日霸屏'; break;
            case 2: bNames = '示爱霸屏'; break;
            case 3: bNames = '求约霸屏'; break;
            case 4: bNames = '求婚霸屏'; break;
            case 5: bNames = '女神霸屏'; break;
            default: bNames = '重金霸屏'; break;
        }
		return bNames;
	},
	onlyText: function (e) {
		e.textType = 'type1';
		var src = e.sex == '男' ? allImage.bpUser_man : allImage.bpUser_woman;
		var tNum = '';
		if (e.maxLoop > 1) {
			tNum = ' 第 ' + (e.maxLoop - e.num + 1) + ' 次'
		}
		if (e.pascreenSort != -1){
			tNum = '';
		}
		var theme = e.theme == -1 ? 'Bp' : e.theme;
		var html = '';
		html += '<div class="newBpBoxCover"></div><div class="newBpBox"><div class="newBpMain onlyText">';
		html += '<div class="newBpHornBox full"><div class="_newBpHornBox">';
		html += '<span class="onWallBpHorn leftTopHorn onWallBpHorn_theme' + theme + '"></span><span class="onWallBpHorn rightTopHorn onWallBpHorn_theme' + theme + '"></span><span class="onWallBpHorn leftBottomHorn onWallBpHorn_theme' + theme + '"></span><span class="onWallBpHorn rightBottomHorn onWallBpHorn_theme' + theme + '"></span>';
		var o1 = (e.sex == '男') ? 'onWallManCircle1' : 'onWallWomanCircle1';
		var o2 = (e.sex == '男') ? 'onWallManCircle2' : 'onWallWomanCircle2';
		html += '<span class="onWallNewUserBox"><span class="onWallUserCircle1 ' + o1 + '"></span>\
				<span class="onWallUserCircle2 ' + o2 + '"></span><span class="onWallHat1"></span>\
				<img class="onWallNewUser" src="' +  e.userPic + '" />';
		var wingName = 'bpHead_wing';
		if (e.sex == '男')
			wingName += ' bpHead_manWing';
		else
			wingName += ' bpHead_womanWing';
		html += '<tt class="' + wingName + '"><span></span><i>' + bpControl.getBPname(e) + '</i></tt>';
		html += '<tt class="' + wingName + ' right"><span></span><i>' + e.second + '秒</i></tt>';
		html += '</span>';
		html += '<div class="onWallBpNameDiv"><span class="themeName_theme themeName_theme' + theme + '"></span>' + e.nickName + '</div>';
		html += '<div class="newBpHornBoxText">';
		html += '<b class="bpColor" id="newBpMsg">' + e.content + '</b></div>';
		html += '<div class="onWallBpTimeBox">';
		html += '<div class="themeCover_theme themeCover_theme' + theme + '"></div>';
		html += '<tt><span class="themeLogo_theme themeLogo_theme' + theme + '"></span>';
		if (e.bpForName != null)
			html += '为 ' + e.bpForName + ' ';
		html += bpControl.getBPname(e) + ' <b id="bpTime">' + e.second + '</b> 秒' + tNum + '';
		if (e.pascreenSort != -1)
			html += ' <i>第' + e.pascreenSort + '位霸屏</i>';
		html += '<tt></div>';
		html += '</div></div></div></div>';

		$('.bpMain').html(html);
		this.after(e);
	},
	onlyImage: function (e) {
		var src = (e.sex == '男') ? allImage.bpUser_man : allImage.bpUser_woman;
		var tNum = '';
		if (e.maxLoop > 1) {
			tNum = ' 第 ' + (e.maxLoop - e.num + 1) + ' 次'
		}
		if (e.pascreenSort != -1)
			tNum = '';
		var theme = e.theme == -1 ? 'Bp' : e.theme;
		var html = '<div class="newBpBoxCover"></div><div class="newBpBox"><div class="newBpMain">';
		html += '<div class="newBp"><div id="newBpImageBox">';
		if (e.videoUrl) {
			html += '<video id="newBpVideo" loop="loop" poster="' + e.src + '"></video>';
		} else {
			html += '<div id="hehe" style="position:relative">';
			if (e._imgArr && e._imgArr.length > 1) {
				var splitSrc = e._imgArr;
				for (var x = 0; x < splitSrc.length; x++) {
					if (x == 0)
						html += '<img onload="bpControl.hehe(this)" class="newBpImage pos" src="' + splitSrc[x] + '" />';
					else
						html += '<img class="newBpImage hide" src="' + splitSrc[x] + '" />';
				}
			} else
				html += '<img onload="bpControl.hehe(this)" class="newBpImage" src="' + e._imgArr[0] + '" />';
			html += '</div>';
		}
		html += '</div></div>';

		html += '<div class="newBpUser">';
		html += '<div class="newBpHornBox"><div class="_newBpHornBox onlyImg">';
		html += '<span class="onWallBpHorn mini leftTopHorn onWallBpHorn_theme' + theme + '"></span>\
				<span class="onWallBpHorn mini rightTopHorn onWallBpHorn_theme' + theme + '"></span>\
				<span class="onWallBpHorn mini leftBottomHorn onWallBpHorn_theme' + theme + '">\
				</span><span class="onWallBpHorn mini rightBottomHorn onWallBpHorn_theme' + theme + '"></span>';
		var o1 = (e.sex === '男') ? 'onWallManCircle1' : 'onWallWomanCircle1';
		var o2 = (e.sex === '男') ? 'onWallManCircle2' : 'onWallWomanCircle2';
		html += '<span class="onWallNewUserBox"><span class="onWallUserCircle1 ' + o1 + '"></span>\
		<span class="onWallUserCircle2 ' + o2 + '"></span><span class="onWallHat1"></span>\
		<img class="onWallNewUser" src="' +  e.userPic + '" />';

		var wingName = 'bpHead_wing mini';
		if (e.sex === '男')
			wingName += ' bpHead_manWing';
		else
			wingName += ' bpHead_womanWing';
		html += '<tt class="' + wingName + '"><span></span><i>' + bpControl.getBPname(e) + '</i></tt>';
		html += '<tt class="' + wingName + ' right"><span></span><i>' + e.second + '秒</i></tt>';

		html += '</span>';
		html += '<div class="onWallBpNameDiv mini"><span class="mini themeName_theme themeName_theme' + theme + '"></span>'
			 + e.nickName + '</div>';
		html += '<div class="newBpHornBoxText mini">';
		html += '<b class="bpColor" id="newBpMsg">' + e.content + '</b></div>';
		html += '<div class="onWallBpTimeBox mini"><div class="mini themeCover_theme themeCover_theme' + theme + '"></div><tt><span class="mini themeLogo_theme themeLogo_theme' + theme + '"></span>';
		if (e.bpForName != null)
			html += '为 ' + e.bpForName + ' ';
		html += bpControl.getBPname(e) + ' <b id="bpTime">' + e.second + '</b> 秒' + tNum + '';
		if (e.pascreenSort != -1)
			html += ' <i>第' + e.pascreenSort + '位霸屏</i>';
		html += '<tt></div>';
		html += '</div></div></div></div></div>';

		$('.bpMain').html(html);
		var t = this;
		if (e.videoUrl) {
			this.loadVideo($('#newBpVideo'), e, function () {
				if ($('#newBpVideo').length > 0) {
					$('#newBpVideo')[0].volume = 0;
					$('#newBpVideo')[0].play();
					bpControl.bVideo($('#newBpVideo')[0]);
				}
				t.after(e);
			});
		} else
			this.after(e);
	},
	imageText: function (e) {
		e.textType = 'type3';
		var src = (e.sex === '男') ? allImage.bpUser_man : allImage.bpUser_woman;
		var tNum = '';
		if (e.maxLoop > 1) {
			tNum = ' 第' + (e.maxLoop - e.num + 1) + '次'
		}
		if (e.pascreenSort != -1)
			tNum = '';
		var theme = e.theme == -1 ? 'Bp' : e.theme;
		var html = '';
		html += '<div class="newBpBoxCover"></div><div class="newBpBox"><div class="newBpMain">';
		html += '<div class="newBp"><div id="newBpImageBox">';
		if (e.videoUrl) {
			html += '<video id="newBpVideo" loop="loop" poster="' + e.src + '"></video>';
		} else {
			html += '<div id="hehe" style="position:relative">';
			if (e._imgArr && e._imgArr.length > 1) {
				var splitSrc = e._imgArr;
				for (var x = 0; x < splitSrc.length; x++) {
					if (x == 0)
						html += '<img onload="bpControl.hehe(this)" class="newBpImage pos" src="' + splitSrc[x] + '" />';
					else
						html += '<img class="newBpImage hide" src="' + splitSrc[x] + '" />';
				}
			} else {
				html += '<img onload="bpControl.hehe(this)" class="newBpImage" src="' + e._imgArr[0] + '" />';
			}
			html += '</div>';
		}
		html += '</div></div>';
		html += '<div class="newBpUser">';
		html += '<div class="newBpHornBox full" style="padding-top:90px; padding-bottom:90px"><div class="_newBpHornBox" style="padding-top:115px;">';
		html += '<span class="onWallBpHorn small leftTopHorn onWallBpHorn_theme' + theme + '"></span>\
			<span class="onWallBpHorn small rightTopHorn onWallBpHorn_theme' + theme + '"></span>\
			<span class="onWallBpHorn small leftBottomHorn onWallBpHorn_theme' + theme + '"></span>\
			<span class="onWallBpHorn small rightBottomHorn onWallBpHorn_theme' + theme + '"></span>';
		var o1 = (e.sex === '男') ? 'onWallManCircle1' : 'onWallWomanCircle1';
		var o2 = (e.sex === '男') ? 'onWallManCircle2' : 'onWallWomanCircle2';
		html += '<span class="onWallNewUserBox"><span class="onWallUserCircle1 ' + o1 + '"></span>\
		<span class="onWallUserCircle2 ' + o2 + '"></span><span class="onWallHat1"></span>\
		<img class="onWallNewUser" src="' +  e.userPic + '" />';
		var wingName = 'bpHead_wing mini';
		if (e.sex === '男')
			wingName += ' bpHead_manWing';
		else
			wingName += ' bpHead_womanWing';
		html += '<tt class="' + wingName + '"><span></span><i>' + bpControl.getBPname(e) + '</i></tt>';
		html += '<tt class="' + wingName + ' right"><span></span><i>' + e.second + '秒</i></tt>';
		html += '</span>';
		html += '<div class="onWallBpNameDiv mini"><span class="mini themeName_theme themeName_theme' + theme + '"></span>'
			 + e.nickName + '</div>';
		html += '<div class="newBpHornBoxText mini">';
		html += '<b class="bpColor" id="newBpMsg">' + e.content + '</b></div>';
		html += '<div class="onWallBpTimeBox mini" style="bottom:-75px"><div class="themeCover_theme mini themeCover_theme' + theme + '"></div><tt><span class="themeLogo_theme mini themeLogo_theme' + theme + '"></span>';
		if (e.bpForName != null)
			html += '为 ' + e.bpForName + ' ';
		html += bpControl.getBPname(e) + ' <b id="bpTime">' + e.second + '</b> 秒' + tNum + '';
		if (e.pascreenSort != -1)
			html += ' <i>第' + e.pascreenSort + '位霸屏</i>';
		html += '<tt></div>';
		html += '</div></div></div></div></div>';

		$('.bpMain').html(html);
		var t = this;
		if (e.videoUrl) {
			this.loadVideo($('#newBpVideo'), e, function () {
				if ($('#newBpVideo').length > 0) {
					$('#newBpVideo')[0].volume = 0;
					$('#newBpVideo')[0].play();
					bpControl.bVideo($('#newBpVideo')[0]);
				}
				t.after(e);
			});
		} else {
			this.after(e);
		}
	},
	old: {
		onlyText: function (e) {
			var bNames = bpControl.getBPname(e);
			var html = '<div class="oldBpText"><div class="table"><span class="tableSpan">';
			if (e.bpForName != null) {
				html += '<div class="oldBpForTa">为 <tt>' + e.bpForName + '</tt> ' + bNames;
				if (e.pascreenSort != -1) {
					html += ' 第 <tt>' + e.pascreenSort + '</tt> 位霸屏';
				} else {
					if (e.maxLoop > 1) {
						html += ' 第 <tt>' + (e.maxLoop - e.num + 1) + '</tt> 次';
					}
				}
				html += '</div>';
			} else {
				if (e.pascreenSort != -1) {
					html += '<div class="oldBpForTa"> 第 <tt>' + e.pascreenSort + '</tt> 位霸屏</div>';
				} else {
					if (e.maxLoop > 1) {
						html += '<div class="oldBpForTa">霸屏 第 <tt>' + (e.maxLoop - e.num + 1) + '</tt> 次</div>';
					}
				}
			}
			html += '<div class="oldBpFont" id="newBpMsg">' + e.content + '</div>';
			html += '</span></div>';
			html += '<div class="oldBpUserInfo"><img class="' + e.sex + '" src="' +  e.userPic + '" />';
			html += '<span class="oldBpUserName">' + e.nickName + '<span class="oldBpCount">' + bNames + ' <tt id="bpTime">' + e.second + '</tt> 秒<tt class="bpWMlogo"></tt></span></span>';
			html += '</div></div>';
			for (var x = 1; x <= 10; x++) {
				html += '<img class="richStar richStar' + x + '" src="' + allImage.starSrc + '" />';
			}
			$('.bpMain').html(html);
			bpControl.after(e);
		},
		onlyImage: function (e) {
			var bNames = bpControl.getBPname(e);
			var html = '<div class="oldBpImage">';
			html += '<div class="oldBpLeft">';
			if (e.videoUrl) {
				html += '<video id="oldBpVideo" loop="loop" poster="' + e.src + '"></video>';
			} else {
				if (e._imgArr  && e._imgArr.length > 1) {
					var splitSrc = e._imgArr;
					for (var x = 0; x < splitSrc.length; x++) {
						if (x == 0)
							html += '<img class="oldBpLeftImage pos" onload="bpControl.animateImage(this)" src="' + splitSrc[x] + '" />';
						else
							html += '<img class="oldBpLeftImage hide" src="' + splitSrc[x] + '" />';
					}
				} else
					html += '<img class="oldBpLeftImage" onload="bpControl.animateImage(this)" src="' + e._imgArr[0] + '" />';
			}
			html += '</div>';
			html += '<div class="oldBpRight"><div class="oldBpUserInfo">';
			html += '<img class="' + e.sex + '" src="' +  e.userPic + '" />';
			html += '<span class="oldBpUserName">' + e.nickName + '</span></div>';
			html += '<div class="table"><span class="tableSpan">';
			if (e.bpForName != null) {
				html += '<div class="oldBpForTa">为 <tt>' + e.bpForName + '</tt> ' + bNames;
				if (e.pascreenSort != -1) {
					html += ' 第 <tt>' + e.pascreenSort + '</tt> 位霸屏';
				} else {
					if (e.maxLoop > 1)
						html += '第 <tt>' + (e.maxLoop - e.num + 1) + '</tt> 次';
				}

				html += '</div>';
			} else {
				if (e.pascreenSort != -1) {
					html += '<div class="oldBpForTa"> 第 <tt>' + e.pascreenSort + '</tt> 位霸屏</div>';
				} else {
					if (e.maxLoop > 1)
						html += '<div class="oldBpForTa">霸屏 第 <tt>' + (e.maxLoop - e.num + 1) + '</tt> 次</div>';
				}
			}
			html += '</span></div>';
			html += '<div class="oldBpCount">' + bNames + ' <tt id="bpTime">' + e.second + '</tt> 秒<tt class="bpWMlogo"></tt></div>';
			html += '</div></div>';
			$('.bpMain').html(html);

			if (e.videoUrl) {
				bpControl.loadVideo($('#oldBpVideo'), e, function () {
					setTimeout(function () {
						videoControl.fullScreen($('#oldBpVideo')[0], e.videoData, $('#oldBpVideo')[0].parentNode);
						$('#oldBpVideo')[0].volume = 0;
						$('#oldBpVideo')[0].play();
					}, 60);
					bpControl.after(e);
				});
			} else {
				bpControl.after(e);
			}
		},
		imageText: function (e) {
			var bNames = bpControl.getBPname(e);
			var html = '<div class="oldBpBoth">';
			html += '<div class="oldBpLeft">';
			if (e.videoUrl) {
				html += '<video id="oldBpVideo" loop="loop" poster="' + e.src + '"></video>';
			} else {
				if (e._imgArr && e._imgArr.length > 1) {
					var splitSrc = e._imgArr;
					for (var x = 0; x < splitSrc.length; x++) {
						if (x == 0)
							html += '<img class="oldBpLeftImage pos" onload="bpControl.animateImage(this)" src="' + splitSrc[x] + '" />';
						else
							html += '<img class="oldBpLeftImage hide" src="' + splitSrc[x] + '" />';
					}
				} else
					html += '<img class="oldBpLeftImage" onload="bpControl.animateImage(this)" src="' + e._imgArr[0] + '" />';
			}
			html += '</div>';
			html += '<div class="oldBpRight"><div class="oldBpUserInfo">';
			html += '<img class="' + e.sex + '" src="' +  e.userPic + '" />';
			html += '<span class="oldBpUserName">' + e.nickName + '</span></div>';
			html += '<div class="table"><span class="tableSpan">';
			if (e.bpForName != null) {
				html += '<div class="oldBpForTa">为 <tt>' + e.bpForName + '</tt> ' + bNames;
				if (e.pascreenSort != -1) {
					html += ' 第 <tt>' + e.pascreenSort + '</tt> 位霸屏';
				} else {
					if (e.maxLoop > 1)
						html += '第 <tt>' + (e.maxLoop - e.num + 1) + '</tt> 次';
				}

				html += '</div>';
			} else {
				if (e.pascreenSort != -1) {
					html += '<div class="oldBpForTa"> 第 <tt>' + e.pascreenSort + '</tt> 位霸屏</div>';
				} else {
					if (e.maxLoop > 1)
						html += '<div class="oldBpForTa">霸屏 第 <tt>' + (e.maxLoop - e.num + 1) + '</tt> 次</div>';
				}
			}
			html += '<div class="oldBpFont" id="newBpMsg">' + e.content + '</div>';
			html += '</span></div>';
			html += '<div class="oldBpCount">' + bNames + ' <tt id="bpTime">' + e.second + '</tt> 秒<tt class="bpWMlogo"></tt></div>';
			html += '</div></div>';
			$('.bpMain').html(html);
			if (e.videoUrl) {
				bpControl.loadVideo($('#oldBpVideo'), e, function () {
					setTimeout(function () {
						videoControl.fullScreen($('#oldBpVideo')[0], e.videoData, $('#oldBpVideo')[0].parentNode);
						$('#oldBpVideo')[0].volume = 0;
						$('#oldBpVideo')[0].play();
					}, 60);
					bpControl.after(e);
				});
			} else {
				bpControl.after(e);
			}
		}
	},
	_ds: function (dt) {
		var t = this;
		var dsData = allData.dsData;
		var videoSrc, img, giftName, useData = dsData, useId;
		if (dt.giftId != 'cake') {
			//打赏
			giftName = dsData[dt.giftId].name;
			useId = dt.giftId;
		} else {
			//蛋糕
			dt.giftId = 'cake';
			giftName = dsData[dt.giftId].name;
			useId = dt.giftId;
		}

		var html = '<div class="textMain">';
		html += '<div class="_textMain">';
		html += '<p class="textMain1 animate"><img class="' + dt.sex + '" src="' + dt.head + '" />' + dt.userName + '</p>';

		if (dt.giftId != 'cake') {
			html += '<p class="textMain2">打赏给 ' + dt.showName + '</p>';
			html += '<p class="textMain3"><tt>' + giftName + '</tt></p>';
			if (dt.msg != null && $.trim(dt.msg).length > 0)
				html += '<p class="textMain0">' + dt.msg + '</p>';
		} else {
			html += '<p class="textMain2">为 ' + dt.toName + ' 重金霸屏</p>';
			html += '<p class="textMain3"><tt>' + giftName + '</tt></p>';
			if (dt.msg != null && $.trim(dt.msg).length > 0)
				html += '<p class="textMain0">' + dt.msg + '</p>';
		}
		html += '<p class="textMain4">倒计时 <tt id="bpTime">' + dt.giftTime + '</tt> 秒<tt class="bpWMlogo"></tt></p>';
		html += '</div>';

		html += '<p class="littleImageBox"><img onload="bpControl.setLittleImg(this)" class="littleImage" /></p>';

		html += '<div style="clear:both"></div>';
		html += '</div>';
		html += '<div class="richDsLeft"><div class="dsVideoCover"></div>';

		html += '<video id="dsVideo" loop="loop" poster="' + useData[useId].img + '"></video>';

		html += '</div>';
		html += '<div class="richDsRight"><div class="playerImgCover"></div><img class="playerImg" onload="bpControl.setImage(this,true)" /></div>';
		$('.bpMain').html(html);


		var t = this;
		dt.videoUrl = allData.videoUrl + useData[useId].src;
		this.loadVideo($('#dsVideo'), dt, function () {
			$('.littleImageBox .littleImage').attr({ src: dt.src });
			$('.richDsRight .playerImg').attr({ src: dt.src });
			setTimeout(function () {
				var h = $('.textMain')[0].offsetHeight;
				var w = $('.textMain')[0].offsetWidth;
				$('.textMain').css({ top: '50%', marginTop: h / -2, right: ($('#bpControl').width() - w) / 2 });
				$('.textMain').addClass('show');
				setTimeout(function () {
					$('.textMain').addClass('animate');
					$('.textMain').animate({ right: 0 }, 1200);
					setTimeout(function () {
						$('.playerImgCover').addClass('animate');
						$('.dsVideoCover').addClass('animate');
						if ($('#dsVideo').length > 0) {
							var e = $('#dsVideo')[0];
							videoControl.fullScreen(e, videoControl.defaultData, e.parentNode);
							$('#dsVideo')[0].play();
						}
					}, 1200);
				}, 1100);
			}, 360);
			t.after(dt);
		});
	},
	ds: function (dt) {
		var giftId = dt.giveInfo.goodsId;
		var giftItem = GiftModule.getById(giftId);
		dt.fuckTime = giftItem.time;
		var msg = dt.giveInfo.content;
		if (msg == null || msg.length == 0)
			msg = '';
		var sex = dt.sex === '男' ? allImage.dsToMan : allImage.dsToWoMan;
		var html = '<div class="dsControlCover"><img class="dsToBg" src="' + allImage.newDsBg + '" /></div>';
		html += '<div id="dsControl">';
		html += '<div class="dsTop">';
		html += '<div class="dsSender"><img class="dsToCircle" src="' + sex + '" /><img class="sendHead" src="' + dt.userPic + '" /><span class="dsUserName">' + dt.nickName + '</span></div>';
		html += '<div class="dsGeter"><img class="dsToCircle" src="' + allImage.dsToObj + '" /><img class="sendHead" src="' + (dt.giveInfo.givenUserImgUrl || '') + '" /><span class="dsUserName">' + dt.giveInfo.givenUserName + '</span></div>';
		html += '<div class="dsTopCenter"><p class="dsGiftName redColorFont">' + giftItem.goodsName + '</p>';

		html += '<div><span class="redColorFont">' + msg + '</span></div>';
		html += '<p class="dsJtBox"><span class="redColorFont">打赏给</span><img src="' + allImage.dsJt + '" /></p>';
		var sourceVal = '';
		if (dt.source == 3)
			sourceVal = '私聊';
		else
			sourceVal = '微上墙';
		if (sourceVal != '')
			html += '<p class="dsFrom redColorFont">来源：' + sourceVal + '</p>';
		html += '</div>';
		html += '</div>';

		var sHtml = '<img class="noSWFimg" src="' + giftItem.goodsBigUrl + '" />';

		$('<div id="flashContent"></div>').appendTo('body');
		var t = this;
		tools.loadImage(giftItem.goodsBigUrl, function () {
			$(html + sHtml + '</div>').appendTo('#all');
			bpControl.countTime(dt.fuckTime, null, dt);
			// var _num = dt.num;
			// var _tid = dt.tid;
			// if (dt.isAuto == false && typeof dt.tid != 'undefined') {
			// 	ajax_bp(_tid, _num, function () { });
			// }
			// if (usedId.indexOf(dt.tid) == -1 && dt.isFail == false && dt.isAuto == false && dt.isRepeat != true) {
			// 	usedId.push(dt.tid);
			// }
		});
	},
	moveImage: function (e) {
		App.public.centerImage(e, function () {
			bpControl.onylImageAnimate(e);
		});
	},
	setLittleImg: function (e) {
		if (e.offsetHeight > e.parentNode.offsetHeight) {
			var top = (e.offsetHeight - e.parentNode.offsetHeight) / -2;
			$(e).css({ top: top });
		}
		$('.textMain').css({ paddingRight: $(e).width() + 30 });
	},
	clear: function () {
		$('.switchMain').removeClass('hidden');
		$('#foot').removeClass('hidden');
		$('.WM_QR').removeClass('hidden');
		$('.danmuBox').removeClass('hide');
		// wemewSWF.end();
		var t = this;
		try {
			t.sliderObj.close();
			t.sliderObj = null;
		} catch (ex) { }
		if ($('#jPlayerBox').length > 0) {
			try {
				jPlayerVideo.close();
			} catch (ex) { }
		} else {
			try {
				var video = $('#bpVideo');
				if (video.length > 0)
					video.remove();
			} catch (ex) { }
		}
		if (SystemControl.data.bg == 0)
			videoControl.loop.reset();
		$(window).unbind('resize.setImage');
		clearTimeout(t.imageAnimateTimeout);
		audioControl.close();
		$('#allBox').removeClass('hide');
		$('#bpControl').removeClass('show wait');
		//清楚
		$(".hwactive_img1").remove();
		$(".hwactive_img2").remove();
		$(".hwactive_img3").remove();
		$('.hwgh_img1').remove();
		$('.hwgh_img2').remove();
		$('.hwgh_img3').remove();
		$('.hwgh_img4').remove();
		$('.hwgh_img5').remove();
		$('.hwgh_img6').remove();
		$('.hwgh_img7').remove();
		$('.hwgh_img8').remove();
		$('.hwactive_cat').remove();
		$('.hwactive_spider').remove();
		$('.hwactive_zombie').remove();
		$("#hwanimation").html('')

		t.bpFont.close();
		t.closeBg();
		$('.bpCover').html('');
		$('.bpMain').html('');
		$('#dsControl').remove();
		$('.dsControlCover').remove();
	},
	_show: function (dt) {
		if (dt.type == 'bp') {
			var b = this.checkDelete(dt);
			if (!b) {
				return this.delBp();
			}
		}
		var t = this;
		if ((dt.type == TYPE.GIVE || dt.status == STATUS.BA) && dt.num > 1) {
			bpControl.loop(dt);
		}
		this.show(dt);
	},
	loadVideo: function (videoEle, e, callback) {
		videoEle = videoEle.length > 0 ? videoEle[0] : videoEle;
		var t = this;
		var isLoad = false;
		$(videoEle).unbind('canplaythrough error stalled');
		$(videoEle).bind('canplaythrough', function () {
			$(videoEle).unbind('canplaythrough error stalled');
			if (e.msgType == 'bp')
				e.videoData = videoControl.getData(videoEle);
			callback();
		}).bind('error stalled', function () {
			$(videoEle).unbind('canplaythrough error stalled');
			if (e.msgType == 'bp')
				e.videoData = null;
			callback();
		});
		$(videoEle).attr({ src: e.videoUrl });
		videoEle.load();
	},
	beforeBp: function (url, time, callback) {
		$('#beforeBpBox').remove();
		var html = '<div id="beforeBpBox" class="hide"><video id="beforeBpVideo" src="' + url + '"></video></div>';
		$(html).appendTo($('body'));
		var videoEle = $('#beforeBpVideo');
		var isRun = false;
		var timeOut = null;
		$(videoEle).unbind('canplaythrough error stalled');
		$(videoEle).bind('canplaythrough', function () {
			try { clearTimeout(timeOut); } catch (ex) { }
			if (isRun)
				return;
			isRun = true;
			if (SystemControl.data.bg == 0)
				videoControl.loop.stop();
			$(videoEle).unbind('canplaythrough error stalled');
			videoControl.fullScreen(videoEle[0], { width: 1280, height: 720, dir: 1280 / 720 }, $('#beforeBpBox')[0]);
			$('#allBox').addClass('hide');
			$('#beforeBpBox').removeClass('hide');
			videoEle[0].play();
			setTimeout(function () {
				if (bpControl.isOpacity == 'true')
					$('#beforeBpBox').css({ 'visibility': 'hidden' });
				callback();
				setTimeout(function () {
					$('#beforeBpBox').remove();
				}, 500);
			}, time);
		}).bind('error stalled', function () {
			try { clearTimeout(timeOut); } catch (ex) { }
			if (isRun)
				return;
			isRun = true;
			$(videoEle).unbind('canplaythrough error stalled');
			$('#beforeBpBox').remove();
			callback();
		});
		timeOut = setTimeout(function () {
			if (isRun)
				return;
			isRun = true;
			$(videoEle).unbind('canplaythrough error stalled');
			$('#beforeBpBox').remove();
			callback();
		}, 10000);
	},
	//万圣节
	hw_loadImage: function (src, fn) {

		var img = new Image();
		img.onload = img.onerror = function () {
			if (fn)
				fn();
		}
		img.src = src;
	},
	hw_remove: function () {
		if ($(".hwactive_img1"))
			$(".hwactive_img1").remove();
		$(".hwactive_img2").remove();
		$(".hwactive_img3").remove();
		$('.hwgh_img1').remove();
		$('.hwgh_img2').remove();
		$('.hwgh_img3').remove();
		$('.hwgh_img4').remove();
		$('.hwgh_img5').remove();
		$('.hwgh_img6').remove();
		$('.hwgh_img7').remove();
		$('.hwgh_img8').remove();
		$('.hwactive_cat').remove();
		$('.hwactive_spider').remove();
		$('.hwactive_zombie').remove();
	},
	halloweenAnimation: function (cont) {
		var allHalloweenImageUrl = allData.allImageUrl + '/halloween';
		var t = this
		var hw_ghost = {
			creat: function () {
				t.hw_remove();
				var html = '';
				html += '<img src="' + allHalloweenImageUrl + '/ghost01.gif" class="hwgh_img1 cy_pa" style="z-index: 99999" alt="">';
				html += '<img src="' + allHalloweenImageUrl + '/ghost02.gif" class="hwgh_img2 cy_pa" style="z-index: 99999" alt="">';
				html += '<img src="' + allHalloweenImageUrl + '/ghost03.gif" class="hwgh_img3 cy_pa"  style="z-index: 99999" alt="">';
				html += '<img src="' + allHalloweenImageUrl + '/ghost01.gif" class="hwgh_img4 cy_pa" style="z-index: 99999" alt="">';
				html += '<img src="' + allHalloweenImageUrl + '/ghost02.gif" class="hwgh_img5 cy_pa" style="z-index: 99999" alt="">';
				html += '<img src="' + allHalloweenImageUrl + '/ghost03.gif" class="hwgh_img6 cy_pa"  style="z-index: 99999" alt="">';
				html += '<img src="' + allHalloweenImageUrl + '/ghost02.gif" class="hwgh_img7 cy_pa" style="z-index: 99999" alt="">';
				html += '<img src="' + allHalloweenImageUrl + '/ghost03.gif" class="hwgh_img8 cy_pa"  style="z-index: 99999" alt="">';
				$('#bpControl').append(html);
			}
		};
		var hw_cat = {
			creat: function () {
				t.hw_remove();
				var src = allHalloweenImageUrl + '/cat.gif?t=' + (new Date()).getTime();
				t.hw_loadImage(src, function () {
					var html = ''
					html += '<img src="' + src + '"  class="hwactive_cat cy_pa hwgh_cat" style="z-index: 99999;width: 100%;top: 100px;" alt="">';
					$('#bpControl').append(html);
				})


			}
		}
		var hw_spider = {
			creat: function () {
				t.hw_remove();
				var src = allHalloweenImageUrl + '/spider.gif?t=' + (new Date()).getTime();
				t.hw_loadImage(src, function () {
					var html = ''
					html += '<img src="' + src + '" class="hwactive_spider cy_pa hwgh_spider" width="100%;" height="100%" style="z-index: 99999;top: 0;" alt="">';
					$('#bpControl').append(html);
				})

			}
		}
		var hw_zombie = {
			creat: function () {
				t.hw_remove();
				var src = allHalloweenImageUrl + '/zombie.gif?t=' + (new Date()).getTime();
				t.hw_loadImage(src, function () {
					var html = ''
					html += '<img src="' + src + '" class="hwactive_zombie cy_pa hwgh_zombie" style="z-index: 99999;top: 330px;width: 100%" alt="">';
					$('#bpControl').append(html);
				})

			}
		}
		var hw_pumpkin = {
			creat: function () {
				t.hw_remove();
				var html = '';
				html + '<div id="hwanimation" class="hwgh_nangua">';
				html += '<img src="' + allHalloweenImageUrl + '/pumpkin.gif" class="hwactive_img1 cy_pa" style="z-index: 99999" alt="">';
				html += '<img src="' + allHalloweenImageUrl + '/pumpkin.gif" class="hwactive_img2 cy_pa" style="z-index: 99999" alt="">';
				html += '<img src="' + allHalloweenImageUrl + '/pumpkin.gif" class="hwactive_img3 cy_pa" style="z-index: 99999" alt="">';
				html += '</div>'
				$('#bpControl').append(html);
			}
		}
		if (cont == 1) {
			hw_pumpkin.creat();
			var timer = null;
			setTimeout(function () {
				t.hw_remove();
				clearTimeout(timer);
			}, 10000)
		} else if (cont == 2) {
			hw_ghost.creat();
		} else if (cont == 3) {
			hw_cat.creat();
		} else if (cont == 4) {
			hw_spider.creat();
		} else if (cont == 5) {
			hw_zombie.creat();
		}
	},
	halloween: function (dt, callback) {
		var get_person_style = {
			gets: function (data, random) {
				var allHalloweenImageUrl = allData.allImageUrl + '/halloween';
				var get_person_style;
				var random = random;
				get_person_style = '' + allHalloweenImageUrl + '/' + data + 'hw' + random + '.gif';
				return get_person_style;
			}
		};

		var halloween = {
			timer: null,
			len: 0,
			speed: 10,
			myclass: null,
			sex: 'woman',
			creat: function () {
				$('.hw_container').remove();
				var hwwomanName = ['萌萌哒僵尸', '小可爱僵尸', '小仙女僵尸', '洛丽塔僵尸', '社会姐僵尸', '女王僵尸', '脑洞僵尸', '女蛇精僵尸', '二次元僵尸',
					'小学生僵尸', '小学生僵尸', '吃货僵尸', '辣妹僵尸', '波霸僵尸', '麦霸僵尸']
				var hwmanName = ['小鲜肉僵尸', '暖男僵尸', '正太僵尸', '社会哥僵尸', '霸道总裁僵尸', '硬汉僵尸', '直男癌僵尸', '污妖王僵尸', '老司机僵尸',
					'酒鬼僵尸', '一杯倒僵尸', '蹦迪僵尸', '舞王僵尸', '麦霸僵尸']

				var sex = dt.sex;
				this.sex = sex;
				var ghostName = '萌萌哒僵尸'
				if (sex == 'man') {
					ghostName = hwmanName[this.random(0, 14)]
				} else {
					ghostName = hwwomanName[this.random(0, 15)]
				}
				var random = this.random(1, 4);
				this.myclass = '' + sex + '' + random + '';
				var get_person_styles = get_person_style.gets(sex, random);
				var src = get_person_styles + '?t=' + (new Date()).getTime();
				halloween._loadImage(src, function () {
					var html = '';
					html = '<div class="cy_hw_container">'
					html += '<div class="hw_container">';
					html += '<div class="halloweenBox cy_pr">';
					html += '<div class="hw_touxian cy_pa">';
					html += '<div class="cy_pa cy_hw_text"><p class="ellipsis cy_hw_text">这是' + dt.userName + '</p><p class="cy_hw_text">' + ghostName + '</p></div>';
					html += '</div>';
					html += '<div class="cy_halloween cy_pa">';
					html += '<div class="cy_pr hw_' + sex + '' + random + '">';
					html += '<img src="' + src + '" class="cy_pa halloweenImg" alt="">';
					html += '<img src="' + dt.head + '" class="hw_header cy_pa" alt="">';
					html += '</div>';
					html += '</div>';
					html += '</div>';
					html += '</div>';
					html += '</div>';

					$('#all').append(html);
					halloween.animation();
				});
			},
			_loadImage: function (src, fn) {
				var img = new Image();
				img.onload = img.onerror = function () {
					if (fn)
						fn();
				}
				img.src = src;
			},
			animation: function () {
				halloween.timer = setInterval(function () {
					if (halloween.myclass == 'man2') {
						halloween.speed = 7
					}
					halloween.len += halloween.speed;
					$('.cy_halloween').css({ transition: 'transform .3s linear' });
					$('.cy_halloween').css({ transform: 'translate3d(-' + halloween.len + 'px,0,0)' });
					if (halloween.myclass == 'man2') {
						if (halloween.len >= 320) {
							halloween.stop();
						}
					} else {
						if (halloween.len >= 420) {
							halloween.stop();
							if (halloween.myclass == 'man3') {
								setTimeout(function () {
									$('.hw_man3 .hw_header').css({ left: '263px', top: '268px' })
								}, 200)

							}
						}
					}

				}, 70)
			},
			stop: function () {
				var allHalloweenImageUrl = allData.allImageUrl + '/halloween'
				clearInterval(halloween.timer);
				$('.halloweenBox').css({ background: 'url("' + allHalloweenImageUrl + '/linght.png") no-repeat', backgroundSize: ' contain' });
				setTimeout(function () {
					$('.cy_hw_container').remove();
					callback();
				}, 3000);

			},
			random: function (Min, Max) {
				var Range = Max - Min;
				var Rand = Math.random();
				return (Min + Math.round(Rand * Range));
			}
		};
		halloween.creat();
	},
	show: function (dt) {
		// if (dt.type == TYPE.GIVE) {
		// 	tpControl.addPoint(dt.pid, dt.giftId, dt.newDate);
		// }

		if (SystemControl.data.bpType == 2)
			return this.miniBp.use(dt);
		if (dt.type === TYPE.RED_BAG) {
			return activeControl.start(dt);
		}
		$('#bpControl').addClass('wait');
		var showTime, delay = 0;
		dt.fuckTime = 10;
		dt.fontAni = false;
		if (dt.type == TYPE.GIVE && dt.giveInfo) {
			dt.giveInfo.giftId = dt.giftId =  17;
			dt.giftTime = dt.fuckTime = allData.newDs[dt.giveInfo.giftId].time;
			this.ds(dt);
		} else if (dt.msgType == 'cake') {
			dt.giftId = 'cake';
			dt.giftTime = dt.fuckTime = allData.dsData[dt.giftId].time;
			this._ds(dt);
		} else if (dt.msgType == 'loveNight') {
			dt.fuckTime = dt.richTime;
			if (SystemControl.data.bpType == 1)
				$('.bpCover').html('<div id="bpVideoBg"><canvas style="opacity:0.3"></canvas></div>');
			else
				$('.bpCover').html('<div id="bpVideoBg"></div>');
			this.loveNight(dt);
		} else if (dt.status == STATUS.BA) {
			dt.fontAni = true;
			dt.fuckTime = dt.second;
			if (SystemControl.data.bpType == 1) {// 简洁霸屏
				$('.bpCover').html('<div id="bpVideoBg"><canvas style="opacity:0.3"></canvas></div>');
				if (dt._imgArr && dt._imgArr.length) {
					if (dt.content)
						this.old.imageText(dt);
					else
						this.old.onlyImage(dt);
				} else
					this.old.onlyText(dt);
			} else {
				$('.bpCover').html('<div id="bpVideoBg"></div>');
				if (dt._imgArr && dt._imgArr.length) {
					if (dt.content)
						this.imageText(dt);
					else
						this.onlyImage(dt);
				} else {
					this.onlyText(dt);
				}
			}
		}
	},
	after: function (dt) {
		this._after(dt);
	},
	_after: function (dt) {
		var isLow = false;//location.href.indexOf('reqfrom=exe') != -1;
		$('#allBox').addClass('hide');
		var _num = dt.num;
		var _tid = dt.tid;
		var isLoop = dt.isLoop;
		// if (dt.isAuto == false && typeof dt.tid != 'undefined') {
		// 	setTimeout(function () {
		// 		ajax_bp(_tid, _num, function () { });
		// 	}, 1000);
		// }
		// if (dt.isFail == false && dt.isAuto == false && dt.isRepeat != true && typeof dt.tid != 'undefined' && usedId.indexOf(dt.tid) == -1) {
		// 	usedId.push(dt.tid);
		// }

		var t = this;
		if (dt.status == STATUS.BA) {
			if (SystemControl.data.bpType == 0) {
				t.bgAnimate(dt);
			} else {
				t.bgCanvas();	
			}
		}
		if (dt.status == STATUS.BA) {
			$('.switchMain').addClass('hidden');
			$('#foot').addClass('hidden');
			$('.WM_QR').addClass('hidden');
		}
		setTimeout(function () {
			$('#bpControl').addClass('show');
			if (SystemControl.data.bg == 0)
				videoControl.loop.stop();
			if (dt.fontAni) {
				t.fontAnimate(3, dt.textType);
			}
			/*播放音频*/
			try {
				if (SystemControl.data.bpAudio) {
					if (dt.videoUrl == null || dt.videoUrl == '')
						audioControl.play(allData.audioUrl[dt.msgType == 'ds' ? 1 : 0]);
				}
			} catch (ex) { }
			var showTime = dt.fuckTime;
			var zhongjiang = null;
			t.countTime(showTime, zhongjiang, dt);
		}, 0);
	},
	loadImgs: {
		index: 0,
		src: '',
		len: 0,
		error: [],
		load: function (imgs, callback) {
			this.callback = callback;
			this.index = 0;
			this.src = imgs;
			this.error = [];
			imgs = imgs.split(',');
			this.len = imgs.length;
			var t = this;
			for (var x = 0; x < imgs.length; x++) {
				t.loadImg(imgs[x]);
			}
		},
		setSrc: function () {
			var _src = this.src.split(',');
			var newSrc = [];
			for (var x = 0; x < _src.length; x++) {
				if (this.error.indexOf(_src[x]) == -1)
					newSrc.push(_src[x]);
			}
			newSrc = newSrc.join(',');
			return newSrc;
		},
		loadImg: function (src) {
			var t = this;
			var img = new Image();
			img.onload = function () {
				t.index++;
				if (t.index >= t.len) {
					t.callback(t.setSrc());
				}
			}
			img.onerror = function () {
				t.index++;
				t.error.push(src);
				if (t.index >= t.len) {
					t.callback(t.setSrc());
				}
			}
			img.src = src;
		}
	},
	imageBg: function () {
		$('.bpCover').html('<div class="modeLow"><div></div><img src="' + allImage.bg + '" /></div>');
	},
	_hehe: function (e) {
		bpControl.showOne(e);
		setTimeout(function () {
			$(e.parentNode).css({ transition: 'all 0.5s' });
		}, 1000);
	},
	showOne: function (e) {
		if (e.naturalWidth / e.naturalHeight >= 1) {
			$(e.parentNode).css({ width: 950 });
			$(e).css({ width: '100%' });
		} else {
			var w = $('#all')[0].offsetHeight * (e.naturalWidth / e.naturalHeight);
			$(e.parentNode).css({ width: w });
			$(e).css({ height: '100%' });
			//$(e.parentNode).css({height:'100%'});	
		}
		$(e).css({ visibility: 'visible' });
		setTimeout(function () {
			$(e).removeClass('show').addClass('remove');
			var arr = $(e.parentNode).find('.newBpImage');
			var index = $(e).index() + 1;
			index = index >= arr.length ? 0 : index;
			var newImg = arr[index];
			$(newImg).addClass('show');
			bpControl.showOne(newImg);
			setTimeout(function () {
				$(e).removeClass('remove show').css({ visibility: 'hidden' });
			}, 1000)
		}, 6000);
	},
	hehe: function (e) {
		if ($(e.parentNode).find('.newBpImage').length > 1)
			return this._hehe(e);
		if (e.naturalWidth / e.naturalHeight >= 1) {
			$(e).css({ width: 950 });
		} else {
			$(e).css({ height: '100%' });
		}
		var src = e.src;
		src = src.split('.');
		if (src.length == 0 || src[src.length - 1].toLowerCase() == 'png') {
			App.public.showInfo('PNG格式的图片没有切换特效')
			return;
		}
		$(e).css({ 'visibility': 'hidden' });

		this.sliderObj = new sliderAnimate({
			hasOffset: false,
			isNew: true,
			img: $('.newBpImage')[0],
			box: $('#hehe')[0],
			offsetX: 0,
			offsetY: 0,
			firstDelay: 500
		});
		this.sliderObj.auto();
	},
	setOld: function (e) {
		var dir = $(e.parentNode).width() / $(e.parentNode).height();
		if ($(e).width() / $(e).height() <= dir) {
			$(e).css({ width: '100%', height: 'auto', left: 0 });
			var mt = ($(e).height() - $(e.parentNode).height()) / -2;
			$(e).css({ top: mt });
		} else {
			$(e).css({ height: '100%', width: 'auto', top: 0 });
			var ml = ($(e).width() - $(e.parentNode).width()) / -2;
			$(e).css({ left: ml });
		}
	},
	_animateImage: function (e) {
		var arr = $(e.parentNode).find('.oldBpLeftImage');
		for (var x = 0; x < arr.length; x++)
			this.setOld(arr[x]);
		$(e).css({ visibility: 'visible' });
		setTimeout(function () {
			$(e).removeClass('show').addClass('remove');
			var arr = $(e.parentNode).find('.oldBpLeftImage');
			var index = $(e).index() + 1;
			index = index >= arr.length ? 0 : index;
			var newImg = arr[index];
			$(newImg).addClass('show');
			bpControl._animateImage(newImg);
			setTimeout(function () {
				$(e).removeClass('remove show').css({ visibility: 'hidden' });
			}, 1000)
		}, 5000);
	},
	animateImage: function (e) {
		if ($(e.parentNode).find('.oldBpLeftImage').length > 1)
			return this._animateImage(e);
		var offsetX = 0, offsetY = 0;
		var dir = $(e.parentNode).width() / $(e.parentNode).height();
		if ($(e).width() / $(e).height() <= dir) {
			$(e).css({ width: '100%', height: 'auto', left: 0 });
			var mt = ($(e).height() - $(e.parentNode).height()) / -2;
			$(e).css({ top: mt, visibility: 'visible' });
			offsetY = mt;
			offsetX = 0;
		} else {
			$(e).css({ height: '100%', width: 'auto', top: 0 });
			var ml = ($(e).width() - $(e.parentNode).width()) / -2;
			$(e).css({ left: ml, visibility: 'visible' });
			offsetY = 0;
			offsetX = ml;
		}

		var src = e.src;
		src = src.split('.');
		if (src.length == 0 || src[src.length - 1].toLowerCase() == 'png') {
			App.public.showInfo('PNG格式的图片没有切换特效')
			return;
		}
		$(e).css({ 'visibility': 'hidden' });
		this.sliderObj = new sliderAnimate({
			hasOffset: true,
			isNew: false,
			img: e,
			box: e.parentNode,
			offsetX: offsetX,
			offsetY: offsetY,
			firstDelay: 500
		});
		this.sliderObj.auto();
	},
	countTime: function (showTime, isActive, e) {
		var t = this;
		isActive = isActive == null ? -1 : isActive;
		showTime = parseInt(showTime);
		var showcont = 0;
		var closeTime = 0
		$('.danmuBox').addClass('hide');
		setTimeout(function () {
			setTimeout(function countDown() {
				if (e.msgType == 'bp') {
					var b = bpControl.checkDelete(e);
					if (!b) {
						return bpControl.delBp();
					}
				}
				showTime--;
				showcont += 1;
				closeTime += 1;

				if (showTime == -1) {
					bpControl.saveBp.clear();
					t.clear();
					if (isActive != -1 && e != null) {
						activeControl._start({
							active: isActive,
							sex: e.sex,
							head:  e.userPic,
							userName: e.userName,
							pascreenSort: e.pascreenSort
						}, 10000, function () {
							/*
							setTimeout(function(){
								t.start();	
							},500);	
							*/
						});
						return;
					}
					setTimeout(function () {
						t.start();
					}, 500);
					return;
				}
				if (e.msgType == 'bp') {
					bpControl.saveBp.save(e, showTime);
				}
				$('#bpTime').html(showTime);
				setTimeout(countDown, 1000);
			}, 1000);
		}, 1000);
	},
	createCircle: function (time) {
		Circles.create({
			id: 'bp-circle',
			radius: 21,
			value: 100,
			maxValue: 100,
			width: 2,
			text: function (value) {
				return '';
			},
			colors: ['rgba(255,255,255,0.3)', 'rgba(255,255,255,0.7)'],
			duration: time + 1000
		});
	},
	add: function (e, bool) {
		// if (e.type == TYPE.RED_BAG) {
		// 	try {
		// 		var redBagMoney = parseFloat(e.redPackageAmount);
		// 		if (redBagMoney < 10)
		// 			return;
		// 	} catch (ex) { }
		// }
		if (e.msgType == 'bp') {
			if (!this.checkDelete(e))
				return;
		}
		bool = !!bool;
		if (e.msgType == 'cake') {
			if (e.src == null || $.trim(e.src).length == 0)
				e.src = allImage.noCakeSrc;
		}
		//连霸总次数
		e.maxLoop = e.screenNum || 1;
		//当前次数
		e.num = e.num || e.screenNum || 1;
		//主题
		e.theme = (e.theme == null || e.theme.length == 0) ? -1 : e.theme;

		e._imgArr = e.msgImgUrl && e.msgImgUrl.split('|');
		e.toName = e.toName == null ? '' : e.toName;
		e.isFail = e.isFail == null ? false : e.isFail;
		e.isAuto = e.isAuto == null ? false : e.isAuto;
		e.isRepeat = e.isRepeat == null ? false : e.isRepeat;
		e.isLoop = bool;
		e.pascreenSort = e.pascreenSort || -1;
		this.list.push(e);
	},
	isOpacity: 'false',
	init: function () {
		if (this.isOpacity == 'true') {
			if (SystemControl.data.bpType == 0)
				$('.bpCover').addClass('opacity');
			else
				$('.bpCover').removeClass('opacity');
		} else {
			$('.bpCover').removeClass('opacity');
			//$('body').addClass('noOpacity');
		}
		this.start();
	},
	start: function () {
		try { clearTimeout(bpControl.con) } catch (ex) { }
		var t = this;
		this.con = setTimeout(function repeatFn() {
			if (t.list.length > 0 && t.able) {
				var dt = t.list.shift();
				// if (dt.isLoop != true && dt.isRepeat != true) {
				// 	repeatFn();
				// 	return;
				// }
				t._show(dt);
			} else
				t.con = setTimeout(repeatFn, 500);
		}, 500);
	},
	getRandom: function (begin, end) {
		return parseInt(Math.random() * ((end > begin ? end - begin : begin - end) + 1) + (end > begin ? begin : end));
	},
	getTextLength: function (txt) {
		var _len = 0, reg = /^[A-Za-z]+$/;
		for (var k = 0; k < txt.length; k++) {
			if (!reg.test(txt.charAt(k)))
				_len++;
			else
				_len += 0.5;
		}
		return _len;
	},
	fontAnimate: function (num, type) {
		var fontSize = SystemControl.data.bpFontSize;
		fontSize = 'size' + fontSize;
		var t = this;
		//i = i==null?0:i;
		var color = ['rgba(255,162,0,', 'rgba(255,255,255,'];
		//this.bpFont.init(color[i],$('#all'));
		var val = $.trim($('#newBpMsg').text());
		if (val.length == 0)
			return;
		var html = '';
		var len = val.length;
		var cname = type + ' ' + fontSize + ' ';
		if (len <= 2)
			cname += 'less2';
		else if (len <= 4)
			cname += 'less4';
		else if (len <= 6)
			cname += 'less6';
		else if (len <= 8)
			cname += 'less8';
		else if (len <= 18)
			cname += 'less18';
		else if (len <= 24)
			cname += 'less24';
		else if (len <= 36)
			cname += 'less36';
		else
			cname += 'mini';

		cname += ' ' + App.bpFontStyle;

		for (var x = 0; x < val.length; x++) {
			//var _cname = cname+' oneFont'+App.public.getRandom(1,4);
			html += '<span class="oneFont ' + cname + '">' + val.charAt(x) + '</span>';
		}
		$('#newBpMsg').html(html);
		setTimeout(function () {
			var word = $('#newBpMsg .oneFont'), x = 0;
			setTimeout(function repeatFn() {
				$(word[x]).css({
					'transition': '0.3s all',
					transform: 'translate3d(0,0,0) scale(1)',
					opacity: 1
				});
				//t.bpFont.draw(num,$(word[x]).offset().left,$(word[x]).offset().top);
				x++;
				if (x < word.length)
					setTimeout(repeatFn, 60);
				else
					setTimeout(function () {
						t.bpFont.close();
					}, 1500);
			}, 50);
		}, 50);
	},
	bgCanvas: function () {
		if ($('.bpCover canvas').length == 0)
			return;
		var canvas = $('.bpCover canvas')[0];
		canvas.width = $('.bpCover')[0].offsetWidth;
		canvas.height = $('.bpCover')[0].offsetHeight;
		var index = this.getRandom(0, canvasRichBg.animate.length - 1);
		canvasRichBg.animate[index]($('.bpCover canvas')[0]);
	},
	bgAnimate: function (e) {
		var videoData = videoControl.defaultData;
		var url = '';
		if (e.theme != -1) {
			var x = parseInt(e.theme);
			url = allData.videoUrl + allData.themeBgVideo[x];
		} else {
			var x = App.public.getRandom(0, allData.bpVideoBg.length - 1);
			url = allData.bpVideoBg[x];
			if (url.indexOf('/') == -1) {
				url = allData.videoUrl + url;
			} else {
				if (allData.bpVideoBgData.length > x && allData.bpVideoBgData[x] != null)
					videoData = allData.bpVideoBgData[x];
			}
		}
		$('#bpVideoBg').html('<video loop autoplay src="' + url + '"></video>');
		videoControl.fullScreen($('#bpVideoBg video')[0], videoData, $('#bpVideoBg')[0]);
		if ($('#bpVideoBg video').length > 0)
			$('#bpVideoBg video')[0].volume = 0;
	},
	closeBg: function () {
		if ($('#bpVideoBg').length > 0)
			$('#bpVideoBg').remove();
		var t = this;
		try {
			canvasRichBg.close();
		} catch (ex) { }
	},
	setImage: function (e, bool) {
		$(e).addClass('bpInnerImage');
	},
	useSlide: function (e) {
		var width = $(e.parentNode).width(), height = $(e.parentNode).height();
		var dir = width / height;
		var _dir = e.naturalWidth / e.naturalHeight;
		var offsetX = 0, offsetY = 0;
		if (_dir <= dir) {
			var tHeight = e.naturalHeight * (width / e.naturalWidth);
			var mt = (tHeight - $(e.parentNode).height()) / -2;
			offsetY = mt;
			offsetX = 0;
		} else {
			var tWidth = e.naturalWidth * (height / e.naturalHeight);
			var ml = (tWidth - $(e.parentNode).width()) / -2;
			offsetY = 0;
			offsetX = ml;
		}
		this.sliderObj = new sliderAnimate({
			img: $('.bpLeft .bpFullImage')[0],
			box: $('.bpLeft')[0],
			offsetX: offsetX,
			offsetY: offsetY,
			firstDelay: 800
		});
		this.sliderObj.auto();
		$(e).css({ 'visibility': 'hidden' });
	},
	onylImageAnimate: function (e) {
		var t = this;
		clearTimeout(t.imageAnimateTimeout);
		$(e).css({ 'transition': 'none' });
		$(e).css({ 'transform': 'translate(0,0)' });
	},
	getType: function (obj) {
		return Object.prototype.toString().call(obj).replace(']', '').split(' ')[1].toLowerCase();
	},
	
	loop: function (dt) {
		var e = $.extend({}, dt);
		e.num = parseInt(e.num) - 1;
		bpControl.add(e, true);
	},
	setAble: function (b) {
		this.able = b;
	},
	toAdd: function (data) {
		var self = this;
		data.forEach(function (item) {
			if (item.status !== STATUS.NOT_SHOW) {
				if(item.type === TYPE.GIVE || item.type === TYPE.RED_BAG || item.status === STATUS.BA){
					self.add(item);
				}
			}
		});
	},
	loveNight: function (e) {
		var html = '<div class="newBpBoxCover"></div><div class="bpLoveNight">';
		html += '<div class="table"><span class="tableSpan">';
		html += '<div class="loveNightPcBox"><p><img src="' + allImage.loveNightSrc + '" /></p><div><img src="' + e.src + '" onload="App.public.centerImage(this)" /></div></div>';
		html += '</span></div>';
		html += '<div class="bpUserInfo">';
		html += '<span class="bpUserName"><img class="bpUserHead ' + e.sex + '" src="' + e.head + '" />' + e.userName + '</span>';
		html += '<span class="bpTime">';
		html += '重金霸屏 <tt id="bpTime">' + e.richTime + '</tt> 秒<tt class="bpWMlogo"></tt></span>';
		html += '</div>';
		html += '</div>';
		for (var x = 1; x <= 10; x++) {
			html += '<img class="richStar richStar' + x + '" src="' + allImage.starSrc + '" />';
		}
		$('.bpMain').html(html);
		this.after(e);
	},
	sliceBox: function () {

	}
};

window.bpControl = bpControl;

export default bpControl;