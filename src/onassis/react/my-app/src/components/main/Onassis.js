import React from 'react' // ← Main React library
import Content from './Content'
import MenuBar from '../navi/MenuBar'
import Ping from '../ping/ping'
import {addDays} from '../../util/addDays'
import { connect } from 'react-redux'
import { chart_today } from '../../actions/chart'
import { set_daterange } from '../../actions/daterange'

class Onassis extends React.Component{
	constructor(props) {
		super(props);
		//this.props.setDateRange(addDays(new Date(),-10), addDays(new Date(),+10))
		//this.props.chartToday()
  	}
	componentDidMount() {
		this.props.setDateRange(addDays(new Date(),-10), addDays(new Date(),+10))
		this.props.chartToday()
	}

	render(){
	    return (
	    	<div>
	    	 <Ping />
	    	 <MenuBar />
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
        chartToday: () => {
            dispatch(chart_today())
        },
        setDateRange: (start, end) => {
            dispatch(set_daterange(start, end))
        }
    })
}

export default connect(null, mapDispatchToProps)(Onassis)
