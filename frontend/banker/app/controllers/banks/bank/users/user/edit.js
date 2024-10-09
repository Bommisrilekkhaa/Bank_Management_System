import Ember from 'ember';

export default Ember.Controller.extend({
    usersService: Ember.inject.service('users'),
    statuses: ['active', 'inactive','pending'],

    actions:{

        submitForm() {
            
            if (!this.get('fullname') || !this.get('date_of_birth') || !this.get('user_address') || !this.get('user_phonenumber') ) {
                this.set('errorMessage', 'All fields are required');
                return;
              }
              
              if (this.get('user_phonenumber').length !== 10 || isNaN(this.get('user_phonenumber'))) {
                this.set('errorMessage', 'Please enter a valid 10-digit phone number.');
                return;
              }
            
      
            if (!this.get('statuses').includes(this.get('user_status'))) {
              this.set("errorMessage", 'Please select a valid status.');
              return;
            }

            const userData = {
                userId: this.get('userId'),
                fullname: this.get('fullname'),
                username: this.get('username'),
                user_role: this.get('user_role'),
                date_of_birth: this.get('date_of_birth'),
                user_phonenumber: this.get('user_phonenumber'),
                user_address: this.get('user_address'),
                user_status: this.get('user_status')
              };

              this.get('usersService').updateUser(userData).then(() => {
                console.log("User updated successfully!");
                this.resetForm();
                this.transitionToRoute('banks.bank.users',localStorage.getItem("bankId"));
              }).catch((error) => {
                console.error('Error updating user:', error);
              });
        },
      
        toUsers()
        {
            this.transitionToRoute("banks.bank.users",localStorage.getItem("bankId"));
        }
      }
});
