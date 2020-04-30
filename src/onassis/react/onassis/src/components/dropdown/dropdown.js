import React from 'react';
import {SimpleSelect} from 'react-selectize'
import 'react-selectize/themes/index.css'
import { get_constants } from '../../actions/constants'
import { connect } from 'react-redux'
import { findInArray } from '../../util/findInArray'
import {Button} from 'react-bootstrap'

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
	    this.onOpenChange = this.onOpenChange.bind(this);

	    this.vchanged = false;
	    this.opened = false;
	}
	
	onValueChange(item) {
        this.vchanged = true;
    	this.setState( {
	    		selectedValue : item
	    })
	    this.props.onValueChange(item != null? item.value : null)
    	return this.renderOption(item)
    }

    onOpenChange(open) {
            /*console.log("----------------")
            console.log(this.state.selectedValue.label+ " open =" + open)
            console.log(this.state.selectedValue.label+ " vchanged =" + this.vchanged)
            console.log(this.state.selectedValue.label+ " opened =" + this.opened)*/
            //console.log(open)

            if(null != this.props.cbDblClick && (open==null || (!open && this.opened)) && !this.vchanged) {
                this.props.cbDblClick(this.state.selectedValue)
            }
            //This is hack, onOpenChange will be called when not even opened, we'll make sure user has clicked the list open
            this.opened = open;
            this.vchanged = false;
    }
	
    componentWillReceiveProps(nextProps){
    	if( nextProps.constants && nextProps.constants[this.props.constants_id]) {
    		var constants = nextProps.constants[this.props.constants_id]
    		var selectedItem = findInArray( constants,  c => { return c.value === nextProps.selectedValue} )
	    	/*var selectedItem = constants.find( c => { return c.value === nextProps.selectedValue })*/
	    	var validConstants = null;
	    	if( this.props.onlyValid ) {
	    	    validConstants = constants.filter(  c => { return (c.valid || c === selectedItem) })
	    	} else {
	    	    validConstants = constants
	    	}
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

		var icon = null;
		if(item.icon) {
		  icon = 	(<span><FontAwesome name = {item.icon} style = {{'color': 'black', 'marginRight':'3px'}} /></span>)
    }
    	return (
			<span style={{
	 				 display: 'contents',
	 				 whiteSpace: 'nowrap',
			}}>
				<span style={{
	 				 display: 'block', 
					 textOverflow: 'ellipsis',
					 overflow: 'hidden',
					 whiteSpace: 'nowrap',
					 maxWidth: (width-50)+'px'
	    		}}>
					<span >

						<FontAwesome name = 'square' style = {{'color': item.color, 'marginRight':'5px'}} />

            {icon}
					</span>
	    			<span >

	    				{item.label}

	    			</span>
	    		</span>

			</span>
    	)    	
    }
	
	className() {
		if(!this.props.readOnly && !this.props.touched) return 'simpledropdown'
		if(!this.props.readOnly && this.props.touched) return 'simpledropdown_touched'
		if(this.props.readOnly && !this.props.touched) return 'simpledropdown_ro'
		if(this.props.readOnly && this.props.touched) return 'simpledropdown_ro_touched'
		
	}
	
	render() {
	    /*https://github.com/selectize/selectize.js/blob/HEAD/docs/api.md*/

	    var dropDown = 		<SimpleSelect
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
                       			cancelKeyboardEventOnSelection = {false}
                       			onOpenChange = {this.onOpenChange}
                       		/>
        if(null == this.props.cbDblClick) {
            return dropDown
        }
		return (
        <Button className="link-button" onClick={ () => {this.onOpenChange(null)} } >
            {dropDown}
		</Button>)
	}
}

Dropdown.defaultProps = {
		refreshTime: null,
		onValueChange: null,
	    touched: false,
	    readOnly: false,
	    placeholder: '',
	    constants: null,
	    constants_id: null,
	    onlyValid: true,
	    cbDblClick: null
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
