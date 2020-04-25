'use strict'

Object.defineProperty(exports, "__esModule", { value: true })

const vscode = require("vscode")
const treeView = require("./sideBarView/treeView")

const searchApi = require('./sideBarView/command/searchApi')
const deploy = require('./sideBarView/command/livedataDeploy')
const deleteApi = require('./sideBarView/command/deleteApi')
const addApi = require('./sideBarView/command/addApi')
const addApiFile = require('./sideBarView/command/addApiFile')
const renameFile = require('./sideBarView/command/renameFile')

const treeViewProvider = new treeView.TreeViewProvider('userCode')

function activate(context) {
	vscode.window.registerTreeDataProvider('treeView', treeViewProvider)

	vscode.commands.registerCommand('extension.refreshLocal', () => treeViewProvider.refresh())

	context.subscriptions.push(vscode.commands.registerCommand('extension.showFileContent', function (path) {
		vscode.window.showTextDocument(vscode.Uri.file(path), { preview: false }).then(() => {
		}, (error) => {
			vscode.window.showWarningMessage(error.message)
		})
	}))

	context.subscriptions.push(vscode.commands.registerCommand('extension.showRemoteFileContent', function (path) {
		vscode.window.showTextDocument(vscode.Uri.file(path), { preview: false }).then(() => {
		}, (error) => {
			vscode.window.showWarningMessage(error.message)
		})
	}))

	addApi.addApi(context)
	addApiFile.addApiFile(context)
	searchApi.searchApi(context)
	deploy.deploy(context)
	deleteApi.deleteApi(context)
	renameFile.renameFile(context)
}

exports.activate = activate

function deactivate() { }

module.exports = {
	activate,
	deactivate
}
