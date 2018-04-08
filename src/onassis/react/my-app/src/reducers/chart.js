const reducer = (state = [], action) => {
  //console.log("chart reducer: "+action.type)
  switch (action.type) {
    case 'CHART_RESPONSE':
        console.log("handling CHART_RESPONSE")
        return Object.assign({}, state, {
            curves: action.payload.curves,
          }) 
    case 'CHART_NEXTDAY':
        console.log("handling CHART_NEXTDAY")
        return Object.assign({}, state, {
            nextday: action.payload.nextday,
          })
    case 'CHART_PREVDAY':
        console.log("handling CHART_PREVDAY")
        return Object.assign({}, state, {
            prevday: action.payload.prevday,
          })  
    case 'CHART_TODAY':
        console.log("handling CHART_TODAY")
        return Object.assign({}, state, {
            today: action.payload.today,
          }) 
    default:
      return state
  }
}
export default reducer