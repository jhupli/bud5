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
export {addDays, addMonths, daydiff}