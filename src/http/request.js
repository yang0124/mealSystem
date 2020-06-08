import http from './index'

export function request(obj){
    let {url,params,method} =obj
    if(!params){
        params ={}
    }
    let token = localStorage.getItem('token')
   if(token){
        params.token =token
   }
   return http({
        url:url,
        params:params || {},
        method:method || 'GET',
    })
}

// export function updata(url,data){
//     let token = localStorage.getItem('token')
//    if(token){
//         data.token =token
//    }
//    return http({
//        url:url,
//        method:'POST',
//        data:data
//    })
// }
    