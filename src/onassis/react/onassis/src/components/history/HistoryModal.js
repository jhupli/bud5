import React from 'react'
import { connect } from 'react-redux'
import { Button, Modal } from 'react-bootstrap';
import AuditLogTable from '../logs/auditlogTable'
import './style.css'

class HistoryModal extends React.Component {
  render() {
	debugger
    return (
      <Modal
        {...this.props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        dialogClassName="modal-90w"
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            History
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          	<AuditLogTable logentries={this.props.logentries} single={true}/>
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
        fetching: store.auditlog.fetching
    }
}

export default connect(mapStateToProps)(HistoryModal)