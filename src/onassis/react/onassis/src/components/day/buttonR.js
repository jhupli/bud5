import React from 'react' // ← Main React library
import { Button } from 'react-bootstrap';
import { connect } from 'react-redux'
import { next_day } from '../../actions/day'
var FontAwesome = require('react-fontawesome');

class ButtonR extends React.Component{
	constructor(props) {
	    super(props)
	    this.nextDay = this.nextDay.bind(this)
	}
	
	nextDay() {
		this.props.chartNextDay()
	}
	
	render(){
	    return (
	    <div>
	     <Button onClick={this.nextDay}>
	     	<FontAwesome name='caret-right' />
	     </Button>
	    </div>
	    )
	}
}

function mapDispatchToProps(dispatch) {
    return ({
        chartNextDay: () => {
            dispatch(next_day())
        }
    })
}

export default connect(null, mapDispatchToProps)(ButtonR)
