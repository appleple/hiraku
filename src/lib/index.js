export const getUniqId = () => {
  return (Date.now().toString(36) + Math.random().toString(36).substr(2, 5)).toUpperCase();
}

export const getWindowWidth = () => {
  if (document && document.documentElement) {
    return document.documentElement.clientWidth;
  } else if (window && window.innerWidth) {
    return window.innerWidth;
  }
  return 0;
}

export const getWindowHeight = () => {
  if (window && window.innerHeight) {
    return window.innerHeight;
  } else if (document && document.documentElement) {
    return document.documentElement.clientHeight;
  } else {
    return 0;
  }
}

export const hasClass = (el, className) => {
  if (el.classList) {
    el.classList.contains(className);
  } else {
    new RegExp('(^| )' + className + '( |$)', 'gi').test(el.className);
  }
}

export const addClass = (element,className) => {
  if (element.classList) {
    element.classList.add(className);
  } else {
    element.className += ` ${className}`;
  }
}

export const removeClass = (element,className) => {
  if (element.classList) {
    element.classList.remove(className);
  } else {
    element.className = element.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
  }
}

export const getScrollTop = () => {
  return window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
}

export const wrap = (el, wrapper) => {
  el.parentNode.insertBefore(wrapper, el);
  wrapper.appendChild(el);
}

export const after = (el, html) => {
  el.insertAdjacentHTML('afterend', html);
}