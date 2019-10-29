import {HOST} from './axios';
//var request = require('sync-request');
import request from 'then-request';

const CONSTANTS_REFRESH = 'CONSTANTS_REFRESH'
const constantsRefreshAction = (constants) => ({
    type: CONSTANTS_REFRESH,
    payload: {
    	"refreshTime" : (new Date()).getTime(),
        "constants": constants
    }
})

var constants = {}
var fetching = {}

const invalidate = (id, dispatch) => {
	constants[id] = null
	fetching[id] = null
	get_constants(id, dispatch)
}

// async function defined
async function makeSynchronousRequest(id) {
	try {
		// http_promise is a Promise
		// "response_body" will hold the response if the Promise is resolved
		let res = await request('GET', HOST + 'constants?id=' + id + '&ts='+Date.now());
		debugger;
		//return res
	}
	catch(e) {
		// if the Promise is rejected
		console.error(e);
	}
}
/*const get_constants = (id, dispatch) => {
	    if(!constants[id]) {
	    	var res = request('GET', HOST + 'constants?id=' + id + '&ts='+Date.now());
	    	//TODO what if fails?
	    	var json = JSON.parse(res.getBody('utf8'));
	        constants[id] = json
	    }
	    dispatch(constantsRefreshAction(constants))
	    return null;
}*/
const get_constants = (id, dispatch) => {
        //console.log("GET: "+ id);
	    if(!constants[id] && !fetching[id] ) {
	        fetching[id] = true;
	        //console.log("FETCHING START: "+ id);
	    	//var res = request('GET', HOST + 'constants?id=' + id + '&ts='+Date.now());
            //var res = makeSynchronousRequest(id);
	    	request('GET', HOST + 'constants?id=' + id + '&ts='+Date.now()).done((res) => {
	    	  //console.log("FETCHIN END: "+ id);
	    	  //debugger
              //console.log(res.getBody());
              var json = JSON.parse(res.getBody('utf8'));
              constants[id] = json
              dispatch(constantsRefreshAction(constants))
            });
	    } else {
	        //console.log("IS OR FETCHING: "+ id);
	        if(constants[id]) {
	            //console.log("FOUND: " + id);
	            dispatch(constantsRefreshAction(constants))
	            return null;
	        }
	        //console.log("SKIP: " + id);
	        return null;
	    }
}
 
export {
    get_constants,
    invalidate
}