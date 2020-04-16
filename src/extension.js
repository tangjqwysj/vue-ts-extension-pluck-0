'use strict'

Object.defineProperty(exports, "__esModule", { value: true })

const vscode = require("vscode")
const treeView = require("./sideBarView/treeView")

const QuickPick_1 = require("./QuickPick")
const path = require("path")


async function getBasePath() {

		if (vscode.window.activeTextEditor) {
			return {
				path: vscode.window.activeTextEditor.document.uri,
				type: 'file'
			}
		} else {
			const mPath = path.join(__dirname, 'sideBarView/templateCode/todo/school')
			return {
				path: vscode.Uri.file(mPath),
				type: 'file'
			}
		}
}


const treeViewProvider = new treeView.TreeViewProvider(vscode.workspace.rootPath)
exports.default=treeViewProvider
/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {


	vscode.window.registerTreeDataProvider('treeView', treeViewProvider)


	vscode.commands.registerCommand('extension.refreshEntry', () => treeViewProvider.refresh())


	context.subscriptions.push(vscode.commands.registerCommand('extension.showFileContent', function (path) {
		vscode.window.showTextDocument(vscode.Uri.file(path), { preview: false }).then(() => { }, (error) => {
			vscode.window.showWarningMessage(error.message)
		})
	}))

	let disposable = vscode.commands.registerCommand('extension.addJsFile', async () => {
		const base = await getBasePath()
		if (!base) {
			return
		}
		const qp = new QuickPick_1.default(base)
		qp.show()
	})
	context.subscriptions.push(disposable)
}

exports.activate = activate

function deactivate() { }

module.exports = {
	activate,
	deactivate
}
