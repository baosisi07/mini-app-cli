## 安装

`npm i @baosisi07/wx-mini-cli -g`

## 命令行使用

项目使用案例可参考 [项目地址](https://github.com/baosisi07/taro-app)

通过在项目下添加以下两个文件实现自定义配置：

- 项目配置文件 [ci.config.js/ci.config.mjs](https://github.com/baosisi07/taro-app/blob/main/ci.config.js)
- 项目版本等信息 [ci.version.json](https://github.com/baosisi07/taro-app/blob/main/ci.version.json)

1. 查看命令行工具版本

   `mini-wechat-cli -v`

2. 在打开开发者工具中打开

   `mini-wechat-cli open`

3. 创建页面或组件

   `mini-wechat-cli create`

4. 生成预览图

   `mini-wechat-cli preview`

5. 发布小程序

   `mini-wechat-cli publish`
