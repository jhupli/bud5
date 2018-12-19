import axios from 'axios';
	
const AUDITLOG_REQUEST = 'AUDITLOG_REQUEST'
const auditlogRequestAction = () => ({
    type: AUDITLOG_REQUEST
})

const AUDITLOG_RESPONSE = 'AUDITLOG_RESPONSE'
const auditlogResponseAction = (entries, fp, lp) => ({
    type: AUDITLOG_RESPONSE,
    payload: {
        "logentries": entries,
        "firstpage": fp,
        "lastpage": lp
    }
})

const PAGE_SIZE = 50
//NOTE Backend should return always PAGE_SIZE + 1 so, we can detect last/first -page
 const load = () => (
    (dispatch: Redux.Dispatch) => {
        dispatch(auditlogRequestAction())
        axios.get('http://localhost:8080/history?ts='+Date.now())
            .then(function(response) {
            	var lastPage = true
               if(response.data.length === (PAGE_SIZE + 1)) {
            	   lastPage = false
            	   response.data.pop()
               }
               dispatch(auditlogResponseAction(response.data, true, lastPage))
            })
            .catch(function(error) {
                console.log("TODO____________________")
                console.log(error)
            }
        )
    }
 )

const next = (s) => (
    (dispatch: Redux.Dispatch) => {
        dispatch(auditlogRequestAction(s))
        axios.get('http://localhost:8080/history?ts='+Date.now()+"&s="+s)
            .then(function(response) {
               var lastPage = true
               if(response.data.length === (PAGE_SIZE + 1)) {
            	   lastPage = false
            	   response.data.pop()
               }
               dispatch(auditlogResponseAction(response.data, false, lastPage))
            })
            .catch(function(error) {
                console.log("TODO____________________")
                console.log(error)
            }
        )
    }
 )
 
 const prev = (e) => (
 (dispatch: Redux.Dispatch) => {
        dispatch(auditlogRequestAction(e))
        axios.get('http://localhost:8080/history?ts='+Date.now()+"&e="+e)
            .then(function(response) {
               var firstPage = true
               if(response.data.length === (PAGE_SIZE + 1)) {
            	   firstPage = false
            	   response.data.shift()
               }
               dispatch(auditlogResponseAction(response.data, firstPage, false))
            })
            .catch(function(error) {
                console.log("TODO____________________")
                console.log(error)
            }
        )
    }
 )
export {
    load,
    next,
    prev
}