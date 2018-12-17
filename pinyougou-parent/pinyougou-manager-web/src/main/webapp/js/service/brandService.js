/*创建服务层代码*/
app.service("brandService",function ($http) {
    this.findAll = function () {
        return $http.get("../brand/findAll.do");
    };
    this.findPage = function (pageNum, pageSize) {
        return $http.get('../brand/pageFind.do?pageNum='+pageNum+'&pageSize='+pageSize);
    };
    this.add = function (entity) {
        return $http.post('../brand/add.do',entity)
    };
    this.update = function (entity) {
        return $http.post('../brand/update.do',entity)
    };
    this.findOne = function (id) {
        return $http.post('../brand/findOne.do?id='+id);
    };
    this.del = function (selectIds) {
        return $http.get("../brand/delete.do?ids="+selectIds);
    };
    this.search = function (pageNum, pageSize,searchEntity) {
        return $http.post('../brand/search.do?pageNum='+pageNum+'&pageSize='+pageSize,searchEntity);
    };
    this.selectOptionList = function () {
        return $http.get('../brand/selectOptionList.do');
    }
});