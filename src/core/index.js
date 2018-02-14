const defaults = {
  direction: 'right',
  breakpoint: -1
}

export default class Hiraku {

  constructor(selector, opt) {
    this.ele = document.querySelector(selector);
    this.opt = Object.assign({}, defaults, opt);
    window.addEventListener('resize', () => {
      if ('requestAnimationFrame' in window) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = requestAnimationFrame(resizeHandler);
      } else {
        this.resizeHandler();
      }
    });
  }
  
  resizeHandler() {
    
  }

}