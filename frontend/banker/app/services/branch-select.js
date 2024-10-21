import Ember from 'ember';

export default Ember.Service.extend(Ember.Evented, {
  selectedBranchId: null,

  init() {
    this._super(...arguments);
    this.set('selectedBranchId', localStorage.getItem('branchId') || this.getDefaultBranchId());
  },

  changeBranch(branchId) {
    this.set('selectedBranchId', branchId);
    localStorage.setItem('branchId', branchId);

    this.trigger('branchChanged', branchId);
  },
  getDefaultBranchId() {
    return '-1'; 
  }

});