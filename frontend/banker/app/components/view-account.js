import Ember from 'ember';

export default Ember.Component.extend({
   accNo:localStorage.getItem("accNo"),
        
    actions:{
        loans()
        {
            this.sendAction("toLoans",this.accNo);
            
          
        },
        transactions()
        {
            this.sendAction("toTransactions",this.accNo);
        }
    }

});
