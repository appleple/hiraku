/*
 * Hiraku Ver.1.0.1 (https://www.appleple.com)
 * Copyright appleple | MIT License
 *
 */
;(function umd(factory) {
    'use strict';
    if (typeof define === 'function' && define.amd) {
        define(['jquery'], factory);
    } else if (typeof exports === 'object') {
        module.exports = factory(require('jquery'));
    } else {
        factory(jQuery);
    }
}(function Hiraku($) {
    var defaults = {
        direction: "right",
        breakpoint: -1
    }
    var num = 0;
    var winPos = { x: window.scrollX, y: window.scrollY };
    var focusableElements = "a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, *[tabindex], *[contenteditable]";
    var animationFrameId;
    var resizeHandler = function() {
        $(".js-hiraku-offcanvas").each(function() {
            var $this = $(this);
            var breakpoint = $(this).data("breakpoint");
            if ($this.hasClass("js-hiraku-offcanvas-open")) {
                return;
            }
            if (breakpoint === -1 || breakpoint >= window.innerWidth) {
                $this.addClass("js-hiraku-offcanvas-active");
                $this.attr("aria-hidden", true);
            } else {
                $this.removeClass("js-hiraku-offcanvas-active");
                $this.attr("aria-hidden", false);
            }
        });
    };
    $.fn.extend({
        hiraku: function(opt) {
            var opt = $.extend({}, defaults, opt);
            var id = 'js-hiraku-offcanvas-' + num;
            var $this = $(this);
            var $btn = $(opt.btn);
            var $fixed = $(opt.fixedHeader);
            $this.addClass("js-hiraku-offcanvas-sidebar");
            $this.data("scroll", scroll);
            if ($this.parent(".js-hiraku-offcanvas").length === 0) {
                $this.wrap("<div class='js-hiraku-offcanvas'/>");
            }
            $this.attr("role", "navigation");
            var $parent = $this.parent(".js-hiraku-offcanvas");
            $parent.attr("aria-hidden", "true");
            $parent.attr("aria-labelledby", "hiraku-offcanvas-btn-" + num);
            $parent.attr("id", id);
            $parent.data("breakpoint", opt.breakpoint);
            $parent.attr("aria-label", "close");
            $("body").addClass("js-hiraku-offcanvas-body");
            if (opt.direction == "right") {
                $this.addClass("js-hiraku-offcanvas-sidebar-right");
            } else {
                $this.addClass("js-hiraku-offcanvas-sidebar-left");
            }
            if (opt.btn) {
                $btn.addClass("js-hiraku-offcanvas-btn");
                $btn.attr("data-toggle-offcanvas", '#' + id);
                $btn.attr("aria-expanded", false);
                $btn.attr("aria-label", "Menu");
                $btn.attr("aria-controls", "menu");
                $btn.attr("id", "hiraku-offcanvas-btn-" + num);
            }
            if (opt.fixedHeader) {
                $fixed.addClass("js-hiraku-header-fixed");
            }
            num++;
            resizeHandler();
        }
    });
    $(document).on("click", ".js-hiraku-offcanvas-btn", function(e) {
        var $target = $($(this).data("toggle-offcanvas"));
        var $close = $("<button type='button'>Close Offcanvas-Menu Button</button>");
        var $first = $target.find(focusableElements).first();
        var $last = $target.find(focusableElements).last();
        var $this = $(this);
        var $body = $("body").css({ "width": $(window).width(), "height": $(window).height() });
        var $sidebar = $target.find(".js-hiraku-offcanvas-sidebar");
        $close.attr("aria-label", "Close");
        $close.addClass("js-hiraku-offcanvas-close-btn");
        $target.append($close);
        $first.off("keydown.hiraku-offcanvas").on("keydown.hiraku-offcanvas", function(e) {
            if ((e.which === 9 && e.shiftKey)) {
                e.preventDefault();
                $last.focus();
            }
        });
        $last.off("keydown.hiraku-offcanvas").on("keydown.hiraku-offcanvas", function(e) {
            if ((e.which === 9 && !e.shiftKey)) {
                e.preventDefault();
                $first.focus();
            }
        });
        $last.off("click.hiraku-offcanvas").on("click.hiraku-offcanvas", function() {
            $target.click();
        });
        $this.addClass("js-hiraku-offcanvas-btn-active");
        $this.attr("aria-expanded", true);
        winPos.x = window.scrollX;
        winPos.y = window.scrollY;
        $target.attr("aria-hidden", false);
        $target.addClass("js-hiraku-offcanvas-open");
        setTimeout(function() {
            $("html").css('marginTop', -1 * window.scrollY);
            if ($sidebar.hasClass("js-hiraku-offcanvas-sidebar-right")) {
                $body.addClass("js-hiraku-offcanvas-body-right");
            } else {
                $body.addClass("js-hiraku-offcanvas-body-left");
            }
            $sidebar.addClass("active");
            $first.focus();
        }, 1);
        e.preventDefault();
    });
    $(document).on("click touchstart", ".js-hiraku-offcanvas", function(e) {
        if ($(e.target).hasClass("js-hiraku-offcanvas")) {
            $(".js-hiraku-offcanvas-body").addClass("js-hiraku-offcanvas-body-moving");
            $(".js-hiraku-offcanvas-body").removeClass("js-hiraku-offcanvas-body-right");
            $(".js-hiraku-offcanvas-body").removeClass("js-hiraku-offcanvas-body-left");
            $(".js-hiraku-offcanvas-sidebar").removeClass("active");
            setTimeout(function() {
                $(e.target).removeClass("js-hiraku-offcanvas-open");
                $(e.target).attr("aria-hidden", true);
                $(".js-hiraku-offcanvas-body").removeClass("js-hiraku-offcanvas-body-moving");
                $("html").css('marginTop', '');
                $("body").css({ width: "", height: "" });
                window.scrollTo(winPos.x, winPos.y);
                var $btn = $(".js-hiraku-offcanvas-btn-active");
                $btn.removeClass("js-hiraku-offcanvas-btn-active");
                $btn.attr("aria-expanded", false);
                $btn.focus();
                $(e.target).find(".js-hiraku-offcanvas-close-btn").remove();
            }, 300);
        }
    });
    $(window).resize(function() {
        if ("requestAnimationFrame" in window) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = requestAnimationFrame(resizeHandler);
        } else {
            resizeHandler();
        }
    });
}));
