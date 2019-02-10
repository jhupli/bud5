import React from 'react';
import { connect } from 'react-redux'
import { Table, Panel } from 'react-bootstrap';
import {fiDateTimeMillis, toFiDBFormat} from '../../util/fiDate'
import currencyFormat  from '../../util/currency'

import './auditlog.css'
import Spinner from '../main/Spinner'
import Buttons from './buttons'
import AuditLogTable from './auditlogTable'

class AuditLog extends React.Component {
	
	render() {
		
		var entries = this.props.logentries || []
		return(
			<div>
				<div>
					<Panel>
					  	<Panel.Heading style={{paddingTop: "6px", paddingBottom: "3px", height: "45px", fontSize: "23px"}}>
					  		Audit Log <Spinner fetching={this.props.fetching} />
					  			<span className="pull-right">
						  			<Buttons />
						  	    </span>
					  	</Panel.Heading>
					 </Panel>
				 </div>
				<AuditLogTable logentries={entries} />
				<div>
					<Panel>
					  	<Panel.Heading style={{paddingTop: "6px", paddingBottom: "3px", height: "45px", fontSize: "23px"}}>
					  			<span className="pull-right">
						  			<Buttons />
						  	    </span>
					  	</Panel.Heading>
					 </Panel>
				 </div>
			</div>
		)
	}
}

const mapStateToProps = (store) => {
    return {
        logentries: store.auditlog.logentries,
        fetching: store.auditlog.fetching
    }
}

export default connect(mapStateToProps)(AuditLog)
