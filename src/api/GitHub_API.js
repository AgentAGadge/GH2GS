/**
 * This file contains functions to query the GitHub GraphQL API.
 * Queries are stored in GitHub_queries.js file.
 * Those functions require a GitHub token to access the API;
 *  - it must be returned by a function 'GetGithubToken()' not provided within the repo.
 *  - the corresponding username must replace AgentAGadge in the queries from GitHub_queries.js
 */

// --- CONSTANT DEFINITIONS ---
const GITHUB_API_URL_MAIN = 'https://api.github.com/graphql'

// --- GITHUB API FUNCTIONS  ---

/**
 * GetProjectItems retrieves all items from a GitHub Project (V2)
 * @param {*} projectNumber ProjectV2 number within the GitHub user
 * @returns {object} the projectV2 object (parsed JSON) from the GitHub GraphQL.
 * Refer to the GraphQL query for structure details.
 */
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

/**
 * GetProjectSSFieldsOptionNames retrieves all Single Select fields and there possible values from a GitHub project.
 * @param {*} projectNumber ProjectV2 number within the GitHub user
 * @returns {object} the list of fields from the project with names and values of Single Select fields.
 * Refer to the GraphQL query for structure details.
 */
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

/**
 * GetNodeByID retrieves data for a given GraphQL node based on its type.
 * @param {*} nodeId ID of the GraphQL node to query
 * @returns {object} contains the data structure retrieved from the GraphQL node.
 * Refer to the GraphQL query for structure details.
 */
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

/**
 * GetUserNameById retrieves the name of a user from its nodeId
 * @param {*} nodeId ID of the GraphQL User node to query
 * @returns {string} the name of the queried user.
 */
function GetUserNameById (nodeId) {
  const userNode = GetNodeByID(nodeId)
  return userNode.data.node.name
}
