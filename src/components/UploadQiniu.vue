<template>
    <input type="file" @change="upImage($event)" title />
</template>

<script>
import * as qiniu from "qiniu-js"
export default {
    props:['ikey','foodId'],
    data() {
        return {
            uptoken:'',
        }
    },
    created() {
     
    },
    mounted() {
          
    },
    methods: {
         upImage(e){
            //这是在每次请求之前都发起生成一个token
            if(this.ikey){
                 this.$axios({
                    url:"/admin/food/uptoken",
                    params:{
                        key:this.ikey
                    }
                }).then(res=>{
                    this.uptoken=res.data.data
                    this.qiniuFiles(e.target.files[0])
                })
            }
            
        },
          qiniuFiles(files){
            let file = files; 
            let key = this.ikey;
            let token=this.uptoken;
            var types = null;
            console.log(this.foodId)
            if(this.foodId==-1){
                 types = ["image/png", "image/jpeg", "image/gif","image/jpg",'image/bmp','image/ipeg']
            }else{
                 types = ["video/mp4"]
            }
            let config = {
                useCdnDomain: true, // 表示是否为CDN加速，true加速；false不加速
                region: qiniu.region.z0, // 当前地区， 华东区域
                domain: "http://img.mp.csdn.net.com" // 七牛云注册的空间域名
            };
            let putExtra = {
                fname: "", // 文件原文件名
                params: {}, // 放置自定义变量
                mimeType: types // 上传文件限制，null为不限制；限制类型放在数组中['image/png',"image/gif"]
            };
              var self = this;
             var observer = {
                next(){
                    
                },
                error(res){
                    if(res){
                        self.$message.info('请上传指定类型的文件')
                    }
                }, 
                complete(res){
                      if(res){
                          if(self.foodId==-1){
                            //   let url = new Date().getTime();
                              self.$emit("handleUrl")
                              self.$message.success('图片上传成功')
                              
                          }
                        else if(self.foodId){
                            self.$axios({
                                url:'/admin/food/updateVideoUrl',
                                params:{
                                    foodId:self.foodId,
                                    videoUrl:self.ikey
                                }
                            }).then(res=>{
                                if(res){
                                    self.$message.success('视频上传成功')
                                }  
                            })
                        }
                    }
                  
                }
            }
            let observable = qiniu.upload(file, key, token, putExtra, config);  // this.Token 为上面向后台请求token 保存字段
            observable.subscribe(observer)
        },
    },
}
</script>

<style scoped>
.upImage {
  position: relative;
}
.upImage input {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  opacity: 0;
}
</style>