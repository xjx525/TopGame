define([], function(){
	return function($scope, $http, $rootScope,$location) {
		$scope.title = 'echart图表';
		/*
     官方实例链接：http://echarts.baidu.com/examples.html
     */

		$scope.goBack = function () {
			$ionicHistory.goBack();
		};

		//用于数据的格式化
		$scope.dataList = {
			incomeData: ""
		};
		// 饼图
		$scope.pieConfig = {};
		// 环形图
		$scope.donutConfig = {};

		init();

		function init() {
			initChartsConfig();
			initIncome();
			initConfigChart();
		}

		//饼图配置初始化
		function initChartsConfig() {
			$scope.pieConfig = {
				center: [120, '50%'],
				radius: 90
			};
			$scope.donutConfig = {
				radius: [0, 90]
			};
		}

		//饼图数据
		function initIncome() {
			var temp = [
				{
					NAME: "测试1",
					NUM: 11
				},
				{
					NAME: "测试2",
					NUM: 22
				},
				{
					NAME: "测试3",
					NUM: 33
				},
				{
					NAME: "测试4",
					NUM: 44
				}
			];

			if (temp) {
				// 处理数据
				var temp2 = [];
				angular.forEach(temp, function (item) {
					var t = {x: item.NAME, y: item.NUM};
					temp2.push(t);
				});
				$scope.dataList.incomeData = [{
					name: 'echart饼图测试',
					datapoints: temp2
				}];
			}
		}

		//柱状图数据
		function initConfigChart() {
			var parkaccountChart = echarts.init(document.getElementById('id0001'));//div 标签id
			var seriesLabel = {
				normal: {
					show: true,
					textBorderColor: '#333',
					textBorderWidth: 2
				}
			};
			var option = {
				tooltip: {
					trigger: 'axis',
					axisPointer: {
						type: 'shadow'
					}
				},
				legend: {
					data: ['总数1', '总数2', '总数3'],
					bottom: true
				},
				grid: {
					left: '1%',
					right: '4%',
					bottom: '8%',
					top: '5%',
					containLabel: true
				},
				xAxis: {
					type: 'value',
					name: '',
					axisLabel: {
						formatter: '{value}'
					}
				},
				yAxis: {
					type: 'category',
					inverse: true,
					data: ['y1', 'y2', 'y3']
				},
				series: [
					{
						name: '总数1',
						type: 'bar',
						label: seriesLabel,
						data: [165, 170, 330]
					},
					{
						name: '总数2',
						type: 'bar',
						label: seriesLabel,
						data: [150, 105, 110]
					},
					{
						name: '总数3',
						type: 'bar',
						label: seriesLabel,
						data: [220, 82, 63]
					}
				]
			};
			parkaccountChart.setOption(option);
		}
	}
});