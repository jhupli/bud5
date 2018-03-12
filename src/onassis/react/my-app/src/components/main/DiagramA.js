import React from 'react' // ← Main React library
import { Panel } from 'react-bootstrap';

import Chart from '../chart/chart'

class DiagramA extends React.Component{
	render(){
		return(
		<div>
			<Panel>
			  	<Panel.Heading style={{paddingTop: "6px", paddingBottom: "3px", height: "45px", fontSize: "23px"}}>Diagram</Panel.Heading>
			  	<Panel.Body>					
			  		<Chart />
				</Panel.Body>
			  </Panel>
		</div>
		)
	}
}

export default DiagramA