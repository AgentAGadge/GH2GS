const COLUMN_DBID_RANK = 1;
const COLUMN_DBID_LABEL = 'databaseId';
const COLUMN_TITLE_RANK = COLUMN_DBID_RANK+1;
const COLUMN_TITLE_LABEL = 'Title';
const COLUMN_TYPE_RANK = COLUMN_TITLE_RANK+1;
const COLUMN_TYPE_LABEL = 'Issue Type';
const COLUMN_EST_POINTS_RANK =COLUMN_TYPE_RANK+1;
const COLUMN_EST_POINTS_LABEL = 'Points (est.)';
const COLUMN_ASSIGNEE_RANK = COLUMN_EST_POINTS_RANK+1;
const COLUMN_ASSIGNEE_LABEL = 'Assignee';
const COLUMN_STATUS_RANK = COLUMN_ASSIGNEE_RANK+1;
const COLUMN_STATUS_LABEL = 'Status';
const COLUMN_EPIC_RANK = COLUMN_STATUS_RANK+1;
const COLUMN_EPIC_LABEL = 'EPIC';
const COLUMN_REPO_RANK = COLUMN_EPIC_RANK+1;
const COLUMN_REPO_LABEL = 'Repository';
const COLUMN_SPRINT_RANK = COLUMN_REPO_RANK+1;
const COLUMN_SPRINT_LABEL = 'Sprint';
const COLUMN_PRIORITY_RANK = COLUMN_SPRINT_RANK+1;
const COLUMN_PRIORITY_LABEL = 'Priority';
const COLUMN_VERSION_RANK = COLUMN_PRIORITY_RANK+1;
const COLUMN_VERSION_LABEL = 'Impacted Version';


const NUM_HEADER_LINES = 1
const TYPE_GOOGLE_SHEET = "Sheet"

function buildSheetHeaders() {
  var sheetHeaders = [
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
  return sheetHeaders
}

class SheetHeader {
  constructor (column, header){
    this.column = column
    this.header = header
  }
  setHeaderToSheet(sheet) { 
    sheet.getRange(1,this.column).setValue(this.header)
  }
}

class SheetDB {
  constructor(sheet){
    this.sheet = sheet;
    this.sheetHeaders = buildSheetHeaders();
    this.nextLine = 0;
  }

  
  writeSheetHeaders(){
    for (var headerNumber = 0; headerNumber < this.sheetHeaders.length ; headerNumber++ ){
      this.sheetHeaders[headerNumber].setHeaderToSheet(this.sheet)
    }
  }

  initDB(){
    this.writeSheetHeaders();
    this.nextLine = NUM_HEADER_LINES+1
  }

  insertIssue(issue){
    var lineNumber = null
    lineNumber = this.nextLine;

    this.sheet.getRange(lineNumber,COLUMN_DBID_RANK       ).setValue(issue.databaseId);
    this.sheet.getRange(lineNumber,COLUMN_TITLE_RANK      ).setValue(issue.title);
    this.sheet.getRange(lineNumber,COLUMN_TYPE_RANK       ).setValue(issue.issue_type);
    this.sheet.getRange(lineNumber,COLUMN_ASSIGNEE_RANK   ).setValue(issue.assignee);
    this.sheet.getRange(lineNumber,COLUMN_STATUS_RANK     ).setValue(issue.status);
    this.sheet.getRange(lineNumber,COLUMN_EPIC_RANK       ).setValue(issue.epic);
    this.sheet.getRange(lineNumber,COLUMN_REPO_RANK       ).setValue(issue.repository);
    this.sheet.getRange(lineNumber,COLUMN_SPRINT_RANK     ).setValue(issue.sprint);
    this.sheet.getRange(lineNumber,COLUMN_PRIORITY_RANK   ).setValue(issue.priority);
    this.sheet.getRange(lineNumber,COLUMN_VERSION_RANK    ).setValue(issue.impacted_version);
    this.sheet.getRange(lineNumber,COLUMN_EST_POINTS_RANK ).setValue(issue.estimated_points);

    this.nextLine++;
    return lineNumber;
  }

  replaceSSIDByName(projectConfiguration, lineNumber, column, fieldName){
    var optionId = this.sheet.getRange(lineNumber,column ).getValue();
    var optionName = projectConfiguration.getOptionNameById(fieldName, optionId);
    if(null !== optionName){
      this.sheet.getRange(lineNumber,column ).setValue(optionName);
    }
  }  

  applyProjectConfiguration(projectConfiguration){
    for (var lineNumber = NUM_HEADER_LINES+1; lineNumber < this.nextLine; lineNumber++ ){
      //Issue Type
      this.replaceSSIDByName(projectConfiguration, lineNumber, COLUMN_TYPE_RANK, PROJECT_FIELD_NAME_TYPE);
      //Status
      this.replaceSSIDByName(projectConfiguration, lineNumber, COLUMN_STATUS_RANK, PROJECT_FIELD_NAME_STATUS);
      //Priority
      this.replaceSSIDByName(projectConfiguration, lineNumber, COLUMN_PRIORITY_RANK, PROJECT_FIELD_NAME_PRIORITY);
      //Impacted Version
      this.replaceSSIDByName(projectConfiguration, lineNumber, COLUMN_VERSION_RANK, PROJECT_FIELD_NAME_VERSION);
      //EPIC
      this.replaceSSIDByName(projectConfiguration, lineNumber, COLUMN_EPIC_RANK, PROJECT_FIELD_NAME_EPIC);
    }   
  }

}


