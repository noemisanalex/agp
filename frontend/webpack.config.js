const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';

  return {
    mode: isProduction ? 'production' : 'development', // Modo dinámico basado en el entorno
    entry: './src/index.js', // Punto de entrada de la aplicación
    output: {
      filename: isProduction ? '[name].[contenthash].js' : 'bundle.js', // Archivo de salida con hash en producción
      path: path.resolve(__dirname, 'dist'), // Carpeta de salida
      publicPath: '/', // Importante para React Router
      clean: true, // Limpia la carpeta dist antes de cada construcción
    },
    resolve: {
      extensions: ['.js', '.jsx'], // Extensiones soportadas
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/, // Soporte para archivos JavaScript y JSX
          exclude: /node_modules/,
          use: 'babel-loader',
        },
        {
          test: /\.css$/, // Soporte para archivos CSS
          use: [
            isProduction ? MiniCssExtractPlugin.loader : 'style-loader', // Extrae CSS en producción
            'css-loader',
            'postcss-loader',
          ],
        },
        {
          test: /\.(png|jpe?g|gif|svg|webp)$/i, // Soporte para imágenes
          type: 'asset/resource',
        },
        {
          test: /\.(mp4|webm|ogg|mp3|wav)$/i, // Soporte para archivos multimedia
          type: 'asset/resource',
        },
        {
          test: /\.(woff(2)?|eot|ttf|otf)$/i, // Soporte para fuentes
          type: 'asset/resource',
        },
      ],
    },
    devtool: isProduction ? 'source-map' : 'inline-source-map', // Mapas de código para depuración
    devServer: {
      historyApiFallback: true, // Soporte para React Router
      port: 3100, // Puerto del servidor de desarrollo
      hot: true, // Recarga en caliente
      open: true, // Abre el navegador automáticamente
      static: {
        directory: path.join(__dirname, 'public'), // Carpeta pública
      },
      client: {
        overlay: true, // Muestra errores en el navegador
      },
    },
    plugins: [
      new webpack.HotModuleReplacementPlugin(), // Habilita HMR
      new HtmlWebpackPlugin({
        template: './public/index.html', // Plantilla HTML
        favicon: './public/favicon.ico', // Favicon
      }),
      new MiniCssExtractPlugin({
        filename: isProduction ? '[name].[contenthash].css' : 'styles.css', // Archivo CSS con hash en producción
      }),
      new CopyWebpackPlugin({
        patterns: [
          { from: 'public/imagenes', to: 'imagenes', noErrorOnMissing: true }, // Copia imágenes
          { from: 'public/videos', to: 'videos', noErrorOnMissing: true }, // Copia videos
          { from: 'public/sonidos', to: 'sonidos', noErrorOnMissing: true }, // Copia sonidos
        ],
      }),
      // Define variables de entorno
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(isProduction ? 'production' : 'development'),
      }),
    ],
    optimization: {
      splitChunks: {
        chunks: 'all', // Divide el código en múltiples bundles para optimización
      },
    },
  };
};