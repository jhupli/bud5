const reducer = (state = [], action) => {
  switch (action.type) {
    case 'NEXTDAY':
        return Object.assign({}, state, {
            nextday: action.payload.nextday,
          })
    case 'PREVDAY':
        return Object.assign({}, state, {
            prevday: action.payload.prevday,
          })  
    case 'TODAY':
        return Object.assign({}, state, {
            today: action.payload.today,
          })
    default:
      return state
  }
}
export default reducer