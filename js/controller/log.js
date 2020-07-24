let app = angular.module("logApp", ['pagination','ng-layer']);
app.controller("logCtrl", function ($scope, $http) {
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
        name: '',/*方法*/
    };
    $scope.selectedAll = false;

    $scope.selectedIds=[];



    //查询正常登陆信息
        $scope.search = function () {
            console.log($scope.selectedIds)
            $http({
                url: 'http://127.0.0.1:8080/admin/log',
                method: 'get',
                params: {
                    name:$scope.con.name,
                    currentPage: $scope.pageInfo.currentPage,
                    displayCount: $scope.pageInfo.itemsPerPage
                }
            }).then(resp => {
                $scope.logInfos = resp.data.list;
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








        $scope.choose = function (logInfo) {
            if (logInfo.selected) {
                $scope.selectedIds.push(logInfo.id);
            } else {
                for (let i in $scope.selectedIds) {
                    if ($scope.selectedIds[i] == logInfo.id) {
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
                $scope.logInfos[i].selected = $scope.selectedAll;
            }
        }



    $scope.delete = function (logInfo) {
        let result=confirm("确定删除信息")
        if (!result) return;
        $http({
            url: 'http://127.0.0.1:8080/admin/log',
            method: 'delete',
            params: {
                id:logInfo.id
            }
        }).then(resp => {
            if (resp.data > 0) {
                layer.alert("删除成功")
                $scope.search();
            }
            else {
                layer.alert("删除失败")
            }

        })
    }

})
