import Ember from 'ember';
import {methods} from '../../../../../../../utils/util';
export default Ember.Controller.extend({
    fetchService: Ember.inject.service('fetch'),
    sharedData:Ember.inject.service('shared-data'),
    emis: [],
    generatedEmis: [],
    
    loadEmis() {
        
        let bankId = this.get('sharedData').get('bankId');
        let loanId=this.get('sharedData').get('loanId');
        let url = `http://localhost:8080/banker/api/v1/`;
    
        if(bankId!="*")
        {
        url=url +`banks/${bankId}`;
        }
   
        if(loanId!='*')
        {
        url=url+`/loans/${loanId}`;
        }
        url=url+`/emis`;

        this.get('fetchService').fetch(url,methods.GET).then((response) => {
            this.set('emis', response);
            this.set('generatedEmis', this.generateTable(this.get('emis')));
        }).catch((error) => {
            console.error("Failed to load EMIs:", error);
        });
    },

    generateTable(emis) {
        let emiSchedule = [];
        
        let totalEmis = this.get('loan').loan_duration;
        
        let loanAvailedDate =this.get('loan').length <= 0 ? new Date() : new Date(this.get('loan').loan_availed_date.replace(/-/g, '/')) ;
        
        
            let emisArray = this.get('emis'); 
            
            for (let i = 0; i < emisArray.length; i++) {
                let emi = emisArray[i];
                let emiNumber = emi.emi_number || '-';
                let transactionId = emi.transaction_id || '-';
                let actualPaidDate = emi.actual_paid_date ? new Date(emi.actual_paid_date.replace(/-/g, '/')) : '-';
                
                let toBePaidDate = new Date(loanAvailedDate);
                if (!isNaN(toBePaidDate.getTime())) {
                    toBePaidDate.setMonth(toBePaidDate.getMonth() + emiNumber);
                } else {
                    toBePaidDate = 'Invalid Date';
                }
            
                emiSchedule.push({
                    emiNumber,
                    transactionId,
                    toBePaidDate: toBePaidDate instanceof Date ? toBePaidDate.toLocaleDateString() : toBePaidDate,
                    actualPaidDate: actualPaidDate instanceof Date ? actualPaidDate.toLocaleDateString() : actualPaidDate
                });
            }
        
        
        let nextEmiNumber = emis.length > 0 ? emis[emis.length - 1].emi_number + 1 : 1;
        if (nextEmiNumber <= totalEmis) {
            let nextToBePaidDate = new Date(loanAvailedDate);
            if (!isNaN(nextToBePaidDate.getTime())) {
                nextToBePaidDate.setMonth(nextToBePaidDate.getMonth() + nextEmiNumber);
            } else {
                nextToBePaidDate = 'Invalid Date';
            }
    
            emiSchedule.push({
                emiNumber: nextEmiNumber,
                transactionId: '-',
                toBePaidDate: nextToBePaidDate instanceof Date ? nextToBePaidDate.toLocaleDateString() : nextToBePaidDate,
                actualPaidDate: '-'
            });
        }
    
        if (emiSchedule.length === 0) {
            let firstEmiNumber = 1;
            let firstToBePaidDate = new Date(loanAvailedDate);
            if (!isNaN(firstToBePaidDate.getTime())) {
                firstToBePaidDate.setMonth(firstToBePaidDate.getMonth() + firstEmiNumber);
            } else {
                firstToBePaidDate = 'Invalid Date';
            }
    
            emiSchedule.push({
                emiNumber: firstEmiNumber,
                transactionId: '-',
                toBePaidDate: firstToBePaidDate instanceof Date ? firstToBePaidDate.toLocaleDateString() : firstToBePaidDate,
                actualPaidDate: '-'
            });
        }
    
        return emiSchedule;
    },

    actions:{

        addNewEmi()
        {
            this.transitionToRoute('banks.bank.accounts.account.transactions.new',this.get('sharedData').get('bankId'),this.get('loan').acc_number)
            .then((newRoute) => {
                newRoute.controller.setProperties({
                    transaction_type:'emi',
                    transaction_amount:this.get('emiAmount')
                });
              })
              .catch((error) => {
                console.error("Transition failed", error);
              });
            
        }
    }

    
    
});
