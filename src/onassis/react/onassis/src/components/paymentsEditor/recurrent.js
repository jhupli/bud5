import {toDateFi} from '../../util/fiDate'
import {addDays, addMonths} from '../../util/addDays'
import {isEven} from '../../util/math'

var dateFormat = require('dateformat')

function _addDays(d, days) {
    var date = toDateFi(d)
    var date1 = addDays(date, days)
    return dateFormat(date1, "dd.mm.yyyy")
}

function _addMonths(d, months) {
  var date = toDateFi(d)
  var date1 = addMonths(date, months)
  return dateFormat(date1, "dd.mm.yyyy")
}

var f = {
	"DAILY" : (payment, iteration) => {
    payment.d = _addDays(payment.d, 1)
    payment.dc = _addDays(payment.dc, 1)
	},
	"WEEKLY" : (payment, iteration) => {
    payment.d = _addDays(payment.d, 7)
    payment.dc = _addDays(payment.dc, 7)
	},
	"FORTNIGHTLY" : (payment, iteration) => {
    payment.d = _addDays(payment.d, 14)
    payment.dc = _addDays(payment.dc, 14)
	},
	"TWICE_A_MONTH" : (payment, iteration) => {
		var date = toDateFi(payment.d)
		var date1 = null
		if(isEven(iteration)) {
			date1 = addDays(date, 14)
		} else {
			date1 = addDays(date, -14)
			date1 = addMonths(date1, 1)
		}
		payment.d = dateFormat(date1, "dd.mm.yyyy")

    date = toDateFi(payment.dc)
    date1 = null
    if(isEven(iteration)) {
      date1 = addDays(date, 14)
    } else {
      date1 = addDays(date, -14)
      date1 = addMonths(date1, 1)
    }
    payment.dc = dateFormat(date1, "dd.mm.yyyy")
	},
	"MONTHLY" : (payment, iteration) => {
		payment.d = _addMonths(payment.d, 1)
    payment.dc = _addMonths(payment.dc, 1)
	},
	"EVERY_OTHER_MONTH" : (payment, iteration) => {
    payment.d = _addMonths(payment.d, 2)
    payment.dc = _addMonths(payment.dc, 2)
	},
	"EVERY_3_MONTHS" : (payment, iteration) => {
    payment.d = _addMonths(payment.d, 3)
    payment.dc = _addMonths(payment.dc, 3)
	},
	"EVERY_4_MONTHS" : (payment, iteration) => {
    payment.d = _addMonths(payment.d, 4)
    payment.dc = _addMonths(payment.dc, 4)
  },
	"EVERY_6_MONTHS" : (payment, iteration) => {
    payment.d = _addMonths(payment.d, 6)
    payment.dc = _addMonths(payment.dc, 6)
	},
	"YEARLY" : (payment, iteration) => {
    payment.d = _addMonths(payment.d, 12)
    payment.dc = _addMonths(payment.dc, 12)
	}
}

function recurrent(payment, iteration, span) {
	f[span](payment, iteration)
}

export default recurrent