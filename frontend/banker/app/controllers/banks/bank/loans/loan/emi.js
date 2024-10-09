import Ember from 'ember';

export default Ember.Controller.extend({
    emisService: Ember.inject.service('emis'),
    bankId: localStorage.getItem('bankId'),
    loanId: localStorage.getItem('loanId'),
    emis: [],
    generatedEmis: [],

    loadEmis() {
        this.get('emisService').fetchEmis(this.get('loanId')).then((response) => {
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
        
        if (emis && emis.length > 0) {
            emis.forEach((emi) => {
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

    // addNewEmi()
    // {
    //     this.transitionToRoute('banks.bank.accounts.account.transactions',this.get('bankId'),localStorage.getItem('accNo'))
    //     .then((newRoute) => {
    //         newRoute.controller.setProperties({
    //             transaction_type:'emi',
    //             transaction_amount:
    //         });
    //       })
    //       .catch((error) => {
    //         console.error("Transition failed", error);
    //       });
        
    // }
    
    
});
