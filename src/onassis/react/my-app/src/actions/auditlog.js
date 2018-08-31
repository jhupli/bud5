import axios from 'axios';
	
const AUDITLOG_REQUEST = 'AUDITLOG_REQUEST'
const auditlogRequestAction = () => ({
    type: AUDITLOG_REQUEST
})

const AUDITLOG_RESPONSE = 'AUDITLOG_RESPONSE'
const auditlogResponseAction = (entries) => ({
    type: AUDITLOG_RESPONSE,
    payload: {
        "logentries": entries
    }
})

 const load = () => (
    (dispatch: Redux.Dispatch) => {
        dispatch(auditlogRequestAction())
        axios.get('http://localhost:8080/history?ts='+Date.now())
            .then(function(response) {
               dispatch(auditlogResponseAction(response.data))
            })
            .catch(function(error) {
                console.log("TODO____________________")
                console.log(error)
            }
        )
    }
 )
export {
    load
}