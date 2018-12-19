import React from 'react';
import DatePicker from '../datepicker/datepicker'

var dateFormat = require('dateformat');

class DateField extends React.Component {
	render() {
		const {id, onValueChanged, value, readOnly, field, index, touched} = this.props
		return(
		<div>
	    	<DatePicker 
	    	    disabled={readOnly}
	    		value={value}
	    		id={id}
	    		pickerName={'picker_d_' + id + index} 
	    	 	pickerCallback={(d) => onValueChanged(dateFormat(d, "dd.mm.yyyy"), field, index)}
	    	 	pickerType="single"
	    	 	touched = {touched}
	    	 	style={{
	    		  'backgroundColor' : (touched ? 'lightyellow' : '')
	    	 	}}
	    	 />
	    </div>)
	}	
}

DateField.defaultProps = {
		id: null,
		onValueChanged: null,
		value : true,
		readOnly : false,
		field: null,
		index: null,
		touched: false,
}

export default DateField