const reducer = (state = [], action) => {
  //console.log("minibars reducer: "+action.type)
  switch (action.type) {
    case 'MINIBARS_REQUEST':
      console.log("handling MINIBARS_REQUEST")
      return Object.assign({}, state, {
         fetching: true
    })
    case 'MINIBARS_RESPONSE':
//        console.log("handling MINIBARS_RESPONSE")
        return Object.assign({}, state, {
            balances: action.payload.balances,
            fetching: false
          }) 
    case 'MINIBARS_REDRAW':
        //console.log("handling MINIBARS_REDRAW")
        return Object.assign({}, state, {
            redraw: action.payload.redraw,
        })
    default:
      return state
  }
}
export default reducer