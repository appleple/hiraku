'use strict';

var Hiraku = require('../index');

var applyJQuery = function applyJQuery(jQuery) {
  jQuery.fn.hiraku = function (settings) {
    if (typeof settings === 'strings') {} else {
      new Hiraku(this.get(0), settings);
    }
    return this;
  };
};

if (typeof define === 'function' && define.amd) {
  define(['jquery'], applyJQuery);
} else {
  var jq = window.jQuery ? window.jQuery : window.$;
  if (typeof jq !== 'undefined') {
    applyJQuery(jq);
  }
}

module.exports = applyJQuery;