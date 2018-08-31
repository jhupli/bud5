import React from 'react' // ← Main React library
import { Grid, Row, Col} from 'react-bootstrap';

import Categories from '../categories/categories'
import Accounts from '../accounts/accounts'
import AuditLog from '../logs/auditlog'

import Range from './Range'
import Details from './Details'
import DiagramA from './DiagramA' //chart
import DiagramB from './DiagramB' //pie

import { connect } from 'react-redux'
import { show_view } from '../../actions/navi'

const Main = () => (
	<Grid>
		 	<Row>
				<Col md={12}>
					<Range />
				</Col>
			</Row>  
			
			<Row>
				<Col md={8}>
					<DiagramA /> 
				</Col>

						
				<Col xsHidden smHidden md={4} >
					<DiagramB /> 
				</Col>
									
			</Row>				
			<Row>
				<Col md={12}>
						<Details /> 
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
					<AuditLog />
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
						
						
