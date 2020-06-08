<template>
    <div id="container">
        <div id="output">
            <div class="containerT">
                <h1>膳食管理登录</h1>
            <a-form-model layout="horizontal" :model="formInline" @submit="handleSubmit" @submit.native.prevent>
                    <a-form-model-item>
                        <a-input v-model="formInline.user" placeholder="用户名">
                            <a-icon slot="prefix" type="user" style="color:rgba(0,0,0,.25)" />
                        </a-input>
                    </a-form-model-item>
                    <a-form-model-item>
                        <a-input v-model="formInline.password" type="password" placeholder="密码">
                            <a-icon slot="prefix" type="lock" style="color:rgba(0,0,0,.25)" />
                        </a-input>
                    </a-form-model-item>
                    <a-form-model-item>
                        <a-button
                            type="primary"
                            html-type="submit"
                            :disabled="formInline.user === '' || formInline.password === ''"
                        >
                            登录
                        </a-button>
                </a-form-model-item>
            </a-form-model>

                <a-modal
                    title="登陆确认框"
                    :visible="isShow"
                    @ok="handleOk"
                    @cancel="handleCancel"
                    >
                    <p>已有用户登录,是否强制登录？</p>
                </a-modal>  
            </div>
        </div>
    </div>
</template>

<script>
import Vue from "vue";
import { FormModel,Modal } from "ant-design-vue";
Vue.use(FormModel);
Vue.use(Modal)
export default {
    data() {
        return {
            formInline: {
                user: '',
                password: '',
            },
        }
    },
    computed: {
        isShow(){
            return this.$store.state.isShow
        }
    },
    methods: {
         handleSubmit() {
                this.$store.dispatch('loginAct',this.formInline)
        },
         handleOk() {
             this.$axios({
                 url:'loginController/login',
                 params:{
                     force:1,
                     account:this.formInline.user,
                     password:this.formInline.password
                 },
                 method:'POST'
             }).then(res=>{
                 console.log(res)
                 if(res){
                      this.$router.push({
                        path:'/'
                    })
                    this.$store.commit("loginMut")
                    this.$store.commit('loginShow')
                    localStorage.setItem('token',res.data.data.token)
                 }
             })
      
        },
        handleCancel() {
            this.$store.commit('loginShow')
        }

    },
}
</script>

<style>
    html,body{
        height: 100%;
    }
    #app{
        height: 100%;
    }
    .login{
        height: 100%;
    }
    #container{
        width: 100%;
        height: 100%;
        background: url("./../../assets/login.jpg");
        position: relative;
    }
    #output{
        width: 400px;
        position: absolute;
        left: 50%;
        margin-left: -200px;
        top:50%;
        margin-top: -200px;
    }
    .containerT h1{
        text-align: center;
    }
    button{
        text-align: center;
    }
</style>