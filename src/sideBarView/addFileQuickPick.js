"use strict"

Object.defineProperty(exports, "__esModule", { value: true })
const vscode = require("vscode")
const path = require("path")
const FileManager = require("./FileManager")
const Fuzzy_1 = require("./Fuzzy")
const TemplateService = require('./templateService')
const yaml = require('js-yaml')

class QuickPick {
    constructor(base) {
        this.fm = new FileManager.default(base)
        this.oldPath = null
        this.config = vscode.workspace.getConfiguration('xx')
        this.items = []
        this.quickPick = vscode.window.createQuickPick()
        this.quickPick.onDidHide(() => this.quickPick.dispose())
        this.quickPick.onDidAccept(() => {
            const selected = this.quickPick.selectedItems[0]
            // A hack for ignoring duplicate firing of the event when items
            // are changed. Need to investigate whether it's a bug in the code.
            if (!selected && this.quickPick.activeItems.length > 0) {
                return
            }
            this.accept(selected)
        })
        this.quickPick.placeholder = '请输入js文件名'
        this.quickPick.onDidChangeValue((value) => {
            this.changePath(value)
        })
    }
    async changePath(input) {
        // The "gibberish" part is for getting around the fact, that `.dirname()`
        // does omit the directory seperator at the end. We don't want that.
        const newPath = path.normalize(path.dirname(this.fm.getUri(input).fsPath + '__gibberish__'))
        if (newPath !== this.oldPath) {
            await this.setItems(newPath)
        }
        this.filterItems(input)
        this.oldPath = newPath
    }
    filterItems(input) {
        const filename = path.basename(input + '__gibberish__').replace('__gibberish__', '')
        if (!filename) {
            this.quickPick.items = this.items
            return
        }
        this.quickPick.items = this.items.filter(item => {
            return Fuzzy_1.default.search(filename, item.name)
        })
    }
    sortItems() {
        this.items.sort((a, b) => {
            if (a.directory > b.directory)
                return -1
            if (a.directory < b.directory)
                return 1
            if (a.name < b.name)
                return -1
            if (a.name > b.name)
                return 1
            return 0
        })
    }
    async accept(selected) {
        if (selected && selected.name !== this.quickPick.value) {
            selected = undefined
        }
        if (selected === undefined) {
            const path = await this.createNew()
            if (path) {
                this.fm.openFile(path)
            }
            this.quickPick.hide()
        }
        else {
            if (selected.directory) {
                this.changePath(selected.fullPath + path.sep)
            }
            else {
                this.fm.openFile(selected.fullPath)
            }
        }
    }
    async createNew() {
        let filePath = this.quickPick.value
        let uri = this.fm.getUri(filePath)
        if (filePath === '') {
            await vscode.window.showWarningMessage('输入不能为空', { modal: true })
            return ''
        }
        try {
            if (filePath.match(/^[^\/\\]*$/)) {
                if (!filePath.endsWith('.js')) {
                    filePath = filePath + '.js'
                    uri = this.fm.getUri(filePath)
                }

                await this.fm.writeFile(uri, new Uint8Array(0), { create: true, overwrite: false })
                if (path.parse(uri.fsPath).dir.includes('remoteCode')) {
                    await vscode.commands.executeCommand('extension.refreshRemote')
                } else {
                    const templatePath = path.resolve(vscode.workspace.rootPath, 'template.yml')
                    const templateService = new TemplateService.TemplateService(templatePath)
                    const tpl = await templateService.getTemplateDefinition()
                    const dirname = path.dirname(uri.fsPath)
                    const basename = path.basename(uri.fsPath)
                    const temp = dirname.split(path.sep)
                    const dirN = temp[temp.length - 1]
                    tpl.Resources[dirN][basename] = {
                        Type: '倩女::杏花春雨::Function',
                        Properties: {
                            Description: `This is ${dirN} 甲鱼的 ${basename} 装备`
                        }
                    }
                    const tplContent = yaml.dump(tpl)
                    templateService.writeTemplate(tplContent)

                    await vscode.commands.executeCommand('extension.refreshLocal')
                }
                return filePath
                // }
            } else {

                await vscode.window.showWarningMessage(`输入的${filePath}含有不合法字符，请重新输入的文件名`, { modal: true })
            }
        }
        catch (e) {
            // console.error(e)
        }
    }
    async show() {
        // const defaultPath = this.config.get('defaultPath')
        this.quickPick.show()
        // this.changePath('/')
    }
    async setItems(pPath) {
        const directory = path.relative(this.fm.getUri().fsPath, pPath)
        const relativeToRoot = path.relative(this.fm.getUri('/').fsPath, pPath)
        let content = []
        try {
            content = await this.fm.getContent(directory)
        }
        catch (e) {
            // Isn't there some better method for checking of which type the error is?
            if (e.name !== 'EntryNotFound (FileSystemError)') {
                console.error(e)
            }
        }
        const showDetails = this.config.get('showDetails')
        this.items = content.map(item => {
            const isDir = item[1] === vscode.FileType.Directory
            const icon = isDir ? '$(file-directory)' : '$(file-code)'
            return {
                name: item[0],
                label: `${icon}  ${item[0]}`,
                fullPath: path.join(directory, item[0]),
                directory: isDir,
                alwaysShow: true,
                detail: showDetails ? path.join(relativeToRoot, item[0]) : undefined,
            }
        })
        this.sortItems()
    }
}
exports.default = QuickPick
//# sourceMappingURL=QuickPick.js.map