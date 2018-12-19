import React from 'react';

import {balances_load} from '../../actions/minibars'
import {set_daterange} from '../../actions/daterange'
import '../../../node_modules/c3/c3.min.css'

import { connect } from 'react-redux'
import { minibars } from './minibars_d3'

//var minibars = require('./minibars_d3')
/*var i=0;

function dataprovider(cb) {
	  console.log("dataprovider called")

	  axios.get('http://localhost:8080/calc', {		  
		  port: 8080,
		  params: {
			  left: 12345,
			  right: 5678
		  }
	  })
	  .then(function (response) {

		  console.log(response);
		  var ret = {
		    	  	  "data" : response.data,
		    	  	  balance : 0
		  }
		  cb(ret)
	  })
	  .catch(function (error) {

		  console.log(error);
	  });
}*/



class Minibars extends React.Component {
  constructor(props) {
    super(props);
  //  console.log("***************************** constructor")
    this.state = {
    		start: new Date(),
    		end: new Date(),
    		balances: null
    }
    // This binding is necessary to make `this` work in the callback
    this.select = this.select.bind(this);
  
    //this.dataprovider = dataprovider.bind(this);
    props.load();
  }
  
  componentDidMount() {
//	  console.log("***************************** componentDidMount "+ this.props.name)
	  var minibarconfig = {
			  	max_selection_days: 400,
			    bindto: this.props.name,
			    select: this.select,
			    //dataprovider: this.dataprovider
			    //dataprovider: dataprovider
			}  
	  
	  this.minibars = minibars;
	  this.minibars.config(minibarconfig);
  }
  
  select(start, end) {
	  console.log("***************************** select ")
	  this.su = false;
      this.props.setDateRange(new Date(start), new Date(end), "rangePicker1")
  }
  
  componentWillReceiveProps(nextProps){
	  console.log("***************************** componentWillReceiveProps ")
//	  console.log(nextProps)
	  this.minibars.generate(nextProps.balances)
	  this.minibars.select(nextProps.start, nextProps.end)
	  
  }

  render() {
	 
	 console.log("***************************** render ")
  
    return (
    	<div>
	        <div id={this.props.name} />
        </div>
        
    );
  }
}
const mapStateToProps = (store) => {
	  return {
  		start: store.daterange.s,
		end: store.daterange.e,
		balances: store.minibars.balances
	  }
  }

function mapDispatchToProps(dispatch) {
    return({
        load: () => {
        	dispatch(balances_load(0)) //all
        },
        setDateRange: (s, e, name) => {
        	dispatch(set_daterange(s, e, name)) 
        }
    })
}
export default connect(mapStateToProps, mapDispatchToProps)(Minibars)
