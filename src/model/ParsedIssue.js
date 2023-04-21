const TYPE_PARSEDISSUE = "ParsedIssue"

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
      this.estimated_points = null;

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
            case "Points estimate":
                this.estimated_points = field.number;
                break;
              default:
                break;
          }
        }
      }
    }
  }