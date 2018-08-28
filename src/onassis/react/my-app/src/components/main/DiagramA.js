import React from 'react' // ← Main React library
import { Panel } from 'react-bootstrap';

import Chart from '../chart/chart'
import Buttons from '../chart/buttons'
import Spinner from './Spinner'
import { connect } from 'react-redux'

class DiagramA extends React.Component{
	render(){
		return(
		<div>
			<Panel>
			  	<Panel.Heading style={{paddingTop: "6px", paddingBottom: "3px", height: "45px", fontSize: "23px"}}>
			  		Diagram <Spinner fetching={this.props.fetching} />
			  			<span className="pull-right">
				  			<Buttons />
				  	    </span>
			  	</Panel.Heading>
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
        fetching: store.chart.fetching
    }
}

export default connect(mapStateToProps)(DiagramA)