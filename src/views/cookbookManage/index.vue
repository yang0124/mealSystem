<template>
    <a-layout-content>
         <a-button type="primary" class="mainButton" @click="showModal(-1)">添加食谱</a-button>
     <table>
         <tr>
            <td>序号</td>
            <td>名称</td>
            <td>季节</td>
            <td>食谱图片</td>
            <td>操作</td>
         </tr>
          <tr v-for="(item, index) in cookList" :key="index">
            <td>{{(page-1)*8+1+index}}</td>
            <td>{{item.name}}</td>
            <td>{{item.season_id}}</td>
            <td class="img">
                 <img :src='qiniuCdnUrl+item.url+"?v="+urlV'  :alt='item.name' @click="clickImg($event)"/>
            </td>
             <td> 
                  <a-button type="primary" size='small' class="upImage" @click="handleKey(item.url,-1)">
                     <UploadQiniu 
                        :ikey="ikey"
                        :foodId="foodId"
                        @handleUrl='handleUrl'
                    >
                    </UploadQiniu>
                     图片上传
                </a-button> 
                 <a-button type="primary" size='small' @click='showModal(item.id)'>编辑</a-button> 
                 <a-popconfirm title="您确定要删除此条内容吗？" okText="确定" cancelText="取消" @confirm="confirm(item.id)">
                    <a-button type="danger" size='small'>删除</a-button>
                </a-popconfirm>
                <a-button type="primary" size='small' @click='ToCookDetail(item.id)'>查看详情</a-button> 
             </td>
         </tr>
     </table>
      <div>
         <big-img v-if="showImg" @clickit="viewImg" :imgSrc="imgSrc"></big-img>
     </div>
      <CooKBookModel
        v-if="visible"
        :visible="visible"
        @transCancel='handleCancel'
        @transOk='handleOk'
        :aidx='idx'
      ></CooKBookModel>
    </a-layout-content>

</template>

<script>
import CooKBookModel from './CookBookModel'
import UploadQiniu from './../../components/UploadQiniu'
import BigImg from './../../components/BigImg'
export default {
    components:{
        CooKBookModel,
        UploadQiniu,
        BigImg
    },
    data () {
        return {
            page:1,
            cookList:'',
            visible: false,
            idx:-1,//表示是新增,
            ikey:'',
            urlV:""+new Date().getTime(),
            showImg: false,
            imgSrc: "",
            foodId:''
        }
    },
      created() {
          this.getCookList()
      },
      methods: {
          getCookList(){
            this.$axios({
              url:"/admin/food/queryCookList",
              params:{
                  page:this.page,
                  limit:8
              }
            }).then(res=>{
                this.cookList=res.data.data
            })
          },
         showModal(id) {
            this.idx=id;
            this.visible = true;
        },
        handleCancel(obj){
            this.visible =obj.visible
            if(obj.form){
                this.getCookList()
            }
        },
        handleOk(obj){
            this.visible=obj.visible
        },
        //这是在做列表删除的操作
        confirm(id){
            this.$axios({
                url:'/admin/food/deleteCook',
                params:{
                    id
                }
            }).then(res => {
                if(res.data.code==0){
                    this.$message.success('删除成功');
                   this.getCookList()
                }
            })
        },
        // 找到点击的唯一key值
       handleKey(ikey,foodId){
            if(foodId == -1){
                this.ikey=ikey
            }else{
                this.ikey=ikey+'/video'
            }
            this.foodId=foodId
        },
        //跳转到详情页
        ToCookDetail(cookId){
            this.$router.push({
                path:`/cookbookDetail?id=${cookId}`
            })
        },
         handleUrl(){
            let urlV=new Date().getTime();
            this.urlV=urlV
        },
          clickImg(e) {
            this.showImg = true
            // 获取当前图片地址
            console.log(1)
            this.imgSrc = e.currentTarget.src
        },
        viewImg() {
            this.showImg = false
        }
      },
}
</script>

<style scoped>
.ant-layout-content{
      padding: 0px 30px !important;
      text-align: right;
  }
.ant-layout-content .mainButton{
    margin-top: 30px;
}
table{
    width: 100%;
    margin-top: 10px;
    text-align: center;
}
tr{
    border: 1px solid #ccc;
    line-height: 30px;
}
td{
    border-right: 1px solid #ccc;
}
.ant-pagination{
    margin-top: 10px;
}
.ant-btn{
    margin: 0 3px;
}
.td >>> p{
    margin-bottom: 0px !important;
}
tr td:last-of-type{
    width: 280px;
}
.upImage{
    position: relative;
}
.upImage input{
    position: absolute;
    width: 100%;
    height: 100%;
    top:0;
    left: 0;
    opacity: 0;
}
.img img{
    width: 30px;
    height: 30px;
}
</style>