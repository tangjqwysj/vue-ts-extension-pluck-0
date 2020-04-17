'use strict'

Object.defineProperty(exports, "__esModule", { value: true })

const vscode = require("vscode")
const treeView = require("./sideBarView/treeView")

const QuickPick_1 = require("./sideBarView/QuickPick")
const QuickPick_2 = require('./sideBarView/QuickPick2')
const path = require("path")

const FileManager_1 = require("./sideBarView/FileManager")

const fs = require('fs')



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
		vscode.window.showTextDocument(vscode.Uri.file(path)).then(() => { }, (error) => {
			vscode.window.showWarningMessage(error.message)
		})
	}))

	context.subscriptions.push(vscode.commands.registerCommand('extension.delete', async function (ele) {
		console.log('path:' + JSON.stringify(ele, null, 2))
		const base = await getBasePath(ele.des)
		const fm = new FileManager_1.default(base)
		const isDir = fs.lstatSync(ele.des).isDirectory()
		const str=isDir?'文件夹':'文件'

		vscode.window.showInformationMessage(`是否确定要删除${str}"${ele.label}"`, '移动到回收站', '取消')
			.then(async function (select) {
				if (select === '移动到回收站') {
					if (!isDir) {
						await fm.delete(base.path, { recursive: false })
					} else {
						await fm.delete(base.path, { recursive: true })
					}
					treeViewProvider.refresh()
				} else {
					console.log(select)
				}
			})
	}))

	context.subscriptions.push(vscode.commands.registerCommand('extension.addFile', async (ele) => {
		// console.log('mPath:' + JSON.stringify(path, null, 2))
		// 这里有点诡异，传出来的居然是element对象
		const base = await getBasePath(ele.des)
		if (!base) {
			return
		}
		const qp = new QuickPick_1.default(base)
		qp.show()
	}))

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
