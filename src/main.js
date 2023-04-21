/**
 * Test
 */
function CreateGSFromGH () {
  Logger.log('gitquery starting...')
  const projectNumber = 2
  const sheet = SpreadsheetApp.getActive().getSheetByName('Github Database')

  const sheetDB = new SheetDB(sheet)
  sheetDB.initDB()
  Logger.log('sheetDB Initiated.')

  sheetDB.syncDB(projectNumber)
  Logger.log('sheetDB Synced.')
}
