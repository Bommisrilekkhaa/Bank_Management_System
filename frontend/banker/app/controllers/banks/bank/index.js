import Ember from 'ember';
import { role } from '../../../utils/util';
export default Ember.Controller.extend({
branchesService: Ember.inject.service('branches'),
banksService: Ember.inject.service('banks'),
bankId:localStorage.getItem('bankId'),
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
loadBanks(){
    this.get('banksService').fetchBank(localStorage.getItem('bankId')).then((response) => {
      console.log(response);
      this.set('banks', response);
      this.set('branchId',localStorage.getItem('branchId'));
      localStorage.setItem('branchId',this.get('banks')[0].main_branch_id)
      this.get('branchesService').fetchBranch(this.get('bankId')).then((response) => {
        console.log(response);
        localStorage.setItem('branchId',this.get('branchId'));
        this.set('branch', response);
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
