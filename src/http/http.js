import axios from 'axios'
// var http = {url:""};
// http.post = function(ac,data,call){
//     var self = this;
//     data.token = localStorage.getItem("token");
//     console.log(data);
//     axios({
//         url:self.url+ac,
//         params:data
//         //headers:{token:localStorage.getItem("token")}
//     }).then(res => {
//         if(res.data.code==0){
//             call(res.data);
//             //localStorage.setItem('token',res.data.data.token)
//         }else{
//             alert(res.msg);
//         }
//     })
// }

// export default http


// import http from './index'

export function request(obj){
    const {url,params,method} =obj
    let token = localStorage.getItem('token')
   if(token){
        params.token =token
   }
    var call = {
        callFunc:null,
        then:function(callFunc){
            this.callFunc = callFunc;
        }
    };

    http({
        url:url,
        params:params || {},
        method:method || 'GET'
   
    }).then(res => {
        if(res.data.code==0){
            // this.$message.success('删除成功');
            // this.getTypeList()
            // localStorage.getItem('token',res.data.token);
            call.callFunc.call(this,res);
        }else{
            alert("错误");
        }
    })

    return  call;
} 