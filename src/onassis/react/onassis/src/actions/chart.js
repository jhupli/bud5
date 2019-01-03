import {axios_get_params} from './axios';

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

const CHART_NEXTDAY = 'CHART_NEXTDAY'
const chartNextDayAction = () => (
  { 
	type: CHART_NEXTDAY,
    payload: 
    	{
    		nextday : (new Date()).getTime() //only signal
    	} 
  }
)

const CHART_PREVDAY = 'CHART_PREVDAY'
const chartPrevDayAction = () => (
  { 
	type: CHART_PREVDAY,
    payload: 
    	{
    		prevday : (new Date()).getTime() //only signal
    	} 
  }
)

const CHART_TODAY = 'CHART_TODAY'
const chartTodayAction = () => (
  { 
	type: CHART_TODAY,
    payload: 
    	{
    		today : (new Date()).getTime() //only signal
    	} 
  }
)

const CHART_REDRAW = 'CHART_REDRAW'
const chartRedrawAction = () => (
  { 
	type: CHART_REDRAW,
    payload: 
    	{
    		redraw : (new Date()).getTime() //only signal
    	} 
  }
)

var params = null

function get(dispatch) {
    dispatch(chartRequestAction(params.s, params.e))
    axios_get_params('chart?ts='+Date.now(), 
    				{params: params},
				    response => {
			  		  dispatch(chartResponseAction(response.data))
				    },
				    dispatch
	)

}

const chart_load = (s, e) => (
  (dispatch) => {
	  params = {
			  's': dateFormat(s, "yyyy-mm-dd"),
			  'e': dateFormat(e, "yyyy-mm-dd")
	  }
	  get(dispatch)
    }
)


const chart_refresh = () => (
    (dispatch) => {
        console.assert(params)
        get(dispatch)
    }
)

const chart_next_day = () => (
    (dispatch) => {
    	dispatch(chartNextDayAction())
    }
)

const chart_prev_day = () => (
    (dispatch) => {
    	dispatch(chartPrevDayAction())
    }
)

const chart_today = () => (
    (dispatch) => {
    	dispatch(chartTodayAction())
    }
)

const chart_redraw = () => (
    (dispatch) => {
    	dispatch(chartRedrawAction())
    }
)


export {
	chart_load,
	chart_refresh,
	chart_next_day,
	chart_prev_day,
	chart_today,
	chart_redraw
}
