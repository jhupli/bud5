import React from 'react';
import DatePicker from '../datepicker/datepicker'
import {Button, OverlayTrigger, Popover} from 'react-bootstrap'

var dateFormat = require('dateformat');

class DateField extends React.Component {
	render() {

		const {id, onValueChanged, value, readOnly, field, index, touched, linkCb, popoverText} = this.props
    console.log("id:"+id)
    console.log("value:"+value)
    debugger
		var datePickerField =
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
	    </div>
	    	
	    if(readOnly && linkCb != null) {
	    	
	    	return(
	    	<Button className="link-button" onClick={ () => {linkCb(value)} } >
				{datePickerField}
			</Button>)
			
	    } else if( touched 
	    		|| readOnly
	    		|| linkCb == null 
	    		|| value == null 
	    		|| value.length === 0) {
	    		    		
		    return (
	    	<span style={{display: "inline-flex"}}>
					{datePickerField}
	    	</span>)
	    	
	    } else {
			var linkButton = linkCb && value && value.length > 0?
					<Button className="link-button" onClick={ () => {linkCb(value)}
					}>
						{popoverText}
	      			</Button>
			:
			null
			
			return(
		    <div>
		    	<span style={{display: "inline-flex"}} >
					<OverlayTrigger trigger='focus' key="top" placement="top"
					  overlay={
					    <Popover 
					      id={'popover-d-positioned-'+id}>
					    	{linkButton}
					    </Popover>
					  }>	    	
						{datePickerField}
					</OverlayTrigger>
		    	</span>
		    </div>)
	    }
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
		linkCb: null,
		popoverText: null
}

export default DateField