app.controller('indexController',function ($scope,loginService) {
    /**
     * 获取登陆名字
     */
    $scope.showName = function () {
       loginService.showName().success(function (response) {
           $scope.loginName = response.loginName;
       })
   }
});