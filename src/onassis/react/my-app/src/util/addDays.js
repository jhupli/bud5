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
        var t2 = d2.getTime();
        var t1 = d1.getTime();

        return parseInt((t2-t1)/(24*3600*1000));
}
export {addDays, addMonths, daydiff}