"use strict"
Object.defineProperty(exports, "__esModule", { value: true })

const vscode = require("vscode")
const fs = require("fs")
const path = require("path")
const mkdirp = require("mkdirp")
const FileStat_1 = require("./FileStat")

class FileSystemProvider {
    constructor() {
        this._onDidChangeFile = new vscode.EventEmitter()
    }
    get onDidChangeFile() {
        return this._onDidChangeFile.event
    }
    watch(uri, options) {
        const watcher = fs.watch(uri.fsPath, { recursive: options.recursive }, async (event, filename) => {
            const filepath = path.join(uri.fsPath, _normalizeNFC(filename.toString()))
            // TODO support excludes (using minimatch library?)
            this._onDidChangeFile.fire([{
                type: event === 'change' ? vscode.FileChangeType.Changed : (await _exists(filepath)) ? vscode.FileChangeType.Created : vscode.FileChangeType.Deleted,
                uri: uri.with({ path: filepath })
            }])
        })
        return { dispose: () => watcher.close() }
    }
    stat(uri) {
        return this._stat(uri.fsPath)
    }
    async _stat(path) {
        return new FileStat_1.default(await _stat(path))
    }
    readDirectory(uri) {
        return this._readDirectory(uri)
    }
    async _readDirectory(uri) {
        const children = await _readdir(uri.fsPath)
        const result = []
        for (let i = 0;i < children.length;i++) {
            const child = children[i]
            const stat = await this._stat(path.join(uri.fsPath, child))
            result.push([child, stat.type])
        }
        return Promise.resolve(result)
    }
    createDirectory(uri) {
        return _mkdir(uri.fsPath)
    }
    readFile(uri) {
        return _readfile(uri.fsPath)
    }
    writeFile(uri, content, options) {
        return this._writeFile(uri, content, options)
    }
    async _writeFile(uri, content, options) {
        const exists = await _exists(uri.fsPath)
        if (!exists) {
            if (!options.create) {
                throw vscode.FileSystemError.FileNotFound()
            }
            await _mkdir(path.dirname(uri.fsPath))
        }
        else {
            if (!options.overwrite) {
                throw vscode.FileSystemError.FileExists()
            }
        }
        return _writefile(uri.fsPath, content)
    }
    delete(uri, options) {
        if (options.recursive) {
            return _rmrf(uri.fsPath)
        }
        return _unlink(uri.fsPath)
    }
    rename(oldUri, newUri, options) {
        return this._rename(oldUri, newUri, options)
    }
    async _rename(oldUri, newUri, options) {
        const exists = await _exists(newUri.fsPath)
        if (exists) {
            if (!options.overwrite) {
                throw vscode.FileSystemError.FileExists()
            }
            else {
                await _rmrf(newUri.fsPath)
            }
        }
        const parentExists = await _exists(path.dirname(newUri.fsPath))
        if (!parentExists) {
            await _mkdir(path.dirname(newUri.fsPath))
        }
        return _rename(oldUri.fsPath, newUri.fsPath)
    }
}
exports.default = FileSystemProvider
function deactivate() { }
exports.deactivate = deactivate
//#region Utilities
function handleResult(resolve, reject, error, result) {
    if (error) {
        reject(massageError(error))
    }
    else {
        resolve(result)
    }
}
function massageError(error) {
    if (error.code === 'ENOENT') {
        return vscode.FileSystemError.FileNotFound()
    }
    if (error.code === 'EISDIR') {
        return vscode.FileSystemError.FileIsADirectory()
    }
    if (error.code === 'EEXIST') {
        return vscode.FileSystemError.FileExists()
    }
    if (error.code === 'EPERM' || error.code === 'EACCESS') {
        return vscode.FileSystemError.NoPermissions()
    }
    return error
}
// function checkCancellation(token) {
//     if (token.isCancellationRequested) {
//         throw new Error('Operation cancelled')
//     }
// }
// const _checkCancellation = checkCancellation
function normalizeNFC(items) {
    if (process.platform !== 'darwin') {
        return items
    }
    if (Array.isArray(items)) {
        return items.map(item => item.normalize('NFC'))
    }
    return items.normalize('NFC')
}
const _normalizeNFC = normalizeNFC
function readdir(path) {
    return new Promise((resolve, reject) => {
        fs.readdir(path, (error, children) => handleResult(resolve, reject, error, normalizeNFC(children)))
    })
}
const _readdir = readdir
function stat(path) {
    return new Promise((resolve, reject) => {
        fs.stat(path, (error, stat) => handleResult(resolve, reject, error, stat))
    })
}
const _stat = stat
function readfile(path) {
    return new Promise((resolve, reject) => {
        fs.readFile(path, (error, buffer) => handleResult(resolve, reject, error, buffer))
    })
}
const _readfile = readfile
function writefile(path, content) {
    return new Promise((resolve, reject) => {
        fs.writeFile(path, content, error => handleResult(resolve, reject, error, void 0))
    })
}
const _writefile = writefile
function exists(path) {
    return new Promise((resolve, reject) => {
        fs.exists(path, exists => handleResult(resolve, reject, null, exists))
    })
}
const _exists = exists
function rmrf(path) {
    return new Promise((resolve) => {
        resolve(path)
    })
}
const _rmrf = rmrf
function mkdir(path) {
    return new Promise((resolve, reject) => {
        // @ts-ignore
        mkdirp(path, error => handleResult(resolve, reject, error, void 0))
    })
}
const _mkdir = mkdir
function rename(oldPath, newPath) {
    return new Promise((resolve, reject) => {
        fs.rename(oldPath, newPath, error => handleResult(resolve, reject, error, void 0))
    })
}
const _rename = rename
function unlink(path) {
    return new Promise((resolve, reject) => {
        fs.unlink(path, error => handleResult(resolve, reject, error, void 0))
    })
}
const _unlink = unlink
//# sourceMappingURL=FileSystemProvider.js.map