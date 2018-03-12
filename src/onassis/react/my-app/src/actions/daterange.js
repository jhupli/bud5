import axios from 'axios';

const DATE_RANGE_SELECTED = 'DATE_RANGE_SELECTED'
const setDateRangeAction = (s, e, name) => ({
    type: DATE_RANGE_SELECTED,
    payload: {
        's': s,
        'e': e
    }
})

const set_daterange = (s, e) => (
    (dispatch: Redux.Dispatch) => {
        dispatch(setDateRangeAction(s, e))
    }
)

export {
    set_daterange
}