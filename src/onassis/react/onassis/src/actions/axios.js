import axios from 'axios';
import { show_error } from './errorMessage'
const HOST = 'http://localhost:8080/'

function axios_get(ctx_path, f, dispatch) {
	axios.get(HOST + ctx_path)
            .then(f)
            .catch(error => { show_error(error, dispatch) })		
}

function axios_get_params(ctx_path, params, f, dispatch) {
	axios.get(HOST + ctx_path, params)
            .then(f)
            .catch(error => { show_error(error, dispatch) })	
}

function axios_post(ctx_path, payload, f, dispatch) {
	axios.post(HOST + ctx_path, payload)
            .then(f)
            .catch(error => { show_error(error, dispatch) })	
}

export {HOST, axios_get, axios_get_params, axios_post}