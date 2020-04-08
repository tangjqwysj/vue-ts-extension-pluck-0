'use strict'
Object.defineProperty(exports, "__esModule", { value: true })
const vscode = require("vscode")
const treeView = require("./sideBarView/treeView")


/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	vscode.window.registerTreeDataProvider('treeView', new treeView.TreeViewProvider(vscode.workspace.rootPath))


	context.subscriptions.push(vscode.commands.registerCommand('extension.showFileContent', function (path) {
		vscode.window.showTextDocument(vscode.Uri.file(path), { preview: false }).then(() => {
		})
	}))

}
exports.activate = activate

function deactivate() { }

module.exports = {
	activate,
	deactivate
}
