'use strict';

const path = require('path');
const HtmlWebPackPlugin = require('html-webpack-plugin');

const base = require('./webpack.config.common')

const config = Object.assign({}, base)


config.entry = {
    editor: path.resolve('./src/editor.js'),
    'runner-for-editor': path.resolve('./src/Editor/runner/runner-for-editor.js'),
}

config.output = {
    filename: 'js/[name].bundle.js',
    path: path.resolve('./public/')
}

config.module.rules.push({
    test: /\.html$/,
    use: [
        {
            loader: "html-loader"
        }
    ]
})

config.plugins.push(
    new HtmlWebPackPlugin({
        template: "./src/index.html",
        inject: false,
        filename: "./index.html"
    }),
    new HtmlWebPackPlugin({
        template: "./src/Editor/runner/index.html",
        inject: false,
        filename: "./runner-for-editor.html"
    })
)

module.exports = config