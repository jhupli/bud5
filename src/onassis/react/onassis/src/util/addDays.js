function addDays(date, days) {
  var result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function addMonths(date, months) {
	var result = new Date(date);
	result.setMonth(result.getMonth() + months);
  return result;	
}

function daydiff(d1, d2) {
	var dt1 = new Date(d1);
	var dt2 = new Date(d2);
	return Math.floor((Date.UTC(dt2.getFullYear(), dt2.getMonth(), dt2.getDate()) - Date.UTC(dt1.getFullYear(), dt1.getMonth(), dt1.getDate()) ) /(1000 * 60 * 60 * 24));
}

function isFirstAndLastOfSameMonth(d1, d2) {
	var result = 
		d1.getDate() === 1 &&
		d1.getMonth() === d2.getMonth() &&
		d1.getFullYear() === d2.getFullYear() &&
		d2.getDate() === daysInMonth(d1.getMonth(), d1.getYear())
	return result;
	
}

function daysInMonth (month, year) {// month is 0-based
    return new Date(year, month + 1, 0).getDate();
}

export {addDays, addMonths, daydiff, isFirstAndLastOfSameMonth, daysInMonth}