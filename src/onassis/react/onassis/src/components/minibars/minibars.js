import React from 'react';

import {balances_load} from '../../actions/minibars'
import {set_daterange} from '../../actions/daterange'
import '../../../node_modules/c3/c3.min.css'

import { connect } from 'react-redux'
import { minibars } from './minibars_d3'

class Minibars extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    		start: new Date(),
    		end: new Date(),
    		balances: null,
    		redraw: null
    }
    // This binding is necessary to make `this` work in the callback
    this.select = this.select.bind(this);
    this.redraw = this.redraw.bind(this);
    props.load();
  }
  
  componentDidMount() {
	  var minibarconfig = {
			  	max_selection_days: 400,
			    bindto: this.props.name,
			    select: this.select,
			}  
	  
	  this.minibars = minibars;
	  this.minibars.config(minibarconfig);
  }
  
  select(start, end) {
	  this.su = false;
      this.props.setDateRange(new Date(start), new Date(end), "rangePicker1")
  }
  
  redraw() {
	  this.minibars.generate(this.props.balances)
	  this.minibars.select(this.props.start, this.props.end)
  }
  
  componentWillReceiveProps(nextProps){
	  this.minibars.generate(nextProps.balances)
	  this.minibars.select(nextProps.start, nextProps.end)
  }

  render() {
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
		balances: store.minibars.balances,
		redraw: store.minibars.redraw,
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
