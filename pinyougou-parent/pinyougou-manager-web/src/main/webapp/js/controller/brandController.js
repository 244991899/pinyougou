/*创建控制层*/
app.controller("brandController",function ($scope,$http,$controller,brandService) {
    $controller("baseController",{$scope:$scope});
    $scope.findAll = function(){
        brandService.findAll().success(function (response) {
            $scope.list = response;
        });
    };

    //分页
    $scope.findPage = function (pageNum, pageSize) {
        brandService.findPage(pageNum, pageSize).success(function (response) {
            $scope.paginationConf.totalItems = response.total;
            $scope.list = response.rows;
        })
    };
    //添加
    $scope.save = function(){
        var object = null;
        if($scope.entity.id!=null){
            object = brandService.update($scope.entity)
        }else {
            object = brandService.add($scope.entity)
        }
        object.success(function (response) {
            if(response.success){
                $scope.reloadList();
            }else {
                alert(response.message);
            }
        })
    };
    //查找一个实体回显
    $scope.findOne = function (id) {
        brandService.findOne(id).success(function (response) {
            $scope.entity = response;
        });
    };

    /*删除*/
    $scope.del = function () {
        brandService.del($scope.selectIds).success(function (response) {
            if(response.success){
                $scope.reloadList();
            }else {
                alert(response.message);
            }
        })
    };
    $scope.searchEntity = {}; // 初始化加载的时候，给它赋值一个空的对象
    $scope.search = function (pageNum, pageSize) {
        brandService.search(pageNum, pageSize,$scope.searchEntity).success(function (response) {
            $scope.paginationConf.totalItems = response.total;
            $scope.list = response.rows;
        })
    };
});