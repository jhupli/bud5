const SHOW_VIEW = 'SHOW_VIEW'
const navuShowViewRequestAction = (view) => ({
    type: SHOW_VIEW,
    payload: {
    	"view": view
    }
})

const show_view = (view) => (
    (dispatch: Redux.Dispatch) => {
        dispatch(navuShowViewRequestAction(view))
    }
 )

export {
    show_view
}