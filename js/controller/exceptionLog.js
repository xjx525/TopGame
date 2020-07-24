let app = angular.module("exceptionLogApp", ['pagination','ng-layer']);
app.controller("exceptionLogCtrl", function ($scope, $http) {
        $scope.pageInfo = {
            currentPage: 1,
            totalItems: 0,
            itemsPerPage: 10,
            perPageOptions: [10, 20, 30, 40, 50],
            onChange: function () {//翻页事件
                $scope.searchException();//重新加载
            }
        };


    $scope.auditAndBanBtnDisableStatus = false;


    $scope.con = {
        username: '',/*方法*/
    };
    $scope.selectedAll = false;

    $scope.selectedIds=[];



//查询异常登陆信息
    $scope.searchException = function () {
        console.log($scope.selectedIds)
        $http({
            url: 'http://127.0.0.1:8080/admin/exceptionLog',
            method: 'get',
            params: {
                username:$scope.con.username,
                currentPage: $scope.pageInfo.currentPage,
                displayCount: $scope.pageInfo.itemsPerPage
            }
        }).then(resp => {
            $scope.logExceptionInfos = resp.data.list;
            $scope.pageInfo.totalItems = resp.data.total;
            if(resp.data.list==''||resp.data.list==null){
                layer.msg('未找到相关信息!',{icon: 5,time:1000});
            }
            $scope.changeCheckState();
        });
    }








        $scope.choose = function (logExceptionInfo) {
            if (logExceptionInfo.selected) {
                $scope.selectedIds.push(logExceptionInfo.id);
            } else {
                for (let i in $scope.selectedIds) {
                    if ($scope.selectedIds[i] == logExceptionInfo.id) {
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
            for (let i in $scope.logExceptionInfos) {
                $scope.logExceptionInfos[i].selected = $scope.selectedAll;
            }
        }

        $scope.searchException();




    $scope.delete = function (logExceptionInfo) {
        let result=confirm("确定删除信息")
        if (!result) return;
        $http({
            url: 'http://127.0.0.1:8080/admin/log',
            method: 'delete',
            params: {
                id:logExceptionInfo.id
            }
        }).then(resp => {
            if (resp.data > 0) {
                layer.alert("删除成功")
                $scope.searchException();
            }
            else {
                layer.alert("删除失败")
            }

        })
    }



})
