//商品详细页（控制层）
app.controller('itemController',function($scope,$http){
$scope.specificationItems = {}; //用户选择规格的对象
//数量操作
$scope.addNum=function(x){
	$scope.num=$scope.num+x;
	if($scope.num<1){
		$scope.num=1;
		}
	}
//用户选择规格，同一个规格的key，只能出现一次，所以不会出现重复
$scope.selectSpecification = function(key,value){
	$scope.specificationItems[key] = value;
	searchSku();//读取/查询sku
}
//判断某规格是否被选中
$scope.isSelected = function(key,value){
	if($scope.specificationItems[key] == value){
		return true;
	}else{
		return false;
	}
}
$scope.sku = {}; //当前选择的SKU
//加载sku
$scope.loadSku = function(){
	$scope.sku = skuList[0];
	$scope.specificationItems = JSON.parse(JSON.stringify($scope.sku.spec)); //深克隆
}

//匹配两个对象是否相等
  matchObject = function(map1,map2){
	  for(var k in map1){
		  if(map1[k]!=map2[k]){
			  return false;
		  }
	  }
	  for(var k in map2){
		  if(map2[k]!=map1[k]){
			   return false;
		  }
	  }
	  return true;
  }

searchSku = function(){
	//根据规格选择
	for(var i= 0;i<skuList.length;i++){
		//获取两个参数
		if(matchObject(skuList[i],$scope.specificationItems)){
			$scope.sku = skuList[i];
			return;
		}
	}
	//如果没有找到数据
	$scope.sku = {id:0,title:'-----',price:0};
}


//添加商品到购物车
$scope.addToCart=function(){
		alert(1);
        $http.get('http://localhost:9107/cart/addGoodsToCartList.do?itemId='
            + $scope.sku.id +'&num='+$scope.num).success(
            function(response){
                if(response.success){
                    location.href='http://localhost:9107/cart.html';//跳转到购物车页面
                }else{
                    alert(response.message);
                }
            }
        );
    }
});