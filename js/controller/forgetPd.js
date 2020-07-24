// define([], function () {
//     return function ($scope, $http, $state) {
//         $scope.admin = {
//             username: '',
//             password: ''
//         };
//
//         $scope.finish = true;
//
//         var width, height, largeHeader, canvas, ctx, points, target, animateHeader = true;
//
//         // Main
//         initHeader();
//         initAnimation();
//         addListeners();
//
//         function initHeader() {
//             width = window.innerWidth;
//             height = window.innerHeight;
//             target = {x: width/2, y: height/2};
//
//             largeHeader = document.getElementById('large-header');
//             largeHeader.style.height = height+'px';
//
//             canvas = document.getElementById('demo-canvas');
//             canvas.width = width;
//             canvas.height = height;
//             ctx = canvas.getContext('2d');
//
//             // create points
//             points = [];
//             for(var x = 0; x < width; x = x + width/20) {
//                 for(var y = 0; y < height; y = y + height/20) {
//                     var px = x + Math.random()*width/20;
//                     var py = y + Math.random()*height/20;
//                     var p = {x: px, originX: px, y: py, originY: py };
//                     points.push(p);
//                 }
//             }
//
//             // for each point find the 5 closest points
//             for(var i = 0; i < points.length; i++) {
//                 var closest = [];
//                 var p1 = points[i];
//                 for(var j = 0; j < points.length; j++) {
//                     var p2 = points[j]
//                     if(!(p1 == p2)) {
//                         var placed = false;
//                         for(var k = 0; k < 5; k++) {
//                             if(!placed) {
//                                 if(closest[k] == undefined) {
//                                     closest[k] = p2;
//                                     placed = true;
//                                 }
//                             }
//                         }
//
//                         for(var k = 0; k < 5; k++) {
//                             if(!placed) {
//                                 if(getDistance(p1, p2) < getDistance(p1, closest[k])) {
//                                     closest[k] = p2;
//                                     placed = true;
//                                 }
//                             }
//                         }
//                     }
//                 }
//                 p1.closest = closest;
//             }
//
//             // assign a circle to each point
//             for(var i in points) {
//                 var c = new Circle(points[i], 2+Math.random()*2, 'rgba(255,255,255,0.3)');
//                 points[i].circle = c;
//             }
//         }
//
//         // Event handling
//         function addListeners() {
//             if(!('ontouchstart' in window)) {
//                 window.addEventListener('mousemove', mouseMove);
//             }
//             window.addEventListener('scroll', scrollCheck);
//             window.addEventListener('resize', resize);
//         }
//
//         function mouseMove(e) {
//             var posx = posy = 0;
//             if (e.pageX || e.pageY) {
//                 posx = e.pageX;
//                 posy = e.pageY;
//             }
//             else if (e.clientX || e.clientY)    {
//                 posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
//                 posy = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
//             }
//             target.x = posx;
//             target.y = posy;
//         }
//
//         function scrollCheck() {
//             if(document.body.scrollTop > height) animateHeader = false;
//             else animateHeader = true;
//         }
//
//         function resize() {
//             width = window.innerWidth;
//             height = window.innerHeight;
//             largeHeader.style.height = height+'px';
//             canvas.width = width;
//             canvas.height = height;
//         }
//
//         // animation
//         function initAnimation() {
//             animate();
//             for(var i in points) {
//                 shiftPoint(points[i]);
//             }
//         }
//
//         function animate() {
//             if(animateHeader) {
//                 ctx.clearRect(0,0,width,height);
//                 for(var i in points) {
//                     // detect points in range
//                     if(Math.abs(getDistance(target, points[i])) < 4000) {
//                         points[i].active = 0.3;
//                         points[i].circle.active = 0.6;
//                     } else if(Math.abs(getDistance(target, points[i])) < 20000) {
//                         points[i].active = 0.1;
//                         points[i].circle.active = 0.3;
//                     } else if(Math.abs(getDistance(target, points[i])) < 40000) {
//                         points[i].active = 0.02;
//                         points[i].circle.active = 0.1;
//                     } else {
//                         points[i].active = 0;
//                         points[i].circle.active = 0;
//                     }
//
//                     drawLines(points[i]);
//                     points[i].circle.draw();
//                 }
//             }
//             requestAnimationFrame(animate);
//         }
//
//         function shiftPoint(p) {
//             TweenLite.to(p, 1+1*Math.random(), {x:p.originX-50+Math.random()*100,
//                 y: p.originY-50+Math.random()*100, ease:Circ.easeInOut,
//                 onComplete: function() {
//                     shiftPoint(p);
//                 }});
//         }
//
//         // Canvas manipulation
//         function drawLines(p) {
//             if(!p.active) return;
//             for(var i in p.closest) {
//                 ctx.beginPath();
//                 ctx.moveTo(p.x, p.y);
//                 ctx.lineTo(p.closest[i].x, p.closest[i].y);
//                 ctx.strokeStyle = 'rgba(156,217,249,'+ p.active+')';
//                 ctx.stroke();
//             }
//         }
//
//         function Circle(pos,rad,color) {
//             var _this = this;
//
//             // constructor
//             (function() {
//                 _this.pos = pos || null;
//                 _this.radius = rad || null;
//                 _this.color = color || null;
//             })();
//
//             this.draw = function() {
//                 if(!_this.active) return;
//                 ctx.beginPath();
//                 ctx.arc(_this.pos.x, _this.pos.y, _this.radius, 0, 2 * Math.PI, false);
//                 ctx.fillStyle = 'rgba(156,217,249,'+ _this.active+')';
//                 ctx.fill();
//             };
//         }
//
//         // Util
//         function getDistance(p1, p2) {
//             return Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2);
//         }
//
//
//
//
//
//         $(function() {
//             var step= $("#myStep").step({
//                 animate:true,
//                 initStep:1,
//                 speed:1000
//             });
//             $("#preBtn").click(function(event) {
//                 var yes=step.preStep();
//
//             });
//             $("#applyBtn").click(function(event) {
//
//
//                 var yes=step.nextStep();
//                 return;
//             });
//             $("#submitBtn").click(function(event) {
//                 var txtconfirm = $.trim($("#confirmpwd").val());
//                 var txtPwd = $("#password").val();
//
//                 if ($.trim(txtPwd) == "") {
//
//                     Tips('请输入你要设置的密码！');
//                     $("#txtPwd").focus();
//                     return;
//
//                 }
//                 if($.trim(txtconfirm) == "") {
//
//                     Tips('请再次输入密码！');
//                     $("#txtconfirm").focus();
//                     return;
//
//                 }
//                 if( $.trim(txtconfirm) != $.trim(txtPwd) ) {
//
//                     Tips('你输入的密码不匹配，请从新输入！');
//                     $("#txtconfirm").focus();
//                     return;
//
//                 }
//                 var yes=step.nextStep();
//                 $(function () {  setTimeout("lazyGo();", 1000); });
//                 function lazyGo() {
//                     var sec = $("#sec").text();
//                     $("#sec").text(--sec);
//                     if (sec > 0)
//                         setTimeout("lazyGo();", 1000);
//                     else
//                         window.location.href = "article_home.html";
//                 }
//
//
//
//             });
//             $("#goBtn").click(function(event) {
//                 var yes=step.goStep(3);
//             });
//         });
//
//
//         (function (factory) {
//                 "use strict";
//                 if (typeof define === 'function') {
//                     // using CMD; register as anon module
//                     define.cmd&&define('jquery-step', ['jquery'], function (require, exports, moudles) {
//                         var $=require("jquery");
//                         factory($);
//                         return $;
//                     });
//                     define.amd&&define(['jquery'], factory);
//                 } else {
//                     // no CMD; invoke directly
//                     factory( (typeof(jQuery) != 'undefined') ? jQuery : window.Zepto );
//                 }
//             }
//
//             (function($){
//                 $.fn.step = function(options) {
//                     var opts = $.extend({}, $.fn.step.defaults, options);
//                     var size=this.find(".step-header li").length;
//                     var barWidth=opts.initStep<size?100/(2*size)+100*(opts.initStep-1)/size : 100;
//                     var curPage=opts.initStep;
//
//                     this.find(".step-header").prepend("<div class=\"step-bar\"><div class=\"step-bar-active\"></div></div>");
//                     this.find(".step-list").eq(opts.initStep-1).show();
//                     if (size<opts.initStep) {
//                         opts.initStep=size;
//                     }
//                     if (opts.animate==false) {
//                         opts.speed=0;
//                     }
//                     this.find(".step-header li").each(function (i, li) {
//                         if (i<opts.initStep){
//                             $(li).addClass("step-active");
//                         }
//                         //$(li).prepend("<span>"+(i+1)+"</span>");
//                         $(li).append("<span>"+(i+1)+"</span>");
//                     });
//                     this.find(".step-header li").css({
//                         "width": 100/size+"%"
//                     });
//                     this.find(".step-header").show();
//                     this.find(".step-bar-active").animate({
//                             "width": barWidth+"%"},
//                         opts.speed, function() {
//
//                         });
//                     this.nextStep=function() {
//                         if (curPage>=size) {
//                             return false;
//                         }
//                         return this.goStep(curPage+1);
//                     }
//
//                     this.preStep=function() {
//                         if (curPage<=1) {
//                             return false;
//                         }
//                         return this.goStep(curPage-1);
//                     }
//
//                     this.goStep=function(page) {
//                         if (page ==undefined || isNaN(page) || page<0) {
//                             if(window.console&&window.console.error){
//                                 console.error('the method goStep has a error,page:'+page);
//                             }
//                             return false;
//                         }
//                         curPage=page;
//                         this.find(".step-list").hide();
//                         this.find(".step-list").eq(curPage-1).show();
//                         this.find(".step-header li").each(function (i, li) {
//                             $li=$(li);
//                             $li.removeClass('step-active');
//                             if (i<page){
//                                 $li.addClass('step-active');
//                                 if(opts.scrollTop){
//                                     $('html,body').animate({scrollTop:0}, 'slow');
//                                 }
//                             }
//                         });
//                         barWidth=page<size?100/(2*size)+100*(page-1)/size : 100;
//                         this.find(".step-bar-active").animate({
//                                 "width": barWidth+"%"},
//                             opts.speed, function() {
//
//                             });
//                         return true;
//                     }
//                     return this;
//                 };
//                 $.fn.step.defaults = {
//                     animate:true,
//                     speed:500,
//                     initStep:1,
//                     scrollTop:true
//                 };
//             })
//         );
//
//     };
// });
//
