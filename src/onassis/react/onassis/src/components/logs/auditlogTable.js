import React from 'react';
import { Table, Panel } from 'react-bootstrap';
import {fiDateTimeMillis, toFiDBFormat} from '../../util/fiDate'
import currencyFormat  from '../../util/currency'

const fields = ['d','i','s','g','c','a','descr']

class AuditLogTable extends React.Component {
	
	constructor(props) {
	    super(props);

	    //render
	    this.renderLogEntry = this.renderLogEntry.bind(this)
        this.renderLogHeaderT = this.renderLogHeaderT.bind(this)
        this.renderLogR = this.renderLogR.bind(this)

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
	    		default : console.log('UNKONWN op:' + p.op)
	    				  return null
	    		}
	    	}
	    		
	    	case 'd' : return toFiDBFormat(p.d)
	    	case 'i' : return currencyFormat(p.i)
	    	case 's' : return p.s ? 'X' : '-'
	    	case 'g' : return p.g
	    	case 'c' : return p.c_descr
	    	case 'a' : return p.a_descr
	    	case 'descr' : return p.descr
	    	default : console.log('UNKONWN field: '+field)
	    			return null
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

	renderLogR(r, index) {
	    	return(
    	<tr key={r.hs[index].id+'_'+r.hs[index].rownr}>
	 		{['w','op', ...fields].map( (f) => { 
	 			return this.td(r, index, f) 
	 		})}
		</tr>)
    }
	
	tdClassName(r, index, field) {
		var ret = field + '_cell' 
		if(r.hs[index].op === 'U' 
		   && (fields.indexOf(field) > -1) 
		   && r.hs[index][field] !== r.hs[index - 1][field]) {
			ret += ' updatedRow'
		}
		debugger
		if(index === r.rownr || this.props.single) {
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
	
	renderLogHeaderT = () => {
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
		var table =
					<Table id="auditlog_table" key={'al_table_'+r.id} striped bordered hover condensed>
						{
							this.renderLogHeaderT()
						}
						<tbody>
						  	{
						  		r.hs.map((p, ix) => { return this.renderLogR(r, ix) })
						  	}
						</tbody>
					</Table>
		
		if(this.props.single) {
			return( <>
					{table}
					</>
			)
		}
		
				
		return (
		
		<Panel key={'al_panel_'+r.hs[0].id+'_'+r.rownr} >
				<Panel.Heading >
				<Panel.Title >
	            	{this.chooseValueF(r.hs[r.rownr], 'op')} at { fiDateTimeMillis(r.hs[r.rownr].hd) } ( id: {r.hs[0].id} )
				</Panel.Title >
	            </Panel.Heading >
			 <Panel.Body>
			 	{table}
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

AuditLogTable.defaultProps = {
		single: false
}
export default AuditLogTable
