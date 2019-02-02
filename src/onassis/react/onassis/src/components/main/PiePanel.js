import React from 'react' // ← Main React library
import { Panel } from 'react-bootstrap';
import Pie from '../pie/pie'
//import Spinner from './Spinner'
import { connect } from 'react-redux'
//var dateFormat = require('dateformat');

//var FontAwesome = require('react-fontawesome');

class PiePanel extends React.Component{
	render(){
		//var dates = " " + dateFormat(this.props.start, "dd.mm.yyyy ddd") + " - " + dateFormat(this.props.end, "dd.mm.yyyy ddd")

		return(
			<div>
				<Panel>
				{/*
			  	<Panel.Heading style={{paddingTop: "6px", paddingBottom: "3px", height: "45px", fontSize: "23px"}}><FontAwesome name='pie-chart' /> <span style={{fontSize: "15px"}}>{dates}</span><Spinner fetching={this.props.fetching} />
			  	</Panel.Heading> */}
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
        fetching: store.pie.fetching,
        start: store.daterange.s,
        end: store.daterange.e
    }
}

export default connect(mapStateToProps)(PiePanel)
