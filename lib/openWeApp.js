import Config from '../config.js'
import Log from '../log.js'
import { spawnSync } from 'node:child_process'



export default async function (userConf) {
    // ide路径
    const idePath = userConf.idePath || '/Applications/wechatwebdevtools.app/' 
    const cliPath = `${idePath}Contents/MacOS/cli`

    // 上传体验版
    const {status} = spawnSync(cliPath, ['open', '--project', `${Config.dir_root}` ], {stdio: 'inherit'})
    if (status !== 0) process.exit(1)
   
    Log.success(`打开开发者工具成功`);
}