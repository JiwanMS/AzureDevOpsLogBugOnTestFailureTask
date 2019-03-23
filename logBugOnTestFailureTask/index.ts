import tl = require('azure-pipelines-task-lib/task');
import tr = require('azure-pipelines-task-lib/toolrunner');
import fs = require('fs');
import path = require('path');
import { VisualStudioTestParserUtility } from './VisualStudioTestParserUtility';
var glob = require("glob")

async function run() {
    try {
        const testResultsPath: string = tl.getInput('testresultspath', true);
        if (testResultsPath == 'bad') {
            tl.setResult(tl.TaskResult.Failed, 'Bad input was given');
            return;
        }

        if(!testResultsPath.toUpperCase().match(/\.TRX$/)) {
            throw new Error(tl.loc('JS_InvalidFilePathTrx', testResultsPath));
            return;
        }

        glob(testResultsPath, async function (er: string, files: Array<object>) {
            if(er) {
                tl.setResult(tl.TaskResult.Failed, 'Error : ' + er);
                return;
            }

            if(files.length == 0) {
                tl.setResult(tl.TaskResult.Failed, 'No files found');
                return;
            };

            if(files.length > 1) {
                tl.debug("Found multiple matching file. Used : " + files[0]);
            }

            let visualStudioTestParserUtility = new VisualStudioTestParserUtility();
            await visualStudioTestParserUtility.findTestFailures(testResultsPath);

            console.log('Found files : ' + JSON.stringify(files));
          });
    }
    catch (err) {
        tl.setResult(tl.TaskResult.Failed, err.message);
    }
}

run();