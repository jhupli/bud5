import axios from 'axios';
import { show_error } from './errorMessage'
//const HOST = 'http://localhost:8080/'

function parseUrl( url ) {
    var a = document.createElement('a');
    a.href = url;
    return a;
}

var HOST = 'http://'+parseUrl(document.URL).hostname + ':8080/'

function _contextUrl(ctx_path, params) {
  return ctx_path + '?' + (null == params ? "" : params + '&') + 'ts=' + Date.now()
}

function axios_get(ctx_path, params, f, dispatch) {
  var contextUrl = _contextUrl(ctx_path, params)
	axios.get(HOST + contextUrl)
            .then(f)
            .catch(error => { show_error(error, dispatch) })		
}

function axios_get_params(ctx_path, params, f, dispatch) {
  var contextUrl = _contextUrl(ctx_path, null)
	axios.get(HOST + contextUrl, params)
            .then(f)
            .catch(error => { show_error(error, dispatch) })	
}

function axios_post(ctx_path, payload, f, dispatch) {
	axios.post(HOST + ctx_path, payload)
            .then(f)
            .catch(error => { show_error(error, dispatch) })	
}


export {HOST, axios_get, axios_get_params, axios_post}