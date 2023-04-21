const  GITHUB_API_URL_MAIN = 'https://api.github.com/graphql';

function GetProjectItems(projectNumber){
    const query_variables = {projectNumber: projectNumber};
    const github_token = GetGithubToken();

    Logger.log("GetProjectItems: Calling GitHub API...")
    var response = UrlFetchApp.fetch(GITHUB_API_URL_MAIN, {
        method: "POST",
        contentType: 'application/json', 
        headers: { Authorization: 'Bearer ' + github_token},
        payload: JSON.stringify({query: GITHUB_QUERY_GET_PROJECT_ITEMS, variables: query_variables})
        });
    Logger.log("GetProjectItems: API Response received.")

    var parsedData = JSON.parse(response.getContentText());
    project = parsedData.data.user.projectV2;

    Logger.log("Number of items: %d", project.items.totalCount)
    return project;
    
}

function GetProjectSSFieldsOptionNames(projectNumber){
    const query_variables = {projectNumber: projectNumber};
    const github_token = GetGithubToken();

    Logger.log("GetProjectSSFieldsOptionNames: Calling GitHub API...")
    var response = UrlFetchApp.fetch(GITHUB_API_URL_MAIN, {
        method: "POST",
        contentType: 'application/json', 
        headers: { Authorization: 'Bearer ' + github_token},
        payload: JSON.stringify({query: GITHUB_QUERY_GET_SSFIELD_OPTION_NAMES, variables: query_variables})
        });
    Logger.log("GetProjectSSFieldsOptionNames: API Response received.")

    var parsedData = JSON.parse(response.getContentText());
    projectSSOptions = parsedData.data.user.projectV2.fields;

    return projectSSOptions;
    
}

function GetNodeByID(nodeId){
    const query_variables = {nodeId: nodeId};
    const github_token = GetGithubToken();

    Logger.log("GetNodeByID: Calling GitHub API...")
    var response = UrlFetchApp.fetch(GITHUB_API_URL_MAIN, {
        method: "POST",
        contentType: 'application/json', 
        headers: { Authorization: 'Bearer ' + github_token},
        payload: JSON.stringify({query: GITHUB_QUERY_NODE_BY_ID, variables: query_variables})
        });
    Logger.log("GetNodeByID: API Response received.")

    var parsedData = JSON.parse(response.getContentText());

    return parsedData;
}
function GetUserNameById(nodeId){
    var userNode = GetNodeByID(nodeId);
    return userNode.data.node.name;
}
