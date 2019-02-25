import React from 'react'
import c3 from 'c3'
import ReactDOMServer from 'react-dom/server';

import {addDays, daydiff} from '../../util/addDays'
import {accountsTooltipTable} from '../../util/tooltip'

import { chart_load } from '../../actions/chart'
import { day_load, account_load } from '../../actions/payments'
//import initials from '../../util/initials'
import { connect } from 'react-redux'
import { get_constants } from '../../actions/constants'
import { set_daterange, set_todayrange, daterange_next_block, daterange_prev_block } from '../../actions/daterange'

import '../../../node_modules/c3/c3.min.css'
import './style_region.css'

import {findInArray} from '../../util/findInArray'

var d3 = require('d3');

var dateFormat = require('dateformat');
var selectedDayOrAccount = -1

var SELECTONHOVER = false

class Chart extends React.Component {
    constructor(props) {
        super(props)
        
        var that = this;
        this.state = {
    		//start: initials.startDate,
        	start: null,
    		//end: initials.endDate,
        	end: null,
    		curves: null, //Curves
    		constants: props.getConstants('acc'), // return null, but launches fetch
    		refreshTime: null,
    		selectedType: '',
    		nextday: null,
    		prevday: null,
    		today: null,
    		redraw: null
        }
        
        this.boundingRect = null
        this.hahlo_ix = null
        this.hahlo = null
        this.draw = this.draw.bind(this)
        this.dateselect = this.dateselect.bind(this)
        this.paint_dayselection = this.paint_dayselection.bind(this)
        this.nextday = this.nextday.bind(this)
        this.prevday = this.prevday.bind(this)
        this.today = this.today.bind(this)
        this.redraw = this.redraw.bind(this)
        this.legendnames = this.legendnames.bind(this)
        this.onmouseover = this.onmouseover.bind(this)
        this.onmouseover_account = this.onmouseover_account.bind(this)
        this.onmouseout = this.onmouseout.bind(this)
        this.find_ix = this.find_ix.bind(this)
        this.chartDatetoDate = this.chartDatetoDate.bind(this)
        this.tooltip = this.tooltip.bind(this)
        this.c3onRendered = this.c3onRendered.bind(this)
        
        this.timer = null
        this.chart_config = {
        	onrendered: this.c3onRendered,
            bindto: '#chart',
            /*grid: {
                y: {
                    lines: [{
                        value: 0
                    }]
                }
            },*/
            grid: {
                x: {
                    show: true
                },
                y: {
                    show: true,
                    lines: [{
                        value: 0
                    }]
                }
            },
            tooltip: {
                grouped: true, // Default true
                /*format: {
                	value: function (value, ratio, id, index) { return currencyFormat(value) },
                	name: function (name, ratio, id, index) { return '' }
                },*/
                
            
              	contents: function (d, defaultTitleFormat, defaultValueFormat, color) {
            	  	return that.tooltip(d)
                }
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
                    	culling: {
                    		max: 10 // the number of tick texts will be adjusted to less than this value note: does not work?
                    	},
                        //format: x => {return dateFormat(x, "dd.mm.yyyy ddd")}
                    	format: x => {return dateFormat(x, "dd.mm")}
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
       //this.props.chartLoad(this.state.start ,this.state.end)
    }
    
    tooltip(dt) {
		var a_table = accountsTooltipTable(dt[0].x, this.props.curves, this.props.constants, true)
		return ReactDOMServer.renderToStaticMarkup(a_table)
    }
    
    onmouseout() {
        if (this.timer) {
            clearTimeout(this.timer)
        }
    }
    
    onmouseover(d) {
    	//console.log(d)
    	if(SELECTONHOVER) {
	    		if(d.id === "I" && daydiff(d.x, this.selectedDate) !== 0) {
	    		 if (this.timer) {
	    	       	clearTimeout(this.timer)
	    	    }
	    		var f = () => {
	    			this.dateselect(d.x)
	    		}
	    		
	    		//console.log("FIRE:" + d.id+ " " + d.x + " " + this.selectedDate)
		        this.timer = setTimeout(f, 300)
	    	}
    	} else {
    		this.dateselect(d.x)
    	}
    	/*
    	if (this.timer) {
    	       	clearTimeout(this.timer)
    	    }


       if (d.id === "I") { //this is because event will be trigger for all curves and we want to load day only once
	    	var f = () => {
	    		this.dateselect(d.x)
	    	}

	           console.log("FIRE:" + d.id+ " " + d.x)
	           this.timer = setTimeout(f, 300)
       }*/
    }
    
   
    
    chartDatetoDate(d) {
    	var year = d.substring(0,4)
    	var month = d.substring(4,6) - 1
    	var day = d.substring(6,8)
    	return new Date(year, month, day)
    }

    find_ix(d) {
    	if(!this.chart_config.data.columns) return null;

    	var ix = daydiff(this.chartDatetoDate(this.chart_config.data.columns[0][1]), d)
    	return ix
    }

    
    nextday() {
    	if(this.selectedDate) {
    		this.dateselect(addDays(this.selectedDate, 1))
    	}
    }
    
    prevday() {
    	if(this.selectedDate) {
    		this.dateselect(addDays(this.selectedDate, -1))
    	}
    }

    today() {
		var now = new Date()
		this.props.daterangeToday()
		this.dateselect(now)
    }
    
    redraw() {
    	this.draw()
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
    
    dateselect(d) {
    			this.selectedDate = d
    			//CHG-13this.legendnames(this.props.curves, this.props.constants)
            	//vähän vois kyl kauniimmaks laittaa:
    			var ix = this.find_ix(d)
    			if(null !== ix && ix === -1)  {
    				//console.log("vasemmalta yli "+ix)
    				this.props.daterangePrevBlock()
    				ix = this.chart_config.data.columns[0].length - 2
    				//console.log("vasemmalta yli "+ix)
    			}
    			if(null != ix && ix === this.chart_config.data.columns[0].length - 1)  {
    				//console.log("oikealta yli "+ix)
    				this.props.daterangeNextBlock()
    				ix = 0
    			}

                this.props.dayLoad(d, ix)
                this.paint_dayselection()

    }
   
    paint_dayselection() {
	        if(this.hahlo_ix != null) {
	          //console.log("gray repaint:"+dateFormat(this.selectedDate, "yyyymmdd"))
    			//dayselection : changing the initial
    			var alku = dateFormat(addDays(this.selectedDate,-1), "yyyymmdd") + "T20"
    			var loppu = dateFormat(this.selectedDate, "yyyymmdd") + "T4"
    			this.chart_config.regions[this.hahlo_ix].start = alku
    			this.chart_config.regions[this.hahlo_ix].end = loppu
    			c3.generate(this.chart_config)
			}
    }
    
    render() {
    	//var width = document.getElementById('chart').getBoundingClientRect().width
    	//console.log("render()")
        return ( 
        	<div id = "chart" onMouseOut = {() => this.onmouseout()} />
        )
   }
 
    draw() {
    	this.boundingRect = document.getElementById('chart').getBoundingClientRect()
    	//console.log("draw() width = " + this.boundingRect)
    	
    	if(!this.chart_config.data.columns) {
    		//console.log("draw() nothing yet")
    		return //data not yet there
    	}
    	/* red / white backgrounds here*/
       if(!this.chart_config.regions) {
    	   //init with white
    	   this.chart_config.regions = []
    	   for(var x=1; x<(this.chart_config.data.columns[0].length); x++) { //x date 
    		   
    		   for(var y=3; y<this.chart_config.data.columns.length; y++) { //y accounts start with 3 
    				var alku = dateFormat(addDays(this.chartDatetoDate(this.chart_config.data.columns[0][x]),-1), "yyyymmdd") + "T12"
    				var loppu = dateFormat(this.chartDatetoDate(this.chart_config.data.columns[0][x]), "yyyymmdd") + "T12"

    				this.chart_config.regions.push( 
	                    {"start": alku, "end": loppu, class: this.chart_config.data.columns[y][x] < 0 ? "red" : "white"}
	                 )		
    		   }
    	   }
    	   if(this.selectedDate) {
    	   //initial dayselection as last in array:
    		   //console.log("gray:"+dateFormat(this.selectedDate, "yyyymmdd"))
	    	   this.hahlo_ix = this.chart_config.regions.length
	    	   var alku1 = dateFormat(addDays(this.selectedDate,-1), "yyyymmdd") + "T20"
	    	   var loppu1 = dateFormat(this.selectedDate, "yyyymmdd") + "T4"
	    	   this.chart_config.regions.push( 
		            {"start": alku1, "end": loppu1, class: "gray"}
		       )
    	   }
       }
        c3.generate(this.chart_config)
   }
   
   c3onRendered() {
    	//console.log("c3onRendered() width = " + this.boundingRect)
    	this.chart_config.data.columns[0].forEach((el, i) => {
    		if(i>0) {
    			var svg = d3.selectAll('#chart').select('.c3-event-rect-'+(i-1))
    			var dd=this.chartDatetoDate(el)
    			svg[0][0].onclick = () => {
    				this.dateselect(dd)
    			}
    		}
    	})
    }
    
    componentWillReceiveProps(nextProps) {
    	//var width = document.getElementById('chart').getBoundingClientRect().width
    	//console.log("componentWillReceiveProps() width = " + width)
    	if(nextProps.nextday !== this.props.nextday) {
    		//console.log('N')
    		this.nextday()
    	}
    	if(nextProps.prevday !== this.props.prevday) {
    		//console.log('P')
    		this.prevday()
    	}
    	if(nextProps.today !== this.props.today) {
    		//console.log('T')
    		this.today()
    	}
    	if(nextProps.redraw !== this.props.redraw) {
    		//console.log('RD')
    		this.redraw()
    	}
    	
    	if(nextProps.selectedType !== this.props.selectedType) {
    		//console.log('TY')
    		selectedDayOrAccount = -1 //reset
    	}
    	
    	if(nextProps.selectedType === 'd') {
    		this.selectedDate = nextProps.params.d
    		this.paint_dayselection()
    	}
    		
    	
    	
    	if( nextProps.constants && nextProps.constants[this.props.constants_id]) {
    		//console.log('C')
    		var constants = nextProps.constants[this.props.constants_id]
    		var selectedItem = findInArray(constants, c => { return c.value === nextProps.selectedValue })
	    	var validConstants = constants.filter(  c => { return (c.valid || c === selectedItem) })
	    	this.setState({
		    		selectedValue : selectedItem,
		    		'items' : validConstants		
		    })
    	}
    	
        if (
        	// eslint-disable-next-line	
        		!(this.state.start == nextProps.start) //note 'undefined == null' yields true but 'undefined !== null' as well
        	|| 
        	// eslint-disable-next-line
        		!(this.state.end == nextProps.end)) { 
        	//console.log('R')
        	//selected date span changed?
        	this.setState({
		    		start : nextProps.start,
		    		end : nextProps.end		
		    })
            this.props.chartLoad(nextProps.start, nextProps.end)
        } else if (nextProps.curves !== this.props.curves || nextProps.refreshTime !== this.props.refreshTime) {
        	//console.log('CU')
        	//TODO jäi tähän laita värit ja nimet tilit on jo account#ssa
        	this.chart_config.data.names = {}
        	this.chart_config.data.types = {}
        	this.chart_config.data.colors = {}
        	this.chart_config.data.columns = nextProps.curves //curves updated
        	this.chart_config.regions = null 
        	this.legendnames(nextProps.curves, nextProps.constants)
        	//this.chart_config.data.names['I'] ='Income'
        	this.chart_config.data.colors['I'] ='green'
        	//this.chart_config.data.names['E'] ='Exp'
        	this.chart_config.data.colors['E'] ='red'
//        	var max = 0, min = 0
        	if (nextProps.curves) {
        		//console.log("curves 1")
        		var f = n =>  { return key === '' + n.value}
	        	for(var i=3; i<nextProps.curves.length; i++) {
	        		var key = nextProps.curves[i][0]
	        		var acc = findInArray(nextProps.constants['acc'], f)
	        		this.chart_config.data.colors[key] = acc.color
	        		this.chart_config.data.types[key] = 'spline'
	        	}
	            this.draw()
        	}
        } 
    }
    
    
    legendnames(curves, constants) {
    	//heihei ihan karmeen näköstä koodia
    	this.chart_config.data.names['I'] ='Income'
    	this.chart_config.data.names['E'] ='Exp'
        if (curves) {
        		var f = n => { return key === ''+n.value}
	        	for(var i=3; i<curves.length; i++) {
	        		var key = curves[i][0]
	        		var acc = findInArray(constants['acc'], f)
	        		this.chart_config.data.names[key] = acc.label
	        	}
        }
    } 
}

const mapStateToProps = (store) => {
    return {
        start: store.daterange.s,
        end: store.daterange.e,
        curves: store.chart.curves,
        nextday: store.chart.nextday,
        prevday: store.chart.prevday,
        today: store.chart.today,
        redraw: store.chart.redraw,
        refreshTime:  store.constants.refreshTime,
        constants: store.constants.constants,
        selectedType: store.payments.queryType,
        params: store.payments.params,
    }
}


function mapDispatchToProps(dispatch) {
    return ({
        chartLoad: (s, e) => {
        	selectedDayOrAccount = -1; //reset
            dispatch(chart_load(s, e))
        },
        dayLoad: (d, index) => {
        	if (index === selectedDayOrAccount) return;
        	selectedDayOrAccount = index;
            dispatch(day_load(d))
        },
        accountLoad: (a, d1, d2) => {
        	if (a === selectedDayOrAccount) return;
        	selectedDayOrAccount = a;
            dispatch(account_load(a, d1, d2))
        },
        getConstants: (id) => {
        	get_constants(id, dispatch)
        },
        daterangeToday: () => {
            dispatch(set_todayrange())
        },
        daterangeNextBlock: () => {
            dispatch(daterange_next_block())
        },
        daterangePrevBlock: () => {
            dispatch(daterange_prev_block())
        },
        setDateRange: (start, end) => {
            dispatch(set_daterange(start, end))
        }
    })
}

export default connect(mapStateToProps, mapDispatchToProps)(Chart)