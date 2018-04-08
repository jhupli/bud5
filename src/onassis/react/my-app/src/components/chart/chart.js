import React from 'react'
import c3 from 'c3'
import {addDays, daydiff} from '../../util/addDays'

import { chart_load } from '../../actions/chart'
import { day_load, account_load } from '../../actions/payments'
import initials from '../../util/initials'
import { connect } from 'react-redux'
import { get_constants } from '../../actions/constants'

import '../../../node_modules/c3/c3.min.css'

import findInArray from '../../util/findInArray'
import currencyFormat from '../../util/currency'


var dateFormat = require('dateformat');
var _index_ = -1

var SELECTONHOVER = false

class Chart extends React.Component {
    constructor(props) {
        super(props)
        
        var that = this;
        this.state = {
    		start: initials.startDate,
    		end: initials.endDate,
    		curves: null, //Curves
    		constants: props.getConstants('acc'), // return null, but launches fetch
    		refreshTime: null,
    		queryType: '',
    		nextday: null,
    		prevday: null,
    		today: null
        }
        this.draw = this.draw.bind(this)
        this.dateselect = this.dateselect.bind(this)
        this.nextday = this.nextday.bind(this)
        this.prevday = this.prevday.bind(this)
        this.today = this.today.bind(this)
        this.legendnames = this.legendnames.bind(this)
        this.onmouseover = this.onmouseover.bind(this)
        this.onmouseover_account = this.onmouseover_account.bind(this)
        this.onmouseout = this.onmouseout.bind(this)
        this.timer = null
        this.chart_config = {
            bindto: '#chart',
            grid: {
                y: {
                    lines: [{
                        value: 0
                    }]
                }
            },
            tooltip: {
                grouped: false // Default true
            },
            /*regions: [
                {start:"20180202T12", end: "20180203T12"},
                {start:2, end:4, class:'foo'}
            ],*/
            data: {
                x: 'x',
                onmouseover: function (c) { 
    		        	if (SELECTONHOVER) {
    		        		that.onmouseover(c)
    		        	}
    		    },
                onclick: this.onmouseover,
                xFormat: '%Y%m%dT%H',
                columns: null,
                transition: {
                    duration: 500
                },
                names : {},
                colors : {},
                types : {},
                type: 'bar',
                groups: [
                    ['E', 'I']
                ],
                selection: {}
            },
            axis: {
                x: {
                    type: 'timeseries',
                    tick: {
                        format: '%d.%m.'
                    }
                }
            },
            legend: {
                item: {
                    onclick: function(a) {
 //                       console.log("LEGEND")
 //                       console.log(a)
                    	that.onmouseover_account(a)
                    },
                    onmouseover: function(a) {
//                        console.log(a)
                        //magic copied from caller to do the default behaviour (i.e. dim other curves and focus the selected curve) :
                        if (!this.transiting && this.isTargetToShow(a)) {
                            this.api.focus(a)
                        }
                        //magic ends here
                        if (SELECTONHOVER) {
                        	that.onmouseover_account(a)
                        }
                    }
                }
            }
        }
        this.props.chartLoad(this.state.start ,this.state.end)
    }

    onmouseout() {
        if (this.timer) {
            clearTimeout(this.timer)
        }
    }

    onmouseover(d) {
    	console.log(d)
    	
    	if (this.timer) {
            clearTimeout(this.timer)
        }

       // if (d.id === "I") { //this is because event will be trigger for all curves and we want to load day only once
    	var f = () => {
    		this.dateselect(d)
    	}
          /*  var f = () => {
            	//vähän vois kyl kauniimmaks laittaa:
                this.props.dayLoad(d)
                var d1 = addDays(d.x, -1)
                var d1_str = dateFormat(d1, "yyyymmdd") + "T12"
                var d2_str = dateFormat(d.x, "yyyymmdd") + "T12"
            //    debugger
                if(!this.chart_config.regions || this.chart_config.regions[0].start != d1_str	) {
	                this.chart_config.regions = [
	                    {"start": d1_str, "end": d2_str}
	                 ]
	                this.draw()
                }
            }*/
            console.log("FIRE")
            this.timer = setTimeout(f, 300)
      //  }
    }
    
    
    dateselect(d) {
    			this.selectedDate = d
    			this.legendnames(this.props.curves, this.props.constants)
            	//vähän vois kyl kauniimmaks laittaa:
                this.props.dayLoad(d)
                var d1 = addDays(d.x, -1)
                var d1_str = dateFormat(d1, "yyyymmdd") + "T12"
                var d2_str = dateFormat(d.x, "yyyymmdd") + "T12"
            //    debugger
                if(!this.chart_config.regions || this.chart_config.regions[0].start != d1_str	) {
	                this.chart_config.regions = [
	                    {"start": d1_str, "end": d2_str}
	                 ]
	                this.draw()
                }
    }
    
    nextday() {
    	if(this.selectedDate) {
    		this.dateselect(
    				{
    					"x": addDays(this.selectedDate.x, 1),
    					"index": (this.selectedDate.index + 1)
    				}
    		)
    	}
    }
    
    prevday() {
    	if(this.selectedDate) {
    		this.dateselect(
    				{
    					"x": addDays(this.selectedDate.x, -1),
    					"index": (this.selectedDate.index - 1)
    				}
    		)
    	}
    }
    today() {
    	if(this.selectedDate) {
    		var now = new Date()
    		var diff = daydiff(this.selectedDate.x, now)
    		//console.log("diff="+diff)
    		var ix = this.selectedDate.index + diff
    		
    		this.dateselect(
    				{
    					"x": now,
    					"index": ix
    				}
    		)
    	}
    }
    onmouseover_account(a) {
    	if (a === "I" || a === "E") return;
        //magic copied from caller to do the default behaviour (i.e. dim other curves and focus the selected curve) :
       /* if (!this.transiting && this.isTargetToShow(a)) {
            this.api.focus(a)
        }*/
        //magic ends
    	var that = this
        var f = () => {

            this.props.accountLoad(a, that.props.start ,that.props.end)
        }
        this.timer = setTimeout(f, 300)
    }
    
    draw() {
        c3.generate(this.chart_config)
    }

    componentWillReceiveProps(nextProps) {
    	if(nextProps.nextday !== this.props.nextday) {
    		this.nextday()
    	}
    	if(nextProps.prevday !== this.props.prevday) {
    		this.prevday()
    	}
    	if(nextProps.today !== this.props.today) {
    		this.today()
    	}
    	if(nextProps.queryType !== this.props.queryType) {
    		console.log('reset')
    		console.log(nextProps)
    		_index_ = -1
    	}
    	if( nextProps.constants && nextProps.constants[this.props.constants_id]) {
    		var constants = nextProps.constants[this.props.constants_id]
	    	//var selectedItem = constants.find( c => { return c.value === nextProps.selectedValue }) //not supported by IE11
    		
    		var selectedItem = findInArray(constants, c => { return c.value === nextProps.selectedValue })
	    	var validConstants = constants.filter(  c => { return (c.valid || c === selectedItem) })
	    	this.setState({
		    		selectedValue : selectedItem,
		    		'items' : validConstants		
		    })
    	}
        if (this.props.start !== nextProps.start || this.props.end !== nextProps.end) { //selected date span changed?
            this.props.chartLoad(nextProps.start, nextProps.end)
        } else if (nextProps.curves != this.props.curves || nextProps.refreshTime != this.props.refreshTime){
        	//TODO jäi tähän laita värit ja nimet tilit on jo account#ssa
        	//debugger //muista types!!!!!
        	this.chart_config.data.names = {}
        	this.chart_config.data.types = {}
        	this.chart_config.data.colors = {}
        	this.chart_config.data.columns = nextProps.curves //curves updated
        	this.legendnames(nextProps.curves, nextProps.constants)
        	//this.chart_config.data.names['I'] ='Income'
        	this.chart_config.data.colors['I'] ='green'
        	//this.chart_config.data.names['E'] ='Exp'
        	this.chart_config.data.colors['E'] ='red'
        	if (nextProps.curves) {
	        	for(var i=3; i<nextProps.curves.length; i++) {
	        		var key = nextProps.curves[i][0]
	        		var acc = findInArray(nextProps.constants['acc'], n => { return key == n.value})
	        		/*var acc = nextProps.constants['acc'].find( 
	        			n => { return key == n.value}
	        		)*/
	        		//this.chart_config.data.names[key] = acc.label
	        		this.chart_config.data.colors[key] = acc.color
	        		this.chart_config.data.types[key] = 'line'
	        	}
	            
	            this.draw()
        	}
           
        }
    }
    
    legendnames(curves, constants) {
    	//heihei ihan karmeen näköstä koodia
    	//jotain häikkää kun jos klikkaa ni saldot ei enää muutu ajan fktiona
    	this.chart_config.data.names['I'] ='Income'
    	this.chart_config.data.names['E'] ='Exp'
        if (curves) {
	        	for(var i=3; i<curves.length; i++) {
	        		var key = curves[i][0]
	        		var acc = findInArray(constants['acc'], n => { return key == n.value})
	        		this.chart_config.data.names[key] = acc.label
	        	}
        }
    	if( this.selectedDate && this.selectedDate.index>=0 && 
    		this.selectedDate.index < this.chart_config.data.columns[0].length - 1) {
    		//note: 0 column is the id
    		//var s = dateFormat(this.selectedDate.x, "dd.mm.yyyy")
    		//var i = this.selectedDate.index + 1
    		this.chart_config.data.names['I'] += " ["+currencyFormat(this.chart_config.data.columns[1][this.selectedDate.index + 1])+"]" //+s+ " "+i
    		this.chart_config.data.names['E'] += " ["+currencyFormat(this.chart_config.data.columns[2][this.selectedDate.index + 1])+"]"

    		if (curves) {
    			console.log(curves)
	        	for(var i=3; i<curves.length; i++) {
	        		var key = curves[i][0]
	        		var acc = findInArray(constants['acc'], n => { return key == n.value})
	        		this.chart_config.data.names[key] += " ["+currencyFormat(this.chart_config.data.columns[i][this.selectedDate.index + 1])+"]"
	        	}
    		}
    		
    		
    	}
    }
    
    render() {
        return ( 
        	<div id = "chart" onMouseOut = {() => this.onmouseout()} />
        )
    }
}

const mapStateToProps = (store) => {
    return {
        start: store.dateRange.s,
        end: store.dateRange.e,
        curves: store.chart.curves,
        nextday: store.chart.nextday,
        prevday: store.chart.prevday,
        today: store.chart.today,
        refreshTime:  store.constants.refreshTime,
        constants: store.constants.constants,
        queryType: store.payments.queryType
    }
}


function mapDispatchToProps(dispatch) {
    return ({
        chartLoad: (s, e) => {
        	_index_ = -1;
            dispatch(chart_load(s, e))
        },
        dayLoad: (d) => {
        	if (d.index === _index_) return;
        	_index_ = d.index;
            dispatch(day_load(d.x))
        },
        accountLoad: (a, d1, d2) => {
        	if (a === _index_) return;
        	_index_ = a;
            dispatch(account_load(a, d1, d2))
        },
        getConstants: (id) => {
        	get_constants(id, dispatch)
        }
    })
}

export default connect(mapStateToProps, mapDispatchToProps)(Chart)