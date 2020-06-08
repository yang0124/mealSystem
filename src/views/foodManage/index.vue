<template>
 <a-layout-content>
     <div class="header">
    <a-input-search
        placeholder="请输入你要查找的食材"
        @search="onSearch"
        enterButton="搜索"
        size="default"
    />
     <a-button type="primary" class="mainButton" @click="showModal(-1)">添加食材</a-button>
     </div>
     
     <table>
         <tr>
            <td>序号</td>
            <td>名称</td>
            <td>类型</td>
            <td>小百科类型</td>
            <td>介绍</td>
            <td>封面图片</td>
             <td>操作</td>
         </tr>
          <tr v-for="(item, index) in FoodList" :key="index">
            <td>{{(page-1)*14+1+index}}</td>
            <td>{{item.name}}</td>
            <td>{{item.type_name}}</td>
            <td>{{item.food_classify_name}}</td>
            <td class="td" v-html="item.text"></td>
            <td class="img img-show-mask">
                <img :src='qiniuCdnUrl+item.url+"?v="+urlV'  :alt='item.name'  @click="clickImg($event)"/>
            </td>
             <td>
                <a-button type="primary" size='small' class="upImage"  @click="handleKey(item.url,-1)">
                    <UploadQiniu 
                        :ikey="ikey"
                        :foodId="foodId"
                        @handleUrl='handleUrl'
                    >
                    </UploadQiniu>
                     图片上传
                </a-button>  
                 <a-button type="primary" size='small' @click='ToRelativeFood(item.id)'>查询关联食材</a-button> 
                 <a-button type="primary" size='small' @click='showModal(item.id)'>编辑</a-button> 
                 <a-popconfirm title="您确定要删除此条内容吗？" okText="确定" cancelText="取消" @confirm="confirm(item.id)">
                    <a-button type="danger" size='small'>删除</a-button>
                </a-popconfirm>
             </td>
         </tr>
     </table>
     <!-- 这是图片预览的模块 -->
     <div>
         <big-img v-if="showImg" @clickit="viewImg" :imgSrc="imgSrc"></big-img>
     </div>
     <!-- 这是分页的模块 -->
      <a-pagination v-model="page" :total='count' @change="onchange" :defaultPageSize="15" :hideOnSinglePage='true'/>
      <!-- 这是弹出框的模块 -->
      <FoodManageModel
        v-if="visible"
        :visible="visible"
        @transCancel='handleCancel'
        @transOk='handleOk'
        :aidx='idx'
      ></FoodManageModel>
 </a-layout-content>
</template>
<script>
import Vue from 'vue'
import {Button,Pagination,Message,Popconfirm} from 'ant-design-vue'
import FoodManageModel from './FoodManageModel.vue'
import BigImg from './../../components/BigImg'
import UploadQiniu from './../../components/UploadQiniu'
Vue.use(Button)
Vue.use(Pagination)
Vue.use(Message)
Vue.use(Popconfirm)
export default {
    components:{
        FoodManageModel,
        BigImg,
        UploadQiniu
    },
    data() {
      return {
          page:1,
          FoodList:[],
          count:1,
          visible: false,
          confirmLoading: false,
          idx:-1,//表示是新增
          classifyList:"",
          typeList:'',
          uptoken:'',
          key:'',
          showImg: false,
          imgSrc: '',
          ikey:'',
          urlV:""+new Date().getTime(),
          foodId:''
    }
    },
    created() {
      this.getFoodList()
    },
    methods: {
        //展示弹框
        showModal(id) {
            this.idx=id;
            this.visible = true;
        },
        //这是确认弹框
        handleCancel(obj){
            this.visible =obj.visible
            if(obj.form){
                this.getFoodList()
            }
        },
        handleOk(obj){
            this.visible=obj.visible
        },
        //这是获得列表数据
        getFoodList(){
              this.$axios({
                url:"/admin/food/queryFoodList",
                params:{
                    page:this.page,
                    limit:14
                }
            }).then(res=>{
                if(res.data.code==0){
                    this.count= parseInt(res.data.count);
                    this.FoodList=res.data.data
                }
               
            })
        },
        //这是在选择页数时重新请求数据
        onchange(page){
            this.page=page
            this.getFoodList()
        },
        //这是在点击删除的时候，删除食材相关列表
        confirm(id){
            this.$axios({
                url:'/admin/food/deleteFood',
                params:{
                    id
                }
            }).then(res => {
                if(res.data.code==0){
                    this.$message.success('删除成功');
                   this.getFoodList()
                }
            })
        },
        clickImg(e) {
            this.showImg = true
            // 获取当前图片地址
            this.imgSrc = e.currentTarget.src
        },
        viewImg() {
            this.showImg = false
        },
        handleUrl(){
            let urlV=new Date().getTime();
            this.urlV=urlV
        },
        handleKey(ikey,foodId){
            if(foodId == -1){
                this.ikey=ikey
            }else{
                this.ikey=ikey+'/video'
            }
            this.foodId=foodId
        },
        //这是搜索框里面搜索内容的操作
         onSearch(value) {
            this.$axios({
                url:"/admin/food/foodIngredientsList",
                params:{
                    name:value
                }
            }).then(res => {
               if(res.data.code==0){
                   this.FoodList=res.data.data
               }else if(res.data.code==1){
                   this.$message.info('暂无此类型数据，请重新输入');
               }      
            })
        },
        //这是跳转到关联食材的页面
        ToRelativeFood(id){
            this.$router.push({
                path:`/queryRelativeFood?id=${id}`
            })
        }
    },
  };
</script>

<style scoped>
.ant-layout-content{
      padding: 0px 30px !important;
      text-align: right;
  }
.header{
    margin-top: 30px;
}
.ant-input-group-wrapper{
    vertical-align: middle !important;
     width: 400px
}

table{
    width: 100%;
    margin-top: 10px;
    text-align: center;
}
tr{
    border: 1px solid #ccc;
    line-height: 30px;
}
td{
    border-right: 1px solid #ccc;
    max-height: 50px;
   overflow: hidden;
}
.ant-pagination{
    margin-top: 10px;
}
.ant-btn{
    margin: 0 3px;
}
.td{
    max-width: 300px;
    text-align: left;
    padding-left: 10px;
}
.td >>> p{
    margin-bottom: 0px !important;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
    display: none;
}

td >>> p:nth-of-type(1){
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
    display: block;
}
tr td:last-of-type{
    width: 300px;
}
.upImage{
    position: relative;
}
.upImage input{
    position: absolute;
    width: 100%;
    height: 100%;
    top:0;
    left: 0;
    opacity: 0;
}
.img img{
    width: 30px;
    height: 30px;
}
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
    height: 250px;
    max-height: 300px;
    overflow-y: auto;
    min-height: 0px;
}
</style>
