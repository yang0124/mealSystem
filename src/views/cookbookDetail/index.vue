<template>
    <a-layout-content>
        <div class="buttonArea">
            <a-button type="primary" class="button" @click="ToCookBookManage">返回食谱管理</a-button>
            <a-button type="primary" class="mainButton" @click="showModal(-1)">添加</a-button>
        </div>
     

    
    <a-menu v-model="current" mode="horizontal" >
        <a-menu-item v-for="(item) in weekList" :key="item.weekId" @click="getFoodList(item.weekId)">{{item.weekName}}  </a-menu-item>
    </a-menu>
     <table>
         <tr>
            <td>序号</td>
            <td>名称</td>
            <td>星期</td>
            <td>分类</td>
            <td>操作</td>
         </tr>
          <tr v-for="(item, index) in FoodList" :key="index">
            <td>{{(page-1)*8+1+index}}</td>
            <td>{{item.name}}</td>
            <td>{{item.weekName}}</td>
            <td>
               {{item.categoryName}}
            </td>
             <td> 
                 <a-button type="primary" size='small' @click='showModal(item.id)'>编辑</a-button> 
                 <a-popconfirm title="您确定要删除此条内容吗？" okText="确定" cancelText="取消" @confirm="confirm(item.id)">
                    <a-button type="danger" size='small'>删除</a-button>
                </a-popconfirm>
             </td>
         </tr>
     </table>
      <CookbookDetailModel
        v-if="visible"
        :visible="visible"
        @transCancel='handleCancel'
        @transOk='handleOk'
        :aidx='idx'
        :cookId='cookId'
      ></CookbookDetailModel>
    </a-layout-content>
</template>

<script>
import CookbookDetailModel from './CookbookDetailModel'
export default {
    components:{
        CookbookDetailModel
    },
    data () {
        return {
            page:1,
            FoodList:'',
            visible: false,
            idx:-1,//表示是新增,
            cookId:'',
            weekList:"",
            current:[1],
            weekId:1,
        }
    },
      created() {
          console.log('这是详情页的东西')
          let id =this.$route.query.id;
          this.cookId=id;
          this.getFoodList(this.weekId)
          this.getWeekList()
      },
      methods: {
          //这是得到星期列表
          getWeekList(){
              this.$axios({
                  url:'/admin/food/queryWeekList'
              }).then(res => {
                  if(res.data.code==0){
                       this.weekList =res.data.data
                  }
              })
          },
          //得到菜品列表
          getFoodList(week){
              this.weekId=week
            this.$axios({
              url:"/admin/food/queryAdminFoodList",
              params:{
                  cookId:this.cookId,
                  weekId:this.weekId
              }
            }).then(res=>{
                this.FoodList=res.data.data
            })
          },
         showModal(id) {
            this.idx=id;
            this.visible = true;
        },
        handleCancel(obj){
            this.visible =obj.visible
            if(obj.form){
                this.getFoodList(this.weekId)
            }
        },
        handleOk(obj){
            this.visible=obj.visible
        },
        //这是在做列表删除的操作
        confirm(id){
            console.log(id)
            this.$axios({
                url:'/admin/food/deleteFoodToCook',
                params:{
                    id
                }
            }).then(res => {
                if(res.data.code==0){
                    this.$message.success('删除成功');
                   this.getFoodList(this.cookId)
                }
            })
        },
        //返回到食谱管理界面
        ToCookBookManage(){
            this.$router.push({
                path:'/cookbookManage'
            })
        }
      },
}
</script>

<style scoped>
.ant-layout-content{
      padding: 0px 30px !important;
      /* text-align: right; */
  }
  .buttonArea{
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