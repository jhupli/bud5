import {axios_get, axios_post} from './axios';
import { chart_refresh } from './chart'
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
    (dispatch) => {
        dispatch(accountsUpdateRequestAction(updates))
        axios_post('acc/update', updates,
            response => {
               dispatch(accountsUpdateResponseAction())
               dispatch(load())
               invalidate(ACCOUNT, dispatch)
               dispatch(chart_refresh())
            },
            dispatch
        )
    }
 )

 const load = () => (
    (dispatch) => {
        dispatch(accountsRequestAction())
        axios_get('acc/list',
          null,
            response => {
               dispatch(accountsResponseAction(response.data))
            },
            dispatch
        )
    }
 )
 
export {
	ACCOUNT,
    load,
    update
}