/*!
 * Hiraku Ver.1.0.8 (https://www.appleple.com)
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
			direction: 'right',
			breakpoint: -1
	}
	var num = 0;
	var winPos = { x: window.scrollX, y: window.scrollY };
	var focusableElements = 'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, *[tabindex], *[contenteditable]';
	var animationFrameId;
	var windowWidth = 0;
	var resizeHandler = function() {
        // Check window width has actually changed and it's not just iOS triggering a resize event on scroll
		if ($(window).width() === windowWidth) {
			return;
		}
		windowWidth = $(window).width();
		$('.js-hiraku-offcanvas').each(function() {
			var $this = $(this);
			var breakpoint = $(this).data('breakpoint');
			if ($this.hasClass('js-hiraku-offcanvas-open') && (breakpoint === -1 || breakpoint >= window.innerWidth)) {
				return;
			}
			if (breakpoint === -1 || breakpoint >= window.innerWidth) {
				$this
					.addClass('js-hiraku-offcanvas-active')
					.attr('aria-hidden', true);
			} else {
				$this
					.removeClass('js-hiraku-offcanvas-active')
					.attr('aria-hidden', false)
					.trigger('click');
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
			$this
				.addClass('js-hiraku-offcanvas-sidebar')
				.data('scroll', scroll);
			if ($this.parent('.js-hiraku-offcanvas').length === 0) {
				$this.wrap('<div class="js-hiraku-offcanvas"/>');
			}
			$this.attr('role', 'navigation');
			var $parent = $this.parent('.js-hiraku-offcanvas');
			$parent.data('opt', opt);
			$parent
				.attr('aria-hidden', 'true')
				.attr('aria-labelledby', 'hiraku-offcanvas-btn-' + num)
				.attr('id', id)
				.data('breakpoint', opt.breakpoint)
				.attr('aria-label', 'close');
			$('body').addClass('js-hiraku-offcanvas-body');
			if (opt.direction == 'right') {
				$this.addClass('js-hiraku-offcanvas-sidebar-right');
			} else {
				$this.addClass('js-hiraku-offcanvas-sidebar-left');
			}
			if (opt.btn) {
				$btn
					.addClass('js-hiraku-offcanvas-btn')
					.attr('data-toggle-offcanvas', '#' + id)
					.attr('aria-expanded', false)
					.attr('aria-label', 'Menu')
					.attr('aria-controls', id)
					.attr('id', 'hiraku-offcanvas-btn-' + num);
			}
			if (opt.fixedHeader) {
				$fixed.addClass('js-hiraku-header-fixed');
			}
			num++;
			resizeHandler();
		}
	});
	$(document).on('click', '.js-hiraku-offcanvas-btn', function(e) {
		var $target = $($(this).data('toggle-offcanvas'));
		$('<button type="button">Close Offcanvas-Menu Button</button>')
			.attr('aria-label', 'Close')
			.addClass('js-hiraku-offcanvas-close-btn')
			.appendTo($target);
		var $this = $(this);
		var $body = $('body').css({ 'width': $(window).width(), 'height': $(window).height() });
		var $sidebar = $target.find('.js-hiraku-offcanvas-sidebar');
		var $first = $target.find(focusableElements).first();
		var $last = $target.find(focusableElements).last();
		$first.off('keydown.hiraku-offcanvas').on('keydown.hiraku-offcanvas', function(e) {
			if ((e.which === 9 && e.shiftKey)) {
				e.preventDefault();
				$last.focus();
			}
		});
		$last.off('keydown.hiraku-offcanvas').on('keydown.hiraku-offcanvas', function(e) {
			if ((e.which === 9 && !e.shiftKey)) {
				e.preventDefault();
				$first.focus();
			}
		});
		$last.off('click.hiraku-offcanvas').on('click.hiraku-offcanvas', function() {
			$target.click();
		});
		$this
			.addClass('js-hiraku-offcanvas-btn-active')
			.attr('aria-expanded', true);
		winPos.x = window.scrollX;
		winPos.y = window.scrollY;
		$target
			.attr('aria-hidden', false)
			.addClass('js-hiraku-offcanvas-open');
		setTimeout(function() {
			$('html').css('marginTop', -1 * window.scrollY);
			if ($sidebar.hasClass('js-hiraku-offcanvas-sidebar-right')) {
				$body.addClass('js-hiraku-offcanvas-body-right');
			} else {
				$body.addClass('js-hiraku-offcanvas-body-left');
			}
			$sidebar.addClass('active');
			$first.focus();
		}, 1);
		e.preventDefault();
	});
	$(document).on('click touchstart keyup', '.js-hiraku-offcanvas', function(e) {
		// add the ability to close the off-canvas if the escape key is pressed
		if (e.type === 'keyup' && e.keyCode !== 27) {
			return;
		}

		if (e.type === 'keyup') {
			// simulate the right element instead of passing the active element in DOM (such as triggers)
			e.target = document.querySelector('.js-hiraku-offcanvas');
		}

		if ($(e.target).hasClass('js-hiraku-offcanvas')) {
			var opt = $(this).data('opt');
			
			$('.js-hiraku-offcanvas-body')
				.addClass('js-hiraku-offcanvas-body-moving')
				.removeClass('js-hiraku-offcanvas-body-right')
				.removeClass('js-hiraku-offcanvas-body-left');
			$('.js-hiraku-offcanvas-sidebar').removeClass('active');
			$('body').css({ width: '', height: '' });
			setTimeout(function() {
				$(e.target)
					.removeClass('js-hiraku-offcanvas-open')
					.attr('aria-hidden', true);
				$('.js-hiraku-offcanvas-body').removeClass('js-hiraku-offcanvas-body-moving');
				$('html').css('marginTop', '');
				window.scrollTo(winPos.x, winPos.y);
				var $btn = $('.js-hiraku-offcanvas-btn-active');
				$btn
					.removeClass('js-hiraku-offcanvas-btn-active')
					.attr('aria-expanded', false)
					.focus();
				$(e.target).find('.js-hiraku-offcanvas-close-btn').remove();
				if (opt && opt.onClose) {
					opt.onClose();
				}
			}, 300);
		}
	});
	$(window).on('resize', function() {
		if ('requestAnimationFrame' in window) {
			cancelAnimationFrame(animationFrameId);
			animationFrameId = requestAnimationFrame(resizeHandler);
		} else {
			resizeHandler();
		}
	});
}));
