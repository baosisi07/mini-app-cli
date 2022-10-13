import Config from '../config.js'
import Log from '../log.js'
import { spawnSync } from 'node:child_process'
import path from 'path'

export default async function (userConf) {
    // ide路径
    const idePath = userConf.idePath || '/Applications/wechatwebdevtools.app/' 
    const cliPath = `${idePath}Contents/MacOS/cli`
    const openDir = path.resolve(path.join(Config.dir_root, userConf.open || ''));
    // 上传体验版
    const {status} = spawnSync(cliPath, ['open', '--project', `${openDir}` ], {stdio: 'inherit'})
    if (status !== 0) process.exit(1)
   
    Log.success(`打开开发者工具成功`);
}