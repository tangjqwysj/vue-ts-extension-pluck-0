const vscode = require("vscode")


function remoteLogin(context) {
  context.subscriptions.push(vscode.commands.registerCommand('extension.remoteLogin', async () => {
    //登录成功，cookie.token被赋值,不成功，cookien.token仍为空
    await vscode.commands.executeCommand('extension.openLoginWebview')
    
  }))
}
exports.remoteLogin = remoteLogin