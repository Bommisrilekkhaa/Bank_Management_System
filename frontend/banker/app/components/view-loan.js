import Ember from 'ember';

export default Ember.Component.extend({
    actions:{
        toEmis(loan)
        {
            let InterestRate= loan.loan_interest/ 12 / 100;
            let emiAmount =(loan.loan_amount * InterestRate * Math.pow(1 + InterestRate, loan.loan_duration)) / (Math.pow(1 + InterestRate, loan.loan_duration) - 1);
            emiAmount = Math.round(emiAmount);
            this.sendAction("toEmis",loan,emiAmount);
        }
    }
});
