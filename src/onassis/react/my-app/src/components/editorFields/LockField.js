import Toggle from 'react-toggle'
import React from 'react';
import { lock_payment } from '../../actions/payment'
import { connect } from 'react-redux'

import './toggle.css'

var FontAwesome = require('react-fontawesome')



class Lock extends React.Component {
	render() {
		return <FontAwesome name='lock' style={{ 'color':'white' }}/>
	}
}

class Unlock extends React.Component {
	render() {
		return <FontAwesome name='unlock-alt' style={{ 'color':'white' }}/>
	}
}

class LockField extends React.Component {
	  constructor(props) {
		    super(props);
		    this.toggleLock = this.toggleLock.bind(this);
	  }
	  
	  toggleLock(e) {
		  	const {field, index} = this.props
			var locked = !e.target.checked;
			this.props.onValueChanged(locked, field, index )
			this.props.lockPayment(this.props.id, locked)
	  }
	  
	  componentWillReceiveProps(nextProps){
		  this.setState({
	        checked : nextProps.checked,
		  })
	  }
	  render() {
		const {readOnly, checked} = this.props

	    return (
	    <div style={{paddingTop: 8}}>
			<Toggle
				disabled = {readOnly}
			    checked = {!checked}
	    		onChange = {this.toggleLock}
	    		icons={{
	    		      checked: <Unlock />,
	    		      unchecked: <Lock />,
	    		}}	
			/>
	    </div>)
	  }
	}

LockField.defaultProps = {
		id: null,
		onValueChanged: null,
		checked : false,
		readOnly : false,
		field: null,
		index: null,
}


function mapDispatchToProps(dispatch) {
    return({
        lockPayment: (id, locked) => {
        	dispatch(lock_payment(id, locked)) 
        }
    })
}

export default connect(null, mapDispatchToProps)(LockField)
