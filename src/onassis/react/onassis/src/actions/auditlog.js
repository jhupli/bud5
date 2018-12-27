import {axios_get} from './axios';
	
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
    (dispatch) => {
        dispatch(auditlogRequestAction())
        axios_get('history?ts='+Date.now(),
           response => {
        	   var lastPage = true
               if(response.data.length === (PAGE_SIZE + 1)) {
            	   lastPage = false
            	   response.data.pop()
               }
               dispatch(auditlogResponseAction(response.data, true, lastPage))
           },
           dispatch
       )
    }
 )

const next = (s) => (
    (dispatch) => {
        dispatch(auditlogRequestAction(s))
        axios_get('history?ts='+Date.now()+"&s="+s,
            response  => {
               var lastPage = true
               if(response.data.length === (PAGE_SIZE + 1)) {
            	   lastPage = false
            	   response.data.pop()
               }
               dispatch(auditlogResponseAction(response.data, false, lastPage))
            },
            dispatch
        )
    }
 )
 
 const prev = (e) => (
	(dispatch) => {
        dispatch(auditlogRequestAction(e))
        axios_get('history?ts='+Date.now()+"&e="+e,
            response => {
               var firstPage = true
               if(response.data.length === (PAGE_SIZE + 1)) {
            	   firstPage = false
            	   response.data.shift()
               }
               dispatch(auditlogResponseAction(response.data, firstPage, false))
            },
            dispatch
        )
    }
 )

export {
    load,
    next,
    prev
}