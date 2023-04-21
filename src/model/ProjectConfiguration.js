const PROJECT_FIELD_NAME_ASSIGNEES = 'Assignees'
const PROJECT_FIELD_NAME_REPO = 'Repository'
const PROJECT_FIELD_NAME_TITLE = 'Title'
const PROJECT_FIELD_NAME_EPIC = 'EPIC'
const PROJECT_FIELD_NAME_STATUS = 'Status'
const PROJECT_FIELD_NAME_SPRINT = 'Sprint'
const PROJECT_FIELD_NAME_VERSION = 'Impacted version'
const PROJECT_FIELD_NAME_PRIORITY = 'Priority'
const PROJECT_FIELD_NAME_TYPE = 'Issue type'
const PROJECT_FIELD_NAME_EST_POINTS = 'Points estimate'

class ProjectConfiguration {
  constructor () {
    this.jsonOptionsSS = null
  }

  getOptionNameById (fieldName, optionId) {
    let uutFieldName = null
    let matchingField = null

    for (let fieldNumber = 0; fieldNumber < this.jsonOptionsSS.totalCount; fieldNumber++) {
      uutFieldName = this.jsonOptionsSS.nodes[fieldNumber].name
      if (typeof uutFieldName !== 'undefined' && fieldName == uutFieldName) { // eslint-disable-line eqeqeq
        matchingField = this.jsonOptionsSS.nodes[fieldNumber]
        for (let optionNumber = 0; optionNumber < matchingField.options.length; optionNumber++) {
          if (optionId == matchingField.options[optionNumber].id) { // eslint-disable-line eqeqeq
            return matchingField.options[optionNumber].name
          }
        }
        return null
      }
    }
    return null
  }
}
