const vscode = require('vscode')
const fs = require('fs')
const path = require('path')
const util = require('./utils/util')
const cookie = require('./utils/store').cookie

/**
 * 从某个HTML文件读取能被Webview加载的HTML内容
 * @param {*} context 上下文
 * @param {*} templatePath 相对于插件根目录的html文件相对路径
 */
function getWebViewContent(context, templatePath) {
  const resourcePath = util.getExtensionFileAbsolutePath(context, templatePath)
  const dirPath = path.dirname(resourcePath)
  let html = fs.readFileSync(resourcePath, 'utf-8')
  // vscode不支持直接加载本地资源，需要替换成其专有路径格式，这里只是简单的将样式和JS的路径替换
  html = html.replace(/(<link.+?href="|<script.+?src="|<img.+?src=")(.+?)"/g, (m, $1, $2) => {
    return $1 + vscode.Uri.file(path.resolve(dirPath, $2)).with({ scheme: 'vscode-resource' }).toString() + '"'
  })
  return html
}

/**
 * 执行回调函数
 * @param {*} panel 
 * @param {*} message 
 * @param {*} resp 
 */
async function invokeCallback(panel, message, resp) {
  console.log('回调消息：', resp)
  // 错误码在400-600之间的，默认弹出错误提示
  cookie.token = '哗啦啦'
  if (typeof resp == 'object' && resp.code && resp.code >= 400 && resp.code < 600) {
    util.showError(resp.message || '发生未知错误！')
  }
  // axios返回cookie值哗啦啦————————————————————————————————————————————
  if (cookie.token) {
    await vscode.commands.executeCommand('extension.refreshRemote')
  }
  panel.webview.postMessage({ cmd: 'vscodeCallback', cbid: message.cbid, data: resp })
}

const messageHandler = {
  // 弹出提示
  alert(global, message) {
    util.showInfo(message.info)
  },

  onSubmit(global, message) {
    invokeCallback(global.panel, message, { code: 0, text: '成功' })
  }
}

module.exports = function (context) {
  vscode.commands.registerCommand('extension.openLoginWebview', function () {
    if (cookie.token) return false
    const panel = vscode.window.createWebviewPanel(
      'testWebview', // viewType
      "WebView演示", // 视图标题
      vscode.ViewColumn.One, // 显示在编辑器的哪个部位
      {
        enableScripts: true,// 启用JS，默认禁用
        retainContextWhenHidden: true // webview被隐藏时保持状态，避免被重置
      }
    )
    let global = { panel }
    panel.webview.html = getWebViewContent(context, 'src/sideBarView/views/loginView.html')
    panel.webview.onDidReceiveMessage(message => {
      if (messageHandler[message.cmd]) {
        messageHandler[message.cmd](global, message)
      } else {
        util.showError(`未找到名为 ${message.cmd} 回调方法!`)
      }
      if (message.cmd === 'alert')
        setTimeout(() => {
          panel.dispose()
        }, 600)
    }, undefined, context.subscriptions)
  })
}
