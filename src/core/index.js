import scrollToElement from 'scroll-to-element';
import { getUniqId, getWindowWidth, getWindowHeight, hasClass, addClass, removeClass, getScrollTop, wrap, after } from '../lib';

const defaults = {
  direction: 'right',
  breakpoint: -1,
  btn: '.js-hiraku-offcanvas-btn',
  btnLabel: 'Menu',
  closeLabel: 'Close',
  fixedHeader: '.js-hiraku-fixed-header',
  focusableElements: 'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, *[tabindex], *[contenteditable]'
}

export default class Hiraku {

  constructor(selector, opt) {
    this.body = document.querySelector('body');
    this.opt = Object.assign({}, defaults, opt);
    this.side = typeof selector === 'string' ? document.querySelector(selector) : selector;
    this.btn = typeof opt.btn === 'string' ? document.querySelector(opt.btn) : opt.btn;
    this.fixed = typeof opt.fixedHeader === 'string' ? document.querySelector(opt.fixedHeader) : opt.fixedHeader;
    this.windowWidth = 0;
    this.id = getUniqId();
    this.opened = false;
    this.scrollAmount = 0;
    this.oldPosY = 0;
    this.vy = 0;
    window.addEventListener('resize', () => {
      if ('requestAnimationFrame' in window) {
        cancelAnimationFrame(this.animationFrameId);
        this.animationFrameId = requestAnimationFrame(() => {
          this._resizeHandler();
        });
      } else {
        this._resizeHandler();
      }
    });
    window.addEventListener('touchstart', (e) => {
      this._onTouchStart(e);
    });
    window.addEventListener('touchmove', (e) => {
      this._onTouchMove(e);
    });
    window.addEventListener('touchend', (e) => {
      this._onTouchEnd(e);
    })
    this._setHirakuSideMenu();
    this._setHirakuBtn();
    this._setHirakuBody();
    this._resizeHandler();
  }

  open() {
    const { side, btn, fixed, parentElement, body } = this;
    const { direction, focusableElements } = this.opt;
    const elements = side.querySelectorAll(focusableElements);
    const first = elements[0];
    const last = elements[elements.length - 1];
    const lastFocus = (e) => {
      if (e.which === 9 && e.shiftKey) {
        last.focus();
      }
    }
    const firstFocus = (e) => {
      if (e.which === 9 && !e.shiftKey) {
        first.focus();
      }
    }
    this.opened = true;
    first.removeEventListener('keydown', lastFocus);
    first.addEventListener('keydown', lastFocus);
    last.removeEventListener('keydown', firstFocus);
    last.addEventListener('keydown', firstFocus);
    btn.setAttribute('aria-expanded', true);
    addClass(btn, 'js-hiraku-offcanvas-btn-active');
    parentElement.setAttribute('aria-hidden', false);
    if (direction === 'right') {
      addClass(body, 'js-hiraku-offcanvas-body-right');
    } else {
      addClass(body, 'js-hiraku-offcanvas-body-left');
    }
    if (fixed) {
      fixed.style.transform = `translateY(${getScrollTop()}px)`;
    }
    this.scrollAmount = 0;
    side.style.height = `${getWindowHeight()}px`; 
    if (direction === 'right') {
      side.style.transform = `translateX(100%) translateY(${getScrollTop()}px)`;
    } else {
      side.style.transform = `translateX(-100%) translateY(${getScrollTop()}px)`;
    }
    side.style.marginTop = '0px';
  }

  close(callback = () => {}) {
    const { body, fixed, btn, side } = this;
    const { direction } = this.opt;
    const onTransitionEnd = () => {
      fixed.style.transform = 'translateY(0px)';
      body.removeEventListener('webkitTransitionEnd', onTransitionEnd);
      body.removeEventListener('transitionend', onTransitionEnd);
      btn.setAttribute('aria-expanded', false);
      side.style.transform = '';
      side.setAttribute('aria-hidden', false);
      removeClass(btn, 'js-hiraku-offcanvas-btn-active');
      this.opened = false;
      callback();
    }
    if (direction === 'right') {
      removeClass(body, 'js-hiraku-offcanvas-body-right');
    } else {
      removeClass(body, 'js-hiraku-offcanvas-body-left');
    }
    body.addEventListener('webkitTransitionEnd', onTransitionEnd);
    body.addEventListener('transitionend', onTransitionEnd);
  }

  _onTouchStart(e) {
    this.vy = 0;
    this.side.style.height = 'auto';
    this.oldPosY = this._getTouchPos(e).y;
  }

  _onTouchMove(e) {
    if (this.opened === false) {
      return;
    }
    e.preventDefault();
    const posY = this._getTouchPos(e).y;
    const y = posY - this.oldPosY;
    const limitHeight = this.side.offsetHeight - getWindowHeight();
    this.scrollAmount += y;
    if (this.scrollAmount < -limitHeight) {
      this.scrollAmount = -limitHeight;
    }
    if (this.scrollAmount > 0) {
      this.scrollAmount = 0;
    }
    this.side.style.marginTop = `${this.scrollAmount}px`;
    this.oldPosY = posY;
    this.vy = y;
  }

  _onTouchEnd(e) {
    const limitHeight = this.side.offsetHeight - getWindowHeight();
    const registance = 0.4;

    const interval = () => {
      if (this.vy > 0) {
        this.vy -= registance;
      }
      if (this.vy < 0) {
        this.vy += registance;
      }
      if (Math.abs(this.vy) < registance) {
        return;
      }
      this.scrollAmount += this.vy;
      if (this.scrollAmount < -limitHeight) {
        this.scrollAmount = -limitHeight;
        return;
      }
      if (this.scrollAmount > 0) {
        this.scrollAmount = 0;
        return;
      }
      this.side.style.marginTop = `${this.scrollAmount}px`;
      window.requestAnimationFrame(interval);
    };
    window.requestAnimationFrame(interval);
  }

  _setHirakuSideMenu() {
    const {side, id} = this;
    const { closeLabel, direction } = this.opt;
    const links = side.querySelectorAll('a');
    after(side, '<div class="js-hiraku-offcanvas"></div>');
    if (direction === 'right') {
      addClass(side, 'js-hiraku-offcanvas-sidebar-right');
    } else {
      addClass(side, 'js-hiraku-offcanvas-sidebar-left');
    }
    side.setAttribute('aria-hidden', true);
    side.setAttribute('aria-labelledby', `hiraku-offcanvas-btn-${id}`);
    side.setAttribute('id', id);
    side.setAttribute('aria-label', closeLabel);
    this.parentElement = side.nextElementSibling;
    this.parentElement.addEventListener('click', (e) => {
      this._offcanvasClickHandler(e);
    });
    this.parentElement.addEventListener('touchstart', (e) => {
      this._offcanvasClickHandler(e);
    });
    this.parentElement.addEventListener('keyup', (e) => {
      this._offcanvasClickHandler(e);
    });
    [].forEach.call(links, (link) => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (href.charAt(0) === '#') {
          e.preventDefault();
          this.close(() => {
            const target = document.querySelector(href);
            let offset = 0;
            if (this.fixed) {
              offset = - this.fixed.offsetHeight;
            }
            scrollToElement(target, { offset, duration: 500 });
          });
        }
      });
    });
  }

  _setHirakuBtn() {
    const {btn, id} = this;
    const { btnLabel } = this.opt;
    addClass(btn, 'js-hiraku-offcanvas-btn');
    btn.setAttribute('aria-expanded', false);
    btn.setAttribute('aria-label', btnLabel);
    btn.setAttribute('aria-controls', id);
    btn.setAttribute('id', `hiraku-offcanvas-btn-${id}`);
    btn.addEventListener('click', () => {
      this.open();
    });
  }

  _setHirakuBody() {
    const body = this.body;
    addClass(body, 'js-hiraku-offcanvas-body');
  }

  _offcanvasClickHandler(e) {
    const { parentElement } = this;
		if (e.type === 'keyup' && e.keyCode !== 27) {
			return;
    }
    if (e.target !== parentElement) {
      return;
    }
    this.close();
  }

  _isTouched(e) {
    if (e && e.touches) {
      return true;
    }
    return false;
  }

  _getTouchPos(e) {
    let x = 0;
    let y = 0;
    e = typeof event === 'undefined' ? e : event;
    if (this._isTouched(e)) {
      x = e.touches[0].pageX;
      y = e.touches[0].pageY;
    } else if (e.pageX) {
      x = e.pageX;
      y = e.pageY;
    }
    return { x, y };
  }
  
  _resizeHandler() {
    const windowWidth = getWindowWidth();
    const { body, side, opt } = this;
    const { breakpoint } = opt;
    if (windowWidth === this.windowWidth) {
      return;
    }
    this.windowWidth = windowWidth;
    if (hasClass(side, 'js-hiraku-offcanvas-open') && (breakpoint === 1 || breakpoint >= windowWidth)) {
      return;
    }
    if (breakpoint === -1 || breakpoint >= windowWidth) {
      addClass(body, 'js-hiraku-offcanvas-body-active');
      side.setAttribute('aria-hidden', true);
    } else {
      removeClass(body, 'js-hiraku-offcanvas-body-active');
      this.close();
    }
  }
}