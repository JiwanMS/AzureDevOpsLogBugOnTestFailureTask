import tl = require('azure-pipelines-task-lib/task');
import tr = require('azure-pipelines-task-lib/toolrunner');
import fs = require('fs');
import path = require('path');
var glob = require("glob")

async function run() {
    try {
        const testResultsPath: string = tl.getInput('testresultspath', true);
        if (testResultsPath == 'bad') {
            tl.setResult(tl.TaskResult.Failed, 'Bad input was given');
            return;
        }

        glob(testResultsPath, function (er: string, files: Array<object>) {
            if(er) {
                tl.setResult(tl.TaskResult.Failed, 'Error : ' + er);
                return;
            }

            if(files.length == 0) {
                tl.setResult(tl.TaskResult.Failed, 'No files found');
                return;
            };

            console.log('Found files : ' + JSON.stringify(files));
          });
    }
    catch (err) {
        tl.setResult(tl.TaskResult.Failed, err.message);
    }
}

run();