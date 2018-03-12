const reducer = (state = [], action) => {
 // console.log("chart reducer: "+action.type)
  switch (action.type) {
    case 'CHART_RESPONSE':
        console.log("handling CHART_RESPONSE")
        return Object.assign({}, state, {
            curves: action.payload.curves,
          })        
    default:
      return state
  }
}
export default reducer