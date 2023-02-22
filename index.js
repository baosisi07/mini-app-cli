#!/usr/bin/env babel-node
import fs from 'fs'
import minimist from 'minimist'
import createProgram from './lib/creatFile.js'
import createConfig from './lib/creatConfig.js'
import publishWeApp from './lib/publishWeApp.js'
import openWeApp from './lib/openWeApp.js'
import previewWeApp from './lib/previewWeApp.js'
import Config from './config.js'
import Utils from './utils/index.js'
import Log from './log.js'
import path from 'path'
import chalk from 'chalk'
const packagePath = path.resolve(path.join(Config.root, './package.json'))
const packageJson = JSON.parse(fs.readFileSync(packagePath))

let userConf = null

const args = minimist(process.argv.slice(2), {
    alias: {
        version: ['v'],
        help: ['h'],
    },
    boolean: ['version', 'help']
})
const _ = args._

if (args.version) {
    console.log(chalk.green(packageJson.version))
}
if (args.help) {
    console.log(chalk.green('mini-wechat-cli init 初始化配置文件'))
    console.log(chalk.green('mini-wechat-cli create 创建页面或组件模版'))
    console.log(chalk.green('mini-wechat-cli open 在微信开发工具打开项目'))
    console.log(chalk.green('mini-wechat-cli preview 生成预览二维码 会显示在小程序助手'))
    console.log(chalk.green('mini-wechat-cli publish 上传代码并发布版本'))
}
const command = _[0]
switch (command) {
    case 'init':
        createConfig()
        break;
    case 'create':
        createProgram(await getUserConf())
        break;
    case 'open':
        openWeApp(await getUserConf())
        break;
    case 'preview':
        previewWeApp(await getUserConf())
        break;
    case 'publish':
        publishWeApp(await getUserConf())
        break;
}

function setConfig(param) {
    // 小程序入口目录
    Config.entry = path.resolve(path.join(Config.dir_root, param.entry || ''));

    // 小程序输出目录
    Config.output = path.resolve(path.join(Config.dir_root, param.output || param.entry || ''));
}
async function getUserConf({ level = 2 } = {}) {
    let userConfPath = `${Config.dir_root}/ci.config.js`
    if (!Utils.checkFileExist(userConfPath)) {
        userConfPath = `${Config.dir_root}/ci.config.mjs`
        if (!Utils.checkFileExist(userConfPath)) {
            if (level == 2) {
                Log.err('当前项目尚未创建ci.config.js文件');
                return process.exit(1);
            } else {
                return null
            }
        }
    }
    let data = userConf = (await import(userConfPath)).default
    if (!!data.template) {
        Config.template = path.resolve(path.join(Config.dir_root, data.template))
    }

    setConfig(data)
    return data
}

