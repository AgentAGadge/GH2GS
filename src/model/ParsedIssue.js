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
              case PROJECT_FIELD_NAME_ASSIGNEES:
                  this.assignee = field.users.nodes[0].id;
                  break;
              case PROJECT_FIELD_NAME_REPO:
                  this.repository = field.repository.name;
                  break;
              case PROJECT_FIELD_NAME_TITLE:
                this.title = field.text;
                break;
              case PROJECT_FIELD_NAME_EPIC:
                this.epic = field.optionId;
                break;
              case PROJECT_FIELD_NAME_STATUS:
                this.status = field.optionId;
                break;
              case PROJECT_FIELD_NAME_SPRINT:
                this.sprint = field.title;
                break;
              case PROJECT_FIELD_NAME_VERSION:
                this.impacted_version = field.optionId;
                break;
              case PROJECT_FIELD_NAME_PRIORITY:
                this.priority = field.optionId;
                break;
              case PROJECT_FIELD_NAME_TYPE:
                this.issue_type = field.optionId;
                break;
            case PROJECT_FIELD_NAME_EST_POINTS:
                this.estimated_points = field.number;
                break;
              default:
                break;
          }
        }
      }
    }
  }