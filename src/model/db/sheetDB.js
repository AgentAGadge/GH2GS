/**
 * This file manages the database through a Google Sheet file.
 */

// --- CONSTANT DEFINITIONS ---
// Google Sheet columns for the GitHub Database
const COLUMN_DBID_RANK = 1
const COLUMN_DBID_LABEL = 'databaseId'
const COLUMN_TITLE_RANK = COLUMN_DBID_RANK + 1
const COLUMN_TITLE_LABEL = 'Title'
const COLUMN_TYPE_RANK = COLUMN_TITLE_RANK + 1
const COLUMN_TYPE_LABEL = 'Issue Type'
const COLUMN_EST_POINTS_RANK = COLUMN_TYPE_RANK + 1
const COLUMN_EST_POINTS_LABEL = 'Points (est.)'
const COLUMN_ASSIGNEE_RANK = COLUMN_EST_POINTS_RANK + 1
const COLUMN_ASSIGNEE_LABEL = 'Assignee'
const COLUMN_STATUS_RANK = COLUMN_ASSIGNEE_RANK + 1
const COLUMN_STATUS_LABEL = 'Status'
const COLUMN_EPIC_RANK = COLUMN_STATUS_RANK + 1
const COLUMN_EPIC_LABEL = 'EPIC'
const COLUMN_REPO_RANK = COLUMN_EPIC_RANK + 1
const COLUMN_REPO_LABEL = 'Repository'
const COLUMN_SPRINT_RANK = COLUMN_REPO_RANK + 1
const COLUMN_SPRINT_LABEL = 'Sprint'
const COLUMN_PRIORITY_RANK = COLUMN_SPRINT_RANK + 1
const COLUMN_PRIORITY_LABEL = 'Priority'
const COLUMN_VERSION_RANK = COLUMN_PRIORITY_RANK + 1
const COLUMN_VERSION_LABEL = 'Impacted Version'

const NUM_HEADER_LINES = 1
const TYPE_GOOGLE_SHEET = 'Sheet'

/**
 * buildSheetHeaders instantiates an array of SheetHeader that contains all headers needed for the
 * Google Sheet-based DB.
 * @returns {SheetHeader[]} array of all SheetHeader needed to build the DB.
 */
function buildSheetHeaders () {
  /* eslint-disable no-multi-spaces, space-in-parens */
  const sheetHeaders = [
    new SheetHeader(COLUMN_DBID_RANK,       COLUMN_DBID_LABEL       ),
    new SheetHeader(COLUMN_TITLE_RANK,      COLUMN_TITLE_LABEL      ),
    new SheetHeader(COLUMN_TYPE_RANK,       COLUMN_TYPE_LABEL       ),
    new SheetHeader(COLUMN_ASSIGNEE_RANK,   COLUMN_ASSIGNEE_LABEL   ),
    new SheetHeader(COLUMN_STATUS_RANK,     COLUMN_STATUS_LABEL     ),
    new SheetHeader(COLUMN_EPIC_RANK,       COLUMN_EPIC_LABEL       ),
    new SheetHeader(COLUMN_REPO_RANK,       COLUMN_REPO_LABEL       ),
    new SheetHeader(COLUMN_SPRINT_RANK,     COLUMN_SPRINT_LABEL     ),
    new SheetHeader(COLUMN_PRIORITY_RANK,   COLUMN_PRIORITY_LABEL   ),
    new SheetHeader(COLUMN_VERSION_RANK,    COLUMN_VERSION_LABEL    ),
    new SheetHeader(COLUMN_EST_POINTS_RANK, COLUMN_EST_POINTS_LABEL )
  ]
  /* eslint-enable no-multi-spaces, space-in-parens */
  return sheetHeaders
}

/**
 * SheetHeader is the class representing one column header of a sheetDB (Google Sheet-based DB)
 */
class SheetHeader {
  /**
   * Constructor of SheetHeader
   * @param {*} column The column number (starting from 1 for A, 2 for B, etc.)
   * @param {*} header The label of the column (or its name)
   */
  constructor (column, header) {
    this.column = column
    this.header = header
  }

  /**
   * setHeaderToSheet writes the header label into the first cell of the corresponding column in a given sheet.
   * It is used to initialize the Google Sheet.
   * @param {*} sheet Google Sheet to write to
   */
  setHeaderToSheet (sheet) {
    sheet.getRange(1, this.column).setValue(this.header)
  }
}

/**
 * SheetDB is the class representing a Google Sheet-based relational DB for GitHub project items.
 */
class SheetDB {
  /**
   * Constructor of a SheetDB
   * @param {*} sheet Google Sheet to be used to store the DB.
   */
  constructor (sheet) {
    this.sheet = sheet
    this.sheetHeaders = buildSheetHeaders()
    this.nextLine = 0 // points to the next empty line. Valid values start at 1. By default, 0 while the DB is not initialized.
    this.projectConfiguration = null // Configuration of the project used to feed the DB
    this.userList = {} // List of GitHub users that appear within the DB and its associated project.
  }

  /**
   * writeSheetHeaders prepares the Google Sheet DB by writing all the column names.
   */
  writeSheetHeaders () {
    for (let headerNumber = 0; headerNumber < this.sheetHeaders.length; headerNumber++) {
      this.sheetHeaders[headerNumber].setHeaderToSheet(this.sheet)
    }
  }

  /**
   * initDB initializes the database. It must be called before starting using the DB so that it is ready to operate.
   * - It writes the column names at the top of the sheet
   * - It initializes the next empty line pointer (nextLine)
   */
  initDB () {
    this.writeSheetHeaders()
    this.nextLine = NUM_HEADER_LINES + 1
  }

  /**
   * insertIssue adds a new GitHub Issue to the sheetDB by populating the next empty lines with all the available information.
   * This function maps ParsedIssue properties into the sheetDB columns.
   * @param {object} issue ParsedIssue to be added to the DB.
   * @returns {number} Line number at which the issue has been inserted.
   */
  insertIssue (issue) {
    let lineNumber = null
    lineNumber = this.nextLine // The new issue is inserted in the first available line.
    /* eslint-disable no-multi-spaces, space-in-parens */
    // Mapping of ParsedIssue to sheetDB columns
    this.sheet.getRange(lineNumber, COLUMN_DBID_RANK       ).setValue(issue.databaseId)
    this.sheet.getRange(lineNumber, COLUMN_TITLE_RANK      ).setValue(issue.title)
    this.sheet.getRange(lineNumber, COLUMN_TYPE_RANK       ).setValue(issue.issue_type)
    this.sheet.getRange(lineNumber, COLUMN_ASSIGNEE_RANK   ).setValue(issue.assignee)
    this.sheet.getRange(lineNumber, COLUMN_STATUS_RANK     ).setValue(issue.status)
    this.sheet.getRange(lineNumber, COLUMN_EPIC_RANK       ).setValue(issue.epic)
    this.sheet.getRange(lineNumber, COLUMN_REPO_RANK       ).setValue(issue.repository)
    this.sheet.getRange(lineNumber, COLUMN_SPRINT_RANK     ).setValue(issue.sprint)
    this.sheet.getRange(lineNumber, COLUMN_PRIORITY_RANK   ).setValue(issue.priority)
    this.sheet.getRange(lineNumber, COLUMN_VERSION_RANK    ).setValue(issue.impacted_version)
    this.sheet.getRange(lineNumber, COLUMN_EST_POINTS_RANK ).setValue(issue.estimated_points)
    /* eslint-enable no-multi-spaces, space-in-parens */

    this.nextLine++
    return lineNumber
  }

  /**
   * replaceSSIDByName looks for the slug (readable name) corresponding to an
   * optionID stored in the sheetDB from a Single Select project field, and replaces it
   * in the sheetDB.
   * @param {*} projectConfiguration ProjectConfiguration of the project from which the issue comes from
   * @param {*} lineNumber line number at which the issue is stored in the SheetDB
   * @param {*} column column number at which the optionID is currently stored in the SheetDB.
   * @param {*} fieldName name of the Single Select Project Field on GitHub
   */
  replaceSSIDByName (projectConfiguration, lineNumber, column, fieldName) {
    // Get the optionId value currently stored in the sheetDB
    const optionId = this.sheet.getRange(lineNumber, column).getValue()
    // Find the corresponding slug in the project configuration
    const optionName = projectConfiguration.getOptionNameById(fieldName, optionId)
    // Replace the optionId by the optionName in the sheetDB
    if (null !== optionName) { // If the optionName has been found, otherwise leave as is.
      this.sheet.getRange(lineNumber, column).setValue(optionName)
    }
  }

  /**
   * applyProjectConfiguration goes through the SheetDB and replaces all Single Select
   * optionId values by the corresponding name/slug.
   * applyProjectConfiguration should be called for a SheetDB containing raw lines with
   * still optionId not replaced by the corresponding slug/name.
   * @param {*} projectConfiguration ProjectConfiguration containing the details of the Project Fields.
   */
  applyProjectConfiguration (projectConfiguration) {
    // Go through each line (DB entry)
    for (let lineNumber = NUM_HEADER_LINES + 1; lineNumber < this.nextLine; lineNumber++) {
      // For each line, try to replace the currently stored value in columns linkes to Single Select fields:
      // Issue Type
      this.replaceSSIDByName(projectConfiguration, lineNumber, COLUMN_TYPE_RANK, PROJECT_FIELD_NAME_TYPE)
      // Status
      this.replaceSSIDByName(projectConfiguration, lineNumber, COLUMN_STATUS_RANK, PROJECT_FIELD_NAME_STATUS)
      // Priority
      this.replaceSSIDByName(projectConfiguration, lineNumber, COLUMN_PRIORITY_RANK, PROJECT_FIELD_NAME_PRIORITY)
      // Impacted Version
      this.replaceSSIDByName(projectConfiguration, lineNumber, COLUMN_VERSION_RANK, PROJECT_FIELD_NAME_VERSION)
      // EPIC
      this.replaceSSIDByName(projectConfiguration, lineNumber, COLUMN_EPIC_RANK, PROJECT_FIELD_NAME_EPIC)
    }
  }

  /**
   * applyAssignees replaces Assignee nodeId retrieves from the GitHub Project Items by the corresponding user name.
   * To avoid multiplying calls to the API, user names are stored in sheetDB.userList and re-used if possible.
   */
  applyAssignees () {
    let userId = null
    let userName = null

    // Go through all the entries
    for (let lineNumber = NUM_HEADER_LINES + 1; lineNumber < this.nextLine; lineNumber++) {
      // Get the stored value in the Assignee column
      userId = this.sheet.getRange(lineNumber, COLUMN_ASSIGNEE_RANK).getValue()
      // Check if this value is a known userId
      if (userId in this.userList) {
        userName = this.userList[userId] // If yes, re-use the known user name
      } else {
        userName = GetUserNameById(userId) // Otherwise, get it from GitHub API
      }
      if (null != userName) { // If a name has been found
        this.userList[userId] = userName // Store it so that it can be re-used
        this.sheet.getRange(lineNumber, COLUMN_ASSIGNEE_RANK).setValue(userName) // And replace it in DB
      } // If the userName was already there, the search returned null and there is nothing to be done.
    }
  }

  /**
   * syncGHFieldsToDB builds the ProjectConfiguration for GitHub and applies it to the SheetDB entries:
   * - Replace optionId by optionName for Single Select fields
   * - Replace userId by userName for Assignees
   * @param {*} projectNumber ProjectV2 number within the GitHub user
   */
  syncGHFieldsToDB (projectNumber) {
    Logger.log('Syncing Project fields...')
    this.projectConfiguration = new ProjectConfiguration()
    this.projectConfiguration.jsonOptionsSS = GetProjectSSFieldsOptionNames(projectNumber)

    this.applyProjectConfiguration(this.projectConfiguration)
    this.applyAssignees()
    Logger.log('Project fields synced.')
  }

  /**
   * syncGHItemsToDB retrieves all Project Items and store them into the sheetDB.
   * @param {*} projectNumber ProjectV2 number within the GitHub user
   */
  syncGHItemsToDB (projectNumber) {
    let parsedIssue = null

    Logger.log('Syncing Project items...')
    const jsonProjectItems = GetProjectItems(projectNumber)
    for (let itemCounter = 0; itemCounter < jsonProjectItems.items.totalCount; itemCounter = itemCounter + 1) {
      if (typeof jsonProjectItems.items.nodes[itemCounter].content.url !== 'undefined') {
        parsedIssue = new ParsedIssue(jsonProjectItems.items.nodes[itemCounter])
        this.insertIssue(parsedIssue)
      }
    }
    Logger.log('Project items synced.')
  }

  /**
   * syncDB feeds and prepare/clean the SheetDB with data from a GitHub project.
   * It inserts all the Project Items and replaces the IDs with the corresponding slugs when available.
   * @param {*} projectNumber ProjectV2 number within the GitHub user
   */
  syncDB (projectNumber) {
    this.syncGHItemsToDB(projectNumber)
    this.syncGHFieldsToDB(projectNumber)
  }
}
