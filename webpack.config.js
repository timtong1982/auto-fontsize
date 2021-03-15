const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const distFolder = 'dist';

module.exports = {
    mode: 'development',
    entry: './demo/bootstrap.tsx',
    output: {
        path: path.resolve(__dirname, distFolder),
        publicPath: '/',
        filename: 'autofontsize.js',
    },
    devtool: 'source-map',
    devServer: {
        contentBase: '/',
        compress: true,
        port: 8011,
        hot: true,
        inline: false
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
                options:{
                    configFile: path.resolve(__dirname, 'tsconfig.json')
                },
                exclude: /node_modules/
            },
            {
                enforce: 'pre',
                test: /\.js$/,
                loader: 'source-map-loader'
            }
        ]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
        plugins:[
            new TsConfigPathsPlugin()
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './demo/template.html'
        })
    ]
};
