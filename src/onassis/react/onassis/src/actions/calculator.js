const CALC_ADD_REQUEST = 'CALC_ADD_REQUEST'
const calcAddRequestAction = (p) => ({
    type: CALC_ADD_REQUEST,
    payload: {
        "p": p
    }
})

 const calc_add = (p) => (
    (dispatch) => {
        dispatch(calcAddRequestAction(p))
    }
 )
 
export {
    calc_add
}