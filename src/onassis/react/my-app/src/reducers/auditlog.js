const reducer = (state = [], action) => {
 // console.log("accounts reducer: "+action.type)
  switch (action.type) {
    case "AUDITLOG_REQUEST":
      console.log("handling AUDITLOG_REQUEST")
      return Object.assign({}, state, {
         fetching: true
    })
    case "AUDITLOG_RESPONSE":
      console.log("handling AUDITLOG_RESPONSE")
      return Object.assign({}, state, {
    	 fetching: false,
         accounts: action.auditlog.logentries,
       })
    default:
      return state
  }
}

export default reducer