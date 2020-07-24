let app = angular.module("adminInfoApp", ['pagination','ui.bootstrap','ng-layer']);

app.controller("adminInfoCtrl", function ($scope, $http,$uibModal) {
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
		password:'',
		newPassword:'',
		confirmPwd:'',
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



	$scope.changeStatus = function () {
		$scope.auditAndBanBtnDisableStatus = ($scope.con.status != 0 && $scope.con.status != '');
	}

	$scope.choose = function (loginInfo) {
		if (loginInfo.selected) {
			$scope.selectedIds.push(loginInfo.id);
		} else {
			for (let i in $scope.selectedIds) {
				if ($scope.selectedIds[i] == loginInfo.id) {
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
		for (let i in $scope.loginInfos) {
			$scope.loginInfos[i].selected = $scope.selectedAll;
		}
	}
	
	
	
	$scope.init = function () {
		$http({
			url: 'http://127.0.0.1:8080/admin/adminInfo',
			method: 'get',
		}).then(function (resp) {
			$scope.adminInfo = resp.data.adminInfo;
			console.log($scope.adminInfo);
		})
	}
	$scope.init();


	//查询正常登陆信息
	$scope.search = function () {
		console.log($scope.selectedIds)
		$http({
			url: 'http://127.0.0.1:8080/admin/loginLog',
			method: 'get',
			params: {
				currentPage: $scope.pageInfo.currentPage,
				displayCount: $scope.pageInfo.itemsPerPage
			}
		}).then(resp => {
			$scope.logInfos = resp.data.list;
			$scope.pageInfo.totalItems = resp.data.total;
			$scope.changeCheckState();
			console.log(resp.data)
			console.log(resp.data.list)
			console.log(resp.data.total)
		});
	}



	$scope.updatePsw = function (adminInfo) {
		let parent = $scope;//将外层的$scope使用变量保存起来，方便调用外层的方法
		$scope.adminInfo = adminInfo;
		console.log($scope.adminInfo)

		$uibModal.open({
			size: 'md',
			backdrop: 'static',
			//因为使用的是单页应用，所有的其他页面都当作是模板，因此使用的路径的时候是
			//相对于单页面来定位
			templateUrl: 'modal/adminInfoUpdate.html',
			controller: function ($scope, $uibModalInstance) {
				$scope.adminInfo = adminInfo;
				$scope.save = function () {
					$http({
						url: 'http://127.0.0.1:8080/admin/userInfo',
						method: 'put',
						data: {
							username: $scope.adminInfo.username,
							password: $scope.con.password,
							newPassword:$scope.con.newPassword,
							confirmPwd:$scope.con.confirmPwd
						}
					}).then(function (resp) {
						if (resp.data == 1) {
							layer.alert("修改成功");
							$scope.cancel();
							parent.search();
						} else  if (resp.data==0){
							layer.alert("密码不正确");
						}
						else {
							layer.alert("密码不一致")
						}
					});

				}

				$scope.cancel = function () {
					$uibModalInstance.close();
				}

			}
		});


	};


	$scope.modify = function (adminInfo) {
		let parent = $scope;//将外层的$scope使用变量保存起来，方便调用外层的方法
		$scope.adminInfo = adminInfo;
		console.log($scope.adminInfo)
		$uibModal.open({
			size: 'md',
			backdrop: 'static',
			//因为使用的是单页应用，所有的其他页面都当作是模板，因此使用的路径的时候是
			//相对于单页面来定位
			templateUrl: 'modal/adminInfoUp.html',
			controller: function ($scope, $uibModalInstance) {
				$scope.adminInfo = adminInfo;
				$scope.save = function (adminInfo) {
					$http({
						url: 'http://127.0.0.1:8080/admin/adminInfoUpdate',
						method: 'put',
						data: adminInfo
					}).then(function (resp) {
						if (resp.data>0) {
							layer.alert("修改成功");
							$scope.cancel();
							parent.search();
						}
						else {
							layer.alert("修改失败")
						}
					});

				}

				$scope.cancel = function () {
					$uibModalInstance.close();
				}

			}
		});
	};














});
