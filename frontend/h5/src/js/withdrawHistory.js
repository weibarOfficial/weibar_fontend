$(function () {

    var loading = {
        pageCount: 20,
        nowPage: 1,
        hasMore: true,
        loading: false,
        ajax: null,
        clearAjax: function () {
            try {
                loading.ajax.abort();
            } catch (ex) { }
        },
        load: function () {
            if (loading.loading)
                return;
            $('.loadMore').show();
            this.clearAjax();
            loading.loading = true;
            ajax_record(this.nowPage + 1, function (data) {
                loading.nowPage++;
                if (data == null || data == '' || data.length == 0) {
                    loading.hasMore = false;
                    $('.loadMore').hide();
                    return;
                }
                $('.noData').hide();
                if (data.length < loading.pageCount)
                    loading.hasMore = false;
                var html = loading.create(data);
                $('.record').append(html);
                $('.loadMore').hide();
                loading.loading = false;
            }, function (errorMsg) {
                $('.loadMore').hide();
                showInfo(errorMsg || '获取数据失败', false);
            });
        },
        create: function (data) {
            var html = '';
            function statusText(status){
                var text = '';
                if(status === 1){
                    text = '已申请';
                }else if(status === 2){
                    text = '处理中';
                }else if(status === 3){
                    text = '已成功';
                }
                return text;
            }
            for (var i = 0; i < data.length; i++) {
                html += '<div class="recordList">';
                html += '<div class="recordLeft">';
                html += '<span>红包提现</span>';
                html += '<span>' + App.Utils.fmDate(data[i].createTime) + '</span>';
                html += '<span style="text-align:right">' + statusText(data[i].status) + '</span>';
                html += '</div>';
                html += '<div class="recordRight">-' + Number(data[i].amount).toFixed(2) + '元';
                html += '</div>';
                html += '</div>';
            }
            return html;
        },
        init: function () {
            // if ($('.recordList').length < this.pageCount)
            //     this.hasMore = false;
            // if (!this.hasMore)
            //     return;
            var t = this;
            $(window).bind('scroll', function () {
                if (!loading.hasMore || loading.loading || loading.showType == 1)
                    return;
                var h1 = $(window).height();
                var h2 = $('body')[0].scrollHeight;
                var h3 = $(window).scrollTop();
                if (h1 + h3 >= h2 - 10) {
                    loading.load();
                }
            });
        }
    };

    var ajax_record = function (page, fn1, fn2) {
        // page 页码; 一次返回20条记录
        $.post("/h5/withdrawList", { pageNo: page }, function (res) {
            if (res && res.code === 0 && res.data) {
                fn1(res.data);
            } else {
                fn2(res && res.message);
            }
        });
    };

    loading.init();
    loading.load();
})