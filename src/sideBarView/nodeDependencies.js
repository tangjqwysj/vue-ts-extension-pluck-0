"use strict"
Object.defineProperty(exports, "__esModule", { value: true })
const vscode = require("vscode")
const fs = require("fs")
const path = require("path")
class DepNodeProvider {
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
        
        if (element) {
            // console.log('element:' + JSON.stringify(element, null, 4))
            // return Promise.resolve(this.getDepsInPackageJson(path.join(__dirname, 'dudu', element.label)))
        }
        else {
            const packageJsonPath = path.join(__dirname, 'dudu')
            console.log('packageJsonPath:' + packageJsonPath)
            if (this.pathExists(packageJsonPath)) {
                console.log('this.pathExists(packageJsonPath):' + this.pathExists(packageJsonPath))
                return Promise.resolve(this.getDepsInPackageJson(packageJsonPath))
            }
            else {
                vscode.window.showInformationMessage('Workspace has no package.json')
                return Promise.resolve([])
            }
        }
    }
    
    getDepsInPackageJson(packageJsonPath) {
        const toDep = (moduleName) => {
            const pathMy = path.join(__dirname, 'dudu', moduleName)
           
            if (this.pathExists(pathMy) && !fs.lstatSync(pathMy).isDirectory()) {
                const docm = fs.readFileSync(pathMy, 'utf-8')
                console.log('docm:'+docm)
                return new Dependency(moduleName, vscode.TreeItemCollapsibleState.None,{
                    title: moduleName,          // 标题
                    command: 'extension.helloWorld',
                    tooltip: moduleName, 
                    arguments: [ 
                        pathMy 
                    ]
                })
            }

        }

        if (this.pathExists(packageJsonPath) && fs.lstatSync(packageJsonPath).isDirectory()) {
            // console.log('fs.lstatSync(packageJsonPath).isDirectory():' + fs.lstatSync(packageJsonPath).isDirectory())
            const packageJson = fs.readdirSync(packageJsonPath)
            // console.log('packageJson：' + packageJson)
            const deps = packageJson ? packageJson.map(dep => toDep(dep)) : []
          
            return deps
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
exports.DepNodeProvider = DepNodeProvider
class Dependency extends vscode.TreeItem {
    constructor(label, collapsibleState, command) {
        super(label, collapsibleState)
        this.label = label
        // this.version = version
        this.collapsibleState = collapsibleState
        this.command = command
        // console.log('this.command:' + this.command)
        // console.log('__filename:' + __filename)
        this.iconPath = {
            light: path.join(__filename, '..', 'resources', 'light', 'dependency.svg'),
            dark: path.join(__filename, '..', 'resources', 'dark', 'dependency.svg')
        }
        // this.contextValue = 'dependency'
    }
   
}
exports.Dependency = Dependency
//# sourceMappingURL=nodeDependencies.js.map