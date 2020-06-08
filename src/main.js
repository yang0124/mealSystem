import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// import axios from 'axios'
// import http from './http/http'
import { message } from 'ant-design-vue'
import '../node_modules/animate.css/animate.min.css';
// import http from './http/index'
import { request } from './http/request'

Vue.config.productionTip = false
message.config({
  top: `100px`,
  duration: 2,
  maxCount: 3,
})

Vue.prototype.$message=message
// Vue.prototype.$axios=http
Vue.prototype.$axios=request

//初始化用户登录状态
// let token =localStorage.getItem("token")
// if(token){
//   store.commit('loginMut')
// }

  //在全局挂载上地址
// var baseURL = 'http://232g3567n6.51mypc.cn:1480/food/';
// let instance=axios.create({
//   // baseURL:'http://192.168.1.183:6080/food/'
//   baseURL:baseURL
// })

// Vue.prototype.$axios = instance;
// http.url = baseURL;
// Vue.prototype.$axios = http;


let qiniuCdnUrl='http://test.cdn.psycloud.com.cn/'

Vue.prototype.qiniuCdnUrl=qiniuCdnUrl
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
