import {toDateFi} from '../../util/fiDate'
import {addDays, addMonths} from '../../util/addDays'
import {isEven} from '../../util/math'

var dateFormat = require('dateformat')

var f = {
	"DAILY" : (payment, iteration) => {
		var date = toDateFi(payment.d)
		var date1 = addDays(date, 1)
		payment.d = dateFormat(date1, "dd.mm.yyyy")
	},
	"WEEKLY" : (payment, iteration) => {
		var date = toDateFi(payment.d)
		var date1 = addDays(date, 7)
		payment.d = dateFormat(date1, "dd.mm.yyyy")
	},
	"FORTNIGHTLY" : (payment, iteration) => {
		var date = toDateFi(payment.d)
		var date1 = addDays(date, 14)
		payment.d = dateFormat(date1, "dd.mm.yyyy")
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
	},
	"MONTHLY" : (payment, iteration) => {
		var date = toDateFi(payment.d)
		var date1 = addMonths(date, 1)
		payment.d = dateFormat(date1, "dd.mm.yyyy")
	},
	"EVERY_OTHER_MONTH" : (payment, iteration) => {
		var date = toDateFi(payment.d)
		var date1 = addMonths(date, 2)
		payment.d = dateFormat(date1, "dd.mm.yyyy")
	},
	"EVERY_3_MONTHS" : (payment, iteration) => {
		var date = toDateFi(payment.d)
		var date1 = addMonths(date, 3)
		payment.d = dateFormat(date1, "dd.mm.yyyy")
	},
	"EVERY_4_MONTHS" : (payment, iteration) => {
		var date = toDateFi(payment.d)
		var date1 = addMonths(date, 4)
		payment.d = dateFormat(date1, "dd.mm.yyyy")
	},
	"EVERY_6_MONTHS" : (payment, iteration) => {
		var date = toDateFi(payment.d)
		var date1 = addMonths(date, 6)
		payment.d = dateFormat(date1, "dd.mm.yyyy")
	},
	"YEARLY" : (payment, iteration) => {
		var date = toDateFi(payment.d)
		var date1 = addMonths(date, 12)
		payment.d = dateFormat(date1, "dd.mm.yyyy")
	}
}

function recurrent(payment, iteration, span) {
	f[span](payment, iteration)
}

export default recurrent