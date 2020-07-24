let app = angular.module("gameTypeApp", ['ng-layer','ui.bootstrap']);
app.controller("gameTypeCtrl", function ($scope, $http,$uibModal) {
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


	$scope.con = {
		name: '',/*类型名*/
	};

	$scope.selectedAll = false;

	$scope.deleteIds = [];

	$scope.categorieName='';

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
			templateUrl: 'modal/updateGameType.html',
			controller: function($scope, $uibModalInstance) {
				$scope.higherLevelName = parent.getHigherLevelName();
				$scope.update = goodsCategory !== undefined;
				$scope.currentGC = parent.getOptionGoodsCategory(goodsCategory);
				$scope.save = function() {
					if ($scope.currentGC.name==''||$scope.currentGC.name==undefined){
						alert("请输入商品分类名称!")
						return;
					}
					$http({
						url: 'http://127.0.0.1:8080/admin/gameType',
						method: "put",
						params: {
							id: $scope.currentGC.id,
							name: $scope.currentGC.name,
							parentId: parent.navCategories[parent.navCategories.length - 1].id,
						}
					}).then(resp => {
						if (resp.data > 0) {
							layer.alert( "修改成功");
							$scope.close();
							parent.queryGoodsCategories(parent.navCategories[parent.navCategories.length - 1].id);
						} else {
							layer.alert("修改失败");
						}
					});
				}
				$scope.close = function() {
					$uibModalInstance.dismiss("cancel");
				}
			}
		});
	}




	$scope.show = function() {
		let parent = $scope;
		$uibModal.open({
			size: 'md',
			backdrop: 'static',
			templateUrl: 'modal/addgameType.html',
			controller: function($scope, $uibModalInstance) {
				$scope.higherLevelName = parent.getHigherLevelName();
				$scope.save = function(name) {
					if ($scope.con.name==''||$scope.con.name==undefined){
						layer.msg("请输入游戏分类名称!")
						return;
					}
					$http({
						url: 'http://127.0.0.1:8080/admin/gameType',
						method: "post",
						params: {
							name: $scope.con.name,
							parentId: parent.navCategories[parent.navCategories.length - 1].id,
						}
					}).then(resp => {
						if (resp.data > 0) {
							layer.alert( "添加成功");
							$scope.close();
							parent.queryGoodsCategories(parent.navCategories[parent.navCategories.length - 1].id);
						} else {
							layer.alert("添加失败");
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
			layer.alert("请选择删除的数据");
			return;
		}
		let result = confirm("确定要删除选择的数据吗？");
		if (result) {
			$http({
				url: 'http://127.0.0.1:3001/admin/gameType',
				method: 'delete',
				params: {
					selectedAll: $scope.selectedAll,
					deleteIds: JSON.stringify($scope.deleteIds)
				}
			}).then(resp => {
				if(resp.data > 0){
					layer.alert("删除成功");
					$scope.deleteIds = [];
					$scope.selectedAll=false;
					$scope.queryGoodsCategories($scope.parentId);
				} else {
					layer.alert("删除失败");
				}

			});
		}
	}

	$scope.queryGoodsCategories = function(parentId) {
		$scope.parentId = parentId;
		$http({
			url:'http://127.0.0.1:8080/admin/gameType',
			method:'get',
			params:{
				id:$scope.parentId
			}
		}).then(function (resp) {
			$scope.goodsCategories=resp.data
			$scope.changeCheckState();
		})
	}



	$scope.queryGoodsCategories(); //重新加载



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
		if ($scope.selectedAll==true){
			$scope.deleteIds = [];
			for (let i in $scope.goodsCategories) {
				$scope.goodsCategories[i].selected = $scope.selectedAll;
				$scope.deleteIds.push($scope.goodsCategories[i].id);
			}
		}else{
			for (let i in $scope.goodsCategories) {
				$scope.goodsCategories[i].selected = $scope.selectedAll;
				$scope.deleteIds=[]
			}
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


	$scope.getOptionGoodsCategory = function(goodsCategory) {
		console.log(goodsCategory)
		return {
			id: goodsCategory.id,
			name: goodsCategory.name,
		};
	}

})