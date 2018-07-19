const path = require('path');
const webPack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const distFolder = 'dist';

module.exports = {
    mode: 'development',
    entry: { demo: './src/demo/bootstrap.tsx' },
    output: {
        path: path.resolve(__dirname, distFolder),
        filename: 'dynamictext.js',
        library: 'DynamicText',
        libraryTarget: 'umd'
    },
    devtool: 'source-map',
    devServer: {
        contentBase: path.join(__dirname, distFolder),
        compress: true,
        port: 8011,
        hot: true
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'awesome-typescript-loader',
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
        extensions: ['.tsx', '.ts', '.js']
    },
    externals: {
        react: 'React',
        'react-dom': 'ReactDOM'
    },
    plugins: [
        new webPack.HotModuleReplacementPlugin(),
        new HtmlWebpackPlugin({
            template: './test/template.html'
        })
    ]
};
