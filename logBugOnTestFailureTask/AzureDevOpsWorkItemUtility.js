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
const WebApi_1 = require("azure-devops-node-api/WebApi");
const VSSInterfaces_1 = require("azure-devops-node-api/interfaces/common/VSSInterfaces");
class AzureDevOpsWorkItemUtility {
    logBug(bugTitle) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const vstsWebApi = this.getVstsWebApi();
                console.log('Get WorkItemTrackingApi');
                const workItemTrackingClient = yield vstsWebApi.getWorkItemTrackingApi();
                const patchOperations = new Array();
                patchOperations.push({
                    "op": VSSInterfaces_1.Operation.Add,
                    "path": "/fields/System.Title",
                    "value": bugTitle
                });
                const document = patchOperations;
                const workitem = yield workItemTrackingClient.createWorkItem(null, document, tl.getVariable("System.TeamProjectId"), "Bug");
                console.log(JSON.stringify(workitem));
            }
            catch (error) {
                console.log('Caught an error in main: ' + error);
                tl.setResult(tl.TaskResult.Failed, error);
            }
            // // let teamFoundationCollectionUri = tl.getVariable("System.TeamFoundationCollectionUri");
            // // let teamProjectId = tl.getVariable("System.TeamProjectId");
            // // let requestUrl = teamFoundationCollectionUri + teamProjectId + "/_apis/wit/workitems/$Bug?api-version=5.0&bypassRules=true";
            // // let requestBody = new Array<any>();
            // // requestBody.push({op: "add", "path": "/fields/System.Title", value: bugTitle});
            // // request.post(requestUrl, {
            // //     'auth': {
            // //       'bearer': tl.getVariable("System.AccessToken")
            // //     },
            // //     'body': JSON.stringify(requestBody),
            // //     'headers': {
            // //         'content-type' : 'application/json',
            // //         'Authorization' : 'Basic '
            // //     }
            // //   })
            // //   .on('response', function(response) {
            // //     console.log(response.statusCode);
            // //     console.log(JSON.stringify(response));
            // //   })
            // //   .on('error', function(error){
            // //       console.log(error);
            // //   });
        });
    }
    getVstsWebApi() {
        const endpointUrl = tl.getVariable('System.TeamFoundationCollectionUri');
        const accessToken = tl.getEndpointAuthorizationParameter('SYSTEMVSSCONNECTION', 'AccessToken', false);
        const credentialHandler = WebApi_1.getHandlerFromToken(accessToken);
        const webApi = new WebApi_1.WebApi(endpointUrl, credentialHandler);
        console.log(accessToken);
        return webApi;
    }
}
exports.AzureDevOpsWorkItemUtility = AzureDevOpsWorkItemUtility;
//# sourceMappingURL=AzureDevOpsWorkItemUtility.js.map