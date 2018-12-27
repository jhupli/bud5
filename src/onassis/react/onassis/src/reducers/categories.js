const reducer = (state = [], action) => {
 // console.log("accounts reducer: "+action.type)
  switch (action.type) {
    case "CATEGORIES_REQUEST":
      //console.log("handling CATEGORIES_REQUEST")
      return Object.assign({}, state, {
         fetching: true
    })
    case "CATEGORIES_RESPONSE":
      //console.log("handling CATEGORIES_RESPONSE")
      return Object.assign({}, state, {
    	 fetching: false,
         categories: action.payload.categories,
       })
    default:
      return state
  }
}

export default reducer