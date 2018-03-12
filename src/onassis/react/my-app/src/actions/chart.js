import axios from 'axios';
import addDays from '../util/addDays'

var dateFormat = require('dateformat');

const CHART_REQUEST = 'CHART_REQUEST'
const chartRequestAction = (s, e) => ({
    type: CHART_REQUEST,
    payload: {
        's': s,
        'e': e
    }
})

  
const CHART_RESPONSE = 'CHART_RESPONSE'
const chartResponseAction = (response) => (
  { 
	type: CHART_RESPONSE,
    payload: 
    	{
    		curves : response
    	} 
  }
)

var params = null

function get(dispatch) {
    dispatch(chartRequestAction(params.s, params.e));
    axios.get('http://localhost:8080/details?ts='+Date.now(), {		  
		  port: 8080,
		  params: params
	  })
	  .then(function (response) {
  		  console.log(response);
  		  dispatch(chartResponseAction(response.data))
	  })
	  .catch(function (error) {
		  console.log(error);
	  });

}

const chart_load = (s, e) => (
  (dispatch: Redux.Dispatch) => {
	  params = {
			  's': dateFormat(s, "yyyy-mm-dd"),
			  'e': dateFormat(e, "yyyy-mm-dd")
	  }
	  get(dispatch)
    }
)


const chart_refresh = () => (
    (dispatch: Redux.Dispatch) => {
        console.assert(params)
        get(dispatch)
    }
)

export {
	chart_load,
	chart_refresh
}
