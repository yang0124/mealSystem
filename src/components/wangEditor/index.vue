<template lang="html">  
  <div class="editor">  
    <div ref="toolbar" class="toolbar">  
    </div>  
    <div ref="editor" class="text">  
    </div>  
  </div>  
</template>  
  
<script>  
  import E from 'wangeditor'  
  import 'wangeditor/release/wangEditor.min.css'  
  
  // import * as qiniu from "qiniu-js"
  export default {  
    name: 'editoritem',  
    data() {  
      return {  
        // uploadPath,  
        editor: null,  
        info_: null  
      }  
    },  
    model: {  
      prop: 'value',  
      event: 'change'  
    },  
    props: {  
      value: {  
        type: String,  
        default: ''  
      },  
      isClear: {  
        type: Boolean,  
        default: false  
      }  
    },  
    watch: {  
      isClear(val) {  
        // 触发清除文本域内容  
        if (val) {  
          this.editor.txt.clear()  
          this.info_ = null  
        }  
      },  
      value: function(value) {  
        if (value !== this.editor.txt.html()) {  
          this.editor.txt.html(this.value)  
        }  
      }  
      //value为编辑框输入的内容，这里我监听了一下值，当父组件调用得时候，如果给value赋值了，子组件将会显示父组件赋给的值  
    },  
    mounted() {  
      this.seteditor()  
      this.editor.txt.html(this.value) 
    },  
    methods: {  
      seteditor() {  
        this.editor = new E(this.$refs.toolbar, this.$refs.editor)  
        this.editor.customConfig.uploadImgShowBase64 = true// base 64 存储图片 
        this.editor.customConfig.showLinkImg = false
        this.editor.customConfig.uploadFileName = 'file'
        this.editor.customConfig.uploadImgMaxSize = 0.1 * 1024 * 1024
        // 配置菜单  
        this.editor.customConfig.menus = [    
          'bold', // 粗体  
          'fontSize', // 字号  
          'fontName', // 字体  
          'italic', // 斜体  
          'link', // 插入链接   
          'justify', // 对齐方式   
          'table', // 表格  
          'undo', // 撤销  
          'redo', // 重复
          'image', // 插入图片  
        ]  
   
        this.editor.customConfig.onchange = (html) => {  
          this.info_ = html // 绑定当前逐渐地值  
          this.$emit('change', this.info_) // 将内容同步到父组件中  
        },
     
        
        
        // 创建富文本编辑器  
        this.editor.create()  
     
      },
    
    }  
  }  
</script>  
  
<style lang="css" >  
  .editor {  
    width: 100%;  
    margin: 0 auto;  
    position: relative;  
    z-index: 0; 
    overflow: auto; 
  }  
  .toolbar {  
    border: 1px solid #ccc;  
    display: flex;
    flex-wrap: wrap;
  }  
  .text {  
    border: 1px solid #ccc;  
    min-height: 300px;  
  } 
  .w-e-menu{
      padding:3px !important;
      line-height: 20px;
  }
  .w-e-text p{
    text-indent: 2em;
  }
</style>    