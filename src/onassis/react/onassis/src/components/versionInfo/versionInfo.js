import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux'
import { versionInfo } from '../../actions/versionInfo'

class VersionInfo extends React.Component {
    constructor(props) {
        super(props)
        this.props.versionInfo()
    }
  
    render() {
	    return (
	      <div >
	      	{this.props.version}
	      </div>
	    );
    }
}

const mapStateToProps = (store) => {
    return {
        version: store.versionInfo.version
    }
}

function mapDispatchToProps(dispatch) {
    return ({
        "versionInfo": () => {
            dispatch(versionInfo())
        }
    })
}


export default connect(mapStateToProps, mapDispatchToProps)(VersionInfo)
