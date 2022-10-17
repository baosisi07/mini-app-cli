import inquirer from 'inquirer'
import Utils from '../utils/index.js'
import Config from '../config.js'
import Log from '../log.js'
import path from 'path'
const questions = [
    {
        name: 'mode',
        type: 'list',
        message: '请选择想要创建的模版',
        choices: ['page', 'component']
    },
    {
        type: 'input',
        name: 'fileName',
        message: (anwser) => `请输入${anwser.mode}文件名称：(e.g: index):`,
        validate(input) {
            let done = this.async();
            // 输入不得为空
            if (input === '') {
                done('You must input name!!!');
                return;
            }
            done(null, true);
        }
    }
]
// 创建页面
const createPage = function (name, userConf) {
    const templateRoot = path.join(userConf.template||Config.template, 'page')
    if (!Utils.checkFileExist(templateRoot)) {
        Log.err(`未找到模版文件, 请检查当前文件目录是否正确，path: ${templateRoot}`);
        return;
    }
    const pageRoot = path.join(Config.entry, 'pages', name)
    const isExist = Utils.checkFileExist(pageRoot)
    if (isExist) {
        Log.err(`当前页面已存在，请重新确认, path: ${pageRoot}`);
        return;
    }
    let arr = Utils.readDir(templateRoot)
    Utils.createDir(pageRoot)
    Utils.copyFileArr(templateRoot, `${pageRoot}/${name}`, arr)
    Log.success(`createPage success, path: ${pageRoot}`)
}
// 创建组件
const createComponent = function (name, userConf) {
    const templateRoot = path.join(userConf.template||Config.template, 'component')
    if (!Utils.checkFileExist(templateRoot)) {
        Log.err(`未找到模版文件, 请检查当前文件目录是否正确，path: ${templateRoot}`);
        return;
    }
    const componentRoot = path.join(Config.entry, 'components', name)
    const isExist = Utils.checkFileExist(componentRoot)
    if (isExist) {
        Log.err(`当前组件已存在，请重新确认, path: ${componentRoot}`);
        return;
    }
    let arr = Utils.readDir(templateRoot)
    Utils.createDir(componentRoot)
    Utils.copyFileArr(templateRoot, `${componentRoot}/${name}`, arr)
    Log.success(`createComponent success, path: ${componentRoot}`)
}
export default function (userConf) {
    inquirer.prompt(questions).then(anwser => { 
        console.log(anwser);
        const { mode, fileName } = anwser
        if (mode === 'page') {
            createPage(fileName, userConf)
        } else if (mode === 'component') {
            createComponent(fileName, userConf)
        }
    })
}