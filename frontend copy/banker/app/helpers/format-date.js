import Ember from 'ember';

export function formatDate([date]) {
  if (!date) {
    return '';
  }
  return new Date(date).toLocaleDateString();
}

export default Ember.Helper.helper(formatDate);
