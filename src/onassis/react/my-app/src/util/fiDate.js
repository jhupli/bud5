
var dateFormat = require('dateformat');

// fiDate represents date in fi-format
function toDateFi(fiDate) {
		var parts = fiDate.split(".");
		var day = parts[0]
		var month = parts[1] - 1
		var year = parts[2]
		return new Date(year, month, day)
}

function toDBFormatFi(fiDate) {
		var parts = fiDate.split(".");
		var day = parts[0]
		var month = parts[1] - 1
		var year = parts[2]
		return dateFormat(new Date(year, month, day), "yyyy-mm-dd")
}
export {toDateFi, toDBFormatFi}