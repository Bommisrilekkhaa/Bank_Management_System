import Ember from 'ember';

export default Ember.Component.extend({
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
        showEmiModal(loanDetails) {
           

            if (loanDetails) {
                let loanAmount = loanDetails.loan_amount;
                let interestRate = loanDetails.loan_interest;
                let tenureMonths = loanDetails.loan_duration;
                let loanAvailedDate = loanDetails.loan_availed_date;

                let emiSchedule = this.calculateEMI(loanAmount, interestRate, tenureMonths, loanAvailedDate);
                this.set('emiSchedule', emiSchedule);
                this.set('selectedLoanId',loanDetails.loan_id);
                this.set('emi', emiSchedule[0]);
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
