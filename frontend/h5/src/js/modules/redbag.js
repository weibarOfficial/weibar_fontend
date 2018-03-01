import Money from './money';

App.RBModule = {
    //红包规则
    config: {
        poundage: 0.006,//手续费
        minNum: 1,//最少个数
        maxNum: 500,//最大个数
        minMoney: 1.00,//最小金额
        maxMoney: 2000.00,//最大金额
        isInt: false//是否必须为整数
    },
    init: function () {
        var self = this;
        $('.j_showRedBag').click(function () {
            self.showRedBag($(this));
        });
        App.MsgModule.getCnt().on('click', '.j_openRedBag', function () {
            self.show($(this));
        })
        $(document).on('click', '.j_closeRbBox', function () {
            self.close($(this));
        }).on('click', '.j_goToResult', function () {
            self.gotoResult($(this));
        }).on('click', '.j_chaiRedBag', function () {
            self.open($(this));
        });
    },
    check: function () {
        var config = this.config;
        var rgMoney = $.trim($('#rgMoney').val());
        var rgNum = $.trim($('#rgNum').val());
        if (rgMoney.length == 0)
            return App.showInfo('请设置红包总金额', false);
        rgMoney = parseFloat(rgMoney);
        if (config.minMoney != null) {
            if (rgMoney < config.minMoney)
                return App.showInfo('红包总金额最少' + config.minMoney + '元', false, { top: '86%' });
        }
        if (config.maxMoney != null) {
            if (rgMoney > config.maxMoney)
                return App.showInfo('红包总金额最多' + config.maxMoney + '元', false, { top: '86%' });
        }
        if (config.isInt) {
            var re = /^[0-9]*[1-9][0-9]*$/;
            if (!re.test(rgMoney))
                return App.showInfo('红包总金额必须为整数', false, { top: '86%' });
        }
        if (rgNum.length == 0)
            return App.showInfo('请设置红包个数', false, { top: '86%' });
        rgNum = parseInt(rgNum);
        if (config.minNum != null) {
            if (rgNum < config.minNum)
                return App.showInfo('红包个数最少' + config.minNum + '个', false, { top: '86%' });
        }
        if (config.maxNum != null) {
            if (rgNum > config.maxNum)
                return App.showInfo('红包个数最多' + config.maxNum + '个', false, { top: '86%' });
        }
        //var newMoney = rgMoney*(1-this.config.poundage);
        var tMax = parseInt(rgMoney);
        if (tMax < rgNum) {
            return App.showInfo(rgMoney.toFixed(2) + '元最多只能发出 ' + (tMax) + ' 个红包', false, { top: '86%' });
        }
        return true;
    },
    setPlacehoder: function (config) {
        var ps2 = '红包个数';
        if (config.minNum != null && config.maxNum != null) {
            ps2 += '，' + config.minNum + '-' + config.maxNum + '个';
        } else {
            if (config.minNum != null)
                ps2 += '，最少' + config.maxNum + '个';
            if (config.maxNum != null)
                ps2 += '，最多' + config.maxNum + '个';
        }
        $('#rgNum').attr({ placeholder: ps2 });
    },
    showRedBag: function () {
        var self = this;
        var config = this.config;
        var ps1 = '总金额', ps2 = '红包个数';
        if (config.minMoney != null && config.maxMoney != null) {
            ps1 += '，' + config.minMoney + '-' + config.maxMoney + '元';
        } else {
            if (config.minMoney != null)
                ps1 += '，最少' + config.minMoney + '元';
            if (config.maxMoney != null)
                ps1 += '，最多' + config.maxMoney + '元';
        }
        if (config.minNum != null && config.maxNum != null) {
            ps2 += '，' + config.minNum + '-' + config.maxNum + '个';
        } else {
            if (config.minNum != null)
                ps2 += '，最少' + config.minNum + '个';
            if (config.maxNum != null)
                ps2 += '，最多' + config.maxNum + '个';
        }
        var html = '<div style="margin:0 0 10px 0; font-size:12px; color:#999; padding-left:10px">红包金额大于10元将大屏幕显示</div>';
        html += '<div class="inputDiv"><input type="number" class="inputNormal _inputNormal" placeholder="' + ps1 + '" style="border-radius:4px; font-size:13px;" id="rgMoney" oninput="if(value.length>8)value=value.slice(0,8)"><tt>元</tt></div>';
        html += '<div class="inputDiv" style="margin:10px 0 0 0; font-size:12px; color:#999; padding-left:10px">每人抽到的金额随机</div>';
        html += '<div class="inputDiv" style="margin:10px 0 20px 0"><input type="tel" class="inputNormal _inputNormal" placeholder="' + ps2 + '" oninput="if(value.length>8)value=value.slice(0,5)" style="border-radius:4px; font-size:13px;" id="rgNum"><tt>个</tt></div>';
        html += '<div class="inputDiv" style="margin-bottom:5px"><input type="text" class="inputNormal _inputNormal" placeholder="留言，20字以内" maxlength="20" style="border-radius:4px; font-size:13px;" id="rgVal"></div>';
        // html += '<div class="inputDiv" style="text-align:center; font-size:40px; color#333; margin:20px 0 10px 0; display:none" id="rgPay">￥0.00</div>';
        html += '<div id="j_priceBox"></div>';
        var title = '发红包';
        this.infoPop = WM.Phone.get({
            type: 'slideBox',
            title: title,
            html: html,
            btnText: '塞钱进红包',
            ready: function () {
                var t = this;
                this.find('#rgMoney').bind('input', function () {
                    // $('#rgPay').html('￥' + $.trim($(this).val()));
                    Money.updatePay($.trim($(this).val()) || 0);
                });
                this.find('#rgMoney').bind('input', function () {
                    var rgMoney = $.trim($('#rgMoney').val());
                    if (rgMoney.length > 0) {
                        var newMoney = parseFloat(rgMoney);
                        var tMax = parseInt(newMoney);
                        if (self.config.maxNum != null && self.config.maxNum < tMax) {
                            tMax = self.config.maxNum;
                        }
                        var newJson = { maxNum: tMax, minNum: self.config.minNum };
                        self.setPlacehoder(newJson);
                    } else {
                        self.setPlacehoder(self.config);
                    }
                });
                Money.createDom(this.find('#j_priceBox'));
            },
            click: function () {
                var bool = self.check();
                if (bool != true)
                    return;
                var val = $.trim($('#rgVal').val());
                //系统词语检测
                if (!App.SensitiveModule.valide(val))
                    return App.showInfo('请勿发布广告等不适内容', false, { top: '86%' });

                val = val.replace(/</g, '&lt;');
                val = val.replace(/>/g, '&gt;');
                if(!val){
                    val = '恭喜发财，大吉大利！';
                }
                //金额
                var rgMoney = $.trim($('#rgMoney').val());
                //个数
                var rgNum = $.trim($('#rgNum').val());
                WM.Phone.get({
                    type: 'confirm',
                    title: '发红包',
                    innerHTML: '确定支付 ' + rgMoney + '元？',
                    click: function (b) {
                        this.close()
                        if (!b)
                            return;
                        self.preCreate({
                            amount: rgMoney,
                            sendNumber: rgNum,
                            redPackageTitle: val
                        });
                    }
                });
            }
        });
    },
    preCreate: function (data) {
        var self = this;
        $.ajax({
            url: Global.API_BASE + '/h5/prepareCreateRedPackage',
            method: 'POST',
            data: $.extend({
                merchantId: Global.merchantId
            }, data)
        }).done(function (res) {
            if (res && res.code === 0 && res.data) {
                if (res.data.banlanceEnough) {
                    self.create(res.data);
                } else {
                    Money.requireEncharge(res.data.minRechargeAmount, res.data.wechatMpPrePay.wxPayMpOrderResult);
                }
            } else {
                App.errorTip(res && res.message || '红包发送失败');
            }
        }).fail(App.errorTip('红包发送失败'));
    },
    create: function (data) {
        var self = this;
        $.post(Global.API_BASE + '/h5/createRedPackage', {
            redPackageId: data.redPackageId
        }).done(function (res) {
            if (res && res.code === 0) {
                App.MsgModule.appendData(res.data);
                self.infoPop.close();
            } else {
                App.errorTip(res && res.message || '红包发送失败');
            }
        }).fail(App.errorTip('红包发送失败'));
    },
    ajaxRedBag: function (rbId) {
        return $.post(Global.API_BASE + '/h5/userOpenRedPackage', {
            redPackageId: rbId,
            merchantId: Global.merchantId
        }).then(function (res) {
            if (res && res.code === 0 && res.data) {
                return res.data.amount;
            } else {
                App.errorTip(res && res.message || '领取失败');
            }
        }).fail(App.errorTip('领取失败'));
    },
    show: function ($el) {
        var rowEl = $el.closest('.j_row');
        var rbId = rowEl.attr('rbid');
        var rbMoney = rowEl.attr('money');

        var t = new WM.Phone.waiting({
            text: '正在获取红包信息'
        });
        this.currRowEl = rowEl;
        var self = this;
        var rbImg = new Image();
        rbImg.onload = rbImg.onerror = function () {
            //已拆
            if (rbMoney != null && typeof rbMoney != 'undefined') {
                rbMoney = parseFloat(rbMoney);
                if (rbMoney < 0 || rbMoney > 0) {
                    t.close();
                    self._show(rbMoney, rowEl);
                    return;
                }
            }
            //获取红包数量
            // self.ajaxRedBag(rbId).then(function (money) {
            t.close();
            //     rowEl.attr({ money: money });
            //     money = parseFloat(money);
            self._show(0, rowEl);
            // });
        }
        rbImg.src = allImageUrl + 'onWall_redBagBig.png';
    },
    _show: function (money, rowEl) {

        $('body').append(template('redBagOpenTpl', {
            money: money,
            userPic: rowEl.find('.j_userInfo').attr('data-userpic'),
            name: rowEl.find('.j_userInfo').attr('data-name'),
            info: rowEl.find('.j_rbTitle').text(),
            rbId: rowEl.attr('rbid'),
            rbPic: Global.allImageUrl + 'onWall_redBagBig.png',
            chaiPic: Global.allImageUrl + 'chai.png'
        }));
    },
    gotoResult: function (e) {
        //跳转红包详情页面
        var rbId = $(e).attr('rbid');
        window.location.href = '/cwechat/redBagDetail?redBagId=' + rbId;
    },
    open: function (e) {
        var self = this;
        var rowEl = this.currRowEl;
        if ($(e).hasClass('animate'))
            return;
        $(e).addClass('animate');
        var t1 = new Date().getTime();
        this.ajaxRedBag($(e).attr('rbid')).then(function (money) {
            rowEl.attr('money', money);

            setTimeout(function () {
                $(e).fadeOut(function () {
                    $(e).remove();
                });
                if (money == null || money.length == 0 || money == 0 || money == -1) {
                    $('#redBagBox .redBoxInfoResult').html('手慢了，红包已抢完了');
                    return;
                } else if (money == -2) {
                    $('#redBagBox .redBoxInfoResult').html('对不起，红包已过期');
                    return;
                }
                $('#redBagBox .redBoxInfoResult').hide();
                $('#redBagBox .numDiv').show();
                self.moneyAnimate(money);
            }, 0);
        }, function (errorMsg) {
            $(e).removeClass('animate');
            App.showInfo(errorMsg || '操作失败', false);
        });
    },
    close: function (e) {
        $('#redBagBox').remove();
    },
    moneyAnimate: function (num) {
        num = parseFloat(num);
        num = num.toFixed(2);
        var html = '';
        for (var x = 0; x < num.length; x++) {
            if (num.charAt(x) == '.') {
                html += '<span class="tNum tPot" val="0"><tt>9</tt><tt>8</tt><tt>7</tt><tt>6</tt><tt>5</tt><tt>4</tt><tt>3</tt><tt>2</tt><tt>1</tt><tt>.</tt></span>';
            } else {
                html += '<span class="tNum" val="' + num.charAt(x) + '"><tt>9</tt><tt>8</tt><tt>7</tt><tt>6</tt><tt>5</tt><tt>4</tt><tt>3</tt><tt>2</tt><tt>1</tt><tt>0</tt></span>';
            }
        }
        html += '<i>元</i>';
        $(html).appendTo($('.numDiv .numDivBox'));
        var arr = $('.numDiv .tNum'), i = 0, time = 400;
        (function animateFn() {
            var e = arr[i], num = parseInt($(arr[i]).attr('val'));
            var newTime = ((num + 1) / 10) * time;
            var posY = -500 + ((num + 1) * 50);
            // var arg = arguments.callee;
            time = time <= 100 ? 100 : time;
            Transition.go({
                obj: arr[i],
                style: { transform: 'translate(0,' + posY + 'px)' },
                time: 50,
                callback: function () {
                }
            });
            i++;
            if (i < arr.length) {
                setTimeout(function () {
                    animateFn();
                }, 40);
            }
        })();
    }
};

export default App.RBModule;