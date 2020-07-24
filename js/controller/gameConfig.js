// define([], function() {
// 	return function($scope, $http, $uibModal) {

let app = angular.module("gameConfigApp", ['ui.bootstrap','pagination','ng-layer']);
app.controller("gameConfigCtrl", function ($scope, $http,$uibModal) {
		$scope.pageInfo = {
			currentPage: 1,
			totalItems: 0,
			itemsPerPage: 10,
			perPageOptions: [10, 20, 30, 40, 50],
			onChange: function() { //翻页事件
				$scope.queryGames();
			}
		};

	$scope.status = [{
		id: '',
		name: '全部'
	}];


		$scope.con = {
			status: '',
			goodsName: ''
		};

		$scope.goodsName = '';

	$scope.selectedAll = false;

	$scope.selectedIds = [];

		//读取列表数据绑定到表单中
		$scope.queryGames = function() {
			$http({
				url: 'http://127.0.0.1:8080/admin/queryGames',
				method: 'get',
				params: {
					currentPage: $scope.pageInfo.currentPage,
					displayCount: $scope.pageInfo.itemsPerPage,
					goodsName: $scope.goodsName,
					status:$scope.con.status
				}
			}).then(resp => {
				console.log(resp.data);
				$scope.Goods = resp.data.list;
				if(resp.data.list==''||resp.data.list==null){
					layer.msg('未找到相关信息!',{icon: 5,time:1000});
				}
				$scope.pageInfo.totalItems = resp.data.total;
				$scope.changeCheckState();
			});
		}



	$scope.init = function () {
		$http({
			url: 'http://127.0.0.1:8080/admin/initDeveloper',
			method: 'get',
		}).then(function (resp) {
			$scope.status = $scope.status.concat(resp.data);
		})
	}
	$scope.init();


	// 点击详情
	$scope.showDetails = function (good) {
		let parent = $scope;//将外层的$scope使用变量保存起来，方便调用外层的方法
		$scope.good=good;
		$uibModal.open({
			size: 'md',
			backdrop: 'static',
			templateUrl: 'modal/gameInfo.html',
			controller: function ($scope, $uibModalInstance) {
				$scope.good=good;
				console.log(good)
				$scope.queryGames=parent.queryGames();
				//游戏审核  修改游戏状态（状态id)
				$scope.audit = function(statusId){
					$http({
						url: 'http://127.0.0.1:8080/admin/gameManage1',
						method: 'put',
						data: {
							id:good.id,
							targetStatus: statusId
						}
					}).then(resp => {
						if(resp.data > 0){
							layer.alert(statusId == 1 ? '所选游戏已成功通过审批' : statusId == 2 ? '所选游戏已成功驳回' : '所选游戏已成功关闭');
						} else {
							layer.alert(statusId == 1 ? '所选游戏审批失败' : statusId == 2 ? '所选游戏驳回失败' : '所选游戏关闭失败');
						}
					});
					setTimeout( function(){
						parent.queryGames();
						$scope.close();
					}, 2 * 1000 );//延迟5000毫米
				}


				$scope.close = function () {
					$uibModalInstance.dismiss("cancel");
					parent.queryGames()
				}

			}
		});
	}





	$scope.updateGameInfo=function (good) {
		/*用户-查看*/
		let parent = $scope;//将外层的$scope使用变量保存起来，方便调用外层的方法
		$scope.good=good;
		$uibModal.open({
			size: 'md',
			backdrop: 'static',
			templateUrl: 'modal/gameInfoUp.html',
			controller: function ($scope, $uibModalInstance) {
				$scope.good=good;
				$scope.save = function (good) {
					$http({
						url: 'http://127.0.0.1:3001/admin/updateGameInfo',
						method: 'put',
						data: good
					}).then(function (resp) {
						if (resp.data>0) {
							layer.alert("修改成功");
							$scope.close();
							parent.search();
						}
						else {
							layer.alert("修改失败")
						}
					});

				}

				$scope.close = function () {
					$uibModalInstance.dismiss("cancel");
				}
			}
		});
	}


	$scope.updateGameConfigInfo=function (good) {
		/*用户-查看*/
		let parent = $scope;//将外层的$scope使用变量保存起来，方便调用外层的方法
		$scope.good=good;
		$uibModal.open({
			size: 'md',
			backdrop: 'static',
			templateUrl: 'modal/gameConfigUp.html',
			controller: function ($scope, $uibModalInstance) {
				$scope.good=good;
				$scope.save = function (good) {
					$http({
						url: 'http://127.0.0.1:3001/admin/gameConfigUp',
						method: 'put',
						data: good
					}).then(function (resp) {
						if (resp.data>0) {
							layer.alert("修改成功");
							$scope.close();
							parent.search();
						}
						else {
							layer.alert("修改失败")
						}
					});

				}

				$scope.close = function () {
					$uibModalInstance.dismiss("cancel");
				}
			}
		});
	}





	$scope.changeStatus = function () {
		$scope.auditAndBanBtnDisableStatus = ($scope.con.status != 0 && $scope.con.status != '');
	}

	$scope.choose = function (good) {
		if (good.selected) {
			$scope.selectedIds.push(good.id);
		} else {
			for (let i in $scope.selectedIds) {
				if ($scope.selectedIds[i] == good.id) {
					$scope.selectedIds.splice(i, 1);
					break;
				}
			}
		}
	}

	$scope.chooseAll = function () {
		$scope.changeCheckState();
	}

	$scope.changeCheckState = function () {
		for (let i in $scope.Goods) {
			$scope.Goods[i].selected = $scope.selectedAll;
		}
	}
})