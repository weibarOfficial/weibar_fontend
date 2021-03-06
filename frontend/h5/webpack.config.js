const path = require('path');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin')
const ExtractTextPlugin = require("extract-text-webpack-plugin");

const outputDir = path.resolve(__dirname, 'dist');
const entry = {
    index: './src/js/index/index.js',
    talk: './src/js/talk/talk.js',
    redbag: './src/js/redbag.js',
    withdraw: './src/js/withdraw.js',
    withdrawHistory: './src/js/withdrawHistory.js',
    choose: './src/js/choose.js'
};

let extractCSS = null;
module.exports = function(env){
    var isProduction = env && env.production;
    var plugins = [];
    if(isProduction){
        plugins.push(new CleanWebpackPlugin(outputDir));
        plugins.push(new UglifyJSPlugin());
        extractCSS = new ExtractTextPlugin('style/[name].[contenthash:8].css');
    }else{
        extractCSS = new ExtractTextPlugin('style/[name].css');
    }
    
    plugins.push(extractCSS);
    for(let p in entry){
        plugins.push(new HtmlWebpackPlugin({
            filename: `${p}.html`,
            template: `./src/${p}.html`,
            chunks: [p]
        }));
    }
    return {
        entry: entry,
        devtool: 'inline-source-map',
        plugins: plugins,
        devServer: {
            host: 'www.yylive.com',
            contentBase: './src',
            port: 80,
            proxy: [{
                context: ["/h5","/test","/wechat","/websocket"],
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
            publicPath: isProduction ? '//www.yylive.com/static/' : '/',
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
                    test: /\.css$/,
                    use: extractCSS.extract({
                        use: [{
                            loader: 'css-loader',
                            options:{
                                minimize: isProduction
                            }
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