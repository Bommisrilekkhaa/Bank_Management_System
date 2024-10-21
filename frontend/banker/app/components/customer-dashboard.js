import Ember from 'ember';

export default Ember.Component.extend({
    dashboardService: Ember.inject.service('dashboard'),
    init()
    {
        this._super(...arguments);
        this.get('dashboardService').fetchCustomerDashboard().then((response) => {
        console.log(response);
             
        let accounts = [];
        for (let i = 0; i < response.length; i++) {
            let account = response[i];
                let accountData = {
                    acc_no: account.acc_no,
                    acc_type: account.acc_type,
                    acc_balance: account.acc_balance,
                    acc_status: account.acc_status
                };

                let loanDetails = account.loan_details || null; 
                let transactions = account.transactions || [];

               
                accounts.push({
                    account: accountData,
                    loan_details: loanDetails,
                    transactions: transactions
                });
            }

          
            this.set('accountList', accounts);

          }).catch((error) => {
            console.error("Failed to load dashboard:", error);
          });
    },

    calculateEMI(loanAmount, interestRate, tenureMonths, loanAvailedDate) {
        let monthlyInterestRate = interestRate / 12 / 100;
        let emiAmount = (loanAmount * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, tenureMonths)) 
                        / (Math.pow(1 + monthlyInterestRate, tenureMonths) - 1);
        emiAmount = Math.round(emiAmount);
        let emiSchedule = [];
        let currentPaymentDate = new Date(loanAvailedDate);

        for (let i = 1; i <= tenureMonths; i++) {
            currentPaymentDate.setMonth(currentPaymentDate.getMonth() + 1);
            emiSchedule.push({
                emiNumber: i,
                toBePaidDate: new Date(currentPaymentDate), 
                actualPaidDate: null, 
                emiAmount: emiAmount
            });
        }

        return emiSchedule;
    },
    actions: {
        showEmiModal(loanId) {
            let account = this.get('accountList').find(accountItem => {
                return accountItem.loan_details && accountItem.loan_details.loan_id === loanId;
            });
    
            if (account && account.loan_details) {
                let loanDetails = account.loan_details;
                let loanAmount = loanDetails.loan_amount;
                let interestRate = loanDetails.loan_interest;
                let tenureMonths = loanDetails.loan_duration;
                let loanAvailedDate = loanDetails.loan_availed_date;
    
                let emiSchedule = this.calculateEMI(loanAmount, interestRate, tenureMonths, loanAvailedDate);
                this.set('emiSchedule', emiSchedule);
                this.set('selectedLoanId', loanId);
                this.set('emi',emiSchedule[0]);
                document.getElementById('emiModal').style.display = 'flex';
            } else {
                console.error("Loan details not found for the selected loan ID");
            }
        },
    
        closeEmiModal() {
            document.getElementById('emiModal').style.display = 'none';
        }
    }
    
      
});
