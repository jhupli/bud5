import {HOST} from './axios';
var request = require('sync-request');

const CONSTANTS_REFRESH = 'CONSTANTS_REFRESH'
const constantsRefreshAction = (constants) => ({
    type: CONSTANTS_REFRESH,
    payload: {
    	"refreshTime" : (new Date()).getTime(),
        "constants": constants
    }
})

var constants = {}

const invalidate = (id, dispatch) => {
	constants[id] = null
	get_constants(id, dispatch)
}

const get_constants = (id, dispatch) => {
	    if(!constants[id]) {
	    	var res = request('GET', HOST + 'constants?id=' + id + '&ts='+Date.now());
	    	//TODO what if fails?
	    	var json = JSON.parse(res.getBody('utf8'));
	        constants[id] = json
	    }
	    dispatch(constantsRefreshAction(constants))
	    return null;
}
 
export {
    get_constants,
    invalidate
}