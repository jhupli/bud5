import axios from 'axios'
import {HOST} from './axios'

const VERSIONINFO_REQUEST = 'VERSIONINFO_REQUEST'
const VersionInfoRequestAction = () => {
    return {
        type: VERSIONINFO_REQUEST
    }
}

const VERSIONINFO_RESPONSE = 'VERSIONINFO_RESPONSE'
const VersionInfoResponseAction = (version) => {
    return {
        type: VERSIONINFO_RESPONSE,
        payload: {
            'version': version
        }
    }
}

const versionInfo = () => (
    (dispatch) => {
        dispatch(VersionInfoRequestAction())
        axios.get(HOST + 'version?ts='+Date.now(), {
                port: 8080
            })
            .then(function(response) {
                dispatch(VersionInfoResponseAction(response.data))
            })
            .catch(function(error) {
				dispatch(VersionInfoResponseAction('Unavailable'))
            }
        )
    }
 )

 export {
    versionInfo
}