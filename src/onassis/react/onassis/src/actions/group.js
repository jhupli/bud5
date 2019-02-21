import {axios_get} from './axios';
	
const NEW_GROUP_REQUEST = 'NEW_GROUP_REQUEST'
const newGroupRequestAction = () => ({
    type: NEW_GROUP_REQUEST
})

const NEW_GROUP_RESPONSE = 'NEW_GROUP_RESPONSE'
const newGroupResponseAction = (g) => ({
    type: NEW_GROUP_RESPONSE,
    payload: {
        "g": g
    }
})

 const new_group = () => (
    (dispatch) => {
        dispatch(newGroupRequestAction())
        axios_get('group/newid',
            null,
            response => {
               dispatch(newGroupResponseAction(response.data))
            },
            dispatch
        )
    }
 )
 
export {
    new_group
}