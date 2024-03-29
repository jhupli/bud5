import React from 'react' // ← Main React library
import { Panel } from 'react-bootstrap';

import Chart from '../chart/chart'
//import Buttons from '../chart/buttons'
//import Spinner from './Spinner'
import { connect } from 'react-redux'
//var dateFormat = require('dateformat');

//var FontAwesome = require('react-fontawesome');

class ChartPanel extends React.Component{
	render(){
//		var dates = " " + dateFormat(this.props.start, "dd.mm.yyyy ddd") + " - " + dateFormat(this.props.end, "dd.mm.yyyy ddd")
		return(
		<div>
			<Panel style={{ opacity: this.props.fetching ? 0.3 : 1 }}>
			{/*
			  	<Panel.Heading style={{paddingTop: "6px", paddingBottom: "3px", height: "45px", fontSize: "23px"}}>
			  		<FontAwesome name='bar-chart' /> <span style={{fontSize: "15px"}}>{dates}</span><Spinner fetching={this.props.fetching} />
			  			<span className="pull-right">
				  			<Buttons />
				  	    </span>
			  	</Panel.Heading> */}
			  	<Panel.Body>
			  		<Chart />
				</Panel.Body>
			  </Panel>
		</div>
		)
	}
}

const mapStateToProps = (store) => {
    return {
        fetching: store.chart.fetching,
        start: store.daterange.s,
        end: store.daterange.e
    }
}

export default connect(mapStateToProps)(ChartPanel)