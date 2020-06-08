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

        <a-form-model-item label="食材分类" prop="type_name" >
            <a-input v-model="form.type_name" />
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
  props: ["visible","formList",'aidx'],
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
        type_name:''
      },
      rules: {
        type_name:[{ required: true, message: '请输入要添加食材分类', trigger: 'blur' }],
      },  
    };
  },
  created() {
      //这是判断通过参数得到是添加食材，还是更新编辑食材
      if(this.aidx!=-1){
        this.$axios({
          url:'/admin/food/idFoodTypeList',
          params:{
            id:this.aidx
          }
        }).then(res => {
          this.form=res.data.data[0]
        })
      }
  },
  computed: {
      
  },
  methods: {
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
             this.KindUpdata()
           }else{
             //这是添加的操作
              this.KindAdd()
           }
        } else {
          return false;
        }
      });
    },  
     KindUpdata(){
      this.form.id=this.aidx;
      this.$axios({
          url:"/admin/food/updateFoodType",
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
    KindAdd(){
      this.$axios({
        url:"/admin/food/insertFoodType",
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