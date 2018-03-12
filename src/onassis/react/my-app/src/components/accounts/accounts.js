import React from 'react';
import { connect } from 'react-redux'
import { Panel } from 'react-bootstrap'
import AccountsEditor from '../accountsEditor/AccountsEditor'
import { load } from '../../actions/accounts'
class Accounts extends React.Component {
	constructor(props) {
	    super(props);
	    this.state = {
	        accounts: []
	    }
	    this.props.accountsLoad()
	}
	
	render() {
		return(
			<div>
				<Panel header="Accounts">
					<AccountsEditor initAccounts={this.props.accounts} />
				</Panel>
			</div>)
	}
}

const mapStateToProps = (store) => {
    return {
        accounts: store.accounts.accounts
    }
}

function mapDispatchToProps(dispatch) {
    return ({
        accountsLoad: () => {
            dispatch(load())
        }       
    })
}
export default connect(mapStateToProps, mapDispatchToProps)(Accounts)
