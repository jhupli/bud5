import React from 'react';
import { Table } from 'react-bootstrap';
import {chooseValueF} from './logCommons'

const fields = ['d','i','s','g','c','a','descr']

class LogEntry extends React.Component {
		
	constructor(props) {
	    super(props);

	    //render
        this.renderLogHeaderT = this.renderLogHeaderT.bind(this)
        this.renderLogR = this.renderLogR.bind(this)

        //render
        this.renderContentF = this.renderContentF.bind(this)
        
        //css and stuff
        this.tdClassName = this.tdClassName.bind(this)
        this.td = this.td.bind(this)
        this.thClassName = this.thClassName.bind(this)
        this.th = this.th.bind(this)
        
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
		
		if(index === r.rownr || this.props.singleEntry) {
			ret += ' actualRow'
		}
		return ret
	}
	

	
	td(r, index, field) {
		var value = chooseValueF(r.hs[index], field)
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
	
	render() {
		if(this.props.logEntry == null) return null
		var r = this.props.logEntry
		return(
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
		)
	}
}

export default LogEntry
