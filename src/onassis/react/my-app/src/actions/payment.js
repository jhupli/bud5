import axios from 'axios'

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
    (dispatch: Redux.Dispatch) => {
        dispatch(lockPaymentRequestAction(payment, locked))
        axios.get('http://localhost:8080/lock?ts='+Date.now(), {
                port: 8080,
                params: {
                    "id": payment,
                    "l": locked
                }
            })
            .then(function(response) {
                dispatch(lockPaymentResponseAction(payment, locked))
                //DO NOT dispatch(payments_refresh()) : it will refresh possibly unsubmitted payments, 
                
            })
            .catch(function(error) {
                console.log("TODO____________________")
                console.log(error)
            }
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
    (dispatch: Redux.Dispatch) => {
        dispatch(paymentSelectionAction(payments))
    }
)

 export {
    lock_payment,
    payment_selection
}