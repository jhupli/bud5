import {addDays, daydiff} from '../util/addDays'

const DATE_RANGE_SELECTED = 'DATE_RANGE_SELECTED'
const setDateRangeAction = (s, e, name) => ({
    type: DATE_RANGE_SELECTED,
    payload: {
        's': s,
        'e': e
    }
})
/*
const DATE_RANGE_NEXTBLOCK = 'DATE_RANGE_NEXTBLOCK'
const daterangeNextBlockAction = () => (
  { 
	type: DATE_RANGE_NEXTBLOCK,
    payload: 
    	{
    		nextblock : (new Date()).getTime() //only signal
    	} 
  }
)

const DATE_RANGE_PREVBLOCK = 'DATE_RANGE_PREVBLOCK'
const daterangePrevBlockAction = () => (
  { 
	type: DATE_RANGE_PREVBLOCK,
    payload: 
    	{
    		prevblock : (new Date()).getTime() //only signal
    	} 
  }
)

const DATE_RANGE_TODAY = 'DATE_RANGE_TODAY'
const daterangeTodayAction = () => (
  { 
	type: DATE_RANGE_TODAY,
    payload: 
    	{
    		today : (new Date()).getTime() //only signal
    	} 
  }
)
*/
var prev_s, prev_e

const set_daterange = (s, e) => (
    (dispatch) => {
    	prev_s = s
    	prev_e = e
        dispatch(setDateRangeAction(s, e))
    }
)

const daterange_next_block = () => (
    (dispatch) => {
    	//dispatch(daterangeNextBlockAction())
    	var diff = daydiff(prev_s, prev_e)
    	dispatch(set_daterange(addDays(prev_s, diff + 1), addDays(prev_e, diff + 1)))
    }
)

const daterange_prev_block = () => (
    (dispatch) => {
    	//dispatch(daterangePrevBlockAction())
    	var diff = daydiff(prev_e, prev_s)
    	dispatch(set_daterange(addDays(prev_s, diff - 1), addDays(prev_e, diff - 1)))
    }
)

const daterange_today = () => (
    (dispatch) => {
    	//dispatch(daterangeTodayAction())
    }
)
export {
    set_daterange,
    daterange_prev_block,
    daterange_next_block,
    daterange_today
}