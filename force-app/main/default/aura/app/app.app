<aura:application extends="force:slds" controller="RecordController">
    <aura:handler name="init" value="{!this}" action="{!c.onInit}"/>
    <aura:attribute name="data" type="String"/>
    <aura:attribute name="selected" type="Object"/>
    
    <lightning:card title="{!v.selected.Label}">
        <lightning:button label="Clear" onclick="{! c.handleClear }"/>
        <p class="slds-p-horizontal_small">
            {!v.selected.Value}
        </p>
    </lightning:card>

        <lightning:layout multipleRows="true">        
            <lightning:layoutItem size="12">
                <lightning:button label="Random" onclick="{! c.handleClickRandom }"/>
                <lightning:button label="Account" onclick="{! c.handleClickAccount }"/>
                <lightning:button label="Contact" onclick="{! c.handleClickContact }"/>
                {!v.result}
            </lightning:layoutItem>
            <lightning:layoutItem size="12">
                <!-- <c:lookup inputData="{!v.data}" /> -->
                <c:lookupTwo inputData="{!v.data}" onselected="{!c.handleCustomEvent}" />
                <!-- <c:record /> -->
            </lightning:layoutItem>    
        </lightning:layout>
    
</aura:application>
