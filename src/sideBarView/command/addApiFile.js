const vscode = require("vscode")
const getBasePath=require('../FileManager').getBasePath
const addFileQuickPick=require('../addFileQuickPick')

function addApiFile(context){
  context.subscriptions.push(vscode.commands.registerCommand('extension.addFile', async (ele) => {
		const base = await getBasePath(ele.des)
		if (!base) {
			return
		}
		const qp = new addFileQuickPick.default(base)
		qp.show()
	}))
}
exports.addApiFile=addApiFile