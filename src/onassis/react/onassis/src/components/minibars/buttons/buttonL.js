import React from 'react' // ← Main React library
import { Button } from 'react-bootstrap';
import { connect } from 'react-redux'

import { daterange_prev_block } from '../../../actions/daterange'
var FontAwesome = require('react-fontawesome');

class ButtonL extends React.Component{
	constructor(props) {
	    super(props)
	    this.prevBlock = this.prevBlock.bind(this)
	}
	
	prevBlock() {
		this.props.daterangePrevBlock()
	}
	
	render(){
	    return (
	    <div>
	     <Button onClick={this.prevBlock}>
	     	<FontAwesome name='caret-left' />
	     </Button>
	    </div>
	    )
	}
}

function mapDispatchToProps(dispatch) {
    return ({
        daterangePrevBlock: () => {
            dispatch(daterange_prev_block())
        }
    })
}

export default connect(null, mapDispatchToProps)(ButtonL)
