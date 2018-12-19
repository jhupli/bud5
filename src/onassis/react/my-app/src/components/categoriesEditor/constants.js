import currencyFormat  from '../../util/currency'

const fields = ['color','descr','i','active']

const defaultValues = {
	id: null,
	i: "+0.00",
	active: true,
	descr: '',
	color: 'blue'
}

const validators = {
	'i': (value) => {
			return null
		  },
	'active': (value) => {
			return null
		 },
	'descr':  (value) => {
			return (value !== '') ? null : 'required'
		  },
	'color': (value) => {
			return (value !== '') ? null : 'required'
		  }
}

function preInitFormat(categories) {
	var copy = deepCopy(categories)
	copy.forEach((c) => {
		// 2 -> +2.00
		c.i =  (c.i >=0 ? '+' : '') + currencyFormat(c.i)
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
	})
	return payments
}


function copyObject(b) {
	return {
		id: b,
		i: b,
		active: b,
		descr: b,
		color: b
	}
}

function copyCategory(category, index = null) {
	return {
		'index': index,
		id: category.id,
		i: category.i,
		active: category.active,
		descr: category.descr,
		color: category.color
	}
}

function  deepCopy(payments) {
	var copy = []
	payments.forEach(
		(p) => {copy.push(copyCategory(p))}
	)
	return copy
}

function initState(categories) {
	var copy = {
		values : [],
		initial : [],
		errors : [],
		touched : [],
		deleted : [],
		sort: null,
		asc: true
	}
	categories.forEach((p, index) => {
		copy.values.push(copyCategory(p, index))
		copy.initial.push(copyCategory(p))
		copy.errors.push(copyObject(null))
		copy.touched.push(copyObject(false))
		copy.deleted.push(false)
	})
	return copy
}

function oneIsTrue(row) {
	var ret =
		row.i ||
		row.active ||
		row.descr ||
		row.color 
	return ret
}

function activeIsRo(row) {
	var ret =
		row.i ||
		row.descr ||
		row.color 
	return ret
}
function copyArray(array) {
	return array.splice(0)
}

export {
	fields,
	initState,
	defaultValues,
	validators,
	preInitFormat,
	preSubmitFormat,
	oneIsTrue,
	copyArray,
	activeIsRo
}