"use strict"
Object.defineProperty(exports, "__esModule", { value: true })
const vscode = require("vscode")
const fs = require("fs")
const path = require("path")

// 固定文件夹
const FIXED_Folder = 'remoteCode'

class TreeViewProvider {
  constructor(searchList) {
    this.searchList = searchList
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
    // console.log(element)
    let list = []
    if (element) {
      this.searchList.forEach((item) => {
        if (item.apiName === element.label) {
          list = Object.keys(item.scriptList).map((v) => {
            let fPath = ''
            if (this.pathExists(element.des)) {
              fPath = path.join(element.des, v + '.js')
              if (!this.pathExists(fPath)) {
                try {
                  fs.writeFileSync(fPath, item.scriptList[v].scriptContent)
                } catch (err) {
                  console.log(err)
                }
              }
            }
            return new TreeItemNode(v + '.js', vscode.TreeItemCollapsibleState.None, '', {
              command: 'extension.showRemoteFileContent',
              arguments: [
                fPath
              ]
            })
          })
        }
      })
      return Promise.resolve(list)
    }
    else {

      list = this.searchList.map((item) => {
        const dPath = path.join(__dirname, FIXED_Folder, item.apiName)
        if (!this.pathExists(dPath)) {
          try {
            fs.mkdirSync(dPath)
          } catch (err) {
            console.log(err)
          }
        }
        return new TreeItemNode(item.apiName, vscode.TreeItemCollapsibleState.Expanded, dPath)
      })
      return Promise.resolve(list)
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
  constructor(label, collapsibleState, des, command) {
    super(label, collapsibleState)
    this.label = label
    this.collapsibleState = collapsibleState
    this.des = des
    // this.contextValue = contextValue
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