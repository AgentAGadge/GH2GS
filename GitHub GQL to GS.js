function gitquery() {
  var projectNumber = 2
  var sheet = SpreadsheetApp.getActive().getSheetByName('Github Database')

  var lineNumber = 1

  function getFirstEmptyRow(sheet) {
    const column = sheet.getRange('A:A');
    const values = column.getValues();
    let ct = 0;
    while ( values[ct] && values[ct][0] != "" ) {
      ct++;
    }
    return (ct+1);
  }

  const COLUMN_DBID_RANK = 1;
  const COLUMN_DBID_LABEL = 'databaseId';
  const COLUMN_TITLE_RANK = 2;
  const COLUMN_TITLE_LABEL = 'Title';
  const COLUMN_TYPE_RANK = 3;
  const COLUMN_TYPE_LABEL = 'Issue Type';
  const COLUMN_ASSIGNEE_RANK = 4;
  const COLUMN_ASSIGNEE_LABEL = 'Assignee';
  const COLUMN_STATUS_RANK = 5;
  const COLUMN_STATUS_LABEL = 'Status';
  const COLUMN_EPIC_RANK = 6;
  const COLUMN_EPIC_LABEL = 'EPIC';
  const COLUMN_REPO_RANK = 7;
  const COLUMN_REPO_LABEL = 'Repository';
  const COLUMN_SPRINT_RANK = 8;
  const COLUMN_SPRINT_LABEL = 'Sprint';
  const COLUMN_PRIORITY_RANK = 9;
  const COLUMN_PRIORITY_LABEL = 'Priority';
  const COLUMN_VERSION_RANK = 10;
  const COLUMN_VERSION_LABEL = 'Impacted Version';


  class SheetHeader {
    constructor (column, header){
      this.column = column
      this.header = header
    }

    setHeaderToSheet(sheet) { 
      sheet.getRange(1,this.column).setValue(this.header)
    }
  }

  const sheetHeaders = [
    new SheetHeader(COLUMN_DBID_RANK,     COLUMN_DBID_LABEL     ),
    new SheetHeader(COLUMN_TITLE_RANK,    COLUMN_TITLE_LABEL    ),
    new SheetHeader(COLUMN_TYPE_RANK,     COLUMN_TYPE_LABEL     ),
    new SheetHeader(COLUMN_ASSIGNEE_RANK, COLUMN_ASSIGNEE_LABEL ),
    new SheetHeader(COLUMN_STATUS_RANK,   COLUMN_STATUS_LABEL   ),
    new SheetHeader(COLUMN_EPIC_RANK,     COLUMN_EPIC_LABEL     ),
    new SheetHeader(COLUMN_REPO_RANK,     COLUMN_REPO_LABEL     ),
    new SheetHeader(COLUMN_SPRINT_RANK,   COLUMN_SPRINT_LABEL   ),
    new SheetHeader(COLUMN_PRIORITY_RANK, COLUMN_PRIORITY_LABEL ),
    new SheetHeader(COLUMN_VERSION_RANK,  COLUMN_VERSION_LABEL  )
  ]

  for (headerNumber = 0; headerNumber < sheetHeaders.length ; headerNumber++ ){
    sheetHeaders[headerNumber].setHeaderToSheet(sheet)
  }
  lineNumber++;

  class ParsedIssue {
    constructor(projectV2Item) { // class constructor
      this.databaseId = projectV2Item.databaseId;
      this.title = projectV2Item.content.title;
      this.created_at = projectV2Item.content.createdAt;
      this.url = projectV2Item.content.url;

      this.assignee = null;
      this.repository = null;
      this.epic = null;
      this.status = null;
      this.sprint = null;
      this.impacted_version = null;
      this.priority = null;
      this.issue_type = null;

      for (var fieldCounter = 0; fieldCounter <= projectV2Item.fieldValues.totalCount; fieldCounter = fieldCounter + 1) {
        var field = projectV2Item.fieldValues.nodes[fieldCounter]
        if(typeof field !== 'undefined' && typeof field.field !== 'undefined' && typeof field.field.name !== 'undefined'){
          switch (field.field.name)  {
              case "Assignees":
                  this.assignee = field.users.nodes[0].id;
                  break;
              case "Repository":
                  this.repository = field.repository.name;
                  break;
              case "Title":
                this.title = field.text;
                break;
              case "EPIC":
                this.epic = field.optionId;
                break;
              case "Status":
                this.status = field.optionId;
                break;
              case "Sprint":
                this.sprint = field.title;
                break;
              case "Impacted version":
                this.impacted_version = field.optionId;
                break;
              case "Priority":
                this.priority = field.optionId;
                break;
              case "Issue type":
                this.issue_type = field.optionId;
                break;
              default:
                break;
          }
        }
      }
    }

    writeInSheet(sheet, lineNumber){
      sheet.getRange(lineNumber,COLUMN_DBID_RANK    ).setValue(this.databaseId);
      sheet.getRange(lineNumber,COLUMN_TITLE_RANK   ).setValue(this.title);
      sheet.getRange(lineNumber,COLUMN_TYPE_RANK    ).setValue(this.issue_type);
      sheet.getRange(lineNumber,COLUMN_ASSIGNEE_RANK).setValue(this.assignee);
      sheet.getRange(lineNumber,COLUMN_STATUS_RANK  ).setValue(this.status);
      sheet.getRange(lineNumber,COLUMN_EPIC_RANK    ).setValue(this.epic);
      sheet.getRange(lineNumber,COLUMN_REPO_RANK    ).setValue(this.repository);
      sheet.getRange(lineNumber,COLUMN_SPRINT_RANK  ).setValue(this.sprint);
      sheet.getRange(lineNumber,COLUMN_PRIORITY_RANK).setValue(this.priority);
      sheet.getRange(lineNumber,COLUMN_VERSION_RANK ).setValue(this.impacted_version);

    }
  }

  const query = ` \
    query GetProjectItems($projectNumber : Int!) { \
    user(login: "AgentAGadge") { \
      projectV2(number: $projectNumber){ \
          databaseId,
          items(first:10){ 
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
              fieldValues(first:10){ 
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
    `;

  const query_variables = {projectNumber: projectNumber};
  var ql = 'https://api.github.com/graphql';
  var github_token = GetGithubToken()
  var response = UrlFetchApp.fetch(ql, {
      method: "POST",
      contentType: 'application/json', 
      headers: { Authorization: 'Bearer ' + github_token},
      payload: JSON.stringify({query: query, variables: query_variables})
      });
  var parsedData = JSON.parse(response.getContentText());
  project = parsedData.data.user.projectV2;
  for (var itemCounter = 0; itemCounter < project.items.totalCount; itemCounter = itemCounter + 1){
    if (typeof project.items.nodes[itemCounter].content.url !== 'undefined'){
      var parsedIssue = new ParsedIssue(project.items.nodes[itemCounter]);
      parsedIssue.writeInSheet(sheet,lineNumber++)
    }
  }
}