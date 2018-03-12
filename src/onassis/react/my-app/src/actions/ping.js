import axios from 'axios'

const PING_REQUEST = 'PING_REQUEST'
const PingRequestAction = () => {
    return {
        type: PING_REQUEST
    }
}

const PING_RESPONSE = 'PING_RESPONSE'
const PingResponseAction = (status) => {
    return {
        type: 'PING_RESPONSE',
        payload: {
            up: status
        }
    }
}

const ping = () => (
    (dispatch: Redux.Dispatch) => {
        dispatch(PingRequestAction())
        axios.get('http://localhost:8080/ping?ts='+Date.now(), {
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
    (dispatch: Redux.Dispatch) => {
				dispatch(PingResponseAction(false))
    }
 )

    

 export {
    ping,
    noping
}