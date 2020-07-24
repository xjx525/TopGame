let app = angular.module("indexApp", []);

app.controller("indexCtrl", function ($scope,$http) {


	$scope.init = function () {
		$http({
			url: 'http://127.0.0.1:8080/admin/adminInfo',
			method: 'get',
		}).then(function (resp) {
			$scope.adminInfo = resp.data.adminInfo;
			console.log($scope.adminInfo);
		})
	}
	$scope.init();


	// $scope.show=function (adminInfo) {
	// 	/*用户-查看*/
	// 	let parent = $scope;//将外层的$scope使用变量保存起来，方便调用外层的方法
	// 	$scope.adminInfo=adminInfo;
	// 	$uibModal.open({
	// 		size: 'md',
	// 		backdrop: 'static',
	// 		templateUrl: 'admin_show.html',
	// 		controller: function ($scope, $uibModalInstance) {
	// 			$scope.adminInfo=adminInfo;
	// 			$scope.close = function () {
	// 				$uibModalInstance.dismiss("cancel");
	// 			}
	// 		}
	// 	});
	// }










});
