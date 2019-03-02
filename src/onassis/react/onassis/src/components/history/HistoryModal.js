import React from 'react'
import { connect } from 'react-redux'
import { Button, Modal } from 'react-bootstrap';
import LogEntry from '../logs/logEntry'
import './style.css'

class HistoryModal extends React.Component {
  render() {
	if(this.props.logentries == null) return null
  var r = this.props.logentries[0]

  var {show, onHide} = {...this.props}
	var props = {show, onHide}
	return (

      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered="true"
        dialogClassName="modal-90w"
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            History
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
        	<LogEntry logEntry={r} singleEntry={true}/>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.props.onHide}>Close</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

const mapStateToProps = (store) => {
    return {
        logentries: store.auditlog.logentries,
        //fetching: store.auditlog.fetching
    }
}

export default connect(mapStateToProps)(HistoryModal)