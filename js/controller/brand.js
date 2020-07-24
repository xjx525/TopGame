define([], function() {
	return function($scope, $http, $uibModal) {
		$scope.pageInfo = {
			currentPage: 1,
			totalItems: 0,
			itemsPerPage: 10,
			perPageOptions: [10, 20, 30, 40, 50],
			onChange: function() { //翻页事件
				$scope.queryBrands(); //重新加载
			}
		};
		$scope.brandName = '';

		$scope.selectedAll = false;

		$scope.deleteIds = [];

		//读取列表数据绑定到表单中
		$scope.queryBrands = function() {
			$http({
				url: 'yys/admin/brand',
				method: 'get',
				params: {
					currentPage: $scope.pageInfo.currentPage,
					displayCount: $scope.pageInfo.itemsPerPage,
					brandName: $scope.brandName
				}
			}).then(resp => {
				$scope.brands = resp.data.data.list;
				$scope.pageInfo.totalItems = resp.data.data.total;
				$scope.changeCheckState();
			});
		}
		$scope.showBrandModal = function(brand) {
			let parent = $scope;
			$uibModal.open({
				size: 'md',
				backdrop: 'static',
				templateUrl: 'manage/modal/brandModal.html',
				controller: function($scope, $uibModalInstance) {
					$scope.update = brand !== undefined;
					$scope.title = $scope.update ? "品牌修改" : "品牌添加";
					$scope.currentBrand = $scope.update ? angular.copy(brand) : {
						name: '',
						firstChar: ''
					};
					$scope.save = function() {
						$http({
							url: 'yys/admin/brand',
							method: $scope.update ? "put" : "post",
							data: $scope.currentBrand
						}).then(resp => {
							if (resp.data.data == 1) {
								alert($scope.update ? "修改成功" : "保存成功");
								$scope.close();
								parent.queryBrands();
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

		$scope.choose = function(brand) {
			if (brand.selected) {
				$scope.deleteIds.push(brand.id);
			} else {
				for (let i in $scope.deleteIds) {
					if ($scope.deleteIds[i] == brand.id) {
						$scope.deleteIds.splice(i, 1);
						break;
					}
				}
			}
		}

		$scope.chooseAll = function() {
			$scope.changeCheckState();
		}

		$scope.changeCheckState = function() {
			for (let i in $scope.brands) {
				$scope.brands[i].selected = $scope.selectedAll;
			}
		}

		$scope.deleteBrands = function() {
			if (!$scope.selectedAll && $scope.deleteIds.length == 0) {
				alert("请选择删除的数据");
				return;
			}
			let result = confirm("确定要删除选择的数据吗？");
			if (result) {
				$http({
					url: 'yys/admin/brand',
					method: 'delete',
					params: {
						selectedAll: $scope.selectedAll,
						brandName: $scope.brandName,
						deleteIds: $scope.deleteIds.join(",")
					}
				}).then(resp => {
					if(resp.data.data > 0){
						alert("删除成功");
						$scope.deleteIds = [];
						$scope.queryBrands();
					} else {
						alert("删除失败");
					}
				});
			}
		}
	}
})
