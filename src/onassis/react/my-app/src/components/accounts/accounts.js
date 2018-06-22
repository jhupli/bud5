import React from 'react';
import { connect } from 'react-redux'
import { Panel } from 'react-bootstrap'
import AccountsEditor from '../accountsEditor/AccountsEditor'
import { load } from '../../actions/accounts'

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
	    this.props.accountsLoad()
	}
	
	render() {
		return(
<div>
<table>
<th><td>id : 503                </td><td>crud      </td><td>date      </td><td>sum   </td></th>
<tr><td>        </td><td>Created</td><td>88.88.2018</td><td>vuokra    </td><td>auto  </td></tr>
<tr><td>2018-06-05 15:20:02.024></td><td>Created   </td><td>88.88.2018</td><td>vuokra</td></tr>
</table>
	<span style={{
		 fontFamily: 'monospace', 
		 whiteSpace: 'pre-wrap',
		 display: 'block'
	}}>
	
	
	
id: 503                 |crud     |date      |sum        |category   |account    |group      |s|descr<br/>
------------------------|---------|----------|-----------|-----------|-----------|-----------|-|-----<br/>
                        |Created  |88.88.2018 |-1000000.00|vuokra    |aktia      |           |1|<br/>
2018-06-05 15:20:02.024 |Updated  |6.12.2018 |-1000000.00|vuokra     |aktia      |           |1|<br/>
&nbsp;                       |Updated  |6.12.2018 |-1000000.00|vuokra     |aktia      |           |1|<br/>
<br/>			                        
id: 503                 |crud     |date      |sum        |category   |account    |group      |s|descr<br/>
------------------------|---------|----------|-----------|-----------|-----------|-----------|-|-----<br/>
                        |Created  |88.88.2018 |-1000000.00|vuokra    |aktia      |           |1|<br/>
2018-06-05 15:20:02.024 |Updated  |6.12.2018 |-1000000.00|vuokra     |aktia      |           |1|<br/>
                        |Updated  |6.12.2018 |-1000000.00|vuokra     |aktia      |           |1|<br/>
<br/>			                        
	</span>

</div>			
			)
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
