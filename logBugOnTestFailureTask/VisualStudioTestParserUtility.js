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
const fs = require("fs");
const xml2js = require("xml2js");
class VisualStudioTestParserUtility {
    findTestFailures(testResultsPath) {
        return __awaiter(this, void 0, void 0, function* () {
            var parser = new xml2js.Parser();
            fs.readFile(testResultsPath, function (err, data) {
                if (err) {
                    tl.setResult(tl.TaskResult.Failed, 'Error : ' + err);
                    return;
                }
                parser.parseString(data, function (err, result) {
                    if (err) {
                        tl.setResult(tl.TaskResult.Failed, 'Error : ' + err);
                        return;
                    }
                    result.TestRun.Results.forEach((element) => {
                        element.UnitTestResult.forEach((unittestresult) => {
                            console.log(unittestresult.$.outcome);
                        });
                    });
                    console.log('Done');
                });
            });
        });
    }
}
exports.VisualStudioTestParserUtility = VisualStudioTestParserUtility;
//# sourceMappingURL=VisualStudioTestParserUtility.js.map