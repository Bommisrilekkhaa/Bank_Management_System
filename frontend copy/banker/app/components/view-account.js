import Ember from 'ember';
import {status} from '../utils/util'
export default Ember.Component.extend({

  sharedData:Ember.inject.service('shared-data'),
    status:status,
    actions:{
        loans()
        {
            this.sendAction("toLoans",this.get('sharedData').get('accNo'));
            
          
        },
        transactions()
        {
            this.sendAction("toTransactions",this.get('sharedData').get('accNo'));
        }
    }

});
