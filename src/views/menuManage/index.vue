<template>
    <a-layout-content>
        <div class="header">
            <a-input-search
            placeholder="请输入你要查找的菜品"
            @search="onSearch"
            enterButton="搜索"
            size="default"
        />
        <a-button type="primary" class="mainButton" @click="showModal(-1)">添加菜品</a-button>
        </div>
        
     <table>
         <tr>
            <td>序号</td>
            <td>名称</td>
            <td>制作方法</td>
            <td>封面图片</td>
            <td>操作</td>
         </tr>
          <tr v-for="(item, index) in MenuList" :key="index">
            <td>{{(page-1)*14+1+index}}</td>
            <td>{{item.name}}</td>
            <td class="td" v-html="item.text"></td>
            <td class="img img-show-mask">
                 <img :src='qiniuCdnUrl+item.url+"?v="+urlV'  :alt='item.name'  @click="clickImg($event)"/>
            </td>
             <td> 
                  <a-button type="primary" size='small' class="upImage" @click="handleKey(item.url,-1)">
                     <UploadQiniu 
                        :ikey="ikey"
                        :foodId="foodId"
                        @handleUrl='handleUrl'
                    >
                    </UploadQiniu>
                     图片上传
                </a-button> 
                  <a-button type="primary" size='small' class="upImage" @click="handleKey(item.url,item.foodId)">
                     <UploadQiniu 
                        :ikey="ikey"
                        :foodId="foodId"
                        @handleUrl='handleUrl'
                    >
                    </UploadQiniu>
                     视频上传
                </a-button>
                <a-button type="primary" size='small' @click='showVedioModal(item.foodId)'>视频地址上传</a-button> 
                 <a-button type="primary" size='small' @click='showModal(item.foodId)'>编辑</a-button> 
                 <a-popconfirm title="您确定要删除此条内容吗？" okText="确定" cancelText="取消" @confirm="confirm(item.foodId)">
                    <a-button type="danger" size='small'>删除</a-button>
                </a-popconfirm>
                <a-button type="primary" size='small' @click='ToBurdenSheet(item.foodId)'>查看配料表</a-button> 
             </td>
         </tr>
     </table>
      <div>
         <big-img v-if="showImg" @clickit="viewImg" :imgSrc="imgSrc"></big-img>
     </div>
      <a-pagination v-model="page" :total='count' @change="onchange" :defaultPageSize="14" :hideOnSinglePage='true'/>
      <MenuModel
        v-if="visible"
        :visible="visible"
        @transCancel='handleCancel'
        @transOk='handleOk'
        :aidx='idx'
      ></MenuModel>
      <VedioModel
        v-if="videoShow"
        :videoShow="videoShow"
        :foodId="foodId"
        @VedioCancel='VedioCancel'
      ></VedioModel>
    </a-layout-content>

</template>

<script>
import MenuModel from './MenuModel'
import VedioModel from './VedioModel'
import UploadQiniu from './../../components/UploadQiniu'
import Vue from 'vue'
import {Button,Pagination,Message,Popconfirm} from 'ant-design-vue'
import BigImg from './../../components/BigImg'
Vue.use(Button)
Vue.use(Pagination)
Vue.use(Message)
Vue.use(Popconfirm)
export default {
    components:{
        MenuModel,
        UploadQiniu,
        BigImg,
        VedioModel
    },
    data () {
        return {
            page:1,
            MenuList:'',
            count:1,
            visible: false,
            idx:-1,//表示是新增,
            ikey:'', //这是传的唯一值
            foodId:'', //这是传过去的菜品id
            urlV:""+new Date().getTime(),
            showImg: false,
            imgSrc: '',
            videoShow:false
        }
    },
      created() {
          this.getMenuList()
      },
      methods: {
          //这是请求菜品列表的操作
          getMenuList(){
            this.$axios({
              url:"admin/food/adminFoodList",
              params:{
                  page:this.page,
                  limit:14
              }
            }).then(res=>{
                this.count=parseInt(res.data.count) 
                this.MenuList=res.data.data
            })
          },
        //这是在选择页数时重新请求数据
        onchange(page){
            this.page=page
            this.getMenuList()
        },
        //这是编辑的和添加按钮的模态框
         showModal(id) {
            this.idx=id;
            this.visible = true;
        },
        //这是添加视频的模态框
        showVedioModal(foodId){
            this.foodId=foodId
            this.videoShow =true;
        },
        handleCancel(obj){
            this.visible =obj.visible
            if(obj.form){
                this.getMenuList()
            }
        },
        handleOk(obj){
            this.visible=obj.visible
        },
        //这是在做列表删除的操作
        confirm(id){
            this.$axios({
                url:'admin/food/deleteFood',
                params:{
                    id
                }
            }).then(res => {
                if(res.data.code==0){
                    this.$message.success('删除成功');
                   this.getMenuList()
                }
            })
        },
        // 找到点击的唯一key值
        handleKey(ikey,foodId){
            if(foodId == -1){
                this.ikey=ikey
            }else{
                this.ikey=ikey+'/video'
            }
            this.foodId=foodId
        },
        //跳转到配料表详情页
        ToBurdenSheet(foodId){
            this.$router.push({
                path:`/burdenSheet?foodId=${foodId}`
            })
        },
        //改变当前的事件戳
        handleUrl(){
            let urlV=new Date().getTime();
            this.urlV=urlV
        },
           clickImg(e) {
            this.showImg = true
            // 获取当前图片地址
            this.imgSrc = e.currentTarget.src
        },
        viewImg() {
            this.showImg = false
        },
        //这是菜品搜索的功能
           onSearch(value) {
            this.$axios({
                url:"/admin/food/foodList",
                params:{
                    name:value
                }
            }).then(res => {
               if(res.data.code==0){
                   this.MenuList=res.data.data
               }else if(res.data.code==1){
                   this.$message.info('暂无此类型菜品，请重新查找')
               }
            })
        },
        //查找到关联食材
        //关闭vedio弹框
        VedioCancel(obj){
            this.videoShow =obj.videoShow
        }
      },
}
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
    width: 500px;
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
    height: 300px;
    max-height: 300px;
    overflow-y: auto;
    min-height: 0px;
}
</style>
 



 
