<template>
    <a-layout-content>
        <a-button type="primary" class="mainButton" @click="ToNutrKind">返回营养库分类</a-button>
         <a-button type="primary" class="mainButton" @click="showModal(-1)">添加列表</a-button>
     <table>
         <tr>
            <td>序号</td>
            <td>标题</td>
            <td>概要</td>
            <td>封面图片</td>
            <td>操作</td>
         </tr>
          <tr v-for="(item, index) in NutrList" :key="index">
            <td>{{(page-1)*8+1+index}}</td>
            <td>{{item.name}}</td>
            <td class="td">{{item.brief}}</td>
             <td class="img img-show-mask" >
                 <img :src='qiniuCdnUrl+item.url+"?v="+urlV'  @click="clickImg($event)"/>
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
             </td>
         </tr>
     </table>
     <div>
         <big-img v-if="showImg" @clickit="viewImg" :imgSrc="imgSrc"></big-img>
     </div>
      <NutrListModel
        v-if="visible"
        :visible="visible"
        @transCancel='handleCancel'
        @transOk='handleOk'
        :aidx='idx'
        :categoryId='id'
      ></NutrListModel>
    </a-layout-content>
</template>

<script>
import NutrListModel from './NutrListModel'
import UploadQiniu from './../../components/UploadQiniu'
import BigImg from './../../components/BigImg'
export default {
    components:{
        NutrListModel,
        UploadQiniu,
        BigImg
    },
    data () {
        return {
            page:1,
            visible: false,
            idx:-1,//表示是新增,
            NutrList:'',
            id:"",
            urlV:""+new Date().getTime(),
            ikey:'',
            showImg: false,
            imgSrc: '',
            foodId:''
        }
    },
      created() {
           let id =this.$route.query.id;
           this.id=id;
            this.getNutrList(id)
      },
      methods: {
          getNutrList(id){
            this.$axios({
              url:"/admin/food/queryNutritionList",
              params:{
                  categoryId:id,
                  page:1,
                  limit:100
              }
            }).then(res=>{
                console.log(res)
                this.NutrList=res.data.data
            })
          },
         showModal(id) {
            this.idx=id;
            this.visible = true;
        },
        handleCancel(obj){
            this.visible =obj.visible
            if(obj.form){
                this.getNutrList(this.id)
            }
        },
        handleOk(obj){
            this.visible=obj.visible
        },
        //这是在做列表删除的操作
        confirm(id){
            this.$axios({
                url:'/admin/food/deleteNutritionInfo',
                params:{
                    id
                }
            }).then(res => {
                if(res.data.code==0){
                    this.$message.success('删除成功');
                   this.getNutrList(this.id)
                }
            })
        },
        handleKey(ikey,foodId){
            if(foodId == -1){
                this.ikey=ikey
            }else{
                this.ikey=ikey+'/video'
            }
            this.foodId=foodId
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
            console.log(this.imgSrc)
        },
        viewImg() {
            this.showImg = false
        },
        //返回到营养库分类
        ToNutrKind(){
            this.$router.push({
                path:'/nutritionKind'
            })
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
.td{
    max-width: 300px;
    text-align: left;
    padding-left: 10px;
}
.td >>> p{
    margin-bottom: 0px !important;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
    display: none;
}

td >>> p:nth-of-type(1){
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
    display: block;
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