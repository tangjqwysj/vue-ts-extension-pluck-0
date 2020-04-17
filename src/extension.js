'use strict'

Object.defineProperty(exports, "__esModule", { value: true })

const vscode = require("vscode")
const treeView = require("./sideBarView/treeView")

const QuickPick_1 = require("./QuickPick")
const QuickPick_2 = require('./QuickPick2')
const path = require("path")


async function getBasePath(mPath) {
	return {
		path: vscode.Uri.file(mPath),
		type: 'file'
	}
}

const treeViewProvider = new treeView.TreeViewProvider()
exports.default = treeViewProvider
/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {


	vscode.window.registerTreeDataProvider('treeView', treeViewProvider)


	vscode.commands.registerCommand('extension.refreshEntry', () => treeViewProvider.refresh())


	context.subscriptions.push(vscode.commands.registerCommand('extension.showFileContent', function (path) {
		// console.log('path:' + JSON.stringify(path, null, 2))
		vscode.window.showTextDocument(vscode.Uri.file(path), { preview: false }).then(() => { }, (error) => {
			vscode.window.showWarningMessage(error.message)
		})
	}))

	let disposable = vscode.commands.registerCommand('extension.addFile', async (path) => {
		// console.log('mPath:' + JSON.stringify(path, null, 2))
		// 这里有点诡异，传出来的居然是element对象
		const base = await getBasePath(path.des)
		if (!base) {
			return
		}
		const qp = new QuickPick_1.default(base)
		qp.show()
	})
	context.subscriptions.push(disposable)

	context.subscriptions.push(vscode.commands.registerCommand('extension.addOriginDir', async () => {

		const base = await getBasePath(path.join(__dirname, 'sideBarView/userCode'))
		if (!base) {
			return
		}
		const qp = new QuickPick_2.default(base)
		qp.show()
	}))
}

exports.activate = activate

function deactivate() { }

module.exports = {
	activate,
	deactivate
}
