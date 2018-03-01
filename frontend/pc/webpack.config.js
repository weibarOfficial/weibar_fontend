const path = require('path');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin')
const ExtractTextPlugin = require("extract-text-webpack-plugin");

const outputDir = path.resolve(__dirname, 'dist');

let extractCSS = null;

module.exports = function(env){
    var isProduction = env && env.production;
    console.log('isProduction:', isProduction);

    var plugins = [];
    if(isProduction){
        plugins.push(new CleanWebpackPlugin(outputDir));
        plugins.push(new UglifyJSPlugin());
        extractCSS = new ExtractTextPlugin('style/[name].[contenthash:8].css');
    }else{
        extractCSS = new ExtractTextPlugin('style/[name].css');
    }
    
    plugins.push(extractCSS);
    plugins.push(new HtmlWebpackPlugin({
        filename: 'index.html',
        template: './src/index.html'
    }));

    return {
        entry: {
            index: './src/js/index.js'
        },
        devtool: 'inline-source-map',
        plugins: plugins,
        devServer: {
            host: 'www.yylive.com',
            openPage: 'index.html?DEBUG',
            contentBase: './src',
            port: 80,
            proxy: [{
                context: ["/pc"],
                // target: "http://120.79.153.237",
                // target: "www.yylive.com",
                target: 'http://47.100.24.214' // 线上
            },{
                context: ["/static"],
                target: "http://www.yylive.com",
                pathRewrite:{"/static": ""}
            }],
        },
        output: {
            filename: isProduction ? 'js/[name].[chunkhash:8].js' : '[name].js',
            path: outputDir,
            publicPath: isProduction ? '//www.yylive.com/static/pc/' : '/',
        },
        module: {
            rules: [
                { test: /\.js$/, exclude: /node_modules/, use: 'babel-loader' },
                {
                    test: /\.styl$/,
                    use: extractCSS.extract({
                        use: [{
                            loader: 'css-loader',
                            options:{
                                minimize: isProduction
                            }
                        },{
                            loader: 'stylus-loader'
                        }]
                    })
                },{
                    test: /\.(png|jpe?g|gif)$/,
                    use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 1,
                            // 图片暂时不加Hash，等静态资源单独发布再处理。
                            name: 'images/[name].[ext]'
                        }
                    }
                    ]
                }
            ]
        }
    };
}