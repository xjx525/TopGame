let app = angular.module("individualBusinessApp", ['ui.bootstrap','pagination','ng-layer']);

app.controller("individualBusinessCtrl", function ($scope, $http,$uibModal) {
		$scope.pageInfo = {
			currentPage: 1,
			totalItems: 0,
			itemsPerPage: 10,
			perPageOptions: [10, 20, 30, 40, 50],
			onChange: function(){//翻页事件
				$scope.search();//重新加载
			}
		};
		$scope.con = {
			companyName: '',/*公司名*/
			developerName: '',/*商家名*/
			status: ''/*审核状态*/
		};
		$scope.status = [{
			id: '',
			name: '全部'
		}];

		$scope.showDetails = function (developer) {
			let parent = $scope;//将外层的$scope使用变量保存起来，方便调用外层的方法
			$scope.developer=developer;
			$uibModal.open({
				size: 'md',
				backdrop: 'static',
				templateUrl: 'modal/individualBusinessInfo.html',
				controller: function ($scope, $uibModalInstance) {
					$scope.developer=developer;
					console.log(developer)
					$scope.search=parent.search();
					//商家审核  修改游戏状态（状态id)
					$scope.audit = function(statusId){
						$http({
							url: 'http://127.0.0.1:3001/admin/developerManage1',
							method: 'put',
							data: {
								id:developer.id,
								targetStatus: statusId
							}
						}).then(resp => {
							if(resp.data > 0){
								layer.alert(statusId == 1 ? '所选商家已成功通过审批' : statusId == 2 ? '所选商家已成功驳回' : '所选商家已成功关闭');
							} else {
								layer.alert(statusId == 1 ? '所选商家审批失败' : statusId == 2 ? '所选商家驳回失败' : '所选商家关闭失败');
							}
						});


						setTimeout( function(){
							parent.search();
							$scope.close();
						}, 2 * 1000 );//延迟5000毫米
					}
					$scope.close = function () {
						$uibModalInstance.dismiss("cancel");
						parent.search()
					}

				}
			});
		}
		$scope.search = function(){
			$http({
				url: 'http://127.0.0.1:3001/admin/individualBusiness',
				method: 'get',
				params: {
					developerName:$scope.con.developerName,
					status: $scope.con.status,
					currentPage: $scope.pageInfo.currentPage,
					displayCount:  $scope.pageInfo.itemsPerPage
				}
			}).then(resp => {
				$scope.developers = resp.data.list;
				$scope.pageInfo.totalItems = resp.data.total;
				$scope.changeCheckState();
				console.log(resp.data)
				console.log(resp.data.list)
				console.log(resp.data.total)
			});
		}

		$scope.choose = function(developer) {
			if (developer.selected) {
				$scope.selectedIds.push(developer.id);
			} else {
				for (let i in $scope.selectedIds) {
					if ($scope.selectedIds[i] == developer.id) {
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
			for (let i in $scope.developers) {
				$scope.developers[i].selected = $scope.selectedAll;
			}
		}

		$scope.search();



	$scope.delete = function (developer) {
		let result=confirm("确定删除信息")
		if (!result) return;
		$http({
			url: 'http://127.0.0.1:8080/admin/developer',
			method: 'delete',
			params: {
				id:developer.id
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



	$scope.updateDeveloperInfo=function (developer) {
		/*用户-查看*/
		let parent = $scope;//将外层的$scope使用变量保存起来，方便调用外层的方法
		$scope.developer=developer;
		$uibModal.open({
			size: 'md',
			backdrop: 'static',
			templateUrl: 'modal/developerInfoUp.html',
			controller: function ($scope, $uibModalInstance) {
				$scope.developer=developer;
				$scope.save = function (developer) {
					$http({
						url: 'http://127.0.0.1:3001/admin/developerInfoUp',
						method: 'put',
						data: developer
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





	$scope.init=function () {
		$http({
			url:'http://127.0.0.1:8080/admin/initDeveloper',
			method:'get',
		}).then(function (resp) {
			$scope.status=$scope.status.concat(resp.data);

		})
	}
	$scope.init();

})
