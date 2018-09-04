import React from 'react';
import { connect } from 'react-redux'
import { Table, Panel, Button } from 'react-bootstrap';
import {fiDateTimeMillis, toFiDBFormat} from '../../util/fiDate'
import currencyFormat  from '../../util/currency'
//import AccountsEditor from '../accountsEditor/AccountsEditor'
//import { load } from '../../actions/auditlog'
//import TextField from './TextField'
import './auditlog.css'

const fields = ['d','i','s','g','c','a','descr']

class AuditLog extends React.Component {
	

	
	constructor(props) {
	    super(props);
/*	    this.state = {
	        logentries: props.logentries
	    }*/
	    //render
	    this.renderLogEntry = this.renderLogEntry.bind(this)
        this.renderPaymentsHeaderT = this.renderPaymentsHeaderT.bind(this)
        this.renderPaymentR = this.renderPaymentR.bind(this)

        //render
        this.renderContentF = this.renderContentF.bind(this)
        
        //css and stuff
        this.tdClassName = this.tdClassName.bind(this)
        this.td = this.td.bind(this)
        this.thClassName = this.thClassName.bind(this)
        this.th = this.th.bind(this)
        
        //choose right value for render
        this.chooseValueF = this.chooseValueF.bind(this)
	}
	
	chooseValueF(p, field) {
		//'w','o','d','i','s','g','c','a','descr'
    	switch(field) {
	    	case 'w' : return fiDateTimeMillis(p.hd)
	    	case 'op' : {
	    		switch(p.op) {
	    		case 'C' : return 'creation'
	    		case 'U' : return 'modification'
	    		case 'D' : return 'deletion'
	    		}
	    	}
	    		
	    	case 'd' : return toFiDBFormat(p.d)
	    	case 'i' : return currencyFormat(p.i)
	    	case 's' : return p.s ? 'X' : '-'
	    	case 'g' : return p.g
	    	case 'c' : return p.c_descr
	    	case 'a' : return p.a_descr
	    	case 'descr' : return p.descr
    	}
    	
	}
	
	renderContentF(value) {
			return(		
			<div>
			  	{value}
		    </div>)
    }
	
	thClassName(field) {
		return field + '_header' 
	}
	
	th(field, label = null) {
		var labelField = (
				<div >
  						{label}
		  		</div>)
		return(
		<th className={this.thClassName(field)}>
  			<div>
	  			<span style={{display: "flex"}}>			  						
	  				{label !== null ? labelField : ''}
	  			</span>
	  		</div>
		</th>)
	}

	renderPaymentR(r, index) {
	    	return(
    	<tr key={r.hs[index].id+'_'+r.hs[index].rownr}>
	 		{['w','op', ...fields].map( (f) => { 
	 			return this.td(r, index, f) 
	 		})}
		</tr>)
    }
	
	tdClassName(r, index, field) {
		var ret = field + '_cell' 
		if(r.hs[index].op == 'U' 
		   && (fields.indexOf(field) > -1) 
		   && r.hs[index][field] !== r.hs[index - 1][field]) {
			ret += ' updatedRow'
		}
		if(index == r.rownr) {
			ret += ' actualRow'
		}
		return ret
	}
	

	
	td(r, index, field) {
		var value = this.chooseValueF(r.hs[index], field)
		return (
		<td key={r.hs[index].id + '_' + index+'_'+field} className={this.tdClassName(r, index, field)}>
		      		{this.renderContentF(value)}	
		</td>)
	}
	
	renderPaymentsHeaderT = () => {
    	return (
		<thead>
	  		<tr>
	  			{this.th('w', 'When')}
	  			{this.th('op','What')}
	  			{this.th('d', 'Date')}
	  			{this.th('i', 'Pay')}
	  			{this.th('s', 's')}
	  			{this.th('g', 'Ref')}
	  			{this.th('c', 'Issue')}
	  			{this.th('a', 'Account')}
	  			{this.th('descr', 'Desc.')}		  			
			</tr>				  			
		</thead>)
    }
	
	renderLogEntry(r) {
		console.log("renderLogEntry:")
		console.log(r)
		return (
		
		<Panel key={'al_panel_'+r.hs[0].id+'_'+r.rownr} >
	        <Panel.Heading >
	            <Panel.Title >
	            	{this.chooseValueF(r.hs[r.rownr], 'o')} at { fiDateTimeMillis(r.hs[r.rownr].hd) } ( id: {r.hs[0].id} )
				</Panel.Title >
			 </Panel.Heading >	
			 <Panel.Body>			
				<div>
					<Table id="auditlog_table" key={'al_table_'+r.id} striped bordered hover condensed>
						{
							this.renderPaymentsHeaderT()
						}
						<tbody>
						  	{
						  		r.hs.map((p, ix) => { return this.renderPaymentR(r, ix) })
						  	}
						</tbody>
					</Table>
				</div>
			</Panel.Body>
		</Panel >
		
		)
	}
	
	render() {
		
		var entries = this.props.logentries || []
		console.log("RENDER:")
		console.log(entries)
		/*return(
			<div>
			  <Panel >
			  	<Panel.Heading style={{paddingTop: "4px", paddingBottom: "3px", height: "45px", fontSize: "23px"}}>
				  	<span style={{display: "flow-root", alignItems: "center"}}>
				  		Audit log 
				  	</span>
			  	</Panel.Heading>
			  	<Panel.Body>
					<div>
							{entries.map((r) => this.renderLogEntry(r))}
				    </div>
				</Panel.Body>
			  </Panel>
			</div>
			)*/
		return(
			<div>
				{entries.map((r) => this.renderLogEntry(r))}
			</div>
		)
	}
}

const mapStateToProps = (store) => {
    return {
    	//TODO
        logentries: store.auditlog.logentries
    }
}

/*function mapDispatchToProps(dispatch) {
    return ({
    	//TODO
        auditlogLoad: () => {
            dispatch(load())
        }       
    })
}*/
export default connect(mapStateToProps)(AuditLog)
