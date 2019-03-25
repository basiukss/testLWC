import { LightningElement, api, track } from 'lwc';

export default class LookupTwo extends LightningElement {
    @api inputData;
    @track searchTerm = '';
    @track searchResult = [];
    @api resultData = {};
    blurTimeout;

    @api 
    get lwcAction(){
        return null;
    }
    set lwcAction(data){
        if(data){
            console.log('lwc get lwcAction: ');
            if(data.action === 'clear'){
                console.log('clear ' + data.object.Label);
                if(this.hasSelection()){
                    this.handleClearSelectedItem();
                }
            }else{
                console.log(data.action);
            }
        }
    }

    handleSearch(evt){
        // init
        const field = "Label";
        const data = this.inputData;
        let result = [];        
        // get search keyword
        const keyword = evt.target.value;
        this.searchTerm = keyword;
        //search
        if (data.length > 0) {
            for (let i = 0; i < data.length; i++) {
                if (~(data[i][field]).toUpperCase().indexOf(keyword.toUpperCase())) {                    
                    // console.log(`search result for '${keyword}': ${data[i][field]}`);
                    result.push(data[i]);
                }            
            }
        }
        // sort results
        result.sort(function (a, b) {
            return ((a[field] > b[field]) - (b[field] > a[field]))
        });        
        this.searchResult = result;        
    }

    handleKeyUp(evt){
        const isEnterKey = evt.keyCode === 27; // escape
        if (isEnterKey) {
            this.searchTerm = evt.target.value = '';
            this.searchResult = [];
            this.handleSearch(evt);
        }
    }

    handleBlur(){
        // Delay hiding combobox so that we can capture selected result
        // eslint-disable-next-line @lwc/lwc/no-async-operation
        this.blurTimeout = window.setTimeout(() => {
                this.searchResult = [];
                this.searchTerm = '';
                this.blurTimeout = null;
            },
            300
        )        
    }
    
    hasResult() {
        return this.searchResult.length > 0;
    }

    get hasNoResult(){
        return this.searchTerm.length > 0 & this.searchResult.length === 0 & this.hasSelection() === false;
    }

    selectItem(evt){             
        // console.log(`Select:`+ evt.target.dataset.itemValue + ' ' + evt.target.outerText);
        this.resultData = {'Value': evt.target.dataset.itemValue, 'Label': evt.target.outerText};        
        this.searchResult = [];
        this.searchTerm = evt.target.outerText;
        //console.log(this.resultData);

        // close resultList
        if (this.blurTimeout) {
            window.clearTimeout(this.blurTimeout);
        }
        this.hasFocus = false;

        // event
        const eventName = 'selected';
        const event = new CustomEvent(eventName, {
            detail: { selected: this.resultData }
        });
        this.dispatchEvent(event);
    }
    
    handleClearSelectedItem(){
        this.searchResult = [];
        this.searchTerm = '';
        this.resultData = {};
        // event
        const eventName = 'cleared';
        const event = new CustomEvent(eventName);
        this.dispatchEvent(event);
    }

    renderedCallback() {
        const elements = this.template.querySelectorAll('.container');        
        if(elements.length >0){
            //console.log(elements[0].dataset.itemLabel);
            for(let i = 0; i < elements.length; i++){
                let str = elements[i].dataset.itemLabel;
                const keyword = this.searchTerm;
                if(keyword.length > 0){
                    let pos = 0;
                    let foundedPositions = [];
                    while(true){
                        let foundPos = str.toUpperCase().indexOf(keyword.toUpperCase(), pos);
                        if(foundPos === -1){
                            break;
                        }else {
                            foundedPositions.push(foundPos);
                            pos = foundPos + 1;
                        }
                    }
                    for(let j = foundedPositions.length-1; j >= 0; j--){
                        str = str.slice(0, foundedPositions[j]) + 
                            '<span style="font-weight:bold; color: white; background-color: grey">' + 
                            str.slice(foundedPositions[j], foundedPositions[j] + keyword.length) + 
                            '</span>' + 
                            str.slice(foundedPositions[j] + keyword.length)
                    }
                }
                elements[i].innerHTML = str;
            }
        }
    }

    hasSelection() {
        if(this.resultData.hasOwnProperty('Label')){
            return true;
        }
        return false;
    }

    // style
    get getLookupClass(){
        let style = 'slds-lookup ';
        if(this.hasResult() || (this.searchTerm.length > 0 & this.hasSelection() === false)){
            style += 'slds-is-open'
        }
        return style;
    }

    get getFormPillClass(){
        let style = 'slds-pill_container ';
        if(this.hasSelection()){
            style += 'slds-show';
        } else{
            style += 'slds-hide';
        }
        return style;
    }

    get getFormInputClass(){
        let style = 'slds-input ';
        if(this.hasSelection()){
            style += 'slds-hide';
        } else{
            style += 'slds-show';
        }
        return style;
    }

    get getFormIconClass(){
        if(this.hasSelection()){
            return 'slds-hide';
        }
        return 'slds-icon slds-input__icon slds-input__icon_right slds-icon-text-default';
    }

    // get getSelectIconName() {
    //     if(this.hasSelection() === true){
    //         return 'utility:close';
    //     }
    //     return 'utility:search';
    // }
}