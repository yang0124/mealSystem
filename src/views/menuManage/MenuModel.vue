<template>
  <a-modal
    :title="title"
    :visible="visible"
    :footer='null'
    :closable='closable'
    centered='centered'	
    :width='800'
  >
    <a-form-model 
        :model="form" 
        :label-col="labelCol" 
        :wrapper-col="wrapperCol"
        :rules="rules"
         ref="ruleForm"
    >

      
        <a-form-model-item label="类型" prop="type" hidden>
            <a-input v-model="form.type"  />
        </a-form-model-item>

         <a-form-model-item label="名称" prop="name" ref="name">
            <a-input v-model="form.name" @blur="() => {$refs.name.onFieldBlur()}" />
        </a-form-model-item>


        <a-form-model-item id="editor" label="介绍"  prop="text"  @blur="() => {$refs.name.onFieldBlur()}">
            <editor-bar v-model="form.text" :isClear="isClear" ></editor-bar> 
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
import EditorBar from './../../components/wangEditor'
Vue.use(Modal);
Vue.use(Form);
Vue.use(Input);
Vue.use(FormModel);
Vue.use(Select)
export default {
  props: ["visible","formList",'aidx'],
   components: {
      EditorBar
  },
  data() {
    return {
      title:'添加食谱',
      labelCol: { span: 2},
      wrapperCol: { span: 22 },
      closable: false,
      centered:true,
      seasonList:"",
      isClear: false, 
       form: {
        type:2,
        name:'',
        text:''
      },
      rules: {
        name: [
          { required: true, message: '请输入菜品名字', trigger: 'blur' },
        ],
        text: [{ required: true, message: '请输入菜品相关介绍', trigger: 'change' }],
        }
    };
  },
  created() {
      //这是判断通过参数得到是添加食材，还是更新编辑食材
      if(this.aidx!=-1){
            this.$axios({
                url:'/admin/food/idFoodLists',
                params:{
                    foodId:this.aidx
                }
            }).then(res=>{
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
              this.munuUpdata()
            }else{
              this.munuAdd()
            }
        } else {
          return false;
        }
      });
    },  
    munuAdd(){
      this.$axios({
            url:'admin/food/insertFoodList',
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
    },
    munuUpdata(){
      this.form.id=this.aidx
        this.$axios({
          url:"admin/food/updateFoodList",
          params:this.form
        }).then(res => {
          console.log(res)
          if(res.data.code==0){
            this.$emit("transCancel", {
                  visible: false,
                  form:this.form
              });
          }  
        })
    },
  }
};
</script>

<style >

</style>