import Ember from 'ember';
import { role,methods, getSessionData} from '../../../utils/util';
export default Ember.Controller.extend({

fetchService: Ember.inject.service('fetch'),
branch:[],
banks:[], 
userRole:role,      
role:Ember.computed('bank',()=>{
  
      return getSessionData().user_role;  
  
}),
bankDetails: Ember.computed('branch', function () {
  return [
    { label: "Bank Name", value: this.get('bank.bank_name') },
    { label: "Bank Code", value: this.get('bank.bank_code') },
    { label: "Bank Admin", value: this.get('bank.admin_name') },
    { label: "Main Branch Name", value: this.get('branch.branch_name') || "Not Assigned" },
    { label: "Main Branch Address", value: this.get('branch.branch_address') || "Not Assigned" }
  ];
}),
loadBanks(bankId){
  let url = `http://localhost:8080/banker/api/v1/`;
  if(bankId!="*" && bankId)
  {
    url=url +`banks/${bankId}`;
  }
    this.get('fetchService').fetch(url,methods.GET).then((response) => {
        // console.log(response);
        this.set('bank', response.data[0]);
        let branchId = this.get('bank').main_branch_id;
        if(branchId!="*")
          {
            url=url +`/branches/${branchId}`;
          }
          
        this.get('fetchService').fetch(url,methods.GET).then((response) => {
          this.set('branch', response.data);
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
