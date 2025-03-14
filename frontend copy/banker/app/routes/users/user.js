import Ember from 'ember';

export default Ember.Route.extend({

    sharedData:Ember.inject.service('shared-data'),
    model(params)
    {
        this.get('sharedData').set('userId', params.userId);
        return params;
    }
});
