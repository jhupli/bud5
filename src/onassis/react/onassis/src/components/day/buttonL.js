import React from 'react' // ← Main React library
import { Button } from 'react-bootstrap';
import { connect } from 'react-redux'
import { prev_day } from '../../actions/day'
var FontAwesome = require('react-fontawesome');

class ButtonL extends React.Component{
	constructor(props) {
	    super(props)
	    this.prevDay = this.prevDay.bind(this)
	}

	prevDay() {
		this.props.chartPrevDay()
	}

	 render(){
	    return (
	    <div>
	     <Button onClick={this.prevDay}>
	     	<FontAwesome name='caret-left' />
	     </Button>
	    </div>
	    )
	}
}

function mapDispatchToProps(dispatch) {
  return ({
    chartPrevDay: () => {
      dispatch(prev_day())
    }
  })
}

export default connect(null, mapDispatchToProps)(ButtonL)
