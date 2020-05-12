"use strict"
Object.defineProperty(exports, "__esModule", { value: true })
const vscode = require("vscode")
const path = require("path")
const TemplateService = require('./templateService')
const file = require('./utils/file')

class TreeViewProvider {
    constructor(workspaceRoot) {
        this.workspaceRoot = workspaceRoot
        this._onDidChangeTreeData = new vscode.EventEmitter()
        this.onDidChangeTreeData = this._onDidChangeTreeData.event
    }

    refresh() {
        this._onDidChangeTreeData.fire()
    }

    getTreeItem(element) {
        return element
    }

    getChildren(element) {
        if (!this.workspaceRoot) {
            vscode.window.showInformationMessage('No template.yml in empty workspace')
            return Promise.resolve([])
        }
        const templatePath = this.getTemplateFile()
        if (element) {
            return Promise.resolve(this.getTreeItemFunc(templatePath, element.label))
        }
        else {
            // 点开activitybar，无操作，进入这里
            if (templatePath) {
                return Promise.resolve(this.getTreeItemApi(templatePath))
            }
            else {
                vscode.window.showInformationMessage('There is no template.yml')
                return Promise.resolve([])
            }
        }
    }
    getTemplateFile() {
        const templatePath = path.resolve(this.workspaceRoot, 'template.yml')
        if (file.isPathExists(templatePath)) {
            return templatePath
        }
        return ''
    }
    async getTreeItemFunc(templatePath, label) {
        const templateService = new TemplateService.TemplateService(templatePath)
        const tpl = await templateService.getTemplateDefinition()
        const func = Object.keys(tpl.Resources[label]).filter(v => {
            if (tpl.Resources[label][v].Type && tpl.Resources[label][v].Type === '倩女::杏花春雨::Function') {
                return v
            }
        })
        if (func.length) {
            return func.map(v => {
                const funcPath = path.resolve(vscode.workspace.rootPath, 'userCode', label, v)
                return new TreeItemNode(v, vscode.TreeItemCollapsibleState.None, funcPath, 'fileType', {
                    command: 'extension.showFileContent',
                    arguments: [
                        funcPath
                    ]
                })
            })
        } else {
            return []
        }
    }
    async getTreeItemApi(templatePath) {
        const templateService = new TemplateService.TemplateService(templatePath)
        const tpl = await templateService.getTemplateDefinition()
        const api = Object.keys(tpl.Resources).filter((v) => {
            if (tpl.Resources[v].Type === '倩女::杏花春雨::Api') {
                return v
            }
        })
        if (api.length) {
            return api.map(v => {
                const apiPath = path.resolve(vscode.workspace.rootPath, 'userCode', v)
                return new TreeItemNode(v, vscode.TreeItemCollapsibleState.Expanded, apiPath, 'dirType', {
                    command: 'extension.addFile',
                    arguments: [
                        apiPath
                    ]
                })
            })
        } else {
            return []
        }
    }
}
exports.TreeViewProvider = TreeViewProvider

class TreeItemNode extends vscode.TreeItem {
    constructor(label, collapsibleState, des, contextValue, command) {
        super(label, collapsibleState)
        this.label = label
        this.collapsibleState = collapsibleState
        this.des = des
        this.contextValue = contextValue
        // this.collapsibleState为Collapsed时才会走有element的条件语句
        this.command = command
        this.iconPath = {
            light: path.join(__filename, '..', 'resources', 'light', this.getFileType(this.label)),
            dark: path.join(__filename, '..', 'resources', 'dark', this.getFileType(this.label))
        }
    }
    getFileType(fileName) {
        const ext = path.extname(fileName)
        if (this.collapsibleState !== vscode.TreeItemCollapsibleState.None) {
            return 'folder.svg'
        } else if (ext === '.js') {
            return 'edit.svg'
        } else if (ext === '.json') {
            return 'number.svg'
        } else {
            return 'string.svg'
        }
    }
}

exports.TreeItemNode = TreeItemNode
//# sourceMappingURL=nodeDependencies.js.map