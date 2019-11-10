
var dateFormat = require('dateformat');

// fiDate represents date in fi-format (string)
function toDateFi(fiDate) {
		var parts = fiDate.split(".");
		var day = parts[0]
		var month = parts[1] - 1
		var year = parts[2]
		return new Date(year, month, day)
}

function fiDateTimeMillis(millis) {
		//TODO: any more elegant ways?
		var d = new Date(millis)
		
		var day = '00' + d.getDate()
		day = day.substr(day.length - 2)
		
		var m = '00' + (d.getMonth()+1) 
		m = m.substr(m.length - 2)
		
		var h = '00' + d.getHours()
		h = h.substr(h.length - 2)

		var mi = '00' + d.getMinutes()
		mi = mi.substr(mi.length - 2)
		
		var sec = '00' + d.getSeconds()
		sec = sec.substr(sec.length - 2)
		
		var mspart = '000' + d.getMilliseconds()
		mspart = mspart.substr(mspart.length - 3)
		var r =
		day + '.' +
		m + '.' +
		d.getFullYear() + ' ' +
		h + ':' +
		mi + ':'+
		sec + '.' +
		mspart 
		return r
}

function toDBFormatFi(fiDate) {
		var parts = fiDate.split(".");
		var day = parts[0]
		var month = parts[1] - 1
		var year = parts[2]
		return dateFormat(new Date(year, month, day), "yyyy-mm-dd")
}

function toDateDB(DBDate) {
		var parts = DBDate.split("-");
		var day = parts[2]
		var month = parts[1] - 1
		var year = parts[0]
		return new Date(year, month, day)
}

function toFiDBFormat(DBDate) {
		var parts = DBDate.split("-");
		var day = parts[2]
		var month = parts[1] - 1
		var year = parts[0]
		return dateFormat(new Date(year, month, day), "dd.mm.yyyy")
}

export {toDateFi, toDBFormatFi, fiDateTimeMillis, toFiDBFormat, toDateDB}