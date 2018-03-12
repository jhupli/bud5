import React from 'react';
import { connect } from 'react-redux'
import PaymentsEditor from '../paymentsEditor/PaymentsEditor'
import { day_load } from '../../actions/payments'

class Payments extends React.Component {
	constructor(props) {
	    super(props);
	    this.state = {
	        payments: [],
	        balances: [] //TODO: needed?, if not remove from backend too!
	    }
	    this.props.dayLoad(new Date())
	}
	
	render() {
		return(
		<div>
			<PaymentsEditor initPayments={this.props.payments} />
		</div>)
	}
}

const mapStateToProps = (store) => {
    return {
        payments: store.payments.payments,
        balances: store.payments.balances //TODO: needed?, if not remove from backend too!
    }
}

function mapDispatchToProps(dispatch) {
    return ({
        dayLoad: (d) => {
            dispatch(day_load(d))
        }       
    })
}
export default connect(mapStateToProps, mapDispatchToProps)(Payments)
