'use strict';

define('banker/tests/app.lint-test', [], function () {
  'use strict';

  QUnit.module('ESLint | app');

  QUnit.test('app.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'app.js should pass ESLint\n\n');
  });

  QUnit.test('components/account-input.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'components/account-input.js should pass ESLint\n\n83:15 - \'userData\' is assigned a value but never used. (no-unused-vars)');
  });

  QUnit.test('components/admin-dashboard.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'components/admin-dashboard.js should pass ESLint\n\n');
  });

  QUnit.test('components/auth-form.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'components/auth-form.js should pass ESLint\n\n');
  });

  QUnit.test('components/branch-input.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'components/branch-input.js should pass ESLint\n\n');
  });

  QUnit.test('components/customer-dashboard.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'components/customer-dashboard.js should pass ESLint\n\n');
  });

  QUnit.test('components/loan-input.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'components/loan-input.js should pass ESLint\n\n');
  });

  QUnit.test('components/manager-dashboard.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'components/manager-dashboard.js should pass ESLint\n\n');
  });

  QUnit.test('components/nav-bar.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'components/nav-bar.js should pass ESLint\n\n');
  });

  QUnit.test('components/notify-box.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'components/notify-box.js should pass ESLint\n\n');
  });

  QUnit.test('components/transaction-input.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'components/transaction-input.js should pass ESLint\n\n');
  });

  QUnit.test('components/view-account.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'components/view-account.js should pass ESLint\n\n');
  });

  QUnit.test('components/view-accounts.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'components/view-accounts.js should pass ESLint\n\n');
  });

  QUnit.test('components/view-loan.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'components/view-loan.js should pass ESLint\n\n');
  });

  QUnit.test('components/view-loans.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'components/view-loans.js should pass ESLint\n\n');
  });

  QUnit.test('components/view-transaction.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'components/view-transaction.js should pass ESLint\n\n');
  });

  QUnit.test('components/view-transactions.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'components/view-transactions.js should pass ESLint\n\n');
  });

  QUnit.test('controllers/application.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/application.js should pass ESLint\n\n');
  });

  QUnit.test('controllers/banks.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/banks.js should pass ESLint\n\n');
  });

  QUnit.test('controllers/banks/bank.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/banks/bank.js should pass ESLint\n\n');
  });

  QUnit.test('controllers/banks/bank/accounts.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/banks/bank/accounts.js should pass ESLint\n\n');
  });

  QUnit.test('controllers/banks/bank/accounts/account.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/banks/bank/accounts/account.js should pass ESLint\n\n');
  });

  QUnit.test('controllers/banks/bank/accounts/account/edit.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/banks/bank/accounts/account/edit.js should pass ESLint\n\n');
  });

  QUnit.test('controllers/banks/bank/accounts/account/index.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/banks/bank/accounts/account/index.js should pass ESLint\n\n');
  });

  QUnit.test('controllers/banks/bank/accounts/account/loans.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/banks/bank/accounts/account/loans.js should pass ESLint\n\n');
  });

  QUnit.test('controllers/banks/bank/accounts/account/loans/index.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/banks/bank/accounts/account/loans/index.js should pass ESLint\n\n');
  });

  QUnit.test('controllers/banks/bank/accounts/account/loans/loan.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/banks/bank/accounts/account/loans/loan.js should pass ESLint\n\n');
  });

  QUnit.test('controllers/banks/bank/accounts/account/loans/loan/edit.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/banks/bank/accounts/account/loans/loan/edit.js should pass ESLint\n\n');
  });

  QUnit.test('controllers/banks/bank/accounts/account/loans/loan/emi.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/banks/bank/accounts/account/loans/loan/emi.js should pass ESLint\n\n');
  });

  QUnit.test('controllers/banks/bank/accounts/account/loans/loan/index.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/banks/bank/accounts/account/loans/loan/index.js should pass ESLint\n\n');
  });

  QUnit.test('controllers/banks/bank/accounts/account/loans/new.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/banks/bank/accounts/account/loans/new.js should pass ESLint\n\n');
  });

  QUnit.test('controllers/banks/bank/accounts/account/transactions.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/banks/bank/accounts/account/transactions.js should pass ESLint\n\n');
  });

  QUnit.test('controllers/banks/bank/accounts/account/transactions/index.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/banks/bank/accounts/account/transactions/index.js should pass ESLint\n\n');
  });

  QUnit.test('controllers/banks/bank/accounts/account/transactions/new.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/banks/bank/accounts/account/transactions/new.js should pass ESLint\n\n');
  });

  QUnit.test('controllers/banks/bank/accounts/account/transactions/transaction.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/banks/bank/accounts/account/transactions/transaction.js should pass ESLint\n\n');
  });

  QUnit.test('controllers/banks/bank/accounts/index.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'controllers/banks/bank/accounts/index.js should pass ESLint\n\n15:22 - \'newBranchId\' is defined but never used. (no-unused-vars)');
  });

  QUnit.test('controllers/banks/bank/accounts/new.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/banks/bank/accounts/new.js should pass ESLint\n\n');
  });

  QUnit.test('controllers/banks/bank/branches.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/banks/bank/branches.js should pass ESLint\n\n');
  });

  QUnit.test('controllers/banks/bank/branches/branch.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/banks/bank/branches/branch.js should pass ESLint\n\n');
  });

  QUnit.test('controllers/banks/bank/branches/branch/delete.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/banks/bank/branches/branch/delete.js should pass ESLint\n\n');
  });

  QUnit.test('controllers/banks/bank/branches/branch/edit.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/banks/bank/branches/branch/edit.js should pass ESLint\n\n');
  });

  QUnit.test('controllers/banks/bank/branches/branch/index.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/banks/bank/branches/branch/index.js should pass ESLint\n\n');
  });

  QUnit.test('controllers/banks/bank/branches/index.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/banks/bank/branches/index.js should pass ESLint\n\n');
  });

  QUnit.test('controllers/banks/bank/branches/new.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/banks/bank/branches/new.js should pass ESLint\n\n');
  });

  QUnit.test('controllers/banks/bank/edit.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/banks/bank/edit.js should pass ESLint\n\n');
  });

  QUnit.test('controllers/banks/bank/index.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/banks/bank/index.js should pass ESLint\n\n');
  });

  QUnit.test('controllers/banks/bank/loans.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/banks/bank/loans.js should pass ESLint\n\n');
  });

  QUnit.test('controllers/banks/bank/loans/index.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'controllers/banks/bank/loans/index.js should pass ESLint\n\n15:22 - \'newBranchId\' is defined but never used. (no-unused-vars)');
  });

  QUnit.test('controllers/banks/bank/loans/loan.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/banks/bank/loans/loan.js should pass ESLint\n\n');
  });

  QUnit.test('controllers/banks/bank/loans/loan/edit.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/banks/bank/loans/loan/edit.js should pass ESLint\n\n');
  });

  QUnit.test('controllers/banks/bank/loans/loan/emi.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/banks/bank/loans/loan/emi.js should pass ESLint\n\n');
  });

  QUnit.test('controllers/banks/bank/loans/loan/index.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/banks/bank/loans/loan/index.js should pass ESLint\n\n');
  });

  QUnit.test('controllers/banks/bank/loans/new.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/banks/bank/loans/new.js should pass ESLint\n\n');
  });

  QUnit.test('controllers/banks/bank/transactions.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/banks/bank/transactions.js should pass ESLint\n\n');
  });

  QUnit.test('controllers/banks/bank/transactions/index.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'controllers/banks/bank/transactions/index.js should pass ESLint\n\n15:22 - \'newBranchId\' is defined but never used. (no-unused-vars)');
  });

  QUnit.test('controllers/banks/bank/transactions/new.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/banks/bank/transactions/new.js should pass ESLint\n\n');
  });

  QUnit.test('controllers/banks/bank/transactions/transaction.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/banks/bank/transactions/transaction.js should pass ESLint\n\n');
  });

  QUnit.test('controllers/banks/bank/users.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/banks/bank/users.js should pass ESLint\n\n');
  });

  QUnit.test('controllers/banks/bank/users/index.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/banks/bank/users/index.js should pass ESLint\n\n');
  });

  QUnit.test('controllers/banks/bank/users/user.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/banks/bank/users/user.js should pass ESLint\n\n');
  });

  QUnit.test('controllers/banks/bank/users/user/dashboard.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/banks/bank/users/user/dashboard.js should pass ESLint\n\n');
  });

  QUnit.test('controllers/banks/bank/users/user/edit.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/banks/bank/users/user/edit.js should pass ESLint\n\n');
  });

  QUnit.test('controllers/banks/bank/users/user/index.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/banks/bank/users/user/index.js should pass ESLint\n\n');
  });

  QUnit.test('controllers/banks/index.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/banks/index.js should pass ESLint\n\n');
  });

  QUnit.test('controllers/banks/new.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/banks/new.js should pass ESLint\n\n');
  });

  QUnit.test('controllers/login.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/login.js should pass ESLint\n\n');
  });

  QUnit.test('controllers/register.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/register.js should pass ESLint\n\n');
  });

  QUnit.test('controllers/super-admin-login.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/super-admin-login.js should pass ESLint\n\n');
  });

  QUnit.test('controllers/users.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/users.js should pass ESLint\n\n');
  });

  QUnit.test('controllers/users/index.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/users/index.js should pass ESLint\n\n');
  });

  QUnit.test('controllers/users/user.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/users/user.js should pass ESLint\n\n');
  });

  QUnit.test('controllers/users/user/edit.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/users/user/edit.js should pass ESLint\n\n');
  });

  QUnit.test('controllers/users/user/index.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/users/user/index.js should pass ESLint\n\n');
  });

  QUnit.test('helpers/eq.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'helpers/eq.js should pass ESLint\n\n');
  });

  QUnit.test('helpers/format-date.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'helpers/format-date.js should pass ESLint\n\n');
  });

  QUnit.test('resolver.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'resolver.js should pass ESLint\n\n');
  });

  QUnit.test('router.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'router.js should pass ESLint\n\n');
  });

  QUnit.test('routes/banks.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/banks.js should pass ESLint\n\n');
  });

  QUnit.test('routes/banks/bank.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/banks/bank.js should pass ESLint\n\n');
  });

  QUnit.test('routes/banks/bank/accounts.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/banks/bank/accounts.js should pass ESLint\n\n');
  });

  QUnit.test('routes/banks/bank/accounts/account.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/banks/bank/accounts/account.js should pass ESLint\n\n');
  });

  QUnit.test('routes/banks/bank/accounts/account/edit.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/banks/bank/accounts/account/edit.js should pass ESLint\n\n');
  });

  QUnit.test('routes/banks/bank/accounts/account/index.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'routes/banks/bank/accounts/account/index.js should pass ESLint\n\n24:9 - \'userId\' is assigned a value but never used. (no-unused-vars)');
  });

  QUnit.test('routes/banks/bank/accounts/account/loans.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/banks/bank/accounts/account/loans.js should pass ESLint\n\n');
  });

  QUnit.test('routes/banks/bank/accounts/account/loans/index.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/banks/bank/accounts/account/loans/index.js should pass ESLint\n\n');
  });

  QUnit.test('routes/banks/bank/accounts/account/loans/loan.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/banks/bank/accounts/account/loans/loan.js should pass ESLint\n\n');
  });

  QUnit.test('routes/banks/bank/accounts/account/loans/loan/edit.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'routes/banks/bank/accounts/account/loans/loan/edit.js should pass ESLint\n\n32:66 - \'bankId\' is not defined. (no-undef)');
  });

  QUnit.test('routes/banks/bank/accounts/account/loans/loan/emi.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/banks/bank/accounts/account/loans/loan/emi.js should pass ESLint\n\n');
  });

  QUnit.test('routes/banks/bank/accounts/account/loans/loan/index.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/banks/bank/accounts/account/loans/loan/index.js should pass ESLint\n\n');
  });

  QUnit.test('routes/banks/bank/accounts/account/loans/new.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/banks/bank/accounts/account/loans/new.js should pass ESLint\n\n');
  });

  QUnit.test('routes/banks/bank/accounts/account/transactions.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/banks/bank/accounts/account/transactions.js should pass ESLint\n\n');
  });

  QUnit.test('routes/banks/bank/accounts/account/transactions/index.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/banks/bank/accounts/account/transactions/index.js should pass ESLint\n\n');
  });

  QUnit.test('routes/banks/bank/accounts/account/transactions/new.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/banks/bank/accounts/account/transactions/new.js should pass ESLint\n\n');
  });

  QUnit.test('routes/banks/bank/accounts/account/transactions/transaction.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/banks/bank/accounts/account/transactions/transaction.js should pass ESLint\n\n');
  });

  QUnit.test('routes/banks/bank/accounts/index.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/banks/bank/accounts/index.js should pass ESLint\n\n');
  });

  QUnit.test('routes/banks/bank/accounts/new.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/banks/bank/accounts/new.js should pass ESLint\n\n');
  });

  QUnit.test('routes/banks/bank/branches.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/banks/bank/branches.js should pass ESLint\n\n');
  });

  QUnit.test('routes/banks/bank/branches/branch.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/banks/bank/branches/branch.js should pass ESLint\n\n');
  });

  QUnit.test('routes/banks/bank/branches/branch/edit.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'routes/banks/bank/branches/branch/edit.js should pass ESLint\n\n32:64 - \'bankId\' is not defined. (no-undef)');
  });

  QUnit.test('routes/banks/bank/branches/branch/index.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'routes/banks/bank/branches/branch/index.js should pass ESLint\n\n32:62 - \'bankId\' is not defined. (no-undef)');
  });

  QUnit.test('routes/banks/bank/branches/index.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'routes/banks/bank/branches/index.js should pass ESLint\n\n33:62 - \'bankId\' is not defined. (no-undef)');
  });

  QUnit.test('routes/banks/bank/branches/new.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'routes/banks/bank/branches/new.js should pass ESLint\n\n33:62 - \'bankId\' is not defined. (no-undef)');
  });

  QUnit.test('routes/banks/bank/edit.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/banks/bank/edit.js should pass ESLint\n\n');
  });

  QUnit.test('routes/banks/bank/index.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'routes/banks/bank/index.js should pass ESLint\n\n5:9 - \'bankId\' is assigned a value but never used. (no-unused-vars)\n33:31 - \'model\' is defined but never used. (no-unused-vars)');
  });

  QUnit.test('routes/banks/bank/loans.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/banks/bank/loans.js should pass ESLint\n\n');
  });

  QUnit.test('routes/banks/bank/loans/index.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'routes/banks/bank/loans/index.js should pass ESLint\n\n22:9 - \'userId\' is assigned a value but never used. (no-unused-vars)');
  });

  QUnit.test('routes/banks/bank/loans/loan.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/banks/bank/loans/loan.js should pass ESLint\n\n');
  });

  QUnit.test('routes/banks/bank/loans/loan/edit.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'routes/banks/bank/loans/loan/edit.js should pass ESLint\n\n31:60 - \'bankId\' is not defined. (no-undef)');
  });

  QUnit.test('routes/banks/bank/loans/loan/emi.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'routes/banks/bank/loans/loan/emi.js should pass ESLint\n\n23:9 - \'userId\' is assigned a value but never used. (no-unused-vars)');
  });

  QUnit.test('routes/banks/bank/loans/loan/index.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'routes/banks/bank/loans/loan/index.js should pass ESLint\n\n22:9 - \'userId\' is assigned a value but never used. (no-unused-vars)');
  });

  QUnit.test('routes/banks/bank/loans/new.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'routes/banks/bank/loans/new.js should pass ESLint\n\n22:9 - \'userId\' is assigned a value but never used. (no-unused-vars)');
  });

  QUnit.test('routes/banks/bank/transactions.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/banks/bank/transactions.js should pass ESLint\n\n');
  });

  QUnit.test('routes/banks/bank/transactions/index.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/banks/bank/transactions/index.js should pass ESLint\n\n');
  });

  QUnit.test('routes/banks/bank/transactions/new.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/banks/bank/transactions/new.js should pass ESLint\n\n');
  });

  QUnit.test('routes/banks/bank/transactions/transaction.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/banks/bank/transactions/transaction.js should pass ESLint\n\n');
  });

  QUnit.test('routes/banks/bank/users.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/banks/bank/users.js should pass ESLint\n\n');
  });

  QUnit.test('routes/banks/bank/users/index.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/banks/bank/users/index.js should pass ESLint\n\n');
  });

  QUnit.test('routes/banks/bank/users/user.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/banks/bank/users/user.js should pass ESLint\n\n');
  });

  QUnit.test('routes/banks/bank/users/user/dashboard.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'routes/banks/bank/users/user/dashboard.js should pass ESLint\n\n6:13 - \'bankId\' is assigned a value but never used. (no-unused-vars)');
  });

  QUnit.test('routes/banks/bank/users/user/index.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'routes/banks/bank/users/user/index.js should pass ESLint\n\n31:60 - \'bankId\' is not defined. (no-undef)');
  });

  QUnit.test('routes/banks/index.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'routes/banks/index.js should pass ESLint\n\n40:31 - \'model\' is defined but never used. (no-unused-vars)');
  });

  QUnit.test('routes/banks/new.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'routes/banks/new.js should pass ESLint\n\n34:31 - \'model\' is defined but never used. (no-unused-vars)');
  });

  QUnit.test('routes/login.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/login.js should pass ESLint\n\n');
  });

  QUnit.test('routes/register.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/register.js should pass ESLint\n\n');
  });

  QUnit.test('routes/super-admin-login.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/super-admin-login.js should pass ESLint\n\n');
  });

  QUnit.test('routes/users/index.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'routes/users/index.js should pass ESLint\n\n41:35 - \'model\' is defined but never used. (no-unused-vars)');
  });

  QUnit.test('routes/users/user.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/users/user.js should pass ESLint\n\n');
  });

  QUnit.test('routes/users/user/edit.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/users/user/edit.js should pass ESLint\n\n');
  });

  QUnit.test('routes/users/user/index.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'routes/users/user/index.js should pass ESLint\n\n33:33 - \'model\' is defined but never used. (no-unused-vars)');
  });

  QUnit.test('services/accounts.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'services/accounts.js should pass ESLint\n\n8:17 - \'bankid\' is defined but never used. (no-unused-vars)\n49:21 - \'bankid\' is defined but never used. (no-unused-vars)\n88:14 - \'bankid\' is defined but never used. (no-unused-vars)');
  });

  QUnit.test('services/banks.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'services/banks.js should pass ESLint\n\n');
  });

  QUnit.test('services/branch-select.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'services/branch-select.js should pass ESLint\n\n');
  });

  QUnit.test('services/branches.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'services/branches.js should pass ESLint\n\n9:17 - \'bankId\' is defined but never used. (no-unused-vars)\n44:15 - \'bankId\' is defined but never used. (no-unused-vars)\n81:40 - \'bankId\' is assigned a value but never used. (no-unused-vars)\n111:50 - \'bankId\' is assigned a value but never used. (no-unused-vars)');
  });

  QUnit.test('services/dashboard.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'services/dashboard.js should pass ESLint\n\n');
  });

  QUnit.test('services/emis.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'services/emis.js should pass ESLint\n\n44:17 - \'emiId\' is defined but never used. (no-unused-vars)');
  });

  QUnit.test('services/loans.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'services/loans.js should pass ESLint\n\n9:23 - \'bankid\' is defined but never used. (no-unused-vars)\n50:20 - \'bankid\' is defined but never used. (no-unused-vars)');
  });

  QUnit.test('services/notify.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'services/notify.js should pass ESLint\n\n');
  });

  QUnit.test('services/session.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'services/session.js should pass ESLint\n\n');
  });

  QUnit.test('services/transactions.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'services/transactions.js should pass ESLint\n\n8:28 - \'bankid\' is defined but never used. (no-unused-vars)');
  });

  QUnit.test('services/users.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'services/users.js should pass ESLint\n\n6:14 - \'bankid\' is defined but never used. (no-unused-vars)');
  });
});
define('banker/tests/helpers/destroy-app', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = destroyApp;
  function destroyApp(application) {
    Ember.run(application, 'destroy');
  }
});
define('banker/tests/helpers/module-for-acceptance', ['exports', 'qunit', 'banker/tests/helpers/start-app', 'banker/tests/helpers/destroy-app'], function (exports, _qunit, _startApp, _destroyApp) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  exports.default = function (name) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    (0, _qunit.module)(name, {
      beforeEach: function beforeEach() {
        this.application = (0, _startApp.default)();

        if (options.beforeEach) {
          return options.beforeEach.apply(this, arguments);
        }
      },
      afterEach: function afterEach() {
        var _this = this;

        var afterEach = options.afterEach && options.afterEach.apply(this, arguments);
        return resolve(afterEach).then(function () {
          return (0, _destroyApp.default)(_this.application);
        });
      }
    });
  };

  var resolve = Ember.RSVP.resolve;
});
define('banker/tests/helpers/resolver', ['exports', 'banker/resolver', 'banker/config/environment'], function (exports, _resolver, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  var resolver = _resolver.default.create();

  resolver.namespace = {
    modulePrefix: _environment.default.modulePrefix,
    podModulePrefix: _environment.default.podModulePrefix
  };

  exports.default = resolver;
});
define('banker/tests/helpers/start-app', ['exports', 'banker/app', 'banker/config/environment'], function (exports, _app, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = startApp;
  function startApp(attrs) {
    var attributes = Ember.merge({}, _environment.default.APP);
    attributes = Ember.merge(attributes, attrs); // use defaults, but you can override;

    return Ember.run(function () {
      var application = _app.default.create(attributes);
      application.setupForTesting();
      application.injectTestHelpers();
      return application;
    });
  }
});
define('banker/tests/integration/components/admin-dashboard-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleForComponent)('admin-dashboard', 'Integration | Component | admin dashboard', {
    integration: true
  });

  (0, _emberQunit.test)('it renders', function (assert) {

    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template({
      "id": "tHCEKqcd",
      "block": "{\"statements\":[[1,[26,[\"admin-dashboard\"]],false]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
      "meta": {}
    }));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template({
      "id": "8TuNKrs7",
      "block": "{\"statements\":[[0,\"\\n\"],[6,[\"admin-dashboard\"],null,null,{\"statements\":[[0,\"      template block text\\n\"]],\"locals\":[]},null],[0,\"  \"]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
      "meta": {}
    }));

    assert.equal(this.$().text().trim(), 'template block text');
  });
});
define('banker/tests/integration/components/auth-form-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleForComponent)('auth-form', 'Integration | Component | auth form', {
    integration: true
  });

  (0, _emberQunit.test)('it renders', function (assert) {

    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template({
      "id": "DI0J+D9d",
      "block": "{\"statements\":[[1,[26,[\"auth-form\"]],false]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
      "meta": {}
    }));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template({
      "id": "QaoOdgBt",
      "block": "{\"statements\":[[0,\"\\n\"],[6,[\"auth-form\"],null,null,{\"statements\":[[0,\"      template block text\\n\"]],\"locals\":[]},null],[0,\"  \"]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
      "meta": {}
    }));

    assert.equal(this.$().text().trim(), 'template block text');
  });
});
define('banker/tests/integration/components/branch-account-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleForComponent)('branch-account', 'Integration | Component | branch account', {
    integration: true
  });

  (0, _emberQunit.test)('it renders', function (assert) {

    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template({
      "id": "SBzf3CcQ",
      "block": "{\"statements\":[[1,[26,[\"branch-account\"]],false]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
      "meta": {}
    }));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template({
      "id": "KbkLYCdT",
      "block": "{\"statements\":[[0,\"\\n\"],[6,[\"branch-account\"],null,null,{\"statements\":[[0,\"      template block text\\n\"]],\"locals\":[]},null],[0,\"  \"]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
      "meta": {}
    }));

    assert.equal(this.$().text().trim(), 'template block text');
  });
});
define('banker/tests/integration/components/branch-input-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleForComponent)('branch-input', 'Integration | Component | branch input', {
    integration: true
  });

  (0, _emberQunit.test)('it renders', function (assert) {

    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template({
      "id": "dEx6qXrr",
      "block": "{\"statements\":[[1,[26,[\"branch-input\"]],false]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
      "meta": {}
    }));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template({
      "id": "/QgVM3w/",
      "block": "{\"statements\":[[0,\"\\n\"],[6,[\"branch-input\"],null,null,{\"statements\":[[0,\"      template block text\\n\"]],\"locals\":[]},null],[0,\"  \"]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
      "meta": {}
    }));

    assert.equal(this.$().text().trim(), 'template block text');
  });
});
define('banker/tests/integration/components/chart-viewer-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleForComponent)('chart-viewer', 'Integration | Component | chart viewer', {
    integration: true
  });

  (0, _emberQunit.test)('it renders', function (assert) {

    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template({
      "id": "vrjmm9Vk",
      "block": "{\"statements\":[[1,[26,[\"chart-viewer\"]],false]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
      "meta": {}
    }));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template({
      "id": "uUUxy8rr",
      "block": "{\"statements\":[[0,\"\\n\"],[6,[\"chart-viewer\"],null,null,{\"statements\":[[0,\"      template block text\\n\"]],\"locals\":[]},null],[0,\"  \"]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
      "meta": {}
    }));

    assert.equal(this.$().text().trim(), 'template block text');
  });
});
define('banker/tests/integration/components/customer-dashboard-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleForComponent)('customer-dashboard', 'Integration | Component | customer dashboard', {
    integration: true
  });

  (0, _emberQunit.test)('it renders', function (assert) {

    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template({
      "id": "XaHzVi5i",
      "block": "{\"statements\":[[1,[26,[\"customer-dashboard\"]],false]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
      "meta": {}
    }));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template({
      "id": "IodXe1sE",
      "block": "{\"statements\":[[0,\"\\n\"],[6,[\"customer-dashboard\"],null,null,{\"statements\":[[0,\"      template block text\\n\"]],\"locals\":[]},null],[0,\"  \"]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
      "meta": {}
    }));

    assert.equal(this.$().text().trim(), 'template block text');
  });
});
define('banker/tests/integration/components/d3-bar-chart-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleForComponent)('d3-bar-chart', 'Integration | Component | d3 bar chart', {
    integration: true
  });

  (0, _emberQunit.test)('it renders', function (assert) {

    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template({
      "id": "JpthkQFj",
      "block": "{\"statements\":[[1,[26,[\"d3-bar-chart\"]],false]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
      "meta": {}
    }));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template({
      "id": "ZEpg6xLq",
      "block": "{\"statements\":[[0,\"\\n\"],[6,[\"d3-bar-chart\"],null,null,{\"statements\":[[0,\"      template block text\\n\"]],\"locals\":[]},null],[0,\"  \"]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
      "meta": {}
    }));

    assert.equal(this.$().text().trim(), 'template block text');
  });
});
define('banker/tests/integration/components/loan-input-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleForComponent)('loan-input', 'Integration | Component | loan input', {
    integration: true
  });

  (0, _emberQunit.test)('it renders', function (assert) {

    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template({
      "id": "0KbfLHwO",
      "block": "{\"statements\":[[1,[26,[\"loan-input\"]],false]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
      "meta": {}
    }));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template({
      "id": "Toxr8NAa",
      "block": "{\"statements\":[[0,\"\\n\"],[6,[\"loan-input\"],null,null,{\"statements\":[[0,\"      template block text\\n\"]],\"locals\":[]},null],[0,\"  \"]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
      "meta": {}
    }));

    assert.equal(this.$().text().trim(), 'template block text');
  });
});
define('banker/tests/integration/components/manager-dashboard-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleForComponent)('manager-dashboard', 'Integration | Component | manager dashboard', {
    integration: true
  });

  (0, _emberQunit.test)('it renders', function (assert) {

    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template({
      "id": "DuOXPeep",
      "block": "{\"statements\":[[1,[26,[\"manager-dashboard\"]],false]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
      "meta": {}
    }));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template({
      "id": "Eup7UFHn",
      "block": "{\"statements\":[[0,\"\\n\"],[6,[\"manager-dashboard\"],null,null,{\"statements\":[[0,\"      template block text\\n\"]],\"locals\":[]},null],[0,\"  \"]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
      "meta": {}
    }));

    assert.equal(this.$().text().trim(), 'template block text');
  });
});
define('banker/tests/integration/components/nav-bar-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleForComponent)('nav-bar', 'Integration | Component | nav bar', {
    integration: true
  });

  (0, _emberQunit.test)('it renders', function (assert) {

    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template({
      "id": "ntAlUnVm",
      "block": "{\"statements\":[[1,[26,[\"nav-bar\"]],false]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
      "meta": {}
    }));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template({
      "id": "UKwhv7kh",
      "block": "{\"statements\":[[0,\"\\n\"],[6,[\"nav-bar\"],null,null,{\"statements\":[[0,\"      template block text\\n\"]],\"locals\":[]},null],[0,\"  \"]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
      "meta": {}
    }));

    assert.equal(this.$().text().trim(), 'template block text');
  });
});
define('banker/tests/integration/components/notify-box-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleForComponent)('notify-box', 'Integration | Component | notify box', {
    integration: true
  });

  (0, _emberQunit.test)('it renders', function (assert) {

    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template({
      "id": "JLHzjdlu",
      "block": "{\"statements\":[[1,[26,[\"notify-box\"]],false]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
      "meta": {}
    }));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template({
      "id": "HQxXxzrt",
      "block": "{\"statements\":[[0,\"\\n\"],[6,[\"notify-box\"],null,null,{\"statements\":[[0,\"      template block text\\n\"]],\"locals\":[]},null],[0,\"  \"]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
      "meta": {}
    }));

    assert.equal(this.$().text().trim(), 'template block text');
  });
});
define('banker/tests/integration/components/transaction-input-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleForComponent)('transaction-input', 'Integration | Component | transaction input', {
    integration: true
  });

  (0, _emberQunit.test)('it renders', function (assert) {

    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template({
      "id": "NCeHmqQW",
      "block": "{\"statements\":[[1,[26,[\"transaction-input\"]],false]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
      "meta": {}
    }));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template({
      "id": "92G3EG0g",
      "block": "{\"statements\":[[0,\"\\n\"],[6,[\"transaction-input\"],null,null,{\"statements\":[[0,\"      template block text\\n\"]],\"locals\":[]},null],[0,\"  \"]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
      "meta": {}
    }));

    assert.equal(this.$().text().trim(), 'template block text');
  });
});
define('banker/tests/integration/components/view-account-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleForComponent)('view-account', 'Integration | Component | view account', {
    integration: true
  });

  (0, _emberQunit.test)('it renders', function (assert) {

    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template({
      "id": "ZkoKPqLH",
      "block": "{\"statements\":[[1,[26,[\"view-account\"]],false]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
      "meta": {}
    }));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template({
      "id": "7kG1XmsT",
      "block": "{\"statements\":[[0,\"\\n\"],[6,[\"view-account\"],null,null,{\"statements\":[[0,\"      template block text\\n\"]],\"locals\":[]},null],[0,\"  \"]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
      "meta": {}
    }));

    assert.equal(this.$().text().trim(), 'template block text');
  });
});
define('banker/tests/integration/components/view-accounts-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleForComponent)('view-accounts', 'Integration | Component | view accounts', {
    integration: true
  });

  (0, _emberQunit.test)('it renders', function (assert) {

    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template({
      "id": "1hSY+fra",
      "block": "{\"statements\":[[1,[26,[\"view-accounts\"]],false]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
      "meta": {}
    }));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template({
      "id": "1ZNTqKbZ",
      "block": "{\"statements\":[[0,\"\\n\"],[6,[\"view-accounts\"],null,null,{\"statements\":[[0,\"      template block text\\n\"]],\"locals\":[]},null],[0,\"  \"]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
      "meta": {}
    }));

    assert.equal(this.$().text().trim(), 'template block text');
  });
});
define('banker/tests/integration/components/view-loan-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleForComponent)('view-loan', 'Integration | Component | view loan', {
    integration: true
  });

  (0, _emberQunit.test)('it renders', function (assert) {

    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template({
      "id": "hGMw+mqv",
      "block": "{\"statements\":[[1,[26,[\"view-loan\"]],false]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
      "meta": {}
    }));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template({
      "id": "QVwOzLMZ",
      "block": "{\"statements\":[[0,\"\\n\"],[6,[\"view-loan\"],null,null,{\"statements\":[[0,\"      template block text\\n\"]],\"locals\":[]},null],[0,\"  \"]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
      "meta": {}
    }));

    assert.equal(this.$().text().trim(), 'template block text');
  });
});
define('banker/tests/integration/components/view-loans-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleForComponent)('view-loans', 'Integration | Component | view loans', {
    integration: true
  });

  (0, _emberQunit.test)('it renders', function (assert) {

    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template({
      "id": "04ktEN1C",
      "block": "{\"statements\":[[1,[26,[\"view-loans\"]],false]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
      "meta": {}
    }));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template({
      "id": "Sk7WJgkM",
      "block": "{\"statements\":[[0,\"\\n\"],[6,[\"view-loans\"],null,null,{\"statements\":[[0,\"      template block text\\n\"]],\"locals\":[]},null],[0,\"  \"]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
      "meta": {}
    }));

    assert.equal(this.$().text().trim(), 'template block text');
  });
});
define('banker/tests/integration/components/view-transaction-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleForComponent)('view-transaction', 'Integration | Component | view transaction', {
    integration: true
  });

  (0, _emberQunit.test)('it renders', function (assert) {

    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template({
      "id": "iLutncQV",
      "block": "{\"statements\":[[1,[26,[\"view-transaction\"]],false]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
      "meta": {}
    }));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template({
      "id": "XyR2kw/R",
      "block": "{\"statements\":[[0,\"\\n\"],[6,[\"view-transaction\"],null,null,{\"statements\":[[0,\"      template block text\\n\"]],\"locals\":[]},null],[0,\"  \"]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
      "meta": {}
    }));

    assert.equal(this.$().text().trim(), 'template block text');
  });
});
define('banker/tests/integration/components/view-transactions-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleForComponent)('view-transactions', 'Integration | Component | view transactions', {
    integration: true
  });

  (0, _emberQunit.test)('it renders', function (assert) {

    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template({
      "id": "O2x9nA5U",
      "block": "{\"statements\":[[1,[26,[\"view-transactions\"]],false]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
      "meta": {}
    }));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template({
      "id": "YYrFidHy",
      "block": "{\"statements\":[[0,\"\\n\"],[6,[\"view-transactions\"],null,null,{\"statements\":[[0,\"      template block text\\n\"]],\"locals\":[]},null],[0,\"  \"]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
      "meta": {}
    }));

    assert.equal(this.$().text().trim(), 'template block text');
  });
});
define('banker/tests/integration/helpers/account-status-mapping-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleForComponent)('account-status-mapping', 'helper:account-status-mapping', {
    integration: true
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it renders', function (assert) {
    this.set('inputValue', '1234');

    this.render(Ember.HTMLBars.template({
      "id": "izxj44af",
      "block": "{\"statements\":[[1,[33,[\"account-status-mapping\"],[[28,[\"inputValue\"]]],null],false]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
      "meta": {}
    }));

    assert.equal(this.$().text().trim(), '1234');
  });
});
define('banker/tests/integration/helpers/eq-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleForComponent)('eq', 'helper:eq', {
    integration: true
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it renders', function (assert) {
    this.set('inputValue', '1234');

    this.render(Ember.HTMLBars.template({
      "id": "1SYOrDlN",
      "block": "{\"statements\":[[1,[33,[\"eq\"],[[28,[\"inputValue\"]]],null],false]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
      "meta": {}
    }));

    assert.equal(this.$().text().trim(), '1234');
  });
});
define('banker/tests/integration/helpers/format-date-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleForComponent)('format-date', 'helper:format-date', {
    integration: true
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it renders', function (assert) {
    this.set('inputValue', '1234');

    this.render(Ember.HTMLBars.template({
      "id": "+/CCj5S3",
      "block": "{\"statements\":[[1,[33,[\"format-date\"],[[28,[\"inputValue\"]]],null],false]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
      "meta": {}
    }));

    assert.equal(this.$().text().trim(), '1234');
  });
});
define('banker/tests/test-helper', ['banker/tests/helpers/resolver', 'ember-qunit', 'ember-cli-qunit'], function (_resolver, _emberQunit, _emberCliQunit) {
  'use strict';

  (0, _emberQunit.setResolver)(_resolver.default);
  (0, _emberCliQunit.start)();
});
define('banker/tests/tests.lint-test', [], function () {
  'use strict';

  QUnit.module('ESLint | tests');

  QUnit.test('helpers/destroy-app.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'helpers/destroy-app.js should pass ESLint\n\n');
  });

  QUnit.test('helpers/module-for-acceptance.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'helpers/module-for-acceptance.js should pass ESLint\n\n');
  });

  QUnit.test('helpers/resolver.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'helpers/resolver.js should pass ESLint\n\n');
  });

  QUnit.test('helpers/start-app.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'helpers/start-app.js should pass ESLint\n\n');
  });

  QUnit.test('integration/components/admin-dashboard-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/components/admin-dashboard-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/components/auth-form-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/components/auth-form-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/components/branch-account-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/components/branch-account-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/components/branch-input-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/components/branch-input-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/components/chart-viewer-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/components/chart-viewer-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/components/customer-dashboard-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/components/customer-dashboard-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/components/d3-bar-chart-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/components/d3-bar-chart-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/components/loan-input-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/components/loan-input-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/components/manager-dashboard-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/components/manager-dashboard-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/components/nav-bar-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/components/nav-bar-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/components/notify-box-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/components/notify-box-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/components/transaction-input-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/components/transaction-input-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/components/view-account-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/components/view-account-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/components/view-accounts-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/components/view-accounts-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/components/view-loan-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/components/view-loan-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/components/view-loans-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/components/view-loans-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/components/view-transaction-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/components/view-transaction-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/components/view-transactions-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/components/view-transactions-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/helpers/account-status-mapping-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/helpers/account-status-mapping-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/helpers/eq-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/helpers/eq-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/helpers/format-date-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/helpers/format-date-test.js should pass ESLint\n\n');
  });

  QUnit.test('test-helper.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'test-helper.js should pass ESLint\n\n');
  });

  QUnit.test('unit/controllers/accounts-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/controllers/accounts-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/controllers/application-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/controllers/application-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/controllers/banks-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/controllers/banks-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/controllers/banks.bank.edit-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/controllers/banks.bank.edit-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/controllers/banks/bank-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/controllers/banks/bank-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/controllers/banks/bank/accounts-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/controllers/banks/bank/accounts-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/controllers/banks/bank/accounts/account-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/controllers/banks/bank/accounts/account-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/controllers/banks/bank/accounts/account/edit-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/controllers/banks/bank/accounts/account/edit-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/controllers/banks/bank/accounts/account/loans-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/controllers/banks/bank/accounts/account/loans-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/controllers/banks/bank/accounts/account/loans/loan-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/controllers/banks/bank/accounts/account/loans/loan-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/controllers/banks/bank/accounts/account/loans/loan/edit-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/controllers/banks/bank/accounts/account/loans/loan/edit-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/controllers/banks/bank/accounts/account/loans/loan/emi-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/controllers/banks/bank/accounts/account/loans/loan/emi-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/controllers/banks/bank/accounts/account/loans/new-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/controllers/banks/bank/accounts/account/loans/new-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/controllers/banks/bank/accounts/account/transactions-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/controllers/banks/bank/accounts/account/transactions-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/controllers/banks/bank/accounts/account/transactions/new-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/controllers/banks/bank/accounts/account/transactions/new-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/controllers/banks/bank/accounts/account/transactions/transaction-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/controllers/banks/bank/accounts/account/transactions/transaction-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/controllers/banks/bank/accounts/account/transactions/transaction/new-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/controllers/banks/bank/accounts/account/transactions/transaction/new-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/controllers/banks/bank/accounts/new-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/controllers/banks/bank/accounts/new-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/controllers/banks/bank/branches-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/controllers/banks/bank/branches-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/controllers/banks/bank/branches/branch-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/controllers/banks/bank/branches/branch-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/controllers/banks/bank/branches/branch/delete-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/controllers/banks/bank/branches/branch/delete-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/controllers/banks/bank/branches/branch/edit-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/controllers/banks/bank/branches/branch/edit-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/controllers/banks/bank/branches/new-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/controllers/banks/bank/branches/new-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/controllers/banks/bank/edit-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/controllers/banks/bank/edit-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/controllers/banks/bank/loans-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/controllers/banks/bank/loans-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/controllers/banks/bank/loans/loan-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/controllers/banks/bank/loans/loan-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/controllers/banks/bank/loans/loan/edit-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/controllers/banks/bank/loans/loan/edit-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/controllers/banks/bank/loans/loan/emi-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/controllers/banks/bank/loans/loan/emi-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/controllers/banks/bank/loans/new-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/controllers/banks/bank/loans/new-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/controllers/banks/bank/transactions-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/controllers/banks/bank/transactions-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/controllers/banks/bank/transactions/new-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/controllers/banks/bank/transactions/new-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/controllers/banks/bank/transactions/transaction-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/controllers/banks/bank/transactions/transaction-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/controllers/banks/bank/users-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/controllers/banks/bank/users-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/controllers/banks/bank/users/user-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/controllers/banks/bank/users/user-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/controllers/banks/bank/users/user/dashboard-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/controllers/banks/bank/users/user/dashboard-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/controllers/banks/bank/users/user/edit-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/controllers/banks/bank/users/user/edit-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/controllers/banks/new-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/controllers/banks/new-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/controllers/dashboard-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/controllers/dashboard-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/controllers/inputform-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/controllers/inputform-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/controllers/login-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/controllers/login-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/controllers/register-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/controllers/register-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/controllers/super-admin-login-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/controllers/super-admin-login-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/controllers/users/user/dashboard-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/controllers/users/user/dashboard-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/routes/accounts-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/routes/accounts-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/routes/banks-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/routes/banks-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/routes/banks.bank.edit-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/routes/banks.bank.edit-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/routes/banks/bank-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/routes/banks/bank-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/routes/banks/bank/accounts-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/routes/banks/bank/accounts-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/routes/banks/bank/accounts/account-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/routes/banks/bank/accounts/account-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/routes/banks/bank/accounts/account/edit-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/routes/banks/bank/accounts/account/edit-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/routes/banks/bank/accounts/account/loans-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/routes/banks/bank/accounts/account/loans-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/routes/banks/bank/accounts/account/loans/loan-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/routes/banks/bank/accounts/account/loans/loan-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/routes/banks/bank/accounts/account/loans/loan/edit-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/routes/banks/bank/accounts/account/loans/loan/edit-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/routes/banks/bank/accounts/account/loans/loan/emi-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/routes/banks/bank/accounts/account/loans/loan/emi-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/routes/banks/bank/accounts/account/loans/new-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/routes/banks/bank/accounts/account/loans/new-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/routes/banks/bank/accounts/account/transactions-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/routes/banks/bank/accounts/account/transactions-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/routes/banks/bank/accounts/account/transactions/new-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/routes/banks/bank/accounts/account/transactions/new-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/routes/banks/bank/accounts/account/transactions/transaction-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/routes/banks/bank/accounts/account/transactions/transaction-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/routes/banks/bank/accounts/account/transactions/transaction/new-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/routes/banks/bank/accounts/account/transactions/transaction/new-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/routes/banks/bank/accounts/new-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/routes/banks/bank/accounts/new-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/routes/banks/bank/branches-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/routes/banks/bank/branches-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/routes/banks/bank/branches/branch-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/routes/banks/bank/branches/branch-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/routes/banks/bank/branches/branch/delete-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/routes/banks/bank/branches/branch/delete-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/routes/banks/bank/branches/branch/edit-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/routes/banks/bank/branches/branch/edit-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/routes/banks/bank/branches/new-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/routes/banks/bank/branches/new-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/routes/banks/bank/edit-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/routes/banks/bank/edit-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/routes/banks/bank/loans-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/routes/banks/bank/loans-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/routes/banks/bank/loans/loan-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/routes/banks/bank/loans/loan-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/routes/banks/bank/loans/loan/edit-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/routes/banks/bank/loans/loan/edit-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/routes/banks/bank/loans/loan/emi-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/routes/banks/bank/loans/loan/emi-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/routes/banks/bank/loans/new-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/routes/banks/bank/loans/new-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/routes/banks/bank/transactions-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/routes/banks/bank/transactions-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/routes/banks/bank/transactions/new-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/routes/banks/bank/transactions/new-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/routes/banks/bank/transactions/transaction-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/routes/banks/bank/transactions/transaction-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/routes/banks/bank/users-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/routes/banks/bank/users-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/routes/banks/bank/users/user-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/routes/banks/bank/users/user-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/routes/banks/bank/users/user/dashboard-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/routes/banks/bank/users/user/dashboard-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/routes/banks/bank/users/user/edit-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/routes/banks/bank/users/user/edit-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/routes/banks/new-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/routes/banks/new-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/routes/dashboard-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/routes/dashboard-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/routes/form-page-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/routes/form-page-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/routes/forms-page-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/routes/forms-page-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/routes/inputform-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/routes/inputform-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/routes/login-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/routes/login-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/routes/register-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/routes/register-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/routes/super-admin-login-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/routes/super-admin-login-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/routes/superdashboard-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/routes/superdashboard-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/routes/users-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/routes/users-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/routes/users/user-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/routes/users/user-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/routes/users/user/dashboard-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/routes/users/user/dashboard-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/services/accounts-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/services/accounts-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/services/banks-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/services/banks-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/services/branch-select-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/services/branch-select-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/services/branches-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/services/branches-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/services/dashboard-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/services/dashboard-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/services/emis-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/services/emis-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/services/loans-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/services/loans-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/services/notify-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/services/notify-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/services/session-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/services/session-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/services/transactions-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/services/transactions-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/services/users-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/services/users-test.js should pass ESLint\n\n');
  });
});
define('banker/tests/unit/controllers/accounts-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('controller:accounts', 'Unit | Controller | accounts', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it exists', function (assert) {
    var controller = this.subject();
    assert.ok(controller);
  });
});
define('banker/tests/unit/controllers/application-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('controller:application', 'Unit | Controller | application', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it exists', function (assert) {
    var controller = this.subject();
    assert.ok(controller);
  });
});
define('banker/tests/unit/controllers/banks-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('controller:banks', 'Unit | Controller | banks', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it exists', function (assert) {
    var controller = this.subject();
    assert.ok(controller);
  });
});
define('banker/tests/unit/controllers/banks.bank.edit-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('controller:banks.bank.edit', 'Unit | Controller | banks.bank.edit', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it exists', function (assert) {
    var controller = this.subject();
    assert.ok(controller);
  });
});
define('banker/tests/unit/controllers/banks/bank-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('controller:banks/bank', 'Unit | Controller | banks/bank', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it exists', function (assert) {
    var controller = this.subject();
    assert.ok(controller);
  });
});
define('banker/tests/unit/controllers/banks/bank/accounts-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('controller:banks/bank/accounts', 'Unit | Controller | banks/bank/accounts', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it exists', function (assert) {
    var controller = this.subject();
    assert.ok(controller);
  });
});
define('banker/tests/unit/controllers/banks/bank/accounts/account-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('controller:banks/bank/accounts/account', 'Unit | Controller | banks/bank/accounts/account', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it exists', function (assert) {
    var controller = this.subject();
    assert.ok(controller);
  });
});
define('banker/tests/unit/controllers/banks/bank/accounts/account/edit-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('controller:banks/bank/accounts/account/edit', 'Unit | Controller | banks/bank/accounts/account/edit', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it exists', function (assert) {
    var controller = this.subject();
    assert.ok(controller);
  });
});
define('banker/tests/unit/controllers/banks/bank/accounts/account/loans-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('controller:banks/bank/accounts/account/loans', 'Unit | Controller | banks/bank/accounts/account/loans', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it exists', function (assert) {
    var controller = this.subject();
    assert.ok(controller);
  });
});
define('banker/tests/unit/controllers/banks/bank/accounts/account/loans/loan-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('controller:banks/bank/accounts/account/loans/loan', 'Unit | Controller | banks/bank/accounts/account/loans/loan', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it exists', function (assert) {
    var controller = this.subject();
    assert.ok(controller);
  });
});
define('banker/tests/unit/controllers/banks/bank/accounts/account/loans/loan/edit-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('controller:banks/bank/accounts/account/loans/loan/edit', 'Unit | Controller | banks/bank/accounts/account/loans/loan/edit', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it exists', function (assert) {
    var controller = this.subject();
    assert.ok(controller);
  });
});
define('banker/tests/unit/controllers/banks/bank/accounts/account/loans/loan/emi-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('controller:banks/bank/accounts/account/loans/loan/emi', 'Unit | Controller | banks/bank/accounts/account/loans/loan/emi', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it exists', function (assert) {
    var controller = this.subject();
    assert.ok(controller);
  });
});
define('banker/tests/unit/controllers/banks/bank/accounts/account/loans/new-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('controller:banks/bank/accounts/account/loans/new', 'Unit | Controller | banks/bank/accounts/account/loans/new', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it exists', function (assert) {
    var controller = this.subject();
    assert.ok(controller);
  });
});
define('banker/tests/unit/controllers/banks/bank/accounts/account/transactions-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('controller:banks/bank/accounts/account/transactions', 'Unit | Controller | banks/bank/accounts/account/transactions', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it exists', function (assert) {
    var controller = this.subject();
    assert.ok(controller);
  });
});
define('banker/tests/unit/controllers/banks/bank/accounts/account/transactions/new-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('controller:banks/bank/accounts/account/transactions/new', 'Unit | Controller | banks/bank/accounts/account/transactions/new', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it exists', function (assert) {
    var controller = this.subject();
    assert.ok(controller);
  });
});
define('banker/tests/unit/controllers/banks/bank/accounts/account/transactions/transaction-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('controller:banks/bank/accounts/account/transactions/transaction', 'Unit | Controller | banks/bank/accounts/account/transactions/transaction', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it exists', function (assert) {
    var controller = this.subject();
    assert.ok(controller);
  });
});
define('banker/tests/unit/controllers/banks/bank/accounts/account/transactions/transaction/new-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('controller:banks/bank/accounts/account/transactions/transaction/new', 'Unit | Controller | banks/bank/accounts/account/transactions/transaction/new', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it exists', function (assert) {
    var controller = this.subject();
    assert.ok(controller);
  });
});
define('banker/tests/unit/controllers/banks/bank/accounts/new-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('controller:banks/bank/accounts/new', 'Unit | Controller | banks/bank/accounts/new', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it exists', function (assert) {
    var controller = this.subject();
    assert.ok(controller);
  });
});
define('banker/tests/unit/controllers/banks/bank/branches-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('controller:banks/bank/branches', 'Unit | Controller | banks/bank/branches', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it exists', function (assert) {
    var controller = this.subject();
    assert.ok(controller);
  });
});
define('banker/tests/unit/controllers/banks/bank/branches/branch-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('controller:banks/bank/branches/branch', 'Unit | Controller | banks/bank/branches/branch', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it exists', function (assert) {
    var controller = this.subject();
    assert.ok(controller);
  });
});
define('banker/tests/unit/controllers/banks/bank/branches/branch/delete-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('controller:banks/bank/branches/branch/delete', 'Unit | Controller | banks/bank/branches/branch/delete', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it exists', function (assert) {
    var controller = this.subject();
    assert.ok(controller);
  });
});
define('banker/tests/unit/controllers/banks/bank/branches/branch/edit-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('controller:banks/bank/branches/branch/edit', 'Unit | Controller | banks/bank/branches/branch/edit', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it exists', function (assert) {
    var controller = this.subject();
    assert.ok(controller);
  });
});
define('banker/tests/unit/controllers/banks/bank/branches/new-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('controller:banks/bank/branches/new', 'Unit | Controller | banks/bank/branches/new', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it exists', function (assert) {
    var controller = this.subject();
    assert.ok(controller);
  });
});
define('banker/tests/unit/controllers/banks/bank/edit-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('controller:banks/bank/edit', 'Unit | Controller | banks/bank/edit', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it exists', function (assert) {
    var controller = this.subject();
    assert.ok(controller);
  });
});
define('banker/tests/unit/controllers/banks/bank/loans-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('controller:banks/bank/loans', 'Unit | Controller | banks/bank/loans', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it exists', function (assert) {
    var controller = this.subject();
    assert.ok(controller);
  });
});
define('banker/tests/unit/controllers/banks/bank/loans/loan-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('controller:banks/bank/loans/loan', 'Unit | Controller | banks/bank/loans/loan', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it exists', function (assert) {
    var controller = this.subject();
    assert.ok(controller);
  });
});
define('banker/tests/unit/controllers/banks/bank/loans/loan/edit-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('controller:banks/bank/loans/loan/edit', 'Unit | Controller | banks/bank/loans/loan/edit', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it exists', function (assert) {
    var controller = this.subject();
    assert.ok(controller);
  });
});
define('banker/tests/unit/controllers/banks/bank/loans/loan/emi-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('controller:banks/bank/loans/loan/emi', 'Unit | Controller | banks/bank/loans/loan/emi', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it exists', function (assert) {
    var controller = this.subject();
    assert.ok(controller);
  });
});
define('banker/tests/unit/controllers/banks/bank/loans/new-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('controller:banks/bank/loans/new', 'Unit | Controller | banks/bank/loans/new', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it exists', function (assert) {
    var controller = this.subject();
    assert.ok(controller);
  });
});
define('banker/tests/unit/controllers/banks/bank/transactions-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('controller:banks/bank/transactions', 'Unit | Controller | banks/bank/transactions', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it exists', function (assert) {
    var controller = this.subject();
    assert.ok(controller);
  });
});
define('banker/tests/unit/controllers/banks/bank/transactions/new-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('controller:banks/bank/transactions/new', 'Unit | Controller | banks/bank/transactions/new', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it exists', function (assert) {
    var controller = this.subject();
    assert.ok(controller);
  });
});
define('banker/tests/unit/controllers/banks/bank/transactions/transaction-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('controller:banks/bank/transactions/transaction', 'Unit | Controller | banks/bank/transactions/transaction', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it exists', function (assert) {
    var controller = this.subject();
    assert.ok(controller);
  });
});
define('banker/tests/unit/controllers/banks/bank/users-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('controller:banks/bank/users', 'Unit | Controller | banks/bank/users', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it exists', function (assert) {
    var controller = this.subject();
    assert.ok(controller);
  });
});
define('banker/tests/unit/controllers/banks/bank/users/user-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('controller:banks/bank/users/user', 'Unit | Controller | banks/bank/users/user', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it exists', function (assert) {
    var controller = this.subject();
    assert.ok(controller);
  });
});
define('banker/tests/unit/controllers/banks/bank/users/user/dashboard-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('controller:banks/bank/users/user/dashboard', 'Unit | Controller | banks/bank/users/user/dashboard', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it exists', function (assert) {
    var controller = this.subject();
    assert.ok(controller);
  });
});
define('banker/tests/unit/controllers/banks/bank/users/user/edit-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('controller:banks/bank/users/user/edit', 'Unit | Controller | banks/bank/users/user/edit', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it exists', function (assert) {
    var controller = this.subject();
    assert.ok(controller);
  });
});
define('banker/tests/unit/controllers/banks/new-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('controller:banks/new', 'Unit | Controller | banks/new', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it exists', function (assert) {
    var controller = this.subject();
    assert.ok(controller);
  });
});
define('banker/tests/unit/controllers/dashboard-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('controller:dashboard', 'Unit | Controller | dashboard', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it exists', function (assert) {
    var controller = this.subject();
    assert.ok(controller);
  });
});
define('banker/tests/unit/controllers/inputform-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('controller:inputform', 'Unit | Controller | inputform', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it exists', function (assert) {
    var controller = this.subject();
    assert.ok(controller);
  });
});
define('banker/tests/unit/controllers/login-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('controller:login', 'Unit | Controller | login', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it exists', function (assert) {
    var controller = this.subject();
    assert.ok(controller);
  });
});
define('banker/tests/unit/controllers/register-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('controller:register', 'Unit | Controller | register', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it exists', function (assert) {
    var controller = this.subject();
    assert.ok(controller);
  });
});
define('banker/tests/unit/controllers/super-admin-login-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('controller:super-admin-login', 'Unit | Controller | super admin login', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it exists', function (assert) {
    var controller = this.subject();
    assert.ok(controller);
  });
});
define('banker/tests/unit/controllers/users/user/dashboard-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('controller:users/user/dashboard', 'Unit | Controller | users/user/dashboard', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it exists', function (assert) {
    var controller = this.subject();
    assert.ok(controller);
  });
});
define('banker/tests/unit/routes/accounts-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('route:accounts', 'Unit | Route | accounts', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('banker/tests/unit/routes/banks-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('route:banks', 'Unit | Route | banks', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('banker/tests/unit/routes/banks.bank.edit-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('route:banks.bank.edit', 'Unit | Route | banks.bank.edit', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('banker/tests/unit/routes/banks/bank-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('route:banks/bank', 'Unit | Route | banks/bank', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('banker/tests/unit/routes/banks/bank/accounts-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('route:banks/bank/accounts', 'Unit | Route | banks/bank/accounts', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('banker/tests/unit/routes/banks/bank/accounts/account-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('route:banks/bank/accounts/account', 'Unit | Route | banks/bank/accounts/account', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('banker/tests/unit/routes/banks/bank/accounts/account/edit-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('route:banks/bank/accounts/account/edit', 'Unit | Route | banks/bank/accounts/account/edit', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('banker/tests/unit/routes/banks/bank/accounts/account/loans-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('route:banks/bank/accounts/account/loans', 'Unit | Route | banks/bank/accounts/account/loans', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('banker/tests/unit/routes/banks/bank/accounts/account/loans/loan-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('route:banks/bank/accounts/account/loans/loan', 'Unit | Route | banks/bank/accounts/account/loans/loan', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('banker/tests/unit/routes/banks/bank/accounts/account/loans/loan/edit-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('route:banks/bank/accounts/account/loans/loan/edit', 'Unit | Route | banks/bank/accounts/account/loans/loan/edit', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('banker/tests/unit/routes/banks/bank/accounts/account/loans/loan/emi-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('route:banks/bank/accounts/account/loans/loan/emi', 'Unit | Route | banks/bank/accounts/account/loans/loan/emi', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('banker/tests/unit/routes/banks/bank/accounts/account/loans/new-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('route:banks/bank/accounts/account/loans/new', 'Unit | Route | banks/bank/accounts/account/loans/new', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('banker/tests/unit/routes/banks/bank/accounts/account/transactions-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('route:banks/bank/accounts/account/transactions', 'Unit | Route | banks/bank/accounts/account/transactions', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('banker/tests/unit/routes/banks/bank/accounts/account/transactions/new-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('route:banks/bank/accounts/account/transactions/new', 'Unit | Route | banks/bank/accounts/account/transactions/new', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('banker/tests/unit/routes/banks/bank/accounts/account/transactions/transaction-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('route:banks/bank/accounts/account/transactions/transaction', 'Unit | Route | banks/bank/accounts/account/transactions/transaction', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('banker/tests/unit/routes/banks/bank/accounts/account/transactions/transaction/new-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('route:banks/bank/accounts/account/transactions/transaction/new', 'Unit | Route | banks/bank/accounts/account/transactions/transaction/new', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('banker/tests/unit/routes/banks/bank/accounts/new-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('route:banks/bank/accounts/new', 'Unit | Route | banks/bank/accounts/new', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('banker/tests/unit/routes/banks/bank/branches-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('route:banks/bank/branches', 'Unit | Route | banks/bank/branches', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('banker/tests/unit/routes/banks/bank/branches/branch-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('route:banks/bank/branches/branch', 'Unit | Route | banks/bank/branches/branch', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('banker/tests/unit/routes/banks/bank/branches/branch/delete-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('route:banks/bank/branches/branch/delete', 'Unit | Route | banks/bank/branches/branch/delete', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('banker/tests/unit/routes/banks/bank/branches/branch/edit-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('route:banks/bank/branches/branch/edit', 'Unit | Route | banks/bank/branches/branch/edit', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('banker/tests/unit/routes/banks/bank/branches/new-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('route:banks/bank/branches/new', 'Unit | Route | banks/bank/branches/new', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('banker/tests/unit/routes/banks/bank/edit-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('route:banks/bank/edit', 'Unit | Route | banks/bank/edit', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('banker/tests/unit/routes/banks/bank/loans-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('route:banks/bank/loans', 'Unit | Route | banks/bank/loans', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('banker/tests/unit/routes/banks/bank/loans/loan-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('route:banks/bank/loans/loan', 'Unit | Route | banks/bank/loans/loan', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('banker/tests/unit/routes/banks/bank/loans/loan/edit-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('route:banks/bank/loans/loan/edit', 'Unit | Route | banks/bank/loans/loan/edit', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('banker/tests/unit/routes/banks/bank/loans/loan/emi-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('route:banks/bank/loans/loan/emi', 'Unit | Route | banks/bank/loans/loan/emi', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('banker/tests/unit/routes/banks/bank/loans/new-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('route:banks/bank/loans/new', 'Unit | Route | banks/bank/loans/new', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('banker/tests/unit/routes/banks/bank/transactions-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('route:banks/bank/transactions', 'Unit | Route | banks/bank/transactions', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('banker/tests/unit/routes/banks/bank/transactions/new-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('route:banks/bank/transactions/new', 'Unit | Route | banks/bank/transactions/new', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('banker/tests/unit/routes/banks/bank/transactions/transaction-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('route:banks/bank/transactions/transaction', 'Unit | Route | banks/bank/transactions/transaction', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('banker/tests/unit/routes/banks/bank/users-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('route:banks/bank/users', 'Unit | Route | banks/bank/users', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('banker/tests/unit/routes/banks/bank/users/user-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('route:banks/bank/users/user', 'Unit | Route | banks/bank/users/user', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('banker/tests/unit/routes/banks/bank/users/user/dashboard-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('route:banks/bank/users/user/dashboard', 'Unit | Route | banks/bank/users/user/dashboard', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('banker/tests/unit/routes/banks/bank/users/user/edit-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('route:banks/bank/users/user/edit', 'Unit | Route | banks/bank/users/user/edit', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('banker/tests/unit/routes/banks/new-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('route:banks/new', 'Unit | Route | banks/new', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('banker/tests/unit/routes/dashboard-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('route:dashboard', 'Unit | Route | dashboard', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('banker/tests/unit/routes/form-page-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('route:form-page', 'Unit | Route | form page', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('banker/tests/unit/routes/forms-page-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('route:forms-page', 'Unit | Route | forms page', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('banker/tests/unit/routes/inputform-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('route:inputform', 'Unit | Route | inputform', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('banker/tests/unit/routes/login-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('route:login', 'Unit | Route | login', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('banker/tests/unit/routes/register-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('route:register', 'Unit | Route | register', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('banker/tests/unit/routes/super-admin-login-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('route:super-admin-login', 'Unit | Route | super admin login', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('banker/tests/unit/routes/superdashboard-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('route:superdashboard', 'Unit | Route | superdashboard', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('banker/tests/unit/routes/users-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('route:users', 'Unit | Route | users', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('banker/tests/unit/routes/users/user-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('route:users/user', 'Unit | Route | users/user', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('banker/tests/unit/routes/users/user/dashboard-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('route:users/user/dashboard', 'Unit | Route | users/user/dashboard', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('banker/tests/unit/services/accounts-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('service:accounts', 'Unit | Service | accounts', {
    // Specify the other units that are required for this test.
    // needs: ['service:foo']
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it exists', function (assert) {
    var service = this.subject();
    assert.ok(service);
  });
});
define('banker/tests/unit/services/banks-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('service:banks', 'Unit | Service | banks', {
    // Specify the other units that are required for this test.
    // needs: ['service:foo']
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it exists', function (assert) {
    var service = this.subject();
    assert.ok(service);
  });
});
define('banker/tests/unit/services/branch-select-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('service:branch-select', 'Unit | Service | branch select', {
    // Specify the other units that are required for this test.
    // needs: ['service:foo']
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it exists', function (assert) {
    var service = this.subject();
    assert.ok(service);
  });
});
define('banker/tests/unit/services/branches-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('service:branches', 'Unit | Service | branches', {
    // Specify the other units that are required for this test.
    // needs: ['service:foo']
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it exists', function (assert) {
    var service = this.subject();
    assert.ok(service);
  });
});
define('banker/tests/unit/services/dashboard-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('service:dashboard', 'Unit | Service | dashboard', {
    // Specify the other units that are required for this test.
    // needs: ['service:foo']
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it exists', function (assert) {
    var service = this.subject();
    assert.ok(service);
  });
});
define('banker/tests/unit/services/emis-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('service:emis', 'Unit | Service | emis', {
    // Specify the other units that are required for this test.
    // needs: ['service:foo']
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it exists', function (assert) {
    var service = this.subject();
    assert.ok(service);
  });
});
define('banker/tests/unit/services/loans-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('service:loans', 'Unit | Service | loans', {
    // Specify the other units that are required for this test.
    // needs: ['service:foo']
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it exists', function (assert) {
    var service = this.subject();
    assert.ok(service);
  });
});
define('banker/tests/unit/services/notify-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('service:notify', 'Unit | Service | notify', {
    // Specify the other units that are required for this test.
    // needs: ['service:foo']
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it exists', function (assert) {
    var service = this.subject();
    assert.ok(service);
  });
});
define('banker/tests/unit/services/session-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('service:session', 'Unit | Service | session', {
    // Specify the other units that are required for this test.
    // needs: ['service:foo']
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it exists', function (assert) {
    var service = this.subject();
    assert.ok(service);
  });
});
define('banker/tests/unit/services/transactions-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('service:transactions', 'Unit | Service | transactions', {
    // Specify the other units that are required for this test.
    // needs: ['service:foo']
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it exists', function (assert) {
    var service = this.subject();
    assert.ok(service);
  });
});
define('banker/tests/unit/services/users-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('service:users', 'Unit | Service | users', {
    // Specify the other units that are required for this test.
    // needs: ['service:foo']
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it exists', function (assert) {
    var service = this.subject();
    assert.ok(service);
  });
});
require('banker/tests/test-helper');
EmberENV.TESTS_FILE_LOADED = true;
//# sourceMappingURL=tests.map
