<template>
  <a-modal
    :title="title"
    :visible="videoShow"
    :footer='null'
    :closable='closable'
    centered='centered'	
    :width='500'
  >
    <a-form-model 
        :model="form" 
        :label-col="labelCol" 
        :wrapper-col="wrapperCol"
        :rules="rules"
         ref="ruleForm"
    >
        <a-form-model-item label="链接地址" prop="address">
            <a-input v-model="form.address"  />
        </a-form-model-item>

         <a-form-model-item :wrapper-col="{ span: 14, offset: 8 }">
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
import { Modal,Form,Input,FormModel } from "ant-design-vue";
Vue.use(Modal);
Vue.use(Form);
Vue.use(Input);
Vue.use(FormModel);
export default {
  props: ["videoShow","foodId"],
  data() {
    return {
      title:'请添加链接地址',
      labelCol: { span: 4},
      wrapperCol: { span: 16 },
      closable: false,
      centered:true,
      isClear: false, 
      form: {
        address:''
      },
      rules: {
        address: [
          { required: true, message: '请填写链接地址', trigger: 'blur' },
        ],
        }
    };
  },
  mounted () {
        console.log(this.foodId)
  },
  methods: {
    handleCancel() {
      this.$emit("VedioCancel", {
        videoShow: false
      });
    },
    onSubmit() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
            //发起提交地址的请求
            this.$axios({
              url:"/admin/food/updateVideoUrl",
              params:{
                foodId:this.foodId,
                videoNetWorkUrl:this.form.address  
              }
            }).then(res => {
              if(res.data.code==0){
                this.$message.success('链接地址上传成功')
                  this.$emit("VedioCancel", {
                      videoShow: false
                  });
              }
            })
        } else {
          return false;
        }
      });
    },  
   
  }
};
</script>

<style >

</style>