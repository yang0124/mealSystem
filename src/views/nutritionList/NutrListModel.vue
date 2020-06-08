<template>
  <a-modal
    :title="title"
    :visible="visible"
    :footer='null'
    :closable='closable'
    centered='centered'	
    :width='700'
  >
    <a-form-model 
        :model="form" 
        :label-col="labelCol" 
        :wrapper-col="wrapperCol"
        :rules="rules"
         ref="ruleForm"
    >
        <a-form-model-item label="标题" prop="name" >
            <a-input v-model="form.name" />
        </a-form-model-item>
        <a-form-model-item label="概要" prop="brief" >
            <a-input v-model="form.brief" />
        </a-form-model-item>
         <a-form-model-item label="详情"  prop="detail">
            <editor-bar v-model="form.detail" :isClear="isClear" ></editor-bar> 
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
import EditorBar from './../../components/wangEditor'
import { Modal, Form,Input,FormModel,Select } from "ant-design-vue";
// import { updata } from './../../http/request'
Vue.use(Modal);
Vue.use(Form);
Vue.use(Input);
Vue.use(FormModel);
Vue.use(Select)
export default {
  props: ["visible","formList",'aidx','categoryId'],
  components:{
     EditorBar
  },
  data() {
    return {
      title:'添加列表',
      labelCol: { span: 4},
      wrapperCol: { span: 18 },
      closable: false,
      centered:true,
      isClear: false,  
      form: {
        name:'',
        brief:'',
        detail:''
      },
      rules: {
        name:[{ required: true, message: '请输入产品标题', trigger: 'blur' }],
        brief:[{ required: true, message: '请输入产品概要', trigger: 'blur' }],
        detail:[{ required: true, message: '请输入产品详细内容', trigger: 'blur' }],
      },  
    };
  },
  created() {
      //这是判断通过参数得到是添加食材，还是更新编辑食材
      if(this.aidx!=-1){
        this.$axios({
          url:'/admin/food/idNutritionInfo',
          params:{
            id:this.aidx
          }
        }).then(res => {
          console.log(res)
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
             this.NutrListUpdata()
           }else{
             //这是添加的操作
              this.NutrListdAdd()
           }
        } else {
          return false;
        }
      });
    },  
     NutrListUpdata(){
      this.form.categoryId=this.categoryId;
      this.form.id=this.aidx;
      this.$axios({
          url:"/admin/food/updateNutritionInfo",
          method:'POST',
          params:this.form
      }).then(res => {
        if(res.data.code==0){
            this.$emit('transCancel',{
              visible:false,
              form:this.form
            })
        }
      })
      // updata('/admin/food/updateNutritionInfo',this.form).then(res=>{
      //   console.log(res)
      // })
    },
    NutrListdAdd(){
       this.form.categoryId=this.categoryId;
      this.$axios({
        url:"/admin/food/insertNutritionInfo",
        method:'POST',
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
    height: 250px;
    max-height: 300px;
    overflow-y: auto;
    min-height: 0px;
}

</style>