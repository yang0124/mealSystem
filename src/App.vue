<template>
  <div id="app">

    <a-layout id="components-layout-demo-top-side" v-if="loginstate">
      <router-view name='header'></router-view>
      <a-layout-content style="padding: 0 50px">
          <a-layout style="background: #fff;height:100% ">
                 <Sider></Sider>
                 <transition 
                    mode="out-in" 
                    enter-active-class="animated fadeIn" 
                    leave-active-class="animated fadeOut"
                 >
                    <router-view></router-view>  
                 </transition>
          </a-layout>
      </a-layout-content>
      <router-view name='footer'></router-view>
    </a-layout>

    <div class="login" v-else>
         <router-view name='login'></router-view>
    </div>
     
  </div>
</template>
<script>
import Sider from './components/Sider'
import Vue from "vue";
import { Layout, Menu,Icon } from "ant-design-vue";

Vue.use(Layout);
Vue.use(Menu);
Vue.use(Icon)
export default {
  computed: {
    loginstate(){
      return this.$store.state.loginState
    }
  },
  created() {
    let token =localStorage.token
    if(token){
      this.$store.commit('loginMut')
    }else{
      this.$router.push({
        path:'/login'
      })
    }
  },
   components:{
        Sider
    },
}
</script>
<style scoped>
  html,body{
    width: 100%;
    height: 100%;
  }
  #app{
    height: 100%;
  }
  #components-layout-demo-top-side{
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
  }
  .ant-layout-header{
    height: 100px !important;
    line-height: 100px !important;
    background: #ccc !important;
    font-size: 36px;
  }
  .ant-layout-footer{
    padding: 0 !important;
    line-height: 30px;
    text-align: center;
    background: #ccc !important;
    font-size: 18px;
  }
  .ant-layout-content{
    flex: 1;
    overflow-y: auto;
    padding: 0 !important;
    font-size: 22px;
  } 
</style>
