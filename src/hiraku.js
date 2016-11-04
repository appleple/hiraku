/*
 * Hiraku Ver.1.0.0 (https://www.appleple.com)
 * Copyright appleple | MIT License
 *
 */
;(function umd(factory){
	'use strict';
	if (typeof define === 'function' && define.amd) {
		define(['jquery'], factory);
	} else if (typeof exports === 'object') {
		module.exports = factory(require('jquery'));
	} else {
		factory(jQuery);
	}
}(function Hiraku($){
	var defaults = {
		direction:"right"
	}
	var num = 0;
	var winPos = {x: window.scrollX, y: window.scrollY};
	$.fn.extend({
		hiraku:function(opt){
			var opt = $.extend({},defaults,opt);
			var id = 'js-hiraku-offcanvas-'+num;
			num++;
			var $this = $(this);
			$this.addClass("js-hiraku-offcanvas-sidebar");
			$this.data("scroll",scroll);
			$this.wrap("<div class='js-hiraku-offcanvas' id='"+id+"' />");
			$("body").addClass("js-hiraku-offcanvas-body");
			if(opt.direction == "right"){
				$this.addClass("js-hiraku-offcanvas-sidebar-right");
			}else{
				$this.addClass("js-hiraku-offcanvas-sidebar-left");
			}
			if(opt.btn){
				$(opt.btn).addClass("js-hiraku-offcanvas-btn");
				$(opt.btn).attr("data-toggle-offcanvas",'#'+id);
			}
			if(opt.fixedHeader){
				$(opt.fixedHeader).addClass("js-hiraku-header-fixed");
			}
		}
	});
	$(document).on("click",".js-hiraku-offcanvas-btn",function(e){
		var $target = $($(this).data("toggle-offcanvas"));
		var $this = $(this);
		winPos.x = window.scrollX;
		winPos.y = window.scrollY;
		var $body = $("body").css({"width": window.innerWidth, "height": $(window).height()});
		var $sidebar = $target.find(".js-hiraku-offcanvas-sidebar");
		$target.addClass("js-hiraku-offcanvas-open");
		setTimeout(function(){
			$("html").css('marginTop',-1 * window.scrollY);
			if($sidebar.hasClass("js-hiraku-offcanvas-sidebar-right")){
				$body.addClass("js-hiraku-offcanvas-body-right");
			}else{
				$body.addClass("js-hiraku-offcanvas-body-left");
			}
			$sidebar.addClass("active");
		},1);
		e.preventDefault();
		$(window).resize();
	});
	$(document).on("click touchstart",".js-hiraku-offcanvas",function(e){
		if($(e.target).hasClass("js-hiraku-offcanvas")){
				$(".js-hiraku-offcanvas-body").addClass("js-hiraku-offcanvas-body-moving");
				$(".js-hiraku-offcanvas-body").removeClass("js-hiraku-offcanvas-body-right");
				$(".js-hiraku-offcanvas-body").removeClass("js-hiraku-offcanvas-body-left");
				$(".js-hiraku-offcanvas-sidebar").removeClass("active");
			setTimeout(function(){
				$(e.target).removeClass("js-hiraku-offcanvas-open");
				$(".js-hiraku-offcanvas-body").removeClass("js-hiraku-offcanvas-body-moving");
				$("html").css('marginTop','');
				$("body").css({width:"",height:""});
				window.scrollTo(winPos.x,winPos.y);
			},300);
		}
	});
}));
