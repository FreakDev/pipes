'use strict';

const path = require('path');
const HtmlWebPackPlugin = require('html-webpack-plugin');

const base = require('./webpack.config.common').web

const config = Object.assign({}, base)

config.entry = {
    runner: path.resolve('./src/runner.js'),
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
        template: "./src/runner.html",
        filename: "./runner.html"
    })
)

module.exports = config
