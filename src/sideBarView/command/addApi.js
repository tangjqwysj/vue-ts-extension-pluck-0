const vscode = require("vscode")
const getBasePath = require('../FileManager').getBasePath
const path = require("path")
const addOriTepQuickPick = require('../addOriTepQuickPick')

function addApi(context) {
  context.subscriptions.push(vscode.commands.registerCommand('extension.addOriginDir', async () => {
    const base = await getBasePath(path.join(__dirname, '..', 'userCode'))
		if (!base) {
      return
    }
    const qp = new addOriTepQuickPick.default(base)
    qp.show()
  }))
}
exports.addApi = addApi