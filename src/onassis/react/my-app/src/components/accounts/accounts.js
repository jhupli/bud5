import React from 'react';
import { connect } from 'react-redux'
import { Panel } from 'react-bootstrap'
import AccountsEditor from '../accountsEditor/AccountsEditor'

/*
 * package test;

public class Test {

	public static void main(String[] args) {
		// TODO Auto-generated method stub
		String format = "%-24.24s|%-8.8s|%-11.11s|%15.15s|%-10.10s|%-10.10s|%-8.8s|%-1.1s|%s";
		String forma2 = "%-24.24s+%-8.8s+%-11.11s+%15.15s+%-10.10s+%-10.10s+%-8.8s+%-1.1s+%s";
		System.out.println(String.format(format, "id : 100","crud","date","sum","category","account","group","s","descr"));
		System.out.println(String.format(format, "------------------------","--------","-----------","---------------","----------","----------","--------","-","-----"));
		System.out.println(String.format(format, "","Updated","88.88.8888","-88888888.88","5","6","7","8","9"));
		System.out.println(String.format(format, "2018-06-05 15:20:02.024","Updated","88.88.8888","-88888888.88","ananasakäämä","rukkanen","joulu","X","tämä nyton sellaista höörönlööröö"));
		System.out.println(String.format(format, "","Updated","88.88.8888","-88888888.88","5","6","7","8","9"));
//				"2018-06-05 15:20:02.024"
//				 123456789012345678901234567890
	}

}
 */

class Accounts extends React.Component {
	constructor(props) {
	    super(props);
	    this.state = {
	        accounts: []
	    }
	    //this.props.accountsLoad() //loaded as needed
	}
	
	render() {
		return(
			<div>
			  <Panel >
			  	<Panel.Heading style={{paddingTop: "4px", paddingBottom: "3px", height: "45px", fontSize: "23px"}}>
				  	<span style={{display: "flow-root", alignItems: "center"}}>
				  		Accounts 
				  	</span>
			  	</Panel.Heading>
			  	<Panel.Body>					
					<AccountsEditor initAccounts={this.props.accounts} />
				</Panel.Body>
			  </Panel>
			</div>
			)
	}
}

const mapStateToProps = (store) => {
    return {
        accounts: store.accounts.accounts
    }
}

export default connect(mapStateToProps)(Accounts)
