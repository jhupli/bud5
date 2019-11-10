import {axios_get_params} from './axios';
import { balances_refresh } from '../actions/minibars'

const LOCK_PAYMENT_REQUEST = 'LOCK_PAYMENT_REQUEST'
const lockPaymentRequestAction = (lock_payment_request, locked) => {
    return {
        type: LOCK_PAYMENT_REQUEST,
        payload: {
            lock_payment_request: lock_payment_request,
            locked: locked
        }
    }
}

const LOCK_PAYMENT_RESPONSE = 'LOCK_PAYMENT_RESPONSE'
const lockPaymentResponseAction = (payment, locked) => {
    return {
        type: LOCK_PAYMENT_RESPONSE,
        payload: {
            payment: payment
        }
    }
}

const lock_payment = (payment, locked) => (
    (dispatch) => {
        dispatch(lockPaymentRequestAction(payment, locked))
        axios_get_params('lock',
        		{
                	params: {
                		"id": payment,
                		"l": locked
                	}
        		},
        		response => {
        			dispatch(lockPaymentResponseAction(payment, locked))
        			console.log('ref')
        			dispatch(balances_refresh())
                //DO NOT dispatch(payments_refresh()) : it will refresh possibly unsubmitted payments, 
                
        		},
        		dispatch
        )
    }
 )
    
const PAYMENT_SELECTION = 'PAYMENT_SELECTION'
const paymentSelectionAction = (payments) => {
    return {
        type: PAYMENT_SELECTION,
        payload: {
            "payments": payments
        }
    }
}

const payment_selection = (payments) => (
    (dispatch) => {
        dispatch(paymentSelectionAction(payments))
    }
)

 export {
    lock_payment,
    payment_selection
}