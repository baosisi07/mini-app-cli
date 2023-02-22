import Utils from '../utils/index.js'
import Config from '../config.js'
import Log from '../log.js'
import path from 'path'
export default function () {
    const templateRoot = path.join(Config.template, 'config')
    const configRoot = Config.dir_root

    let arr = Utils.readDir(templateRoot)
    for (let i = 0; i < arr.length; i++) {
        const isExist = Utils.checkFileExist(`${configRoot}/${arr[i]}`)
        if (isExist) {
            Log.err(`当前项目已存在${arr[i]}文件，请重新确认, path: ${configRoot}${arr[i]}`);
            return;
        }
        Utils.copyFile(`${templateRoot}/${arr[i]}`, `${configRoot}/${arr[i]}`)
    }

    Log.success(`配置文件创建完成, path: ${configRoot}, 请完善ci.version.json中的信息`)

}