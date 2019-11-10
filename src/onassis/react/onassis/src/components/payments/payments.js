import React from 'react';
import { connect } from 'react-redux'
import PaymentsEditor from '../paymentsEditor/PaymentsEditor'

class Payments extends React.Component {
	constructor(props) {
	    super(props);
	    this.state = {
	        payments: [],
	        balances: [] //TODO: needed?, if not remove from backend too!
	    }
	}
	
	render() {
		return(
			<PaymentsEditor 
				initPayments={this.props.payments} 
				queryType={this.props.queryType} 
				defaultDate={this.props.defaultDate}/>
		)
	}
}

Payments.defaultProps = {
		defaultDate: new Date()
}

const mapStateToProps = (store) => {
    return {
    	queryType: store.payments.queryType,
        payments: store.payments.payments,
        balances: store.payments.balances //TODO: needed?, if not remove from backend too!
    }
}

export default connect(mapStateToProps)(Payments)
