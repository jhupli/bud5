import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux'
import { ping } from '../../actions/ping'

class Ping extends React.Component {
    constructor(props) {
        super(props)
        this.timer = null
    }
    
    componentDidMount() {
        var f = () => {
        	this.props.ping()
        }
        this.timer = setInterval(f, 5000)
    }
  
    render() {
    // Render nothing if the "show" prop is false
    //if(!this.props.show) {
      return null;
    //}

    // The gray background
    const backdropStyle = {
      position: 'fixed',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: 'rgba(0,0,0,0.3)',
      padding: 50,
      zIndex: 1000
    };

    // The modal "window"
    const modalStyle = {
      backgroundColor: '#fff',
      borderRadius: 5,
      maxWidth: 500,
      minHeight: 300,
      margin: '0 auto',
      padding: 30
    };

    return (
      <div style={backdropStyle} >
        <div style={modalStyle} >
        	Waiting for service to be available...
        </div>
      </div>
    );
  }
}

Ping.defaultProps = {
		show: false
}

Ping.propTypes = {
  show: PropTypes.bool
}

const mapStateToProps = (store) => {
    return {
        show: (store.ping.length === 0 ? false : !store.ping.up)
    }
}

function mapDispatchToProps(dispatch) {
    return ({
        "ping": () => {
            dispatch(ping())
        }
    })
}


export default connect(mapStateToProps, mapDispatchToProps)(Ping)
