const vscode = require("vscode")
const path = require("path")
const fs = require('fs')
const file = require('../utils/file')
const treeView = require("../treeView")

const remoteTreeViewProvider = new treeView.TreeViewProvider('remoteCode')

function searchApi(context) {
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

    try {
      const dirname = path.join(__dirname, '..', 'remoteCode', searchItem.apiName)
      if (!file.isPathExists(dirname)) {
        fs.mkdirSync(dirname)
        Object.keys(searchItem.scriptList).forEach((item) => {
          fs.writeFileSync(path.join(dirname, item), searchItem.scriptList[item].scriptContent)
        })
      }
    } catch (err) {
      console.log(err)
    }

    vscode.window.registerTreeDataProvider('remoteResource', remoteTreeViewProvider)
    vscode.commands.registerCommand('extension.refreshRemote', () => remoteTreeViewProvider.refresh())
  }))
}

exports.searchApi = searchApi