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
    		today: null
        }
        
        this.hahlo_ix = null
        this.hahlo = null
        this.draw = this.draw.bind(this)
        this.dateselect = this.dateselect.bind(this)
        this.nextday = this.nextday.bind(this)
        this.prevday = this.prevday.bind(this)
        this.today = this.today.bind(this)
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
                        format: x => {return dateFormat(x, "dd.mm.yyyy ddd")}
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
    
    c3onRendered() {
    	this.chart_config.data.columns[0].forEach((el, i) => {
    		if(i>0) {
    			var svg = d3.selectAll('#chart').select('.c3-event-rect-'+(i-1))
    			var dd=this.chartDatetoDate(el)
    			svg[0][0].onclick = () => {

    				console.log('^'+dd)
    				this.dateselect(dd)
    			    		}
    		}
    	})
    	/*
    	for(var i=1; i<this.chart_config.data.columns[0].length; i++) {
    		var svg = d3.selectAll('#chart').select('.c3-event-rect-'+(i-1))
    		var d=this.chart_config.data.columns[0][i];
    		var dd=this.chartDatetoDate(d)
    		svg[0][0].onclick = () => {
    			var t = i;
    			console.log('^'+dd)
    			this.dateselect(dd)
    		}
    	}*/
    	/*
    	var svg = d3.selectAll("#chart").select(".c3-event-rect-0")
    	svg[0][0].onclick = x => {console.log(x)}
    	svg = d3.selectAll("#chart").select(".c3-event-rect-1")
    	svg[0][0].onclick = x => {
    		console.log(this.chartDatetoDate(this.chart_config.data.columns[0][2]))
    		this.dateselect(this.chartDatetoDate(this.chart_config.data.columns[0][2]))
    	}*/
    	
    	
    }
    onmouseout() {
        if (this.timer) {
            clearTimeout(this.timer)
        }
    }
    
    onmouseover(d) {
    	console.log(d)
    	if(SELECTONHOVER) {
	    		if(d.id === "I" && daydiff(d.x, this.selectedDate) !== 0) {
	    		 if (this.timer) {
	    	       	clearTimeout(this.timer)
	    	    }
	    		var f = () => {
	    			this.dateselect(d.x)
	    		}
	    		
	    		console.log("FIRE:" + d.id+ " " + d.x + " " + this.selectedDate)
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
    	//console.log("*******" +ix)
    	return ix
    	/*
    	for(var i=0; i<this.chart_config.data.columns[0].length; i++) {
    		if(d_str == this.chart_config.data.columns[0][i]) {
    			console.log("i:"+i+" d_str:" + d_str)
    			return i
    		}
    	}
    	return null;*/
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
    	console.log("TODAY")
    		var now = new Date()
    		//console.log("diff="+diff)
    		//this.props.setDateRange(addDays(now, -10), addDays(now, +10))
    		this.props.daterangeToday()
    		this.dateselect(now)
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
    			console.log("DATESEL")
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
                
                if(this.hahlo_ix) {
	    			//dayselection:
	    			var alku = dateFormat(addDays(this.selectedDate,-1), "yyyymmdd") + "T20"
	    			var loppu = dateFormat(this.selectedDate, "yyyymmdd") + "T4"
	    			this.chart_config.regions[this.hahlo_ix].start = alku
	    			this.chart_config.regions[this.hahlo_ix].end = loppu
	    			c3.generate(this.chart_config)
    			}
             /*   
                var d1 = addDays(d, -1)
                var d1_str = dateFormat(d1, "yyyymmdd") + "T20"
                var d2_str = dateFormat(d, "yyyymmdd") + "T4"
                if(!this.chart_config.regions || this.chart_config.regions[0].start != d1_str	) {
                	console.log("****");
                	this.hahlo = {"start": d1_str, "end": d2_str, class:'gray'}

                	if(this.chart_config.regions) {
                		console.log("push hahlo");
                		this.chart_config.regions.push(this.hahlo)
                	} else {
                		console.log("not push hahlo");
                	}
                	
	                //this.draw() //TODO: POISTA TÄÄ JOS VAAN SAAT POIS
                }*/
    }
    
    draw() {
    	console.log("draw()0")
    	if(!this.chart_config.data.columns) {
    		console.log("draw() nothing yet")
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
    	   //dayselection as last in array:
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

    componentWillReceiveProps(nextProps) {
    	console.log("componentWillReceiveProps")
    	if(nextProps.nextday !== this.props.nextday) {
    		this.nextday()
    	}
    	if(nextProps.prevday !== this.props.prevday) {
    		this.prevday()
    	}
    	if(nextProps.today !== this.props.today) {
    		this.today()
    	}
    	if(nextProps.selectedType !== this.props.selectedType) {
    		//console.log('reset')
    		//console.log(nextProps)
    		selectedDayOrAccount = -1 //reset
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
        if (
        		
        	// eslint-disable-next-line	
        	!(this.state.start == nextProps.start) //note 'undefined == null' yields true but 'undefined !== null' as well
        	|| 
        	// eslint-disable-next-line
        	!(this.state.end == nextProps.end)
        		
        		
        ){ //selected date span changed?
        	this.setState({
		    		start : nextProps.start,
		    		end : nextProps.end		
		    })
            this.props.chartLoad(nextProps.start, nextProps.end)
        } else if (nextProps.curves !== this.props.curves || nextProps.refreshTime !== this.props.refreshTime){
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
        	var max = 0, min = 0
        	if (nextProps.curves) {
        		console.log("curves 1")
        		var f = n =>  { return key === '' + n.value}
	        	for(var i=3; i<nextProps.curves.length; i++) {
	        		var key = nextProps.curves[i][0]
	        		var acc = findInArray(nextProps.constants['acc'], f)
	        		/*var acc = nextProps.constants['acc'].find( 
	        			n => { return key == n.value}
	        		)*/
	        		//this.chart_config.data.names[key] = acc.label
	        		this.chart_config.data.colors[key] = acc.color
	        		this.chart_config.data.types[key] = 'spline'
	        		
	        		/*var m = findInArray(nextProps.curves[i], n => {return n > max})
	        		max = m>max ? m : max
	        			
	        		m = findInArray(nextProps.curves[i], n => {return n < min})
	        		min = m<min ? m : min*/ //taulu ei ala 0:sta
	        			
	        	}
	        	console.log("min="+min+" max="+max)
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
    	/*CHG-13
    	if( this.selectedDate && this.chart_config.data.columns) {
    		var ix = this.find_ix(this.selectedDate) + 1 //first column is name
    		console.log("xx"+ix)
    		if(ix && ix>0 && ix<this.chart_config.data.columns[0].length) {
	    		//note: 0 column is the id
	    		//var s = dateFormat(this.selectedDate.x, "dd.mm.yyyy")
	    		//var i = this.selectedDate.index + 1
	    		this.chart_config.data.names['I'] += " ["+currencyFormat(this.chart_config.data.columns[1][ix])+"]" //+s+ " "+i
	    		this.chart_config.data.names['E'] += " ["+currencyFormat(this.chart_config.data.columns[2][ix])+"]"
	
	    		if (curves) {
	    			console.log(curves)
		        	for(var i=3; i<curves.length; i++) {
		        		var key = curves[i][0]
		        		var acc = findInArray(constants['acc'], n => { return key == n.value})
		        		this.chart_config.data.names[key] += " ["+currencyFormat(this.chart_config.data.columns[i][ix])+"]"
		        	}
	    		}
    		}
    		
    	}
    	*/
    }
    
    render() {
    	console.log("render");
        return ( 
        	<div id = "chart" onMouseOut = {() => this.onmouseout()} />
        )
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
        refreshTime:  store.constants.refreshTime,
        constants: store.constants.constants,
        selectedType: store.payments.queryType
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