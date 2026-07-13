public with sharing class PortfolioController {
    
    @AuraEnabled(cacheable=true)
    public static Account getPortfolioData() {
        List<Account> accounts = [
            SELECT 
                Name,
                Portfolio_Title__c,
                Portfolio_Bio__c,
                Portfolio_Email__c,
                Portfolio_Phone__c,
                Portfolio_Location__c,
                Portfolio_Skills__c,
                Portfolio_Education__c,
                Portfolio_Projects__c,
                Portfolio_Certifications__c,
                Portfolio_Achievements__c,
                Portfolio_LinkedIn__c,
                Portfolio_GitHub__c
            FROM Account
            WHERE Is_Portfolio__c = true
            LIMIT 1
        ];

        if (accounts.isEmpty()) {
            return null;
        }

        return accounts[0];
    }
}
