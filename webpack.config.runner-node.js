'use strict';

const path = require('path');

const base = require('./webpack.config.common').base

const config = Object.assign({}, base)

config.target = "node"
config.node = { __dirname: false }

config.entry = {
    "node-runner": path.resolve('./src/node-runner.js'),
    "node-runner-for-editor": path.resolve('./src/Editor/runner/node-runner-for-editor.js'),
}

config.output = {
    filename: '[name].js',
    path: path.resolve('./build/')
}

module.exports = config
