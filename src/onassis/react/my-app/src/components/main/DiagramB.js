import React from 'react' // ← Main React library
import { Panel } from 'react-bootstrap';
import Pie from '../pie/pie'
import Spinner from './Spinner'
import { connect } from 'react-redux'

class DiagramB extends React.Component{
	render(){
		return(
			<div>
				<Panel>
			  	<Panel.Heading style={{paddingTop: "6px", paddingBottom: "3px", height: "45px", fontSize: "23px"}}>Pie<Spinner fetching={this.props.fetching} /></Panel.Heading>
			  		<Panel.Body>					
			  		<Pie />
				</Panel.Body>
			  </Panel>
			</div>
		)
	}
}

const mapStateToProps = (store) => {
    return {
        fetching: store.pie.fetching
    }
}

export default connect(mapStateToProps)(DiagramB)
