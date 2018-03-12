import axios from 'axios';
//import { chart_refresh } from './chart'
//import { pie_refresh } from './pie'
import { payments_refresh } from './payments'
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
    (dispatch: Redux.Dispatch) => {
        dispatch(categoriesUpdateRequestAction(updates))
        axios.post('http://localhost:8080/cat/update', updates)
            .then(function(response) {
               dispatch(categoriesUpdateResponseAction())
               dispatch(load())
               invalidate(CATEGORY, dispatch)
            })
            .catch(function(error) {
                console.log("TODO____________________")
                console.log(error)
            }
        )
    }
 )

 const load = () => (
    (dispatch: Redux.Dispatch) => {
        dispatch(categoriesRequestAction())
        axios.get('http://localhost:8080/cat/list?ts='+Date.now())
            .then(function(response) {
               dispatch(categoriesResponseAction(response.data))
            })
            .catch(function(error) {
                console.log("TODO____________________")
                console.log(error)
            }
        )
    }
 )
export {
	CATEGORY,
    load,
    update
}