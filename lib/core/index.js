'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lib = require('../lib');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var defaults = {
  direction: 'right',
  breakpoint: -1,
  btn: '.js-hiraku-offcanvas-btn',
  btnLabel: 'Menu',
  closeLabel: 'Close',
  fixedHeader: '.js-hiraku-fixed-header',
  focusableElements: 'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, *[tabindex], *[contenteditable]'
};

var Hiraku = function () {
  function Hiraku(selector, opt) {
    var _this = this;

    _classCallCheck(this, Hiraku);

    this.body = document.querySelector('body');
    this.opt = Object.assign({}, defaults, opt);
    this.side = document.querySelector(selector);
    this.btn = document.querySelector(opt.btn);
    this.fixed = document.querySelector(opt.fixedHeader);
    this.windowWidth = 0;
    this.id = (0, _lib.getUniqId)();
    this.opened = false;
    this.scrollAmount = 0;
    this.oldPosY = 0;
    window.addEventListener('resize', function () {
      if ('requestAnimationFrame' in window) {
        cancelAnimationFrame(_this.animationFrameId);
        _this.animationFrameId = requestAnimationFrame(function () {
          _this.resizeHandler();
        });
      } else {
        _this.resizeHandler();
      }
    });
    window.addEventListener('touchstart', function (e) {
      _this._onTouchStart(e);
    });
    window.addEventListener('touchmove', function (e) {
      _this._onScroll(e);
    });
    this._setHirakuSideMenu(this.side, this.id);
    this._setHirakuBtn(this.btn, this.id);
    this._setHirakuBody(this.body);
    this.resizeHandler();
  }

  _createClass(Hiraku, [{
    key: '_onTouchStart',
    value: function _onTouchStart(e) {
      this.oldPosY = this._getTouchPos(e).y;
    }
  }, {
    key: '_onScroll',
    value: function _onScroll(e) {
      if (this.opened === false) {
        return;
      }
      e.preventDefault();
      var posY = this._getTouchPos(e).y;
      var y = posY - this.oldPosY;
      this.scrollAmount += y;
      console.log(posY, this.oldPosY);
      this.side.style.marginTop = this.scrollAmount + 'px';
      this.oldPosY = posY;
    }
  }, {
    key: '_setHirakuSideMenu',
    value: function _setHirakuSideMenu(side, id) {
      var _this2 = this;

      var _opt = this.opt,
          closeLabel = _opt.closeLabel,
          direction = _opt.direction;

      (0, _lib.after)(side, '<div class="js-hiraku-offcanvas"></div>');
      if (direction === 'right') {
        (0, _lib.addClass)(side, 'js-hiraku-offcanvas-sidebar-right');
      } else {
        (0, _lib.addClass)(side, 'js-hiraku-offcanvas-sidebar-left');
      }
      side.setAttribute('aria-hidden', true);
      side.setAttribute('aria-labelledby', 'hiraku-offcanvas-btn-' + id);
      side.setAttribute('id', id);
      side.setAttribute('aria-label', closeLabel);
      this.parent = side.nextElementSibling;
      parent.addEventListener('click', function (e) {
        _this2.offcanvasClickHandler(e);
      });
      parent.addEventListener('touchstart', function (e) {
        _this2.offcanvasClickHandler(e);
      });
      parent.addEventListener('keyup', function (e) {
        _this2.offcanvasClickHandler(e);
      });
    }
  }, {
    key: '_setHirakuBtn',
    value: function _setHirakuBtn(btn, id) {
      var _this3 = this;

      var btnLabel = this.opt.btnLabel;

      (0, _lib.addClass)(btn, 'js-hiraku-offcanvas-btn');
      btn.setAttribute('aria-expanded', false);
      btn.setAttribute('aria-label', btnLabel);
      btn.setAttribute('aria-controls', id);
      btn.setAttribute('id', 'hiraku-offcanvas-btn-' + id);
      btn.addEventListener('click', function () {
        _this3.open();
      });
    }
  }, {
    key: '_setHirakuBody',
    value: function _setHirakuBody(body) {
      var direction = this.opt.direction;

      (0, _lib.addClass)(body, 'js-hiraku-offcanvas-body');
    }
  }, {
    key: 'open',
    value: function open() {
      var side = this.side,
          btn = this.btn,
          fixed = this.fixed,
          parent = this.parent,
          body = this.body;
      var _opt2 = this.opt,
          direction = _opt2.direction,
          focusableElements = _opt2.focusableElements;

      var elements = side.querySelectorAll(focusableElements);
      var first = elements[0];
      var last = elements[elements.length - 1];
      var lastFocus = function lastFocus(e) {
        if (e.which === 9 && e.shiftKey) {
          last.focus();
        }
      };
      var firstFocus = function firstFocus(e) {
        if (e.which === 9 && !e.shiftKey) {
          first.focus();
        }
      };
      this.opened = true;
      first.removeEventListener('keydown', lastFocus);
      first.addEventListener('keydown', lastFocus);
      last.removeEventListener('keydown', firstFocus);
      last.addEventListener('keydown', firstFocus);
      btn.setAttribute('aria-expanded', true);
      (0, _lib.addClass)(btn, 'js-hiraku-offcanvas-btn-active');
      parent.setAttribute('aria-hidden', false);
      if (direction === 'right') {
        (0, _lib.addClass)(body, 'js-hiraku-offcanvas-body-right');
      } else {
        (0, _lib.addClass)(body, 'js-hiraku-offcanvas-body-left');
      }
      if (fixed) {
        fixed.style.transform = 'translateY(' + (0, _lib.getScrollTop)() + 'px)';
      }
      side.style.height = window.innerHeight + 'px';
      side.style.transform = 'translateX(100%) translateY(' + (0, _lib.getScrollTop)() + 'px)';
    }
  }, {
    key: 'close',
    value: function close() {
      var _this4 = this;

      var body = this.body,
          fixed = this.fixed,
          btn = this.btn;
      var direction = this.opt.direction;

      var onTransitionEnd = function onTransitionEnd() {
        fixed.style.transform = 'translateY(0px)';
        body.removeEventListener('webkitTransitionEnd', onTransitionEnd);
        body.removeEventListener('transitionend', onTransitionEnd);
        btn.setAttribute('aria-expanded', false);
        (0, _lib.removeClass)(btn, 'js-hiraku-offcanvas-btn-active');
        _this4.opened = false;
      };
      if (direction === 'right') {
        (0, _lib.removeClass)(body, 'js-hiraku-offcanvas-body-right');
      } else {
        (0, _lib.removeClass)(body, 'js-hiraku-offcanvas-body-left');
      }
      body.addEventListener('webkitTransitionEnd', onTransitionEnd);
      body.addEventListener('transitionend', onTransitionEnd);
    }
  }, {
    key: 'offcanvasClickHandler',
    value: function offcanvasClickHandler(e) {
      var parent = this.parent;

      if (e.type === 'keyup' && e.keyCode !== 27) {
        return;
      }
      if (e.target !== parent) {
        return;
      }
      this.close();
    }
  }, {
    key: '_isTouched',
    value: function _isTouched(e) {
      if (e && e.touches) {
        return true;
      }
      return false;
    }
  }, {
    key: '_getTouchPos',
    value: function _getTouchPos(e) {
      var x = 0;
      var y = 0;
      e = typeof event === 'undefined' ? e : event;
      if (this._isTouched(e)) {
        x = e.touches[0].pageX;
        y = e.touches[0].pageY;
      } else if (e.pageX) {
        x = e.pageX;
        y = e.pageY;
      }
      return { x: x, y: y };
    }
  }, {
    key: 'resizeHandler',
    value: function resizeHandler() {
      var windowWidth = (0, _lib.getWindowWidth)();
      var body = this.body,
          side = this.side,
          opt = this.opt;
      var breakpoint = opt.breakpoint;

      if (windowWidth === this.windowWidth) {
        return;
      }
      this.windowWidth = windowWidth;
      if ((0, _lib.hasClass)(side, 'js-hiraku-offcanvas-open') && (breakpoint === 1 || breakpoint >= windowWidth)) {
        return;
      }
      if (breakpoint === -1 || breakpoint >= windowWidth) {
        (0, _lib.addClass)(body, 'js-hiraku-offcanvas-body-active');
        side.setAttribute('aria-hidden', true);
      } else {
        (0, _lib.removeClass)(body, 'js-hiraku-offcanvas-body-active');
        side.style.transform = '';
        side.setAttribute('aria-hidden', false);
        side.click();
      }
    }
  }]);

  return Hiraku;
}();

exports.default = Hiraku;
module.exports = exports['default'];