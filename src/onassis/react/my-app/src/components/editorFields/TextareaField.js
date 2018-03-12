import React from 'react';
import ReactDOM from 'react-dom';
import DatePicker from '../datepicker/datepicker'
import {Popover, OverlayTrigger} from 'react-bootstrap';
import detectIt from 'detect-it';

var FontAwesome = require('react-fontawesome');

class TextareaField extends React.Component {
	constructor(props) {
        super(props)
        this.state = {
        	txtValue : props.value,
        	open: props.open
        }
        this.onChange = this.onChange.bind(this)
        this.open = this.open.bind(this)
	}
	
	onChange(e) {
		const {id, onValueChanged, field, index} = this.props
		this.setState({
			txtValue : e.target.value
		})
		onValueChanged(e.target.value, field, index)
	}

	componentWillReceiveProps(nextprops) {
		this.setState({
			txtValue : nextprops.value,
		})
	}
	
	open(state) {
		this.setState({
			open: state
		})
	}
  
	render() {
		const {id, value, placeholder, readOnly, touched, width} = this.props

		var inputArea = (
		<div>
		  <input 
	    	    id={id}
	    		value={this.state.txtValue}
	    	    disabled={readOnly}
	    	    style={{'width': width}}
	    		placeholder={readOnly ? '' : placeholder} 
	    		type="text" 
	    		onChange={this.onChange}
	    		className="form-control"
	    	 	style={{
	    		  'backgroundColor' : (touched ? 'lightyellow' : '')
	    	 	}}
	    	/>
		</div>)
		
		var buttonOverlay = (
			<div>
				<OverlayTrigger 
					onExit={ () => {this.open(false)}}
					onEnter={ () => {this.open(true)}}
					rootClose
				    trigger="click"
				    placement="top" 
					overlay={
						<Popover id="popover-trigger-click-root-close" title="Description">
				    		{inputArea}
				    	</Popover>}>
			    	<button 
				  		type="button" 
				  		className="form-control"
			    		style={{
			    			'backgroundColor' : (touched ? 'lightyellow' : '')
			    	}}>
				  		<FontAwesome name={this.state.txtValue && this.state.txtValue.length > 0 ? 'file-text' : 'file'}/>
				    </button>
				</OverlayTrigger>
		    </div>
		)
		
		var hoverOverlay = (
		<div>
			<OverlayTrigger 
			    trigger={this.state.open ? [] : ['hover']} 
			    placement="top" 
				overlay={
					<Popover id="popover-trigger-hover-focus" title="Description"
					    	 style={{ 'backgroundColor' : (touched ? 'lightyellow' : '') }}>
			    			{this.state.txtValue}
			    	</Popover>}>
	    			{buttonOverlay}
	    	</OverlayTrigger>
	    </div>)
		
		return(
	    <div>
	    	{detectIt.deviceType !==  'touchOnly' ? hoverOverlay : buttonOverlay}
	    </div>)
	}
}

TextareaField.defaultProps = {
		id: null,
		placeholder: '',
		onValueChanged: null,
		value : '',
		readOnly : false,
		field: null,
		index: null,
		touched: false,
		width: '60px'
}

export default TextareaField