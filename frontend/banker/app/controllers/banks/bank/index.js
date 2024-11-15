import Ember from 'ember';
import { role,methods} from '../../../utils/util';
export default Ember.Controller.extend({

fetchService: Ember.inject.service('fetch'),
branch:[],
banks:[], 
userRole:role,      
role:Ember.computed(()=>{
  let value = `; ${document.cookie}`;
  let parts = value.split(`; ${'sessionData'}=`);
  if (parts.length === 2) {
      let cookieData = decodeURIComponent(parts.pop().split(';').shift());
      let sessionData = JSON.parse(cookieData);  
      return sessionData.user_role;  
  }
}),
loadBanks(bankId){
  let url = `http://localhost:8080/banker/api/v1/`;
  if(bankId!="*")
  {
    url=url +`banks/${bankId}`;
  }
    this.get('fetchService').fetch(url,methods.GET).then((response) => {
        // console.log(response);
        this.set('banks', response[0].data);
        let branchId = this.get('banks')[0].main_branch_id;
        if(branchId!="*")
          {
            url=url +`/branches/${branchId}`;
          }
          
        this.get('fetchService').fetch(url,methods.GET).then((response) => {
          this.set('branch', response[0].data);
          this.set('branch',this.get('branch')[0]);
        }).catch((error) => {
          console.error("Failed to load banks:", error);
        });

    }).catch((error) => {
      console.error("Failed to load banks:", error);
    });
  

},

actions:{
  updateMainBranch(bank)
  {
    this.transitionToRoute('banks.bank.edit',bank.bank_id).then((newRoute)=>{

      newRoute.controller.setProperties({
        bank:bank
      });
    }).catch((error) => {
      console.error("Transition failed", error);
    });
  }
}
    
});
