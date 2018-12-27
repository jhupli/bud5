import React from 'react' // ← Main React library
import { Button } from 'react-bootstrap';
import { connect } from 'react-redux'

import { daterange_next_block, daterange_prev_block } from '../../actions/daterange'
var FontAwesome = require('react-fontawesome');

class Buttons extends React.Component{
	constructor(props) {
	    super(props)
	    this.nextBlock = this.nextBlock.bind(this)
	    this.prevBlock = this.prevBlock.bind(this)
	}
	
	nextBlock() {
		this.props.daterangeNextBlock()
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
	     <Button onClick={this.nextBlock}>
	     	<FontAwesome name='caret-right' />
	     </Button>
	    </div>
	    )
	}
}

function mapDispatchToProps(dispatch) {
    return ({
        daterangeNextBlock: () => {
            dispatch(daterange_next_block())
        },
        daterangePrevBlock: () => {
            dispatch(daterange_prev_block())
        }
    })
}

export default connect(null, mapDispatchToProps)(Buttons)
