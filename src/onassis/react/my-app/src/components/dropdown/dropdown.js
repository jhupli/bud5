import React from 'react';
import {SimpleSelect, MultiSelect} from 'react-selectize'
import 'react-selectize/themes/index.css'
import { get_constants } from '../../actions/constants'
import { connect } from 'react-redux'
import findInArray from '../../util/findInArray'

var FontAwesome = require('react-fontawesome');

const width = 150

class Dropdown extends React.Component {
	constructor(props) {
	    super(props);
	    this.state = {
	    		selectedValue : null,
	    		'items' :  props.getConstants(props.constants_id) // return null, but launches fetch
	    		
	    }
	    this.constants_id = props.constants_id
	    this.onValueChange = this.onValueChange.bind(this);
	    this.className = this.className.bind(this);
	}
	
	onValueChange(item) {
    	this.setState( {
	    		selectedValue : item
	    })
	    this.props.onValueChange(item != null? item.value : null)
    	return this.renderOption(item)
    }

	
    componentWillReceiveProps(nextProps){
    	if( nextProps.constants && nextProps.constants[this.props.constants_id]) {
    		var constants = nextProps.constants[this.props.constants_id]
    		var selectedItem = findInArray( constants,  c => { return c.value === nextProps.selectedValue} )
	    	/*var selectedItem = constants.find( c => { return c.value === nextProps.selectedValue })*/
	    	var validConstants = constants.filter(  c => { return (c.valid || c === selectedItem) })
	    	this.setState({
		    		selectedValue : selectedItem,
		    		'items' : validConstants		
		    })
    	}
    }
    
	renderOption(item) {		
		if(item == null) {
			return
		}
    	return (
			<div >
				<span style={{
	 				 display: 'block', 
					 textOverflow: 'ellipsis',
					 overflow: 'hidden',
					 whiteSpace: 'nowrap',
					 maxWidth: (width-50)+'px'
	    		}}>
					<span style = {{'marginRight':'5px', 'marginLeft':'5px'}}>
						<FontAwesome name = 'square' style = {{'color': item.color}} />
					</span>
	    			<span>
	    				{item.label}
	    			</span>
	    		</span>
			</div>
    	)    	
    }
	
	className() {
		if(!this.props.readOnly && !this.props.touched) return 'simpledropdown'
		if(!this.props.readOnly && this.props.touched) return 'simpledropdown_touched'
		if(this.props.readOnly && !this.props.touched) return 'simpledropdown_ro'
		if(this.props.readOnly && this.props.touched) return 'simpledropdown_ro_touched'
		
	}
	
	render() {
		return (
		<SimpleSelect
			className={this.className()}
			disabled={this.props.readOnly}
		    style={{
		    	width: width+'px',
		    	border: 'none',
		    	backgroundColor: 'none',
		    	backgroundImage: 'none'
		    }}
			renderOption={this.renderOption}
			renderValue={this.renderOption}
			onValueChange={this.onValueChange}
	        placeholder={this.props.placeholder}
	        options = {this.state.items}
			value = {this.state.selectedValue}
			hideResetButton = {true}
		/>)
	}
}

Dropdown.defaultProps = {
		refreshTime: null,
		onValueChange: null,
	    touched: false,
	    readOnly: false,
	    placeholder: '',
	    constants: null,
	    constants_id: null
}

const mapStateToProps = (store) => {
    return {
    	refreshTime:  store.constants.refreshTime,
        constants: store.constants.constants
    }
}

function mapDispatchToProps(dispatch) {
    return({
        getConstants: (id) => {
        	get_constants(id, dispatch)
        }
    })
}
export default connect(mapStateToProps, mapDispatchToProps)(Dropdown)
