import { getUniqId, getWindowWidth, hasClass, addClass, removeClass, getScrollTop, wrap, after } from '../lib';

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
    this.side = document.querySelector(selector);
    this.btn = document.querySelector(opt.btn);
    this.fixed = document.querySelector(opt.fixedHeader);
    this.windowWidth = 0;
    this.id = getUniqId();
    this.opened = false;
    this.scrollAmount = 0;
    this.oldPosY = 0;
    window.addEventListener('resize', () => {
      if ('requestAnimationFrame' in window) {
        cancelAnimationFrame(this.animationFrameId);
        this.animationFrameId = requestAnimationFrame(() => {
          this.resizeHandler();
        });
      } else {
        this.resizeHandler();
      }
    });
    window.addEventListener('touchstart', (e) => {
      this._onTouchStart(e);
    });
    window.addEventListener('touchmove', (e) => {
      this._onScroll(e);
    });
    this._setHirakuSideMenu(this.side, this.id);
    this._setHirakuBtn(this.btn, this.id);
    this._setHirakuBody(this.body);
    this.resizeHandler();
  }

  _onTouchStart(e) {
    this.oldPosY = this._getTouchPos(e).y;
  }

  _onScroll(e) {
    if (this.opened === false) {
      return;
    }
    e.preventDefault();
    const posY = this._getTouchPos(e).y;
    const y = posY - this.oldPosY;
    this.scrollAmount += y;
    console.log(posY, this.oldPosY);
    this.side.style.marginTop = `${this.scrollAmount}px`;
    this.oldPosY = posY;
  }

  _setHirakuSideMenu(side, id) {
    const { closeLabel, direction } = this.opt;
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
    this.parent = side.nextElementSibling;
    parent.addEventListener('click', (e) => {
      this.offcanvasClickHandler(e);
    });
    parent.addEventListener('touchstart', (e) => {
      this.offcanvasClickHandler(e);
    });
    parent.addEventListener('keyup', (e) => {
      this.offcanvasClickHandler(e);
    });
  }

  _setHirakuBtn(btn, id) {
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

  _setHirakuBody(body) {
    const { direction } = this.opt;
    addClass(body, 'js-hiraku-offcanvas-body');
  }

  open() {
    const { side, btn, fixed, parent, body } = this;
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
    parent.setAttribute('aria-hidden', false);
    if (direction === 'right') {
      addClass(body, 'js-hiraku-offcanvas-body-right');
    } else {
      addClass(body, 'js-hiraku-offcanvas-body-left');
    }
    if (fixed) {
      fixed.style.transform = `translateY(${getScrollTop()}px)`;
    }
    side.style.height = `${window.innerHeight}px`;
    side.style.transform = `translateX(100%) translateY(${getScrollTop()}px)`;
  }

  close() {
    const { body, fixed, btn } = this;
    const { direction } = this.opt;
    const onTransitionEnd = () => {
      fixed.style.transform = 'translateY(0px)';
      body.removeEventListener('webkitTransitionEnd', onTransitionEnd);
      body.removeEventListener('transitionend', onTransitionEnd);
      btn.setAttribute('aria-expanded', false);
      removeClass(btn, 'js-hiraku-offcanvas-btn-active');
      this.opened = false;
    }
    if (direction === 'right') {
      removeClass(body, 'js-hiraku-offcanvas-body-right');
    } else {
      removeClass(body, 'js-hiraku-offcanvas-body-left');
    }
    body.addEventListener('webkitTransitionEnd', onTransitionEnd);
    body.addEventListener('transitionend', onTransitionEnd);
  }

  offcanvasClickHandler(e) {
    const { parent } = this;
		if (e.type === 'keyup' && e.keyCode !== 27) {
			return;
    }
    if (e.target !== parent) {
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
  
  resizeHandler() {
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
      side.style.transform = '';
      side.setAttribute('aria-hidden', false);
      side.click();
    }
  }

}