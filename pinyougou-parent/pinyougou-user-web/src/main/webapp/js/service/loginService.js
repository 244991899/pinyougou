app.service("loginService",function ($http) {
    //读取数据
    this.showName = function () {
        return $http.get('../login/name.do');
    }
});