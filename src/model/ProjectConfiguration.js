/**
 * This file contains the project configuration model and handles the exploration of the corresponding parsed JSON.
 */

// --- CONSTANT DEFINITIONS ---
// All field'names in GitHub corresponding to a column in the SheetDB must be listed here.
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

/**
 * This class contains a parsed JSON with all Single Select fields of the project and the associated method
 * to explore it.
 */
class ProjectConfiguration {
  /**
   * Basic constructor.
   */
  constructor () {
    this.jsonOptionsSS = null
  }

  /**
   * getOptionNameById retrieves the slug/name of an option from its optionId
   * and the name of the corresponding field it is used in.
   * @param {*} fieldName Name of the Single Select field in GitHub
   * @param {*} optionId optionId pointing to the desired field value
   * @returns {string} name/slug associated to the optionId
   */
  getOptionNameById (fieldName, optionId) {
    let uutFieldName = null
    let matchingField = null

    // Go through all the Single Select fields listed in the projectConfiguration.jsonOptionsSS
    for (let fieldNumber = 0; fieldNumber < this.jsonOptionsSS.totalCount; fieldNumber++) {
      uutFieldName = this.jsonOptionsSS.nodes[fieldNumber].name
      // Check if the field being tested is the one we are interested in
      if (typeof uutFieldName !== 'undefined' && fieldName == uutFieldName) { // eslint-disable-line eqeqeq
        matchingField = this.jsonOptionsSS.nodes[fieldNumber]
        // If yes, go through all the corresponding options
        for (let optionNumber = 0; optionNumber < matchingField.options.length; optionNumber++) {
          // to find the optionId we are looking for
          if (optionId == matchingField.options[optionNumber].id) { // eslint-disable-line eqeqeq
            // If it is found, return the associated slug (name)
            return matchingField.options[optionNumber].name
          }
        }
        return null // The field was found but the optionId is not.
      }
    }
    return null // The field was not found.
  }
}
