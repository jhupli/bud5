const reducer = (state = [], action) => {
 // console.log("group reducer: "+action.type)
  switch (action.type) {
    case "NEW_GROUP_REQUEST":
      //console.log("handling NEW_GROUP_REQUEST")
      return Object.assign({}, state, {
         fetching: true
    })
    case "NEW_GROUP_RESPONSE":
      //console.log("handling NEW_GROUP_RESPONSE")
      return Object.assign({}, state, {
    	 fetching: false,
         g: action.payload.g,
       })
    default:
      return state
  }
}

export default reducer