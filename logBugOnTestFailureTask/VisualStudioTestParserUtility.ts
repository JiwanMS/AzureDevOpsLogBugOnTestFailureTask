import tl = require('azure-pipelines-task-lib/task');
import fs = require('fs');
import xml2js = require('xml2js');

export class VisualStudioTestParserUtility {
    public async findTestFailures(testResultsPath: string) : Promise<any> {
        var parser = new xml2js.Parser();
        fs.readFile(testResultsPath, function(err, data) {
            if(err) {
                tl.setResult(tl.TaskResult.Failed, 'Error : ' + err);
                return;
            }

            parser.parseString(data, function (err: any, result: any) {
                if(err) {
                    tl.setResult(tl.TaskResult.Failed, 'Error : ' + err);
                    return;
                }

                result.TestRun.Results.forEach((element: any) => {
                    element.UnitTestResult.forEach((unittestresult: any) => {
                        console.log(unittestresult.$.outcome);
                    });
                });
                
                console.log('Done');
            });
        });

    }
}