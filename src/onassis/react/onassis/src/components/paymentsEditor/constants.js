import {toDBFormatFi, toDateFi} from '../../util/fiDate'
import currencyFormat  from '../../util/currency'
import {daydiff} from  '../../util/addDays'

var dateFormat = require('dateformat')

const fields = ['d','dc','b','i','s','g','c','a','descr']

const defaultValues = {
	id: null,
	l: false ,
	d: dateFormat(new Date(), "dd.mm.yyyy"),
  dc: dateFormat(new Date(), "dd.mm.yyyy"),
	i: "-0.00",
	c: null,
	a: null,
	s: true,
	g: "",
	descr: "",
	b: null
}

const initialMaskValues = {
	id: null,
	l: false,
	d: dateFormat(new Date(), 'dd.mm.yyyy'),
  dc: dateFormat(new Date(), 'dd.mm.yyyy'),
	i: '-0.00',
	c: null,
	a: null,
	s: true,
	g: '',
	descr: '',
	b: null
}

const 	validators = {
	'check': (value) => {
			return null
		  },
	'l': (value) => {
			return null
		  },
	'd': (value, values) => {
      let diff = daydiff(toDateFi(value), toDateFi(values.dc));
			return (value != null && value !== '' && diff <= 0) ? null : 'required'
		  },
  'dc': (value, values) => {
      let diff = daydiff(toDateFi(value), toDateFi(values.d));
      return (value != null && value !== '' && diff >= 0) ? null : 'required'
    },
	'i':  (value) => {
			return (value !== '') ? null : 'required'
		  },
	's': (value) => {
			return null
		  },
	'c': (value) => {
			return (value != null && value !== '') ? null : 'required'
		  },
	'a': (value) => {
			return (value !== null && value !== '') ? null : 'required'
		  },
	'g': (value) => {
			return null
		  },
	'descr': (value) => {
			return null
		  },
	'b': (value) => {
			return null
		  }
}

function preInitFormat(payments, checkedList) {
	var copy = deepCopy(payments, checkedList)
	copy.forEach((p) => {
		// 2006-12-31 -> 31.12.2005
		p.d = dateFormat(p.d, "dd.mm.yyyy")
    p.dc = dateFormat(p.dc, "dd.mm.yyyy")
		// 2 -> +2.00
		p.i =  (p.i >=0 ? '+' : '') + currencyFormat(p.i)
	})
	return copy
}

function preSubmitFormat(payments) {
	payments.forEach( (p) => {
		if(p.i) {
			// "+2.00" -> 2
			p.i =  parseFloat(p.i)
			//p.i_initial = parseFloat(p.i_initial)
		 }
		 if(p.d) {
			// "1.12.2001" -> "2001-12-01"
			p.d = toDBFormatFi(p.d)
			//p.d_initial = toDBFormatFi(p.d_initial)
		 }
    if(p.dc) {
      // "1.12.2001" -> "2001-12-01"
      p.dc = toDBFormatFi(p.dc)
      //p.d_initial = toDBFormatFi(p.d_initial)
    }
	})
	return payments
}


function copyObject(b) {
	return {
		check: b,
		id: b,
		l: b,
		d: b,
    dc: b,
		i: b,
		c: b,
		a: b,
		s: b,
		g: b,
		descr: b,
		"b": b
	}
}

function copyPayment(payment, checkedList, index = null) {
	return {
		check: checkedList.map( e => {return e.id} ).indexOf(payment.id) > -1,
		index: index,
		id: payment.id,
		l: payment.l,
		d: payment.d,
    dc: payment.dc,
		i: payment.i,
		c: payment.c,
		a: payment.a,
		s: payment.s,
		g: payment.g,
		descr: payment.descr,
		b: payment.b
	}
}

function  deepCopy(payments, checkedList) {
	var copy = []
	if(payments) {
        payments.forEach(
            (p) => {copy.push(copyPayment(p, checkedList))}
        )
	}
	return copy
}

const recurSpans = [
	{label: "daily", value: "DAILY"},
	{label: "weekly", value: "WEEKLY"},
	{label: "fortnightly", value: "FORTNIGHTLY"},
	{label: "twice a month", value: "TWICE_A_MONTH"},
	{label: "monthly", value: "MONTHLY"},
	{label: "every other month", value: "EVERY_OTHER_MONTH"},
	{label: "every 3 months", value: "EVERY_3_MONTHS"},
	{label: "every 4 months", value: "EVERY_4_MONTHS"},
	{label: "every 6 months", value: "EVERY_6_MONTHS"},
	{label: "yearly", value: "YEARLY"},
	];

function initState(payments, checkedList, recurring = { recur: false, times: 1, span: recurSpans[4]} ) {
	var copy = {
		values : [],
		initial : [],
		errors : [],
		touched : [],
		deleted : [],
		masked : copyObject(false),
		maskValues : initialMaskValues,
		maskErrors : copyObject(null),
		sort: null,
		asc: true,
		allChecked: false,
		recurring : recurring,
	}
	copy.recurring.recur = false
	
	payments.forEach((p, index) => {
		copy.values.push(copyPayment(p, checkedList, index))
		copy.initial.push(copyPayment(p, checkedList))
		copy.errors.push(copyObject(null))
		copy.touched.push(copyObject(false))
		copy.deleted.push(false)
	})
	return copy
}

function oneIsTrue(row) {
	var ret =
		row.d ||
    row.dc ||
		row.i ||
		row.c ||
		row.a ||
		row.s ||
		row.g ||
		row.descr
		
	return ret
}

function copyArray(array) {
	return array.splice(0)
}

export {
	fields,
	initState,
	defaultValues,
	initialMaskValues, 
	validators,
	preInitFormat,
	preSubmitFormat,
	oneIsTrue,
	copyArray,
	recurSpans,
	copyPayment
}