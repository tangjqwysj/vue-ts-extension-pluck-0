const vscode = require("vscode")
const getBasePath = require('../FileManager').getBasePath
const FileManager = require('../FileManager')
const path = require("path")

function renameFile(context) {
  context.subscriptions.push(vscode.commands.registerCommand('extension.rename', async function (ele) {
    // console.log('path:' + JSON.stringify(ele, null, 2))
    const base = await getBasePath(ele.des)
    const fm = new FileManager.default(base)
    const dirname = path.dirname(ele.des)

    await vscode.window.showInputBox(
      {
        password: false,
        ignoreFocusOut: false,
        placeHolder: '随便输',
        prompt: '输入',
      }).then(async function (msg) {
        try {
          if (!msg.endsWith('.js')) {
            msg = msg + '.js'
          }
          const base_t = await getBasePath(path.join(dirname, msg))
          await fm.rename(base.path, base_t.path, { overwrite: false })
          if (path.parse(base.path.fsPath).dir.includes('remoteCode')) {
            await vscode.commands.executeCommand('extension.refreshRemote')
          } else {
            await vscode.commands.executeCommand('extension.refreshLocal')
          }

        } catch (err) {
          console.log(err)
        }
      })
  }))
}
exports.renameFile = renameFile