var app = angular.module("pinyougou",[]); //引入js模块
/*引入服务，*/
app.filter('trustHtml',['$sce',function ($sec) {
    return function (data) { //传入参数时被过滤恶的内容
        return $sec.trustAsHtml(data); //返回的是被过滤的内容（信任的html）
    }
}]);