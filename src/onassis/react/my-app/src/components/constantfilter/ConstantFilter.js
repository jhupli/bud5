import React from 'react';
import { connect } from 'react-redux'
import { balances_load } from '../../actions/minibars'
import Dropdown from '../dropdown/dropdown'
import CheckboxField from '../editorFields/CheckboxField'

class ConstantFilter extends React.Component {
	constructor(props) {
	    super(props);
	    this.state = {
	    	filter: null,
	    	checked: true
	    }
	    this.onFilterChanged = this.onFilterChanged.bind(this);
	    this.onCheck = this.onCheck.bind(this);
  	}
	  
	onFilterChanged(e) {
		this.setState(
				{
					filter: e
				})
		this.props.balances_load(e)
	}
	
	onCheck(e) {
		this.setState(
				{
					checked: e
				})
		if(e) {
			this.props.balances_load(0)
		} else if(this.state.filter) {
			this.props.balances_load(this.state.filter)
		}
	}
	
	
	render() {	
		var dd = 	<Dropdown 
			    		readOnly = {this.state.checked}
			    		onValueChange={ this.onFilterChanged } 
			    		selectedValue={this.state.filter}
			    		placeholder='filter'
			    		constants_id='cat'
			    	/>
		return(
	    <div>
		    <span style={{display: "inline-flex"}}>
		    	<div style={{paddingTop: "7px", paddingRight: "5px"}}>
		    	All 
		    	</div>
		    	<CheckboxField
		    			id = 'all'
				  		onValueChanged = {this.onCheck}
				  		checked = {this.state.checked}
				/>
		    	{ !this.state.checked ? dd : null }
		    </span>
	    </div>)
	}
}

function mapDispatchToProps(dispatch) {
    return({
        balances_load: (e) => {
        	dispatch(balances_load(e)) 
        }
    })
}

export default connect(null, mapDispatchToProps)(ConstantFilter)
