import React from 'react';

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
		const {id, placeholder, readOnly, touched, linkCb} = this.props
		return(
	    <div>
	    <a onClick={(e) => {
	    	if(linkCb) {linkCb(e)}}
	    	}>
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
	    </a>
	    </div>)
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
		linkCb: null
}

export default TextField