import React from 'react'
import { connect } from 'react-redux'
import { Button, Modal, FormGroup, FormControl, InputGroup} from 'react-bootstrap';
import LogEntry from '../logs/logEntry'
import './style.css'
import AlertContainer from 'react-alert'
import alertOptions from '../../util/alertoptions'
class GroupId extends React.Component {

	constructor(props) {
        super(props)
        this.generatedOk = this.generatedOk.bind(this)
        this.copy = this.copy.bind(this)
	}

    copy() {
        var copyText = document.getElementById("groupid");
             copyText.select();
             copyText.setSelectionRange(0, 99999)
             document.execCommand("copy");
    }

    generatedOk() {
        this.msg.show('COPIED ON CLIPBOARD', {
          time: 2000,
          type: 'success',
          icon: <img src="yes.png" alt="save ok" />
        })
    }

  render() {
    var {show, onHide} = {...this.props}
	var props = {show, onHide}
	return (
	<div>
	    <AlertContainer ref={a => this.msg = a} {...alertOptions} />
      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered="true"
        dialogClassName="modal-90w"
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Unused group-id
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <FormGroup>
            <InputGroup>
              <FormControl type="text" defaultValue={this.props.g} id="groupid"></FormControl>
                <InputGroup.Button>
                  <Button onClick={() => {this.copy(); this.props.onHide(); this.generatedOk(); }} >Copy</Button>
                </InputGroup.Button>
            </InputGroup>
          </FormGroup>

        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.props.onHide} bsStyle="primary">Close</Button>
        </Modal.Footer>
      </Modal>
      </div>
    );
  }
}

const mapStateToProps = (store) => {
    return {
    }
}

export default connect(mapStateToProps)(GroupId)