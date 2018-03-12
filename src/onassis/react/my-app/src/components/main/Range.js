import React from 'react' // ← Main React library
import { Panel } from 'react-bootstrap';
import { set_daterange } from '../../actions/daterange'

import Minibars from '../minibars/minibars'

import DatePicker from '../datepicker/datepicker'

import ConstantFilter from '../constantfilter/ConstantFilter'

import { connect } from 'react-redux'

var FontAwesome = require('react-fontawesome');

class Range extends React.Component{
	render(){
		return(
		<div>
			<Panel style={{width: '100%'}}>
			  	<Panel.Heading style={{paddingTop: "3px", paddingBottom: "3px", height: "45px"}}>
			  		<div style={{"display": "inline-flex", "whiteSpace": "nowrap", "alignItems": "center", fontSize: "23px"}}>
		              		  <FontAwesome name='calendar' />-<FontAwesome name='calendar' />&nbsp;
				              <DatePicker componentWillReceiveProps = {true} pickerName="rangePicker1" pickerType="range"
					              pickerCallback=
					              	{(start, end, name) => {this.props.setDateRange(new Date(start), new Date(end))}}
				              /> 
		              </div>
				       <span className="pull-right">       
				       		<ConstantFilter />
				      </span>
			  	
			  	</Panel.Heading>
			  	<Panel.Body>
			  		<Minibars name="minibar"/>
				</Panel.Body>
			  </Panel>
		</div>
		)
	}
}

function mapDispatchToProps(dispatch) {
    return ({
        'setDateRange': (start, end) => {
            dispatch(set_daterange(start, end))
        }
    })
}
export default connect(null, mapDispatchToProps)(Range)
						