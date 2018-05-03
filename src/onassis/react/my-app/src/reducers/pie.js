const reducer = (state = [], action) => {
 // console.log("pie reducer: "+action.type)
  switch (action.type) {
    case 'PIE_RESPONSE':
        //console.log("handling PIE_RESPONSE")
        return Object.assign({}, state, {
            slices: action.payload.slices,
          })        
    default:
      return state
  }
}
export default reducer