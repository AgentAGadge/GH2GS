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