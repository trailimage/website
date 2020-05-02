"use strict";var defaultOptions={src:"data-src",srcset:"data-srcset",selector:".lazyload",root:null,rootMargin:"0px",threshold:0,delayLoad:300},timerKey="timerid",getTimerID=function(t){var e=t.dataset[timerKey];return void 0===e?0:parseInt(e)},setTimerID=function(t,e){void 0===e&&(e=0),0==e?delete t.dataset[timerKey]:t.dataset[timerKey]=e.toString()},LazyLoad=function(){function t(t,e){void 0===e&&(e={}),this.options=jQuery.extend({},e,defaultOptions),this.images=0<t.length?t:document.querySelectorAll(this.options.selector),window.IntersectionObserver?this.observe():(console.warn("Browser does not support IntersectionObserver"),this.images.forEach(this.loadImage))}return t.prototype.delayLoad=function(t){var e=this,i=getTimerID(t);0==i&&(i=setTimeout(function(){e.observer.unobserve(t),e.loadImage(t),setTimerID(t)},this.options.delayLoad),setTimerID(t,i))},t.prototype.cancelLoad=function(t){var e=getTimerID(t);0<e&&(clearTimeout(e),setTimerID(t))},t.prototype.observe=function(){var i=this;this.observer=new IntersectionObserver(function(t){t.forEach(function(t){var e=t.target;t.isIntersecting?i.delayLoad(e):i.cancelLoad(e)})},{root:this.options.root,rootMargin:this.options.rootMargin,threshold:this.options.threshold}),this.images.forEach(function(t){return i.observer.observe(t)})},t.prototype.loadImage=function(t){var e=t.getAttribute(this.options.src);if("img"==t.tagName.toLowerCase()){var i=t,o=i.getAttribute(this.options.srcset);null!==e&&(i.src=e),null!==o&&(i.srcset=o)}else t.style.backgroundImage="url("+e+")"},t}();if(jQuery){var $_1=jQuery;$_1.fn.lazyload=function(t){return new LazyLoad($_1.makeArray(this),t),this}}$(function(){var t=$("figure"),f=$("#light-box");function p(){$("html").css({overflow:"hidden"})}function e(){$(window).off("resize"),$("html").css({overflow:"auto"})}f.on("click",function(){f.off("mousemove").hide(0,e)}),t.find("img").on("click touchstart",function(t){t.preventDefault();function e(t){var e="zoom-out";n.update(),r?(f.on("touchstart",u),f.on("touchmove",l),c()):n.needsToPan?(e="move",f.on("mousemove",d)):f.off("mousemove",d),r||(d(t),s.css("cursor",e))}function a(t){var e=0,i=0,o=t.targetTouches;return void 0!==o&&(e=o[0].clientX,i=o[0].clientY),[e,i]}var i=$(this),s=f.find("img"),o=i.data("big-loaded"),r="touchstart"==t.type,n=new g(i.data("big-width"),i.data("big-height")),h={top:0,left:0},d=function(t){var e=t.clientX,i=t.clientY;if(void 0!==e&&void 0!==i){var o=n.width.offset(e),r=n.height.offset(i);s.css({transform:"translate("+o+"px, "+r+"px)"})}},c=function(){var t=n.width.center(),e=n.height.center();s.css({transform:"translate("+t+"px, "+e+"px)"})},u=function(t){var e=s.position(),i=a(t),o=i[0],r=i[1];h.left=e.left-o,h.top=e.top-r},l=function(t){var e=a(t),i=e[0],o=e[1],r=h.left+i,n=h.top+o;s.css({transform:"translate("+r+"px, "+n+"px)"})};void 0===o&&(o=!1);o?s.attr("src",i.data("big")):(s.attr("src",i.data("src")),$("<img />").bind("load",function(){s.attr("src",this.src),i.data("big-loaded",!0)}).attr("src",i.data("big")));s.height(n.height.image).width(n.width.image),e(t),f.show(0,p),$(window).resize(e)}).lazyload(),t.find(".info-button").one("mouseover",function(){var t=$(this);t.addClass("loading").html(util.html.icon("cloud_download").get(0).outerHTML+"<p>"+"Loading …</p>").load(t.parent().data("exif"),function(){t.removeClass("loading").addClass("loaded")})});var i=(o.prototype.update=function(t){this.window=t,this.extra=(this.window-this.image)/2},o.prototype.ratio=function(){return(this.window-this.image)/this.window*2},o.prototype.offset=function(t){var e=0<this.extra?0:(this.window/2-t)*this.panRatio;return this.extra-e},o.prototype.center=function(){return this.extra/2},o);function o(t){this.image=parseInt(t),this.window=0,this.extra=0,this.panRatio=0}var g=(r.prototype.update=function(){this.height.update(window.innerHeight),this.width.update(window.innerWidth),this.needsToPan=this.width.extra<0||this.height.extra<0,this.needsToPan&&(this.height.panRatio=this.width.panRatio=this.width.extra<this.height.extra&&this.width.extra<0?this.width.ratio():this.height.ratio())},r);function r(t,e){this.width=new i(t),this.height=new i(e)}});
//# sourceMappingURL=/js/maps/post.js.map