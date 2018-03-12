import React from 'react'
import { render } from 'react-dom' 
import { connect } from 'react-redux'

import { update } from '../../actions/payments'
import { payment_selection } from '../../actions/payment'
import { CATEGORY } from '../../actions/categories'
import { ACCOUNT } from '../../actions/accounts'


import { Table, Panel, Button, Heading, Title, Toggle, Collapse, Body} from 'react-bootstrap';



import LockField from '../editorFields/LockField'
import CurrencyField from '../editorFields/CurrencyField'
import CheckboxField from '../editorFields/CheckboxField'
import DropdownField from '../editorFields/DropdownField'
import TextField from '../editorFields/TextField'
import TextareaField from '../editorFields/TextareaField'
import DateField from '../editorFields/DateField'
//import Recur from '../recur/recur' 

import NumericInput from 'react-numeric-input';
import {addDays} from '../../util/addDays'

import './PaymentsEditor.css'
import '../../customMultiSelect.css'

import {SimpleSelect} from 'react-selectize'

import {toDateFi} from '../../util/fiDate'

import recurrent from './recurrent'
//import { withMedia } from 'react-media-query-hoc';


import {
		fields,
		initState,
		defaultValues,
		initialMaskValues, 
		validators,
		preInitFormat,
		preSubmitFormat,
		oneIsTrue,
		copyArray,
		recurSpans,
		copyPayment
} from './constants'

var dateFormat = require('dateformat')
var FontAwesome = require('react-fontawesome')

var tempId = -1
var checkedSet = []

class PaymentsEditor extends React.Component {
    constructor(props) {
        super(props)
        //postfix -abbr. F = Field, R = Row, T = Table
        
        //Field related:
        
        //callbacks from uicomponents for updating model (state)
        this.changePropertyF = this.changePropertyF.bind(this)
        this.changePropertyDeletedF = this.changePropertyDeletedF.bind(this)
        this.changePropertyLF = this.changePropertyLF.bind(this)
        
        //set state values:
        this.setValueF = this.setValueF.bind(this)
        this.setValueCheckF = this.setValueCheckF.bind(this)
        this.setValueCheckAllF = this.setValueCheckAllF.bind(this)
        this.setValueMaskF = this.setValueMaskF.bind(this)
        this.setValueMaskCheckF = this.setValueMaskCheckF.bind(this)
        
        //validate:
        this.validateF = this.validateF.bind(this)
        this.validateMaskF = this.validateMaskF.bind(this) 
        
        //some field related util;
        this.maskedF = this.maskedF.bind(this) //is field masked 
        this.touchedF = this.touchedF.bind(this) //dirty?
        this.isDifferentFromInitialF = this.isDifferentFromInitialF.bind(this)        

        //choose right value for render
        this.chooseValueF = this.chooseValueF.bind(this)

        //render
        this.renderContentF = this.renderContentF.bind(this)
        this.renderDeletedContentF = this.renderDeletedContentF.bind(this)
        
        //sort
        this.setSortF = this.setSortF.bind(this)
        this.sortersF = this.sortersF.bind(this)
        
        //Row related:
        
        //add/remove
        this.addR = this.addR.bind(this)
        this.getDefaultR = this.getDefaultR.bind(this) //choose values for new row
        this.removeR = this.removeR.bind(this)
        this.setRecurring = this.setRecurring.bind(this)
        this.setRecurringTimes = this.setRecurringTimes.bind(this)
        this.setRecurringSpan = this.setRecurringSpan.bind(this)
        
        //validate
        this.validateR = this.validateR.bind(this)
        this.readOnlyR = this.readOnlyR.bind(this)
        
        //utils
        this.isPersistedR = this.isPersistedR.bind(this)
        this.disabledCheckR = this.disabledCheckR.bind(this) //row selection disabled

        //render
        this.renderPaymentR = this.renderPaymentR.bind(this)

        //Table related:
        this.resetT =  this.resetT.bind(this)
        //util
        this.isPristineT = this.isPristineT.bind(this)
        this.hasErrorsT = this.hasErrorsT.bind(this)
        
        //format input/output
        this.preInitT = this.preInitT.bind(this)
        this.preSubmitT = this.preSubmitT.bind(this)
        
        //init constants
        this.init =  this.init.bind(this)
        //render
        this.renderPaymentsT = this.renderPaymentsT.bind(this)

        //css and stuff
        this.tdClassName = this.tdClassName.bind(this)
        this.td = this.td.bind(this)
        this.thClassName = this.thClassName.bind(this)
        this.th = this.th.bind(this)
        
        this.init()
        this.state = {...initState(this.preInitT(props.initPayments), checkedSet)}
    }

    changePropertyF(value, field, index) {
    	if(index === -1){ //mask checkbox
    		this.setValueMaskCheckF(field, value)
    		return
    	}
    	
    	if(index === -2){ //mask value
    		this.validateMaskF(field, value)
    		this.setValueMaskF(field, value)
    		return
    	}
    	
    	//touch
		if (this.isPersistedR(index)) { //new rows do not get 'touched' (unless masked)
			var copy = copyArray(this.state.touched)
			copy[index][field] = this.isDifferentFromInitialF(value, field, index)
			this.setState({touched : copy})
		}
		
		//validate
		if(!this.state.masked[field]) { //do not validate masked fields
			this.validateF(field, value, index)
		}
    	this.setValueF(value, field, index)
    }
    
    changePropertyDeletedF(value, field, index) {
    	if(this.isPersistedR(index)) { //if it has id, let backend remove: mark as deleted
    		this.deleteCount += (value ? 1 : -1)
    		var copy = copyArray(this.state.deleted)
    		copy[index] = value
    		this.setValueCheckF( false, 'check', index)
    		this.setState({deleted : copy})
    	} else {
    		this.removeR(index) //if newly created, just remove it
    	}
    }
    
	changePropertyLF(value, field, index) { //updated on-the-fly, so don't set touched, set initial
		var valuesCopy = copyArray(this.state.values)
		valuesCopy[index].l = value
		var initialCopy = copyArray(this.state.initial)
		initialCopy[index].l = value
		this.setState({
			values : valuesCopy,
			initial : initialCopy
		})
	}

	setValueF(value, field, index) {
		var copy = copyArray(this.state.values)
		copy[index][field] = value
		this.setState({values : copy})
	}

	setValueCheckF(value, field, index) {
		this.updateCheckedSet(value, index)
		this.setValueF(value, 'check', index)
		this.props.paymentSelection(checkedSet.slice(0))  //broadcast
	}
	
	setValueCheckAllF(value, field, index) {
		var copy = this.state.values.slice(0)
		copy.map( (v) => { 
			this.updateCheckedSet(value, v.index, copy) 
		})
		this.setState({
			values: copy,
			allChecked : value
		})
		this.props.paymentSelection(checkedSet.slice(0))
	}
	
	setValueMaskF(field, value) {
		var copy = {...this.state.maskValues}
		copy[field] = value
		this.setState({maskValues : copy})
	}
	
	setValueMaskCheckF(field, set) {
	    var copy = {...this.state.masked}
		copy[field] = set
		this.setState({masked : copy})
		
		//clear/set errors of existing maskValues
		copy = {...this.state.maskErrors}
		copy[field] = !set ? null : validators[field](this.state.maskValues[field])
		this.setState({maskErrors : copy})

		//clear/set errors of existing values masked
		var copy = copyArray(this.state.errors)
		this.state.values.forEach( (v, index) => {
			copy[index][field] = set ? null : validators[field](v[field])
		})
		this.setState({errors : copy})
	}
	
	validateF(field, value, index) {
		var original = this.state.errors[index][field]
		var result = validators[field](value) 
		if( result != original ) {
			var copy = copyArray(this.state.errors)
			copy[index][field] = validators[field](value) 
			this.setState({errors : copy})
		}
	}
	
	validateMaskF(field, value) {
		var copy = {...this.state.maskErrors}
		copy[field] = !this.state.masked[field] ? null : validators[field](value)
		this.setState({maskErrors : copy})
	}
	
	maskedF(index, field) {
		if(index<0 || this.state.deleted[index]) return false
		return this.state.masked[field] && !this.state.values[index].l
	}
		
	touchedF(index, field) {
		if(index<0) return false //mask-controls are never touched (-1 = checkbox -2 = mask value)
		if(this.state.deleted[index]) return false 	//to be deleted: not touched
		if(this.maskedF(index, field) && 
		   this.isPersistedR(index) && 
		   !this.isDifferentFromInitialF(this.state.maskValues[field], field, index)) return false //if masked and different: it is touched
		if(this.maskedF(index, field)) return true
		if(!this.isPersistedR(index)) return false 	//this is a new row: not touched and not masked
		return this.state.touched[index][field]
	}
	
	isDifferentFromInitialF(value, field, index) {
		return (value != this.state.initial[index][field])
	}

	chooseValueF(index, field) {
		if(this.state.deleted[index]) return this.state.initial[index][field] //show initial values if to be deleted
		return this.maskedF(index, field) ? this.state.maskValues[field] : this.state.values[index][field] 
	}
	
	renderContentF(field, index) {
    	if(index == -1) {//mask -checkbox
    		return(
	    	<div>
		  		<CheckboxField 
			  		id = {field + '_mask_check'}
			  		onValueChanged = {this.changePropertyF}
			  		checked = {this.state.masked[field]}
			  		readOnly = {false}
		  			field = {field}
		  			index = {-1}
		  			click = {this.sort}
			  	/>
		    </div>)
    	}

    	if(index == -2 && !this.state.masked[field]) return //draw maskValue only if masked
    	
    	var  value = null
    	if(index == -2) { //mask value
    		value = this.state.maskValues[field]
    	} else {
    	   value = this.chooseValueF(index, field)
    	}
    	
    	switch(field) {
    	case 'check' :
    				return(
				  	<div>
				  		<CheckboxField 
					  		id = {'check_' + index}
					  		onValueChanged = {this.setValueCheckF}
					  		checked = {value}
					  		readOnly = {this.disabledCheckR(index)}
				  			field = 'check'
				  			index = {index}
				  			touched = {false}
					  	/>
				    </div>)
    	case 'l' :
					return(
				  	<div>
				  		<LockField 
					  		id = {this.state.values[index].id}
					  		onValueChanged = {this.changePropertyLF}
					  		checked = {value}
					  		readOnly = {
				  				!this.isPersistedR(index) 
				  				|| this.state.deleted[index] 
					  			|| oneIsTrue(this.state.masked)
					  			|| oneIsTrue(this.state.touched[index])
					  		}
				  			field = 'l'
				  			index = {index}
					  	/>
				    </div>)					    
    	case 'd' :
					return(		
					<div>
				    	<DateField 
				    		id = {'d_'+index}
					  		onValueChanged = {this.changePropertyF}
					  		value = {value}
					  		readOnly = {this.readOnlyR(index, 'd')}
				  			field = 'd'
				  			index = {index}
				  			touched = {this.touchedF(index, 'd')}
				    	 />
				    </div>)
    	case 'i' :
					return(
				  	<div>
				  		<CurrencyField 
					  		id = {'i_'+index}
					  		onValueChanged = {this.changePropertyF}
					  		placeholder = 'amount'
					  		value = {value}
					  		readOnly = {this.readOnlyR(index, 'i')}
				  			field = 'i'
				  			index = {index}
				  			touched = {this.touchedF(index, 'i')}
					  	/>
				    </div>)
    	case 's' :
					return(
				  	<div>
				  		<CheckboxField 
					  		id = {'s_' + index}
					  		onValueChanged = {this.changePropertyF}
					  		checked = {value}
					  		readOnly = {this.readOnlyR(index, 's')}
				  			field = 's'
				  			index = {index}
				  			touched = {this.touchedF(index, 's')}
					  	/>
				    </div>)					    
    	case 'g' :
					return(
				  	<div>
				  		<TextField 
					  		id = {'g_'+index}
					  		onValueChanged = {this.changePropertyF}
					  		value = {value}
					  		readOnly = {this.readOnlyR(index, 'g')}
				  			field = 'g'
				  			index = {index}
				  			touched = {this.touchedF(index, 'g')}
				  			placeholder = 'gId'
					  	/>
				    </div>)
    	case 'c' :
     	case 'a' :
					return(
				  	<div>
				  		<DropdownField 
				  			onValueChanged = {this.changePropertyF}
				  			value = {value}
				  			readOnly = {this.readOnlyR(index, field)}
				  			placeholder = 'select'
				  			field = {field}
				  			index = {index}
				  			touched = {this.touchedF(index, field)}
				  			constants_id = {field === 'a' ? ACCOUNT : CATEGORY}
					  	/>
				    </div>)
     	case 'descr' :
					return(
				  	<div>
				  		<TextareaField 
					  		id = {'descr_'+index}
					  		onValueChanged = {this.changePropertyF}
					  		value = {value}
					  		readOnly = {this.readOnlyR(index, 'descr')}
				  			field = 'descr'
				  			index = {index}
				  			touched = {this.touchedF(index, 'descr')}
				  			placeholder = 'description'
				  			width = '180px'
					  	/>
				    </div>)					    
    	}
    }
	
	renderDeletedContentF(index) {
		if(!this.isPersistedR(index)) { 
			return(
			<button 
		  		type="button" 
		  		className="form-control"  
		  		onClick={() => this.changePropertyDeletedF(true, 'deleted', index)}>
		  		<FontAwesome name = 'remove' style = {{'color': 'red'}}/>
		    </button>)
		}
	  		
		return(
	  	<div>
	  		<CheckboxField 
		  		id = {'deleted_'+index}
		  		onValueChanged = {this.changePropertyDeletedF}
		  		checked = {this.state.deleted[index]}
		  		readOnly = {this.state.values[index].l}
	  			field = 'deleted'
	  			index = {index}
	  			touched = {false}
		  	/>
	    </div>)
	}
		
	setSortF(field) {
		console.log(field)
		if(!this.state.sort || this.state.sort !==field) {
			this.setState({
				sort : field,
				asc : true
			})
			return
		}
		if(this.state.sort === field && this.state.asc) {
			this.setState({
				asc : false
			})
			return
		}
		this.setState({
			sort : null
		})
		return
	}

	sortersF() {
		var inv = this.state.asc ? -1 : 1
		switch(this.state.sort) {
		case 'i': 
		//TODO: a:n ja c:n tekstiarvolla sorttaus ei id:llä
		case 'a':
		case 'c':
			return (a, b) => {
				return inv * 
				(this.chooseValueF(b.index,this.state.sort) - this.chooseValueF(a.index,this.state.sort))
			}
		case 'd': 
			return (a, b) => {
				return inv * 
				(toDateFi(this.chooseValueF(b.index,'d')).getTime() - toDateFi(this.chooseValueF(a.index,'d')).getTime())
			}
		case 'g':
			return (a, b) => {
				 var textA = this.chooseValueF(a.index,'g').toUpperCase()
				 var textB = this.chooseValueF(b.index,'g').toUpperCase()
				 return inv * 
				 ((textA < textB) ? -1 : (textA > textB) ? 1 : 0)
			}
		}
	}
		
	addR() {
		var defaults = this.getDefaultR()
    	var valuesCopy = copyArray(this.state.values)
    	var errorsCopy = copyArray(this.state.errors)
    	var count = 1
    	
    	if(this.state.recurring.recur) {
    		count = this.state.recurring.times
    	}
		
		for(var i=0; i<count; i++) {
			defaults = copyPayment(defaults, [])
			defaults.id = tempId--
			defaults.index = valuesCopy.length
			defaults.l = false
			defaults.check = false
				
			if(this.state.recurring.recur) {
				recurrent(defaults, i, this.state.recurring.span.value)
			}
			
			valuesCopy.push(defaults)
			this.sortedValues.push(defaults)
			errorsCopy.push(this.validateR(defaults)) 
		}
		this.setState({
    		    	values : valuesCopy,
    		    	errors : errorsCopy,
    	})
    }
	
	setRecurring() {
		this.setState({
			recurring : { ...this.state.recurring, recur: !this.state.recurring.recur }
    	})
	}
	
	setRecurringTimes(times) {
		this.setState({
			recurring : { ...this.state.recurring, times: times }
    	})
	}
	
	setRecurringSpan(span) {
		this.setState({
			recurring : { ...this.state.recurring, span: span }
    	})
	}
	
	getDefaultR() {
		var last = defaultValues
		if (this.sortedValues.length){
			last = this.sortedValues[this.sortedValues.length - 1]
		}

		var res = {...last}
		return res
	}
    
    removeR(index) {
    	this.state.values.splice(index, 1)
        var values_copy = copyArray(this.state.values)
        this.state.errors.splice(index, 1)
    	var errors_copy = copyArray(this.state.errors)

    	//reindex:
    	for(var ix=index ; ix<values_copy.length ;ix++) {
    		values_copy[ix].index--
    		errors_copy[ix].index--
    	}
    	this.setState({
    		    	values : values_copy,
    		    	errors : errors_copy,
    	})
    }
    
    validateR(v) {
	   var res = {}
	   fields.forEach( (field) => {
		   	res[field] = validators[field](v[field])
    	})
    	return res
    }
    
    readOnlyR(index, field) {
		if(index<0) return false  //mask-controls are never readOnly (-1 =checkbox -2 =mask value)
		return this.state.masked[field] ||	//this col is masked?
			   this.state.deleted[index] || //marked as to be deleted?			
			   this.state.values[index].l  //locked?
	}
    
    isPersistedR(index) {
		return this.state.values[index].id >=0
	}
    
    disabledCheckR(index) {
		return !this.isPersistedR(index) ||
			   this.state.deleted[index] 	//marked as to be deleted?			
    }

    renderPaymentR(index) {
    	return(
    	<tr key={index}>
	 		{['check', 'l', ...fields].map( (f) => { 
	 			return this.td(index, f) 
	 		})}
	      	<td className={this.tdClassName(index, 'deleted')}>
	      		{this.renderDeletedContentF(index)}
	      	</td>
		</tr>)
    }
    
	resetT() {
		var state = initState(this.state.initial, checkedSet, this.state.recurring)
		this.setState({...state})
		this.init()
	}
	
	isPristineT() {
		var pristine = true
    	this.state.touched.forEach( (v) => {
    		fields.forEach( (f) => {
    			pristine = pristine && !v[f]
    		})
    	})
    	return pristine &&
    		   (this.state.initial.length == this.state.values.length) && 
    	       !oneIsTrue(this.state.masked) &&
    	       !this.deleteCount 
	}
	
	hasErrorsT() {
		var errors = false
    	this.state.errors.forEach( (v) => {
    		errors = errors || oneIsTrue(v) 
    	})
    	return errors || oneIsTrue(this.state.maskErrors)
	}
	
	preInitT(initialPayments) {
		return preInitFormat(initialPayments, checkedSet)
	}
	
	preSubmitT() {
		var created = []
		this.state.values.forEach((v,index) => {
			if(!this.isPersistedR(index)) {
				var p={}
				fields.forEach( (field) =>
				{
					 p[field] = this.chooseValueF(index, field)
				})
				created.push(p)
			}
		}) 
		
		var deleted = []
		this.state.deleted.forEach((v,i) => {
			if(v) {
				deleted.push(this.state.values[i].id)
			} 
		})
		
		var modified = []
		for(var index=0; index<this.state.values.length; index++) {
			if(this.isPersistedR(index)) {
				var p={}
				fields.forEach((field) => {
					 if(this.touchedF(index, field)) {
						 p.id = this.state.values[index].id
						 p[field] = this.chooseValueF(index, field)
					 }
				 })
				 if(Object.keys(p).length > 0){
					 modified.push(p)
				 }
			}
		}
		var updates = {
				'created' : preSubmitFormat(created),
				'deleted' : deleted,
				'modified' : preSubmitFormat(modified)
		}
		//console.log(JSON.stringify(updates,null,4))
		//"submit"
		this.props.update(updates)
	}

    init() {
        this.deleteCount = 0
        this.pristine = null
        this.errors = null
        this.allChecked = false
    }

	renderPaymentsT = () => {
		this.sortedValues = this.state.values.slice(0)
		this.sortedValues.sort(this.sortersF())
		
		return (
		<div>
			<div>

	        <Panel id="collapsible-panel-example-3" defaultExpanded>
	          <Heading>
	            <Title>Title that functions as a collapse toggle</Title>
	            <Toggle componentClass="a">My own toggle</Toggle>
	          </Heading>
	          <Collapse>
	            <Body>

	            </Body>
	          </Collapse>
	        </Panel>
			
			
			
			
			
				<CheckboxField 
					style={{
				    	width: '32px'
					}}
			  		id={'recurring_add'}
			  		onValueChanged={this.setRecurring}
			  		checked={this.state.recurring.recur}
			  		readOnly={false}
		  			field = {'recurring_add'}
		  			index = {-3}
		  			touched = {false}
			  	/>
				<SimpleSelect
					style={{
				    	width: '170px'
					}}
					onValueChange={this.setRecurringSpan}
					placeholder='choose span'
					options = {recurSpans}
					value = {this.state.recurring.span}
					hideResetButton = {true}
				/>
				<NumericInput 
					id="recurringTimes"
					min={1} 
					step={1} 
					precision={0} 
					max={365} 
					value={this.state.recurring.times} 
					onChange={this.setRecurringTimes} 
					/>
					<Button onClick={() => this.addR()}>Add New</Button>
					
					{/*this.pristine ? 'pristine' : 'not pristine'*/}
					{/*this.errors ? ' errors' : ' no errors'*/}
					<Button onClick={() => this.resetT()}>Reset</Button>
					<Button onClick={() => this.preSubmitT()}>Submit</Button>
					  
			</div>
			

			
			<Table id="payments_table" striped bordered hover condensed>
			  	<thead>
			  		<tr>
			  			<th className={this.thClassName('check')}>
				  			<CheckboxField 
						  		id={'check_all'}
						  		onValueChanged={this.setValueCheckAllF}
						  		checked={this.state.allChecked}
						  		readOnly={false}
					  			field = {'check_all'}
					  			index = {-2}
					  			touched = {false}
						  	/>
			  			</th>
				  		<th className={this.thClassName('l')} />
			  			{this.th('d', 'Date')}
			  			{this.th('i', 'Pay')}
			  			<th className={this.thClassName('s')} />
			  			{this.th('g', 'Ref')}
			  			{this.th('c', 'Issue')}
			  			{this.th('a', 'Account')}
			  			{this.th('descr')}		  			
			  			<th className={this.thClassName('deleted')}>
			  				<FontAwesome name='remove' style={{'color': 'red'}}/>
			  			</th>
					</tr>				  			
				</thead>
				<tbody>
				  	{this.sortedValues.map((p) => this.renderPaymentR(p.index))}
				</tbody>
			</Table>
		</div>)
	}
		
	tdClassName(index, field) {
		return field + '_cell' + 
			   (!this.isPersistedR(index) ? ' newRow' : '') +
			   (this.state.deleted[index] ? ' deleted' : '') +
			   (this.state.values[index].check ? ' selected' : '') +
			   (this.state.errors[index][field] ? ' error' : '')
	}
	
	td(index, field) {
		return (
		<td key={index+'_'+field} className={this.tdClassName(index, field)}>
		      		{this.renderContentF(field, index)}	
		</td>)
	}
	
	thClassName(field) {
		return field + '_header' + 
			   (this.state.maskErrors[field] ? ' error' : '') + 
			   (oneIsTrue(this.state.masked) ? ' header_tall' : '')
	}
	
	th(field, label = null) {
		var arrow = (<FontAwesome name = {this.state.asc ? 'sort-asc' : 'sort-desc'} />)

		var sortField = (<div>{this.state.sort === field ? arrow : ''}</div>)
		
		var labelField = (
				<div  style={{marginTop: 8}}>
  					<a  onClick={() => {this.setSortF(field)}}>
  						{label}
  					</a>
		  		</div>)
		return(
		<th className={this.thClassName(field)}>
  			<div>
	  			<span style={{display: "flex"}}>			  						
	  				{this.renderContentF(field, -1)}
	  				<div style={{marginTop: 8, paddingRight: 3}}>
	  					{sortField}
	  				</div>
	  				{label !== null ? labelField : ''}
	  			</span>
	  		</div>
	  		{this.renderContentF(field, -2)}
		</th>)
	}
	
	componentWillReceiveProps(nextprops) {
		this.init()
		this.setState(
				{...initState(this.preInitT(nextprops.initPayments), checkedSet)}
		)
	}

	updateCheckedSet(value, index, values = null) {
		if(index<0 || this.disabledCheckR(index)) return
		var pos = checkedSet.indexOf(this.state.values[index].id)
		if(value && pos <= 0) {
			checkedSet.push(this.state.values[index].id)
		} if(pos > -1) {
			checkedSet.splice( pos, 1 )
		}
		if(values) values[index].check = value
	}
	
	render() {
		this.pristine = this.isPristineT()
		this.errors = this.hasErrorsT()
		return(
			<div>
			{/*
				<form>
				*/}
					{this.renderPaymentsT()}
					{/*
			   </form>
			   */}	
		   </div>
		)
	}
}

PaymentsEditor.defaultProps = {
		initPayments: []
}

function mapDispatchToProps(dispatch) {
    return({
        paymentSelection: (payments) => {
            dispatch(payment_selection(payments))
        }
    })
}

function mapDispatchToProps(dispatch) {
    return({
        update: (updates) => {
            dispatch(update(updates))
        },
        paymentSelection: (payments) => {
            dispatch(payment_selection(payments))
        }
    })
}

//export default connect(null, mapDispatchToProps)(withMedia(PaymentsEditor))
export default connect(null, mapDispatchToProps)(PaymentsEditor)


