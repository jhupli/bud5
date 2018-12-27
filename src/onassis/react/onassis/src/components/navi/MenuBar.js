import React from 'react';
import { Navbar, NavItem, Nav, NavDropdown, MenuItem} from 'react-bootstrap';
import { connect } from 'react-redux'

import { show_view } from '../../actions/navi'

class MenuBar extends React.Component{
	
	render(){	
		return(
			<div>
				<Navbar>
				    <Navbar.Header>
				        <Navbar.Brand> Onassis </Navbar.Brand>
				        <Navbar.Toggle /> 
				    </Navbar.Header>
				    <Navbar.Collapse>
				        <Nav>
				            <NavItem eventKey={1} href="#">View</NavItem>
				            <NavDropdown eventKey={3} title="View" id="basic-nav-dropdown">
				                <MenuItem eventKey={3.1} onSelect={(e) => {this.props.showView('main')}}>
				                	{this.props.view === 'main' ? 'X' : '' } Main
				                </MenuItem>
				                <MenuItem eventKey={3.2} onSelect={(e) => {this.props.showView('c')}}>
				                	{this.props.view === 'c' ? 'X' : '' } Categories
				                </MenuItem>
				                <MenuItem eventKey={3.3} onSelect={(e) => {this.props.showView('a')}}>
				                	{this.props.view === 'a' ? 'X' : '' } Accounts
				                </MenuItem>
				                <MenuItem divider />
				                <MenuItem eventKey={3.4} onSelect={(e) => {this.props.showView('l')}}>
				                	{this.props.view === 'l' ? 'X' : '' } Logs
				                </MenuItem>
				                <MenuItem divider />
				                <MenuItem eventKey={3.5}> Settings </MenuItem>
				            </NavDropdown>
				        </Nav>
				        <Nav pullRight>
				            <NavItem eventKey={2} href="#"> Logout </NavItem>
				        </Nav>
				    </Navbar.Collapse>
				</Navbar>
			</div>
		)
	}
}

MenuBar.defaultProps = {
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
export default connect(mapStateToProps, mapDispatchToProps)(MenuBar)