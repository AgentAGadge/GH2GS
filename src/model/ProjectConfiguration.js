const PROJECT_FIELD_NAME_ASSIGNEES = "Assignees"
const PROJECT_FIELD_NAME_REPO = "Repository"
const PROJECT_FIELD_NAME_TITLE = "Title"
const PROJECT_FIELD_NAME_EPIC = "EPIC"
const PROJECT_FIELD_NAME_STATUS = "Status"
const PROJECT_FIELD_NAME_SPRINT = "Sprint"
const PROJECT_FIELD_NAME_VERSION = "Impacted version"
const PROJECT_FIELD_NAME_PRIORITY = "Priority"
const PROJECT_FIELD_NAME_TYPE = "Issue type"
const PROJECT_FIELD_NAME_EST_POINTS = "Points estimate"

class ProjectConfiguration{
    constructor(){
        this.jsonOptionsSS=null;
    }

    getOptionNameById(fieldName, optionId){
        for(var fieldNumber = 0 ; fieldNumber < this.jsonOptionsSS.totalCount; fieldNumber++){
            var uutFieldName = this.jsonOptionsSS.nodes[fieldNumber].name;
            if(typeof uutFieldName !== 'undefined' && fieldName == uutFieldName){
                var matchingField = this.jsonOptionsSS.nodes[fieldNumber];
                for(var optionNumber = 0 ; optionNumber < matchingField.options.length; optionNumber++){
                    if(optionId == matchingField.options[optionNumber].id){
                        return matchingField.options[optionNumber].name
                    }
                }
                return null;
            }
        }
        return null;
    }

}