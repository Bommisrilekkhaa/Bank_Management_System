import Ember from 'ember';
import {methods} from '../../../utils/util';
export default Ember.Controller.extend({

  notification: Ember.inject.service('notify'),
  fetchService: Ember.inject.service('fetch'),
    branches:[],
    bankId:localStorage.getItem('bankId'),
 
      loadBranches() {
        let bankId=localStorage.getItem('bankId');
        let url = `http://localhost:8080/banker/api/v1/`;
          if(bankId!="*")
          {
            url=url +`banks/${bankId}`;
          }
          
          url=url+`/branches`;
        this.get('fetchService').fetch(url,methods.GET).then((response) => {
          console.log(response);
          this.set('branches', response);
        }).catch((error) => {
          console.error("Failed to load accounts:", error);
        });
      },
      actions:{
        submitForm()
        {
          let bankId=localStorage.getItem("bankId");
          let branchId=this.get('branchId');
          let bank = this.get('bank');
          let bankData={
            bank_name:bank.bank_name,
            admin_id:bank.admin_id,
            main_branch_id:branchId
          }
          let url=`http://localhost:8080/banker/api/v1/`;
          if(bankId!='*')
          {
            url =url+`banks/${bankId}`;
          }
            this.get('fetchService').fetch(url,methods.PUT,bankData).then(() => {
                // console.log("bank update successfully.");
                this.get('notification').showNotification('Bank Edited successfully!', 'success');

                Ember.run.later(() => {
                 this.transitionToRoute('banks.bank',this.get('bankId'));
                 }, 2000);
              }).catch((error) => {
                console.error("Failed to load accounts:", error);
              });
        },
        cancel()
        {
          this.transitionToRoute('banks.bank');
        }
      }

});
