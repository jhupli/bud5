import React from 'react' // ← Main React library
import { Button } from 'react-bootstrap';
import { connect } from 'react-redux'
import { next, prev } from '../../actions/auditlog'
var FontAwesome = require('react-fontawesome');

class Buttons extends React.Component{
	constructor(props) {
	    super(props)
	    this.next = this.next.bind(this)
	    this.prev = this.prev.bind(this)
	}
	
	next() {
		if(!this.props.logentries || this.props.logentries.length === 0) return
		var last = this.props.logentries[this.props.logentries.length - 1]
		var s = last.hs[last.rownr].hd
		this.props.next(s)
	}

	prev() {
		if(!this.props.logentries || this.props.logentries.length === 0) return
		var first = this.props.logentries[0]
		var e = first.hs[first.rownr].hd
		this.props.prev(e)
	}
	
	render(){
	    return (
	    <div>
		    <Button onClick={this.prev} disabled={this.props.firstpage} >
		     	<FontAwesome name='caret-left' />
		     </Button>
		     <Button onClick={this.next} disabled={this.props.lastpage}>
		     	<FontAwesome name='caret-right'/>
		     </Button>
		     <Button href="http://localhost:8080/log">
		     	<FontAwesome name='download'/>
		     </Button>
	    </div>
	    )
	}
}

const mapStateToProps = (store) => {
    return {
        logentries: store.auditlog.logentries,
        firstpage: store.auditlog.firstpage,
        lastpage: store.auditlog.lastpage
    }
}

function mapDispatchToProps(dispatch) {
    return ({
        next: (s) => {
            dispatch(next(s))
        },
        prev: (e) => {
            dispatch(prev(e))
        }
    })
}

export default connect(mapStateToProps, mapDispatchToProps)(Buttons)
