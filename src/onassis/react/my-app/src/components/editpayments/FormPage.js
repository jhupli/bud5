import React from 'react'
import Form from './Form'
import {add} from '../../actions'
import { connect } from 'react-redux'

class FormPage extends React.Component {
  constructor(props) {
	    super(props);
	    this.submit = this.submit.bind(this);
  }

  submit(values)  {
	  console.log("form")
	  console.log(JSON.stringify(values,null,2))
	  console.log("uncomment-->")
	  //this.props.submitPage(values);
  }
  
  
  
  render() {
	  
  
    return (
            <div >
            	<Form onSubmit={this.submit} masksEnabled={true}/>
            </div>
    )
  }
}

function mapDispatchToProps(dispatch) {
    return({
        submitPage: (values) => {
        	dispatch(add(values.i, values.d)) 
        }
    })
}

export default connect(null, mapDispatchToProps)(FormPage)
//export default FormPage;