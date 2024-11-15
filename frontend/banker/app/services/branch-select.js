import Ember from 'ember';

export default Ember.Service.extend(Ember.Evented, {
  selectedBranchId: null,
  sharedData:Ember.inject.service('shared-data'),
  init() {
    this._super(...arguments);
    this.set('selectedBranchId',this.get('sharedData').get('branchId') || this.getDefaultBranchId());
  },

  changeBranch(branchId) {
    this.set('selectedBranchId', branchId);
    this.get('sharedData').set('branchId',branchId);
    const router = Ember.getOwner(this).lookup('router:main');
    const currentRouteName = router.get('currentRouteName');
    // console.log(currentRouteName);
    this.trigger('branchChanged',currentRouteName);
  },
  getDefaultBranchId() {
    return '-1'; 
  }

});