import request = require('request');
import tl = require('azure-pipelines-task-lib/task');
import { WebApi, getHandlerFromToken } from 'azure-devops-node-api/WebApi';
import { IRequestHandler } from 'azure-devops-node-api/interfaces/common/VsoBaseInterfaces';
import { IWorkItemTrackingApi } from 'azure-devops-node-api/WorkItemTrackingApi';
import { JsonPatchDocument, JsonPatchOperation, Operation } from "azure-devops-node-api/interfaces/common/VSSInterfaces";
import { WorkItemExpand, WorkItem, WorkItemField, WorkItemRelation, QueryHierarchyItem } from 'azure-devops-node-api/interfaces/WorkItemTrackingInterfaces';

export class AzureDevOpsWorkItemUtility {
    public async logBug(testName: string, errorInfo: string) {
        try{
            const title = tl.getInput('workItemPrefix') + testName;
            const vstsWebApi: WebApi = this.getVstsWebApi();
            console.log('Get WorkItemTrackingApi');
            const workItemTrackingClient: IWorkItemTrackingApi = await vstsWebApi.getWorkItemTrackingApi();
            
            const patchOperations = new Array<JsonPatchOperation>();
            patchOperations.push({
                "op": Operation.Add,
                "path": "/fields/System.Title",
                "value": title
            });

            const assignedTo = tl.getInput('assignedTo');
            if(assignedTo) {
                patchOperations.push({
                    "op": Operation.Add,
                    "path": "/fields/System.AssignedTo",
                    "value": assignedTo
                });
            }

            patchOperations.push({
                "op": Operation.Add,
                "path": "/fields/System.Tags",
                "value": tl.getInput('workItemTag')
            });

            let description = title + ". Error Message : " + errorInfo;
            patchOperations.push({
                "op": Operation.Add,
                "path": "/fields/System.Description",
                "value": description
            });

            const document : JsonPatchDocument = patchOperations;
            const workItemType = tl.getInput('workItemType');
            const workitem = await workItemTrackingClient.createWorkItem(null, document, tl.getVariable("System.TeamProjectId"), workItemType);
            console.log(JSON.stringify(workitem));
        }
        catch (error) {
            console.log('Caught an error while creating the work item: ' + error);
            tl.setResult(tl.TaskResult.Failed, error);
        }
    }

    getVstsWebApi() {
        const endpointUrl: string = tl.getVariable('System.TeamFoundationCollectionUri');
        const accessToken: string = tl.getEndpointAuthorizationParameter('SYSTEMVSSCONNECTION', 'AccessToken', false);
        const credentialHandler: IRequestHandler = getHandlerFromToken(accessToken);
        const webApi: WebApi = new WebApi(endpointUrl, credentialHandler);
        console.log(accessToken);
        return webApi;
    }
}