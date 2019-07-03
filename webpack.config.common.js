'use strict';

const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const base = {
    mode: 'development',

    devtool: '#source-map',

    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: 'babel-loader'
            }
        ]
    }
}

const web = Object.assign({}, base)

web.module.rules.push(
    {
        test: /\.(scss|sass|css)$/,
        use: [
            MiniCssExtractPlugin.loader,
            {loader: 'css-loader', query: {
                url: false, sourceMap: true,
                modules: true,
                localIdentName: '[name]__[local]___[hash:base64:5]'
            }},
            {loader: 'sass-loader', options: {sourceMap: true}}
        ],
    }
)
web.plugins = [
    new MiniCssExtractPlugin({
        filename: "css/[name].bundle.css",
    })
]


module.exports = { base, web }
