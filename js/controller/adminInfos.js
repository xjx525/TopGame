let app = angular.module("adminInfosApp", ['ui.bootstrap','pagination','ng-layer']);

app.controller("adminInfosCtrl", function ($scope, $http,$uibModal) {
	$scope.pageInfo = {
		currentPage: 1,
		totalItems: 0,
		itemsPerPage: 10,
		perPageOptions: [10, 20, 30, 40, 50],
		onChange: function () {//翻页事件
			$scope.search();//重新加载
		}
	};

	$scope.auditAndBanBtnDisableStatus = false;

	$scope.con = {
		name: '',/*玩家名称*/
		time:'',
		status: ''/*审核状态*/
	};

	$scope.status = [{
		id: '',
		name: '全部'
	}];

	$scope.selectedAll = false;

	$scope.selectedIds = [];



	$scope.search = function () {
		console.log($scope.selectedIds)
		$http({
			url: 'http://127.0.0.1:8080/admin/adminInfos',
			method: 'get',
			params: {
				name:$scope.con.name,
				time:$scope.con.time,
				currentPage: $scope.pageInfo.currentPage,
				displayCount: $scope.pageInfo.itemsPerPage
			}
		}).then(resp => {
			$scope.adminInfos = resp.data.list;
			$scope.pageInfo.totalItems = resp.data.total;
			$scope.changeCheckState();
		});
	}




	$scope.changeStatus = function () {
		$scope.auditAndBanBtnDisableStatus = ($scope.con.status != 0 && $scope.con.status != '');
	}

	$scope.choose = function (adminInfo) {
		if (adminInfo.selected) {
			$scope.selectedIds.push(adminInfo.id);
		} else {
			for (let i in $scope.selectedIds) {
				if ($scope.selectedIds[i] == adminInfo.id) {
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
		for (let i in $scope.adminInfos) {
			$scope.adminInfos[i].selected = $scope.selectedAll;
		}
	}


	$scope.show=function (adminInfo) {
		/*用户-查看*/
		let parent = $scope;//将外层的$scope使用变量保存起来，方便调用外层的方法
		$scope.adminInfo=adminInfo;
		$uibModal.open({
			size: 'md',
			backdrop: 'static',
			templateUrl: 'admin_show.html',
			controller: function ($scope, $uibModalInstance) {
				$scope.adminInfo=adminInfo;
				$scope.close = function () {
					$uibModalInstance.dismiss("cancel");
				}
			}
		});
	}


})
