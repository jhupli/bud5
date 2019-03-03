import React from 'react' // ← Main React library
import { Panel } from 'react-bootstrap';
import { set_daterange } from '../../actions/daterange'
import { minibars_redraw } from '../../actions/minibars'

import Minibars from '../minibars/minibars'
import ButtonL from '../minibars/buttons/buttonL'
import ButtonR from '../minibars/buttons/buttonR'

import DatePicker from '../datepicker/datepicker'

import ConstantFilter from '../constantfilter/ConstantFilter'

import { connect } from 'react-redux'

import Spinner from './Spinner'

var FontAwesome = require('react-fontawesome');


class RangePanel extends React.Component{
	constructor(props) {
		super(props)
		this.showMinibars = this.showMinibars.bind(this)
		this.state = {
			showMinibars: false
		}
	}
	
	showMinibars() {
		this.setState({
			showMinibars : !this.state.showMinibars
    	})
    	var that = this
		var f = () => {
	    			that.props.minibarsRedraw()
	    }
	    //console.log("FIRE:")
	    setTimeout(f, 0)
	}

	render(){
		/*
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
			  		{this.props.children}
				</Panel.Body>
			  </Panel>
		</div>
		)*/
		

		var ctrls = this.state.showMinibars ?
				       <span className="pull-right" style={{paddingLeft: "20px"}}>  
				       		<ConstantFilter />
				       </span>
				  	 :
				  	   null
			
		return(
		<Panel style={{width: '100%'}} id="minibars-panel" expanded={this.state.showMinibars} onToggle={() => {}}  >
          <Panel.Heading style={{paddingTop: "3px", paddingBottom: "3px", height: "45px"}}>
         
			  		  <div style={{"display": "inline-flex", "whiteSpace": "nowrap", "alignItems": "center", fontSize: "23px"}}>
	                      <FontAwesome name='calendar' />-<FontAwesome name='calendar' />&nbsp;
	                      	<div style={{paddingTop: "1px"}}>
	                      		<ButtonL  />
	                      	</div>
					        <DatePicker componentWillReceiveProps = {true} pickerName="rangePicker1" pickerType="range"
					              pickerCallback={(start, end, name) => {this.props.setDateRange(new Date(start), new Date(end))}}
					        />
					        <div style={{paddingTop: "1px"}}>
	                        	<ButtonR />
	                       </div>
	
			            </div>
		             <span>
							<Panel.Toggle componentClass="button" className="link-button" onClick={this.showMinibars} style={{textDecoration: 'none'}}>&nbsp;
								{ (this.state.showMinibars ? <FontAwesome name='caret-up' size='2x' /> : <FontAwesome name='caret-down' size='2x' />) }&nbsp;
		            		</Panel.Toggle>
	                </span><Spinner fetching={this.props.fetching} />

		           {ctrls}
          </Panel.Heading>
          <Panel.Collapse>
            <Panel.Body >
            	<Minibars name="minibar" />
            </Panel.Body>
          </Panel.Collapse>
        </Panel>)
        
	}
}

function mapDispatchToProps(dispatch) {
    return ({
        'setDateRange': (start, end) => {
            dispatch(set_daterange(start, end))
        },
        minibarsRedraw: () => {
            dispatch(minibars_redraw())
        }
    })
}

const mapStateToProps = (store) => {
    return {
        fetching: store.minibars.fetching
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(RangePanel)
						