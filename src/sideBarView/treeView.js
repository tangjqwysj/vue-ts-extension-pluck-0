"use strict"
Object.defineProperty(exports, "__esModule", { value: true })
const vscode = require("vscode")
const fs = require("fs")
const path = require("path")

// 固定文件夹
const FIXED_Folder = 'templateCode'

class TreeViewProvider {
    constructor(workspaceRoot) {
        this.workspaceRoot = workspaceRoot
        this._onDidChangeTreeData = new vscode.EventEmitter()
        this.onDidChangeTreeData = this._onDidChangeTreeData.event
    }

    getTreeItem(element) {
        return element
    }

    getChildren(element) {
        if (element) {
            console.log('element:' + JSON.stringify(element, null, 2))
            const getDirPath = (path, elLabel) => {
                var dirList = fs.readdirSync(path)
                for (var i = 0;i < dirList.length;i++) {
                    var item = dirList[i]
                    if (fs.statSync(path + '/' + item).isDirectory()) {
                        if (item == elLabel) {
                            return path + '/' + item
                        } else {
                            var j = getDirPath(path + '/' + item, elLabel)
                            if (j) {
                                return j
                            } else {
                                continue
                            }
                        }
                    }
                }
            }
            if (this.pathExists(path.join(__dirname, FIXED_Folder, element.label))) {
                return Promise.resolve(this.getTreeItemArray(path.join(__dirname, FIXED_Folder, element.label)))
            } else {
                return Promise.resolve(this.getTreeItemArray(getDirPath(path.join(__dirname, FIXED_Folder), element.label)))
            }
        }
        else {
            // 点开activitybar，无操作，进入这里
            const fixedFolderPath = path.join(__dirname, FIXED_Folder)
            if (this.pathExists(fixedFolderPath)) {
                return Promise.resolve(this.getTreeItemArray(fixedFolderPath))
            }
            else {
                vscode.window.showInformationMessage('There is no such path')
                return Promise.resolve([])
            }
        }
    }

    getTreeItemArray(fileOrDirPath) {
        const toDep = (moduleName) => {
            const pathMy = path.join(fileOrDirPath, moduleName)
            if (this.pathExists(pathMy)) {
                if (!fs.lstatSync(pathMy).isDirectory()) {
                    return new TreeItemNode(moduleName, vscode.TreeItemCollapsibleState.None, {
                        command: 'extension.showFileContent',
                        arguments: [
                            pathMy
                        ]
                    })
                } else {
                    return new TreeItemNode(moduleName, vscode.TreeItemCollapsibleState.Collapsed)
                }
            }
        }
        if (this.pathExists(fileOrDirPath) && fs.lstatSync(fileOrDirPath).isDirectory()) {
            const pathStringArray = fs.readdirSync(fileOrDirPath)
            return pathStringArray ? pathStringArray.map(dep => toDep(dep)) : []
        } else {
            return []
        }
    }

    pathExists(p) {
        try {
            fs.accessSync(p)
        }
        catch (err) {
            return false
        }
        return true
    }
}
exports.TreeViewProvider = TreeViewProvider

class TreeItemNode extends vscode.TreeItem {
    constructor(label, collapsibleState, command) {
        super(label, collapsibleState)
        this.label = label
        this.collapsibleState = collapsibleState
        // this.collapsibleState为Collapsed时才会走有element的条件语句
        this.command = command
        this.iconPath = {
            light: path.join(__filename, '..', 'resources', 'light', this.getFileType(this.label)),
            dark: path.join(__filename, '..', 'resources', 'dark', this.getFileType(this.label))
        }
    }
    getFileType(fileName) {
        const ext = path.extname(fileName)
        if (ext === '.js') {
            return 'edit.svg'
        } else if (ext === '.json') {
            return 'number.svg'
        } else {
            return 'dependency.svg'
        }
    }
}

exports.TreeItemNode = TreeItemNode
//# sourceMappingURL=nodeDependencies.js.map