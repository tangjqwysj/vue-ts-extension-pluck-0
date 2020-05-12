const vscode = require("vscode")
const path = require("path")
const fs = require('fs')
const rimraf = require('rimraf')

function initProject() {
  if (!vscode.workspace.rootPath) {
    vscode.window.showWarningMessage('Please open a workspace');
    return;
  }

  const rPath = path.join(__dirname, 'remoteCode')
  const fileList = fs.readdirSync(rPath)
  if (!fileList.length) {
    return false
  }
  try {
    fileList.forEach((v) => {
      rimraf.sync(path.join(rPath, v))
    })
    // rimraf.sync(rPath)
    // fs.mkdirSync(rPath)
  } catch (err) {
    return false
  }
}

exports.initProject = initProject