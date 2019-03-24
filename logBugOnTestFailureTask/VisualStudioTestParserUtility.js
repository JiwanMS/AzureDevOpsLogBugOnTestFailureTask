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
const AzureDevOpsWorkItemUtility_1 = require("./AzureDevOpsWorkItemUtility");
class VisualStudioTestParserUtility {
    findTestFailures(testResultsPath) {
        return __awaiter(this, void 0, void 0, function* () {
            var parser = new xml2js.Parser();
            fs.readFile(testResultsPath, function (err, data) {
                return __awaiter(this, void 0, void 0, function* () {
                    if (err) {
                        tl.setResult(tl.TaskResult.Failed, 'Error : ' + err);
                        return;
                    }
                    parser.parseString(data, function (err, result) {
                        return __awaiter(this, void 0, void 0, function* () {
                            let returnValue = new Array();
                            if (err) {
                                tl.setResult(tl.TaskResult.Failed, 'Error : ' + err);
                                return;
                            }
                            let azureDevOpsWorkItemUtility = new AzureDevOpsWorkItemUtility_1.AzureDevOpsWorkItemUtility();
                            result.TestRun.Results.forEach((element) => {
                                element.UnitTestResult.forEach((unittestresult) => __awaiter(this, void 0, void 0, function* () {
                                    if (unittestresult.$.outcome == "Failed") {
                                        yield azureDevOpsWorkItemUtility.logBug(unittestresult.$.testName + unittestresult.$.testId);
                                    }
                                }));
                            });
                            console.log(JSON.stringify(returnValue));
                            return returnValue;
                        });
                    });
                });
            });
        });
    }
}
exports.VisualStudioTestParserUtility = VisualStudioTestParserUtility;
//# sourceMappingURL=VisualStudioTestParserUtility.js.map