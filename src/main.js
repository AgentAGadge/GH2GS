/**
 * Main function to create the Google sheet database and populate it from a GitHub project.
 */
function CreateGSFromGH () {
  Logger.log('CreateGSFromGH starting...')
  const projectNumber = 2
  const sheet = SpreadsheetApp.getActive().getSheetByName('Github Database')

  const sheetDB = new SheetDB(sheet)
  sheetDB.initDB()
  Logger.log('sheetDB Initiated.')

  sheetDB.syncDB(projectNumber)
  Logger.log('sheetDB Synced.')
}
