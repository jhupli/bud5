import React from 'react';
import {Button, OverlayTrigger, Popover} from 'react-bootstrap'
var FontAwesome = require('react-fontawesome');

class TextField extends React.Component {

	constructor(props) {
        super(props)
        this.state = {
        	txtValue : props.value
        }
        this.onChange = this.onChange.bind(this)
    }
	
	onChange(e) {
		const {onValueChanged, field, index} = this.props
		this.setState({
			txtValue : e.target.value
		})
		onValueChanged(e.target.value, field, index)
	}

	componentWillReceiveProps(nextprops) {
		this.setState({
			txtValue : nextprops.value
		})
	}
	
	render() {
		const {id, placeholder, readOnly, touched, linkCb, popoverText} = this.props
		
		var inputField = 
		<input 
	    	    id={id}
	    		value={this.state.txtValue}
	    	    disabled={readOnly}
	    	    style={{'backgroundColor' : (touched ? 'lightyellow' : '')}}
	    		placeholder={readOnly ? '' : placeholder} 
	    		type="text" 
	    		onChange={this.onChange}
	    		className="form-control"
	    />
	
	    if(readOnly) {
	    	
	    	return(
	    	<Button className="link-button" onClick={ () => {linkCb(this.state.txtValue)} } >
				{inputField}
			</Button>)
			
	    } else if( touched 
	    		|| linkCb == null 
	    		|| this.state.txtValue == null 
	    		|| this.state.txtValue.length == 0) {
	    		
		    return (
	    	<span style={{display: "inline-flex"}}>
					{inputField}
	    	</span>)
	    
	    } else {
	    	
			var linkButton = linkCb && this.state.txtValue && this.state.txtValue.length > 0?
					<Button className="link-button" onClick={ () => {
						linkCb(this.state.txtValue)}
					}>
						{popoverText}
	      			</Button>
			:
			null
			
			return(
		    <div>
		    	<span style={{display: "inline-flex"}}>
					<OverlayTrigger trigger='focus' key="top" placement="top"
					  overlay={
					    <Popover
					      id={`popover-positioned-${id}`}>
					    	{linkButton}
					    </Popover>
					  }>	    	
						{inputField}
					</OverlayTrigger>
		    	</span>
		    </div>)
	    }
	}	
}

TextField.defaultProps = {
		id: null,
		placeholder: '',
		onValueChanged: null,
		value : '',
		readOnly : false,
		field: null,
		index: null,
		touched: false,
		linkCb: null,
		popoverText: null
}

export default TextField