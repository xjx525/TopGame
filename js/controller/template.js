define([], function() {
	return function($scope, $http, $uibModal) {
		$scope.pageInfo = {
			currentPage: 1,
			totalItems: 0,
			itemsPerPage: 10,
			perPageOptions: [10, 20, 30, 40, 50],
			onChange: function() { //翻页事件
				$scope.queryTemplates(); //重新加载
			}
		};
		$scope.templateName = '';

		$scope.selectedAll = false;

		$scope.deleteIds = [];

		//读取列表数据绑定到表单中
		$scope.queryTemplates = function() {
			$http({
				url: 'yys/admin/template',
				method: 'get',
				params: {
					currentPage: $scope.pageInfo.currentPage,
					displayCount: $scope.pageInfo.itemsPerPage,
					templateName: $scope.templateName
				}
			}).then(resp => {
				$scope.templates = resp.data.data.list;
				$scope.pageInfo.totalItems = resp.data.data.total;
				$scope.changeCheckState();
			});
		}
		$scope.showTemplateModal = function(template) {
			let parent = $scope;
			$uibModal.open({
				size: 'md',
				backdrop: 'static',
				templateUrl: 'manage/modal/templateModal.html',
				controller: function($scope, $uibModalInstance) {
					$scope.update = template !== undefined;
					$scope.title = $scope.update ? "品牌修改" : "品牌添加";
					$scope.brands = parent.brands;
					$scope.specs = parent.specs;
					$scope.currentTemplate = parent.processTemplate(template);

					$scope.addTemplateCustomItems = function() {
						$scope.currentTemplate.customItems.push({
							text: ''
						});
					}

					$scope.deleteCustomItems = function(item) {
						for (let i in $scope.currentTemplate.customItems) {
							if (item == $scope.currentTemplate.customItems[i]) {
								$scope.currentTemplate.customItems.splice(i, 1);
								break;
							}
						}
					}
					$scope.save = function() {
						$http({
							url: 'yys/admin/template',
							method: $scope.update ? "put" : "post",
							data: parent.convertProp2Str($scope.currentTemplate)
						}).then(resp => {
							if (resp.data.data == 1) {
								alert($scope.update ? "修改成功" : "保存成功");
								$scope.close();
								parent.queryTemplates();
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

		$scope.choose = function(template) {
			if (template.selected) {
				$scope.deleteIds.push(template.id);
			} else {
				for (let i in $scope.deleteIds) {
					if ($scope.deleteIds[i] == template.id) {
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
			for (let i in $scope.templates) {
				$scope.templates[i].selected = $scope.selectedAll;
			}
		}

		$scope.deleteTemplates = function() {
			if (!$scope.selectedAll && $scope.deleteIds.length == 0) {
				alert("请选择删除的数据");
				return;
			}
			let result = confirm("确定要删除选择的数据吗？");
			if (result) {
				$http({
					url: 'yys/admin/template',
					method: 'delete',
					params: {
						selectedAll: $scope.selectedAll,
						templateName: $scope.templateName,
						deleteIds: $scope.deleteIds
					}
				}).then(resp => {
					if(resp.data.data > 0){
						alert("删除成功");
						$scope.deleteIds = [];
						$scope.queryTemplates();
					} else{
						alert("删除失败");
					}
				});
			}
		}

		$scope.json2Str = function(json, prop) {
			let info = JSON.parse(json); //将json字符串转换为json对象
			let propInfo = "";
			for (let i = 0; i < info.length; i++) {
				if (i > 0) {
					propInfo += ","
				}
				propInfo += info[i][prop];
			}
			return propInfo;
		}

		$scope.convertProp2Str = function(template) {
			let data = {};
			if (template.id) {
				data.id = template.id;
			}
			data.name = template.name;
			let brandInfo = angular.copy(template.brandInfo);
			for (let prop in brandInfo) {
				let info = brandInfo[prop];
				delete info.$$hashKey;
			}
			data.brandInfo = JSON.stringify(brandInfo);
			let specInfo = angular.copy(template.specInfo);
			for (let prop in specInfo) {
				let info = specInfo[prop];
				delete info.$$hashKey;
			}
			data.specInfo = JSON.stringify(specInfo);
			let customItems = angular.copy(template.customItems);
			for (let i=customItems.length-1; i>=0; i--) {
				let info = customItems[i];
				if (info.text == '')
					customItems.splice(i, 1);
				else
					delete info.$$hashKey;
			}
			data.customItems = JSON.stringify(customItems);
			return data;
		}

		$scope.processTemplate = function(template) {
			if (!template) {
				return {
					brandIds: [],
					specIds: [],
					name: '',
					brandInfo: [],
					specInfo: [],
					customItems: [{
						text: ''
					}, {
						text: ''
					}]
				};
			}
			let brandInfo = JSON.parse(template.brandInfo);
			let brandIds = [];
			for (let i in brandInfo) {
				brandIds.push(brandInfo[i].id);
			}
			let specInfo = JSON.parse(template.specInfo);
			let specIds = [];
			for (let i in specInfo) {
				specIds.push(specInfo[i].id);
			}
			let customItems = JSON.parse(template.customItems);
			if (customItems.length == 0) {
				customItems = [{
					text: ''
				}, {
					text: ''
				}];
			}
			return {
				id: template.id,
				brandIds: brandIds,
				specIds: specIds,
				name: template.name,
				brandInfo: brandInfo,
				specInfo: specInfo,
				customItems: customItems
			};
		}

		$scope.initialize = function() {
			$http({
				url: 'yys/admin/brand/all',
				method: 'get'
			}).then(resp => {
				$scope.brands = {
					data: resp.data.data
				};
			});
			$http({
				url: 'yys/admin/spec/all',
				method: 'get'
			}).then(resp => {
				$scope.specs = {
					data: resp.data.data
				};
			});
		}

		$scope.initialize();
	}
});
