const vscode = require("vscode")
const path = require("path")
const fs = require('fs')
const file = require('../utils/file')
const apiList = require('../utils/store').apiList
const rimraf = require('rimraf')
const cookie = require('../utils/store').cookie

function searchApi(context) {
  context.subscriptions.push(vscode.commands.registerCommand('extension.searchApi', async function () {
    const res = {
      code: 200,
      message: 'ok',
      result: {
        api: {
          apiName: 'dudu_4',
          apiMethod: 'get',
          appName: 'dada'
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

    if (!cookie.token) {
      vscode.window.showWarningMessage('请先登录哟')
      return false
    }

    const searchItem = {}
    searchItem.api = res.result.api
    searchItem.scriptList = Object.assign({}, res.result.script[0].scriptCustom[0], { index: { scriptContent: res.result.script[0].scriptContent } })

    const appName = searchItem.api.appName

    if (apiList.length) {
      const preAppInfo = apiList[apiList.length - 1]
      const preAppName = preAppInfo.api.appName
      if (preAppName !== appName) {
        const rPath = path.join(__dirname, '..', 'remoteCode')
        try {
          rimraf.sync(rPath)
          fs.mkdirSync(rPath)
        } catch (err) {
          return false
        }
        await vscode.commands.executeCommand('extension.refreshRemote')
      }
    }
    
    try {
      const dirname = path.join(__dirname, '..', 'remoteCode', searchItem.api.apiName)
      if (!file.isPathExists(dirname)) {
        fs.mkdirSync(dirname)
        Object.keys(searchItem.scriptList).forEach((item) => {
          fs.writeFileSync(path.join(dirname, item + '.js'), searchItem.scriptList[item].scriptContent)
        })
        apiList.push(searchItem)
        // console.log('apiList:' + JSON.stringify(apiList, null, 2))
        vscode.commands.executeCommand('extension.refreshRemote')
      } else {
        vscode.window.showWarningMessage(`api ${searchItem.api.apiName} 已存在`, { modal: true })
      }
    } catch (err) {
      console.log(err)
    }
  }))
}

exports.searchApi = searchApi