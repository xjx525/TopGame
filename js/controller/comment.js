let app = angular.module("commentApp", ['pagination','ng-layer']);
app.controller("commentCtrl", function ($scope, $http) {
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
                url: 'http://127.0.0.1:3001/admin/comment',
                method: 'get',
                params: {
                    name:$scope.con.name,
                    currentPage: $scope.pageInfo.currentPage,
                    displayCount: $scope.pageInfo.itemsPerPage
                }
            }).then(resp => {
                $scope.comments = resp.data.list;
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








        $scope.choose = function (comment) {
            if (comment.selected) {
                $scope.selectedIds.push(comment.id);
            } else {
                for (let i in $scope.selectedIds) {
                    if ($scope.selectedIds[i] == comment.id) {
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
            for (let i in $scope.comments) {
                $scope.comments[i].selected = $scope.selectedAll;
            }
        }



    $scope.delete = function (comment) {
        let result=confirm("确定删除信息")
        if (!result) return;
        $http({
            url: 'http://127.0.0.1:8080/admin/comment',
            method: 'delete',
            params: {
                id:comment.id
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




    $scope.deleteAll = function () {
        if($scope.selectedIds.length==0&&$scope.selectedAll==false){
            layer.msg('未选中内容')
            return;
        }
        let result=confirm("确定删除所选信息")
        if (!result) return;
        $http({
            url: 'http://127.0.0.1:3001/admin/batchDeleteComment',
            method: 'delete',
            params: {
                selectedAll: $scope.selectedAll,
                selectedIds: JSON.stringify($scope.selectedIds),
            }
        }).then(resp => {
            if (resp.data > 0) {
                layer.alert("删除成功")
                $scope.search();
                $scope.selectedIds = [];
                $scope.selectedAll = false;
            }
            else {
                layer.alert("删除失败")
                $scope.search();
                $scope.selectedIds = [];
                $scope.selectedAll = false;
            }

        })
    }

})
