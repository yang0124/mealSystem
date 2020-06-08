import axios from 'axios'
import router from '../router';
import Vue from 'vue'
import store from '../store';
import {message} from 'ant-design-vue'
// const host = process.env.NODE_ENV === "development"? "http://192.168.1.183:6080/food/" : "http://232g3567n6.51mypc.cn:1480/food/"
// axios.defaults.withCredentials = true
// axios.defaults.crossDomain = true;//配置axios跨域
Vue.use(message)
var instance = axios.create({
    baseURL: 'https://food.psycloud.com.cn:1480/food',
    // timeout: 6000,
  })

// instance.defaults.headers.common['token'] = localStorage.getItem("token")

// instance.defaults.timeout=6000

// // 添加请求拦截器
instance.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    // const token =localStorage.getItem('token')
    // config.headers.commen.token=token
    return config;
  }, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  });

// // 添加响应拦截器
instance.interceptors.response.use(response=> {
    // 对响应数据做点什么
    if(response.status==200){
      return response;
    }
  }, 
  error => {
    // 对响应错误做点什么
    if(error.response.status){
      switch(error.response.status){
        //401：表示还未登陆，
        //未登陆则跳转到登陆的页面，并携带当前页面的路径
        //在登陆成功后应返回当前页面
        case 401:
          router.replace({
            path:"/login",
            query:{
              redirect: router.currentRoute.fullPath
            }
          })
          break;
          //403 token过期，
          //登陆过期对用户进行提示
          //清楚本地的token
          //跳转到登陆页面
          case 403 :
            message.info('登陆过期，请重新登陆')
            localStorage.removeItem("token")
            store.commit('loginMut', 'logout')
              router.replace({
                path:'/login',
              })
            break;
            case 404:{
              message.info('网络请求不存在')
            }
            break;
      }
    }
    return Promise.reject(error);
  }
  );

  export default instance