import React from 'react'
import currencyFormat from './currency'
import {findInArray, findIndexInArray} from './findInArray'
var dateFormat = require('dateformat');
var FontAwesome = require('react-fontawesome');

function accountsTooltipTable(dt, curves, constants, showdate = false) {
	var a_table = {};
	
	if(curves) {
		var d = dateFormat(dt, 'yyyymmdd') + 'T00'
		var ix = findIndexInArray( curves[0], n => { return d === n})
    if (ix < 0) {
      return null
    }
		var trs = []
		
		curves.forEach( (c, i) => {
			if( i===1 ) {
				trs.push(
						<tr className='c3-tooltip-name--data2' key={-1}>
			                      <td className="name"><span style={{backgroundColor: 'green'}}></span></td>
                            <td className="name">Income</td>
			                      <td className="value" >{currencyFormat(c[ix])}</td>
			            </tr>
			     )					
			}
			if( i===2 ) {
				trs.push(
						<tr className='c3-tooltip-name--data2' key={-2}>
			                      <td className="name"><span style={{backgroundColor: 'red'}}></span></td>
                            <td className="name">Exp</td>
			                      <td className="value" >{currencyFormat(c[ix])}</td>
			            </tr>
			     )	
			}
			if(i>=3 && constants && constants['acc']) {
				var acc2 = findInArray(constants['acc'], n => { return c[0] === '' + n.value})
        var icon = null
        if(acc2.icon) {
          icon = 	(<span  style = {{'color': 'black', 'marginRight':'15px'}}><FontAwesome name = {acc2.icon} style = {{'color': 'black', 'marginRight':'15px', 'marginLeft':'5px'}} /></span>)
        }
				trs.push(
						<tr className='c3-tooltip-name--data2' key={acc2.value}>
                            <td className="name"><span style={{backgroundColor: acc2.color}}></span></td>
                            <td className="name" style={{
                              display: 'block',
                              textOverflow: 'ellipsis',
                              overflow: 'hidden',
                              whiteSpace: 'nowrap',
                              maxWidth: '80px'
                            }}>
                              {icon}
                            {acc2.label}</td>
			                      <td className="value" >{currencyFormat(c[ix])}</td>
			            </tr>
			     )
			}
		})
		
		a_table = 
			        <table className='c3-tooltip'>
		              <tbody>
		              	  {showdate ? <th colSpan = '3'>{dateFormat(dt, "dd.mm.yyyy ddd")}</th>: null}
		              	  {trs}
		              </tbody>
		            </table>
		return a_table
	}
}
export {accountsTooltipTable}