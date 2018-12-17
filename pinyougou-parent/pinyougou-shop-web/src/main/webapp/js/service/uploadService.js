app.service("uploadService",function($http){
    this.uploadFile=function(){
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
/*method : 指定方法
url 路径   ，
data  formdata上传文件的二进制封装
 headers: {'Content-Type':undefined}, 不使用默认的json
 transformRequest: angular.identity  二进制序列化，formdata
*/