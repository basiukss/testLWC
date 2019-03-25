<aura:application extends="force:slds" controller="RecordController">
    <aura:handler name="init" value="{!this}" action="{!c.onInit}"/>
    <aura:attribute name="data" type="String"/>
    <aura:attribute name="clearData" type="Boolean" default="false"/>
    <aura:attribute name="selected" type="Object"/>
    <lightning:card title="Aura" iconName="standard:account" class="slds-m-around_small">
        <aura:if isTrue="{!v.selected}">
            <lightning:pill class="slds-m-around_small" label="{!v.selected.Label}" onremove="{! c.handleClear }"/>
        </aura:if>
        <lightning:layout class="slds-m-around_small" multipleRows="true">        
            <lightning:layoutItem size="12">
                <lightning:button label="Random" onclick="{! c.handleClickRandom }"/>
                <lightning:button label="Account" onclick="{! c.handleClickAccount }"/>
                <lightning:button label="Contact" onclick="{! c.handleClickContact }"/>
                {!v.result}
            </lightning:layoutItem>
            <lightning:layoutItem size="12">
                <!-- <c:lookup inputData="{!v.data}" /> -->
                <c:lookupTwo inputData="{!v.data}" clearData="{!v.clearData}" onselected="{!c.handleCustomEvent}" />
                <!-- <c:record /> -->
            </lightning:layoutItem>    
        </lightning:layout>
    </lightning:card>
</aura:application>
