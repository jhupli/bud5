import React from 'react';
import { connect } from 'react-redux'
import AuditLog from './auditlog'

class Logs extends React.Component {
	render() {
		return(
			<div>
				<AuditLog logentries={this.props.auditlog} />
			</div>
		)
	}
}

const mapStateToProps = (store) => {
    return {
    	//TODO
        auditlog: store.auditlog.logentries
    }
}

export default connect(mapStateToProps)(Logs)
