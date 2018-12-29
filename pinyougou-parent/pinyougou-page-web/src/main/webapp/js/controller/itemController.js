//商品详细页（控制层）
app.controller('itemController',function($scope){
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
	$scope.specification[key] = value;
}
//判断某规格是否被选中
$scope.isSelected = function(key,value){
	if($scope.specification[key] == value){
		return true;
	}else{
		return false;
	}
}
$scope.sku = {}; //当前选择的SKU
//加载sku
$scope.loadSku = function(){
	$scope.sku = skuList[0];
	$scope.specificationItems = JSON.parce(JSON.stringify($scope.sku.spec)); //深克隆
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


});