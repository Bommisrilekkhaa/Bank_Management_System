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
    const router = Ember.getOwner(this).lookup('router:main');
    const currentRouteName = router.get('currentRouteName');
    // console.log(currentRouteName);
    this.trigger('branchChanged', branchId,currentRouteName);
  },
  getDefaultBranchId() {
    return '-1'; 
  }

});