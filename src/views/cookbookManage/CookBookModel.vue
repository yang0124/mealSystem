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
         <a-form-model-item label="名称" prop="name" ref="name">
            <a-input v-model="form.name" />
        </a-form-model-item>

        <a-form-model-item label="季节" prop="seasonId">
            <a-select v-model="form.seasonId" placeholder="请选择" >
                <a-select-option v-for="(item) in seasonList" :key="item.id" :value='item.id'>
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
  props: ["visible","formList",'aidx'],
  data() {
    return {
      title:'添加食谱',
      labelCol: { span: 6},
      wrapperCol: { span: 14 },
      closable: false,
      centered:true,
      seasonList:"",
      form: {
          name:'',
          seasonId :'',
      },
      rules: {
        name: [
          { required: true, message: '请输入食谱名字', trigger: 'blur' },
        ],
        seasonId: [{ required: true, message: '请选择相关季节', trigger: 'change' }],
        }
    };
  },
  created() {
      //这是判断通过参数得到是添加食材，还是更新编辑食材
      if(this.aidx!=-1){
            this.$axios({
                url:'/admin/food/idCookList',
                params:{
                    id:this.aidx
                }
            }).then(res=>{
              console.log(res)
                this.form=res.data.data[0]
            })
      }
      //获得季节列表的操作
      this.getSeasonList()
  },
  computed: {
      
  },
  methods: {
    getSeasonList(){
      this.$axios({
        url:'/admin/food/querySeasonList',
        params:{
          page:1,
          limit:100
        }
      }).then(res => {
        this.seasonList=res.data.data
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
               this.form.id=this.aidx
                this.$axios({
                  url:"/admin/food/updateCook",
                  params:this.form
                }).then(res => {
                  if(res.data.code==0){
                    this.$emit("transCancel", {
                          visible: false,
                          form:this.form
                      });
                  }
                   
                })
            }else{
              this.$axios({
                url:'/admin/food/insertCook',
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
        } else {
          return false;
        }
      });
    },  
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