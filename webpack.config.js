'use strict';

const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebPackPlugin = require('html-webpack-plugin');

module.exports = {
    mode: 'production',

    entry: {
        // runner: path.resolve('./src/runner.js'),
        editor: path.resolve('./src/editor.js')
    },

    output: {
        filename: 'js/[name].bundle.js',
        path: path.resolve('./public/')
    },

    devtool: '#source-map',

    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: 'babel-loader'
            },
            {
                test: /\.(scss|sass|css)$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {loader: 'css-loader', options: {url: false, sourceMap: true}},
                    {loader: 'sass-loader', options: {sourceMap: true}}
                ],
            },
            // only for editor
            {
                test: /\.html$/,
                use: [
                    {
                    loader: "html-loader"
                    }
                ]
            }
            // only for editor
        ]
    },
    plugins: [
        // only for editor
        new HtmlWebPackPlugin({
            template: "./src/index.html",
            filename: "./index.html"
          }),
        // only for editor
        
        new MiniCssExtractPlugin({
            filename: "css/[name].bundle.css",
        }),        
    ]
};
