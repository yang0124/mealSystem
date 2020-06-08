<template>
    <a-layout-content>
         <a-button type="primary" class="button" @click="ToFoodManage">返回食材列表</a-button>
         <a-button type="primary" class="mainButton" @click="showModal(-1)">添加关联食材</a-button>
     <table>
         <tr>
            <td>序号</td>
            <td>名称</td>
            <td>图片展示</td>
            <td>操作</td>
         </tr>
          <tr v-for="(item, index) in relativeList" :key="index">
            <td>{{(page-1)*8+1+index}}</td>
            <td>{{item.name}}</td>
            <td class="img img-show-mask">
                <img :src='qiniuCdnUrl+item.url'  :alt='item.name'  @click="clickImg($event)"/>
            </td>
             <td> 
                 <a-popconfirm title="您确定要删除此条内容吗？" okText="确定" cancelText="取消" @confirm="confirm(item.id)">
                    <a-button type="danger" size='small'>删除</a-button>
                </a-popconfirm>
             </td>
         </tr>
     </table>
          <!-- 这是图片预览的模块 -->
     <div>
         <big-img v-if="showImg" @clickit="viewImg" :imgSrc="imgSrc"></big-img>
     </div>
      <RelativeModel
        v-if="visible"
        :visible="visible"
        @transCancel='handleCancel'
        @transOk='handleOk'
        :aidx='idx'
        :foodId='foodId'
      ></RelativeModel>
    </a-layout-content>
</template>

<script>
import RelativeModel from './RelativeModel'
import BigImg from './../../components/BigImg'
export default {
    components:{
        RelativeModel,
        BigImg
    },
    data () {
        return {
            page:1,
            relativeList:'',
            visible: false,
            idx:-1,//表示是新增,
            foodId:'',
            showImg: false,
            imgSrc: '',
        }
    },
      created() {
          let foodId =this.$route.query.id;
          this.foodId=foodId;
          this.getRelativeList(foodId)
      },
      methods: {
          getRelativeList(foodId){
            this.$axios({
              url:"/admin/food/queryRelativeFoodList",
              params:{
                  foodId,
                  page:1,
                  limit:100
              }
            }).then(res=>{
                this.relativeList=res.data.data
            })
          },
         showModal(id) {
            this.idx=id;
            this.visible = true;
        },
        handleCancel(obj){
            this.visible =obj.visible
            if(obj.form){
                this.getRelativeList(this.foodId)
            }
        },
        handleOk(obj){
            this.visible=obj.visible
        },
        //这是在做列表删除的操作
        confirm(id){
            this.$axios({
                url:'/admin/food/deleteRelativeFoodInfo',
                params:{
                    id
                }
            }).then(res => {
                if(res.data.code==0){
                    this.$message.success('删除成功');
                   this.getRelativeList(this.foodId)
                }
            })
        },
          clickImg(e) {
            this.showImg = true
            // 获取当前图片地址
            this.imgSrc = e.currentTarget.src
        },
        viewImg() {
            this.showImg = false
        },
        //点击返回到菜品制作页面
        ToFoodManage(){
            this.$router.push({
                path:'/foodManage'
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
.button{
      text-align: left;
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