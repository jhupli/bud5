import React from 'react' // ← Main React library
import { Button } from 'react-bootstrap';
import { connect } from 'react-redux'
import { today } from '../../actions/day'

class ButtonToday extends React.Component{
	constructor(props) {
	    super(props)
	    this.today = this.today.bind(this)
	}
	
	today() {
		this.props.chartToday()
	}
	
	render(){
	    return (
	    <div>
	     <Button onClick={this.today}>
	     	Today
	     </Button>
	    </div>
	    )
	}
}

function mapDispatchToProps(dispatch) {
    return ({
        chartToday: () => {
            dispatch(today())
        }
    })
}

export default connect(null, mapDispatchToProps)(ButtonToday)
