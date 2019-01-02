import React from 'react' // ← Main React library
import { connect } from 'react-redux'
import { Panel } from 'react-bootstrap';
import Payments from '../payments/payments'
import PaymentSelection from '../paymentSelection/paymentSelection'
import Spinner from './Spinner'
import { get_constants } from '../../actions/constants'
import { findInArray } from '../../util/findInArray'
import {accountsTooltipTable} from '../../util/tooltip'

var dateFormat = require('dateformat');
var FontAwesome = require('react-fontawesome');

class Details extends React.Component{
	constructor(props) {
	super(props);
	this.state = {
    		accs: props.getConstants('acc'), // return null, but launches fetch
    		cats: props.getConstants('cat'), // return null, but launches fetch
    		refreshTime: null,
     	}
	}
    componentWillReceiveProps(nextProps){
    	if( nextProps.constants && nextProps.constants['acc']) {
    		this.setState({
		    		accs : nextProps.constants['acc']
		    })
    	}
    	if( nextProps.constants && nextProps.constants['cat']) {
    		this.setState({
		    		accs : nextProps.constants['cat']
		    })
    	}
    	
    	
    	
    }
	render(){
		var info = '';
		switch(this.props.queryType) {
			case 'd' : 
				info = dateFormat(this.props.params.d, "dd.mm.yyyy ddd")
				break
			case 'a' :
				var acc = findInArray(this.props.constants['acc'], n => { return this.props.params.a === '' + n.value})
				info = 
				<span >
					<span style = {{'marginRight':'5px', 'marginLeft':'5px'}}>
						Account : <FontAwesome name = 'square' style = {{'color': acc.color}} />
					</span>
	    			<span>
	    				{acc.label + ' (' + dateFormat(this.props.params.d1, "dd.mm.yyyy ddd")
	    					+ ' - '+  dateFormat(this.props.params.d2, "dd.mm.yyyy ddd") + ')'}
	    			</span>
	    		</span>
				
				break
			case 'c' : 
				var cat = findInArray(this.props.constants['cat'], n => { return this.props.params.c === '' + n.value})
				info = 
				<span >
					<span style = {{'marginRight':'5px', 'marginLeft':'5px'}}>
						Issue : <FontAwesome name = 'square' style = {{'color': cat.color}} />
					</span>
	    			<span>
	    				{cat.label + ' (' + dateFormat(this.props.params.d1, "dd.mm.yyyy ddd")
	    					+ ' - '+  dateFormat(this.props.params.d2, "dd.mm.yyyy ddd") + ')'}
	    			</span>
	    		</span>
	    		
				break
			case 'g' :
				info = 'Group: ' + this.props.params.g
				break
			case 'l' : 
				info = 'Checked'
				break
			default: info = '';
				break
		}
		var a_table = null
		
		if(this.props.queryType === 'd' && this.props.curves) {
			a_table = accountsTooltipTable(this.props.params.d, this.props.curves, this.props.constants)
		}
		
		return(
			<div>
			  <Panel >
			  	<Panel.Heading style={{paddingTop: "4px", paddingBottom: "3px", height: "45px", fontSize: "23px"}}>
				  	<span style={{display: "flow-root", alignItems: "center"}}>
				  		Payments <span style={{fontSize: "15px"}}>{info}</span><Spinner fetching={this.props.fetching} />
				  		<span className="pull-right">
				  			<PaymentSelection />
				  		</span>
				  	</span>
			  	</Panel.Heading>
			  	<Panel.Body>					
			  	<table>
			  	  <tbody>
				  	  <tr>
	        			<td style={{width: '100%'}}>
		        			<Payments />
		        		</td>
		        		<td style={{width: '30px', verticalAlign: 'top', paddingLeft: '4px'}}>
		        		{a_table}
		        		</td>
		        	   </tr>
	        	   </tbody>
        	      </table>
				</Panel.Body>
			  </Panel>
			</div>					
		)
	}
}

const mapStateToProps = (store) => {
    return {
        fetching: store.payments.fetching,
        queryType: store.payments.queryType,
        params: store.payments.params,
        refreshTime:  store.constants.refreshTime,
        constants: store.constants.constants,
        curves: store.chart.curves
    }
}

function mapDispatchToProps(dispatch) {
    return({
        getConstants: (id) => {
        	get_constants(id, dispatch)
        }
    })
}
export default connect(mapStateToProps, mapDispatchToProps)(Details)
