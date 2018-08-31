import {load as loadcategories} from './categories'
import {load as loadaccounts} from './accounts'
import {load as loadauditlog} from './auditlog'


const SHOW_VIEW = 'SHOW_VIEW'
	

const naviShowViewRequestAction = (view) => ({
    type: SHOW_VIEW,
    payload: {
    	"view": view
    }
})

const show_view = (view) => (
    (dispatch: Redux.Dispatch) => {
    	if(view === 'c') {
    		dispatch(loadcategories())
    	}
    	if(view === 'a') {
    		dispatch(loadaccounts())
    	}
    	if(view === 'l') {
    		dispatch(loadauditlog())
    	}
        dispatch(naviShowViewRequestAction(view))
    }
 )

export {
    show_view
}