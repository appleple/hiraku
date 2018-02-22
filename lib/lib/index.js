'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var getUniqId = exports.getUniqId = function getUniqId() {
  return (Date.now().toString(36) + Math.random().toString(36).substr(2, 5)).toUpperCase();
};

var getWindowWidth = exports.getWindowWidth = function getWindowWidth() {
  if (document && document.documentElement) {
    return document.documentElement.clientWidth;
  } else if (window && window.innerWidth) {
    return window.innerWidth;
  }
  return 0;
};

var hasClass = exports.hasClass = function hasClass(el, className) {
  if (el.classList) {
    el.classList.contains(className);
  } else {
    new RegExp('(^| )' + className + '( |$)', 'gi').test(el.className);
  }
};

var addClass = exports.addClass = function addClass(element, className) {
  if (element.classList) {
    element.classList.add(className);
  } else {
    element.className += ' ' + className;
  }
};