import React from 'react'
import c3 from 'c3'

import '../../../node_modules/c3/c3.min.css'

import { pie_load } from '../../actions/pie'
import { category_load } from '../../actions/payments'
import { connect } from 'react-redux'
import currencyFormat from '../../util/currency'
import initials from '../../util/initials'
import { get_constants } from '../../actions/constants'

import { findInArray } from '../../util/findInArray'

import Media from 'react-media';

import './pie.css'

//require('default-passive-events')

var d3 = require('d3');


    
var SELECTONHOVER = false
var names = {}

class Pie extends React.Component {

    constructor(props) {
        super(props)
        var that = this;
        this.state = {
        	constants: props.getConstants('cat'), // return null, but launches fetch
    		refreshTime: null,
    		redraw: null
        }

        this.draw = this.draw.bind(this)
        this.redraw = this.redraw.bind(this)
        this.onmouseover = this.onmouseover.bind(this)
        this.onmouseout = this.onmouseout.bind(this)
        this.c3onRendered = this.c3onRendered.bind(this)
        this.d3onMouseI = this.d3onMouseI.bind(this)
        this.d3onMouseOutI = this.d3onMouseOutI.bind(this)
        this.d3onMouseE = this.d3onMouseE.bind(this)
        this.d3onMouseOutE = this.d3onMouseOutE.bind(this)
        this.getBoudingRect = this.getBoudingRect.bind(this)
        
        this.timer = null
        this.chart_config = {
        		onrendered: this.c3onRendered,
        		sum_i: 0,
        		sum_e: 0,
    		    bindto: '#pie',
    		    tooltip: {
    		        format: {
    		            //TODO make a util function to format a sum:
    		            value: function (value, ratio, id) {
    		            	/*if (id.startsWith("p")) {*/
    		            	if (id.substr(0,1) === "p") {
    		            		return value + "  (" + currencyFormat(value*100/that.chart_config.sum_i) + "%)"
    		            	}else{
    		            		return -value + "  (" + currencyFormat(-value*100/that.chart_config.sum_e) + "%)";
    		        		    
    		            	}
    		            }
    		        }
    		    },
    		    data: {
                    names: {},
    		        columns: [],
    		        colors: {},
    		        order: null,
    		        onclick: function (c) { 
    		        	that.onmouseover(c.id)
    		        },
    		        onmouseover: function (c) { 
    		        	if (SELECTONHOVER) {
    		        		that.onmouseover(c.id)
    		        	}
    		        }, 		        
    		        type: 'pie'
    		    },
    		    pie: {
    		        label: {
    		            format: function (value, ratio, id) {
    		            	//console.log(value)
    		            	//console.log(ratio)
    		            	//console.log(id)
    		            	//console.log(names[id])
    		                return names[id];
    		            }
    		        }
    		    },
                legend: {
                	show: true,
                    item: {
                        onclick: function(c) {
                        	that.onmouseover(c)
                        },
                        onmouseover: function(c) {
                            //magic copied from caller to do the default behaviour (i.e. dim other curves and focus the selected curve) :
                            if (!this.transiting && this.isTargetToShow(c)) {
                                this.api.focus(c)
                            }
                            //magic ends here
                            if (SELECTONHOVER) {
                            	that.onmouseover(c)
                            }
                        }
                    }
                }
    		}
    }

    onmouseout() {
        if (this.timer) {
            clearTimeout(this.timer)
        }
    }

    onmouseover(c) {
            var f = () => {
                this.props.categoryLoad(c.substring(1), this.props.start, this.props.end)
            }
            this.timer = setTimeout(f, 300)
    }
    
    getBoudingRect() {
    	var br = document.getElementById(this.chart_config.bindto.substring(1)).getBoundingClientRect()
    	var doc = document.documentElement
    	var left = (window.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0)
    	var top = (window.pageYOffset || doc.scrollTop)  - (doc.clientTop || 0)
    	return {
    		"left": left + br.left,
    		"top" : top + br.top
    	}
    	
    }
    d3onMouseI() {
    	var br = this.getBoudingRect()
    	d3.select('#incomes')
    	.style(
    			{"display": "inline", "left": -60 + br.left + "px", top: 150 + br.top + "px"}
    	)
    }
    
    d3onMouseOutI() {
    	d3.select('#incomes')
    	.style(
    			{"display": "none"}
    	)
    }
    
    d3onMouseE() {
    	var br = this.getBoudingRect()
    	d3.select('#expences')
    	.style(
    			{"display": "inline", "left": br.left + 'px', top: 150 + br.top + 'px'}
    	)
    }
    
    d3onMouseOutE() {
    	d3.select('#expences')
    	.style(
    			{"display": "none"}
    	)
    }
    
    c3onRendered() {
    	
    	var INNER_ARC = 0
    	var OUTER_ARC = this.lessThan700 ? this.lessThan450 ? 8 : 20 : 40
   
    	var total  = this.chart_config.sum_i - this.chart_config.sum_e
    	if( total === 0 ) return
    	var middlepoint = (-this.chart_config.sum_e/total)*2*Math.PI

	var arc_minus = d3.svg.arc()
	.innerRadius(INNER_ARC)
	.outerRadius(OUTER_ARC)
	.startAngle(0)
	.endAngle(middlepoint);
	
	 var arc_plus = d3.svg.arc()
	.innerRadius(INNER_ARC)
	.outerRadius(OUTER_ARC)
	.startAngle(middlepoint)
	.endAngle(2*Math.PI);
	 
	 var arc_space = d3.svg.arc()
	.innerRadius(OUTER_ARC)
	.outerRadius(OUTER_ARC + 1)
	.startAngle(0)
	.endAngle(2*Math.PI);
	 
    var svg = d3.selectAll("#pie").select(".c3-chart-arcs")
    	
    svg
    .append("svg:path")
    .attr("id", "arc-minus")
    .style("stroke-width", 0)
    .attr("d", arc_minus)
    .on({
        "click": this.d3onMouseE,
        "mouseover": this.d3onMouseE,
        "mouseout": this.d3onMouseOutE	
    })
 
     svg
    .append("svg:path")
    .attr("id", "arc-plus")
    .style("stroke-width", 0)
    .attr("d", arc_plus)    
    .on({
        "click": this.d3onMouseI,
        "mouseover": this.d3onMouseI,
        "mouseout": this.d3onMouseOutI
    })
    
    svg
    .append("svg:path")
    .attr("id", "arc-space")
    .style("stroke-width", 0)
    .attr("d", arc_space)    

    }
    
    draw() {
         c3.generate(this.chart_config)
    }

    redraw() {
    	this.draw()
    }
    
    componentWillReceiveProps(nextProps) {
        if (this.props.start !== nextProps.start || this.props.end !== nextProps.end) { //selected date span changed?
            this.props.pieLoad(nextProps.start, nextProps.end)
        } else {

        	var colors = {}
        	var columns = []
        	var sum_i = 0
        	var sum_e = 0
        	var id = null
        	

        	
        	
        	if (nextProps.slices && nextProps.constants && nextProps.constants['cat']) {
	        	nextProps.slices.forEach(
	        		(s) => {
	        			var cat = findInArray(nextProps.constants['cat'], n => { return s.c === n.value})
	        			/* var cat = nextProps.constants['cat'].find( 
		        			n => { return s.c == n.value}
	        			 )*/
	        			if (s.sl<0) {
	        				sum_e += s.sl
	        				id = 'n' + s.c
	        				//names[id] = 'nimi' + s.c
	        				names[id] = cat.label
	        				//colors[id] = 'red'
	        				colors[id] = cat.color
	        				columns.push([id, -s.sl])
	        			}else{
	        				sum_i += s.sl
	        				id = 'p' + s.c
	        				//names[id] = 'nimi' + s.c
	        				names[id] = cat.label
	        				//colors[id] = 'green'
	        				colors[id] = cat.color
	        				columns.push([id, s.sl])
	        			}
	        		}
	        	)
	        	this.chart_config.sum_i = sum_i
	        	this.chart_config.sum_e = sum_e
	            this.chart_config.data.names = names
	            this.chart_config.data.colors = colors
	            this.chart_config.data.columns = columns
	            this.draw()
        	}
        }
    }

    render() {
        return (
        	<div>
        	
    	        <Media query="(max-width: 699px)">
    				{matches => this.lessThan700 = matches }
    			</Media>
     	        <Media query="(max-width: 449px)">
    				{matches => this.lessThan450 = matches }
    			</Media>
    			
        	<div id = "pie" onMouseOut = {() => this.onmouseout()} />
        	<table id="incomes" className="c3-tooltip" style={{display: "none", position: "absolute"}}>
        	<tbody>
        		<tr>
        			<td >
        				<span style={{backgroundColor : "green"}} /> Income total
        			</td>
        			<td >
        				{currencyFormat(this.chart_config.sum_i)}
        			</td>
        		</tr>
        	</tbody>
        	</table>
        	<table id="expences" className="c3-tooltip" style={{display: "none", position: "absolute"}}>
        	<tbody>
        		<tr>
        			<td >
        				<span style={{backgroundColor : "red"}} /> Expences total
        			</td>
        			<td >
        				{currencyFormat(this.chart_config.sum_e)}
        			</td>
        		</tr>
        	</tbody>
        	</table>        	
        	</div>

        )
    }
}

Pie.defaultProps = {
    	start: initials.startDate,
    	end: initials.endDate,
        slices: null
}
const mapStateToProps = (store) => {
    return {
        start: store.daterange.s,
        end: store.daterange.e,
        slices: store.pie.slices,
        refreshTime:  store.constants.refreshTime,
        redraw: store.pie.redraw,
        constants: store.constants.constants
    }
}

function mapDispatchToProps(dispatch) {
    return ({
        pieLoad: (s, e) => {
            dispatch(pie_load(s, e))
        },
        categoryLoad: (c, d1, d2) => {
            dispatch(category_load(c, d1, d2))
        },
        getConstants: (id) => {
        	get_constants(id, dispatch)
        }       
    })
}

export default connect(mapStateToProps, mapDispatchToProps)(Pie)