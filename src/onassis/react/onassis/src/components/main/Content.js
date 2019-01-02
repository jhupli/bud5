import React from 'react' // ← Main React library
import { Grid, Row, Col} from 'react-bootstrap';

import Categories from '../categories/categories'
import Accounts from '../accounts/accounts'
import Logs from '../logs/logs'

import RangePanel from './RangePanel'
import DetailsPanel from './DetailsPanel'
import ChartPanel from './ChartPanel'
import PiePanel from './PiePanel'

import { connect } from 'react-redux'
import { show_view } from '../../actions/navi'

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

const Main = () => (
	<Grid>
		 	<Row>
				<Col md={12}>
					<RangePanel />
				</Col>
			</Row>  
			
			<Row>
				<Col md={8}>
					<ChartPanel /> 
				</Col>

				<Col md={4} >
					<PiePanel /> 
				</Col>
									
			</Row>				
			<Row>
				<Col md={12}>
						<DetailsPanel /> 
				</Col>
			</Row>
	</Grid>
)

const Acc = () => (
	<Grid>
		 	<Row>
				<Col md={12}>
					<Accounts />
				</Col>
			</Row>
	</Grid>
)

const Cat = () => (
	<Grid>
		 	<Row>
				<Col md={12}>
					<Categories />
				</Col>
			</Row>
	</Grid>
)

const Log = () => (
	<Grid>
		 	<Row>
				<Col md={12}>
					<Logs />
				</Col>
			</Row>
	</Grid>
)

class Content extends React.Component {
	render() {
		//console.log('render' + this.props.view);
		return(
				<div> 
					<div style={{display : (this.props.view === 'main') ? '' : 'none'}}>
							<Main />
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
        }
    })
}
export default connect(mapStateToProps, mapDispatchToProps)(Content)
						
						
