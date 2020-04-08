'use strict'
Object.defineProperty(exports, "__esModule", { value: true })
const vscode = require("vscode")
const nodeDependencies_1 = require("./sideBarView/nodeDependencies")


/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	const nodeDependenciesProvider = new nodeDependencies_1.DepNodeProvider(vscode.workspace.rootPath)
	vscode.window.registerTreeDataProvider('nodeDependencies', nodeDependenciesProvider)


	let disposable = vscode.commands.registerCommand('extension.helloWorld', function (doc) {
		console.log(doc)

		vscode.window.showTextDocument(vscode.Uri.file(doc), { preview: false }).then(() => {
			vscode.window.showInformationMessage('doc:' + doc)
		})
	})

	context.subscriptions.push(disposable)

}
exports.activate = activate

function deactivate() { }

module.exports = {
	activate,
	deactivate
}
