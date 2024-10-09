import Ember from 'ember';

export default Ember.Controller.extend({
    bankId:localStorage.getItem('bankId'),
    actions:{
        toEmis(loan)
        {

            this.transitionToRoute("banks.bank.loans.loan.emi",this.get('bankId'),loan.loan_id).then((newRoute)=>{

                newRoute.controller.setProperties({
                  loan:loan
                });
              }).catch((error) => {
                console.error("Transition failed", error);
              });;
        }
    }
});