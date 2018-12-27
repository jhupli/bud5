import React from 'react'
import { connect } from 'react-redux'
import { list_load } from '../../actions/payments'
//import update from 'react-addons-update';

import { Badge, Button } from 'react-bootstrap';
class PaymentSelection extends React.Component {
	
	constructor(props) {
	    super(props);
	    this.list = this.list.bind(this);
	}
	/*  constructor(props) {
		    super(props);
		    
		    this.state = {
		    	selection : []
		    }
		    this.select = this.select.bind(this);
	  }
	  
	  
	  select(payments, selected) {
		  
		  if (!Array.isArray(payments)) {
			  payments = [payments]
		  }
		  
		  var new_selection = this.state.selection.slice(0)
		  payments.forEach( (payment) =>  {
			  if (selected) {
				  var index =  new_selection.indexOf(payment)
				  if (index === -1) {
					  new_selection.push(payment)
				  }
			  } else {
				  var index =  new_selection.indexOf(payment)
				  if (index !== -1) {
					  new_selection.splice(index,1)
				  }
			  }
		  })
		  this.setState({"selection": new_selection});
	  }
	  
	  componentWillUpdate(nextProps, nextState){
		  if (
				  nextProps.payment != this.props.payment ||
				  nextProps.selected != this.props.selected ) {
			  	  this.select(nextProps.payment, nextProps.selected)
		  }
	  }*/
	
	/*componentWillReceiveProps(nextprops) {
		console.log(nextprops)
		if (nextprops.payment != this.props.payment) {
			var index =  this.props.payments.indexOf(nextprops.payment);
			if (index !== -1) {
				this.props.payments.splice( index, 1 );
			}
		}
	}*/
	
	list() {
		this.props.listLoad(this.props.payments)
	}
	
	render() {
		if( this.props.payments.length === 0 ) return null
	    return (
	     <Button onClick={this.list}><Badge>{this.props.payments.length}</Badge></Button>
	    );
	  }
}


PaymentSelection.defaultProps = {
		payments: [],
		//payment: null
};

const mapStateToProps = (store) => {
	  return {
  		payments: store.payment.payments,
  		//payment: store.payment.payment
	  }
  }

function mapDispatchToProps(dispatch) {
    return ({
        listLoad: (ids) => {
            dispatch(list_load(ids))
        }       
    })
}

export default connect(mapStateToProps, mapDispatchToProps)(PaymentSelection)
//export default PaymentSelection
