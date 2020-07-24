let app = angular.module("developerApp", ['ui.bootstrap','pagination','ng-layer']);

app.controller("developerCtrl", function ($scope, $http,$uibModal) {
		 $scope.pageInfo = {
		    currentPage: 1,
		    totalItems: 0,
		    itemsPerPage: 10,
		    perPageOptions: [10, 20, 30, 40, 50],
		    onChange: function(){//翻页事件
		        $scope.search();//重新加载
		    }
		};
		
		$scope.auditAndBanBtnDisableStatus = false;
		
		$scope.con = {
			companyName: '',/*公司名*/
			developerName: '',/*商家名*/
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
		
		$scope.search = function(){
			$http({
				url: 'http://127.0.0.1:8080/admin/developer',
				method: 'get',
				params: {
					companyName: $scope.con.companyName,
					developerName: $scope.con.developerName,
					status: $scope.con.status,
					currentPage: $scope.pageInfo.currentPage,
					displayCount:  $scope.pageInfo.itemsPerPage
				}
			}).then(resp => {
				$scope.developers = resp.data.list;
				$scope.pageInfo.totalItems = resp.data.total;
				if(resp.data.list==''||resp.data.list==null){
					layer.msg('未找到相关信息!',{icon: 5,time:1000});
				}
				$scope.changeCheckState();
				console.log(resp.data)
				console.log(resp.data.list)
				console.log(resp.data.total)
			});
		}

		//商家审核  修改游戏状态（状态id)
		$scope.audit = function(statusId){
			if($scope.selectedAll==true){
				alert('全选操作，确定继续？')
			}
			if($scope.selectedIds.length==0&&$scope.selectedAll==false){
				layer.msg('未选中内容')
				return;
			}
			$http({
				url: 'http://127.0.0.1:8080/admin/developer',
				method: 'put',
				data: {
					companyName: $scope.con.companyName,
					status: $scope.con.status,
					selectedAll: $scope.selectedAll,
					selectedIds: JSON.stringify($scope.selectedIds),
					targetStatus: statusId
				}
			}).then(resp => {
				if(resp.data > 0){
					layer.alert(statusId == 1 ? '所选商家已成功通过审批' : statusId == 2 ? '所选商家已成功驳回' : '所选商家已成功关闭');
					$scope.search();
					$scope.selectedIds = [];
					$scope.selectedAll = false;
				} else {
					layer.alert(statusId == 1 ? '所选商家审批失败' : statusId == 2 ? '所选商家驳回失败' : '所选商家关闭失败');
					$scope.search();
					$scope.selectedIds = [];
					$scope.selectedAll = false;
				}
			});
		}
		
		$scope.changeStatus = function(){
			$scope.auditAndBanBtnDisableStatus = ($scope.con.status != 0 && $scope.con.status != '');
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

		$scope.init=function () {
			$http({
				url:'http://127.0.0.1:8080/admin/initDeveloper',
				method:'get',
			}).then(function (resp) {
				$scope.status=$scope.status.concat(resp.data);

			})
		}
		$scope.init();

		$scope.search();





	$scope.showDetails = function (developer) {
		let parent = $scope;//将外层的$scope使用变量保存起来，方便调用外层的方法
		$scope.developer=developer;
		$uibModal.open({
			size: 'md',
			backdrop: 'static',
			templateUrl: 'modal/developerInfo.html',
			controller: function ($scope, $uibModalInstance) {
				$scope.developer=developer;
				console.log(developer)
				$scope.search=parent.search();
				//商家审核  修改游戏状态（状态id)
				$scope.audit = function(statusId){
					$http({
						url: 'http://127.0.0.1:8080/admin/developerManage1',
						method: 'put',
						data: {
							id:developer.id,
							targetStatus: statusId
						}
					}).then(resp => {
						if(resp.data > 0){
							layer.alert(statusId == 1 ? '所选商家已成功通过审批' : statusId == 2 ? '所选商家已成功驳回' : '所选商家已成功关闭');
							$scope.search();
							$scope.selectedIds = [];
							$scope.selectedAll = false;
						} else {
							layer.alert(statusId == 1 ? '所选商家审批失败' : statusId == 2 ? '所选商家驳回失败' : '所选商家关闭失败');
							$scope.search();
							$scope.selectedIds = [];
							$scope.selectedAll = false;
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
})