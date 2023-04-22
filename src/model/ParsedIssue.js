/**
 * This file contains the ParsedIssue class.
 */

/**
 * ParseIssue represents a GitHub project Item and contains all the properties we are interested in storing in the DB.
 */
class ParsedIssue {
  /**
   * Instantiates a ParsedIssue and populates its properties based on the available data from a GitHub parsed projectV2Item.
   * @param {*} projectV2Item projectV2Item retrieved from the GraphQL API.
   */
  constructor (projectV2Item) {
    this.databaseId = projectV2Item.databaseId
    this.title = projectV2Item.content.title
    this.created_at = projectV2Item.content.createdAt
    this.url = projectV2Item.content.url
    this.assignee = null
    this.repository = null
    this.epic = null
    this.status = null
    this.sprint = null
    this.impacted_version = null
    this.priority = null
    this.issue_type = null
    this.estimated_points = null

    let field = null

    // Go through all the fields available in the input data
    for (let fieldCounter = 0; fieldCounter <= projectV2Item.fieldValues.totalCount; fieldCounter = fieldCounter + 1) {
      field = projectV2Item.fieldValues.nodes[fieldCounter]
      // If the field exists and has relevant data in it,
      if (typeof field !== 'undefined' && typeof field.field !== 'undefined' && typeof field.field.name !== 'undefined') {
        switch (field.field.name) { // check if it is data we store in the SheetDB:
          // If yes, store it in the ParsedIssue
          case PROJECT_FIELD_NAME_ASSIGNEES:
            this.assignee = field.users.nodes[0].id
            break
          case PROJECT_FIELD_NAME_REPO:
            this.repository = field.repository.name
            break
          case PROJECT_FIELD_NAME_TITLE:
            this.title = field.text
            break
          case PROJECT_FIELD_NAME_EPIC:
            this.epic = field.optionId
            break
          case PROJECT_FIELD_NAME_STATUS:
            this.status = field.optionId
            break
          case PROJECT_FIELD_NAME_SPRINT:
            this.sprint = field.title
            break
          case PROJECT_FIELD_NAME_VERSION:
            this.impacted_version = field.optionId
            break
          case PROJECT_FIELD_NAME_PRIORITY:
            this.priority = field.optionId
            break
          case PROJECT_FIELD_NAME_TYPE:
            this.issue_type = field.optionId
            break
          case PROJECT_FIELD_NAME_EST_POINTS:
            this.estimated_points = field.number
            break
          default:
            break
        }
      }
    }
  }
}
