import React from 'react' // ← Main React library
import { Grid, Row, Col, Panel } from 'react-bootstrap';
import Payments from '../payments/payments'
import PaymentSelection from '../paymentSelection/paymentSelection'

class Details extends React.Component{
	render(){
		return(
			<div>
			  <Panel >
			  	<Panel.Heading style={{paddingTop: "4px", paddingBottom: "3px", height: "45px", fontSize: "23px"}}>
				  	<span style={{display: "flow-root", alignItems: "center"}}>
				  		Payments 
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

export default Details