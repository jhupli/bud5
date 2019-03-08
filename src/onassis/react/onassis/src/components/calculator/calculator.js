import React from 'react';
import { connect } from 'react-redux'
import { Panel, Table, Button } from 'react-bootstrap'
import CurrencyField from '../editorFields/CurrencyField'
import './Calculator.css'
import currencyFormat from '../../util/currency'

var FontAwesome = require('react-fontawesome')

class Calculator extends React.Component {
	constructor(props) {
        super(props)
        this.changeValue = this.changeValue.bind(this)
        this.newRow = this.newRow.bind(this)
        this.clear = this.clear.bind(this)
        this.state = { 
        	rows: []
        }
	}
	
	changeValue(value, field, index) {
		console.log('changePropertyF: '+value+' index:'+index)
		var rows = this.state.rows.slice()
		rows[index] = value
		this.setState({
			'rows': rows
		})
    }
	
	newRow() {
		var rows = this.state.rows.slice()
		rows.push('0.00')
		
		this.setState({
			'rows': rows
		})
	}
	
	componentWillReceiveProps(nextprops) {
		if(nextprops.ts !== this.props.ts) {
			var rows = this.state.rows.slice()
			rows.push(nextprops.p)
		
			this.setState({
				'rows': rows
			})
		}
	}
	
	clear() {
		this.setState({
			'rows': []
		})
	}
	
	render() {
		//if(this.state.rows.length === 0) return null
			
		var sum = 0
		this.state.rows.map( r => {
			sum += Number(r)
			return null
		} )
		return(
			<div >
			  <Panel  >
			  	<Panel.Heading style={{padding: "5px", height: "30px", fontSize: "15px"}}>
				<span className="pull-right" style={{display: "inline-flex"}}>  	
					{currencyFormat(sum)}
				</span>
			  	</Panel.Heading>
			  	<Panel.Body style={{padding: "2px"}}>
			  	{this.state.rows.length === 0 ? null : 
			  	<Table id="calc_table" style={{marginBottom: '10px'}} striped hover condensed>
				<tbody style={{border: 'none'}}>
				
				{this.state.rows.map( (row, index) => {
					return(
					<tr key={'calr'+index}>		
					<td style={{border: 'none', padding: '0px', margin: '0px'}}>
					
			  		<CurrencyField 
			  				id = 'calcf'
					  		onValueChanged = {this.changeValue}
					  		placeholder = 'amount'
					  		value = {row}
					  		readOnly = {false}
				  			field = 'calc'
				  			index = {index}
				  			touched = {false}
			  		/>
			  		</td>
			  		</tr>
			  		
					)})
				}
				
				</tbody>
			</Table>}
	          <span className="pull-right" style = {{"display": "inline-flex", 
              "whiteSpace": "nowrap",
                'marginLeft':'1px'}}>
				<Button onClick={this.newRow}><FontAwesome name = 'plus' /></Button>
				{this.state.rows.length === 0 ? null : <Button style= {{fontStyle: 'italic', fontWeight: 'bold'}} onClick={this.clear}>C</Button> }
				</span>
				</Panel.Body>

			  </Panel>
			</div>
			)
	}
}

const mapStateToProps = (store) => {
    return {
        p: store.calculator.p,
        ts: store.calculator.ts
    }
}

export default connect(mapStateToProps)(Calculator)
