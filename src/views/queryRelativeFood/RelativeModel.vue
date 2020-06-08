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

         <a-form-model-item label="食材" prop="relativeFooId">
            <a-select v-model="form.relativeFooId" placeholder="请选择" >
                <a-select-option v-for="(item) in burdenList" :key="item.id" :value="item.id">
                   {{item.name}}
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
  props: ["visible","formList",'aidx','foodId'],
  data() {
    return {
      title:'关联食材',
      labelCol: { span: 6},
      wrapperCol: { span: 14 },
      closable: false,
      centered:true,
      burdenList:'',
      form: {
        relativeFooId:"",
      },
      rules: {
        relativeFooId:[{ required: true, message: '请选择要添加的食材', trigger: 'change' }],
      },  
    };
  },
  created() {
      this.getBurdenList()
  },
  computed: {
      
  },
  methods: {
    //这是得到食材的列表
    getBurdenList(){
      this.$axios({
        url:'/admin/food/queryFoodList',
        params:{
          page:1,
          limit:1000
        }
      }).then(res => {
        this.burdenList=res.data.data
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
             return false
           }else{
             //这是添加的操作
              this.Add()
           }
        } else {
          return false;
        }
      });
    },  
    Add(){
      this.form.foodId=this.foodId;
      this.$axios({
        url:"/admin/food/insertRelativeFoodInfo",
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