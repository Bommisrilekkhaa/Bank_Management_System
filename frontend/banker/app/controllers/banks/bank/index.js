import Ember from 'ember';

export default Ember.Controller.extend({

banksService: Ember.inject.service('banks'),
bankId:localStorage.getItem('bankId'),
banks:[],       
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
    this.get('banksService').fetchBank(this.get('bankId')).then((response) => {
      console.log(response);
      this.set('banks', response);
    }).catch((error) => {
      console.error("Failed to load accounts:", error);
    });
  

},

actions:{
  updateMainBranch(bankId,bank)
  {
    this.transitionToRoute('banks.bank.edit',bankId).then((newRoute)=>{

      newRoute.controller.setProperties({
        bank:bank,
       main_branch_id:bankId.main_branch_id
      });
    }).catch((error) => {
      console.error("Transition failed", error);
    });
  }
}
    
});
