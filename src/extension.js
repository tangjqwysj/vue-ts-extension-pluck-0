'use strict'

Object.defineProperty(exports, "__esModule", { value: true })

const vscode = require("vscode")
const treeView = require("./sideBarView/treeView")
const remoteTreeView = require('./sideBarView/remoteTreeView')

const searchApi = require('./sideBarView/command/searchApi')
const deploy = require('./sideBarView/command/livedataDeploy')
const deleteApi = require('./sideBarView/command/deleteApi')
const addApi = require('./sideBarView/command/addApi')
const addApiFile = require('./sideBarView/command/addApiFile')
const renameFile = require('./sideBarView/command/renameFile')
const remoteLogin = require('./sideBarView/command/remoteLogin')
const initProject = require('./sideBarView/initProject')
const loginView=require('./sideBarView/loginWebview')


const treeViewProvider = new treeView.TreeViewProvider(vscode.workspace.rootPath)
const remoteTreeViewProvider = new remoteTreeView.TreeViewProvider('remoteCode')
initProject.initProject()

function activate(context) {
	vscode.window.registerTreeDataProvider('treeView', treeViewProvider)
	vscode.commands.registerCommand('extension.refreshLocal', () => treeViewProvider.refresh())
	
	vscode.window.registerTreeDataProvider('remoteResource', remoteTreeViewProvider)
	vscode.commands.registerCommand('extension.refreshRemote', () => remoteTreeViewProvider.refresh())
	
	vscode.commands.registerCommand('extension.showFileContent', function (path) {
		vscode.window.showTextDocument(vscode.Uri.file(path), { preview: false }).then(() => {
		}, (error) => {
			vscode.window.showWarningMessage(error.message)
		})
	})
	vscode.commands.registerCommand('extension.showRemoteFileContent', function (path) {
		vscode.window.showTextDocument(vscode.Uri.file(path), { preview: false }).then(() => {
		}, (error) => {
			vscode.window.showWarningMessage(error.message)
		})
	})
	

	addApi.addApi(context)
	addApiFile.addApiFile(context)
	searchApi.searchApi(context)
	deploy.deploy(context)
	deleteApi.deleteApi(context)
	renameFile.renameFile(context)
	remoteLogin.remoteLogin(context)
	loginView(context)
}

exports.activate = activate

function deactivate() {
	console.log('dddd')
}

module.exports = {
	activate,
	deactivate
}
