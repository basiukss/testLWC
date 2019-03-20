import { LightningElement, track, wire } from 'lwc';
import getRecordList from '@salesforce/apex/RecordController.getRecordList';
import getObjectList from '@salesforce/apex/RecordController.getObjectList';
import getFieldsList from '@salesforce/apex/RecordController.getFieldsList';
import getRecordValue from '@salesforce/apex/RecordController.getRecordValue';

export default class Record extends LightningElement {
    @track text = 'record list:';    
    @track objectListA;
    
    @track error;
    
    @track objectList;
    @track queryObjects = [];
    @track selectedObject = {Name : '', Label : ''};

    @track fieldList;
    @track queryFields = [];
    @track selectedField = {Name : '', Label : ''};

    @track valueList;

    @wire(getRecordList, {})
    wiredRecords({ error, data }) {
        if (data) {
            //console.log(data);
            this.objectListA = JSON.parse(data);
        } else if (error) {
            this.error = error;
            console.log('wiredRecords error');
        }
    }

    @wire(getObjectList, {})
    objects({ error, data }){
        if (data) {
            //console.log(data);
            this.objectList = JSON.parse(data);
            this.objectList.sort(function(a,b) {            
                return ((a.Label > b.Label) - (b.Label > a.Label))
            });
        } else if (error) {
            this.error = error;
            console.log('getObjectList error');
        }        
    }

    handleFileds(){
        getFieldsList({obj : this.selectedObject.Name})
            .then(result => {
                console.log(`getFieldsList:`);
                this.fieldList = JSON.parse(result);
                this.fieldList.sort(function(a,b) {            
                    return ((a.Label > b.Label) - (b.Label > a.Label))
                });
                console.log(this.fieldList);
            })
            .catch(error =>{
                console.log(`getFieldsList error `, error);
            })
    }

    handleObjectSearch(evt) {
        let result = [];        
        const keyword = evt.target.value;
        if (keyword.length>0) {
            if(this.objectList.length > 0){
                const field = "Label";
                for(let i=0; i < this.objectList.length; i++) {                     
                    if(~(this.objectList[i][field]).toUpperCase().indexOf(keyword.toUpperCase())){
                        // console.log(`search result for '${keyword}': ${this.objectList[i][field]}`);
                        result.push(this.objectList[i]);
                    }
                }
            }
        }
        this.queryObjects = result;
    }

    get searchObjectResult() {
        return this.queryObjects.length > 0;
    }

    selectObject(evt){
        console.log(`Select object:`, evt.target.dataset.recordApiName);
        this.selectedObject.Name = evt.target.dataset.recordApiName;
        
        this.selectedObject.Label = evt.target.outerText;
        this.queryObjects = [];
        this.handleFileds();
    }

    handleFieldSearch(evt) {
        let result = [];        
        const keyword = evt.target.value;
        //if (keyword.length>0) {
            if(this.fieldList.length > 0){
                const field = "Label";
                for(let i=0; i < this.fieldList.length; i++) {                     
                    if(~(this.fieldList[i][field]).toUpperCase().indexOf(keyword.toUpperCase())){
                        // console.log(`search result for '${keyword}': ${this.fieldList[i][field]}`);
                        result.push(this.fieldList[i]);
                    }
                }
            }
        //}
        this.queryFields = result;
    }

    get searchFieldResult() {
        return this.queryFields.length > 0;
    }

    selectField(evt){
        console.log(`Select field:`, evt.target.dataset.recordApiName);
        this.selectedField.Name = evt.target.dataset.recordApiName;
        this.selectedField.Label = evt.target.outerText;
        this.queryFields = [];

        this.handleValues();
    }

    handleValues(){
        console.log(this.selectedField.Name);
        console.log(this.selectedObject.Name);
        
        getRecordValue({queryField : this.selectedField.Name, queryObj : this.selectedObject.Name})
            .then(result => {
                console.log(`getRecordValue:`);              
                console.log(result);
                this.valueList = JSON.parse(result);
            })
            .catch(error =>{
                console.log(`getFieldsList error `, error);
            })
    }    
}