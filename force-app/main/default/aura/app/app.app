<aura:application extends="force:slds" controller="RecordController">
    <aura:handler name="init" value="{!this}" action="{!c.onInit}"/>
    <aura:attribute name="data" type="String"/>
    <lightning:layout multipleRows="true">
        <lightning:layoutItem size="12">
            Lightning app
        </lightning:layoutItem>            
        <lightning:layoutItem size="12">
            <lightning:button label="Random" onclick="{! c.handleClickRandom }"/>
            <lightning:button label="Account" onclick="{! c.handleClickAccount }"/>
            <lightning:button label="Contact" onclick="{! c.handleClickContact }"/>            
        </lightning:layoutItem>
        <lightning:layoutItem size="12">
            <c:lookup inputData="{!v.data}" />
            <!-- <c:record /> -->
        </lightning:layoutItem>    
    </lightning:layout>
</aura:application>
