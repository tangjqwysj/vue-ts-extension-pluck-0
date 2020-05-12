const vscode = require("vscode")
const path = require("path")
const fs = require('fs')
const apiList = require('../utils/store').apiList

function deploy(context) {
  context.subscriptions.push(vscode.commands.registerCommand('extension.idDeploy', async (ele) => {
    let retObj = {
      scripts: [
        {
          scriptContent: '',
          scriptLibs: []
        }
      ]
    }
    console.log(apiList)
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
    console.log('deploy:' + JSON.stringify(retObj, null, 2))
  }))

}
exports.deploy = deploy