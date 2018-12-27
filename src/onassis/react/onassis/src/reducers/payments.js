const reducer = (state = [], action) => {
 // console.log("payments reducer: "+action.type)
  switch (action.type) {
    case "PAYMENTS_REQUEST":
      console.log("handling PAYMENTS_REQUEST")
      return Object.assign({}, state, {
         fetching: true
    })
    case "PAYMENTS_RESPONSE":
      console.log("handling PAYMENTS_RESPONSE")
      //console.log(action)
      return Object.assign({}, state, {
    	 fetching: false,
    	 queryType: action.payload.queryType, 
    	 params: action.payload.params,
         payments: action.payload.payments,
         balances: action.payload.balances
       })
    default:
      return state
  }
}

export default reducer