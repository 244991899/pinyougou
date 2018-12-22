app.service("uploadService",function($http){
    this.uploadFile=function(){
        /*支持h5浏览器特有的对象，用于文件上传*/
        var formData=new FormData();
        formData.append("file",file.files[0]);
        return $http({
            method:'POST',
            url:"../upload.do",
            data: formData,
            headers: {'Content-Type':undefined},
            transformRequest: angular.identity
        });
    }
});
/*  method : 指定方法
    url 路径   ，
    data  formdata上传文件的二进制封装
    headers: {'Content-Type':undefined}, 不使用默认的json
    transformRequest: angular.identity  二进制序列化，formdata
    append 中两个参数 ： "file",  决定后端接受参数的名字
    file.files[0]   ： 表示html中第一个为类型（type）为file的 的文件上传属性
*/