## 安装

`npm i @baosisi07/wx-mini-cli -g`

## 命令行使用

项目使用案例可参考 [项目地址](https://github.com/baosisi07/taro-app)

通过在项目下添加以下两个文件实现自定义配置：

1. 查看命令行工具版本

   `mini-wechat-cli -v`

2. 查看帮助
   `mini-wechat-cli -h`

3. 初始化配置文件
   `mini-wechat-cli init`

   项目下会自动生成两个文件 `ci.version.json`（项目版本等信息） 和`ci.config.mjs`（项目配置文件）

   在 `ci.version.json` 文件中添加小程序信息
   项目下新建 key 目录保存下载下来的上传代码的密钥

4. 在打开开发者工具中打开

   `mini-wechat-cli open`

5. 创建页面或组件

   `mini-wechat-cli create`

6. 生成预览图

   `mini-wechat-cli preview`

7. 发布小程序

   `mini-wechat-cli publish`
