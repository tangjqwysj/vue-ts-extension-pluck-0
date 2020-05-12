const vscode = require("vscode")
const getBasePath = require('../FileManager').getBasePath
const FileManager = require('../FileManager')
const fs = require("fs")
const path = require("path")
const TemplateService = require('../templateService')
const yaml = require('js-yaml')

function deleteApi(context) {
  context.subscriptions.push(vscode.commands.registerCommand('extension.delete', async function (ele) {
    // console.log('path:' + JSON.stringify(ele, null, 2))
    const base = await getBasePath(ele.des)
    const fm = new FileManager.default(base)
    const isDir = fs.lstatSync(ele.des).isDirectory()
    const str = isDir ? '文件夹' : '文件'
    const extname = path.extname(ele.des)
    const basename = path.basename(ele.des)
    const dirname = path.dirname(ele.des)

    await vscode.window.showInformationMessage(`是否确定要删除${str}"${ele.label}"`, '移动到回收站', '取消')
      .then(async function (select) {

        if (select === '移动到回收站') {
          if (path.parse(base.path.fsPath).dir.includes('remoteCode')) {
            if (!isDir) {
              await fm.delete(base.path, { recursive: false })
              if (vscode.window.activeTextEditor.document.uri.fsPath === base.path.fsPath)
                await vscode.commands.executeCommand('workbench.action.closeActiveEditor')
            } else {
              await fm.delete(base.path, { recursive: true })
            }
            await vscode.commands.executeCommand('extension.refreshRemote')
          } else {
            await vscode.workspace.fs.delete(base.path, { recursive: true })
            const templatePath = path.resolve(vscode.workspace.rootPath, 'template.yml')
            const templateService = new TemplateService.TemplateService(templatePath)
            const tpl = await templateService.getTemplateDefinition()
            if (!extname) {
              delete tpl.Resources[basename]
            } else {
              const temp = dirname.split(path.sep)
              const dirN = temp[temp.length - 1]
              delete tpl.Resources[dirN][basename]
            }
            const tplContent = yaml.dump(tpl)
            templateService.writeTemplate(tplContent)

            await vscode.commands.executeCommand('extension.refreshLocal')
          }
        } else {
          // console.log(select)
        }
      })
  }))
}
exports.deleteApi = deleteApi