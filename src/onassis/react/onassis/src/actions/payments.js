import { axios_get_params, axios_post } from './axios';
import { balances_refresh } from '../actions/minibars'
import { chart_refresh } from '../actions/chart'
import { pie_refresh } from '../actions/pie'

var dateFormat = require('dateformat');

var params = null; //cache for refresh


const PAYMENTS_REQUEST = 'PAYMENTS_REQUEST'
const paymentsRequestAction = () => ({
    type: PAYMENTS_REQUEST
})

const PAYMENTS_RESPONSE = 'PAYMENTS_RESPONSE'
const paymentsResponseAction = (payments, balances) => ({
    type: PAYMENTS_RESPONSE,
    payload: {
    	"params" : params,
    	"queryType" : params.e,
        "payments": payments,
        "balances": balances
    }
})


const PAYMENTS_UPDATE_REQUEST = 'PAYMENTS_UPDATE_REQUEST'
const paymentsUpdateRequestAction = (updates) => ({
    type: PAYMENTS_UPDATE_REQUEST,
    payload: {
    	"updates": updates
    }
})

const PAYMENTS_UPDATE_RESPONSE = 'PAYMENTS_UPDATE_RESPONSE'
const paymentsUpdateResponseAction = () => ({
    	type: PAYMENTS_UPDATE_RESPONSE
})

const update = (updates) => (
    (dispatch) => {
        dispatch(paymentsUpdateRequestAction(updates))
        axios_post('payments/update', 
        		updates,
        		response => {
        			dispatch(paymentsUpdateResponseAction())
        			//tähän kaikki refrhesit, jotka update aiheuttaa
                    //refresh pie and minibars
        			dispatch(payments_refresh())
        			dispatch(pie_refresh())
        			dispatch(balances_refresh())
        			dispatch(chart_refresh())
        		},
        		dispatch
        )
    }
 )

function get(dispatch) {
    dispatch(paymentsRequestAction())
    axios_get_params('payments?ts='+Date.now(), 
    		{
        		"params": params
    		},
    		(response) => {
    			dispatch(paymentsResponseAction(response.data[0], response.data[1]))
    		},
    		dispatch
    )
}

const day_load = (d) => (
    (dispatch) => {
        params = {
            "e": "d",
            "d": dateFormat(d, "yyyy-mm-dd")
        }
        get(dispatch)
    }
)

const account_load = (a, d1, d2) => (
    (dispatch) => {
        params = {
            "e": "a",
            "a": a,
            "d1": dateFormat(d1, "yyyy-mm-dd"),
            "d2": dateFormat(d2, "yyyy-mm-dd")
        }
        get(dispatch)
    }
)

const category_load = (c, d1, d2) => (
    (dispatch) => {
        params = {
            "e": "c",
            "c": c,
            "d1": dateFormat(d1, "yyyy-mm-dd"),
            "d2": dateFormat(d2, "yyyy-mm-dd")
        }
        get(dispatch)
    }
)

const group_load = (g) => (
    (dispatch) => {
        params = {
            "e": "g",
            "g": g
        }
        get(dispatch)
    }
)

const list_load = (ids) => (
    (dispatch) => {
        params = {
            "e": "l",
            "ids": ids
        }
        get(dispatch)
    }
)

const payments_refresh = () => (
    (dispatch) => {
        console.assert(params)
        get(dispatch)
    }
)

export {
    day_load,
    account_load,
    category_load,
    group_load,
    list_load,
    payments_refresh,
    update
}