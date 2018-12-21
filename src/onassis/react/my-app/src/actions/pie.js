import { axios_get_params } from './axios'
var dateFormat = require('dateformat')

const PIE_REQUEST = 'PIE_REQUEST'
const pieRequestAction = (s, e) => ({
    type: PIE_REQUEST,
    payload: {
        's': s,
        'e': e
    }
})

  
const PIE_RESPONSE = 'PIE_RESPONSE'
const pieResponseAction = (response) => (
  { 
	type: PIE_RESPONSE,
    payload: 
    	{
    		slices : response
    	} 
  }
)

var params = null

function get(dispatch) {
    dispatch(pieRequestAction(params.s, params.e));
    axios_get_params('pie?ts='+Date.now(), 
    		{		  
		  		params: params
    		},
    		response => {
    			// console.log(response);
    			dispatch(pieResponseAction(response.data))
    		},
    		dispatch
	  )
}

const pie_load = (s, e) => (
  (dispatch) => {
	  params = {
			  's': dateFormat(s, "yyyy-mm-dd"),
			  'e': dateFormat(e, "yyyy-mm-dd")
	  }
	  get(dispatch)
    }
)

const pie_refresh = () => (
    (dispatch) => {
        console.assert(params)
        get(dispatch)
    }
)


export {
	pie_load,
	pie_refresh
}
