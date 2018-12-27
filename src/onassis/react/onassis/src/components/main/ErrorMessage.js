import React from 'react'
import { Alert, Button } from 'react-bootstrap'
import { connect } from 'react-redux'

class ErrorMessage extends React.Component {
    constructor(props) {
        super(props)

        this.dismiss = this.dismiss.bind(this)
        this.show = this.show.bind(this)

        this.state = {
            show: false
        }
    }

    dismiss() {
        this.setState({ show: false })
    }

    show() {
        this.setState({ show: true })
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.when !== this.props.when) {
            this.show()
        }
    }

    render() {

        if (!this.state.show) return null;

        const { status, msg } = this.props
        return (

       <Alert bsStyle="danger" onDismiss={this.dismiss}>
		    <h4>We've got an error!</h4>
		    Server returned:
		    <ul>
		        <li>Status: {status}</li>
		        <li>Message: {msg}</li>
		    </ul>
		    <hr />
		    <p>
	        	<Button onClick={this.dismiss}>Close</Button>
	        </p>
		</Alert>
		)
    }

}

ErrorMessage.defaultProps = {
    when: 0
}

const mapStateToProps = (store) => {
    return {
        status: store.errorMessage.status,
        msg: store.errorMessage.msg,
        when: store.errorMessage.when
    }
}

export default connect(mapStateToProps)(ErrorMessage)