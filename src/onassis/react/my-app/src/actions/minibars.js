import axios from 'axios';

const MINIBARS_REQUEST = 'MINIBARS_REQUEST'
const balancesRequestAction = () => ({
    type: MINIBARS_REQUEST,
    payload: null
})

const MINIBARS_RESPONSE = 'MINIBARS_RESPONSE'
const balancesResponseAction = (response) => ({
    type: MINIBARS_RESPONSE,
    payload: {
        balances: response
    }
})

var prev_cat = 0

const balances_load = (cat) => (
    (dispatch: Redux.Dispatch) => {
    	prev_cat = cat
        dispatch(balancesRequestAction())
        axios.get('http://localhost:8080/calc?ts='+Date.now(), {
                port: 8080,
                params: {
                    "cat": cat
                }
            })
            .then(function(response) {
//                console.log(response);
                var ret = {
                    "data": response.data,
                    balance: 0
                }
                dispatch(balancesResponseAction(ret))
            })
            .catch(function(error) {
                console.log("TODO____________________");
                console.log(error);
            })
    }
)

const balances_refresh = () => (
	balances_load(prev_cat)
)

export {
    balances_load,
    balances_refresh
}