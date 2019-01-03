const reducer = (state = [], action) => {
 // console.log("pie reducer: "+action.type)
  switch (action.type) {
    case 'PIE_REQUEST':
      //console.log("handling PIE_REQUEST")
      return Object.assign({}, state, {
         fetching: true
    })
    case 'PIE_RESPONSE':
        //console.log("handling PIE_RESPONSE")
        return Object.assign({}, state, {
            slices: action.payload.slices,
            fetching: false
          })
    case 'PIE_REDRAW':
        //console.log("handling PIE_REDRAW")
        return Object.assign({}, state, {
            redraw: action.payload.redraw,
        })
    default:
      return state
  }
}
export default reducer