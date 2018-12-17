import React from 'react';
import ReactDOM from 'react-dom';

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
    if (value === "") {
        value = "0"
    }
    value = "" + parseInt(value, 10);
    if (value.length < 3) {
        value = "00".slice(-3 + value.length) + value
    }

    var res = (plus >= minus ? '+' : '-') + value.slice(0, -2) + "." + value.slice(-2)
    return res;
}

class CurrencyField extends React.Component {

	constructor(props) {
        super(props)
        this.state = {
        	currencyValue : props.value
        }
		this.onChange = this.onChange.bind(this)
		this.handleFocus = this.handleFocus.bind(this)
		
		
    }
	
	handleFocus(event) {
		  event.target.select();
	}

	onChange(e) {
		
		const {id, onValueChanged, field, index} = this.props
		var newCurrencyValue = normalizeCurrency(e.target.value)
		this.setState({
			currencyValue : newCurrencyValue
		})
		onValueChanged(newCurrencyValue, field, index)

	}
	
	componentWillReceiveProps(nextprops) {
		this.setState({
			currencyValue : nextprops.value
		})
	}
	
	render() {
		const {id, readOnly, field, index, onValueChanged, placeholder, touched, fontSize} = this.props

		return (
	    <div>
			<input
			  onFocus={this.handleFocus}

			  id={id}
			  disabled={readOnly}
			  value={this.state.currencyValue}
			  onChange={this.onChange}
	          placeholder={readOnly ? '' : placeholder}  
	          type="text"
	          className="form-control" 
	    	  style={{
	    		  'fontSize': fontSize,
	    		  'textAlign': 'right', 
	    		  //'color' : this.state.currencyValue && this.state.currencyValue.startsWith('-') ? 'red' : 'green',
	    		  'color' : this.state.currencyValue && (this.state.currencyValue.substr(0,1) === '-') ? 'red' : 'green',
	    		  'display': 'inline',
	    		  'width': '85px',
	    		  'backgroundColor' : (touched ? 'lightyellow' : '')
	    	  }} 
	      />
	    </div>) 
	}	
}

CurrencyField.defaultProps = {
		id: null,
		onValueChanged: null,
		placeholder : '',
		value : '',
		readOnly : false,
		field: null,
		index: null,
		touched: false,
		fontSize: 'inherit'
}

export default CurrencyField