define([], function(){
	return function($scope, $state,$http){
		$scope.menus = [{
			name: '首页',
			icon: 'fa-dashboard',
			route: 'manage.dashboard',
			children: [
				// {
				// 	name: '了解Topgame',
				// 	icon: 'fa-leaf',
				// 	route: 'manage.index'
				// }
			]
		},{
			name: '商家管理',
			icon: 'fa-user',
			route: 'manage.developer',
			children: [{
				name: '商家审核',
				icon: 'fa-leaf',
				route: 'manage.developer'
			},{
				name: '商家管理',
				icon: 'fa-leaf',
				route: 'manage.developerManage'
			}]
		},{
			name: '游戏管理',
			icon: 'fa-list-alt',
			route: '',
			children: [{
				name: '游戏审核',
				icon: 'fa-leaf',
				route: 'manage.game'
			},{
				name: '游戏管理',
				icon: 'fa-leaf',
				route: 'manage.gameManage'
			},{
				name: '模板管理',
				icon: 'fa-leaf',
				route: 'manage.template'
			},{
				name: '分类管理',
				icon: 'fa-leaf',
				route: 'manage.gameType'
			}]
		},{
			name: '广告管理',
			icon: 'fa-rss',
			route: '',
			children: [{
				name: '广告审核',
				icon: 'fa-leaf',
				route: 'manage.advert'
			},{
				name: '广告管理',
				icon: 'fa-leaf',
				route: 'manage.advertManage'
			},{
				name: '广告类型',
				icon: 'fa-leaf',
				route: 'manage.advertType'
			}]
		},{
			name: '系统管理',
			icon: 'fa fa-leaf',
			route: '',
			children: [{
				name: '信息管理',
				icon: 'fa-leaf',
				route: 'manage.adminInfo'
			},{
				name: '权限管理',
				icon: 'fa-leaf',
				route: 'manage.adminRoot'
			}]
		},{
			name: '日志管理',
			icon: 'fa-list-alt',
			route: '',
			children: [{
				name: '系统日志',
				icon: 'fa-leaf',
				route: 'manage.log'
			},{
				name: '异常日志',
				icon: 'fa-leaf',
				route: 'manage.exceptionLog'
			}]

		},{
			name: '报表管理',
			icon: 'fa-list-alt',
			route: '',
			children: [{
				name: '统计报表',
				icon: 'fa-leaf',
				route: 'manage.echarts'
			}]
		}];
		$scope.user = {
			msgs: [{
				type: '系统消息',
				content: '你有新的订单',
				time: '刚刚',
				userLogo: 'user1.jpg'
			},{
				type: '聊天消息',
				content: 'Iphone X还有货吗？',
				time: '刚刚',
				userLogo: 'user2.jpg'
			},{
				type: '系统消息',
				content: '欢迎来到YYS商城',
				time: '10分钟前',
				userLogo: 'user3.jpg'
			},{
				type: '系统消息',
				content: '订单YYS2019090722250001已支付成功',
				time: '1小时前',
				userLogo: 'user4.jpg'
			}],
			notifications: [{
				type: {
					id: 0,
					icon: 'fa-users'
				},
				content: '您的店铺今日新增了5位访客'
			},{
				type: {
					id: 1,
					icon: 'fa-warning'
				},
				content: '您取消了实名认证，这将对您造成不利的影响'
			},{
				type: {
					id: 2,
					icon: 'fa-shopping-cart'
				},
				content: '您所售的商品已成功售出2件'
			}],
			tasks: [{
				content: '信息完善',
				progress: '80%'
			},{
				content: '限时冲星',
				progress: '40%'
			}],
			userLogo: 'wpp.jpg',
			nickname: '',
			lastLogTime: '',
			status: '在线'
	}
		$scope.choose = function(m){
			angular.forEach($scope.menus, function(menu){
				if(m == menu){
					if(m.children.length == 0){
						m.selected = true;
						$state.go(m.route);
					} else {
						menu.selected = !menu.selected;
					}
				} else {
					menu.selected = false;
				}
			});
		}




		$scope.info=function () {

			$http({
			    url: 'admin/admininfo',
			    method: 'get',
			}).then(function (resp) {
				console.log(resp.data)
				console.log(resp.data.username)
				console.log(resp.data.lastLoginTime)
				$scope.user.nickname=resp.data.username;
				$scope.user.lastLogTime=resp.data.lastLoginTime
			})
		}

		$scope.info();

	}
})