const methods = {
    GET:'GET',
    POST:'POST',
    PUT:'PUT',
    DELETE:'DELETE'
};
const role = {
    ADMIN: 'ADMIN',
    MANAGER: 'MANAGER',
    CUSTOMER: 'CUSTOMER',
    SUPERADMIN:'SUPERADMIN'
};

const status = {
    PENDING: 'pending',
    ACTIVE: 'active',
    INACTIVE: 'inactive'
};

const accountType = {
    SAVINGS: 'savings',
    BUSINESS: 'business'
};

const loanStatus = {
    APPROVED: 'approved',
    CLOSED: 'closed',
    PENDING: 'pending',
    REJECTED: 'rejected'
};

const loanType = {
    BUSINESSLOAN: 'businessloan',
    HOMELOAN: 'homeloan',
    EDUCATIONLOAN: 'educationloan'
};

const transactionStatus = {
    PENDING: 'pending',
    SUCCESS: 'success'
};

const transactionType = {
    DEBIT: 'debit',
    CREDIT: 'credit',
    EMI:'emi'
};

let getSessionData = () => {
    let value = `; ${document.cookie}`;
    let parts = value.split(`; sessionData=`);
    if (parts.length === 2) {
      let cookieData = decodeURIComponent(parts.pop().split(';').shift());
      return JSON.parse(cookieData);
    }
    return null;
  };
export { role, status, accountType, loanStatus, loanType, transactionStatus, transactionType,methods,getSessionData };
