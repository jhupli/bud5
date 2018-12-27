import React from 'react'
import currencyFormat from './currency'
import {findInArray, findIndexInArray} from './findInArray'
var dateFormat = require('dateformat');
function accountsTooltipTable(dt, curves, constants, showdate = false) {
	var a_table = {};
	
	if(curves) {
		var d = dateFormat(dt, 'yyyymmdd') + 'T00'
		var ix = findIndexInArray( curves[0], n => { return d === n})
		var trs = []
		
		curves.forEach( (c, i) => {
			if( i===1 ) {
				trs.push(
						<tr className='c3-tooltip-name--data2' key={-1}>
			                      <td className="name"><span style={{backgroundColor: 'green'}}></span></td>
			                      <td className="value" >{currencyFormat(c[ix])}</td>
			            </tr>
			     )					
			}
			if( i===2 ) {
				trs.push(
						<tr className='c3-tooltip-name--data2' key={-2}>
			                      <td className="name"><span style={{backgroundColor: 'red'}}></span></td>
			                      <td className="value" >{currencyFormat(c[ix])}</td>
			            </tr>
			     )	
			}
			if(i>=3) {
				var acc2 = findInArray(constants['acc'], n => { return c[0] === '' + n.value})

				trs.push(
						<tr className='c3-tooltip-name--data2' key={acc2.value}>
			                      <td className="name"><span style={{backgroundColor: acc2.color}}></span></td>
			                      <td className="value" >{currencyFormat(c[ix])}</td>
			            </tr>
			     )
			}
		})
		
		a_table = 
			        <table className='c3-tooltip'>
		              <tbody>
		              	  {showdate ? <th colspan = '2'>{dateFormat(dt, "dd.mm.yyyy ddd")}</th>: null}
		              	  {trs}
		              </tbody>
		            </table>
		return a_table
	}
}
export {accountsTooltipTable}