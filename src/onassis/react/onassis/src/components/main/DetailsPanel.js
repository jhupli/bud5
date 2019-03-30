import React from 'react' // ← Main React library
import { connect } from 'react-redux'
import { Panel, Button } from 'react-bootstrap';
import Payments from '../payments/payments'
import PaymentSelection from '../paymentSelection/paymentSelection'
import Spinner from './Spinner'
import { get_constants } from '../../actions/constants'
import { findInArray } from '../../util/findInArray'
import {accountsTooltipTable} from '../../util/tooltip'
import ButtonL from '../chart/buttons/buttonL'
import ButtonR from '../chart/buttons/buttonR'
import ButtonToday from '../chart/buttons/buttonToday'

import { category_load } from '../../actions/payments'
import { account_load } from '../../actions/payments'

import Calculator from '../calculator/calculator'

import {prev_in_history, next_in_history} from '../../actions/payments'
import Media from 'react-media';


var dateFormat = require('dateformat');
var FontAwesome = require('react-fontawesome');


class DetailsPanel extends React.Component{
	constructor(props) {
	super(props);
	this.state = {
    		accs: props.getConstants('acc'), // return null, but launches fetch
    		cats: props.getConstants('cat'), // return null, but launches fetch
    		refreshTime: null,
        	start: null,
        	end: null,   
       }
	   this.defaultDate = new Date()
       this.prevHistory = this.prevHistory.bind(this)
       this.nextHistory = this.nextHistory.bind(this)
	}
    componentWillReceiveProps(nextProps){
    	if( nextProps.constants && nextProps.constants['acc']) {
    		this.setState({
		    		accs : nextProps.constants['acc']
		    })
    	}
    	if( nextProps.constants && nextProps.constants['cat']) {
    		this.setState({
		    		accs : nextProps.constants['cat']
		    })
    	}
    	
    	//range changed: load cat / acc anew
    	if (this.state.start == null && nextProps.start != null) {
	    	this.setState({
		    		start : nextProps.start,
		    		end : nextProps.end		
		    })
	  	} else if (
        	// eslint-disable-next-line	
        		!(this.state.start == nextProps.start) //note 'undefined == null' yields true but 'undefined !== null' as well
        	|| 
        	// eslint-disable-next-line
        		!(this.state.end == nextProps.end)) { 
    		this.setState({
		    		start : nextProps.start,
		    		end : nextProps.end		
		    })
    		switch(this.props.queryType) {
    					case 'd' : break;
    					case 'a' : debugger
    							   this.props.accountLoad(this.props.params.a, nextProps.start, nextProps.end)
    							   break;
    					case 'c' : this.props.categoryLoad(this.props.params.c, nextProps.start, nextProps.end)
    							   break;
    		}
    	}
    	
    }

  prevHistory() {
    this.props.prevInHistory()
  }

  nextHistory() {
    this.props.nextInHistory()
  }
  render(){


	    var info = '';
		switch(this.props.queryType) {
			case 'd' : 
        info =
          <span style = {{"display": "inline-flex",
                          "whiteSpace": "nowrap",
                           "alignItems": "center",
                           'marginRight':'5px',
                            'marginLeft':'5px'}}>
            <ButtonL />
              <div  style = {{'marginRight':'5px',  'marginLeft':'5px'}} >
                {dateFormat(this.props.params.d, "dd.mm.yyyy ddd")}
              </div>
            <ButtonR />
          </span>

  				this.defaultDate = this.props.params.d
				break
			case 'a' :
				var acc = findInArray(this.props.constants['acc'], n => { return this.props.params.a === '' + n.value})
				info = 
				<span >
					<span style = {{'marginRight':'5px', 'marginLeft':'5px'}}>
						Account : <FontAwesome name = 'square' style = {{'color': acc.color}} />
					</span>
	    			<span>
	    				{acc.label + ' (' + dateFormat(this.props.params.d1, "dd.mm.yyyy ddd")
	    					+ ' - '+  dateFormat(this.props.params.d2, "dd.mm.yyyy ddd") + ')'}
	    			</span>
	    		</span>
				
				break
			case 'c' : 
				var cat = findInArray(this.props.constants['cat'], n => { return this.props.params.c === '' + n.value})
				info = 
				<span >
					<span style = {{'marginRight':'5px', 'marginLeft':'5px'}}>
						Issue : <FontAwesome name = 'square' style = {{'color': cat.color}} />
					</span>
	    			<span>
	    				{cat.label + ' (' + dateFormat(this.props.params.d1, "dd.mm.yyyy ddd")
	    					+ ' - '+  dateFormat(this.props.params.d2, "dd.mm.yyyy ddd") + ')'}
	    			</span>
	    		</span>
	    		
				break
			case 'g' :
				info = 
					<span>
						&nbsp;<FontAwesome name='paperclip' size='lg' />  {this.props.params.g}
					</span>
				break
			case 'l' : 
				info = 'Checked'
				break
			default: info = '';
				break
		}
		var a_table = null
		
		if(this.props.queryType === 'd' && this.props.curves) {

			a_table = accountsTooltipTable(this.props.params.d, this.props.curves, this.props.constants)
			if(a_table !== null) {
				a_table =
				<div style={{paddingBottom: "4px"}}>
					{a_table}
			    </div>
			}

		}

    var hstackfirst = this.props.historystack != null && this.props.historystack.first != null ? this.props.historystack.first : true
    var hstacklast = this.props.historystack != null && this.props.historystack.last != null ? this.props.historystack.last : true

    var headerNormal =
    				<Panel.Heading style={{paddingTop: "5px", paddingBottom: "3px", height: "45px"}}>
    				  	<div style={{"display": "inline-flex", "whiteSpace": "nowrap", "alignItems": "center", fontSize: "23px"}}>
				  			<FontAwesome name='th-list' /> <span style={{fontSize: "15px"}}>{info}</span><PaymentSelection /><Spinner fetching={this.props.fetching} />
				  		</div>
				  		<span className="pull-right" style={{display: "inline-flex"}}>
					  		<ButtonToday />
					  		<Button style={{borderRadius: '20px', height: '35px', paddingTop: '2px', color: (hstackfirst ? "gray" : "darkblue")}} onClick={this.prevHistory} disabled={hstackfirst}><FontAwesome name='arrow-circle-left' size="2x" color="blue" /></Button>
					  		<Button style={{borderRadius: '20px', height: '35px', paddingTop: '2px', color: (hstacklast ? "gray": "darkblue")}} disabled={hstacklast} onClick={this.nextHistory}><FontAwesome name='arrow-circle-right' size="2x" color="blue" /></Button>
					  	</span>
					</Panel.Heading>
	
	var headerNarrow =
				<Panel.Heading style={{paddingTop: "5px", paddingBottom: "3px", height: "80px"}}>
				  	<div style={{"display": "inline-flex", "whiteSpace": "nowrap", "alignItems": "center", fontSize: "23px"}}>
			  			<FontAwesome name='th-list' /> <span style={{fontSize: "15px"}}>{info}</span><PaymentSelection /><Spinner fetching={this.props.fetching} />
			  		</div>
			  		<span style={{display: "inline-flex"}}>
				  		<ButtonToday />
				  		<Button style={{borderRadius: '20px', height: '35px', paddingTop: '2px', color: (hstackfirst ? "gray" : "darkblue")}} onClick={this.prevHistory} disabled={hstackfirst}><FontAwesome name='arrow-circle-left' size="2x" color="blue" /></Button>
				  		<Button style={{borderRadius: '20px', height: '35px', paddingTop: '2px', color: (hstacklast ? "gray": "darkblue")}} disabled={hstacklast} onClick={this.nextHistory}><FontAwesome name='arrow-circle-right' size="2x" color="blue" /></Button>
				  	</span>
				</Panel.Heading>
	return(
			<div>
			  <Panel style={{width: '100%'}}>
			  	<Media query="(max-width: 432px)">
			          {matches =>
			            matches ? (
			              headerNarrow
			            ) : (
			              headerNormal
			            )
			          }
    			</Media>
			  	
			  	<Panel.Body>					
			  	<table>
			  	  <tbody>
				  	  <tr>
	        			<td style={{width: '100%', verticalAlign: 'top'}}>
		        			<Payments defaultDate={this.defaultDate}/>
		        		</td>
		        		<td style={{width: '30px', verticalAlign: 'top', paddingLeft: '4px'}}>
		        		{a_table}
		        		<Calculator />
		        		</td>
		        	   </tr>
	        	   </tbody>
        	      </table>
				</Panel.Body>
			  </Panel>
			</div>					
		)
	}
}

const mapStateToProps = (store) => {
    return {
        fetching: store.payments.fetching,
        queryType: store.payments.queryType,
        historystack: store.payments.historystack,
        params: store.payments.params,
        refreshTime:  store.constants.refreshTime,
        constants: store.constants.constants,
        curves: store.chart.curves,
        
        start: store.daterange.s,
        end: store.daterange.e,
    }
}

function mapDispatchToProps(dispatch) {
    return({
        getConstants: (id) => {
        	get_constants(id, dispatch)
        },
        prevInHistory: () => {
          dispatch(prev_in_history())
        },
        nextInHistory: () => {
          dispatch(next_in_history())
        },
        accountLoad: (a, d1, d2) => {
            dispatch(account_load(a, d1, d2))
        },
        categoryLoad: (c, d1, d2) => {
            dispatch(category_load(c, d1, d2))
        },
    })
}
export default connect(mapStateToProps, mapDispatchToProps)(DetailsPanel)

