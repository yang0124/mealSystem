import Vue from 'vue'
import Vuex from 'vuex'
import router from '../router'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    loginState:false,
    isShow:false,
  },
  mutations: {
    loginMut(state,str){
      let bool = str=='logout'? false : true; //判断是处理登录，还是退出
      state.loginState = bool
    },
    loginShow(state){
      state.isShow=!state.isShow
    }
  },
  actions: {
    loginAct(context,obj){
      Vue.prototype.$axios({
        url:'https://food.psycloud.com.cn:1480/food/loginController/login',
        params:{
          account:obj.user,
          password:obj.password
        },
        method:'POST'
      }).then(res => {
        if(res.data.code==1002){
          // Vue.prototype.$message.info(res.data.msg)
          context.commit('loginShow')
        }
        if(res.data.code==1){
          Vue.prototype.$message.info(res.data.msg)
        }
        if(res.data.code==0){
          context.commit('loginMut') //根据服务器在线登录状态修改本地登录状态
          router.push({ 
            path:'/'
          })
          localStorage.setItem('token',res.data.data.token)
          return false;
        }
      })
    }
  },
  modules: {
  }
})
