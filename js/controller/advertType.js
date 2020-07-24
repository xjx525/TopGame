let app = angular.module("advertTypeApp", ['ui.bootstrap','pagination','ng-layer']);
app.controller("advertTypeCtrl", function ($scope, $http,$uibModal) {
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
			type: '',/*广告类型*/
			time: '',//价格区间
			timeAfter: ''/*审核状态*/
		};

		$scope.status = [{
			id: '',
			name: '全部'
		}];


		$scope.selectedAll = false;

		$scope.selectedIds = [];


		// name: '',/*广告名*/
		// 	type: '',/*广告类型*/
		// 	time:'',//价格区间
		// 	timeAfter: ''/*审核状态*/
		$scope.search = function () {
			$http({
				url: 'http://127.0.0.1:8080/admin/initAdverType',
				method: 'get',
				params: {
					currentPage: $scope.pageInfo.currentPage,
					displayCount: $scope.pageInfo.itemsPerPage,
					name: $scope.con.name,
					type: $scope.con.type,
				}
			}).then(resp => {
				$scope.advertTypes = resp.data.list;
				$scope.pageInfo.totalItems = resp.data.total;
				if(resp.data.list==''||resp.data.list==null){
					layer.msg('未找到相关信息!',{icon: 5,time:1000});
				}
				$scope.changeCheckState();
				$scope.changeCheckState();
			});
		}

	// 点击详情
	$scope.showCategoryAddModal = function () {
		let parent = $scope;//将外层的$scope使用变量保存起来，方便调用外层的方法
		$uibModal.open({
			size: 'md',
			backdrop: 'static',
			//因为使用的是单页应用，所有的其他页面都当作是模板，因此使用的路径的时候是
			//相对于单页面来定位
			templateUrl: 'modal/templateModal.html',
			controller: function ($scope, $uibModalInstance) {
				$scope.cancel = function () {
					$uibModalInstance.close();
				}
				$scope.save=function (name) {
					console.log(name)
					$http({
						method:'post',
						url:'http://127.0.0.1:3001/admin/advertType',
						data:{
							name:name
						},
					}).then(function (resp) {
						if(resp.data>0){
							layer.alert("添加成功")
							parent.search();
							$scope.cancel()
						}else{
							layer.alert("添加失败");
							parent.search();
							$scope.cancel()
						}
					});
				}
			}
		});
	}



	$scope.exportAdvertTypesExcels=function () {
		console.log($scope.selectedIds)
		if($scope.selectedAll==true){
			alert('全选操作，确定继续？')
		}
		if($scope.selectedIds.length==0&&$scope.selectedAll==false){
			alert('未选中内容')
			return;
		}
		var a= JSON.stringify($scope.selectedIds)
		let url = "http://localhost:3001/admin/exportAdvertTypesExcels?selectedAll=" + $scope.selectedAll
			+ "&selectedIds="+a
		window.location.href = url;
		$scope.selectedIds = [];
		$scope.selectedAll = false;
	}




	$scope.update = function (advertType) {
		let parent = $scope;//将外层的$scope使用变量保存起来，方便调用外层的方法
		$scope.advertType=advertType;
		$uibModal.open({
			size: 'md',
			backdrop: 'static',
			//因为使用的是单页应用，所有的其他页面都当作是模板，因此使用的路径的时候是
			//相对于单页面来定位
			templateUrl: 'modal/advertTypeUpdateModal.html',
			controller: function ($scope, $uibModalInstance) {
				$scope.advertType=advertType;
				$scope.save=function (advertType) {
					console.log("类型"+advertType.name)
					$http({
						method:'put',
						url:'http://127.0.0.1:3001/admin/updateAdvertType',
						data:advertType,
					}).then(function (resp) {
						if(resp.data>0){
							console.log(resp.data)
							layer.alert("修改成功")
							$scope.close();
						}else{
							layer.alert("修改失败");
							parent.search();
							$scope.close()
						}
					});
					$scope.close()
				}



				$scope.close = function () {
					$uibModalInstance.close();
				}

			}
		});
	}











	$scope.changeStatus = function () {
		$scope.auditAndBanBtnDisableStatus = ($scope.con.status != 0 && $scope.con.status != '');
	}

	$scope.choose = function(advertType) {
		if (advertType.selected) {
			$scope.selectedIds.push(advertType.id);
		} else {
			for (let i in $scope.selectedIds) {
				if ($scope.selectedIds[i] == advertType.id) {
					$scope.selectedIds.splice(i, 1);
					break;
				}
			}
		}
	}

	$scope.chooseAll = function() {
		$scope.changeCheckState();
	}

	$scope.changeCheckState = function() {
		for (let i in $scope.advertTypes) {
			$scope.advertTypes[i].selected = $scope.selectedAll;
		}
	}




	$scope.deleteAll = function () {
		console.log($scope.selectedIds)
		if($scope.selectedIds.length==0&&$scope.selectedAll==false){
			alert('未选中内容')
			return;
		}
		let result=confirm("确定删除所选信息")
		if (!result) return;
		$http({
			url: 'http://127.0.0.1:3001/admin/advertTypes',
			method: 'delete',
			params: {
				selectedAll: $scope.selectedAll,
				selectedIds: JSON.stringify($scope.selectedIds),
			}
		}).then(resp => {
			console.log(resp.data)
			if (resp.data >= 0) {
				layer.alert("删除成功")
				$scope.search();
				$scope.selectedIds = [];
				$scope.selectedAll = false;
			}
			else {
				layer.alert("删除失败")
				$scope.search();
				$scope.selectedIds = [];
				$scope.selectedAll = false;
			}

		})
	}






		$scope.delete = function (advertType) {
			let result=confirm("确定删除信息")
			if (!result) return;
			$http({
				url: 'http://127.0.0.1:8080/admin/advertType',
				method: 'delete',
				params: {
					id:advertType.id
				}
			}).then(resp => {
				if (resp.data > 0) {
					layer.alert("删除成功")
					$scope.search();
				}
				else {
					layer.alert("删除失败")
				}

			})
		}



})