let app = angular.module("advertManageApp", ['ui.bootstrap','pagination','ng-layer']);
app.controller("advertManageCtrl", function ($scope, $http,$uibModal) {
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
			totalTime: '',/*广告时长*/
			totalTimeAfter:'',/*广告时长区间*/
		};
		// <td ng-bind="advertType.id"></td>
		// 		<td ng-bind="advertType.name"></td>
		// 		<td ng-bind="advertType.type"></td>
		// 		<td ng-bind="advertType.time"></td>
		// 		<td ng-bind="advertType.shelfTime"></td>

		// $scope.advertManages=[{
		// 	id:'1589284923424',
		// 	name:'英雄联盟',
		// 	type:'商品广告',
		// 	time:'2天',
		// 	shelfTime:'2019.10.13',
		// 	auditTime:'2019.10.1'
		// },{
		// 	id:'1589284923424',
		// 	name:'英雄联盟',
		// 	type:'商品广告',
		// 	time:'2天',
		// 	shelfTime:'2019.10.13',
		// 	auditTime:'2019.10.1'
		// }]


		$scope.selectedAll = false;

		$scope.selectedIds=[];






		// name: '',/*广告名*/
		// 	type: '',/*广告类型*/
		// 	time:'',//价格区间
		// 	timeAfter: ''/*审核状态*/
		$scope.search = function () {
			$http({
				url: 'http://127.0.0.1:3001/admin/advertManage',
				method: 'get',
				params: {
					name: $scope.con.name,
					totalTime: $scope.con.totalTime,
					currentPage: $scope.pageInfo.currentPage,
					displayCount: $scope.pageInfo.itemsPerPage
				}
			}).then(resp => {
				$scope.advertManages = resp.data.list;
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



		$scope.changeStatus = function () {
			$scope.auditAndBanBtnDisableStatus = ($scope.con.status != 0 && $scope.con.status != '');
		}

		$scope.choose = function(advertManage) {
			if (advertManage.selected) {
				$scope.selectedIds.push(advertManage.id);
			} else {
				for (let i in $scope.selectedIds) {
					if ($scope.selectedIds[i] == advertManage.id) {
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
			for (let i in $scope.advertManages) {
				$scope.advertManages[i].selected = $scope.selectedAll;
			}
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
				url: 'http://127.0.0.1:3001/admin/batchDeleteAdvert',
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
					$scope.search();
					$scope.selectedIds = [];
					$scope.selectedAll = false;
				}

			})
		}



		$scope.delete = function (advertManage) {
			let result=confirm("确定删除信息")
			if (!result) return;
			$http({
				url: 'http://127.0.0.1:8080/admin/advertManage',
				method: 'delete',
				params: {
					id:advertManage.id
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


		$scope.update = function (advertManage) {
			console.log(advertManage)
			let parent = $scope;//将外层的$scope使用变量保存起来，方便调用外层的方法
			$scope.advertManage=advertManage;
			console.log($scope.advertManage)
			$uibModal.open({
				size: 'md',
				backdrop: 'static',
				//因为使用的是单页应用，所有的其他页面都当作是模板，因此使用的路径的时候是
				//相对于单页面来定位
				templateUrl: 'modal/AdvertUpdateModal.html',
				controller: function ($scope, $uibModalInstance) {
					var formData = new FormData();
					$scope.uploadImg=function(){
						formData.append("files",file.files[0]);
						console.log(formData.get("files"))
					}

					$scope.advertTypes = [{id: 0, name: '请选择'}];
					$scope.advertManage=advertManage;


					$scope.save=function (advertManage) {
						formData.append("adverts",JSON.stringify(advertManage))
						console.log(formData)
						console.log(formData.get("files"))
						console.log(formData.get("adverts"))
						$http({
							method:'post',
							url:'http://127.0.0.1:3001/admin/updateImg',
							data:formData,
							headers:{
								'Content-Type':undefined
							} ,// Content-Type : text/html  text/plain
							transformRequest : angular.identity,//用来对http请求的请求体和头信息进行转换，使用angular的标识
						}).then(function (resp) {
							if(resp.data.length>0){
								alert(resp.data)
							}else{
								alert("修改成功");
								parent.search();
							}
						});
						$scope.cancel()
					}



					$scope.cancel = function () {
						$uibModalInstance.close();
					}

					//	广告类型查询
					$scope.initAdverType=function () {
						$http({
							url:'http://127.0.0.1:3001/admin/initAdverType',
							method:'get',
						}).then(function (resp) {
							$scope.advertTypes =$scope.advertTypes.concat(resp.data);
							console.log(resp.data)
							console.log($scope.advertTypes)
						})
					}
					$scope.initAdverType();
				}
			});
		}


		$scope.conent = ["待审核","审核通过","驳回","关闭"];
		$scope.showInfo=function (advertManage) {
			let content=$scope.conent
			let parent = $scope;//将外层的$scope使用变量保存起来，方便调用外层的方法
			$scope.advertManage=advertManage;
			console.log("展示信息"+advertManage.statusId)
			$uibModal.open({
				size: 'md',
				backdrop: 'static',
				//因为使用的是单页应用，所有的其他页面都当作是模板，因此使用的路径的时候是
				//相对于单页面来定位
				templateUrl: 'modal/AdvertInfo.html',
				controller: function ($scope, $uibModalInstance) {
					$scope.advertManage=advertManage;
					console.log($scope.advertManage.statusId)
					console.log(content)
					$scope.content=content;
					$scope.cancel = function () {
						$uibModalInstance.close();
					}



					$scope.save=function (advertManage) {
						$uibModalInstance.close();
					}

					$scope.export=function (advertManage) {

						let url = "http://localhost:3001/admin/exportExcel?id="+advertManage.id
						window.location.href = url;

					}
				}
			});


		}



		$scope.exportExcels=function () {
			console.log($scope.selectedIds)
			if($scope.selectedAll==true){
				layer.alert('全选操作，确定继续？')
			}
			if($scope.selectedIds.length==0&&$scope.selectedAll==false){
				layer.alert('未选中内容')
				return;
			}
			var a= JSON.stringify($scope.selectedIds)
			let url = "http://localhost:3001/admin/exportExcels?selectedAll=" + $scope.selectedAll
				+ "&selectedIds="+a
			window.location.href = url;
			$scope.selectedIds = [];
			$scope.selectedAll = false;
		}




		$scope.showImportModal = function () {
			let parent = $scope;
			$uibModal.open({
				size: 'md',
				backdrop: 'static',
				templateUrl: 'modal/advertImportModal.html',
				controller: function ($scope, $uibModalInstance) {
					$scope.failedAdverts = [];//上传失败的数据
					$scope.text = "Excel文件";
					$scope.upload = function () {
						if($scope.uploadFile == undefined){
								$scope.fileTip = "请选择上传的Excel文件";
								return;
						}
						let fd = new FormData();
						fd.append("file", $scope.uploadFile);//将文件放入表单数据
						$http({
							url: 'http://127.0.0.1:3001/admin/uploadAdvert',
							method: 'post',
							headers : {
								'Content-Type' : undefined //设定Content-Type，设定后AngularJs不会再进行处理
							},
							transformRequest : angular.identity,//用来对http请求的请求体和头信息进行转换，使用angular的标识
							data: fd
						}).then(function(resp){
							if(resp.data==1){
								layer.alert("导入成功")
							}else if(resp.data==0){
								layer.alert("文件格式异常")
							}else {
								layer.alert("文件不能为空")
							}
						});
					}
					$scope.cancel = function () {
						$uibModalInstance.close();
					}
				}
			});
		}



		$scope.add=function () {
			let parent = $scope;//将外层的$scope使用变量保存起来，方便调用外层的方法
			$uibModal.open({
				size: 'md',
				backdrop: 'static',
				//因为使用的是单页应用，所有的其他页面都当作是模板，因此使用的路径的时候是
				//相对于单页面来定位
				templateUrl: 'modal/advertAddModal.html',
				controller: function ($scope, $uibModalInstance) {
					$scope.cancel = function () {
						$uibModalInstance.close();
					}

					$scope.img_upload=parent.img_upload
					$scope.save=function (advertManage) {

						var formData = new FormData();
						formData.append("files",parent.file);
							formData.append("adverts",JSON.stringify(advertManage))
						console.log(formData)
						console.log(formData.get("files"))
						console.log("advert"+formData.get("adverts"))
							$http({
								method:'post',
								url:'http://127.0.0.1:3001/admin/upload/uploadImg',
								data:formData,
								headers:{
									'Content-Type':undefined
								} ,// Content-Type : text/html  text/plain
								transformRequest : angular.identity,//用来对http请求的请求体和头信息进行转换，使用angular的标识
							}).then(function (resp) {
								if(resp.data.length>0){
									layer.alert(resp.data)
									parent.search();
								}else{
									layer.alert("上传成功");
									parent.search();
								}
							});
							parent.search();
							$scope.cancel()
						}
					}
			});
		}
		//初始化查询
	$scope.search();



	$scope.file = '';
	$scope.img_upload = function(files) {       //单次提交图片的函数
		console.log(files)
		let file = files[0];

		let filereader = new FileReader();
		filereader.readAsDataURL(file);//发起异步请求
		filereader.onload = function(){
			//读取完成后，数据保存在对象的result属性中
			$scope.file =file;
			document.querySelector('#face').src= this.result;
		}
	};


})