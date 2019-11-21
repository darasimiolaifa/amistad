const isEmpty = (string) => {
  if (string.trim() === '') return true;
  else return false;
}

const isEmail = (email) => {
  const regEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (email.match(regEx)) return true;
  else return false;
}

const emptyErrorMessage = 'Must not be empty';

exports.validateSignupData = (data) => {
  let errors = {};
    
    if (isEmpty(data.email)) errors.email = emptyErrorMessage;
    else if (!isEmail(data.email)) errors.email = 'Must be a valid email';
    if(isEmpty(data.password)) errors.password = emptyErrorMessage;
    else if (data.password !== data.confirmPassword) errors.confirmPassword = 'Passwords must match.'
    if (isEmpty(data.handle)) errors.handle = emptyErrorMessage;
    
    return {
      errors,
      valid: Object.keys(errors).length === 0
    }
}

exports.validateLoginData = (data) => {
  let errors = {};
  
  if (isEmpty(data.email)) errors.email = emptyErrorMessage;
  if (isEmpty(data.password)) errors.password = emptyErrorMessage;
  
  return {
    errors,
    valid: Object.keys(errors).length === 0
  }
}