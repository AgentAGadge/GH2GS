function gitquery() {
  Logger.log("gitquery starting...")
  var projectNumber = 2
  var sheet = SpreadsheetApp.getActive().getSheetByName('Github Database')
  

  var sheetDB = new SheetDB(sheet);
  sheetDB.initDB();
  Logger.log("sheetDB Initiated.")

  sheetDB.syncDB(projectNumber);
  Logger.log("sheetDB Synced.")
}