import React from 'react';
import { Navbar, /*NavItem,*/ Nav, NavDropdown, MenuItem} from 'react-bootstrap';
import { connect } from 'react-redux'

import AlertContainer from 'react-alert'
import alertOptions from '../../util/alertoptions'

import { show_view } from '../../actions/navi'
import { new_group } from '../../actions/group'

const copy = require('clipboard-copy')


class MenuBar extends React.Component{
	constructor(props) {
        super(props)
        this.generatedOk = this.generatedOk.bind(this)
        this.generateGroup = this.generateGroup.bind(this)
	}
	
	generatedOk(g) {
		this.msg.show('NEW GROUPID ON CLIPBOARD', {
	      time: 2000,
	      type: 'success',
	      icon: <img src="yes.png" alt="save ok" />
	    })
	 }
	
	generateGroup(){
		this.props.newGroup()
	}
	
	componentWillReceiveProps(nextprops) {
		if( nextprops.g !== this.props.g) {
			copy(nextprops.g)
			this.generatedOk(nextprops.g)
		}
	}
	
	render(){	
		return(
			<div>
				<AlertContainer ref={a => this.msg = a} {...alertOptions} />
				<Navbar>
				    <Navbar.Header>
				        <Navbar.Brand> Onassis </Navbar.Brand>
				        <Navbar.Toggle /> 
				    </Navbar.Header>
				    <Navbar.Collapse>
				        <Nav>
				            {/*<NavItem eventKey={1} href="#">View</NavItem>*/}
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
				                	{/*
				                <MenuItem divider />
				                <MenuItem eventKey={3.5}> Settings </MenuItem>*/}
				            </NavDropdown>
				            <NavDropdown eventKey={4} title="Util" id="basic-nav-dropdown">
				                <MenuItem eventKey={4.1} onSelect={(e) => {this.generateGroup()}}>
				                	 Generate unused groupid
				                </MenuItem>
				            </NavDropdown>
				        </Nav>
				        {/*
				        <Nav pullRight>
				            <NavItem eventKey={2} href="#"> Logout </NavItem>
				        </Nav>*/}
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
        view: store.navi.view,
        g: store.group.g
    }
}

function mapDispatchToProps(dispatch) {
    return ({
        showView: (view) => {
            dispatch(show_view(view))
        },
        newGroup: () => {
            dispatch(new_group())
        }
    })
}
export default connect(mapStateToProps, mapDispatchToProps)(MenuBar)