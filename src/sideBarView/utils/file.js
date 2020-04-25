"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

const fs = require("fs");
const path_1 = require("path");

function isPathExists(path) {
    try {
        fs.accessSync(path);
    }
    catch (err) {
        return false;
    }
    return true;
}
exports.isPathExists = isPathExists;
function isDirectory(p) {
    try {
        const stat = fs.statSync(p);
        return stat.isDirectory();
    }
    catch (err) {
        return false;
    }
}
exports.isDirectory = isDirectory;
function isNotEmpty(p) {
    try {
        return fs.readdirSync(p).length > 0;
    }
    catch (err) {
        return false;
    }
}
exports.isNotEmpty = isNotEmpty;
function createDirectory(p) {
    try {
        if (isPathExists(path_1.dirname(p))) {
            fs.mkdirSync(p);
            return true;
        }
        if (!createDirectory(path_1.dirname(p))) {
            return false;
        }
        fs.mkdirSync(p);
        return true;
    }
    catch (err) {
        return false;
    }
}
exports.createDirectory = createDirectory;
const createFileRecursively = (content) => {
    return (filePath) => {
        if (isPathExists(filePath)) {
            return false;
        }
        if (!isPathExists(path_1.dirname(filePath)) && !createDirectory(path_1.dirname(filePath))) {
            return false;
        }
        try {
            fs.writeFileSync(filePath, content);
        }
        catch (err) {
            return false;
        }
        return true;
    };
};
exports.createFile = createFileRecursively('');
exports.createJsonFile = createFileRecursively(`{
}`);
exports.createEventFile = createFileRecursively(`{
  "key": "value"
}`);
exports.createLaunchFile = createFileRecursively(`{
  "version": "0.2.0",
  "configurations": []
}`);