import React from 'react' // ← Main React library
import { Button } from 'react-bootstrap';
import { connect } from 'react-redux'
import { chart_next_day, chart_prev_day, chart_today } from '../../actions/chart'
var FontAwesome = require('react-fontawesome');

class Buttons extends React.Component{
	constructor(props) {
	    super(props)
	    this.nextDay = this.nextDay.bind(this)
	    this.prevDay = this.prevDay.bind(this)
	    this.today = this.today.bind(this)
	}
	
	nextDay() {
		this.props.chartNextDay()
	}
	
	prevDay() {
		this.props.chartPrevDay()
	}
	
	today() {
		this.props.chartToday()
	}
	
	render(){
	    return (
	    <div>
	     <Button onClick={this.prevDay}>
	     	<FontAwesome name='caret-left' />
	     </Button>
	     <Button onClick={this.nextDay}>
	     	<FontAwesome name='caret-right' />
	     </Button>
	     <Button onClick={this.today}>
	     	Today
	     </Button>
	    </div>
	    )
	}
}

function mapDispatchToProps(dispatch) {
    return ({
        chartNextDay: () => {
            dispatch(chart_next_day())
        },
        chartPrevDay: () => {
            dispatch(chart_prev_day())
        },
        chartToday: () => {
            dispatch(chart_today())
        }
    })
}

export default connect(null, mapDispatchToProps)(Buttons)
