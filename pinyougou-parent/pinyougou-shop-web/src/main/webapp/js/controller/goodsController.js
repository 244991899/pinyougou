 //控制层 
app.controller('goodsController' ,function($scope,$controller,uploadService,goodsService,itemCatService,typeTemplateService,$location){
	
	$controller('baseController',{$scope:$scope});//继承
	
    //读取列表数据绑定到表单中  
	$scope.findAll=function(){
		goodsService.findAll().success(
			function(response){
				$scope.list=response;
			}			
		);
	}    
	
	//分页
	$scope.findPage=function(page,rows){			
		goodsService.findPage(page,rows).success(
			function(response){
				$scope.list=response.rows;	
				$scope.paginationConf.totalItems=response.total;//更新总记录数
			}			
		);
	}
	
	//查询实体 
	$scope.findOne=function(){
	    var id = $location.search()['id'];
	    if(id==null){
	        return;
        }
		goodsService.findOne(id).success(
			function(response){
				$scope.entity= response;
                editor.html($scope.entity.goodsDesc.introduction);//获取文本中的值
                //显示图片列表
                $scope.entity.goodsDesc.itemImages=
                    JSON.parse($scope.entity.goodsDesc.itemImages);
                //显示扩展属性
                $scope.entity.goodsDesc.customAttributeItems=
                    JSON.parse($scope.entity.goodsDesc.customAttributeItems);
                //规格
                $scope.entity.goodsDesc.specificationItems=JSON.parse($scope.entity.goodsDesc.specificationItems);
                //SKU 列表规格列转换
                for( var i=0;i<$scope.entity.itemList.length;i++ ){
                    $scope.entity.itemList[i].spec =
                        JSON.parse( $scope.entity.itemList[i].spec);
                }
			}
		);				
	}
	
	//保存 
	$scope.save=function(){				
		var serviceObject;//服务层对象  				
		if($scope.entity.goods.id!=null){//如果有ID
            $scope.entity.goodsDesc.introduction=editor.html();//获取富文本类容
			serviceObject=goodsService.update( $scope.entity ).success(function (response) {
                if(response.success){
                    alert("保存成功");
                    location.href = "goods.html";
                }else {
                    alert(response.message);
                }
            }); //修改
		}else{
			serviceObject=goodsService.add( $scope.entity  ).success(function (response) {
                if(response.success){
                    alert("保存成功");
                    $scope.entity = {};
                    editor.html('');//清空富文本编辑器
                }else {
                    alert(response.message);
                }
            });//增加
		}				
		serviceObject.success(
			function(response){
				if(response.success){
					//重新查询 
		        	$scope.reloadList();//重新加载
				}else{
					alert(response.message);
				}
			}		
		);				
	}
	
	 
	//批量删除 
	$scope.dele=function(){			
		//获取选中的复选框			
		goodsService.dele( $scope.selectIds ).success(
			function(response){
				if(response.success){
					$scope.reloadList();//刷新列表
					$scope.selectIds=[];
				}						
			}		
		);				
	}
	
	$scope.searchEntity={};//定义搜索对象 
	
	//搜索
	$scope.search=function(page,rows){			
		goodsService.search(page,rows,$scope.searchEntity).success(
			function(response){
				$scope.list=response.rows;	
				$scope.paginationConf.totalItems=response.total;//更新总记录数
			}			
		);
	}

	$scope.add = function () {
        $scope.entity.goodsDesc.introduction=editor.html();//获取富文本类容
		goodsService.add($scope.entity).success(function (response) {
			if(response.success){
				alert("保存成功");
                $scope.entity = {};
                editor.html('');//清空富文本编辑器
			}else {
				alert(response.message);
			}
        })
    }
	/*上传文件*/
    $scope.uploadFile=function(){
        uploadService.uploadFile().success(function(response) {
            if(response.success){//如果上传成功，取出 url
                $scope.image_entity.url=response.message;//设置文件地址
            }else{
                alert(response.message);
            }
        }).error(function() {
        		alert("上传发生错误");
        });
    }
    $scope.entity={goods:{},goodsDesc:{itemImages:[]}};//定义页面实体结构
	//添加图片列表
    $scope.add_image_entity=function(){
        $scope.entity.goodsDesc.itemImages.push($scope.image_entity);
    }
    $scope.remove_image_entity=function(index){
        $scope.entity.goodsDesc.itemImages.splice(index,1);
    }
    $scope.selectItemCatList = function () {
		itemCatService.findItemCatByParentId(0).success(function (response) {
			$scope.itemCat1List = response;
        })
    }

    //二级列表
    $scope.$watch('entity.goods.category1Id', function(newValue, oldValue) {
        itemCatService.findItemCatByParentId(newValue).success(function (response) {
            $scope.itemCat2List = response;
        })
    })
	//三级列表
    $scope.$watch('entity.goods.category2Id',function (newValue,oldValue) {
        itemCatService.findItemCatByParentId(newValue).success(function (response) {
            $scope.itemCat3List = response;
        })
    })
	//读取模板ID
    $scope.$watch('entity.goods.category3Id', function(newValue, oldValue) {
        itemCatService.findOne(newValue).success(
            function(response){
                $scope.entity.goods.typeTemplateId=response.typeId; //更新模板 ID
            }
        );
    });
    //检测模板ID
    $scope.$watch('entity.goods.typeTemplateId', function(newValue, oldValue) {
        typeTemplateService.findOne(newValue).success(
            function(response){
                $scope.typeTemplate=response;//首先获取类型模板
                $scope.typeTemplate.brandIds=
                    JSON.parse( $scope.typeTemplate.brandIds);//品牌列表
                //如果没有 ID，则加载模板中的扩展数据
                if($location.search()['id']==null){
                    $scope.entity.goodsDesc.customAttributeItems =
                        JSON.parse($scope.typeTemplate.customAttributeItems);//扩展属性
                }
            }
        );
        //查询规格列表
        typeTemplateService.findSpecList(newValue).success(
            function(response){
                $scope.specList=response;
            }
        );
    });

    $scope.entity={ goodsDesc:{itemImages:[],specificationItems:[]} };
    $scope.updateSpecAttribute=function($event,name,value){
        var object= $scope.searchObjectByKey(
            $scope.entity.goodsDesc.specificationItems ,'attributeName', name);
        if(object!=null){
            if($event.target.checked ){
                object.attributeValue.push(value);
            }else{//取消勾选
                object.attributeValue.splice( object.attributeValue.indexOf(value ) ,1);//移除选项
				//如果选项都取消了，将此条记录移除
                if(object.attributeValue.length==0){
                    $scope.entity.goodsDesc.specificationItems.splice(
                        $scope.entity.goodsDesc.specificationItems.indexOf(object),1);
                }
            }
        }else{
            $scope.entity.goodsDesc.specificationItems.push(
                {"attributeName":name,"attributeValue":[value]});
        }
    }

    //创建 SKU 列表
    $scope.createItemList=function(){
        $scope.entity.itemList=[{spec:{},price:0,num:99999,status:'0',isDefault:'0' } ];//初始
        var items= $scope.entity.goodsDesc.specificationItems;
        for(var i=0;i< items.length;i++){
            $scope.entity.itemList =addColumn( $scope.entity.itemList,items[i].attributeName,items[i].attributeValue );
        }
    }
//添加列值
    addColumn=function(list,columnName,conlumnValues){
        var newList=[];//新的集合
        for(var i=0;i<list.length;i++){
            var oldRow= list[i];
            for(var j=0;j<conlumnValues.length;j++){
                var newRow= JSON.parse( JSON.stringify( oldRow ) );//深克隆
                newRow.spec[columnName]=conlumnValues[j];
                newList.push(newRow);
            }
        }
        return newList;
    }
    $scope.status=['未审核','已审核','审核未通过','关闭'];
    $scope.categoryList = []; /*定义集合分类级别列表*/
    $scope.findCategory = function () {
        itemCatService.findAll().success(function (response) {
            for (var i = 0; i < response.length; i++) {
                $scope.categoryList[response[i].id] = response[i].name;/*把获取到的值全部赋值给集合中的对应索引*/
            }
        })
    }
    //检测是否被选中
    $scope.checkAttributeValue=function(specName,optionName){
        var items= $scope.entity.goodsDesc.specificationItems;
        var object= $scope.searchObjectByKey(items,'attributeName',specName);
        if(object==null){
            return false;
        }else{
            if(object.attributeValue.indexOf(optionName)>=0){
                return true;
            }else{
                return false;
            }
        }
    }

});	
