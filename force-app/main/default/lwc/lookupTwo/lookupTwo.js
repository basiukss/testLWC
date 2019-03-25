import { LightningElement, api, track } from 'lwc';

const CONTAINER_HTML = `<div>Some HTML</div>`;

export default class LookupTwo extends LightningElement {
    @api inputData;
    @track searchTerm = '';
    @track searchResult = [];
    @api resultData = {};
    blurTimeout;

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

    get hasNoResult(){
        return this.searchTerm.length > 0 & this.searchResult.length === 0 & this.resultData.length === 0;
    }

    selectItem(evt){             
        // console.log(`Select:`+ evt.target.dataset.itemValue + ' ' + evt.target.outerText);
        this.resultData = {'Value': evt.target.dataset.itemValue, 'Label': evt.target.outerText};        
        this.searchResult = [];
        this.searchTerm = evt.target.outerText;
        console.log(this.resultData);

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

    get getItemId(){
        let id = 'lookupItem' + this.itemId;
        this.itemId ++;
        return id;
    }

    get test(){
        console.log(this);
        console.log(this.template.querySelector('lookupItem'));
        return '';
    }

    renderedCallback() {
        const elements = this.template.querySelectorAll('.container');        
        if(elements.length >0){
            for(let i = 0; i < elements.length; i++){
                let str = elements[i].title;
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
                            '<span class="highlight">' + 
                            str.slice(foundedPositions[j], foundedPositions[j] + keyword.length) + 
                            '</span>' + 
                            str.slice(foundedPositions[j] + keyword.length)
                    }
                }
                elements[i].innerHTML = str;
            }
        }
    }
}