
App.ScrollModule = {
    len: 300,
    delay: 100,
    animateTime: 150,
    timeout: null,
    top: 0,
    init: function (fn) {
        var self = this;
        $(window).bind('scroll', function () {
            self.top = $(window).scrollTop();
        });
        setTimeout(function () {
            $('html,body').stop().animate({ scrollTop: $(document).height() - $(window).height() }, self.animateTime);
            if (fn)
                setTimeout(function () { fn() }, self.animateTime)
        }, 500);
    },
    down: function (bool) {
        var self = this;
        bool = bool === false ? false : true;
        try { clearTimeout(this.timeout) } catch (ex) { }
        this.timeout = setTimeout(function () {
            var h = $(document).height() - $(window).height();
            if (bool || h - self.top <= self.len) {
                $('html,body').stop().animate({ scrollTop: h }, self.animateTime);
            }
        }, this.delay);
    }
};

export default App.ScrollModule;