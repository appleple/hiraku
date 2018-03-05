// new Hiraku('.js-offcanvas', {
//   btn: ".js-offcanvas-btn",
//   fixedHeader: ".js-fixed-header",
//   direction: "right",
//   breakpoint: 767
// });
$(function(){
  $('.js-offcanvas').hiraku({
    btn: ".js-offcanvas-btn",
    fixedHeader: ".js-fixed-header",
    direction: "left",
    breakpoint: 767
  });
});