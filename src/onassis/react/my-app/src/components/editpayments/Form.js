import React from 'react'
import { Field, FieldArray, reduxForm, formValueSelector } from 'redux-form'
import DatePicker from '../datepicker/datepicker'
import Dropdown from '../dropdown/dropdown'
import { Table } from 'react-bootstrap';
import validate from './validate'
import $ from 'jquery';

import { render } from 'react-dom' 
var dateFormat = require('dateformat');
var FontAwesome = require('react-fontawesome');

const FORM_NAME = 'editPaymentsArray'

const required = value => value ? undefined : 'Required'
const requiredNotNull = value => value != null ? undefined : 'Required'
const tooBig = value =>
  value && parseFloat(value) > 999.99 || parseFloat(value) < -999.99 ? 'This is big!' : undefined

const status = ({touched, error, warning} = {input: null, placeholder:null, meta: null}) => (
	touched && 
		((error && <span style={{color: 'red'}}>*{error}</span>) 
		|| 
		(warning && <span style={{color: 'DarkKhaki'}}>*{warning}</span>)) 	
)

const renderField = ({input, placeholder, meta, disabled = false}) => (
    <div>
    	<input {...input}
    		disabled={disabled}
    	    style={{width: '60px'}}
    		placeholder={placeholder} 
    		type="text" 
    		className="form-control"
    	/>
    	{status(meta)}  
    </div>
)

const renderCheckbox = ({index = -1, callback, input, meta, maskName = 'no-mask-name', disabled = false}) => (
	<div className='checkbox-personalized'>
		<input type='checkbox' 
			disabled={disabled}
		    name={ 'checkbox_arr_' + index + maskName } 
		    id={ 'checkbox_arr_' + index + maskName} 
			checked={ input.value } 
			onChange={(e) => callback(e.target.checked, index, maskName)} 
		/>
		<label htmlFor={ 'checkbox_arr_' + index + maskName }>
			<div className='check'/>
		</label>
		{status(meta)}  
	</div>
)


/*const renderMCheckbox = ({index = -1, callback, input, meta}) => (
	<div className='checkbox-personalized'>
		<input type='checkbox' 
		    name={ 'checkbox_arr_2' + index } 
		    id={ 'checkbox_arr_2' + index } 
			checked={ input.value } 
			onClick={(e) => callback(e.target.checked, index)} 
		/>
		<label htmlFor={ 'checkbox_arr_' + index }>
			<div className='check'/>
		</label>
		{status(meta)}  
	</div>
)*/

const renderCurrencyField = ({index, callback, input, placeholder, meta, disabled = false}) => (
    <div>
	      <input {...input} 
	          disabled={disabled}
			  onBlur={(e) => callback(e.target.value, index)} 
	          placeholder={placeholder} 
	          type="text"
	          className="form-control" 
	    	  style={{
	    		  'textAlign': 'right', 
	    		  'color' : input.value.startsWith('+') ? 'green' : 'red',
	    		  'display': 'inline',
	    		  'width': '85px'
	    		}} 
	      />
	     {status(meta)}  
    </div>
)

const renderDateField =  ({index , callback, pickerName, input,  meta, disabled = false}) => (
    <div>
    	<DatePicker {...input} 
    	    disabled={disabled}
    	 	pickerName={'singlePicker' + index} 
    	 	pickerCallback={(start) => callback(start, index)} 
    	 	pickerType="single"
    	 />
    	 {status(meta)}
    </div>
);

const renderDropdownField =  ({index , input, placeholder, callback, selectedValue, meta, disabled = false}) => (
    <div>
    	<Dropdown
    		disabled={disabled}
    		onValueChange={(c) => callback(c, index)} 
    		selectedValue={input.value}
    		placeholder={placeholder}
    	/>
    	{status(meta)}
    </div>
)

const normalizeCurrency = value => {
    if (!value) {
        return value
    }
    if (value === "-" || value === "+") {
        value += "0"
    }
    var plus = value.lastIndexOf('+');
    var minus = value.lastIndexOf('-');

    var value = value.replace(/[^\d]/g, '')
    value = "" + parseInt(value, 10);
    if (value.length < 3) {
        value = "00".slice(-3 + value.length) + value
    }

    var res = (plus >= minus ? '+' : '-') + value.slice(0, -2) + "." + value.slice(-2)
    return res;
}

class FieldArraysForm extends React.Component {
    constructor(props) {
        super(props);
        this.getDefault = this.getDefault.bind(this)
        
        this.changePaymentsProperty = this.changePaymentsProperty.bind(this)
        this.renderPayments = this.renderPayments.bind(this)
        
        this.renderMaskCheckbox = this.renderMaskCheckbox.bind(this)
        
        this.onDateChange = this.onDateChange.bind(this)
        this.onIncomeChange = this.onIncomeChange.bind(this)
        this.onMaskChange = this.onMaskChange.bind(this)
        this.onCategoryChange = this.onCategoryChange.bind(this)
        this.onAccountChange = this.onAccountChange.bind(this)
        this.onStatChange = this.onStatChange.bind(this)
        
        //this.onMaskChange = this.onMaskChange.bind(this)
        //this.requiredX = this.requiredX.bind(this)
        //this.validationActive = this.validationActive.bind(this)

        this.tableInit = this.tableInit.bind(this)
        this.add = this.add.bind(this)
        this.remove = this.remove.bind(this)
        this.state = {
        	d : false,
        	i : false,
        	c : false,
        	a : false,
        	s : false,
        	g : false
        }
    }

    changePaymentsProperty(property, index, value){
		this.props.change('payments['+index+'].'+property, value)
		this.table[index][property] = value
    }
    
    onDateChange(newDate, index) {
    	this.changePaymentsProperty('d', index, dateFormat(newDate, "dd.mm.yyyy"))
    }
    
    onIncomeChange(i, index) {
    	this.changePaymentsProperty('i', index, i)
    }

    renderMaskCheckbox = ({input, meta, maskName, disabled}) => (
		<div className='checkbox-personalized'>
			<input type='checkbox' 
				disabled={disabled}
			    name={ 'checkbox_mask_' + maskName } 
			    id={ 'checkbox_mask_' + maskName} 
				checked={ input.value } 
				onChange={(e) => {this.onMaskChange(e.target.checked, maskName)}} 
			/>
			<label htmlFor={ 'checkbox_mask_' + maskName }>
				<div className='check'/>
			</label>
			{status(meta)}  
		</div>
    )
    
    onMaskChange(b, maskName) {
    	if(b) {
    		$('.foo').css('background-color', 'red');
    		$('.foo').find('input').css('background-color', 'green');
    	} else {
    		$('.foo').css('background-color', 'white');
    	}
    	console.log("maskName=" + maskName)
    	this.props.change('masks.'+maskName, b)
    	//this.props.touch('payments')
    	
    	
    	var f = {}
    	f[maskName] = b;
    	this.setState( {...f})    	
    	//this.props.change('IMask', b)
    }
    
    onCategoryChange(c, index) {
    	this.changePaymentsProperty('c', index, c)
    }
    
    onAccountChange(a, index) {
    	this.changePaymentsProperty('a', index, a)
    }
    onStatChange(s, index) {
    	this.changePaymentsProperty('s', index, s)
    }
    
    changeMaskProperty(property, value){
		this.props.change('masks.'+property, value)
    }
    
    /*onMaskChange(b, field) {  
    	var f = {}
    	f[field] = b;
    	this.setState( {...f})
    }*/
    
	getDefault(fields) {
		var last = {
				d: dateFormat(new Date(), "dd.mm.yyyy"),
				i: "+0.00",
				c: null,
				a: null,
				s: true,
				g: null,
				maskRow: false
			}
		if(fields.length > 0) {
			last = fields.get(fields.length - 1)
		}
		return  {...last}
	}
    
    tableInit() {
		this.props.initialize(
				  { 
					payments: this.table,
				   'masks': this.masks
				  }
				)
    }
    remove(index) {
    	this.table.splice(index, 1);
    	this.tableInit()
    	//fields.remove(index)
    }
    
    add(fields) {
		this.table.push(this.getDefault(fields))		  
		this.tableInit()
    	//fields.push(this.getDefault(fields))
    }
    
	renderPayments = ({fields}) => {
		console.log("**render2")
		console.log(this.state)
		this.fields = fields
		if(fields == null) {
			fields = this.fields
		}
		return (
	
		<div>
		<Table striped bordered condensed hover>
		  	<thead>
		  		<tr>
		  			<th>Date*</th>
		  			<th>Sum*</th>
	  				<th>Cat*</th>
	  				<th>Acc*</th>
	  				<th>Stat*</th>
	  				<th>Group</th>
  					<th></th>
  				</tr>				  			
		  	</thead>
		  	<tbody>
		  	{/* if */}
		  	<tr>
		  	    <td><Field name='masks.d' maskName="d" callback={this.onMaskChange} component={this.renderMaskCheckbox} /> </td>
			    <td><Field name='masks.i' maskName="i" callback={this.onMaskChange} component={this.renderMaskCheckbox} /> </td>
			    <td><Field name='masks.c' maskName="c" callback={this.onMaskChange} component={this.renderMaskCheckbox} /> </td>
			    <td><Field name='masks.a' maskName="a" callback={this.onMaskChange} component={this.renderMaskCheckbox} /> </td>
			    <td>
				    <Field name='masks.s' maskName="s" callback={this.onMaskChange} component={this.renderMaskCheckbox} /> 
				</td>
			    <td><Field name='masks.g' maskName="g" callback={this.onMaskChange} component={this.renderMaskCheckbox} /> </td>
			    <td></td>
		    </tr>
			{/* end if */}
		  	{fields.map((p, index) =>
		  		<tr key={index} >
			      	<td className='foo'>
			      		<Field 
			      		  name={`${p}.d`}
			      		  disabled={this.state.d}
			      		  index={index}  
			      		  component={renderDateField} 
			      		  callback={this.onDateChange}
			      		 // warn={tooFar}
			          />			      	
			      		{ this.state.d ? "joo" : "ei" }	</td>
			      	<td>
			        <Field
			          name={`${p}.i`}
			          disabled={this.state.i}
		      		  index={index}
			          callback={this.onIncomeChange}
			          component={renderCurrencyField}
			          placeholder="amount"
			          normalize={normalizeCurrency}	  
			          warn={tooBig}
			        />				      	
			        { this.state.i ? "joo" : "ei" }	</td>
			    <td>
			        <Field
			          name={`${p}.c`}
			          disabled={this.state.c}
			          index={index}
			          placeholder="select..."
			          callback={this.onCategoryChange}
			          component={renderDropdownField}
			          />
			        { this.state.c ? "joo" : "ei" }			      	
		      	</td>
				<td>
			        <Field
			          name={`${p}.a`}
			          disabled={this.state.a}
			          index={index}
			          placeholder="select..."
			          callback={this.onAccountChange}
			          component={renderDropdownField}
			          />				      	
			        { this.state.a ? "joo" : "ei" }	</td>
				<td>
				        <Field
				          name={`${p}.s`}
				          disabled={this.state.s}
				          index={index}
				          placeholder="stat"
				          callback={this.onStatChange}
				          component={renderCheckbox}
				          />				      	
				        { this.state.s ? "joo" : "ei" }	</td>
		      	<td>
			        <Field
			          name={`${p}.g`}
			          disabled={this.state.g}
			          component={renderField}
			          placeholder="id"/>				      	
			          { this.state.g ? "joo" : "ei" }	</td>
		      	<td>
			      	<button type="button" className="form-control"  onClick={() => this.remove(index)}><FontAwesome name='remove' style={{'color': 'red'}}/>
			        </button>				      					      	
		      	</td>
		      </tr>
		    )}
			      	
		  	</tbody>
		  </Table>
		  <ul>
		    <li>
		      <button type="button" onClick={() => this.add(fields)}>Add Payment</button>
		    </li>
		  </ul>
	</div>
	)}
		componentDidMount() {
		  this.initializeForm();
		}
		
		initializeForm() {
		  this.table = []
		  this.masks =  {
				  d: false,
				  i: false,
				  c: false,
				  a: false,
				  s: false,
				  g: false
		  }
		  if (this.props.masksEnabled){
			  const maskFields = {
				  d: dateFormat(new Date(), "dd.mm.yyyy"),
				  i: "+0.00",
				  c: 2, //null,
				  a: 3, //null,
				  s: true,
				  g: null,
				  maskRow: true
			  };
			  this.table.push(maskFields)
		  }
		  //TODO oikeat arvot tähän:
		  var values = {
			  d: dateFormat(new Date(), "dd.mm.yyyy"),
			  i: "+2.00",
			  c: 2,
			  a: 3,
			  s: true,
			  g: null,
			  maskRow: false
		  };
		  this.table.push(values)
		  values = {
			  d: dateFormat(new Date(), "dd.mm.yyyy"),
			  i: "+3.00",
			  c: 1,
			  a: 2,
			  s: true,
			  g: null,
			  maskRow: false
		  };
		  this.table.push(values)		  
		  
		  this.props.initialize({ payments: this.table,
			  					  'masks': this.masks});
		  
		  //this.size = values.length
		}
		/*	
		render() {
			console.log("**render")
			console.log(this.state)
			const { handleSubmit, pristine, reset, submitting, valid } = this.props

			return(
					<form onSubmit={this.props.handleSubmit}>
					  
				      <FieldArray name="payments" component={this.renderPayments}/>
				      <div>
				        <button type="submit" disabled={submitting }>Submit</button>
				        <button type="button" disabled={pristine || submitting} onClick={reset}>Reset</button>
				      </div>
				    </form>						
			)
		}*/
		render() {
			  
			  return(
						<div>
						<Table striped bordered condensed hover>
						  	<thead>
						  		<tr>
						  			<th>Date*</th>
						  			<th>Sum*</th>
					  				<th>Cat*</th>
					  				<th>Acc*</th>
					  				<th>Stat*</th>
					  				<th>Group</th>
				  					<th></th>
				  				</tr>				  			
						  	</thead>
						  	<tbody>
						  	{/* if */}
						  	<tr>
						  	    <td><Field name='masks.d' maskName="d" callback={this.onMaskChange} component={this.renderMaskCheckbox} /> </td>
							    <td><Field name='masks.i' maskName="i" callback={this.onMaskChange} component={this.renderMaskCheckbox} /> </td>
							    <td><Field name='masks.c' maskName="c" callback={this.onMaskChange} component={this.renderMaskCheckbox} /> </td>
							    <td><Field name='masks.a' maskName="a" callback={this.onMaskChange} component={this.renderMaskCheckbox} /> </td>
							    <td>
								    <Field name='masks.s' maskName="s" callback={this.onMaskChange} component={this.renderMaskCheckbox} /> 
								</td>
							    <td><Field name='masks.g' maskName="g" callback={this.onMaskChange} component={this.renderMaskCheckbox} /> </td>
							    <td></td>
						    </tr>
						    </tbody>
						  <Table>
						  </div>
			  
			  )
			  
		  }
}

var MyForm = reduxForm({
	form: FORM_NAME,
	validate
})(FieldArraysForm)

class FormWrapper extends React.Component{
    constructor(props) {
        super(props);
        this.preSubmit = this.preSubmit.bind(this)
        //this.setMasks = this.setMasks.bind(this)
        this.preFormat = this.preFormat.bind(this)
        //this.maskPayment = this.maskPayment.bind(this)
    }
    
	preSubmit(values) {
		var payments = deepCopyPayments(values.payments) //make a copy
		console.log("preSubmit")
		console.log(JSON.stringify(values,null,2))
		console.log("-->")
		payments.forEach(this.preFormat)
		if (this.props.masksEnabled) {
			for(var i=1; i<payments.length; i++) {
				//this.maskPayment(payments[i], payments[0])
			}
			payments.shift()
		}
		this.props.onSubmit(payments)
	}
	
	/*maskPayment(payment, mask) {
		if (this.masks.d) {
			payment.d = mask.d
		}
		if (this.masks.i) {
			payment.i = mask.i
		}
		if (this.masks.c) {
			payment.c = mask.c
		}
		if (this.masks.a) {
			payment.a = mask.a
		}
		if (this.masks.s) {
			payment.s = mask.s
		}
		if (this.masks.g) {
			payment.g = mask.g
		}
	}*/
	
	preFormat(payment, index) {
		//31.12.2005 -> 2006-12-31
		var parts = payment.d.split(".");
		var day = parts[0]
		var month = parts[1] - 1
		var year = parts[2]
		var day = new Date(year, month, day)
		payment.d = dateFormat(day, "yyyy-mm-dd")
	}
	
	
	/*setMasks(masks) {
		this.masks = masks
	}*/
	
	render(){
		return(
	        <div >
            	<MyForm onSubmit={this.preSubmit} setMasks={this.setMasks} masksEnabled={this.props.masksEnabled}/>
            </div>
		)
	}
}

function copyPayment(payment) {
	return {
		d: payment.d,
		i: payment.i,
		c: payment.c,
		a: payment.a,
		s: payment.s,
		g: payment.g
	}
}
function  deepCopyPayments(payments) {
	var copy = []
	payments.forEach(
			(p) => {copy.push(copyPayment(p))}
	)
	return copy
}

FormWrapper.defaultProps = {
		masksEnabled: false
}
export default FormWrapper
