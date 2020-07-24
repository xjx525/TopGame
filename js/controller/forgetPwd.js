let app = angular.module("forgetApp", ['ng-layer']);

app.controller("forgetCtrl", function ($scope, $http) {
	$scope.con = {
		phone:'',
		email:'',
		code:'',
		code1:'',
		password:'',
		newPassword:'',
		confirmPwd:'',
	};

	$scope.active = function () {
					$http({
						url: 'http://127.0.0.1:3001/admin/activeCode',
						method: 'get',
						params:{
							email:$scope.con.email
						}
					}).then(resp => {
						console.log(resp.data.code)
						$scope.con.code1=resp.data.code;
					});
	};




	$scope.serf=function(){
		window.location.href="login.html";
	}




		$(function () {
			var step = $("#myStep").step({
				animate: true,
				initStep: 1,
				speed: 1000
			});
			$("#preBtn").click(function (event) {
				var yes = step.preStep();

			});
			$("#applyBtn").click(function (event) {

				if($scope.con.code!=$scope.con.code1){
					alert("验证码输入错误")
					return;
				}
				else if ($scope.con.code==null||$scope.con.code==''){
					alert("请输入验证码")
					return;
				}
				var yes = step.nextStep();
				return;
			});

			$("#submitBtn").click(function(event) {
				var txtconfirm = $.trim($("#confirmpwd").val());
				var txtPwd = $("#password").val();
				if ($.trim(txtPwd) == "") {

					Tips('请输入你要设置的密码！');
					$("#txtPwd").focus();
					return;

				}
				if ($.trim(txtconfirm) == "") {

					Tips('请再次输入密码！');
					$("#txtconfirm").focus();
					return;

				}
				if ($.trim(txtconfirm) != $.trim(txtPwd)) {

					Tips('你输入的密码不匹配，请重新输入！');
					$("#txtconfirm").focus();
					return;
				} else {
					$http({
						url: 'http://127.0.0.1:3001/admin/updatePwd',
						method: 'put',
						data: {
							email: $scope.con.email,
							password: $scope.con.newPassword
						}
					}).then(resp => {
						if (resp.data >= 0) {
							layer.alert("重置密码成功")
							var yes = step.nextStep();
						} else {
							Tips('重置密码失败！');
						}
					});
				}

			});



			    //             $(function () {  setTimeout("lazyGo();", 1000); });
                // function lazyGo() {
                //     var sec = $("#sec").text();
                //     $("#sec").text(--sec);
                //     if (sec > 0)
                //         setTimeout("lazyGo();", 1000);
                //     else
                //         window.location.href = "login.html";
                // }

			$("#goBtn").click(function (event) {
				var yes = step.goStep(3);
			});
		});


		(function (factory) {
				"use strict";
				if (typeof define === 'function') {
					// using CMD; register as anon module
					define.cmd && define('jquery-step', ['jquery'], function (require, exports, moudles) {
						var $ = require("jquery");
						factory($);
						return $;
					});
					define.amd && define(['jquery'], factory);
				} else {
					// no CMD; invoke directly
					factory((typeof (jQuery) != 'undefined') ? jQuery : window.Zepto);
				}
			}

			(function ($) {
				$.fn.step = function (options) {
					var opts = $.extend({}, $.fn.step.defaults, options);
					var size = this.find(".step-header li").length;
					var barWidth = opts.initStep < size ? 100 / (2 * size) + 100 * (opts.initStep - 1) / size : 100;
					var curPage = opts.initStep;

					this.find(".step-header").prepend("<div class=\"step-bar\"><div class=\"step-bar-active\"></div></div>");
					this.find(".step-list").eq(opts.initStep - 1).show();
					if (size < opts.initStep) {
						opts.initStep = size;
					}
					if (opts.animate == false) {
						opts.speed = 0;
					}
					this.find(".step-header li").each(function (i, li) {
						if (i < opts.initStep) {
							$(li).addClass("step-active");
						}
						//$(li).prepend("<span>"+(i+1)+"</span>");
						$(li).append("<span>" + (i + 1) + "</span>");
					});
					this.find(".step-header li").css({
						"width": 100 / size + "%"
					});
					this.find(".step-header").show();
					this.find(".step-bar-active").animate({
							"width": barWidth + "%"
						},
						opts.speed, function () {

						});

					this.nextStep = function () {
						if (curPage >= size) {
							return false;
						}
						return this.goStep(curPage + 1);
					}

					this.preStep = function () {
						if (curPage <= 1) {
							return false;
						}
						return this.goStep(curPage - 1);
					}

					this.goStep = function (page) {
						if (page == undefined || isNaN(page) || page < 0) {
							if (window.console && window.console.error) {
								console.error('the method goStep has a error,page:' + page);
							}
							return false;
						}
						curPage = page;
						this.find(".step-list").hide();
						this.find(".step-list").eq(curPage - 1).show();
						this.find(".step-header li").each(function (i, li) {
							$li = $(li);
							$li.removeClass('step-active');
							if (i < page) {
								$li.addClass('step-active');
								if (opts.scrollTop) {
									$('html,body').animate({scrollTop: 0}, 'slow');
								}
							}
						});
						barWidth = page < size ? 100 / (2 * size) + 100 * (page - 1) / size : 100;
						this.find(".step-bar-active").animate({
								"width": barWidth + "%"
							},
							opts.speed, function () {

							});
						return true;
					}
					return this;
				};

				$.fn.step.defaults = {
					animate: true,
					speed: 500,
					initStep: 1,
					scrollTop: true
				};
			})
		);
});
