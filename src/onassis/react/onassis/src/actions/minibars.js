import {axios_get_params} from './axios';

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
    (dispatch) => {
    	prev_cat = cat
        dispatch(balancesRequestAction())
        axios_get_params('minibars?ts='+Date.now(), 
        		{ 
        			params: {"cat": cat}
        		},
        		response => {
//                console.log(response);
        			var ret = {
        					"data": response.data,
        					balance: 0
        			}
        			dispatch(balancesResponseAction(ret))
        		},
        		dispatch
        )
    }
)


const balances_refresh = () => (
	balances_load(prev_cat)
)

export {
    balances_load,
    balances_refresh
}