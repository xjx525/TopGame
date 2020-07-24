// define([], function() {
// 	return function($scope, $http, $uibModal) {

let app = angular.module("gameApp", ['ui.bootstrap','pagination','ng-layer']);
app.controller("gameCtrl", function ($scope, $http,$uibModal) {
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


	//游戏审核  修改游戏状态（状态id)
	$scope.audit = function (statusId) {
		if ($scope.selectedAll == true) {
			alert('全选操作，确定继续？')
		}
		if ($scope.selectedIds.length == 0 && $scope.selectedAll == false) {
			alert('未选中内容')
			return;
		}
		$http({
			url: 'http://127.0.0.1:3001/admin/gameManage',
			method: 'put',
			data: {
				status: $scope.con.status,
				selectedAll: $scope.selectedAll,
				selectedIds: JSON.stringify($scope.selectedIds),
				targetStatus: statusId
			}
		}).then(resp => {
			if (resp.data > 0) {
				alert(statusId == 1 ? '所选游戏已成功通过审批' : statusId == 2 ? '所选游戏已成功驳回' : '所选游戏已成功关闭');
				$scope.queryGames();
				$scope.selectedIds = [];
				$scope.selectedAll = false;
			} else {
				alert(statusId == 1 ? '所选游戏审批失败' : statusId == 2 ? '所选游戏驳回失败' : '所选游戏关闭失败');
				$scope.queryGames();
				$scope.selectedIds = [];
				$scope.selectedAll = false;
			}
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
				$scope.pageInfo.totalItems = resp.data.total;
				$scope.changeCheckState();
			});
		}
		$scope.showGoodsModal = function(goods) {
			$uibModal.open({
				size: 'md',
				backdrop: 'static',
				templateUrl: 'manage/modal/goodsDetailModal.html',
				controller: function($scope, $uibModalInstance) {
					$scope.update = goods !== undefined;
					$scope.title = $scope.update ? "品牌修改" : "品牌添加";
					$scope.currentGoods = $scope.update ? angular.copy(goods) : {
						name: '',
						firstChar: ''
					};
					$scope.save = function() {
						$http({
							url: 'kgc/mbc/brand',
							method: $scope.update ? "put" : "post",
							data: $scope.currentGoods
						}).then(resp => {
							if (resp.data.data == 1) {
								alert($scope.update ? "修改成功" : "保存成功");
								$scope.close();
								$scope.queryGames();
							} else {
								alert($scope.update ? "修改失败" : "保存失败");
							}
						});
					}
					$scope.close = function() {
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