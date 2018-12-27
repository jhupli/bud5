const reducer = (state = [], action) => {
 // console.log("constants reducer: "+action.type)
  switch (action.type) {
    case "CONSTANTS_REFRESH":
      //console.log("handling CONSTANTS_REFRESH")
      return Object.assign({}, state, {
    	 refreshTime : action.payload.refreshTime,
         constants: action.payload.constants
       })
       
    default:
      return state
  }
}

export default reducer