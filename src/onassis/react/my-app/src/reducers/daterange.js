const reducer = (state = [], action) => {
  //console.log("dateRange reducer: "+action.type)
  switch (action.type) {
    case 'DATE_RANGE_SELECTED':
      //console.log("handling DATE_RANGE_SELECTED")
      return Object.assign({}, state, {
          s: action.payload.s,
          e: action.payload.e
        })
    default:
      return state
  }
}
export default reducer