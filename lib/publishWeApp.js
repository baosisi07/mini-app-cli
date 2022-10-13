import Config from '../config.js'
import inquirer from 'inquirer'
import originPrototype from './originPrototype.js'
import Log from '../log.js'
import jsonFormat from "json-format"
import fs from 'fs' 
import ci from 'miniprogram-ci'

function getVersionChoices(version) {

    // 描述数组
    const vArrsDesc = ['raise major: ', 'raise minor: ', 'raise patch: ', 'raise alter: '];
    
    // 版本号(数组形态)
    let vArrs = version.split('.');

    // 版本号选项
    let choices = vArrsDesc.map((item, index, array) => {

        // 当配置文件内的版本号，位数不够时补0
        array.length > vArrs.length ? vArrs.push(0) : '';

        // 版本号拼接
        return vArrsDesc[index] + versionNext(vArrs, index)
    }).reverse();

    // 添加选项
    choices.unshift('no change');

    return choices;
}

// 增加版本号
function versionNext(array, idx) {
    let arr = [].concat(array);
    ++arr[idx];
    
    arr = arr.map((v, i) => i > idx ? 0 : v);
    
    // 当最后一位是0的时候, 删除
    if (!parseInt(arr[arr.length - 1]))  arr.pop();

    return arr.join('.');
}

function getQuestions({ version, versiondesc } = {}) {
    return [
        {
            type: 'confirm',
            name: 'isRelease',
            message: '是否为正式发布版本',
            default: true
        },
        {
            type: 'list',
            name: 'version',
            message: `设置上传的版本号：(当前版本${version})`,
            default: 1,
            choices: getVersionChoices(version),
            filter(opts) {
                if (opts === 'no change') {
                    return version
                }
                return opts.split(': ')[1]
            },
            when(answer) {
                return !!answer.isRelease
            }
        },
        {
            type: 'input',
            name: 'versiondesc',
            message: '改动描述',
            default: versiondesc
        },
        {
            type: 'input',
            name: 'robot',
            message: '输入发布的机器人（可选值：1～30）',
            default: 1
        }
    ]
}
function rewriteLocalVersion(filepath, versionConf) {
    return new Promise((resolve, reject) => {
        fs.writeFile(filepath, jsonFormat(versionConf), err => {
            if(err){
                Log.err(err);
                process.exit(1);
            }else {
                resolve();
            }
        })
    }) 
} 
export default async function (userConf) {
    // 版本配置文件路径    
    const versionConfPath = Config.dir_root + '/ci.version.json' 
    const versionConf = JSON.parse(fs.readFileSync(versionConfPath))
    // 获取版本配置
    console.log(versionConfPath, versionConf.version)
    // 交互式命令
    const answer = await inquirer.prompt(getQuestions(versionConf))
    console.log(answer)
    // 根据答案重写版本信息
    versionConf.version = answer.version || versionConf.version
    versionConf.versiondesc = answer.versiondesc
    // 发布前置钩子
    await userConf?.publishHook?.before.call(originPrototype, answer).catch(() => process.exit(1))

    // 上传体验版
    const project = new ci.Project({
        appid: versionConf.appid,
        type: 'miniProgram',
        projectPath: `${Config.dir_root}`,
        privateKeyPath: versionConf.privateKeyPath,
        ignores: ['node_modules/**/*'],
    })
    const uploadResult = await ci.upload({
        project,
        version: versionConf.version,
        desc: versionConf.versiondesc,
        setting: {
            es6: true,
            minify: true
        },
        robot: answer.robot,
        onProgressUpdate: console.log,
    })
    console.log(uploadResult)

    // 修改本地版本文件（为发行版时）
    !!answer.isRelease && await rewriteLocalVersion(versionConfPath, versionConf)

    // 发布后置钩子
    await userConf?.publishHook?.after.call(originPrototype, answer).catch(() => process.exit(1))
    Log.success(`上传体验版成功, 登录微信公众平台 https://mp.weixin.qq.com 获取体验版二维码`);
}