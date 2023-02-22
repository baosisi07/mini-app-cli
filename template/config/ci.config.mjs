import fs from 'fs'

const versionConf = JSON.parse(fs.readFileSync('./ci.version.json'))

export default  {

  // 小程序路径(可选，默认当前目录)
  entry: './src',
  open: './dist',
  // 小程序输出文件(可选，默认等于entry)
  output: './dist',
  // 模版文件夹目录(可选，默认使用cli默认模版，使用默认模版情况下false即可)
  template: '',

  // 发布体验版功能的钩子
  publishHook: {
      // 发布之前（注：必须返回一个Promise对象）
      // 参数answer 为之前回答一系列问题的结果
      before(answer) {
          this.log('publish before', answer)
          // this.spawnSync('gulp', [`--env=${answer.isRelease ?'online' : 'stage'}`]);
          return Promise.resolve();
      },

      // 发布之后（注：必须返回一个Promise对象）
      async after(answer) {
          this.log('publish after')
          // 是否提交git commit
        let res = await inquirerGitCommit.call(this);

          // 当为正式版本时进行的操作
          if (!!answer.isRelease) {
              // 提交git log
            if (!!res.isCommitGitLog) {
              await commitGitLog.call(this);
            }
          }

          return Promise.resolve();
      }
  },

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
  return new Promise((resolve) => {
    this.spawnSync('git', ['add', '.']);
    this.log('git add .')
    this.spawnSync('git', ['commit', '-m', `docs: 更改版本号为${versionConf.version}`]);
    this.log(`git commit -m "docs: 更改版本号为${versionConf.version}"`)
    resolve();
  });
}
