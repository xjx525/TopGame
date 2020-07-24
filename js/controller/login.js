let app = angular.module("loginApp", ['ng-layer']);


app.config(function ($httpProvider) {//$httpProvider主要用于修改$http的默认行为
    //允许跨域访问
    $httpProvider.defaults.useXDomain = true;
    //自定义请求头，用于判断请求是否是AJAX请求
    //$httpProvider.defaults.headers.common['kgc-ajax'] = 'exam';
    delete $httpProvider.defaults.headers.common['X-Requested-With'];//原生AJAX请求头
    $httpProvider.interceptors.push('httpInterceptor');//拦截器 <=> 对应的是JSP中的Filter
});
app.factory('httpInterceptor',function ($q) {//服务
    return {
        'responseError' : function(response) {
            if (response.status == 401){//使用默认的状态码401表示没有权限访问
                alert("没有访问权限");
                return $q.reject(response);
            } else if(response.status == 601) {//使用自定义的状态码601表示登录超时
                alert("当前登录已超时，请重新登录");
                location.href="login.html";
                return $q.reject(response);
            } else if (response.status == 404) {
                return $q.reject(response);
            }
        },
        'response' : function(response) {
            return response;
        },
        'request' : function(config) {//请求拦截
            if(!config.url.endsWith(".html")){
                config.headers['kgc-ajax'] = 'exam';//如果请求是定制的请求，则处理请求地址
                config.url = "http://127.0.0.1:8080/" + config.url;
                config.withCredentials = true;//携带cookie
            }
            //这里可以对所有的请求进行处理
            return config;
        }
    }
});




app.controller("loginCtrl", function ($scope, $http){
        $scope.admin = {
            username: '',
            password: ''
        };

        $scope.finish = true;

        $scope.login = function () {
            if ($scope.admin.username == '') {
                layer.msg('提示','请输入用户名');
                return;
            }
            else if (this.admin.password == '') {
                layer.msg('提示','请输入密码');
                return;
            }
            else if($scope.finish){
                $http({
                    url: 'admin/login',
                    method: 'post',
                    data : $scope.admin
                }).then(resp=>{
                    let str=(resp.data == 1 ? '登录成功' : '登录失败,请仔细检查');
                    layer.alert(str);
                    if(resp.data == 1){
                        window.location.href="index.html";
                    }
                });
            }
            // else {
            //     $.sobox.alert('提示','请先进行登录验证');
            //     myloading.close();
            // }



        }



        $scope.forgetPd=function () {
            // $http({
            //     url: 'admin/login',
            //     method: 'put',
            //     data : $scope.admin
            // }).then(function (resp) {
            $state.go("forgetPd");

            // })
        }

    //     var width, height, largeHeader, canvas, ctx, points, target, animateHeader = true;
    //
    //     // Main
    //     initHeader();
    //     initAnimation();
    //     addListeners();
    //
    //     function initHeader() {
    //         width = window.innerWidth;
    //         height = window.innerHeight;
    //         target = {x: width/2, y: height/2};
    //
    //         largeHeader = document.getElementById('large-header');
    //         largeHeader.style.height = height+'px';
    //
    //         canvas = document.getElementById('demo-canvas');
    //         canvas.width = width;
    //         canvas.height = height;
    //         ctx = canvas.getContext('2d');
    //
    //         // create points
    //         points = [];
    //         for(var x = 0; x < width; x = x + width/20) {
    //             for(var y = 0; y < height; y = y + height/20) {
    //                 var px = x + Math.random()*width/20;
    //                 var py = y + Math.random()*height/20;
    //                 var p = {x: px, originX: px, y: py, originY: py };
    //                 points.push(p);
    //             }
    //         }
    //
    //         // for each point find the 5 closest points
    //         for(var i = 0; i < points.length; i++) {
    //             var closest = [];
    //             var p1 = points[i];
    //             for(var j = 0; j < points.length; j++) {
    //                 var p2 = points[j]
    //                 if(!(p1 == p2)) {
    //                     var placed = false;
    //                     for(var k = 0; k < 5; k++) {
    //                         if(!placed) {
    //                             if(closest[k] == undefined) {
    //                                 closest[k] = p2;
    //                                 placed = true;
    //                             }
    //                         }
    //                     }
    //
    //                     for(var k = 0; k < 5; k++) {
    //                         if(!placed) {
    //                             if(getDistance(p1, p2) < getDistance(p1, closest[k])) {
    //                                 closest[k] = p2;
    //                                 placed = true;
    //                             }
    //                         }
    //                     }
    //                 }
    //             }
    //             p1.closest = closest;
    //         }
    //
    //         // assign a circle to each point
    //         for(var i in points) {
    //             var c = new Circle(points[i], 2+Math.random()*2, 'rgba(255,255,255,0.3)');
    //             points[i].circle = c;
    //         }
    //     }
    //
    //     // Event handling
    //     function addListeners() {
    //         if(!('ontouchstart' in window)) {
    //             window.addEventListener('mousemove', mouseMove);
    //         }
    //         window.addEventListener('scroll', scrollCheck);
    //         window.addEventListener('resize', resize);
    //     }
    //
    //     function mouseMove(e) {
    //         var posx = posy = 0;
    //         if (e.pageX || e.pageY) {
    //             posx = e.pageX;
    //             posy = e.pageY;
    //         }
    //         else if (e.clientX || e.clientY)    {
    //             posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
    //             posy = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
    //         }
    //         target.x = posx;
    //         target.y = posy;
    //     }
    //
    //     function scrollCheck() {
    //         if(document.body.scrollTop > height) animateHeader = false;
    //         else animateHeader = true;
    //     }
    //
    //     function resize() {
    //         width = window.innerWidth;
    //         height = window.innerHeight;
    //         largeHeader.style.height = height+'px';
    //         canvas.width = width;
    //         canvas.height = height;
    //     }
    //
    //     // animation
    //     function initAnimation() {
    //         animate();
    //         for(var i in points) {
    //             shiftPoint(points[i]);
    //         }
    //     }
    //
    //     function animate() {
    //         if(animateHeader) {
    //             ctx.clearRect(0,0,width,height);
    //             for(var i in points) {
    //                 // detect points in range
    //                 if(Math.abs(getDistance(target, points[i])) < 4000) {
    //                     points[i].active = 0.3;
    //                     points[i].circle.active = 0.6;
    //                 } else if(Math.abs(getDistance(target, points[i])) < 20000) {
    //                     points[i].active = 0.1;
    //                     points[i].circle.active = 0.3;
    //                 } else if(Math.abs(getDistance(target, points[i])) < 40000) {
    //                     points[i].active = 0.02;
    //                     points[i].circle.active = 0.1;
    //                 } else {
    //                     points[i].active = 0;
    //                     points[i].circle.active = 0;
    //                 }
    //
    //                 drawLines(points[i]);
    //                 points[i].circle.draw();
    //             }
    //         }
    //         requestAnimationFrame(animate);
    //     }
    //
    //     function shiftPoint(p) {
    //         TweenLite.to(p, 1+1*Math.random(), {x:p.originX-50+Math.random()*100,
    //             y: p.originY-50+Math.random()*100, ease:Circ.easeInOut,
    //             onComplete: function() {
    //                 shiftPoint(p);
    //             }});
    //     }
    //
    //     // Canvas manipulation
    //     function drawLines(p) {
    //         if(!p.active) return;
    //         for(var i in p.closest) {
    //             ctx.beginPath();
    //             ctx.moveTo(p.x, p.y);
    //             ctx.lineTo(p.closest[i].x, p.closest[i].y);
    //             ctx.strokeStyle = 'rgba(156,217,249,'+ p.active+')';
    //             ctx.stroke();
    //         }
    //     }
    //
    //     function Circle(pos,rad,color) {
    //         var _this = this;
    //
    //         // constructor
    //         (function() {
    //             _this.pos = pos || null;
    //             _this.radius = rad || null;
    //             _this.color = color || null;
    //         })();
    //
    //         this.draw = function() {
    //             if(!_this.active) return;
    //             ctx.beginPath();
    //             ctx.arc(_this.pos.x, _this.pos.y, _this.radius, 0, 2 * Math.PI, false);
    //             ctx.fillStyle = 'rgba(156,217,249,'+ _this.active+')';
    //             ctx.fill();
    //         };
    //     }
    //
    //     // Util
    //     function getDistance(p1, p2) {
    //         return Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2);
    //     }
    //
    // app.directive('slider', function () {
    //     return {
    //         restrict: 'A',
    //         scope: {
    //             ngModel: '='
    //         },
    //         link: function (scope, element, attrs) {
    //             let label = $(element).find("#label");
    //             let sliderWidth = label.width();
    //             let borderWidth = parseInt(label.css("border-left-width")) + parseInt(label.css("border-right-width"));
    //             let slider = new SliderUnlock("#"+attrs.id, {
    //                 successLabelTip: "验证成功"
    //             }, function () {
    //                 scope.$apply(function () {
    //                     scope.ngModel = (slider.index + borderWidth + sliderWidth == slider.max);
    //                 });
    //             });
    //             slider.init();
    //         }
    //     }
    // });
});

