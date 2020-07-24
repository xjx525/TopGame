let app = angular.module("advertApp", ['ui.bootstrap','pagination','ng-layer']);

app.controller("advertCtrl", function ($scope, $http,$uibModal) {
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
		name: '',/*广告名*/
		price: '',/*广告商名*/
		priceAfter: '',//价格区间
		status: ''/*审核状态*/
	};

	$scope.status = [{
		id: '',
		name: '全部'
	}];


	// $scope.developers=[{
	// 	id:'1',
	// 	name:'java',
	// 	mail:'15892710391@163.com',
	// 	identityNumber:'513813123123123',
	// 	phoneNumber:'15892710391',
	// 	status:'全部'
	// },{
	// 	id:'2',
	// 	name:'kgc',
	// 	mail:'15892710391@163.com',
	// 	identityNumber:'513813123123121',
	// 	phoneNumber:'15892710391',
	// 	status:'全部'
	// }]


	$scope.selectedAll = false;

	$scope.selectedIds = [];


	// private int id;
	//
	// private String name;//广告名
	//
	// private String type;
	//
	// private String gameDeveloper;
	//
	// private BigDecimal price;
	//
	// private String status;


	$scope.search = function () {
		console.log($scope.selectedIds)
		$http({
			url: 'http://127.0.0.1:3001/admin/advert',
			method: 'get',
			params: {
				name: $scope.con.name,
				price: $scope.con.price,
				priceAfter: $scope.con.priceAfter,
				status: $scope.con.status,
				currentPage: $scope.pageInfo.currentPage,
				displayCount: $scope.pageInfo.itemsPerPage
			}
		}).then(resp => {
			$scope.adverts = resp.data.list;
			$scope.pageInfo.totalItems = resp.data.total;
			if(resp.data.list==''||resp.data.list==null){
				layer.msg('未找到相关信息!',{icon: 5,time:1000});
			}
			$scope.changeCheckState();
			console.log(resp.data)
			console.log("list" + resp.data.list)
			console.log(resp.data.total)
		});
	}







	//广告审核  修改游戏状态（状态id)
	$scope.audit = function (statusId) {
		if ($scope.selectedAll == true) {
			let result=confirm('全选操作，确定继续？');
			if(!result)
				return;
		}
		if ($scope.selectedIds.length == 0 && $scope.selectedAll == false) {
			layer.msg('未选中内容')
			return;
		}
		$http({
			url: 'http://127.0.0.1:3001/admin/advert',
			method: 'put',
			data: {
				name: $scope.con.name,
				price: $scope.con.price,
				priceAfter: $scope.con.priceAfter,
				status: $scope.con.status,
				selectedAll: $scope.selectedAll,
				selectedIds: JSON.stringify($scope.selectedIds),
				targetStatus: statusId
			}
		}).then(resp => {
			if (resp.data > 0) {
				layer.alert(statusId == 1 ? '所选广告已成功通过审批' : statusId == 2 ? '所选广告已成功驳回' : '所选广告已成功关闭');
				$scope.search();
				$scope.selectedIds = [];
				$scope.selectedAll = false;
			} else {
				layer.alert(statusId == 1 ? '所选广告审批失败' : statusId == 2 ? '所选广告驳回失败' : '所选广告关闭失败');
				$scope.search();
				$scope.selectedIds = [];
				$scope.selectedAll = false;
			}
		});
	}

	$scope.changeStatus = function () {
		$scope.auditAndBanBtnDisableStatus = ($scope.con.status != 0 && $scope.con.status != '');
	}

	$scope.choose = function (advert) {
		if (advert.selected) {
			$scope.selectedIds.push(advert.id);
		} else {
			for (let i in $scope.selectedIds) {
				if ($scope.selectedIds[i] == advert.id) {
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
		for (let i in $scope.adverts) {
			$scope.adverts[i].selected = $scope.selectedAll;
		}
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


	$scope.search();




	// 点击详情
	$scope.showDetails = function (advert) {
		let parent = $scope;//将外层的$scope使用变量保存起来，方便调用外层的方法
		$scope.advert=advert;
		$uibModal.open({
			size: 'md',
			backdrop: 'static',
			templateUrl: 'modal/advertInfoStep.html',
			controller: function ($scope, $uibModalInstance) {
				$scope.advert=advert;
				console.log(advert)
				$scope.search=parent.search();
				//商家审核  修改游戏状态（状态id)
				$scope.close = function () {
					$uibModalInstance.dismiss("cancel");
					parent.search()
				}

			}
		});
	}

})
