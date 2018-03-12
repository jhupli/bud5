const reducer = (state = [], action) => {
  //console.log("payment reducer: "+action.type)
  switch (action.type) {
    case 'LOCK_PAYMENT_RESPONSE':
     // console.log("handling LOCK_PAYMENT_RESPONSE")
      return Object.assign({}, state, {
    	  payment: action.payload.payment,
        //locked: action.payload.locked
       })
    case 'LOCK_PAYMENT_REQUEST':
       // console.log("handling LOCK_PAYMENT_REQUEST")
        return Object.assign({}, state, {
      	lock_payment_request: action.payload.lock_payment_request,
          locked: action.payload.locked
         })       
    case 'PAYMENT_SELECTION':
        //console.log("handling PAYMENT_SELECTION")
        return Object.assign({}, state, {
        	payments: action.payload.payments
        }) 
    default:
      return state
  }
}

export default reducer