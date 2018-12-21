import { axios_get } from './axios'

const PING_REQUEST = 'PING_REQUEST'
const PingRequestAction = () => {
    return {
        type: PING_REQUEST
    }
}

const PING_RESPONSE = 'PING_RESPONSE'
const PingResponseAction = (status) => {
    return {
        type: PING_RESPONSE,
        payload: {
            up: status
        }
    }
}

const ping = () => (
    (dispatch) => {
        dispatch(PingRequestAction())
        axios_get('ping?ts='+Date.now(),
        		response => {
        			dispatch(PingResponseAction(true))
        		},
        		dispatch
        )
    }
 )

const noping = () => (
    (dispatch) => {
				dispatch(PingResponseAction(false))
    }
 )

    

 export {
    ping,
    noping
}