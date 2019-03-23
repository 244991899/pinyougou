app.controller("payController",function ($scope, payService,$location) {
    //本地生成二维码
    $scope.createNative = function () {
        payService.createNative().success(function (response) {
            $scope.money = (response.total_fee/100).toFixed(2);//金额
            $scope.out_trade_no = response.out_trade_no;//订单号
            //二维码
            var qr = new QRious({
                element:document.getElementById('qrious'),
                size:250,  //尺寸像素
                level:'H', //校正级别
                value: response.code_url //二维码的值
            });
            queryPayStatus(response.out_trade_no);//查询订单状态
        })
    }
    //查询订单状态
    $scope.queryPayStatus = function (out_trade_no) {
        payService.queryPayStatus(out_trade_no).success(function (response) {
            if(response.success){
                location.href= "paysuccess.html#?money="+$scope.money;
            }else {
                if(response.message=="二维码超时"){
                    $scope.createNative();//重新生成二维码
                }else {
                    location.href = "payfail.html";
                }
            }
        })
    }
    //获取金额
    $scope.getMoney = function () {
        return $location.search()['money']; //location内置方法 ，查询url的 ‘money’参数的值
    }
})