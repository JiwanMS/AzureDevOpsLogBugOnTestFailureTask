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
    logBug(testName, errorInfo) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const title = tl.getInput('workItemPrefix') + testName;
                const vstsWebApi = this.getVstsWebApi();
                console.log('Get WorkItemTrackingApi');
                const workItemTrackingClient = yield vstsWebApi.getWorkItemTrackingApi();
                const patchOperations = new Array();
                patchOperations.push({
                    "op": VSSInterfaces_1.Operation.Add,
                    "path": "/fields/System.Title",
                    "value": title
                });
                const assignedTo = tl.getInput('assignedTo');
                if (assignedTo) {
                    patchOperations.push({
                        "op": VSSInterfaces_1.Operation.Add,
                        "path": "/fields/System.AssignedTo",
                        "value": assignedTo
                    });
                }
                patchOperations.push({
                    "op": VSSInterfaces_1.Operation.Add,
                    "path": "/fields/System.Tags",
                    "value": tl.getInput('workItemTag')
                });
                let description = title + ". Error Message : " + errorInfo;
                patchOperations.push({
                    "op": VSSInterfaces_1.Operation.Add,
                    "path": "/fields/System.Description",
                    "value": description
                });
                const document = patchOperations;
                const workItemType = tl.getInput('workItemType');
                const workitem = yield workItemTrackingClient.createWorkItem(null, document, tl.getVariable("System.TeamProjectId"), workItemType);
                console.log(JSON.stringify(workitem));
            }
            catch (error) {
                console.log('Caught an error while creating the work item: ' + error);
                tl.setResult(tl.TaskResult.Failed, error);
            }
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