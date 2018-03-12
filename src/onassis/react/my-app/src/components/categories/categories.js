import React from 'react';
import { connect } from 'react-redux'
import { Panel } from 'react-bootstrap'
import CategoriesEditor from '../categoriesEditor/CategoriesEditor'
import { load } from '../../actions/categories'

class Categories extends React.Component {
	constructor(props) {
	    super(props);
	    this.state = {
	        categories: []
	    }
	    this.props.categoriesLoad()
	}
	
	render() {
		return(
		<div>
			<Panel header="Categories">
				<CategoriesEditor initCategories={this.props.categories} />
			</Panel>
		</div>)
	}
}

const mapStateToProps = (store) => {
    return {
        categories: store.categories.categories
    }
}

function mapDispatchToProps(dispatch) {
    return ({
        categoriesLoad: () => {
            dispatch(load())
        }       
    })
}
export default connect(mapStateToProps, mapDispatchToProps)(Categories)
