const vscode = require('vscode')
const fs = require('fs')
const yaml = require('js-yaml')
const util = require('util')

const readFile = util.promisify(fs.readFile)

class TemplateService {
  constructor(templatePath) {
    this.templatePath = templatePath
  }
  getTemplatePath() {
    return this.templatePath
  }
  templateExists() {
    try {
      fs.accessSync(this.getTemplatePath())
    } catch (err) {
      return false
    }
    return true
  }
  async getTemplateContent() {
    if (!this.templateExists()) {
      return ''
    }
    const content = await readFile(this.getTemplatePath(), 'utf8')
    return content
  }
  initTemplate() {
    try {
      fs.writeFileSync(this.getTemplatePath(), `QiannvTemplateVersion: '2020-00-00'
Transform: '倩女::杏花春雨-2020-04-01'
Resources:
`
      )
    } catch (err) {
      return false
    }
    return true
  }
  async getTemplateDefinition() {
    if (!this.templateExists()) {
      return null
    }
    const content = await readFile(this.getTemplatePath(), 'utf8')
    const tpl = yaml.safeLoad(content)
    return tpl
  }
  writeTemplate(content) {
    try {
      fs.writeFileSync(this.getTemplatePath(), content)
    } catch (err) {
      return false
    }
    return true
  }
  async addApi(apiName, functionName) {
    let tpl = await this.getTemplateContent()
    if (!tpl) {
      if (!this.initTemplate()) {
        vscode.window.showErrorMessage('Init template fail')
        return false
      }
    }
    let tplObj = await this.getTemplateDefinition()
    if (!tplObj) {
      vscode.window.showErrorMessage('Template definition error')
      return false
    }
    if (!tplObj.Resources) {
      tplObj.Resources = {}
    }
    if (!tplObj.Resources[apiName]) {
      tplObj.Resources[apiName] = {
        Type: '倩女::杏花春雨::Api',
        Properties: {
          Description: `This is ${apiName} 甲鱼`,
        }
      }
    }
    if (functionName.length) {
      functionName.forEach((v) => {
        tplObj.Resources[apiName][v] = {
          Type: '倩女::杏花春雨::Function',
          Properties: {
            Description: `This is ${apiName} 甲鱼的 ${v} 装备`
            // CodeUri: codeUri,
          }
        }
      })
    }
    const tplContent = yaml.dump(tplObj)
    return this.writeTemplate(tplContent)
  }
}

exports.TemplateService = TemplateService