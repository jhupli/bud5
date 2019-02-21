import {axios_get, axios_post} from './axios';
import { invalidate } from './constants'

const CATEGORY = 'cat'
	
const CATEGORIES_REQUEST = 'CATEGORIES_REQUEST'
const categoriesRequestAction = () => ({
    type: CATEGORIES_REQUEST
})

const CATEGORIES_RESPONSE = 'CATEGORIES_RESPONSE'
const categoriesResponseAction = (categories) => ({
    type: CATEGORIES_RESPONSE,
    payload: {
        "categories": categories
    }
})

const CATEGORIES_UPDATE_REQUEST = 'CATEGORIES_UPDATE_REQUEST'
const categoriesUpdateRequestAction = (updates) => ({
    type: CATEGORIES_UPDATE_REQUEST,
    payload: {
    	"updates": updates
    }
})

const CATEGORIES_UPDATE_RESPONSE = 'CATEGORIES_UPDATE_RESPONSE'
const categoriesUpdateResponseAction = () => ({
    	type: CATEGORIES_UPDATE_RESPONSE
})

const update = (updates) => (
    (dispatch) => {
        dispatch(categoriesUpdateRequestAction(updates))
        axios_post('cat/update', updates,
            (response) => {
               dispatch(categoriesUpdateResponseAction())
               dispatch(load())
               invalidate(CATEGORY, dispatch)
            },
            dispatch
        )
    }
 )

 const load = () => (
    (dispatch) => {
        dispatch(categoriesRequestAction())
        axios_get('cat/list',
            null,
            response => {
               dispatch(categoriesResponseAction(response.data))
            },
            dispatch
        )
    }
 )
 
export {
	CATEGORY,
    load,
    update
}