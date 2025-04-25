const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: './src/index.js',
  output: {
    filename: 'bundle.[contenthash].js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/', // ⚠️ ESTO ES CRÍTICO para que funcionen rutas como /login o /dashboard
    clean: true,
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader'],
      },
      {
        test: /\.(png|jpe?g|gif|svg|webp)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.(woff(2)?|eot|ttf|otf)$/i,
        type: 'asset/resource',
      },
    ],
  },
  optimization: {
    minimize: true,
    minimizer: [new CssMinimizerPlugin(), new TerserPlugin()],
    splitChunks: {
      chunks: 'all',
    },
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
      favicon: './public/favicon.ico',
      minify: {
        collapseWhitespace: true,
        removeComments: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeRedundantAttributes: true,
        minifyCSS: true,
        minifyJS: true,
        minifyURLs: true,
        keepClosingSlash: true,
      },
    }),
    new MiniCssExtractPlugin({
      filename: 'styles.[contenthash].css',
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: 'public/imagenes', to: 'imagenes', noErrorOnMissing: true },
        { from: 'public/videos', to: 'videos', noErrorOnMissing: true },
        { from: 'public/sonidos', to: 'sonidos', noErrorOnMissing: true },
      ],
    }),
  ],
};
