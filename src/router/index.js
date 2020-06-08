import Vue from 'vue'
import VueRouter from 'vue-router'
import Header from '@/components/Header'
import FoodManage from '@/views/foodManage'
import Footer from '@/components/Footer'
import Login from '@/views/login'
// import store from '../store'  
Vue.use(VueRouter)

const router = new VueRouter({
    routes:[
      {
          path:"/",
         redirect:'/foodManage'
      },
      {
        path:"/foodManage",
        components:{
          header:Header,
          footer:Footer,
          default:FoodManage,
        }
      },
      //这是菜品菜单
      {
        path:"/menuManage",
        components:{
          header:Header,
          footer:Footer,
          default:() => import('./../views/menuManage'),
        }
      },
      //这是配料表
      {
        path:"/burdenSheet",
        components:{
          header:Header,
          footer:Footer,
          default:() => import('./../views/burdenSheet'),
        }
      },
      {
        path:"/cookbookManage",
        components:{
          header:Header,
          footer:Footer,
          default:() => import('./../views/cookbookManage'),
        }
      },
      {
        path:"/cookbookDetail",
        components:{
          header:Header,
          footer:Footer,
          default:() => import('./../views/cookbookDetail'),
        }
      },
      //这是营养库
      {
        path:"/nutritionManage",
        components:{
          header:Header,
          footer:Footer,
          default:() => import('./../views/nutritionManage'),
        }
      },
      //这是营养库分类
      {
        path:"/nutritionKind",
        components:{
          header:Header,
          footer:Footer,
          default:() => import('./../views/nutritionKind'),
        }
      },
      //这是营养库列表
      {
        path:"/nutritionList",
        components:{
          header:Header,
          footer:Footer,
          default:() => import('./../views/nutritionList'),
        }
      },
      {
        path:"/micropManage",
        components:{
          header:Header,
          footer:Footer,
          default:() => import('./../views/micropManage'),
        }
      },
      {
        path:"/foodKindManage",
        components:{
          header:Header,
          footer:Footer,
          default:() => import('./../views/foodKindManage'),
        }
      },
      {
        path:"/login",
        components:{
          login:Login
        }
      },
      //这是关联的食材的页面
      {
        path:"/queryRelativeFood",
        components:{
          header:Header,
          footer:Footer,
          default:() => import('./../views/queryRelativeFood'),
        }
      },
    ]
})

// router.beforeEach((to,from,next)=>{  //全局前置守卫
   
//       let token =localStorage.getItem('token')
      
//       if(!token){
//         next({
//           path:'/login'
//         })
//       }else{
//         if(to.path=='/login' && token){
//           next({
//             path:"/"
//           })
//           store.commit('loginMut')
//         }else{
//           next()
//           store.commit('loginMut')
//         }
//       }
// })

export default router
