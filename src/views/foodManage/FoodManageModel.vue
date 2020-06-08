<template>
  <a-modal
    :title="title"
    :visible="visible"
    :footer='null'
    :closable='closable'
    :centered='centered'
    :width='700'	
  >
    <a-form-model 
        :model="form" 
        :label-col="labelCol" 
        :wrapper-col="wrapperCol"
        :rules="rules"
         ref="ruleForm"
    >
         <a-form-model-item label="名称" prop="type" hidden>
            <a-input v-model="form.type"  />
        </a-form-model-item>
         <a-form-model-item label="名称" prop="name" ref="name">
            <a-input v-model="form.name" />
        </a-form-model-item>
        
        <a-form-model-item label="类型" prop="food_type">
            <a-select v-model="form.food_type" placeholder="请选择"  >
                <a-select-option v-for="(item) in typeList" :key="item.id" :value='item.id'>
                   {{item.type_name}}
                </a-select-option>
            </a-select>
        </a-form-model-item>

         <a-form-model-item label="小百科类型"  prop="food_classify">
            <a-select v-model="form.food_classify" placeholder="请选择">
                <a-select-option v-for="(item) in classifyList" :key="item.id" :value='item.id'>
                   {{item.food_classify_name}}
                </a-select-option>
            </a-select>
        </a-form-model-item>

        <a-form-model-item label="介绍"  prop="text">
          <!-- 这是引入的富文本编辑器 -->
            <editor-bar v-model="form.text" :isClear="isClear" ></editor-bar> 
        
        </a-form-model-item>

         <a-form-model-item label="名称" prop="type" hidden>
            <a-input v-model="form.type"  />
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
      title:'添加食材',
      labelCol: { span: 4},
      wrapperCol: { span: 18 },
      closable: false,
      centered:true,
      classifyList:'',
      typeList:'',
      test:'',  
     isClear: false,  
      form: {
        type:1,
        name: '',
        food_type : undefined,
        food_classify :undefined,
        text:"", 
      },
        rules: {
        name: [
          { required: true, message: '请输入相关食材名称', trigger: 'blur' },
        ],
        food_type: [{ required: true, message: '请选择菜品类型', trigger: 'change' }],
        food_classify: [{ required: true, message: '请选择小百科类型', trigger: 'change' }],
        text: [{ required: true, message: '请输入食材相关介绍', trigger: 'change' }],
        }
    };
  },
  created() {
      //这是判断通过参数得到是添加食材，还是更新编辑食材
      if(this.aidx!=-1){
            this.$axios({
                url:'/admin/food/idFoodList',
                params:{
                    id:this.aidx
                }
            }).then(res=>{
                this.form=res.data.data[0]
            })
      }
      //这是得到小百科和食材类型的请求方法
      this.$axios({
          url:"/admin/food/foodConditions",
          }).then(res=>{
            console.log(res)
            this.classifyList=res.data.data.classifyList
            this.typeList=res.data.data.typeList
          })
  },
  mounted() {
   
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
     handleFormLayoutChange(e) {
      this.formLayout = e.target.value;
    },
    //这是在表单的提交操作
    onSubmit() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
            //判断是添加还是编辑
            if(this.aidx!=-1){
              this.form.id=this.aidx
                this.$axios({
                  url:'/admin/food/updateFood',
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
            }else{
                this.$axios({
                    url:"/admin/food/insertFood",
                    params:this.form
                }).then(res=>{
                    if(res.data.code==0){
                        //这是发起请求，关闭弹框
                      // 并把新得到的数据压入到列表中
                        this.$emit("transCancel", {
                            visible: false,
                            form:this.form
                        });
                        this.form={}
                    }  
                })
            }
          
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },  
  }
};
</script>

<style>

</style>