//霸屏
(function () {

	var TYPE = App.MsgModule.MSG_TYPE;
	var STATUS = App.MsgModule.STATUS;

	window.activeControl = {
		time: 10000,
		interval: null,
		_start: function (e, time, fn) {
			//奖品
			var type = e.active;
			var broadImg = '', downImg = '';
			if (type == 1) {
				broadImg = allImage.qixi_broad1;
				downImg = allImage.qixi_jp1;
			}
			else if (type == 2) {
				broadImg = allImage.qixi_broad2;
				downImg = allImage.qixi_jp2;
			}
			else if (type == 3) {
				broadImg = allImage.qixi_broad3;
				downImg = allImage.qixi_jp3;
			}
			else if (type == 4) {
				broadImg = allImage.qixi_broad4;
				downImg = allImage.qixi_jp3;
			}
			var html = '<div id="activeBox" class="activeBox">';
			html += '<img class="activeBg" src="' + allImage.activeBottom + '" />';
			html += '<img class="activeStar1" src="' + allImage.activeStar1 + '" />';
			html += '<img class="activeStar2" src="' + allImage.activeStar2 + '" />';
			html += '<div class="activeMain">';
			html += '<div style="text-align:center; font-size:42px; color:#3ffffd; font-weight:bold; padding-bottom:0px; position:relative; top:-50px">第 ' + e.pascreenSort + ' 位霸屏</div>';
			html += '<span class="activeUserBox ' + e.sex + '" style="top:-20px">';
			html += '<tt class="ttAnimate1"></tt><tt class="ttAnimate2"></tt><tt class="ttAnimate3"></tt><img class="activeUserHead ' + e.sex + '" src="' + e.head + '" />';
			html += '</span>';
			html += '<p class="activeBrand" style="top:-60px">';

			html += '<img class="active_redBrand" src="' + broadImg + '" />';
			html += '</p>';
			html += '<p class="activeKh">' + e.userName + '</p>';
			html += '</div>';
			html += '<div class="activeAnimate" id="activeAnimate">';
			for (var x = 1; x <= 14; x++)
				html += '<img class="active_img active_img' + x + '" src="' + downImg + '" />';
			html += '</div>';
			html += '</div>';
			html += '<div class="activeBoxCover"></div>';
			$(html).appendTo($('#all'));
			var t = this;
			setTimeout(function () {
				setTimeout(function () {
					t.close();
					if (fn)
						fn();
				}, time || 5000);
			}, 1000);
		},
		start: function (e) {
			var sexCls = e.sex === '男'? 'man': 'woman';
			if (e.msgType == 'richUser')
				return this.richer(e);
			var html = '<div id="activeBox" class="activeBox">';
			if (e.msgType == 'song') {
				html += '<div class="songCover"></div>';
				html += '<img class="activeBg" src="' + allImage.activeBottomSong + '" />';
				html += '<img class="songBg" src="' + allImage.activeSongBg + '" />';
			}
			else
				html += '<img class="activeBg" src="' + allImage.activeBottom + '" />';
			html += '<img class="activeStar1" src="' + allImage.activeStar1 + '" />';
			html += '<img class="activeStar2" src="' + allImage.activeStar2 + '" />';
			html += '<div class="activeMain ' + (e.msgType == 'song' ? 'song' : '') + '">';
			html += '<span class="activeUserBox ' + sexCls + '">';
			html += '<tt class="ttAnimate1"></tt><tt class="ttAnimate2"></tt><tt class="ttAnimate3"></tt><img class="activeUserHead ' + sexCls + '" src="' + e.userPic + '" />';
			html += '</span>';
			html += '<p class="activeBrand">';
			if (e.msgType == 'redBag')
				html += '<img class="active_redBrand" src="' + allImage.activeRedBrand + '" />';
			else if (e.msgType == 'richUser') {
				html += '<img id="active_richBrand" src="' + allImage.activeRichBrand1 + '" />';
			} else if (e.msgType == 'song') {
				html += '<img id="active_songBrand" src="' + allImage.activeSongBrand + '" />';
			}
			html += '</p>';
			if (e.msgType == 'song') {
				html += '<p class="activeSong">' + e.nickName + ' 点歌 （' + e.songName + '_' + e.singer + '）</p>';
				html += '<p class="activeSongLine"></p>';
				html += '<p class="activeSongText">' + e.content + '</p>';
			} else
				html += '<p class="activeUserName ' + sexCls + '">' + e.nickName + '</p>';
			html += '</div>';
			html += '<div class="activeAnimate" id="activeAnimate">';
			if (e.msgType == 'richUser' || e.type == TYPE.RED_BAG) {
				var src = '';
				if (e.msgType == 'richUser')
					src = allImage.activeAcer;
				else if (e.type == TYPE.RED_BAG)
					src = allImage.activeRedBag;
				for (var x = 1; x <= 14; x++)
					html += '<img class="active_img active_img' + x + '" src="' + src + '" />';
			} else {

			}
			html += '</div>';
			html += '</div>';
			html += '<div class="activeBoxCover ' + (e.msgType == 'song' ? 'song' : '') + '"></div>';
			$(html).appendTo($('#all'));

			var n = 1;
			var time = e.msgType == 'song' ? 20000 : 10000;
			this.count(time);
		},
		level: ['铂金10级', '铂金11级', '铂金12级', '钻石13级', '钻石14级', '钻石15级'],
		_richer: function (e, src) {
			cy_get_grade_style.get(e.level);
			var shtml = '<div id="richUserFace"><img id="gif" src="' + src + '" />';
			shtml += '<div class="levelLightBg"><img src="' + allImage.levelLightBg + '" /></div>';
			shtml += '<div class="richUserBg"><img src="' + allImage.levelLight + '" /></div>';
			if (e.level >= 13) {
				shtml += '<div class="richUser_box">';
			} else {
				shtml += '<div class="richUser_box top">';
			}

			var level = activeControl.level[parseInt(e.level) - 10];
			shtml += '<p class="richUser_title">' + level + '用户驾到</p>';
			//头冠
			var hat = cy_get_grade_style.get(e.level).imgUrl;

			shtml += '<div class="richUser_user"><p class="richUser_user_p"><img class="richUser_user_hat" src="' + hat + '" /><img  class="richUser_user_head" src="' + e.head + '" /></p>';
			shtml += '<p class="richUser_user_name ellipsis">' + e.userName + '</p></div>';
			shtml += '</div></div>';

			$(shtml).appendTo($('#all'));
			setTimeout(function () {
				$('.richUserBg').fadeIn();
				$('.levelLightBg').fadeIn();
			}, 500);
			setTimeout(function () {
				$('.richUser_box').addClass('animate');
				setTimeout(function () {
					$('#richUserFace').fadeOut(function () {
						$('#richUserFace').remove();
						activeControl.close();
					});
				}, 10000);
			}, 1500);
		},
		richer: function (e) {
			var rad = new Date().getTime();
			var src = '';
			if (e.level >= 10 && e.level <= 12)
				src = allData.allImageUrl + 'level/userLevel_bj.gif?' + rad;
			else if (e.level >= 13 && e.level <= 15)
				src = allData.allImageUrl + 'level/userLevel_zs.gif?' + rad;
			else
				return activeControl.close();
			//设置路径 allData.allImageUrl+'/level/zs1.png?'+rad
			_loadImage(src, function () {
				activeControl._richer(e, src);
			});
		},
		count: function (time) {
			var t = this;
			$('.danmuBox').addClass('hide');
			setTimeout(function () {
				//clearInterval(activeControl.interval);
				t.close();
			}, time);
		},
		close: function () {
			$('#activeBox').addClass('close');
			setTimeout(function () {
				$('.danmuBox').removeClass('hide');
				$('.activeBoxCover').remove();
				$('#activeBox').remove();
				bpControl.start();
			}, 500);
		}
	}

	//等级=====================

	var cy_get_grade_style = {
		get: function (data) {
			var grade_style = {};
			grade_style.newG = "青铜1级";
			grade_style.imgUrl = '' + allData.allImageUrl + 'level/qt1.png';
			grade_style.fColor = "qt_color";
			grade_style.fBg = 'qt_bg';
			switch (data) {
				case 1:
					grade_style.newG = "青铜1级";
					grade_style.imgUrl = '' + allData.allImageUrl + 'level/qt1.png'
					grade_style.fColor = "qt_color"
					grade_style.fBg = 'qt_bg';
					break;
				case 2:
					grade_style.newG = "青铜2级";
					grade_style.imgUrl = '' + allData.allImageUrl + 'level/qt2.png'
					grade_style.fColor = "qt_color"
					grade_style.fBg = 'qt_bg';
					break;
				case 3:
					grade_style.newG = "青铜3级";
					grade_style.imgUrl = '' + allData.allImageUrl + 'level/qt3.png'
					grade_style.fColor = "qt_color"
					grade_style.fBg = 'qt_bg';
					break;
				case 4:
					grade_style.newG = "白银4级";
					grade_style.imgUrl = '' + allData.allImageUrl + 'level/by1.png'
					grade_style.fColor = "by_color"
					grade_style.fBg = 'by_bg';
					break;
				case 5:
					grade_style.newG = "白银5级";
					grade_style.imgUrl = '' + allData.allImageUrl + 'level/by2.png'
					grade_style.fColor = "by_color"
					grade_style.fBg = 'by_bg';
					break;
				case 6:
					grade_style.newG = "白银6级";
					grade_style.imgUrl = '' + allData.allImageUrl + 'level/by3.png'
					grade_style.fColor = "by_color"
					grade_style.fBg = 'by_bg';
					break;
				case 10:
					grade_style.newG = "铂金10级";
					grade_style.imgUrl = '' + allData.allImageUrl + 'level/bj1.gif'
					grade_style.fColor = "bj_color"
					grade_style.fBg = 'bj_bg';
					break;
				case 11:
					grade_style.newG = "铂金11级";
					grade_style.imgUrl = '' + allData.allImageUrl + 'level/bj2.gif'
					grade_style.fColor = "bj_color"
					grade_style.fBg = 'bj_bg';
					break;
				case 12:
					grade_style.newG = "铂金12级";
					grade_style.imgUrl = '' + allData.allImageUrl + 'level/bj3.gif'
					grade_style.fColor = "bj_color"
					grade_style.fBg = 'bj_bg';
					break;
				case 7:
					grade_style.newG = "黄金7级";
					grade_style.imgUrl = '' + allData.allImageUrl + 'level/hj1.gif'
					grade_style.fColor = "hj_color"
					grade_style.fBg = 'hj_bg';
					break;
				case 8:
					grade_style.newG = "黄金8级";
					grade_style.imgUrl = '' + allData.allImageUrl + 'level/hj2.gif'
					grade_style.fColor = "hj_color"
					grade_style.fBg = 'hj_bg';
					break;
				case 9:
					grade_style.newG = "黄金9级";
					grade_style.imgUrl = '' + allData.allImageUrl + 'level/hj3.gif'
					grade_style.fColor = "hj_color"
					grade_style.fBg = 'hj_bg';
					break;
				case 13:
					grade_style.newG = "钻石13级";
					grade_style.imgUrl = '' + allData.allImageUrl + 'level/zs1.gif'
					grade_style.fColor = "zs_color"
					grade_style.fBg = 'zs_bg';
					break;
				case 14:
					grade_style.newG = "钻石14级";
					grade_style.imgUrl = '' + allData.allImageUrl + 'level/zs2.gif'
					grade_style.fColor = "zs_color";
					grade_style.fBg = 'zs_bg';
					break;
				case 15:
					grade_style.newG = "钻石15级";
					grade_style.imgUrl = '' + allData.allImageUrl + 'level/zs3.gif'
					grade_style.fColor = "zs_color";
					grade_style.fBg = 'zs_bg';
					break;
			}
			return grade_style;
		}
	}

})();

(function () {

	var MAX_LIFE = 40;
	var PI_2 = Math.PI / 2;
	var PI_180 = Math.PI / 180;

	var Random = {
		between: function (min, max) {
			return min + (Math.random() * (max - min));
		}
	}

	function Vector(x, y) {
		this._x = x || 0;
		this._y = y || 0;
	}

	Vector.create = function (x, y) {
		return new Vector(x, y);
	};

	Vector.add = function (a, b) {
		return new Vector(a.x + b.x, a.y + b.y);
	};

	Vector.subtract = function (a, b) {
		return new Vector(a.x - b.x, a.y - b.y);
	};

	Vector.random = function (range) {
		var v = new Vector();
		v.randomize(range);
		return v;
	};

	Vector.distanceSquared = function (a, b) {
		var dx = a.x - b.x;
		var dy = a.y - b.y;
		return dx * dx + dy * dy;
	};

	Vector.distance = function (a, b) {
		var dx = a.x - b.x;
		var dy = a.y - b.y;
		return Math.sqrt(dx * dx + dy * dy);
	};

	Vector.prototype = {
		get x() {
			return this._x;
		},
		get y() {
			return this._y;
		},
		set x(value) {
			this._x = value;
		},
		set y(value) {
			this._y = value;
		},
		get magnitudeSquared() {
			return this._x * this._x + this._y * this._y;
		},
		get magnitude() {
			return Math.sqrt(this.magnitudeSquared);
		},
		get angle() {
			return Math.atan2(this._y, this._x) * 180 / Math.PI;
		},
		clone: function () {
			return new Vector(this._x, this._y);
		},
		add: function (v) {
			this._x += v.x;
			this._y += v.y;
		},
		subtract: function (v) {
			this._x -= v.x;
			this._y -= v.y;
		},
		multiply: function (value) {
			this._x *= value;
			this._y *= value;
		},
		divide: function (value) {
			this._x /= value;
			this._y /= value;
		},
		normalize: function () {
			var magnitude = this.magnitude;
			if (magnitude > 0) {
				this.divide(magnitude);
			}
		},
		limit: function (treshold) {
			if (this.magnitude > treshold) {
				this.normalize();
				this.multiply(treshold);
			}
		},
		randomize: function (amount) {
			amount = amount || 1;
			this._x = amount * 2 * (-.5 + Math.random());
			this._y = amount * 2 * (-.5 + Math.random());
		},
		rotate: function (degrees) {
			var magnitude = this.magnitude;
			var angle = ((Math.atan2(this._x, this._y) * PI_HALF) + degrees) * PI_180;
			this._x = magnitude * Math.cos(angle);
			this._y = magnitude * Math.sin(angle);
		},
		flip: function () {
			var temp = this._y;
			this._y = this._x;
			this._x = temp;
		},
		invert: function () {
			this._x = -this._x;
			this._y = -this._y;
		},
		toString: function () {
			return this._x + ', ' + this._y;
		}
	}

	function Particle(id, group, position, velocity, size, life, behavior) {

		this._id = id || 'default';
		this._group = group || 'default';

		this._position = position || new Vector();
		this._velocity = velocity || new Vector();
		this._size = size || 1;
		this._life = Math.round(life || 0);

		this._behavior = behavior || [];

	}

	Particle.prototype = {
		get id() {
			return this._id;
		},
		get group() {
			return this._group;
		},
		get life() {
			return this._life;
		},
		get size() {
			return this._size;
		},
		set size(size) {
			this._size = size;
		},
		get position() {
			return this._position;
		},
		get velocity() {
			return this._velocity;
		},
		update: function (stage) {

			this._life++;

			var i = 0;
			var l = this._behavior.length;

			for (; i < l; i++) {
				this._behavior[i].call(stage, this);
			}

		},
		toString: function () {
			return 'Particle(' + this._id + ') ' + this._life + ' pos: ' + this._position + ' vec: ' + this._velocity;
		}
	}

	bpControl.bpFont = {
		burst: function (intensity, x, y) {
			var behavior = [
				this.behavior.cohesion(),
				this.behavior.move()
			];
			var size = 1;
			var force = .5;
			var lifeMin = 0;
			var rangeMin = x - 25;
			var rangeMax = x + 25;
			this.spray(intensity, function () {
				return [
					null, null,
					Vector.create(
						Random.between(x - 35, x + 35),

						Random.between(y + 65, y - 45)
					),
					Vector.random(force),
					size + Math.random(),
					Random.between(lifeMin, 0), behavior
				]
			});

			this.spray(intensity * .5, function () {
				return [
					null, null,
					Vector.create(
						Random.between(rangeMin - 35, rangeMax + 35),
						y + 20
					),
					Vector.random(force),
					size + Math.random(),
					Random.between(lifeMin, 0), behavior
				]
			});

			this.spray(intensity * .5, function () {
				return [
					null, null,
					Vector.create(
						Random.between(rangeMin, rangeMax),
						y
					),

					Vector.random(force),
					size + Math.random(),
					Random.between(lifeMin, 0), behavior
				]
			});
		},
		draw: function (num, x, y) {
			num = num == null ? 14 : num;
			this.burst(num, x, y);
		},
		init: function (color, box) {
			this.close();
			this.isStop = false;
			this.fontColor = color;
			this.particles = [];
			this.destroyed = [];
			this.update = function () { };
			this.stage = function () { };
			this.canvas = document.createElement('canvas');
			//this.canvas.id = 'fontCanvas';
			$(this.canvas).css({ position: 'absolute', left: 0, top: 0, 'z-index': 999 });
			box = box || document.body;
			$(this.canvas).appendTo($(box));
			//document.body.appendChild(this.canvas);
			this.fitCanvas();
			this.context = this.canvas.getContext('2d');
			this.tick();
		},
		fitCanvas: function () {
			bpControl.bpFont.canvas.width = window.innerWidth;
			bpControl.bpFont.canvas.height = window.innerHeight;
		},
		ff: function (particle) {
			var p = particle.position;
			var s = particle.size;
			var o = 1 - (particle.life / MAX_LIFE);
			this.paint.circle(p.x, p.y, s, 'rgba(255,255,255,' + o + ')');
			this.paint.circle(p.x, p.y, s + 2, this.fontColor + (o * .25) + ')');
		},
		act: function () {
			var self = bpControl.bpFont;
			var i = 0;
			var l = self.particles.length;
			var p;
			for (; i < l; i++) {
				self.particles[i].update(this);
			}

			while (p = self.destroyed.pop()) {

				do {

					if (p !== self.particles[i]) {
						continue;
					}

					self.particles.splice(i, 1);

				} while (i-- >= 0)
			}

			i = 0;
			l = self.particles.length;

			for (; i < l; i++) {
				self.ff(self.particles[i])
			}
		},
		tick: function () {
			var self = bpControl.bpFont;
			self.clear();
			if (self.isStop || !self.particles)
				return;
			var len = self.particles.length;
			for (var x = 0; x < len; x++) {
				if (self.particles[x]._life >= MAX_LIFE)
					self.destroy(self.particles[x]);
			}
			self.act();
			window.requestAnimationFrame(arguments.callee);
		},
		close: function () {
			this.isStop = true;
			this.particles = [];
			this.destroyed = [];
			var self = this;
			$(self.canvas).remove();
		},
		clear: function () {
			this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
		},
		destroy: function (particle) {
			this.destroyed.push(particle);
		},
		add: function (id, group, position, velocity, size, life, behavior) {
			this.particles.push(new Particle(id, group, position, velocity, size, life, behavior));
		},
		spray: function (amount, config) {
			var i = 0;
			for (; i < amount; i++) {
				this.add.apply(this, config());
			}
		},
		paint: {
			circle: function (x, y, size, color) {
				var context = bpControl.bpFont.context;
				context.beginPath();
				context.arc(x, y, size, 0, 2 * Math.PI, false);
				context.fillStyle = color;
				context.fill();
			},
			square: function (x, y, size, color) {
				var context = bpControl.bpFont.context;
				context.beginPath();
				context.rect(x - (size * .5), y - (size * .5), size, size);
				context.fillStyle = color;
				context.fill();
			}
		},
		behavior: {
			cohesion: function (range, speed) {
				range = Math.pow(range || 100, 2);
				speed = speed || .001;
				return function (particle) {
					var particles = bpControl.bpFont.particles;
					var center = new Vector();
					var i = 0;
					var l = particles.length;
					var count = 0;

					if (l <= 1) {
						return;
					}

					for (; i < l; i++) {

						if (particles[i] === particle || Vector.distanceSquared(particles[i].position, particle.position) > range) {
							continue;
						}

						center.add(Vector.subtract(particles[i].position, particle.position));
						count++;
					}

					if (count > 0) {

						center.divide(count);

						center.normalize();
						center.multiply(particle.velocity.magnitude);

						center.multiply(.05);
					}

					particle.velocity.add(center);

				}
			},
			move: function () {
				return function (particle) {
					particle.position.add(particle.velocity);
				}
			}
		}

	}

})();