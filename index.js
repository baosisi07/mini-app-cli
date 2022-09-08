#!/usr/bin/env babel-node
import fs from 'fs'
const packageJson = JSON.parse(fs.readFileSync('./package.json'))
import { Command } from 'commander'
import createProgram from './lib/creatFile.js'
import publishWeApp from './lib/publishWeApp.js'
import Config from './config.js'
import Utils from './utils/index.js'
import Log from './log.js'
import path from 'path'
import chalk from 'chalk'
const program = new Command();

let userConf = null
// 设置版本号
program.version(packageJson.version, '-v, --version');
program.command('create').description('创建页面或组件').action((cmd, op) => createProgram(cmd))
program.command('publish').description('发布体验版').action((cmd, op) => publishWeApp(getUserConf()) )
// 自定义指令
program
    .command('run <cmd>')
    .description('当前<cmd>包含: ' + getCustomScriptsDesc(getUserConf({level: 1})))
    .action(async (cmd, options) => {
        // 当前命令
        let curScript = getUserConf().customScripts.find((el, idx) => el.name === cmd);

        // 执行回调
        await curScript.callback.call(originPrototype, cmd, options);
    });

function setConfig(param) {
    // 小程序入口目录
    Config.entry  = path.resolve(path.join(Config.dir_root, param.entry || ''));

    // 小程序输出目录
    Config.output = path.resolve(path.join(Config.dir_root, param.output || param.entry || ''));
}
async function getUserConf({level = 2} = {}) {
    const userConfPath = `${Config.dir_root}/xdk.config.js`
    if (!Utils.checkFileExist(userConfPath)) {
        if (level == 2) {
            Log.err('当前项目尚未创建xdk.config.js文件');
            return process.exit(1);
        } else {
            return null
        }
        
    }

    let data = userConf = await import(userConfPath)
    if (!!data.template) {
        Config.template = path.resolve(path.join(Config.dir_root, data.template))
    }

    setConfig(data)
    return data
}
// 获取自定义指令描述信息     
function getCustomScriptsDesc(param) {
    return (param?.customScripts?.length) 
                ? (param.customScripts.map(el => chalk.yellow(el.name) + ' -> ' + chalk.blue(el.desc)).join(' | '))
                : '当前项目尚无自定义命令';
}
// 输出文本
program.parse(process.argv)
