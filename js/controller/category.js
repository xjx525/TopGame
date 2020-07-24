define([], function() {
	return function($scope, $http, $uibModal) {

		$scope.parentId = null;

		$scope.pageInfo = {
			currentPage: 1,
			totalItems: 0,
			itemsPerPage: 10,
			perPageOptions: [10, 20, 30, 40, 50],
			onChange: function() { //翻页事件
				$scope.queryGoodsCategories($scope.parentId); //重新加载
			}
		};

		$scope.navCategories = [{
			id: null,
			name: '顶级分类列表'
		}];

		$scope.templates = [{
			id: '',
			text: '请选择'
		}];
		$scope.selectedAll = false;

		$scope.deleteIds = [];

		$scope.queryNavCategories = function(gc) {
			if (gc != null) {
				let exist = false;
				for (let i = 0; i < $scope.navCategories.length; i++) {
					if ($scope.navCategories[i].id == gc.id) {
						$scope.navCategories.splice(i + 1, $scope.navCategories.length - i - 1);
						exist = true;
						break;
					}
				}
				if (!exist) {
					$scope.navCategories.push({
						id: gc.id,
						name: gc.name
					});
				}
			}

			$scope.queryGoodsCategories(gc.id);
		}

		$scope.showGoodsCategoryModal = function(goodsCategory) {
			let parent = $scope;
			$uibModal.open({
				size: 'md',
				backdrop: 'static',
				templateUrl: 'manage/modal/categoryModal.html',
				controller: function($scope, $uibModalInstance) {
					$scope.higherLevelName = parent.getHigherLevelName();
					$scope.templates = parent.templates;
					$scope.update = goodsCategory !== undefined;
					$scope.title = $scope.update ? "添加商品分类" : "修改商品分类";
					$scope.currentGC = parent.getOptionGoodsCategory(goodsCategory);

					$scope.save = function() {
						$http({
							url: 'yys/admin/category',
							method: $scope.update ? "put" : "post",
							data: {
								id: $scope.currentGC.id,
								name: $scope.currentGC.name,
								parentId: parent.navCategories[parent.navCategories.length - 1].id,
								templateId: $scope.currentGC.template.id
							}
						}).then(resp => {
							if (resp.data > 0) {
								alert($scope.update ? "修改成功" : "保存成功");
								$scope.close();
								parent.queryGoodsCategories($scope.parentId);
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

		$scope.delelteGoodsCategories = function() {
			if (!$scope.selectedAll && $scope.deleteIds.length == 0) {
				alert("请选择删除的数据");
				return;
			}
			let result = confirm("确定要删除选择的数据吗？");
			if (result) {
				$http({
					url: 'yys/admin/category',
					method: 'delete',
					params: {
						selectedAll: $scope.selectedAll,
						deleteIds: $scope.deleteIds
					}
				}).then(resp => {
					if(resp.data.data > 0){
						alert("删除成功");
						$scope.deleteIds = [];
						$scope.queryGoodsCategories($scope.parentId);
					} else {
						alert("删除失败");
					}
					
				});
			}
		}

		$scope.queryGoodsCategories = function(parentId) {
			$scope.parentId = parentId;
			
			$http({
				url: 'yys/admin/category',
				method: 'get',
				params: {
					currentPage: $scope.pageInfo.currentPage,
					displayCount: $scope.pageInfo.itemsPerPage,
					parentId: $scope.parentId
				}
			}).then(resp => {
				$scope.goodsCategories = resp.data.data.list;
				$scope.pageInfo.totalItems = resp.data.data.total;
				$scope.changeCheckState();
			});
		}

		$scope.choose = function(goodsCategory) {
			if (goodsCategory.selected) {
				$scope.deleteIds.push(goodsCategory.id);
			} else {
				for (let i in $scope.deleteIds) {
					if ($scope.deleteIds[i] == goodsCategory.id) {
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
			for (let i in $scope.goodsCategories) {
				$scope.goodsCategories[i].selected = $scope.selectedAll;
			}
		}

		$scope.getHigherLevelName = function() {
			let name = "";
			for (let i = 0; i < $scope.navCategories.length; i++) {
				if (i == 0) {
					name += $scope.navCategories[i].name;
				} else {
					name += ">>" + $scope.navCategories[i].name;
				}
			}
			return name;
		}

		$scope.getTemplateSelectItems = function() {
			$http({
				url: 'yys/admin/template/all',
				method: 'get'
			}).then(resp => {
				$scope.templates = $scope.templates.concat(resp.data.data);
			});
		}

		$scope.getOptionGoodsCategory = function(goodsCategory) {
			if (goodsCategory == undefined) return {
				name: '',
				template: $scope.templates[0]
			};
			let template;
			for (let i in $scope.templates) {
				if ($scope.templates[i].id == goodsCategory.template.id) {
					template = $scope.templates[i];
					break;
				}
			}
			return {
				id: goodsCategory.id,
				name: goodsCategory.name,
				template: template
			};
		}

		$scope.getTemplateSelectItems();
	}
});
