const reducer = (state = [], action) => {
 // console.log("versionInfo reducer: "+action.type)
  switch (action.type) {
    case 'VERSIONINFO_RESPONSE':
    	//console.log("handling VERSIONINFO_RESPONSE")
        return Object.assign({}, state, {
            version: action.payload.version
          })        
    default:
      return state
  }
}
export default reducer