import Ember from 'ember';
import {methods} from '../../../../../utils/util';
export default Ember.Controller.extend({
  acc:[],
  fetchService: Ember.inject.service('fetch'),
  loadAccount() {
    let url = `http://localhost:8080/banker/api/v1/`;
  let bankId = localStorage.getItem('bankId');
    let branchId = localStorage.getItem("branchId");
    let accNo = localStorage.getItem('accNo');
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
      console.log(response);
      this.set('acc', response);
      this.set('acc',this.get('acc')[0]);
    }).catch((error) => {
      console.error("Failed to load account:", error);
    });
  },
  actions:{
    toLoans()
    {
      this.transitionToRoute('banks.bank.accounts.account.loans',localStorage.getItem('accNo')).then((newRoute)=>{
             
        newRoute.controller.setProperties({
          bankId:localStorage.getItem('bankId'),
          branchId:localStorage.getItem('branchId')
        });
      }).catch((error) => {
        console.error("Transition failed", error);
      });
    },
    toTransactions()
    {
      this.transitionToRoute('banks.bank.accounts.account.transactions',localStorage.getItem('accNo')).then((newRoute)=>{
             
        newRoute.controller.setProperties({
          bankId:localStorage.getItem('bankId'),
          branchId:localStorage.getItem('branchId')
        });
      }).catch((error) => {
        console.error("Transition failed", error);
      });
    }
  }
});
