/**
 * This file contains the queries used within GitHub_API.js to access the GraphQL database of Github.
 *  - the corresponding username must replace AgentAGadge in the queries from GitHub_queries.js
 */

const GITHUB_QUERY_GET_PROJECT_ITEMS = ` \
    query GetProjectItems($projectNumber : Int!) { \
    user(login: "AgentAGadge") { \
      projectV2(number: $projectNumber){ \
          databaseId,
          items(first:100){ 
            totalCount,
            nodes{ 
              databaseId,
              content{ 
                ... on Issue{ 
                  createdAt 
                  title 
                  url 
                  } 
              } 
              , 
              fieldValues(first:50){ 
                totalCount,
                nodes{ 
                  ... on ProjectV2ItemFieldNumberValue{ 
                    number, field{ ... on ProjectV2FieldCommon {name}}
                  }
                  ... on ProjectV2ItemFieldDateValue{ 
                    date, field{ ... on ProjectV2FieldCommon {name}}
                  }
                  ... on ProjectV2ItemFieldLabelValue{ 
                    labels(first:10){nodes{name}}, field{ ... on ProjectV2FieldCommon {name}}
                  }
                  ... on ProjectV2ItemFieldMilestoneValue{ 
                    milestone{title}, field{ ... on ProjectV2FieldCommon {name}}
                  }
                  ... on ProjectV2ItemFieldRepositoryValue{ 
                    repository{name}, field{ ... on ProjectV2FieldCommon {name}}
                  }
                  ... on ProjectV2ItemFieldSingleSelectValue{ 
                    optionId, field{ ... on ProjectV2SingleSelectField {name}}
                  }
                  ... on ProjectV2ItemFieldTextValue{ 
                    text, field{ ... on ProjectV2FieldCommon {name}}
                  }
                  ... on ProjectV2ItemFieldUserValue{ 
                    users(first:10){nodes{id}}, field{ ... on ProjectV2FieldCommon {name}}
                  }
                  ... on ProjectV2ItemFieldIterationValue{ 
                    title, field{ ... on ProjectV2FieldCommon {name}}
                  } \
                } \
              } \
            } \
          } \
      } \
    } \
  } \
    `

const GITHUB_QUERY_GET_SSFIELD_OPTION_NAMES = ` \
    query GetProjectItems($projectNumber : Int!) { \
    user(login: "AgentAGadge") { \
      projectV2(number: $projectNumber){ \
          databaseId,
          fields(first:100){
            totalCount,
            nodes{
                ... on ProjectV2SingleSelectField{ 
                    name,
                    options{
                        id,
                        name
                    }
                  }
            }
          }
      } \
    } \
  } \
    `

const GITHUB_QUERY_NODE_BY_ID = ` \
    query GetNodeById($nodeId : ID!) { \
    node(id: $nodeId) { \
        ... on User {
            name
        }
    } \
  } \
    `
