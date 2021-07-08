const reducer = (state = [], action) => {
  //console.log("chart reducer: "+action.type)
  switch (action.type) {
    case 'CHART_REQUEST':
      return Object.assign({}, state, {
         fetching: true
    })
    case 'CHART_RESPONSE':
        return Object.assign({}, state, {
            curves: action.payload.curves,
            fetching: false
    }) 
    case 'CHART_NEXTDAY':
        //console.log("handling CHART_NEXTDAY")
        return Object.assign({}, state, {
            nextday: action.payload.nextday,
          })
    case 'CHART_PREVDAY':
        //console.log("handling CHART_PREVDAY")
        return Object.assign({}, state, {
            prevday: action.payload.prevday,
          })  
    case 'CHART_TODAY':
        //console.log("handling CHART_TODAY")
        return Object.assign({}, state, {
            today: action.payload.today,
            queryType: 'd'
          })
    case 'CHART_REDRAW':
        //console.log("handling CHART_REDRAW")
        return Object.assign({}, state, {
            redraw: action.payload.redraw,
        })
    default:
      return state
  }
}
export default reducer