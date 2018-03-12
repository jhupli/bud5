import axios from 'axios';
//import { balances_load } from '../actions/minibars'
import { chart_refresh } from './chart'
import { pie_refresh } from './pie'
import { payments_refresh } from './payments'
import { invalidate } from './constants'

const ACCOUNT = 'acc'
	
const ACCOUNTS_REQUEST = 'ACCOUNTS_REQUEST'
const accountsRequestAction = () => ({
    type: ACCOUNTS_REQUEST
})

const ACCOUNTS_RESPONSE = 'ACCOUNTS_RESPONSE'
const accountsResponseAction = (accounts) => ({
    type: ACCOUNTS_RESPONSE,
    payload: {
        "accounts": accounts
    }
})

const ACCOUNTS_UPDATE_REQUEST = 'ACCOUNTS_UPDATE_REQUEST'
const accountsUpdateRequestAction = (updates) => ({
    type: ACCOUNTS_UPDATE_REQUEST,
    payload: {
    	"updates": updates
    }
})

const ACCOUNTS_UPDATE_RESPONSE = 'ACCOUNTS_UPDATE_RESPONSE'
const accountsUpdateResponseAction = () => ({
    	type: ACCOUNTS_UPDATE_RESPONSE
})

const update = (updates) => (
    (dispatch: Redux.Dispatch) => {
        dispatch(accountsUpdateRequestAction(updates))
        axios.post('http://localhost:8080/acc/update', updates)
            .then(function(response) {
               dispatch(accountsUpdateResponseAction())
               dispatch(load())
               invalidate(ACCOUNT, dispatch)
               dispatch(chart_refresh())
               
             //  dispatch(payments_refresh())
             //  dispatch(pie_refresh())
               //dispatch(balances_load())
               //dispatch(chart_refresh())
            })
            .catch(function(error) {
                console.log("TODO____________________")
                console.log(error)
            }
        )
    }
 )

 const load = () => (
    (dispatch: Redux.Dispatch) => {
        dispatch(accountsRequestAction())
        axios.get('http://localhost:8080/acc/list?ts='+Date.now())
            .then(function(response) {
               dispatch(accountsResponseAction(response.data))
            })
            .catch(function(error) {
                console.log("TODO____________________")
                console.log(error)
            }
        )
    }
 )
export {
	ACCOUNT,
    load,
    update
}