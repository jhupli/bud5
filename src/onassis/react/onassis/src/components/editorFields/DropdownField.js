import React from 'react';
import Dropdown from '../dropdown/dropdown'

class DropdownField extends React.Component {
	render() {
		const {readOnly, field, index, onValueChanged, placeholder, touched, constants_id, cbDblClick} = this.props
	
		return(
	    <div>
	    	<Dropdown 
	    	    readOnly={readOnly}
	    		onValueChange={ (e) => {
	    			onValueChanged(e, field, index ) 
	    		}} 
	    		selectedValue={this.props.value}
	    		placeholder={placeholder}
	    		touched={touched}
	    		constants_id={constants_id}
	    		cbDblClick = {cbDblClick}
	    	/>
	    </div>)
	}	
}

DropdownField.defaultProps = {
		onValueChanged: null,
		value : null,
		readOnly : false,
		placeholder : '',
		field: null,
		index: null,
		touched: false,
		constants_id: null,
		cbDblClick: null
}

export default DropdownField

