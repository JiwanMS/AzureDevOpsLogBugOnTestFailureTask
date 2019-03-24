import tl = require('azure-pipelines-task-lib/task');
import fs = require('fs');
import xml2js = require('xml2js');
import { AzureDevOpsWorkItemUtility } from './AzureDevOpsWorkItemUtility';

export class VisualStudioTestParserUtility {
    public async findTestFailures(testResultsPath: string) : Promise<any> {
        var parser = new xml2js.Parser({explicitArray : false});

        fs.readFile(testResultsPath, async function(err, data) {
            if(err) {
                tl.setResult(tl.TaskResult.Failed, 'Error : ' + err);
                return;
            }

            parser.parseString(data, async function (err: any, result: any) {
                let returnValue = new Array<any>();
                if(err) {
                    tl.setResult(tl.TaskResult.Failed, 'Error : ' + err);
                    return;
                }
                console.log(JSON.stringify(result));
                let azureDevOpsWorkItemUtility = new AzureDevOpsWorkItemUtility();
                result.TestRun.Results.UnitTestResult.forEach(async (unittestresult: any) => {
                    if(unittestresult.$.outcome == "Failed") {
                        await azureDevOpsWorkItemUtility.logBug(unittestresult.$.testName, unittestresult.Output.ErrorInfo.Message);
                    }
                });
                
                console.log(JSON.stringify(returnValue));
                return returnValue;
            });
        });

    }
}