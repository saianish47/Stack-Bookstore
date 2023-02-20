function isMobilePhone(phone) {
    
    const digits = phone.replace(/[()\s\-+]/g, '');

    if ( !phone || phone === "" || digits.length !== 10){
        return false
    }
    return true;
}

// From https://github.com/validatorjs
/* eslint-disable max-len */
const creditCard =
  /^(?:4[0-9]{12}(?:[0-9]{3,6})?|5[1-5][0-9]{14}|(222[1-9]|22[3-9][0-9]|2[3-6][0-9]{2}|27[01][0-9]|2720)[0-9]{12}|6(?:011|5[0-9][0-9])[0-9]{12,15}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11}|6[27][0-9]{14}|^(81[0-9]{14,17}))$/;
/* eslint-enable max-len */

function isCreditCard(str) {
  const sanitized = str.replace(/[- ]+/g, "");

  if (!creditCard.test(sanitized)) {
    return false;
  }

  let sum = 0;
  let digit;
  let tmpNum;
  let shouldDouble;

  for (let i = sanitized.length - 1; i >= 0; i--) {
    digit = sanitized.substring(i, i + 1);
    tmpNum = parseInt(digit, 10);

    if (shouldDouble) {
      tmpNum *= 2;

      if (tmpNum >= 10) {
        sum += (tmpNum % 10) + 1;
      } else {
        sum += tmpNum;
      }
    } else {
      sum += tmpNum;
    }

    shouldDouble = !shouldDouble;
  }

  return !!(sum % 10 === 0 ? sanitized : false);
}

function validateCustomer(customer) {

    if (customer.name.length < 4 || customer.name.length > 45){
        return [false, "Invalid Name"];
    }
    else if (customer.address.length< 4  || customer.address.length > 45){
        return [false, "Invalid Address"];
    }
    else if (!isValidDate(customer.ccExpiryMonth, customer.ccExpiryYear)){
        return [false, "Invalid Expiry Date"];
    }
    else if (!isCreditCard(customer.ccNumber)){
        return [false, "Invalid Credit Card"];
    }
    else if (!isMobilePhone(customer.phone)){
        return [false, "Invalid Phone Number"];
    }
    else{
        return [true, "OK"];
    }
}

const date_ob = new Date();
const yr = date_ob.getFullYear();
const month = date_ob.getMonth();
const isValidDate = (ccExpiryMonth, ccExpiryYear) => {
    return ((parseInt(ccExpiryMonth) - 1) > month) && (parseInt(ccExpiryYear) >= yr);
}



export default {validateCustomer}