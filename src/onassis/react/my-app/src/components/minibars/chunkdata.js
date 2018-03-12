import {dateDiffInDays} from './helpers'

//produces array of objects containing
//months in input and dates of each month and more...

function chunk_rawdata(daydata, balance) {
  // (I) loop daydata (must be ascending by date and date is unique) (var i)
  //  - (II) for each dates (var data_i) construct array of dates for that month - if needed. (var dayArray)
  //  - (III) update the corresponding array index data (var data_i) to data of that date (var dayArray)
  
  //trivial checks
  console.assert(null != balance, "balance is mandatory")
  var r = []; //return value
  if (!daydata || !daydata.length) {
    return r
  }

  //convert date-strings to date
  if (typeof daydata[0].d  === "string") {
	  for (var i = 0, len = daydata.length; i < len; i++) {
		  daydata[i].d = new Date(daydata[i].d)
	  }
  }

  //returns the # of days of month (m is 0-based)
  function monthDays(m , y){
    return (new Date(y, m + 1, 0)).getDate();
  }

  //init the main loop vars
  console.assert(daydata[0].d, "d is mandatory")
  var m = daydata[0].d.getMonth() - 1
  var y = daydata[0].d.getFullYear()
  var d = daydata[0].d.getDate() - 1
  var b = Math.round(balance * 100) / 100
  var dayArray = null

  //main loop (I)
  for (var i = 0, len = daydata.length; i < len; i++) {
    var data_i = daydata[i]
    console.assert(data_i.d, "d is mandatory")
    var m_i = data_i.d.getMonth()
    var y_i = data_i.d.getFullYear()
    var d_i = data_i.d.getDate()
    
    console.assert(
      m_i >= 0 
      && m_i < 12 
      && d_i >0 
      && d_i <= 31 
      && (y * (12 * 31) + m * 31 + d) < (y_i * (12 * 31) + m_i * 31 + d_i),
     "input array must be ascending")
    d = d_i
    while (m != m_i || y != y_i) {
      //a new month encountered: construct empty array for that month and the months before (II)
      m++
      if (m == 12) {
        y++
        m=0
      }
      //array constructor
      dayArray = []
      for(var z=1, zlen = monthDays(m,y); z <= zlen; z++) {
        dayArray.push(
          { 
            "i": 0,
            "e": 0,
            "d": new Date(y, m, z),
            "b": b
          }
        )
      }

      r.push({
        "columns": dayArray,
        "range_text": (m + 1) + "/" + y
      })
    }

    // (III)  
    //balances
    //balances prior to day are set in array constructor
    console.assert(null != data_i.i, "i is mandatory")
    console.assert(data_i.i >= 0, "i must be positive")
    console.assert(null != data_i.e, "e is mandatory")
    console.assert(data_i.e <= 0, "i must be negative")
    b = Math.round((b + data_i.i + data_i.e) * 100) / 100

    //update up balances of the rest of the month 
      for(var z = data_i.d.getDate(), zlen = dayArray.length; z < zlen; z++) {
        dayArray[z].b = b
      }
    //update i, e and balance in array
    dayArray[data_i.d.getDate()-1].i = data_i.i
    dayArray[data_i.d.getDate()-1].e = data_i.e
    dayArray[data_i.d.getDate()-1].b = b
  }
  //(IV) add to each day balances of previous and next days
  for(var ax = 0, axlen = r.length; ax < axlen; ax++) {
    for( var ix = 0, ixlen = r[ax].columns.length; ix < ixlen; ix++) {
      var data = r[ax].columns[ix]
      if (!ax && !ix) {
        data.prev_b = null;
      } else if((ax + 1) === axlen && (ix + 1) === ixlen) {
        data.next_b = null;
      } else if(!ix) {
        data.prev_b = r[ax - 1].columns[r[ax - 1].columns.length - 1].b
      } else if((ix + 1) === ixlen) {
        data.next_b = r[ax + 1].columns[0].b
      } 
      if (typeof data.prev_b === "undefined") {
        data.prev_b = r[ax].columns[ix - 1].b
      }
      if (typeof data.next_b === "undefined") {
        data.next_b = r[ax].columns[ix + 1].b       
      }
    }
  }


  return r;
}

function chunk_balancedata(startday, endday, balances, fill) {
  //trivial checks
  console.assert(null != startday, "startday is mandatory")
  console.assert(null != endday, "endday is mandatory")

  var r = Array.apply(null, Array(dateDiffInDays(startday, endday) + 1)).map(Number.prototype.valueOf,0);
  if (!balances || !balances.length) {
    return r
  }
  if (fill) {
    console.assert(dateDiffInDays(startday, balances[0].d) == 0, "balances must start with startday")
  }
  var prev_b = balances[0].b;
  var prev_d = null;

  for (var ix = 0, len = balances.length; ix < len; ix++) { 
    var b = balances[ix]
    console.assert(b.b, "balance is mandatory")
    console.assert(b.d, "date is mandatory")
    if (prev_d && fill) {
      console.assert(dateDiffInDays(prev_d, b.d) > 0, "dates must be unique and ascending")
      while( dateDiffInDays(prev_d, b.d) != 0) {
        r[dateDiffInDays(startday, prev_d)] = prev_b
        prev_d.setDate(prev_d.getDate() + 1);
      }
    }
    prev_d = b.d;
    prev_b = b.b
    r[dateDiffInDays(startday, b.d)] = b.b
  }
  while(dateDiffInDays(prev_d, endday) != -1 && fill) {
        r[dateDiffInDays(startday, prev_d)] = prev_b
        prev_d.setDate(prev_d.getDate() + 1);
  }
  return r;
}
export {chunk_rawdata}
//module.exports = chunk_rawdata;