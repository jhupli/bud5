const reducer = (state = [], action) => {
  //console.log("payments reducer: "+action.type)
  switch (action.type) {
    case "PAYMENTS_REQUEST":
    case "PAYMENTS_UPDATE_REQUEST":
      return Object.assign({}, state, {
         fetching: true
    })
    case "PAYMENTS_RESPONSE":
      //console.log(action)
      return Object.assign({}, state, {
    	 fetching: false,
    	    queryType: action.payload.queryType,
    	    params: action.payload.params,
         payments: action.payload.payments,
         balances: action.payload.balances,
         historystack: action.payload.historystack
       })
    default:
      return state
  }
}

export default reducer