const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');
const { extendDefaultPlugins } = require('svgo');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
  mode: 'production', // build เป็น mode production
  entry: {
    main: "./src/index.js", // ตั้งชื่อ javascript ของเราว่า main
    dependencies: "./src/dependencies.js", // ตั้งชื่อ javascript ของ bootstap ว่า dependencies
  },
  output: { // path ไฟล์ output ที่จะให้ webpack สร้าง
    path: path.resolve(__dirname, 'dist'),
    filename: '[name]-[contenthash].js', // เปลี่ยนจาก main เป็นชื่อตาม entry ที่เราตั้งไว้
    // export asset ตาม path เดิม นามสกุลเดิม แต่เพิ่ม hash
    assetModuleFilename: '[path][name]-[hash][ext]', 
  },
  devServer: {
    contentBase: './dist',
  },
  module: {
    rules: [
      {
        test: /\.html$/i, // ถ้าเจอไฟล์ .html
        loader: 'html-loader', // ใช้ html-loader
      },
      {
        test: /\.(png|jpe?g|gif)$/i, // ถ้าเจอไฟล์รูป
        type: 'asset/resource' // บอก webpack ว่าเป็น asset
      },
      {
        test: /\.s[ac]ss$/i, // ถ้าเจอไฟล์ .css, .scss, .sass
        use: [
          MiniCssExtractPlugin.loader, // สร้างไฟล์ CSS จาก CommonJS
          "css-loader", // แปลง CSS เป็น CommonJS
          "sass-loader", // แปลง SASS เป็น CSS
        ],
      },
    ],
  },
  optimization: {
    minimizer: [
      `...`, // extend existing minimizer
      new CssMinimizerPlugin({
        minimizerOptions: {
          preset: [
            'default',
            { discardComments: { removeAll: true } },
          ],
        },
      }), // minimize CSS
    ],
  },
  plugins: [
    new BundleAnalyzerPlugin({ analyzerMode: 'static' }),
    new HtmlWebpackPlugin({
      template: 'index.html', // ก๊อป template จาก index.html
    }),
    new MiniCssExtractPlugin({
      filename: '[name]-[contenthash].css',
    }),
    new ImageMinimizerPlugin({
      minimizerOptions: {
        plugins: [
          ['gifsicle', { interlaced: true }],
          ['jpegtran', { progressive: true }],
          ['optipng', { optimizationLevel: 5 }],
          ['svgo', {
            plugins: extendDefaultPlugins([
              { name: 'removeViewBox', active: false },
              {
                name: 'addAttributesToSVGElement',
                params: {
                  attributes: [{ xmlns: "http://www.w3.org/2000/svg" }],
                },
              },
            ]),
          }],
        ],
      },
    })
  ]
}
