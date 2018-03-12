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

export {addDays, addMonths}