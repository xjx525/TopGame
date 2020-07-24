let app = angular.module("homeApp", []);

app.controller("homeCtrl", function ($scope,$http) {
	var newxAxis = [];
	var newyAxis =[];
	var  newendPay=[];
	var newstartPay=[];
	var startPayMax='';
	var startPayMin='';
	var endPayMax='';
	var endPaymin='';
	var startCoordinateMax=[{
		yaxis: '',
		xaxis: ''
}];
	var startCoordinateMin=[{
		yaxis: '',
		xaxis: ''
	}];
	var endCoordinateMax=[{
		yaxis: '',
		xaxis: ''
	}];;
	var endCoordinateMin=[{
		yaxis: '',
		xaxis: ''
	}];;




	$scope.searchOrderCount1=function () {
		$http({
			url: 'http://127.0.0.1:3001/admin/searchOrderCount',
			method: 'get',
		}).then(function (resp) {
			for(var i = 0; i <resp.data.length; i++){
				newxAxis.push(i+1+"月");
				newyAxis.push(parseFloat(resp.data[i]));
			};
		})

	}

	$scope.searchOrderCount1();

	console.log("new:"+newxAxis)



	$scope.searchStartPay=function () {
		$http({
			url: 'http://127.0.0.1:3001/admin/searchStartPay',
			method: 'get',
		}).then(function (resp) {
			for(var i = 0; i <resp.data.integers.length; i++){
				newstartPay.push(parseFloat(resp.data.integers[i]));
			};

			startCoordinateMax=resp.data.coordinate[0]
			startCoordinateMin=resp.data.coordinate[3]
			console.log("代付款"+resp.data.coordinate[1].xaxis)
			console.log("代付款"+resp.data.coordinate[1].yaxis)
			console.log("代付款"+newstartPay)
			startPayMax= Math.max.apply(null, newstartPay);
			startPayMin= Math.min.apply(null, newstartPay);
		})
	}





	$scope.searchStartPay();



	$scope.searchendPay=function () {
		$http({
			url: 'http://127.0.0.1:3001/admin/searchendPay',
			method: 'get',
		}).then(function (resp) {
			for(var i = 0; i <resp.data.integers.length; i++){
				newendPay.push(parseFloat(resp.data.integers[i]));
			};
			console.log("已支付"+resp.data.coordinate[0].xaxis)
			console.log("已支付"+resp.data.coordinate[0].yaxis)
			endCoordinateMax=resp.data.coordinate[3]
			endCoordinateMin=resp.data.coordinate[0]
			endPayMax= Math.max.apply(null, newendPay);
			endPaymin= Math.min.apply(null, newendPay);
			console.log("已付款"+newendPay)
		})
	}
	$scope.searchendPay();

	$scope.searchOrderCount=function () {
		$http({
			url: 'http://127.0.0.1:3001/admin/initUserCount',
			method: 'get',
		}).then(function (resp) {
			console.log(resp.data)
			$scope.con.count=resp.data;
		})
	}
	$scope.searchOrderCount();



	var markpoints1=[{name : '年最高', value : startPayMax, xAxis: startCoordinateMax.xaxis, yAxis: startCoordinateMax.yaxis, symbolSize:18},{
		name : '年最低', value : startPayMin, xAxis: startCoordinateMin.xaxis, yAxis: startCoordinateMin.yaxis
	}]

	var markpoints2=[{name : '年最高', value : endPayMax, xAxis: endCoordinateMax.xaxis, yAxis: endCoordinateMax.yaxis, symbolSize:18},{
		name : '年最低', value : endPaymin, xAxis:endCoordinateMin.xaxis, yAxis: endCoordinateMin.yaxis
	}]



	$(document).ready(function(){
		$(".t_Record").width($(window).width()-320);
		//当文档窗口发生改变时 触发
		$(window).resize(function(){
			$(".t_Record").width($(window).width()-320);
		});
	});

	setTimeout( function(){
		require.config({
			paths: {
				echarts: './assets/dist'
			}
		});
		require(
			[
				'echarts',
				'echarts/theme/macarons',
				'echarts/chart/line',   // 按需加载所需图表，如需动态类型切换功能，别忘了同时加载相应图表
				'echarts/chart/bar'
			],
			function (ec,theme) {



				var myChart = ec.init(document.getElementById('main'),theme);
				option = {
					title : {
						text: '月购买订单交易记录',
						subtext: '实时获取用户订单购买记录'
					},
					tooltip : {
						trigger: 'axis'
					},
					legend: {
						data:['所有订单','待付款','已付款','已取消']
					},
					toolbox: {
						show : true,
						feature : {
							mark : {show: true},
							dataView : {show: true, readOnly: false},
							magicType : {show: true, type: ['line', 'bar']},
							restore : {show: true},
							saveAsImage : {show: true}
						}
					},
					calculable : true,
					xAxis : [
						{
							type : 'category',
							data : newxAxis
						}
					],
					yAxis : [
						{
							type : 'value'
						}
					],
					series : [
						{
							name:'所有订单',
							type:'bar',
							data:newyAxis,
							markPoint : {
								data : [
									{type : 'max', name: '最大值'},
									{type : 'min', name: '最小值'}
								]
							}
						},
						{
							name:'待付款',
							type:'bar',
							data:newstartPay,
							markPoint : {
								data : [
									{name : '年最高', value : startPayMax, xAxis:startCoordinateMax.xaxis , yAxis: startCoordinateMax.yaxis , symbolSize:18},
									{name : '年最低', value : startPayMin, xAxis:startCoordinateMin.xaxis , yAxis: startCoordinateMin.yaxis}
								]
							},

						}
						, {
							name:'已付款',
							type:'bar',
							data:newendPay,
							markPoint : {
								data :[
									{name : '年最高', value : endPayMax, xAxis: endCoordinateMax.xaxis, yAxis: endCoordinateMax.yaxis, symbolSize:18},
									{name : '年最低', value : endPaymin, xAxis: endCoordinateMin.xaxis, yAxis: endCoordinateMin.yaxis}
								]
							},

						}
						, {
							name:'已取消',
							type:'bar',
							data:[0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
							markPoint : {
								data : [
									{name : '年最高', value : 1, xAxis: 4, yAxis: 1, symbolSize:18},
									{name : '年最低', value : 0, xAxis: 0, yAxis: 0}
								]
							},

						}
					]
				};

				myChart.setOption(option);
			}
);
}, 0.7 * 1000 );//延迟5000毫米









	$scope.con = {
		ip: '', /*登录ip*/
		time: '',/*登录时间*/
		count:'',/*游戏用户数量*/
		orderCount:'',/*订单数量*/
		totalPrice:'',/*订单总价*/
		gameCount:''
	};



	$scope.init = function () {
		$http({
			url: 'http://127.0.0.1:3001/admin/initAdmin',
			method: 'get',
		}).then(function (resp) {
			$scope.con.ip=resp.data.ip;
			$scope.con.time=resp.data.time;

		})
	}
	$scope.init();

	$scope.init1=function () {
		$http({
			url: 'http://127.0.0.1:3001/admin/initUserCount',
			method: 'get',
		}).then(function (resp) {
			console.log(resp.data)
			$scope.con.count=resp.data;
		})
	}
	$scope.init1();


	$scope.init2=function () {
		$http({
			url: 'http://127.0.0.1:3001/admin/initOrderCount',
			method: 'get',
		}).then(function (resp) {
			console.log(resp.data)
			$scope.con.orderCount=resp.data;
		})
	}
	$scope.init2();


	$scope.init3=function () {
		$http({
			url: 'http://127.0.0.1:3001/admin/OrderSum',
			method: 'get',
		}).then(function (resp) {
			console.log(resp.data)
			$scope.con.totalPrice=resp.data;
		})
	}
	$scope.init3();




	$scope.init4=function () {
		$http({
			url: 'http://127.0.0.1:3001/admin/gameSum',
			method: 'get',
		}).then(function (resp) {
			console.log(resp.data)
			$scope.con.gameCount=resp.data;
		})
	}
	$scope.init4();



});
