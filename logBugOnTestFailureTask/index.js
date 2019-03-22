"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const tl = require("azure-pipelines-task-lib/task");
var glob = require("glob");
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const testResultsPath = tl.getInput('testresultspath', true);
            if (testResultsPath == 'bad') {
                tl.setResult(tl.TaskResult.Failed, 'Bad input was given');
                return;
            }
            glob(testResultsPath, function (er, files) {
                if (er) {
                    tl.setResult(tl.TaskResult.Failed, 'Error : ' + er);
                    return;
                }
                if (!files) {
                    tl.setResult(tl.TaskResult.Failed, 'Files not found');
                    return;
                }
                ;
                console.log('Found files : ' + JSON.stringify(files));
            });
        }
        catch (err) {
            tl.setResult(tl.TaskResult.Failed, err.message);
        }
    });
}
run();
