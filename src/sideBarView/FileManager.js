"use strict"
Object.defineProperty(exports, "__esModule", { value: true })
const vscode = require("vscode")
const path = require("path")
const FileSystemProvider = require("./FileSystemProvider")

class FileManager extends FileSystemProvider.default {
    constructor(base) {
        super()
        if (base.type === 'file') {
            this.base = vscode.Uri.file(base.path.fsPath)
        }
        else {
            this.base = base.path
        }
        // this.root = vscode.workspace.getWorkspaceFolder(this.base);
    }
    getContent(path = '') {
        return this.readDirectory(this.getUri(path))
    }
    getUri(pPath = undefined) {
        const sufix = pPath !== undefined ? path.sep + pPath : ''
        // if (pPath !== undefined && (pPath.startsWith(path.sep) || pPath.startsWith('/'))) {
        //     return vscode.Uri.file(this.root.uri.fsPath + sufix);
        // }
        return vscode.Uri.file(this.base.fsPath + sufix)
    }
    openFile(path) {
        const uri = this.getUri(path)
        vscode.window.showTextDocument(uri).then(() => { }, (error) => {
            vscode.window.showWarningMessage(error.message)
        })
    }
}
exports.default = FileManager
//# sourceMappingURL=FileManager.js.map