import React from 'react' // ← Main React library
//import { Grid, Row, Col, Tabs, Tab} from 'react-bootstrap';

import Categories from '../categories/categories'
import Accounts from '../accounts/accounts'
import Logs from '../logs/logs'

import RangePanel from './RangePanel'
import DetailsPanel from './DetailsPanel'
import ChartPanel from './ChartPanel'
import PiePanel from './PiePanel'

import { connect } from 'react-redux'
import { show_view } from '../../actions/navi'
import { chart_redraw } from '../../actions/chart'
import { pie_redraw } from '../../actions/pie'
import { minibars_redraw } from '../../actions/minibars'
/*
<Tabs defaultActiveKey={2} id="uncontrolled-tab-example">
  <Tab eventKey={1} title="Tab 1">
    Tab 1 content
  </Tab>
  <Tab eventKey={2} title="Tab 2">
    Tab 2 content
  </Tab>
  <Tab eventKey={3} title="Tab 3" disabled>
    Tab 3 content
  </Tab>
</Tabs>;
*/

const Acc = () => (
					<Accounts />
)

const Cat = () => (

					<Categories />
)

const Log = () => (
					<Logs />
)

class Content extends React.Component {
	/*constructor(props) {
		super(props)
		this.handleSelect = this.handleSelect.bind(this)
	}*/
	
	/*handleSelect(key) {
		if(key === 1) {
				var that = this
				var f = () => {
	    			that.props.minibarsRedraw()
	    		}
		        setTimeout(f, 0)
		}
		if(key === 2) {
				var that = this
				var f = () => {
	    			that.props.chartRedraw()
	    			that.props.pieRedraw()
	    		}
		        setTimeout(f, 0)
		}
	}*/
   
	componentWillReceiveProps(nextProps) {
		if(this.props.view !== 'main' && nextProps.view === 'main') {
			//refresh c3-views (bug in lib)
			this.props.minibarsRedraw()
			this.props.chartRedraw()
	    	this.props.pieRedraw()
		}
	}
	render() {
		var main = 
			<div>
				<div style={{width: '100%'}}>
					<RangePanel />
				</div>
				<div style={{width: '100%'}}>
					<div style={{width: '100%', "display": "inline-flex", "whiteSpace": "nowrap"}}>
						<div style={{width: '75%', paddingRight: '2px'}}>
							<ChartPanel />
						</div>
						<div style={{width: '25%', paddingLeft: '2px'}}>
							<PiePanel />
						</div>
					</div>
				</div>
				<DetailsPanel />
			</div>
			
		return(
				<div style={{padding: '15px'}}> 
					<div style={{display : (this.props.view === 'main') ? '' : 'none'}}>
							{main}
					</div>
					<div style={{display : (this.props.view === 'a') ? '' : 'none'}}>
							<Acc />
					</div>
					<div style={{display : (this.props.view === 'c') ? '' : 'none'}}>
							<Cat /> 
					</div>
					<div style={{display : (this.props.view === 'l') ? '' : 'none'}}>
							<Log /> 
					</div>
				</div>
		)
	}
}

Content.defaultProps = {
		view: 'main'
}

const mapStateToProps = (store) => {
    return {
        view: store.navi.view
    }
}

function mapDispatchToProps(dispatch) {
    return ({
        showView: (view) => {
            dispatch(show_view(view))
        },
        chartRedraw: () => {
            dispatch(chart_redraw())
        },
        pieRedraw: () => {
            dispatch(pie_redraw())
        },
        minibarsRedraw: () => {
            dispatch(minibars_redraw())
        }
    })
}
export default connect(mapStateToProps, mapDispatchToProps)(Content)
						
						
