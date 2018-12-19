import React from 'react'
import { connect } from 'react-redux'
import { Table, Panel, Button } from 'react-bootstrap';

import { update } from '../../actions/categories'

import CurrencyField from '../editorFields/CurrencyField'
import CheckboxField from '../editorFields/CheckboxField'
import TextField from '../editorFields/TextField'
import ColorField from '../editorFields/ColorField'

import './CategoriesEditor.css'
import '../../customMultiSelect.css'


import AlertContainer from 'react-alert'
import alertOptions from '../../util/alertoptions'


//import { withMedia } from 'react-media-query-hoc';

import {
		fields,
		initState,
		defaultValues, 
		validators,
		preInitFormat,
		preSubmitFormat,
		oneIsTrue,
		copyArray,
		activeIsRo
} from './constants'

var FontAwesome = require('react-fontawesome')

var tempId = -1

class CategoriesEditor extends React.Component {
    constructor(props) {
        super(props)
        //postfix -abbr. F = Field, R = Row, T = Table
        this.showOk = this.showOk.bind(this)
        //Field related:
        
        //callbacks from uicomponents for updating model (state)
        this.changePropertyF = this.changePropertyF.bind(this)
        this.changePropertyDeletedF = this.changePropertyDeletedF.bind(this)
        
        //set state values:
        this.setValueF = this.setValueF.bind(this)
        
        //validate:
        this.validateF = this.validateF.bind(this)
        
        //some field related util;
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

        //validate
        this.validateR = this.validateR.bind(this)
        this.readOnlyR = this.readOnlyR.bind(this)
        
        //utils
        this.isPersistedR = this.isPersistedR.bind(this)

        //render
        this.renderCategoryR = this.renderCategoryR.bind(this)

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
        this.renderCategoriesT = this.renderCategoriesT.bind(this)

        //css and stuff
        this.tdClassName = this.tdClassName.bind(this)
        this.td = this.td.bind(this)
        this.thClassName = this.thClassName.bind(this)
        this.th = this.th.bind(this)
        
        this.init()
        this.state = {...initState(this.preInitT(props.initCategories))}
    }

    changePropertyF(value, field, index) {
    	//touch
		if (this.isPersistedR(index)) { //new rows do not get 'touched' (unless masked)
			var copy = copyArray(this.state.touched)
			copy[index][field] = this.isDifferentFromInitialF(value, field, index)
			this.setState({touched : copy})
		}
		
		//validate
		this.validateF(field, value, index)

    	this.setValueF(value, field, index)
    }
    
    changePropertyDeletedF(value, field, index) {
    	if(this.isPersistedR(index)) { //if it has id, let backend remove: mark as deleted
    		this.deleteCount += (value ? 1 : -1)
    		var copy = copyArray(this.state.deleted)
    		copy[index] = value
    		this.setState({deleted : copy})
    	} else {
    		this.removeR(index) //if newly created, just remove it
    	}
    }
    
	setValueF(value, field, index) {
		var copy = copyArray(this.state.values)
		copy[index][field] = value
		this.setState({values : copy})
	}

	validateF(field, value, index) {
		var original = this.state.errors[index][field]
		var result = validators[field](value) 
		if( result !== original ) {
			var copy = copyArray(this.state.errors)
			copy[index][field] = validators[field](value) 
			this.setState({errors : copy})
		}
	}
	
	touchedF(index, field) {
		if(index<0) return false //mask-controls are never touched (-1 = checkbox -2 = mask value)
		if(this.state.deleted[index]) return false 	//to be deleted: not touched
		if(!this.isPersistedR(index)) return false 	//this is a new row: not touched and not masked
		return this.state.touched[index][field]
	}
	
	isDifferentFromInitialF(value, field, index) {
		return (value !== this.state.initial[index][field])
	}

	chooseValueF(index, field) {
		if(this.state.deleted[index]) return this.state.initial[index][field] //show initial values if to be deleted
		return this.state.values[index][field] 
	}
	
	renderContentF(field, index) {
     	
    	var  value = this.chooseValueF(index, field)
    	
    	switch(field) {
    	case 'i' :
					return(
				  	<div>
				  		<CurrencyField 
					  		id = {'icat_'+index}
					  		onValueChanged = {this.changePropertyF}
					  		placeholder = 'amount'
					  		value = {value}
					  		readOnly = {this.readOnlyR(index, 'i')}
				  			field = 'i'
				  			index = {index}
				  			touched = {this.touchedF(index, 'i')}
					  	/>
				    </div>)
    	case 'active' :
					return(
				  	<div>
				  		<CheckboxField 
					  		id = {'activecat_' + index}
					  		onValueChanged = {this.changePropertyF}
					  		checked = {value}
					  		readOnly = {this.isPersistedR(index) && activeIsRo(this.state.touched[index])}
				  			field = 'active'
				  			index = {index}
				  			touched = {this.touchedF(index, 'active')}
					  	/>
				    </div>)					    
    	case 'descr' :
					return(
				  	<div>
				  		<TextField 
					  		id = {'descrcat_'+index}
					  		onValueChanged = {this.changePropertyF}
					  		value = {value}
					  		readOnly = {this.readOnlyR(index, 'descr')}
				  			field = 'descr'
				  			index = {index}
				  			touched = {this.touchedF(index, 'descr')}
				  			placeholder = 'name'
					  	/>
				    </div>)
    	case 'color' :
					return(
				  	<div>
				  		<ColorField 
					  		id = {'colorcat_'+index}
					  		onValueChanged = {this.changePropertyF}
					  		color = {value}
					  		readOnly = {this.readOnlyR(index, 'color')}
				  			field = 'color'
				  			index = {index}
				  			touched = {this.touchedF(index, 'color')}
					  	/>
				    </div>)
		default: console.log('UNKONWN field: '+field)
			  	   return null
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
	  	return	
		/*return(
	  	<div>
	  		<CheckboxField 
		  		id = {'deletedcat_'+index}
		  		onValueChanged = {this.changePropertyDeletedF}
		  		checked = {this.state.deleted[index]}
	  			field = 'deleted'
	  			index = {index}
	  			touched = {false}
		  	/>
	    </div>)*/
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
			return (a, b) => {
				return inv * 
				(this.chooseValueF(b.index,this.state.sort) - this.chooseValueF(a.index,this.state.sort))
			}
		case 'descr':
			return (a, b) => {
				 var textA = this.chooseValueF(a.index,'descr').toUpperCase()
				 var textB = this.chooseValueF(b.index,'descr').toUpperCase()
				 return inv * 
				 ((textA < textB) ? -1 : (textA > textB) ? 1 : 0)
			}
		case 'active':
			return (a, b) => {
				 return inv * (a.active && b.active ? 0 : (a.active? 1 : -1))
			}
		default: return (a, b) => {return 0}
		}
	}
	
	addR() {
    	var defaults = this.getDefaultR()
    	var valuesCopy = copyArray(this.state.values)
    	valuesCopy.push(defaults)
    	//valuesCopy.splice(valuesCopy.length + 1, 0, defaults);
    	this.sortedValues.push(defaults)
    	//this.sortedValues.splice(this.sortedValues.length + 1, 0, defaults);
    	
    	
    	var errorsCopy = copyArray(this.state.errors)
    	errorsCopy.push(this.validateR(defaults))
    	//errorsCopy.splice(errorsCopy.length + 1, 0, this.validateR(defaults));
    	
    	this.setState({
    		    	values : valuesCopy,
    		    	errors : errorsCopy,
    	})
    }
	    
	getDefaultR() {
		var last = defaultValues
		if (this.sortedValues.length){
			last = this.sortedValues[this.sortedValues.length - 1]
		}

		var res = {...last}
		res.index = this.state.values.length
		res.id = tempId--
		res.l = false
		res.check = false
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
		return this.state.deleted[index] || //marked as to be deleted?			
			   	   (!this.state.values[index].active && this.isPersistedR(index))
	}
    
    isPersistedR(index) {
		return this.state.values[index].id >=0
	}
    
    renderCategoryR(index) {
    	return(
    	<tr key={index}>
	 		{[...fields].map( (f) => { 
	 			return this.td(index, f) 
	 		})}
	 		
	      	<td className={this.tdClassName(index, 'deleted')}>
	      		{this.renderDeletedContentF(index)}
	      	</td>
	      	
		</tr>)
    }
    
	resetT() {
		var state = initState(this.state.initial)
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
    		   (this.state.initial.length === this.state.values.length) && 
    	       !this.deleteCount 
	}
	
	hasErrorsT() {
		var errors = false
    	this.state.errors.forEach( (v) => {
    		errors = errors || oneIsTrue(v) 
    	})
    	return errors
	}
	
	preInitT(initialCategories) {
		return preInitFormat(initialCategories)
	}
	
	showOk() {
		this.msg.show('SAVED SUCCESSFULLY', {
	      time: 2000,
	      type: 'success',
	      icon: <img src="yes.png" alt="save ok"/>
	    })
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
		console.log(JSON.stringify(updates,null,4))
		//"submit"
		this.pristine = null
		this.props.update(updates)
	}

    init() {
        this.deleteCount = 0
        this.pristine = null
        this.errors = null
        this.allChecked = false
    }

	renderCategoriesT = () => {
		this.sortedValues = this.state.values.slice(0)
		if (this.state.sort) this.sortedValues.sort(this.sortersF())
		
		return (
		<div>
		<Panel id="accs-panel" >
          <Panel.Heading >
            <Panel.Title >
					<Button onClick={() => this.resetT()} disabled={this.pristine} bsStyle={this.pristine ? "default":"primary"} >Reset</Button>
					<Button onClick={() => this.preSubmitT()} disabled={this.pristine || (this.errors != null)} bsStyle={this.pristine ? "default":"primary"}>Save</Button>
					<Button onClick={() => this.addR()}>Add</Button>
			</Panel.Title >
		 </Panel.Heading >	
		 <Panel.Body>
			<Table id="categories_table" striped bordered hover condensed>
				<thead>
			  		<tr>
			  			<th className={this.thClassName('color')} />
			  			{this.th('descr', 'Name')}
			  			{this.th('i', 'Default')}
			  			{this.th('active', 'Active')}
			  			
			  			<th className={this.thClassName('deleted')}>
			  				<FontAwesome name='remove' style={{'color': 'red'}}/>
			  			</th>
			  			
					</tr>				  			
				</thead>
				<tbody>
				  	{this.sortedValues.map((p) => this.renderCategoryR(p.index))}
				</tbody>
			</Table>
		</Panel.Body>
		</Panel >
		</div>)
	}
		
	tdClassName(index, field) {
		return field + '_cell' + 
			   (!this.isPersistedR(index) ? ' newRow' : '') +
			   (this.state.deleted[index] ? ' deleted' : '') +
			   (this.state.errors[index][field] ? ' error' : '')
	}
	
	td(index, field) {
		return (
		<td key={index+'_'+field} className={this.tdClassName(index, field)}>
		      {this.renderContentF(field, index)}	
		</td>)
	}
	
	thClassName(field) {
		return field + '_header' 
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
	  				<div style={{marginTop: 8, paddingRight: 3}}>
	  					{sortField}
	  				</div>
	  				{label !== null ? labelField : ''}
	  			</span>
	  		</div>
		</th>)
	}
	
	componentWillReceiveProps(nextprops) {
		if( !this.isPristineT()  && this.pristine == null) { //just saved
			this.showOk()
		}
	
		this.init()
		this.setState(
				{...initState(this.preInitT(nextprops.initCategories))}
		)
	}
	
	render() {
		this.pristine = this.isPristineT()
		this.errors = this.hasErrorsT()
		return(
			<div>
	        		<AlertContainer ref={a => this.msg = a} {...alertOptions} />
					{this.renderCategoriesT()}
	
		   </div>
		)
	}
}

CategoriesEditor.defaultProps = {
		initCategories: []
}

function mapDispatchToProps(dispatch) {
    return({
        update: (updates) => {
            dispatch(update(updates))
        }
    })
}

export default connect(null, mapDispatchToProps)(CategoriesEditor)


