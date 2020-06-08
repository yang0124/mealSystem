<template>
   <a-layout-header class="header">
      <a-row>
      <a-col :span="12">膳食管理系统</a-col>
      <a-col :span="3" :offset='9'>
          <a-popconfirm title="您确定要退出登录吗？" okText="确定" cancelText="取消" @confirm="confirm()">
                    退出登录
        </a-popconfirm>
    </a-col>
    </a-row>

    </a-layout-header>
</template>

<script>
import Vue from 'vue'
import {row,col,Popconfirm} from 'ant-design-vue'
Vue.use(row)
Vue.use(col)
Vue.use(Popconfirm)
export default {
    methods: {
        confirm(){
            this.$axios({
                 url:'loginController/closelogin',
                 params:{
                    token:localStorage.getItem("token")
                 }
            }).then(res=>{
                if(res){
                   this.$store.commit('loginMut','logout')
                   localStorage.removeItem('token')
                   this.$router.push({
                       path:'/login'
                   })
                }
            })
        }
    },
}
</script>

<style>

</style>