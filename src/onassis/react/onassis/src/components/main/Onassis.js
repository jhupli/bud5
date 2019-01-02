import React from 'react' // ← Main React library
import Content from './Content'
import ErrorMessage from './ErrorMessage'
import MenuBar from '../navi/MenuBar'
import Ping from '../ping/ping'
import { connect } from 'react-redux'
import { chart_today } from '../../actions/chart'
//CHG-10 import { set_daterange } from '../../actions/daterange'

class Onassis extends React.Component{
	componentDidMount() {
		//this.props.setDateRange(addDays(new Date(),-10), addDays(new Date(),+10))
		this.props.chartToday()
	}

	render(){
	    return (
	    	<div>
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
        chartToday: () => {
            dispatch(chart_today())
        }/* //CHG-10 ,
        setDateRange: (start, end) => {
            dispatch(set_daterange(start, end))
        }*/
    })
}

export default connect(null, mapDispatchToProps)(Onassis)