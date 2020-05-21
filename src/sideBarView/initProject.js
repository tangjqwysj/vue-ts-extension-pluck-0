// const vscode = require("vscode")
const path = require("path")
const fs = require('fs')
const rimraf = require('rimraf')

function initProject() {
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