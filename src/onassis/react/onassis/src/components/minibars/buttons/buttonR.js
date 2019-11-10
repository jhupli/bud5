import React from 'react' // ← Main React library
import { Button } from 'react-bootstrap';
import { connect } from 'react-redux'

import { daterange_next_block } from '../../../actions/daterange'
var FontAwesome = require('react-fontawesome');

class ButtonR extends React.Component{
	constructor(props) {
	    super(props)
	    this.nextBlock = this.nextBlock.bind(this)
	}
	
	nextBlock() {
		this.props.daterangeNextBlock()
	}
	
	render(){
	    return (
	    <div>
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
        }
    })
}

export default connect(null, mapDispatchToProps)(ButtonR)
