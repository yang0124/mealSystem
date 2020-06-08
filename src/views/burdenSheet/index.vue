<template>
    <a-layout-content>
         <a-button type="primary" class="button" @click="ToMenuManage">返回菜品制作</a-button>
         <a-button type="primary" class="mainButton" @click="showModal(-1)">添加配料</a-button>
     <table>
         <tr>
            <td>序号</td>
            <td>名称</td>
            <td>分量(单位：g)</td>
            <td>操作</td>
         </tr>
          <tr v-for="(item, index) in burdenList" :key="index">
            <td>{{(page-1)*8+1+index}}</td>
            <td>{{item.name}}</td>
            <td>
               {{item.weight}}g
            </td>
             <td> 
                 <a-button type="primary" size='small' @click='showModal(item.id)'>编辑</a-button> 
                 <a-popconfirm title="您确定要删除此条内容吗？" okText="确定" cancelText="取消" @confirm="confirm(item.id)">
                    <a-button type="danger" size='small'>删除</a-button>
                </a-popconfirm>
             </td>
         </tr>
     </table>
      <burdenModel
        v-if="visible"
        :visible="visible"
        @transCancel='handleCancel'
        @transOk='handleOk'
        :aidx='idx'
        :foodId='foodId'
      ></burdenModel>
    </a-layout-content>
</template>

<script>
import burdenModel from './burdenModel'
export default {
    components:{
        burdenModel
    },
    data () {
        return {
            page:1,
            burdenList:'',
            visible: false,
            idx:-1,//表示是新增,
            foodId:'',
            istrue:true
        }
    },
      created() {
          let foodId =this.$route.query.foodId;
          this.foodId=foodId;
          this.getBurdenList(foodId)
      },
      methods: {
          getBurdenList(foodId){
            this.$axios({
              url:"/admin/food/queryFoodIngredientsList",
              params:{
                  foodId
              }
            }).then(res=>{
                console.log(res)
                this.burdenList=res.data.data
            })
          },
         showModal(id) {
            this.idx=id;
            this.visible = true;
        },
        handleCancel(obj){
            this.visible =obj.visible
            if(obj.form){
                this.getBurdenList(this.foodId)
            }
        },
        handleOk(obj){
            this.visible=obj.visible
        },
        //这是在做列表删除的操作
        confirm(id){
            console.log(id)
            this.$axios({
                url:'admin/food/deleteFoodIngredients',
                params:{
                    id
                }
            }).then(res => {
                if(res.data.code==0){
                    this.$message.success('删除成功');
                   this.getBurdenList(this.foodId)
                }
            })
        },
        //点击返回到菜品制作页面
        ToMenuManage(){
            this.$router.push({
                path:'/menuManage'
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