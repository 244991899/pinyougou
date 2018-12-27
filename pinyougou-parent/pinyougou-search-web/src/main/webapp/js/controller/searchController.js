app.controller('searchController',function($scope,searchService,$location){
    $scope.searchMap={'keywords':'','category':'','brand':'','spec':{},'price':'','pageNo':1,'pageSize':40,'sortField':'','sort':''};//搜索对象
    //加载查询字符串
    $scope.loadkeywords=function(){
        $scope.searchMap.keywords= $location.search()['keywords'];
        $scope.search();
    }
    //搜索
    $scope.search=function(){
        searchService.search( $scope.searchMap).success(
            function(response){
                $scope.searchMap.pageNo= parseInt($scope.searchMap.pageNo); //转化为int类型
                $scope.resultMap=response;//搜索返回的结果
                $scope.buildPageLabel();
            }
        );
    }

    //设置排序规则
    $scope.sortSearch = function(sortField,sort){
        $scope.searchMap.sortField = sortField;
        $scope.searchMap.sort = sort;
        $scope.search();
    }

    $scope.buildPageLabel = function(){
        //构建分页栏
        $scope.pageLabel = [];
        var maxPageNo = $scope.resultMap.totalPages; //最大页码
        var firstPage = 1 ; // 起始页码
        var lastPage = maxPageNo; //截至页
        $scope.firstDot = false;
        $scope.lastDot = false;
        if(maxPageNo > 5){  // 如果最大页码大于5
            firstPage = $scope.searchMap.pageNo-2; //初始页=当前页码-2
            lastPage = $scope.searchMap.pageNo+2;  //截至页=当前页码+2
            $scope.firstDot = true;
            $scope.lastDot = true;
            if(firstPage < 1){   //如果起始页小于1 从新赋值
                firstPage = 1 ;
                lastPage = firstPage + 4;
                $scope.firstDot = false;
            }
            if(lastPage > maxPageNo){  //如果截至页大于最大页 从新赋值
                firstPage = maxPageNo - 4;
                lastPage = maxPageNo;
                $scope.lastDot = false;
            }
        }
        //产生页码标签
        for (var i = firstPage;i<=lastPage;i++){
            $scope.pageLabel.push(i);
        }
    }
    //判断关键字是不是品牌
    $scope.keywordsIsBrand = function(){
        for(var i=0;i<$scope.resultMap.brandList.length;i++){
           if($scope.searchMap.keywords.indexOf($scope.resultMap.brandList[i])>=0){
               return true;
           }
        }
        return false;
    }
    //判断当前页为第一页
    $scope.isTopPage=function(){
        if($scope.searchMap.pageNo==1){
            return true;
        }else{
            return false;
        }
    }
    //判断当前页是否未最后一页
    $scope.isEndPage=function(){
        if($scope.searchMap.pageNo==$scope.resultMap.totalPages){
            return true;
        }else{
            return false;
        }
    }
    //根据页码查询
    $scope.queryByPage=function(pageNo){
        //页码验证
        if(pageNo<1 || pageNo>$scope.resultMap.totalPages){
            return;
        }
        $scope.searchMap.pageNo=pageNo;
        $scope.search();
    }
    //给搜索对象增加值
    $scope.addSearchItem=function(key,value){
        if(key=='category' || key=='brand' ||key=='price'){//如果点击的是分类或者是品牌
            $scope.searchMap[key]=value;
        }else{ //如果是规格
            $scope.searchMap.spec[key]=value;
        }
        $scope.search();
    }
    //给搜索对象移除值
    //移除复合搜索条件
    $scope.removeSearchItem=function(key){
        if(key=="category" || key=="brand"||key=='price'){//如果是分类或品牌
            $scope.searchMap[key]="";
        }else{//否则是规格
            delete $scope.searchMap.spec[key];//移除此属性
        }
        $scope.search();
    }
});