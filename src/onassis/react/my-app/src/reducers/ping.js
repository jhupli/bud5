const reducer = (state = [], action) => {
 // console.log("ping reducer: "+action.type)
  switch (action.type) {
    case 'PING_RESPONSE':
    	//console.log("handling PING_RESPONSE")
        return Object.assign({}, state, {
            up: action.payload.up,
          })        
    default:
      return state
  }
}
export default reducer