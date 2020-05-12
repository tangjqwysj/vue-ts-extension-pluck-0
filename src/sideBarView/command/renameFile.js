const vscode = require("vscode")
const getBasePath = require('../FileManager').getBasePath
const FileManager = require('../FileManager')
const path = require("path")
const TemplateService = require('../templateService')
const yaml = require('js-yaml')

function renameFile(context) {
  context.subscriptions.push(vscode.commands.registerCommand('extension.rename', async function (ele) {
    // console.log('path:' + JSON.stringify(ele, null, 2))
    const base = await getBasePath(ele.des)
    const dirname = path.dirname(ele.des)
    const extname = path.extname(ele.des)
    const basename = path.basename(ele.des)
    const fm = new FileManager.default(base)

    await vscode.window.showInputBox(
      {
        password: false,
        ignoreFocusOut: false,
        placeHolder: '随便输',
        prompt: '输入',
      }).then(async function (msg) {
        try {
          console.log(ele.des)
          if (extname && !msg.endsWith('.js')) {
            msg = msg + '.js'
          }
          const base_t = await getBasePath(path.join(dirname, msg))

          if (path.parse(base.path.fsPath).dir.includes('remoteCode')) {
            await fm.rename(base.path, base_t.path, { overwrite: false })
            await vscode.commands.executeCommand('extension.refreshRemote')
          } else {
            await vscode.workspace.fs.rename(base.path, base_t.path, { overwrite: false })
            // 修改template.yml 
            const templatePath = path.resolve(vscode.workspace.rootPath, 'template.yml')
            const templateService = new TemplateService.TemplateService(templatePath)
            const tpl = await templateService.getTemplateDefinition()
            if (!extname) {
              tpl.Resources[msg] = tpl.Resources[basename]
              delete tpl.Resources[basename]
            } else {
              const temp = dirname.split(path.sep)
              const dirN = temp[temp.length - 1]
              tpl.Resources[dirN][msg] = tpl.Resources[dirN][basename]
              delete tpl.Resources[dirN][basename]
            }
            const tplContent = yaml.dump(tpl)
            templateService.writeTemplate(tplContent)

            await vscode.commands.executeCommand('extension.refreshLocal')
          }

        } catch (err) {
          console.log(err)
        }
      })



  }))
}
exports.renameFile = renameFile