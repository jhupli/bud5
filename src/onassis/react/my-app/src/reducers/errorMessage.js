const reducer = (state = [], action) => {
    switch (action.type) {

	    case 'SHOW_ERROR':
	        return Object.assign({}, state, {
	            status: action.payload.status,
	            msg: action.payload.msg,
	            when: action.payload.when
	        })
	        
	    default:
	        return state
    }
}

export default reducer