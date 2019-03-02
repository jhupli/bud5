import React from 'react';
import { Panel } from 'react-bootstrap';
import {fiDateTimeMillis} from '../../util/fiDate'
import LogEntry from './logEntry'
import {chooseValueF} from './logCommons'

class AuditLogTable extends React.Component {
	constructor(props) {
	    super(props);

	    //render
	    this.renderLogEntry = this.renderLogEntry.bind(this)
	}
	
	renderLogEntry(r) {
		if(r.rownr < 0) return null
		
		return (
		
		<Panel key={'al_panel_'+r.hs[0].id+'_'+r.rownr} >
			<Panel.Heading >
				<Panel.Title >
	            	{chooseValueF(r.hs[r.rownr], 'op')} at { fiDateTimeMillis(r.hs[r.rownr].hd) } ( id: {r.hs[0].id} )
				</Panel.Title >
            </Panel.Heading >
			 <Panel.Body>
			 	<LogEntry logEntry={r} />
			</Panel.Body>
		</Panel >
		
		)
	}
	
	render() {
		var entries = this.props.logentries || []

		return(
			<div>
				{entries.map((r) => this.renderLogEntry(r))}
			</div>
		)
	}
}

export default AuditLogTable
