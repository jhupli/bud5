import {addDays, addMonths, daydiff, isFirstAndLastOfSameMonth, daysInMonth} from '../util/addDays'

const DATE_RANGE_SELECTED = 'DATE_RANGE_SELECTED'
const setDateRangeAction = (s, e, skip) => ({
    type: DATE_RANGE_SELECTED,
    payload: {
        's': s,
        'e': e,
        'skip': skip
    }
})

var prev_s, prev_e

const set_daterange = (s, e) => (
    (dispatch) => {
    	prev_s = s
    	prev_e = e
        dispatch(setDateRangeAction(s, e))
    }
)

const set_daterangeSkip = (s, e) => (
    (dispatch) => {
    	prev_s = s
    	prev_e = e
        dispatch(setDateRangeAction(s, e, true))
    }
)

const daterange_next_block = () => (
    (dispatch) => {
    	//if it is a even month so will be the next month be even
    	if ( isFirstAndLastOfSameMonth(prev_s, prev_e) ) {
    		var s = addMonths(prev_s, 1)
    		var e = new Date(s)
    		s.setDate(1)
    		e.setDate(daysInMonth(e.getMonth(), e.getYear()))
    		dispatch(set_daterangeSkip(s, e))
    		return
    		
    	}
    	var diff = daydiff(prev_s, prev_e)
    	dispatch(set_daterangeSkip(addDays(prev_s, diff + 1), addDays(prev_e, diff + 1)))
    }
)

const daterange_prev_block = () => (
    (dispatch) => {
    	//if it is a even month so will be the preious month be even
    	if ( isFirstAndLastOfSameMonth(prev_s, prev_e) ) {
    		var s = addMonths(prev_s, -1)
    		var e = new Date(s)
    		s.setDate(1)
    		e.setDate(daysInMonth(e.getMonth(), e.getYear()))
    		dispatch(set_daterangeSkip(s, e))
    		return
    	}
    	var diff = daydiff(prev_e, prev_s)
    	dispatch(set_daterangeSkip(addDays(prev_s, diff - 1), addDays(prev_e, diff - 1)))
    }
)

const set_todayrange = () => (
    (dispatch) => {
    debugger
    		var s = new Date(0)
    		var today = new Date()
    		s.setFullYear(today.getFullYear())
    		s.setMonth(today.getMonth())
    		s.setDate(1)
    		s.setHours(0);
    		var e = new Date(s)
    		e.setDate(daysInMonth(e.getMonth(), e.getYear()))
    		dispatch(set_daterangeSkip(s, e))
    }
)

export {
    set_daterange,
    set_todayrange,
    daterange_prev_block,
    daterange_next_block
    
}