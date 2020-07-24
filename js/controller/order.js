let app = angular.module("orderApp", ['pagination','ng-layer']);
app.controller("orderCtrl", function ($scope, $http) {
        $scope.pageInfo = {
            currentPage: 1,
            totalItems: 0,
            itemsPerPage: 10,
            perPageOptions: [10, 20, 30, 40, 50],
            onChange: function () {//翻页事件
                $scope.search();//重新加载
            }
        };


        $scope.con={
            time:'',
            orderId:'',
            gameName:''
        }


    /**
     * 查询订单信息
     */
    $scope.search = function () {
            console.log($scope.selectedIds)
            console.log($scope.con.time)
            $http({
                url: 'http://127.0.0.1:8080/admin/order',
                method: 'get',
                params: {
                    currentPage: $scope.pageInfo.currentPage,
                    displayCount: $scope.pageInfo.itemsPerPage,
                    orderId:$scope.con.orderId,
                    gameName:$scope.con.gameName
                }
            }).then(resp => {
                console.log(resp.data)
                $scope.orderVos = resp.data.list;
                console.log($scope.orderVos)
                if(resp.data.list==''||resp.data.list==null){
                    layer.msg('未找到相关信息!',{icon: 5,time:1000});
                }
                $scope.pageInfo.totalItems = resp.data.total;
                $scope.changeCheckState();
            });
        }




        $scope._init=function(){
            $http({
                url: 'http://127.0.0.1:8080/admin/orderGameType',
                method: 'get',
                params: {
                    currentPage: $scope.pageInfo.currentPage,
                    displayCount: $scope.pageInfo.itemsPerPage
                }
            }).then(resp => {
                console.log(resp.data)
                $scope.orderGameTypes=(resp.data);
                for(let i=0;i<$scope.orderGameTypes.length;i++){
                    console.log($scope.orderGameTypes[i].name)
                }
                console.log("asdasd"+$scope.orderGameTypes[0].name)

                console.log($scope.orderGameTypes)
            });

        }


        $scope._init();






    $scope.searOrderTypes=function(){
        $http({
            url: 'http://127.0.0.1:3001/admin/searOrderTypes',
            method: 'get',
        }).then(resp => {
            console.log("count"+resp.data.count)
            $scope.searOrderTypes=(resp.data);
        });
    }

    $scope.searOrderTypes();


        $scope.choose = function (order) {
            if (logInfo.selected) {
                $scope.selectedIds.push(order.id);
            } else {
                for (let i in $scope.selectedIds) {
                    if ($scope.selectedIds[i] == order.id) {
                        $scope.selectedIds.splice(i, 1);
                        break;
                    }
                }
            }
        }

        $scope.chooseAll = function () {
            $scope.changeCheckState();
        }

        $scope.changeCheckState = function () {
            for (let i in $scope.logInfos) {
                $scope.orderVos[i].selected = $scope.selectedAll;
            }
        }


})
