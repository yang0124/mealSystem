<template>
  <a-modal
    :title="title"
    :visible="visible"
    :footer='null'
    :closable='closable'
    centered='centered'	
  >
    <a-form-model 
        :model="form" 
        :label-col="labelCol" 
        :wrapper-col="wrapperCol"
        :rules="rules"
         ref="ruleForm"
    >

         <a-form-model-item label="菜品" prop="foodId">
            <a-select v-model="form.foodId" placeholder="请选择" >
                <a-select-option v-for="(item) in adminFoodList" :key="item.id" :value='item.foodId'>
                   {{item.name}}
                </a-select-option>
            </a-select>
        </a-form-model-item>

        <a-form-model-item label="星期" prop="weekId">
            <a-select v-model="form.weekId" placeholder="请选择"  >
                <a-select-option v-for="(item) in weekList" :key="item.id" :value='item.weekId'>
                   {{item.weekName}}
                </a-select-option>
            </a-select>
        </a-form-model-item>

         <a-form-model-item label="分类" prop="categoryId">
            <a-select v-model="form.categoryId" placeholder="请选择">
                <a-select-option v-for="(item) in typeList" :key="item.id" :value='item.categoryId'>
                   {{item.categoryName}}
                </a-select-option>
            </a-select>
        </a-form-model-item>

         <a-form-model-item :wrapper-col="{ span: 14, offset: 10 }">
            <a-button  @click="handleCancel">
                取消
            </a-button>
            <a-button style="margin-left: 10px;" type="primary"  @click="onSubmit" >
                确定
            </a-button>
        </a-form-model-item>
    </a-form-model>
    
  </a-modal>
</template>

<script>
import Vue from "vue";
import { Modal, Form,Input,FormModel,Select } from "ant-design-vue";
Vue.use(Modal);
Vue.use(Form);
Vue.use(Input);
Vue.use(FormModel);
Vue.use(Select)
export default {
  props: ["visible","formList",'aidx','cookId'],
  data() {
    return {
      title:'添加菜品',
      labelCol: { span: 6},
      wrapperCol: { span: 14 },
      closable: false,
      centered:true,
      weekList:"",
      typeList:'',
      adminFoodList:'',
      form: {
        foodId:"",
        weekId:'',
        categoryId:'',
      },
      rules: {
        foodId:[{ required: true, message: '请选择要添加的菜品', trigger: 'change' }],
        weekId: [{ required: true, message: '请选择星期', trigger: 'change' }],
        categoryId:[{ required: true, message: '请选择相关季节', trigger: 'change' }],
      },  
    };
  },
  created() {
      //这是判断通过参数得到是添加食材，还是更新编辑食材
      if(this.aidx!=-1){
        this.$axios({
          url:'admin/food/idCookFoodList',
          params:{
            id:this.aidx
          }
        }).then(res => {
          this.form=res.data.data[0]
        })
      }
      //获得季节列表的操作
      this.getMuneList()
  },
  computed: {
      
  },
  methods: {
    //这是得到菜品的列表
    getMuneList(){
      this.$axios({
        url:'/admin/food/queryFoodConditions',
      }).then(res => {
         this.weekList=res.data.data.weekList
         this.typeList=res.data.data.typeList
         this.adminFoodList=res.data.data.adminFoodList
      })
    },
    handleOk() {
      this.$emit("transOk", {
        visible: false
      });
    },
    handleCancel() {
      this.$emit("transCancel", {
        visible: false
      });
    },
    onSubmit() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
            //发起添加食材的结果
           if(this.aidx!=-1){
             //这是说明是更新的操作
             this.updata()
           }else{
             //这是添加的操作
              this.Add()
           }
        } else {
          return false;
        }
      });
    },  
    updata(){
      this.form.id=this.aidx;
      this.form.cookId=this.cookId
      this.$axios({
          url:"admin/food/updateFoodToCook",
          params:this.form
      }).then(res => {
        if(res.data.code==0){
            this.$emit('transCancel',{
              visible:false,
              form:this.form
            })
        }
      })
    },
    Add(){
      this.form.cookId=this.cookId;
      this.$axios({
        url:"/admin/food/insertFoodToCook",
        params:this.form
      }).then(res => {
          if(res.data.code==0){
             this.$emit("transCancel", {
                visible: false,
                form:this.form
            });
            this.form={}
          }
      })
    }
  }
};
</script>

<style>
.ant-modal-header {
  text-align: center;
}
.ant-form{
    width: 600px;
}
.ant-form-item{
    margin-bottom: 6px;
}
.text{
    height: 150px;
    max-height: 300px;
    overflow-y: auto;
    min-height: 0px;
}
.ant-modal{
    width: 650px !important;
}
</style>