import React from 'react';
import moment from 'moment';
import initials from '../../util/initials'
import $ from 'jquery';
import daterangepicker from 'daterangepicker';
import { connect } from 'react-redux'

/*
 * Note: this must be included:
    <link rel="stylesheet" type="text/css" media="all" href="%PUBLIC_URL%/daterangepicker/daterangepicker.css" />
 */

var dateRange_pickeroptions = {
	    "dateLimit": {
	        "days": 90
	    },
	    "showWeekNumbers": true,
	    "autoApply": true,
	    "alwaysShowCalendars": true,
	    "locale": {
	      "direction": "ltr",
	      "format": "DD.MM.YYYY",
	      "separator": " - ",
	      "applyLabel": "Apply",
	      "cancelLabel": "Cancel",
	      "fromLabel": "From",
	      "toLabel": "To",
	      "customRangeLabel": "Custom",
	      "daysOfWeek": ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
	      "monthNames": ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
	      "firstDay": 1
	    },
	    "linkedCalendars": false,
	    //"startDate": new Date(),
	    //"endDate": new Date(),
	    "ranges": {
	        'Today': [moment(), moment()],
	        'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
	        'Last 7 Days': [moment().subtract(6, 'days'), moment()],
	        'Last 30 Days': [moment().subtract(29, 'days'), moment()],
	        'This Month': [moment().startOf('month'), moment().endOf('month')],
	        'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
	     }
	  }

	var dateSingle_pickeroptions = {
	        "singleDatePicker": true,
	        "showDropdowns": false,
		    "showWeekNumbers": true,
		    "alwaysShowCalendars": true,
		    "autoApply": true,
		    "locale": {
		      "direction": "ltr",
		      "format": "DD.MM.YYYY",
		      "separator": " - ",
		      "applyLabel": "Apply",
		      "cancelLabel": "Cancel",
		      "fromLabel": "From",
		      "toLabel": "To",
		      "customRangeLabel": "Custom",
		      "daysOfWeek": ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
		      "monthNames": ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
		      "firstDay": 1
		    },
		 //   "startDate": new Date()
		  }
class DatePicker extends React.Component {
   constructor(props) {
	    super(props);
	    this.state = {
	    		start: props.value ? props.value : props.start ? props.start : new Date(),
	    		end: props.value ? null : props.end ? props.end : new Date()
	    }
  }
  
  componentWillReceiveProps(nextProps){
//	    console.log('componentWillReceiveProps' + this.props.componentWillReceiveProps)
	    
	    if(nextProps.value) {
	    	//console.log("VALUE=" + nextProps.value)
	    	$('#' + this.props.pickerName).data('daterangepicker').setStartDate(nextProps.value)
	    	$('#' + this.props.pickerName).data('daterangepicker').setEndDate(nextProps.value)
	    } else if (this.props.componentWillReceiveProps) {
	    	  //console.log("START=" + nextProps.start)
			  $('#' + this.props.pickerName).data('daterangepicker').setStartDate(nextProps.start)
			  $('#' + this.props.pickerName).data('daterangepicker').setEndDate(nextProps.end)
	  	} 
  }
   
  componentDidMount() {
	  //new:
		if(this.props.pickerType === "single") {
			$('#' + this.props.pickerName).daterangepicker(
					dateSingle_pickeroptions, 
					(start) =>  {
						console.log('New single date selected: ' + start.format('MM.DD.YYYY'));
						this.props.pickerCallback(start, this.props.pickerName)
					}
			)
		}
		if(this.props.pickerType === "range") {
			$('#' + this.props.pickerName).daterangepicker(
					  dateRange_pickeroptions, 
					  (start, end) => { 
							console.log('New date range selected: ' + start.format('MM.DD.YYYY')+ " - " + end.format('MM.DD.YYYY'));
							this.props.pickerCallback(start, end, this.props.pickerName)
				    }
			  )
		}
		$('#' + this.props.pickerName).data('daterangepicker').setStartDate(this.state.start)
		if (this.props.pickerType === "range") {
			$('#' + this.props.pickerName).data('daterangepicker').setEndDate(this.state.end)
		} else {
			$('#' + this.props.pickerName).data('daterangepicker').setEndDate(this.state.start)	
		}

  }
  render() {
    return (
    		<div>
    			<input disabled = {this.props.disabled}
    				onMouseDown={function(e) { 
       						e.preventDefault(); return false;
    				}}
    				onKeyDown={function(e) { 
    					var char = e.which || e.keyCode;
    					if( char !== 9) {
    						e.preventDefault(); return false;
    					}
    				}} 
    				type="text" 
    				id={this.props.pickerName} 
    				className="form-control" 
    				style={{
    						display: 'inline', 
    						width: this.props.pickerType === 'range' ? '185px' : '100px',
    						'backgroundColor' : (this.props.touched ? 'lightyellow' : '')
    				}}/>
    		</div>
    );
  }
}

DatePicker.defaultProps = {
		componentWillReceiveProps: false,
	    start: null, //initials.startDate,
	    end: null, //initials.endDate,
	    disabled: false,
	    touched: false
}

const mapStateToProps = (store) => {
	  return {
  		start: store.daterange.s,
		end: store.daterange.e
	  }
  }

export default connect(mapStateToProps)(DatePicker)

//module.exports = connect(mapStateToProps)(DatePicker)

