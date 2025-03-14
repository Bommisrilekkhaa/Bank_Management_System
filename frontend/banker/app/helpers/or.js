import Ember from 'ember';

export function or(params) {
  return params.some(Boolean); 
}

export default Ember.Helper.helper(or);
