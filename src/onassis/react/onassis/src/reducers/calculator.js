const reducer = (state = [], action) => {
 // console.log("group reducer: "+action.type)
  switch (action.type) {
    case "CALC_ADD_REQUEST":
      //console.log("handling CALC_ADD_REQUEST")
      return Object.assign({}, state, {
         p: action.payload.p,
         ts: Date.now()
       })
    default:
      return state
  }
}

export default reducer