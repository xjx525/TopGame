let app = angular.module("userlistApp", ['ui.bootstrap','pagination','ng-layer']);

app.controller("userlistCtrl", function ($scope, $http,$uibModal) {
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


	$scope.search = function () {
		console.log($scope.selectedIds)
		$http({
			url: 'http://127.0.0.1:3001/admin/userInfo',
			method: 'get',
			params: {
				name:$scope.con.name,
				time:$scope.con.time,
				currentPage: $scope.pageInfo.currentPage,
				displayCount: $scope.pageInfo.itemsPerPage
			}
		}).then(resp => {
			$scope.userinfos = resp.data.list;
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


	$scope.showDetails = function (userinfo) {
		let parent = $scope;//将外层的$scope使用变量保存起来，方便调用外层的方法
		$scope.userinfo=userinfo;
		$uibModal.open({
			size: 'md',
			backdrop: 'static',
			templateUrl: 'modal/userAdd.html',
			controller: function ($scope, $uibModalInstance) {
				$scope.userinfo=userinfo;
				$scope.close = function () {
					$uibModalInstance.dismiss("cancel");
					parent.search()
				}
			}
		});
	}




	$scope.deleteAll = function () {
		console.log($scope.selectedIds)
		if($scope.selectedAll==true){
			alert('全选操作，确定继续？')
		}
		if($scope.selectedIds.length==0&&$scope.selectedAll==false){
			alert('未选中内容')
			return;
		}
		let result=confirm("确定删除所选信息")
		if (!result) return;
		$http({
			url: 'http://127.0.0.1:3001/admin/batchDeleteUser',
			method: 'delete',
			params: {
				selectedAll: $scope.selectedAll,
				selectedIds: JSON.stringify($scope.selectedIds),
			}
		}).then(resp => {
			if (resp.data > 0) {
				alert("删除成功")
				$scope.search();
				$scope.selectedIds = [];
				$scope.selectedAll = false;
			}
			else {
				alert("删除失败")
			}

		})
	}



	$scope.delete = function () {
		let result=confirm("确定删除信息")
		if (!result) return;
		$http({
			url: 'http://127.0.0.1:3001/admin/userInfo',
			method: 'delete',
			params: {
				id:id
			}
		}).then(resp => {
			if (resp.data > 0) {
				alert("删除成功")
				$scope.search();
			}
			else {
				alert("删除失败")
			}
		})
	}





	$scope.changeStatus = function () {
		$scope.auditAndBanBtnDisableStatus = ($scope.con.status != 0 && $scope.con.status != '');
	}

	$scope.choose = function (userinfo) {
		if (userinfo.selected) {
			$scope.selectedIds.push(userinfo.id);
		} else {
			for (let i in $scope.selectedIds) {
				if ($scope.selectedIds[i] == userinfo.id) {
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
		for (let i in $scope.userinfos) {
			$scope.userinfos[i].selected = $scope.selectedAll;
		}
	}






	$scope.show=function (userinfo) {
		/*用户-查看*/
			let parent = $scope;//将外层的$scope使用变量保存起来，方便调用外层的方法
			$scope.userinfo=userinfo;
			$uibModal.open({
				size: 'md',
				backdrop: 'static',
				templateUrl: 'member-show.html',
				controller: function ($scope, $uibModalInstance) {
					$scope.userinfo=userinfo;
					$scope.close = function () {
						$uibModalInstance.dismiss("cancel");
					}
				}
			});
		}



	$scope.showStatus=function (userinfo) {
		/*用户-查看*/
		let parent = $scope;//将外层的$scope使用变量保存起来，方便调用外层的方法
		$scope.userinfo=userinfo;
		$http({
			url: 'http://127.0.0.1:3001/admin/userInfoStatus',
			method: 'put',
			data: userinfo
		}).then(resp => {
			if (resp.data > 0) {
				layer.msg('已启用!',{icon: 6,time:1000});
				$scope.search();
				$scope.selectedIds = [];
				$scope.selectedAll = false;
			}
		})
	}


	$scope.showStatus1=function (userinfo) {
		/*用户-查看*/
		let parent = $scope;//将外层的$scope使用变量保存起来，方便调用外层的方法
		$scope.userinfo=userinfo;
		$http({
			url: 'http://127.0.0.1:3001/admin/userInfoStatus1',
			method: 'put',
			data: userinfo
		}).then(resp => {
			if (resp.data > 0) {
				layer.msg('已停用!',{icon: 5,time:1000});
				$scope.search();
				$scope.selectedIds = [];
				$scope.selectedAll = false;
			}
		})
	}


	$scope.updateUserInfo=function (userinfo) {
		/*用户-查看*/
		let parent = $scope;//将外层的$scope使用变量保存起来，方便调用外层的方法
		$scope.userinfo=userinfo;
		$uibModal.open({
			size: 'md',
			backdrop: 'static',
			templateUrl: 'modal/userInfoUp.html',
			controller: function ($scope, $uibModalInstance) {
				$scope.userinfo=userinfo;
				$scope.save = function (userinfo) {
					$http({
						url: 'http://127.0.0.1:8080/admin/userInfoUp',
						method: 'put',
						data: userinfo
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


	$scope.updateUserPsw=function (userinfo) {
		var result=confirm("确定重置密码");
		if(!result) return

			$http({
				url: 'http://127.0.0.1:8080/admin/userUpPsw',
				method: 'put',
				data: userinfo
			}).then(function (resp) {
				if (resp.data>0) {
					layer.msg("重置密码成功：密码为0000");
					$scope.search();
				}
				else {
					layer.alert("修改失败")
				}
			});

		}



})
