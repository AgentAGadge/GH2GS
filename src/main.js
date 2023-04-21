function gitquery() {
  Logger.log("gitquery starting...")
  var projectNumber = 2
  var sheet = SpreadsheetApp.getActive().getSheetByName('Github Database')
  

  var sheetDB = new SheetDB(sheet);
  sheetDB.initDB();
  Logger.log("sheetDB Initiated.")

  var projectConfiguration = new ProjectConfiguration();

  Logger.log("Syncing Project items...")
  jsonProjectItems = GetProjectItems(projectNumber);
  for (var itemCounter = 0; itemCounter < jsonProjectItems.items.totalCount; itemCounter = itemCounter + 1){
    if (typeof jsonProjectItems.items.nodes[itemCounter].content.url !== 'undefined'){
        var parsedIssue = new ParsedIssue(jsonProjectItems.items.nodes[itemCounter]);
        Logger.log(jsonProjectItems.items.nodes[itemCounter])
        sheetDB.insertIssue(parsedIssue)
    }
  } 
  Logger.log("Project items synced.")

  projectConfiguration.jsonOptionsSS = GetProjectSSFieldsOptionNames(projectNumber);
  Logger.log(projectConfiguration.jsonOptionsSS);
  
  sheetDB.applyProjectConfiguration(projectConfiguration);
  
}