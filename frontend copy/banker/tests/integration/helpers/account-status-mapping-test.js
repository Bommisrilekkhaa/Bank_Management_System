
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('account-status-mapping', 'helper:account-status-mapping', {
  integration: true
});

// Replace this with your real tests.
test('it renders', function(assert) {
  this.set('inputValue', '1234');

  this.render(hbs`{{account-status-mapping inputValue}}`);

  assert.equal(this.$().text().trim(), '1234');
});

