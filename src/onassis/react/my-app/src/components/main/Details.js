import React from 'react' // ← Main React library
import { connect } from 'react-redux'
import { Grid, Row, Col, Panel } from 'react-bootstrap';
import Payments from '../payments/payments'
import PaymentSelection from '../paymentSelection/paymentSelection'
import Spinner from './Spinner'

class Details extends React.Component{
	constructor(props) {
	    super(props);
	}
	
	render(){
		console.log("fetch:"+this.props.fetching)
		return(
			<div>
			  <Panel >
			  	<Panel.Heading style={{paddingTop: "4px", paddingBottom: "3px", height: "45px", fontSize: "23px"}}>
				  	<span style={{display: "flow-root", alignItems: "center"}}>
				  		Payments <Spinner fetching={this.props.fetching} />
				  		<span className="pull-right">
				  			<PaymentSelection />
				  		</span>
				  	</span>
			  	</Panel.Heading>
			  	<Panel.Body>					
					<Payments />
				</Panel.Body>
			  </Panel>
			</div>					
		)
	}
}

const mapStateToProps = (store) => {
    return {
        fetching: store.payments.fetching
    }
}

export default connect(mapStateToProps)(Details)
