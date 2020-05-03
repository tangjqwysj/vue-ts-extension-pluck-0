const vscode = require("vscode")
const cookie = require('../utils/store').cookie

function remoteLogin(context) {
  context.subscriptions.push(vscode.commands.registerCommand('extension.remoteLogin', async () => {
    //登录成功，cookie.token被赋值,不成功，cookien.token仍为空
    cookie.token = '哗啦啦'
    if (cookie.token) {
      await vscode.commands.executeCommand('extension.refreshRemote')
    }
  }))
}
exports.remoteLogin = remoteLogin