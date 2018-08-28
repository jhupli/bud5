import React from 'react' // ← Main React library
import { Panel } from 'react-bootstrap';
import { set_daterange } from '../../actions/daterange'

import Minibars from '../minibars/minibars'
import Buttons from '../minibars/buttons'

import DatePicker from '../datepicker/datepicker'

import ConstantFilter from '../constantfilter/ConstantFilter'

import { connect } from 'react-redux'

import Spinner from './Spinner'

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
				              />&nbsp;<Spinner fetching={this.props.fetching} /> 
		               </div>
				       <span className="pull-right" style={{paddingLeft: "20px"}}>  
				       		<ConstantFilter />
				      </span>
				      <span className="pull-right">
				  			<Buttons />
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

const mapStateToProps = (store) => {
    return {
        fetching: store.minibars.fetching
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Range)
						