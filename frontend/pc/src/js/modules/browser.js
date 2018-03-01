
//浏览器
var Browser = function(){
	var browser = {
		opera:0,
		ie:0,
		chrome:0,
		firefox:0,
		safari:0,
		konq:0,
		name:0,
		version:0	
	}
	var n = navigator.userAgent,b = browser;
	if(window.opera){
		b.version = window.opera.version();
		b.opera = parseFloat(b.version);
		b.name = 'oprea';
	}else if(/AppleWebKit\/(\S+)/.test(n)){
		if(/Chrome\/(\S+)/.test(n)){
			b.version = RegExp["$1"];
			b.chrome = parseFloat(b.version);
			b.name = 'chrome';	
		}else if(/Version\/(\S+)/.test(n)){
			b.version = RegExp["$1"];
			b.safari = parseFloat(b.version);	
			b.name = 'safari';
		}
	}else if(/KHTML\/(\S+)/.test(n)||/Konqueror\/([^;]+)/.test(n)){
		b.version = RegExp["$1"];
		b.konq = parseFloat(b.version);		
		b.name = 'konq';
	}else if(/Firefox\/(\S+)/.test(n)){
		b.version = RegExp["$1"];
		b.firefox = parseFloat(b.version);
		b.name = 'firefox';	
	}else if(/MSIE ([^;]+)/.test(n)){
		b.version = RegExp["$1"];
		b.ie = parseFloat(b.version);	
		b.name = 'ie';	
	}
	return browser;
}();

Browser.checkChrome = function(callback){
	var html = '<div id="chrome" class="chrome"><div class="chromeBox">';
	html += '<div class="chromeText">为了能够更好的体验秉烛科技的功能，我们强烈建议您使用谷歌浏览器</div>';
	html += '<a class="downloadChrome" href="http://sw.bos.baidu.com/sw-search-sp/software/7164c4c6bc6e0/ChromeStandalone_58.0.3029.110_Setup.exe" target="_blank">下载谷歌浏览器</a>';
	html += '<a class="closeChrome">&times;</a>';
	html += '</div></div>';
	$(html).appendTo($('body'));
	$('.closeChrome').bind('click',function(){
		$('#chrome').remove();
		if(callback)	
			callback();
	})
}
App.Browser = Browser;


export default Browser;
