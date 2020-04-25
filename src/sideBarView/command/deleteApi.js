const vscode = require("vscode")
const getBasePath = require('../FileManager').getBasePath
const FileManager = require('../FileManager')
const fs = require("fs")
const path = require("path")

function deleteApi(context) {
  context.subscriptions.push(vscode.commands.registerCommand('extension.delete', async function (ele) {
    // console.log('path:' + JSON.stringify(ele, null, 2))
    const base = await getBasePath(ele.des)
    const fm = new FileManager.default(base)
    const isDir = fs.lstatSync(ele.des).isDirectory()
    const str = isDir ? '文件夹' : '文件'

    await vscode.window.showInformationMessage(`是否确定要删除${str}"${ele.label}"`, '移动到回收站', '取消')
      .then(async function (select) {

        if (select === '移动到回收站') {
          if (!isDir) {
            await fm.delete(base.path, { recursive: false })
            if (vscode.window.activeTextEditor.document.uri.fsPath === base.path.fsPath)
              await vscode.commands.executeCommand('workbench.action.closeActiveEditor')
          } else {
            await fm.delete(base.path, { recursive: true })
          }

          if (path.parse(base.path.fsPath).dir.includes('remoteCode')) {
            // remoteTreeViewProvider.refresh()
            await vscode.commands.executeCommand('extension.refreshRemote')
          } else {
            // treeViewProvider.refresh()
            await vscode.commands.executeCommand('extension.refreshLocal')
          }
        } else {
          // console.log(select)
        }
      })
  }))
}
exports.deleteApi = deleteApi