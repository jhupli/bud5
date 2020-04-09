import axios from 'axios'
import {HOST} from './axios'

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
        axios.get(HOST+'ping?ts='+Date.now(), {
                port: 8080
            })
            .then(function(response) {
                dispatch(PingResponseAction(true))
            })
            .catch(function(error) {
				dispatch(PingResponseAction(false))
            }
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