import React from 'react' // ← Main React library
import { Panel } from 'react-bootstrap';
import Pie from '../pie/pie'

class DiagramB extends React.Component{
	render(){
		return(
			<div>
				<Panel>
			  	<Panel.Heading style={{paddingTop: "6px", paddingBottom: "3px", height: "45px", fontSize: "23px"}}>Pie</Panel.Heading>
			  		<Panel.Body>					
			  		<Pie />
				</Panel.Body>
			  </Panel>
			</div>
		)
	}
}

export default DiagramB