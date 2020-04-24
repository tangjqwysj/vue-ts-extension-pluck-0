'use strict'

Object.defineProperty(exports, "__esModule", { value: true })

const vscode = require("vscode")
const treeView = require("./sideBarView/treeView")
const remoteTreeView = require('./sideBarView/remoteTreeView')

const addFileQuickPick = require("./sideBarView/addFileQuickPick")
const addOriTepQuickPick = require('./sideBarView/addOriTepQuickPick')
const path = require("path")

const FileManager = require("./sideBarView/FileManager")

const fs = require('fs')

async function getBasePath(mPath) {
	return {
		path: vscode.Uri.file(mPath),
		type: 'file'
	}
}

const searchList = []

const treeViewProvider = new treeView.TreeViewProvider()
exports.default = treeViewProvider

const remoteTreeViewProvider = new remoteTreeView.TreeViewProvider(searchList)


function activate(context) {


	vscode.window.registerTreeDataProvider('treeView', treeViewProvider)


	vscode.commands.registerCommand('extension.refreshEntry', () => treeViewProvider.refresh())


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

	context.subscriptions.push(vscode.commands.registerCommand('extension.searchApi', function () {
		const res = {
			code: 200,
			message: 'ok',
			result: {
				api: {
					apiName: 'dudu_3',
					apiMethod: 'get'
				},
				script: [
					{
						apiUUID: '123',
						scriptContent: 'index.js contentxx',
						scriptCustom: [
							{
								test01: {
									scriptUUID: '12301',
									scriptContent: 'haha3'
								},
								test02: {
									scriptUUID: '12302',
									scriptContent: 'xxx'
								},
								test033: {
									scriptUUID: '12304',
									scriptContent: '3243423434g'
								}
							}
						]
					}
				]
			}
		}

		const searchItem = {}
		searchItem.apiName = res.result.api.apiName
		searchItem.scriptList = Object.assign({}, res.result.script[0].scriptCustom[0], { index: { scriptContent: res.result.script[0].scriptContent } })
		console.log(searchItem)
		searchList.push(searchItem)
		vscode.window.registerTreeDataProvider('remoteResource', remoteTreeViewProvider)
	}))

	context.subscriptions.push(vscode.commands.registerCommand('extension.delete', async function (ele) {
		// console.log('path:' + JSON.stringify(ele, null, 2))
		const base = await getBasePath(ele.des)
		const fm = new FileManager.default(base)
		const isDir = fs.lstatSync(ele.des).isDirectory()
		const str = isDir ? '文件夹' : '文件'

		vscode.window.showInformationMessage(`是否确定要删除${str}"${ele.label}"`, '移动到回收站', '取消')
			.then(async function (select) {

				if (select === '移动到回收站') {
					if (!isDir) {
						await fm.delete(base.path, { recursive: false })
						if (vscode.window.activeTextEditor.document.uri.fsPath === base.path.fsPath)
							vscode.commands.executeCommand('workbench.action.closeActiveEditor')
					} else {
						await fm.delete(base.path, { recursive: true })
					}
					treeViewProvider.refresh()

				} else {
					// console.log(select)
				}
			})
	}))

	context.subscriptions.push(vscode.commands.registerCommand('extension.rename', async function (ele) {
		// console.log('path:' + JSON.stringify(ele, null, 2))
		const base = await getBasePath(ele.des)
		const fm = new FileManager.default(base)
		const dirname = path.dirname(ele.des)

		vscode.window.showInputBox(
			{
				password: false,
				ignoreFocusOut: false,
				placeHolder: '随便输',
				prompt: '输入',
			}).then(async function (msg) {
				const base_t = await getBasePath(path.join(dirname, msg))
				await fm.rename(base.path, base_t.path, { overwrite: false })
				treeViewProvider.refresh()
			})
	}))

	context.subscriptions.push(vscode.commands.registerCommand('extension.addFile', async (ele) => {
		// console.log('mPath:' + JSON.stringify(path, null, 2))
		// 这里有点诡异，传出来的居然是element对象
		const base = await getBasePath(ele.des)
		if (!base) {
			return
		}
		const qp = new addFileQuickPick.default(base)
		qp.show()
	}))

	context.subscriptions.push(vscode.commands.registerCommand('extension.idDeploy', async (ele) => {
		let retObj = {
			scripts: [
				{
					scriptContent: '',
					scriptLibs: []
				}
			]
		}
		//不考虑多层目录结构
		let fileList = []
		try {
			fileList = fs.readdirSync(ele.des)
		} catch (err) {
			return false
		}
		if (fileList.length) {
			fileList.forEach((file) => {
				if (file === 'index.js') {
					retObj.scripts[0].scriptContent = fs.readFileSync(path.join(ele.des, 'index.js'), 'utf8')
				} else {
					const scriptName = file
					const scriptContent = fs.readFileSync(path.join(ele.des, file), 'utf8')
					retObj.scripts[0].scriptLibs.push({ scriptName, scriptContent })
				}
			})
		}
		console.log(retObj)
	}))

	context.subscriptions.push(vscode.commands.registerCommand('extension.addOriginDir', async () => {

		const base = await getBasePath(path.join(__dirname, 'sideBarView/userCode'))
		if (!base) {
			return
		}
		const qp = new addOriTepQuickPick.default(base)
		qp.show()
	}))
}

exports.activate = activate

function deactivate() { }

module.exports = {
	activate,
	deactivate
}
