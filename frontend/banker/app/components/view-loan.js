import Ember from 'ember';

export default Ember.Component.extend({
    // InterestRate =  / 12 / 100;
    // emiAmount = (loanAmount * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, tenureMonths)) 
    //               / (Math.pow(1 + monthlyInterestRate, tenureMonths) - 1);
    actions:{
        toEmis(loanId)
        {
            this.sendAction("toEmis",loanId);
        }
    }
});
