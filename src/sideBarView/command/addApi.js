const vscode = require("vscode")
const getBasePath = require('../FileManager').getBasePath
const path = require("path")
const addOriTepQuickPick = require('../addOriTepQuickPick')
const file=require('../utils/file')

function addApi(context) {
  context.subscriptions.push(vscode.commands.registerCommand('extension.addOriginDir', async () => {
    const rPath=vscode.workspace.rootPath
    if (!rPath) {
      vscode.window.showInformationMessage('请在工作区打开一个文件夹')
      return
    }
    const userCodePath=path.join(rPath,'userCode')
    if(!file.isPathExists(userCodePath)){
      file.createDirectory(userCodePath)
    }
    const base = await getBasePath(userCodePath)
    const qp = new addOriTepQuickPick.default(base)
    qp.show()
  }))
}
exports.addApi = addApi