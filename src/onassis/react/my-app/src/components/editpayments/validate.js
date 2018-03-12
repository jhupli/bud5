const validate = values => {
  const errors = {}
  console.log("**validate")
  if (!values.payments || !values.payments.length) {
    errors.payments = { _error: 'At least one payment must be entered' }
  } else {
    const paymentsArrayErrors = []
    values.payments.forEach((payment, paymentIndex) => {
      const paymentErrors = {}
      if (!payment || !payment.d) {
        paymentErrors.d = 'Required'
        paymentsArrayErrors[paymentIndex] = paymentErrors
      }
      if (!payment || !payment.i) {
          paymentErrors.i = 'Required'
          paymentsArrayErrors[paymentIndex] = paymentErrors
      }
      if (!payment || payment.c  == null) {
          paymentErrors.c = 'Required'
          paymentsArrayErrors[paymentIndex] = paymentErrors
      }
      if (!payment || payment.a == null) {
          paymentErrors.a = 'Required'
          paymentsArrayErrors[paymentIndex] = paymentErrors
      }
      if (!payment || payment.s == null) {
          paymentErrors.s = 'Required'
          paymentsArrayErrors[paymentIndex] = paymentErrors
      }
      return paymentErrors
    })
    if(paymentsArrayErrors.length) {
      errors.payments = paymentsArrayErrors
    }
  }
  return errors
}

export default validate
