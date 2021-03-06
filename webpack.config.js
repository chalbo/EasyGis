const path = require('path');// 引入node中的path模块
// const webpack = require("webpack");//引入webpack
const HtmlWebpackPlugin = require('html-webpack-plugin');// 引入html-webpack-plugin插件,作用是添加模板到编译完成后的dist的文件里面
const { CleanWebpackPlugin } = require('clean-webpack-plugin');// 引入clean-webpack-plugin插件，作用是清除dist文件及下的内容，因为每次编译完成后都会有一个dist文件夹存放静态文件，所以需要清除上次的dist文件
const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin');// 引入extract-text-webpack-plugin插件，作用是把css文件单独存为一个文件，如果不用插件，css会以style标签的方式插入html中


const config = {
  // mode: 'development',
  mode: 'production',
  // devtool: 'source-map',lastDate
  entry: {
    // mapInfo: './src/map/example/mapInfo.js',
    EasyGis: './src/map/EasyGis.js',

  },
  output: {
    libraryTarget: 'commonjs2',
    // libraryTarget: "window",
    library: 'tools',
    filename: './[name].mini.js',
    path: path.resolve(__dirname, './static'),
  },

  plugins: [
    // 分割css插件
    new ExtractTextWebpackPlugin({
      filename: '[name]/[name].css',
      allChunks: true,
    }),

    //   //配置html模板，因为是多页面，所以需配置多个模板
    // new HtmlWebpackPlugin({
    //  title:'测试',//html标题
    //  filename:'./videotest.html',//文件目录名
    //  template:'./map/videotest.html',//文件模板目录
    //  hash:true,//是否添加hash值
    //  chunks:['a'],//模板需要引用的js块，vendors是定义的公共块，index是引用的自己编写的块

    // }),

    //   new HtmlWebpackPlugin({

    //    title:'页面一',
    //    filename:'./b/b.html',
    //    template:'./src/page2/b.html',
    //    hash:true,
    //    chunks:['b'],

    //   }),


    // new CleanWebpackPlugin(),

  ],

  module: {
    rules: [
      { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader' },
      { test: /\.css/, use: ExtractTextWebpackPlugin.extract({ use: ['css-loader'] }) }, // 带css的css编译
      {
        test: /\.less$/,
        exclude: [/icomoon\/style.css$/, /icomoon\\style.css$/, /global.css$/],
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              // Note that we’ve set importLoaders: 1 on css-loader.
              // We’re setting this because we want PostCSS to git @import statements first
              modules: true,
              importLoaders: 1,
              localIdentName: '[path][name]__[local]--[hash:base64:5]',
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              plugins: loader => [
                require('postcss-import')(),
                require('postcss-cssnext')({
                  browsers: [
                    'last 2 Chrome versions',
                    'last 2 Edge versions',
                    'last 2 Safari versions',
                    'last 2 Firefox versions',
                  ],
                }),
              ],
            },
          },
        ],
      },
      // eslint-disable-next-line max-len
      // { test: /\.css/, use: ExtractTextWebpackPlugin.extract({ use: ['css-loader'] }) }, // 带css的css编译
      { test: /\.scss/, use: ExtractTextWebpackPlugin.extract({ fallback: 'style-loader', use: ['css-loader', 'sass-loader'] }) }, // 带scss的css编译
      { test: /\.(svg|jpg|jpeg|gif|woff|woff2|eot|ttf|otf)$/, use: [{ loader: 'file-loader', options: { outputPath: 'assets/' } }] }, // 图片和字体加载
      { test: /\.png$/, use: { loader: 'url-loader', options: { mimetype: 'image/png', limit: '4096' } } }, // 如果有png格式的图片，超过4M直接转化为base64格式
      {
        test: /\.html$/,
        use: {
          loader: 'html-loader',
          options: { // 打包html文件
            minimize: true, // 是否打包为最小值
            removeComments: true, // 是否移除注释
            collapseWhitespace: true, // 是否合并空格
          },
        },
      },
    ],
  },
  // webpack-dev-server的配置
  devServer: {
    contentBase: path.join(__dirname, './static/'),
    historyApiFallback: true,
    hot: true,
    inline: true,
    progress: true,
    port: 6080,
    watchOptions: {
      aggregateTimeout: 300,
    },
    // proxy: {
    //   '/video': 'http://10.6.6.58',
    // },
  },


};


module.exports = config;
