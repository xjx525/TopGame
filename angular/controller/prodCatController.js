/**
 * 商品分类，内容（包括：SPU，SKU）控制层
 */
app.controller("productController",function($scope,$controller,prodCatService,prodService,brandService){//prodService,brandService
	
	$controller('baseController',{$scope:$scope});//继承baseController,可以使用baseController中定义的全局变量及全局方法
	/**
	 * 查询所有商品分类
	 */
	$scope.findAllProdCat=function(){
		prodCatService.findAllCat().success(
				function(response){
					$.fn.zTree.init($("#treeDemo"), $scope.setting, response);//jquery ztree初始化
				}
		);
	}
	
	/**
	 * 新增商品
	 */
	$scope.productInfo = {product:{},productDesc:{}};
	$scope.addProductInfo=function(){
		var imgsUrl = $("#prodImgs").val();
		$scope.productInfo.product.smallPic = imgsUrl;
		prodService.addProductInfo($scope.productInfo).success(
				function(response){
					alert(response);
				}
		);
	}
	
	/**
	 * 查询所有品牌
	 */
	$scope.findAllBrand=function(){
		brandService.findAllBrand().success(
				function(response){
					$scope.brandList = response;
				}
		);
	}
});