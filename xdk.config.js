export default {

    // 小程序路径(可选，默认当前目录)
    entry: './src',
  
    // 小程序输出文件(可选，默认等于entry)
    // 使用gulp，webpack等打包工具开发会导致开发者编辑文件目录和微信编辑器使用目录不同，需要手动进行指定
    output: './dist',
  
    // 模版文件夹目录(可选，默认使用cli默认模版，使用默认模版情况下false即可)
    template: './template',
  
    // 发布体验版功能的钩子
    publishHook: {
  
        // 发布之前（注：必须返回一个Promise对象）
        // 参数answer 为之前回答一系列问题的结果
        before(answer) {
            this.log('publish before')
            // this.spawnSync('gulp', [`--env=${answer.isRelease ?'online' : 'stage'}`]);
            return Promise.resolve();
        },
  
        // 发布之后（注：必须返回一个Promise对象）
        async after(answer) {
            this.log('publish after')
            // 是否提交git commit
            let {isCommitGitLog} = await inquirerGitCommit.call(this);
  
            // 当为正式版本时进行的操作
            if (!!answer.isRelease) {
                // 修改本地version code
                // await rewriteVersionCode.call(this);
  
                // 提交git log
                !!isCommitGitLog && await commitGitLog.call(this);
            }
  
            return Promise.resolve();
        }
    },
  
    // 自定义命令
    // 自定义指令需要用 run 来执行，例如 xdk-cli run dev
    customScripts: [
        {
            name: 'dev',
            desc: '开发模式',
            async callback() {
                // let {env} = await inquirerEnvAsync.call(this);
                // this.spawn('gulp', [`--env=${env}`, '--watch']);
                // return Promise.resolve();
            }
        }
    ],
  };
  
  // 询问是否提交git记录
  function inquirerGitCommit() {
    return this.inquirer.prompt([
        {
            type: 'confirm',
            name: 'isCommitGitLog',
            message: '是否提交git log ?'
        }
    ])
  }
  
  // 提交git commit 到log
  function commitGitLog() {
    return new Promise((resolve, reject) => {
        this.spawnSync('git', ['add', '.']);
        this.spawnSync('git', ['commit', '-m', `docs: 更改版本号为${versionConf.version}`]);
        resolve();
    });
  }
  