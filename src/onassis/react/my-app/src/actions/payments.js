import axios from 'axios';
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
    (dispatch: Redux.Dispatch) => {
        dispatch(paymentsUpdateRequestAction(updates))
        axios.post('http://localhost:8080/payments/update', updates)
            .then(function(response) {
                dispatch(paymentsUpdateResponseAction())
                //tähän kaikki refrhesit, jotka update aiheuttaa
                                //refresh pie and minibars
               dispatch(payments_refresh())
               dispatch(pie_refresh())
               dispatch(balances_refresh())
               dispatch(chart_refresh())
            })
            .catch(function(error) {
                console.log("TODO____________________")
                console.log(error)
            }
        )
    }
 )

function get(dispatch) {
    dispatch(paymentsRequestAction())
    axios.get('http://localhost:8080/payments?ts='+Date.now(), {
        port: 8080,
        "params": params
    })
    .then(function(response) {
        dispatch(paymentsResponseAction(response.data[0], response.data[1]))
    })
    .catch(function(error) {
        console.log("TODO____________________")
            console.log(error)
    })
}

const day_load = (d) => (
    (dispatch: Redux.Dispatch) => {
        params = {
            "e": "d",
            "d": dateFormat(d, "yyyy-mm-dd")
        }
        get(dispatch)
    }
)

const account_load = (a, d1, d2) => (
    (dispatch: Redux.Dispatch) => {
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
    (dispatch: Redux.Dispatch) => {
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
    (dispatch: Redux.Dispatch) => {
        params = {
            "e": "g",
            "g": g
        }
        get(dispatch)
    }
)

const list_load = (ids) => (
    (dispatch: Redux.Dispatch) => {
        params = {
            "e": "l",
            "ids": ids
        }
        get(dispatch)
    }
)

const payments_refresh = () => (
    (dispatch: Redux.Dispatch) => {
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