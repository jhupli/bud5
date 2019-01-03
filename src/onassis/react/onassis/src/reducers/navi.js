const reducer = (state = [], action) => {
 // console.log("chart reducer: "+action.type)
  switch (action.type) {
    case 'SHOW_VIEW':
        //console.log("handling SHOW_VIEW")
        return Object.assign({}, state, {
            view: action.payload.view,
          })        
    default:
      return state
  }
}
export default reducer