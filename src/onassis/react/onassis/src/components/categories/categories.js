import React from 'react';
import { connect } from 'react-redux'
import { Panel } from 'react-bootstrap'
import CategoriesEditor from '../categoriesEditor/CategoriesEditor'

class Categories extends React.Component {
	render() {
		return(
			<div>
			  <Panel >
			  	<Panel.Heading style={{paddingTop: "4px", paddingBottom: "3px", height: "45px", fontSize: "23px"}}>
				  	<span style={{display: "flow-root", alignItems: "center"}}>
				  		Categories 
				  	</span>
			  	</Panel.Heading>
			  	<Panel.Body>					
					<CategoriesEditor initCategories={this.props.categories} />
				</Panel.Body>
			  </Panel>
			</div>
			)
	}
}

const mapStateToProps = (store) => {
    return {
        categories: store.categories.categories
    }
}

export default connect(mapStateToProps)(Categories)
