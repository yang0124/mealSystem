
const TerserPlugin = require('terser-webpack-plugin');
module.exports = {
    // 基本路路径, vue.cli 3.3以前请使用baseUrl
    publicPath: './',
    // 输出文件目录
    outputDir: 'dist',
    devServer:{
        port:8888
    },
    pluginOptions:{
        optimization: {
            minimize: true,
            minimizer: [new TerserPlugin({
              //加快二次构建
              cache: true,
              // 多线程
              parallel: true,
              //TerserPlugin的配置项
              terserOptions: {
                compress: {
                  //删除没有用的代码
                  unused: true,
                  // 删除console
                  drop_console: true
                }
              }
            })],
          }
    }
}
