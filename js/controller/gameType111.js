let app = angular.module("gameTypeApp", ['ng-layer','ui.bootstrap']);
app.controller("gameTypeCtrl", function ($scope, $http,$uibModal) {
		$scope.eneity_1={"name":"顶级分类", "id":0
		}
		$scope.eneity_2=null
		$scope.eneity_3=null

	$scope.parentId = null;

		$scope.findByParentId=function (id) {
			console.log(id)
			$scope.parentId=id;
			$http({
				url:'http://127.0.0.1:8080/admin/gameType',
				method:'get',
				params:{
					id:id
				}
			}).then(function (resp) {
				$scope.gameTypes=resp.data
			})
		}
		//定义一个参数 记录当前属于第几级分类
		$scope.grand=1;
		$scope.eneity_1={"name":"顶级分类", "id":0
		}
		$scope.eneity_2=null
		$scope.eneity_3=null


		$scope.selectedAll = false;

		$scope.selectedIds = [];


		//定义一个方法  每次调用让grand加1
		$scope.loadChild=function (gameType) {
			$scope.grand+=1;
			//当前分类属于第二级分类时  就给第二个面包屑赋值
			if($scope.grand==2){
				$scope.eneity_2=gameType;
			}else if($scope.grand==3){
				$scope.eneity_3=gameType;

			}
		}

		$scope.findByParentId(0)



	// 点击详情
	$scope.add = function(gameType) {
		let parent = $scope;
		$uibModal.open({
			size: 'md',
			backdrop: 'static',
			templateUrl: 'modal/addGameType.html',
			controller: function($scope, $uibModalInstance) {
				$scope.higherLevelName = parent.getHigherLevelName();
				$scope.templates = parent.templates;
				$scope.update = gameType !== undefined;
				$scope.title = $scope.update ? "添加商品分类" : "修改商品分类";
				$scope.currentGC = parent.getOptiongameType(gameType);

				$scope.save = function() {
					if ($scope.currentGC.name==''||$scope.currentGC.name==undefined){
						alert("请输入商品分类名称!")
						return;
					}
					if ($scope.currentGC.template.id==''||$scope.currentGC.template.id==undefined){
						alert("请选择商品分类模板!")
						return;
					}
					$http({
						url: 'admin/category',
						method: $scope.update ? "put" : "post",
						params: {
							id: $scope.currentGC.id,
							name: $scope.currentGC.name,
							parentId: parent.navCategories[parent.navCategories.length - 1].id,
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




		//游戏类型删除
		$scope.deleteGameType = function(){
			if($scope.selectedAll==true){
				layer.alert('全选操作，确定继续？')
			}
			if($scope.selectedIds.length==0&&$scope.selectedAll==false){
				layer.msg('未选中内容')
				return;
			}
			$http({
				url: 'http://127.0.0.1:8080/admin/deleteGameType',
				method: 'delete',
				params: {
					selectedAll: $scope.selectedAll,
					selectedIds: JSON.stringify($scope.selectedIds),
				}
			}).then(resp => {
				console.log(resp.data)
				if(resp.data>0){
					layer.alert("删除成功")
				}else {
					layer.alert("删除失败")
				}
			});
		}

		$scope.choose = function(gameType) {
			if (gameType.selected) {
				$scope.selectedIds.push(gameType.id);
			} else {
				for (let i in $scope.selectedIds) {
					if ($scope.selectedIds[i] == gameType.id) {
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
			for (let i in $scope.gameTypes) {
				$scope.gameTypes[i].selected = $scope.selectedAll;
			}
		}
})