const GITHUB_API_URL_MAIN = 'https://api.github.com/graphql'

function GetProjectItems (projectNumber) {
  const queryVariables = { projectNumber }
  const githubToken = GetGithubToken()

  Logger.log('GetProjectItems: Calling GitHub API...')
  const response = UrlFetchApp.fetch(GITHUB_API_URL_MAIN, {
    method: 'POST',
    contentType: 'application/json',
    headers: { Authorization: 'Bearer ' + githubToken },
    payload: JSON.stringify({ query: GITHUB_QUERY_GET_PROJECT_ITEMS, variables: queryVariables })
  })
  Logger.log('GetProjectItems: API Response received.')

  const parsedData = JSON.parse(response.getContentText())
  project = parsedData.data.user.projectV2

  Logger.log('Number of items: %d', project.items.totalCount)
  return project
}

function GetProjectSSFieldsOptionNames (projectNumber) {
  const queryVariables = { projectNumber }
  const githubToken = GetGithubToken()

  Logger.log('GetProjectSSFieldsOptionNames: Calling GitHub API...')
  const response = UrlFetchApp.fetch(GITHUB_API_URL_MAIN, {
    method: 'POST',
    contentType: 'application/json',
    headers: { Authorization: 'Bearer ' + githubToken },
    payload: JSON.stringify({ query: GITHUB_QUERY_GET_SSFIELD_OPTION_NAMES, variables: queryVariables })
  })
  Logger.log('GetProjectSSFieldsOptionNames: API Response received.')

  const parsedData = JSON.parse(response.getContentText())
  projectSSOptions = parsedData.data.user.projectV2.fields

  return projectSSOptions
}

function GetNodeByID (nodeId) {
  const queryVariables = { nodeId }
  const githubToken = GetGithubToken()

  Logger.log('GetNodeByID: Calling GitHub API...')
  const response = UrlFetchApp.fetch(GITHUB_API_URL_MAIN, {
    method: 'POST',
    contentType: 'application/json',
    headers: { Authorization: 'Bearer ' + githubToken },
    payload: JSON.stringify({ query: GITHUB_QUERY_NODE_BY_ID, variables: queryVariables })
  })
  Logger.log('GetNodeByID: API Response received.')

  const parsedData = JSON.parse(response.getContentText())

  return parsedData
}
function GetUserNameById (nodeId) {
  const userNode = GetNodeByID(nodeId)
  return userNode.data.node.name
}
