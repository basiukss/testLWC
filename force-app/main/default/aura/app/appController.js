({
    onInit : function(component, event, helper) {                
    }
    ,    
    handleClickRandom : function(component, event, helper) {                
        let arr=[];
        for(let i=0; i<10; i++){
            arr.push({Value : 'value'+i, Label:'label'+i});
        }
        component.set("v.data", arr);
    }
    ,
    handleClickAccount: function(component, event, helper) {                
        var action = component.get("c.getAccountList");
        action.setCallback(this, function(response){
            var state = response.getState();
            if (state === "SUCCESS") {                
                var result = response.getReturnValue();
                console.log(result); 
                component.set("v.data", JSON.parse(result));
            }
        });
        $A.enqueueAction(action);
    }
    ,
    handleClickContact: function(component, event, helper) {                
        var action = component.get("c.getContactList");
        action.setCallback(this, function(response){
            var state = response.getState();
            if (state === "SUCCESS") {                
                var result = response.getReturnValue();
                console.log(result); 
                component.set("v.data", JSON.parse(result));
            }
        });
        $A.enqueueAction(action);
    }
    ,  
    handleCustomEvent: function(component,event, helper){
        console.log('Aura handle event');
        console.log(event.getParam('selected'));
        component.set("v.selected", event.getParam('selected'));
    }
    ,  
    handleClear: function(component,event, helper){
        console.log(`Aura clear`);
    }
})
