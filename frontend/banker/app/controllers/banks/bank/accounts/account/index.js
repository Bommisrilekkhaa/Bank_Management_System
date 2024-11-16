import Ember from 'ember';
import {methods} from '../../../../../utils/util';
export default Ember.Controller.extend({
  acc:[],
  fetchService: Ember.inject.service('fetch'),
  sharedData:Ember.inject.service('shared-data'),
  loadAccount(accNo) {
    let url = `http://localhost:8080/banker/api/v1/`;
  let bankId = this.get('sharedData').get('bankId');
    let branchId = this.get('sharedData').get('branchId');
    if(bankId!="*")
    {
      url=url +`banks/${bankId}`;
    }
    if(branchId!='*')
    {
      url=url+`/branches/${branchId}`;
    }
    if(accNo!="*")
    {
      url = url+`/accounts/${accNo}`;
    }

    this.get('fetchService').fetch(url,methods.GET).then((response) => {
      // console.log(response);
      this.set('acc', response.data);
      this.set('acc',this.get('acc')[0]);
    }).catch((error) => {
      console.error("Failed to load account:", error);
    });
  },
  actions:{
    toLoans()
    {
      this.transitionToRoute('banks.bank.accounts.account.loans',this.get('sharedData').get('accNo')).then((newRoute)=>{
             
        newRoute.controller.setProperties({
          bankId:this.get('sharedData').get('bankId'),
          branchId:this.get('sharedData').get('branchId')
        });
      }).catch((error) => {
        console.error("Transition failed", error);
      });
    },
    toTransactions()
    {
      this.transitionToRoute('banks.bank.accounts.account.transactions',this.get('sharedData').get('accNo')).then((newRoute)=>{
             
        newRoute.controller.setProperties({
          bankId:this.get('sharedData').get('bankId'),
          branchId:this.get('sharedData').get('branchId')
        });
      }).catch((error) => {
        console.error("Transition failed", error);
      });
    }
  }
});
