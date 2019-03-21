public with sharing class RecordController {
    @AuraEnabled (cacheable=true)
    public static String getRecordList(){
        System.debug('getRecordList');
        List<Account> accontList = [SELECT Id, Name FROM Account ORDER BY Name ASC LIMIT 2000];
        System.debug(':' + accontList + ':');
        System.debug(':' + JSON.serialize(accontList) + ':');
        return JSON.serialize(accontList);
    }

    @AuraEnabled (cacheable=true)
    public static String getObjectList(){
        List<objectDTO> resultList = new List<objectDTO>();
        for ( Schema.SObjectType o : Schema.getGlobalDescribe().values() )
        {
            Schema.DescribeSObjectResult objResult = o.getDescribe();
            resultList.add(new objectDTO(objResult.getName(),objResult.getLabel()));            
        }
        return JSON.serialize(resultList);
    }

    class objectDTO{
        String Name;
        String Label;
        
        public objectDTO(String v, String l){
            this.Name = v;
            this.Label = l;
        }
    }

    @AuraEnabled (cacheable=true)
    public static String getFieldsList(String obj){
        system.debug('Get fields of: ' + obj);
        if(obj != null){
            List<objectDTO> resultList = new List<objectDTO>();

            SObjectType objType = Schema.getGlobalDescribe().get(obj);
            Map<String, Schema.SObjectField> fieldsMap = objType.getDescribe().fields.getMap();
            for(String key : fieldsMap.keySet()){
                String value = (String) fieldsMap.get(key).getDescribe().getLabel();                
                resultList.add(new objectDTO(key,value));
            }
            return JSON.serialize(resultList);
        }else return null;
    }

    @AuraEnabled (cacheable=true)
    public static String getRecordValue(String queryField, String queryObj){
        System.debug('SELECT ' + queryField + ' FROM ' + queryObj);
        List<sObject> sobjList = Database.query('SELECT ' + queryField + ' FROM ' + queryObj);
        List<valueDTO> resultList = new List<valueDTO>();
        for(sObject obj: sobjList){
            String v = (String) obj.get(queryField);
            String l = (String) obj.get('Id');
            resultList.add(new valueDTO(v,l));
        }
        return JSON.serialize(resultList);
        //return JSON.serialize(Database.query('SELECT ' + queryField + ' FROM ' + queryObj));
    }

    class valueDTO{
        String Value;
        String Label;
        
        public valueDTO(String v, String l){
            this.Value = v;
            this.Label = l;
        }
    }

    @AuraEnabled
    public static String getContactList(){
        List<Contact> ctl = [SELECT id, name FROM Contact LIMIT 20];
        List<valueDTO> resultList = new List<valueDTO>();
        for(Contact ct : ctl){
            resultList.add(new valueDTO(ct.Id, ct.Name));
        }
        return JSON.serialize(resultList);
    }

    @AuraEnabled
    public static String getAccountList(){
        List<Account> ctl = [SELECT id, name FROM Account LIMIT 20];
        List<valueDTO> resultList = new List<valueDTO>();
        for(Account ct : ctl){
            resultList.add(new valueDTO(ct.Id, ct.Name));
        }
        return JSON.serialize(resultList);
    }
}