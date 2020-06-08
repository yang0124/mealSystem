<template>
        <a-layout-sider width="300" style="background: #fff ">
          <a-menu
            mode="inline"
            style="height: 100%"
            theme="dark"
            @click='handleDetail'
            :selectedKeys="[this.$route.path.slice(1)]"
          >
             <a-menu-item key="foodManage">
               <i class="iconfont  icon-shicailiebiao"></i>  食材列表
              </a-menu-item>
              <a-menu-item key="menuManage">
                 <i class="iconfont icon-plList-normal"></i>
                菜品制作
              </a-menu-item>
              <a-menu-item key="cookbookManage">
                 <i class="iconfont icon-shipuguanli"></i>
                 食谱管理
              </a-menu-item>
               <a-menu-item key="nutritionManage">
                 <i class="iconfont icon-yingyang"></i>
                 营养库管理
              </a-menu-item>
               <a-menu-item key="micropManage">
                <i class="iconfont icon-baike"></i>
                小百科管理
              </a-menu-item>
               <a-menu-item key="foodKindManage">
                <i class="iconfont icon-leimupinleifenleileibie"></i>
                食材分类管理
              </a-menu-item>
          </a-menu>
        </a-layout-sider>
</template>

<script>
export default {
    data() {
      return {
      
      }
    },
  methods: {
    handleDetail(e){
      this.$router.push({
        path:e.key
      })
    },
  },
}
</script>

<style scoped>
  .ant-menu-item{
    font-size: 24px !important;
    margin:20px 0 !important
  }
</style>