const showErrorAction = (status, msg, when) => ({
    type: 'SHOW_ERROR',
    payload: {
        "status": status,
        "msg": msg,
        "when": when
    }
})

const showError = (status, msg) => (
    (dispatch) => {
        dispatch(showErrorAction(status, msg, Date.now()))
    }
)

const show_error = (error, dispatch) => {
    if (error.response && error.response.data) {
        dispatch(showError(error.response.status, error.response.data.error_message))
    } else {
        dispatch(showError('not known', error.message))
    }
}

export {
    show_error
}