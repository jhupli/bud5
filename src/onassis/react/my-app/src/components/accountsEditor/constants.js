import {toDBFormatFi} from '../../util/fiDate'
import currencyFormat  from '../../util/currency'

var dateFormat = require('dateformat')

const fields = ['color','descr','credit','active']

const defaultValues = {
	id: null,
	credit: false,
	active: true,
	descr: '',
	color: 'blue'
}

const validators = {
	'credit': (value) => {
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

function preInitFormat(accounts) {
	return deepCopy(accounts)
}

function preSubmitFormat(payments) {
	return payments
}


function copyObject(b) {
	return {
		id: b,
		credit: b,
		active: b,
		descr: b,
		color: b
	}
}

function copyAccount(account, index = null) {
	return {
		'index': index,
		id: account.id,
		credit: account.credit,
		active: account.active,
		descr: account.descr,
		color: account.color
	}
}

function  deepCopy(accounts) {
	var copy = []
	accounts.forEach(
		(p) => {copy.push(copyAccount(p))}
	)
	return copy
}

function initState(accounts) {
	var copy = {
		values : [],
		initial : [],
		errors : [],
		touched : [],
		deleted : [],
		sort: null,
		asc: true
	}
	accounts.forEach((p, index) => {
		copy.values.push(copyAccount(p, index))
		copy.initial.push(copyAccount(p))
		copy.errors.push(copyObject(null))
		copy.touched.push(copyObject(false))
		copy.deleted.push(false)
	})
	return copy
}

function oneIsTrue(row) {
	var ret =
		row.credit ||
		row.active ||
		row.descr ||
		row.color 
	return ret
}

function activeIsRo(row) {
	var ret =
		row.credit ||
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