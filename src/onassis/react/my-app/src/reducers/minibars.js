const reducer = (state = [], action) => {
  //console.log("minibars reducer: "+action.type)
  switch (action.type) {
    case 'MINIBARS_RESPONSE':
//        console.log("handling MINIBARS_RESPONSE")
        return Object.assign({}, state, {
            balances: action.payload.balances
          })        
    default:
      return state
  }
}
export default reducer