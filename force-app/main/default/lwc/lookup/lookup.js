import { LightningElement, api, track } from 'lwc';

export default class Lookup extends LightningElement {
    @api inputData;
    @track resultData = [];
    @track searchTerm = '';
    @track searchResults =[];

    @track hasFocus = false;    

    handleFocus() {
        this.hasFocus = true;
    }

    handleSearch(evt) {
        const field = "Label";
        let result = [];
        
        const keyword = evt.target.value;
        this.searchTerm = keyword;
        evt.target.value = '';

        if (this.inputData.length > 0) {
            for (let i = 0; i < this.inputData.length; i++) {
                if (~(this.inputData[i][field]).toUpperCase().indexOf(keyword.toUpperCase())) {
                    // console.log(`search result for '${keyword}': ${this.inputData[i][field]}`);
                    result.push(this.inputData[i]);
                }
            }
        }
        result.sort(function (a, b) {
            return ((a[field] > b[field]) - (b[field] > a[field]))
        });
        this.searchResults = result;
    }
    
    selectItem(evt){             
        console.log(`Select:`, evt.target.dataset.itemValue, ' ', evt.target.outerText);  
        this.resultData.push({'Value': evt.target.dataset.itemValue, 'Label': evt.target.outerText});        
        this.searchResults = [];
        this.hasFocus = false;
        this.searchTerm = '';
    }

    handleRemoveSelectedItem(evt) {
        const key = evt.currentTarget.label;
        this.resultData = this.resultData.filter(function(item) {
            return item.Label !== key;
          })
    }

    get hasResults() {
        return this.hasFocus && this.searchResults.length > 0;
    }

    get hasSearchTerm() {
        return this.searchTerm;
    }
}