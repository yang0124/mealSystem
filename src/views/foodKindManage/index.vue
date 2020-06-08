<template>
    <a-layout-content>
         <a-button type="primary" class="mainButton" @click="showModal(-1)">添加食材分类</a-button>
     <table>
         <tr>
            <td>序号</td>
            <td>名称</td>
            <td>操作</td>
         </tr>
          <tr v-for="(item, index) in typeList" :key="index">
            <td>{{(page-1)*8+1+index}}</td>
            <td>{{item.type_name}}</td>
             <td> 
                 <a-button type="primary" size='small' @click='showModal(item.id)'>编辑</a-button> 
                 <a-popconfirm title="您确定要删除此条内容吗？" okText="确定" cancelText="取消" @confirm="confirm(item.id)">
                    <a-button type="danger" size='small'>删除</a-button>
                </a-popconfirm>
             </td>
         </tr>
     </table>
      <foodKindModel
        v-if="visible"
        :visible="visible"
        @transCancel='handleCancel'
        @transOk='handleOk'
        :aidx='idx'
      ></foodKindModel>
    </a-layout-content>
</template>

<script>
import foodKindModel from './foodKindModel'
//import http from './../../http/http'
export default {
    components:{
        foodKindModel
    },
    data () {
        return {
            page:1,
            typeList:'',
            visible: false,
            idx:-1,//表示是新增,
         
        }
    },
      created() {
          this.getTypeList()
      },
      methods: {
          getTypeList(){
            this.$axios({
              url:"/admin/food/queryFoodTypeList",
              params:{
                  page:1,
                  limit:100
              }
            }).then(res=>{
                console.log(res)
               this.typeList=res.data.data
            })
          },
         showModal(id) {
            this.idx=id;
            this.visible = true;
        },
        handleCancel(obj){
            this.visible =obj.visible
            if(obj.form){
                this.getTypeList()
            }
        },
        handleOk(obj){
            this.visible=obj.visible
        },
        //这是在做列表删除的操作
        confirm(id){
            // this.$axios({
            //     url:'/admin/food/deleteFoodType',
            //     params:{
            //         id
            //     }
            // }).then(res => {
            //     if(res.data.code==0){
            //         this.$message.success('删除成功');
            //        this.getTypeList()
            //     //    localStorage.getItem('token',res,data.token)
            //     }
            // })


                this.$axios({
                    url:'/admin/food/deleteFoodType',
                    params:{
                        id
                    }
                }).then(res => {
                    if(res.data.code==0){
                        this.$message.success('删除成功');
                    this.getTypeList()
                    //    localStorage.getItem('token',res,data.token)
                    }
                })

            // var self = this;
            // this.$http.post('/admin/food/deleteFoodType',{id:id},()=>{
            //      self.$message.success('删除成功');
            //     self.getTypeList()

            // })
        },
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