import path from 'path'

import { fileURLToPath } from 'url'

const __filenameNew = fileURLToPath(import.meta.url)

const __dirnameNew = path.dirname(__filenameNew)
export default {
    // 被执行js文件的绝对路径
    root: __dirnameNew,
    // 命令行运行时的工作目录
    dir_root: process.cwd(),

    // 小程序项目路径
    entry: './',

    // 项目编译输出文件夹
    output: './',

    // 小程序模版目录
    template: __dirnameNew + '/template'
}