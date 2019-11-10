const NEXTDAY = 'NEXTDAY'
const nextDayAction = () => (
  { 
	type: NEXTDAY,
    payload: 
    	{
    		nextday : (new Date()).getTime() //only signal
    	} 
  }
)

const PREVDAY = 'PREVDAY'
const prevDayAction = () => (
  { 
	type: PREVDAY,
    payload: 
    	{
    		prevday : (new Date()).getTime() //only signal
    	} 
  }
)

const TODAY = 'TODAY'
const todayAction = () => (
  { 
	type: TODAY,
    payload: 
    	{
    		today : (new Date()).getTime() //only signal
    	} 
  }
)

const next_day = () => (
    (dispatch) => {
    	dispatch(nextDayAction())
    }
)

const prev_day = () => (
    (dispatch) => {
    	dispatch(prevDayAction())
    }
)

const today = () => (
    (dispatch) => {
    	dispatch(todayAction())
    }
)

export {
	next_day,
	prev_day,
	today,
}
