import Config from '../config.js'
import inquirer from 'inquirer'
import Log from '../log.js'
import fs from 'fs' 
import ci from 'miniprogram-ci'

function getQuestions() {
    return [
        {
            type: 'input',
            name: 'desc',
            message: '请输入备注',
            default: ''
        },
        {
            type: 'input',
            name: 'pagePath',
            message: '请输入预览页面路径',
            default: ''
        },
        {
            type: 'input',
            name: 'searchQuery',
            message: `设置页面参数：(例如：a=1\&b=2)`,
            default: '',
            when(answer) {
                return !!answer.pagePath
            }
        }
    ]
}

export default async function (userConf) {
    // 版本配置文件路径    
    const versionConfPath = Config.dir_root + '/ci.version.json' 
    const versionConf = JSON.parse(fs.readFileSync(versionConfPath))
    // 交互式命令
    const answer = await inquirer.prompt(getQuestions())
    console.log(answer)
 
    // 预览体验版
    const project = new ci.Project({
        appid: versionConf.appid,
        type: 'miniProgram',
        projectPath: `${Config.dir_root}`,
        privateKeyPath: versionConf.privateKeyPath,
        ignores: ['node_modules/**/*'],
    })
    
      const previewResult = await ci.preview({
        project,
        desc: answer.desc, // 此备注将显示在“小程序助手”开发版列表中
        setting: {
            // es6: true,
            minify: true
        },
        qrcodeFormat: 'image',
        qrcodeOutputDest: `${Config.dir_root}/qrcode.jpg`,
        onProgressUpdate: console.log,
        ...(!!answer.pagePath ? {pagePath: answer.pagePath, searchQuery: answer.searchQuery } : {} ), // 预览页面
        // searchQuery: 'a=1&b=2',  // 预览参数 [注意!]这里的`&`字符在命令行中应写成转义字符`\&`
      })
      console.log(previewResult)

    
}