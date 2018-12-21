//produces array of objects containing
//months in input and dates of each month and more...

function chunk_rawdata(daydata) {
  // (I) loop daydata (must be ascending by date and date is unique) (var i)
  //  - (II) for each dates (var data_i) construct array of dates for that month - if needed. (var dayArray)
  //  - (III) update the corresponding array index data (var data_i) to data of that date (var dayArray)
  //  - (IV) add to each day balances of previous and next days
  //  - (V) add empty month to the beginning and end
	
	
  // if account == -1, we must calculate balances ourselves (i.e denotes that category filter is on)
  var balances_given = (daydata[0].a !== -1);
	
  //trivial checks

  var r = []; //return value
  if (!daydata || !daydata.length) {
    return r
  }

  //convert date-strings to date
  if (typeof daydata[0].d  === "string") {
	  for (var idaydata = 0, lendaydata = daydata.length; idaydata < lendaydata; idaydata++) {
		  daydata[idaydata].d = new Date(daydata[idaydata].d)
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
  var b = 0
  var smallestb = 0
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
    while (m !== m_i || y !== y_i) {
      //(II)
      //a new month encountered: construct empty array for that month and the months before
      m++
      if (m === 12) {
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
            "b": b,
            "smallestb": smallestb
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
    
    console.assert(null != data_i.b, "b is mandatory")
    console.assert(null != data_i.smallestb, "smallestb is mandatory")
    console.assert(null != data_i.i, "i is mandatory")
    console.assert(data_i.i >= 0, "i must be positive")
    console.assert(null != data_i.e, "e is mandatory")
    console.assert(data_i.e <= 0, "i must be negative")
    
    //calculate balance
    if( !balances_given ) {
    	b = Math.round((b + data_i.i + data_i.e) * 100) / 100
    	smallestb = b
    } else {
    	b =  data_i.b
    	smallestb = data_i.smallestb
    }
    
    //fill up the array from this date  till end of month with balance
    for(var z2 = data_i.d.getDate(), zlen2 = dayArray.length; z2 < zlen2; z2++) {
       dayArray[z2].b = b
       dayArray[z2].smallestb = smallestb
    }
    //update i, e and balance in array
    dayArray[data_i.d.getDate()-1].i = data_i.i
    dayArray[data_i.d.getDate()-1].e = data_i.e
    dayArray[data_i.d.getDate()-1].b = b 
    dayArray[data_i.d.getDate()-1].smallestb = smallestb
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
  
  //  - (V) add empty month to the beginning and end
 dayArray = []
 var prevm = new Date(r[0].columns[0].d)
 prevm.setMonth(prevm.getMonth()-1);
 m = prevm.getMonth()
 y = prevm.getFullYear()
 for(var z1=1, zlen1 = monthDays(m, y); z1 <= zlen1; z1++) {
        dayArray.push(
          { 
            "i": 0,
            "e": 0,
            "d": new Date(y, m, z1),
            "b": 0,
            "smallestb": 0
          }
        )
  }
  r.unshift({
    "columns": dayArray,
    "range_text": (m + 1) + "/" + y
  })

 dayArray = []
 var last = r[r.length-1].columns[r[r.length-1].columns.length-1]
 last.next_b = last.b
 var nextm = new Date(last.d)
 nextm.setDate(1)
 nextm.setMonth(nextm.getMonth() + 1);

 m = nextm.getMonth()
 y = nextm.getFullYear()
 for(var z2=1, zlen2 = monthDays(m, y); z2 <= zlen2; z2++) {
	 
        dayArray.push(
          { 
            "i": 0,
            "e": 0,
            "d": new Date(y, m, z2),
            "b": last.b,
            "smallestb": last.smallestb,
            "prev_b": last.b,
            "next_b": last.b          
          }
        )
  }
 dayArray[dayArray.length -1].next_b = null
  r.push({
    "columns": dayArray,
    "range_text": (m + 1) + "/" + y
  })

  return r;
}

export {chunk_rawdata}
