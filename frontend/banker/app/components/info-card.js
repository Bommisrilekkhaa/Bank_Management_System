import Ember from 'ember';
import {status,loanStatus,role} from '../utils/util';
export default Ember.Component.extend({
    status:status,
    userRole:role,
    sharedData:Ember.inject.service('shared-data'),
    accountStatus: Ember.computed('data', function () {
        let statusField = this.get('data').findBy('label', 'Status');
        return statusField ? statusField.value : null;
    }),
    loanStatus:loanStatus,
    actions:{
        loans()
        {
            this.sendAction("toLoans",this.get('sharedData').get('accNo'));
        },
        transactions()
        {
            this.sendAction("toTransactions",this.get('sharedData').get('accNo'));
        },
        toEmis(loan)
        {
            let InterestRate= loan.loan_interest/ 12 / 100;
            let emiAmount =(loan.loan_amount * InterestRate * Math.pow(1 + InterestRate, loan.loan_duration)) / (Math.pow(1 + InterestRate, loan.loan_duration) - 1);
            emiAmount = Math.round(emiAmount);
            this.sendAction("toEmis",loan,emiAmount);
        },
        delete(branch)
        {
            this.sendAction('delete',branch);
        },
        viewAccounts()
        {
            this.sendAction('viewAccounts');
        },


        updateMainBranch(bank)
        {
            this.sendAction('updateMainBranch',bank);
        }
    }
});
