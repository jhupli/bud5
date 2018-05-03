const reducer = (state = [], action) => {
 // console.log("accounts reducer: "+action.type)
  switch (action.type) {
    case "ACCOUNTS_REQUEST":
      //console.log("handling ACCOUNTS_REQUEST")
      return Object.assign({}, state, {
         fetching: true
    })
    case "ACCOUNTS_RESPONSE":
      //console.log("handling ACCOUNTS_RESPONSE")
      return Object.assign({}, state, {
    	 fetching: false,
         accounts: action.payload.accounts,
       })
    default:
      return state
  }
}

export default reducer