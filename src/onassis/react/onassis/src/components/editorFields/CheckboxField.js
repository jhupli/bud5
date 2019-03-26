import React from 'react'
import './checkbox.css'

class CheckboxField extends React.Component {
	render() {
		const {id, readOnly, field, index, onValueChanged, touched, checked} = this.props
		return(
		<div>
			<span style = {{display: "flex", width: '20px'}}>
				<div >
					<input 
						name = {id}
						type = 'checkbox' 
						disabled = {readOnly}
					    id = {id}  
						checked = {checked}
						onChange = {(e) => onValueChanged(e.target.checked, field, index)}
						style = { readOnly ? {backgroundColor: 'lightgray', borderColor: 'lightgray'} : 
							         (touched ? {backgroundColor: 'darkKhaki', borderColor: 'darkKhaki'} : {})}
					/>
				</div>
			</span>
		</div>)
	}	
}

CheckboxField.defaultProps = {
		id : null,
		onValueChanged : null,
		checked : true,
		readOnly : false,
		field : null,
		index : null,
		touched: false
}

export default CheckboxField