import Ember from 'ember';
import {status} from '../utils/util'
export default Ember.Component.extend({
   accNo:localStorage.getItem("accNo"),
    status:status,
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
