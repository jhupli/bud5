import axios from 'axios';
var dateFormat = require('dateformat');

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
    axios.get('http://localhost:8080/pie?ts='+Date.now(), {		  
		  port: 8080,
		  params: params
	  })
	  .then(function (response) {
  		 // console.log(response);
  		  dispatch(pieResponseAction(response.data))
	  })
	  .catch(function (error) {
		  console.log(error);
	  });

}

const pie_load = (s, e) => (
  (dispatch: Redux.Dispatch) => {
	  params = {
			  's': dateFormat(s, "yyyy-mm-dd"),
			  'e': dateFormat(e, "yyyy-mm-dd")
	  }
	  get(dispatch)
    }
)

const pie_refresh = () => (
    (dispatch: Redux.Dispatch) => {
        console.assert(params)
        get(dispatch)
    }
)


export {
	pie_load,
	pie_refresh
}
