app.controller("baseController",function ($scope) {
    //重新加载列表 数据,刷新列表
    $scope.reloadList=function(){
        $scope.search($scope.paginationConf.currentPage,$scope.paginationConf.itemsPerPage);
    };
    //分页控件配置  currentPage：当前页，totalItems总记录数，itemsPerPage每页记录数 perPageOptions分页选项
    $scope.paginationConf = {
        currentPage: 1,
        totalItems: 10,
        itemsPerPage: 10,
        perPageOptions: [10, 20, 30, 40, 50],
        onChange: function(){
            $scope.reloadList();//刷新  ！！！ 加载分页对象的时候，调用该方法
        }
    };
    $scope.selectIds = [];
    /*给集合添加元素*/
    $scope.updateselection = function ($event,id) {
        /*如果被选中*/
        if($event.target.checked){
            $scope.selectIds.push(id);
        }else {
            var index = $scope.selectIds.indexOf(id);  /*获取索引*/
            $scope.selectIds.splice(index,1);/* 从集合中删除某个索引的元素*/
        }
    };

    /*jsonToString json格式转字符串*/
    $scope.jsonToString = function (jsonString,key) {
        var json = JSON.parse(jsonString);
        var value = "";
        for (var i = 0; i < json.length; i++) {
            if(i>0){
                value += "," + json[i][key]; /*这里只取json数据的key值*/
            }else {
                value += json[i][key];
            }
        }
        return value;
    }
});