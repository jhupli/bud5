import React from 'react' // ← Main React library
import KeyboardEventHandler from 'react-keyboard-event-handler';
import Content from './Content'
import ErrorMessage from './ErrorMessage'
import MenuBar from '../navi/MenuBar'
import Ping from '../ping/ping'
import { connect } from 'react-redux'
import { today, prev_day, next_day } from '../../actions/day'
import { daterange_prev_block, daterange_next_block } from '../../actions/daterange'

//CHG-10 import { set_daterange } from '../../actions/daterange'

const Keydetect = (props) => (<div>
  <KeyboardEventHandler
    handleKeys={['shift+left', 'left', 'shift+right', 'right']}
    onKeyEvent={(key, e) => {
        switch(key) {
            case 'shift+left' : props.daterange_prev_block(); break;
            case 'left' : props.prev_day(); break;
            case 'shift+right' : props.daterange_next_block(); break;
            case 'right' : props.next_day(); break;
        }
        }}
    />
</div>);

class Onassis extends React.Component{
	componentDidMount() {
		//this.props.setDateRange(addDays(new Date(),-10), addDays(new Date(),+10))
		this.props.today()
	}

	render(){
	    return (
	    	<div>
	    	 <Keydetect
	    	    daterange_prev_block={this.props.daterange_prev_block}
	    	    daterange_next_block={this.props.daterange_next_block}
	    	    prev_day={this.props.prev_day}
	    	    next_day={this.props.next_day}/>
	    	 <Ping />
	    	 <MenuBar />
	    	 <ErrorMessage />
	    	 <Content /> 
			 {/*
				<FooterInstance />
			*/}
		</div>
	    )
    }
}

function mapDispatchToProps(dispatch) {
    return ({
        today: () => {
            dispatch(today())
        },
        prev_day: () => {
            dispatch(prev_day())
        },
        next_day: () => {
            dispatch(next_day())
        },
        daterange_prev_block: () => {
                    dispatch(daterange_prev_block())
                },
        daterange_next_block: () => {
            dispatch(daterange_next_block())
        },
        /* //CHG-10 ,
        setDateRange: (start, end) => {
            dispatch(set_daterange(start, end))
        }*/
    })
}

export default connect(null, mapDispatchToProps)(Onassis)
