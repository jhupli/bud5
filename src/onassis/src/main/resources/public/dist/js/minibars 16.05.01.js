var minibars = (function() {
  //date:
  var FORMAT_DATE = "ddd d.m.yy"
  var FORMAT_MONTH = "mmm"
  //colors:
  var COLOR_INCOME_NEGATIV = "red"
  var COLOR_INCOME_POSITIV = "green"
  var COLOR_BALANCE = "blue"

  var COLOR_DAY_BACKGROUND_NORMAL = "white"
  var COLOR_DAY_BACKGROUND_SELECTED = "gray"
  var COLOR_DAY_BACKGROUND_FOCUS = "cadetblue"

  var COLOR_MONTH_BACKGROUND_NORMAL_ODD = "lightblue"
  var COLOR_MONTH_BACKGROUND_NORMAL_EVEN = "lightblue"
  var COLOR_MONTH_TEXT = "black"

  var COLOR_MONTH_SEPARATOR_LINE = "lightblue"

  //name of the element to bind to
  var bindto = null
  
  //widths
  var div_border_width
  var column_width
  var slot_width
  var line_width

  //leadin = rowstart in which the min and max are shown
  var leadin_width

  var col_per_slot_ratio = 0.8

  //x-coords
  var leadin_x

  //heights
  var top_margin
  var datearea_height
  var center_margin
  var month_height
  var bottom_margin

  //y-coords
  var top_margin_y
  var datearea_y
  var center_margin_y
  var month_y
  var bottom_margin_y
  var height

  //min/max -months shown
  var month_markers

  var miny, maxy
  var miny_text, maxy_text, minmax_width
  var scale

  //date range selection
  var start = null;
  var end = null;

  //callback
  var cb_select = null;
  var max_selection_days

  //default values
  function init(config) {
    if (!bindto) {
      console.assert(config.bindto, "bindto is mandatory")
      bindto = config.bindto
    } else {
      console.assert(!config.bindto || bindto === config.bindto, "bindto can be defined only once")
    }
  
    //widths
    div_border_width = config.div_border_width ||div_border_width || 0
    leadin_width =  config.leadin_width || leadin_width || 45
    line_width = config.line_width || line_width || 1

    //heights
    top_margin = config.top_margin || top_margin || 10
    datearea_height = config.datearea_height || datearea_height || 80
    center_margin = config.center_margin || center_margin || 0 
    month_height = config.month_height || month_height || 20
    bottom_margin = config.bottom_margin || bottom_margin || 3 

    //y-coords
    top_margin_y = 0
    datearea_y = top_margin

    center_margin_y = datearea_y + datearea_height
    month_y = center_margin_y + center_margin
    bottom_margin_y = month_y + month_height
    height = bottom_margin_y + bottom_margin

    //callbacks
    cb_select = config.select
    max_selection_days =  config.max_selection_days || 90

    init_changeables(config)
  }

  //id constants
  var _DIV = "_div_minibar"
  var _TIP_DIV = "_tip_div_minibar"
  var _TIP_I_DIV = "_tip_i_div_minibar"
  var _DAY_TEXT = "_day_text"
  var _B_TEXT = "_b_text"
  var _B_COLOR = "_b_color"
  var _I_TEXT = "_i_text"
  var _LEADIN = "_leadin_minibar"
  var _LEADIN_ZERO = "_zero_leadin_minibar"
  var _LEADIN_ZERO_TEXT = "_zero_leadin_text_minibar"
  var _MAX_TEXT = "_max_text_minibar"
  var _MIN_TEXT = "_min_text_minibar"
  var _MONTH = "_month_minibar"
  var _BG = "_slot_bg_minibar"
  var _I = "_i_minibar"
  var _B = "_b_minibar"
  var _LINE_B_PREV = "_b_prev_minibar"
  var _LINE_B_NEXT = "_b_next_minibar"
  var _LINE_ZERO = "_zero_minibar"

  
  //init min and max for all
  function init_scales(config) {
  
    miny = d3.min([0,config.months[0].columns[0].b])
    maxy = d3.max([0,config.months[0].columns[0].b])

    for (var ix = 0, len = config.months.length; ix < len; ix++) {
      miny = d3.min([miny, d3.min(config.months[ix].columns,function(d) {
        console.assert((null != d.i) && (null != d.b) && d.d , "i, b and d must be defined")
        return d3.min([Math.abs(d.i), d.b]) 
      })])
      maxy = d3.max([maxy, d3.max(config.months[ix].columns,function(d) {
        return d3.max([Math.abs(d.i), d.b]) 
      })])
    }
    scale = d3.scale.linear().domain([miny, maxy]).range([datearea_y + line_width, center_margin_y])

    miny_text = roundNumberText(miny)
    maxy_text  = roundNumberText(maxy)
  }

//properties that may change dynamically in addition to basic data (ie. by update)
function init_changeables(config) {
  //widths
  slot_width = config.slot_width || slot_width || 12
  column_width = slot_width * col_per_slot_ratio

  //min/max -months shown (used to decide wheter to create or update)
  month_markers = monthMarkers(config)
}

//helpers
function dateId(day) {
  return "_" + day.getDate() + "_" + (day.getMonth()+1) + "_" + day.getFullYear()
}

function monthId(day) {
  return "_" + (day.getMonth() + 1) + "_" + day.getFullYear()
}

function bgColor(data) {
  if (start && !end && !dates.compare(data.d, start)) {
    return COLOR_DAY_BACKGROUND_FOCUS
  }
  if (withinSelection(data)) {
    return COLOR_DAY_BACKGROUND_SELECTED
  }
  return COLOR_DAY_BACKGROUND_NORMAL
}

function iColor(data) {
  return (data.i < 0) ? COLOR_INCOME_NEGATIV : COLOR_INCOME_POSITIV
}

function monthColor(day) {
  return day.getMonth() % 2 ? COLOR_MONTH_BACKGROUND_NORMAL_EVEN : COLOR_MONTH_BACKGROUND_NORMAL_ODD
}

function mouseover_month(day) {
  var point = d3.select('#' + monthId(day) + _MONTH)
  point.attr("fill", COLOR_DAY_BACKGROUND_FOCUS)
}

function mouseout_month(day) {
  var point = d3.select('#' + monthId(day) + _MONTH)
  point.attr("fill", monthColor(day))
}

function click_month(s_date, e_date) {
  if (start) {
    var point = d3.select('#'+dateId(start) + _BG)
    point.attr("fill", COLOR_DAY_BACKGROUND_NORMAL)
  }
  start = s_date
  end = e_date
  normalize_selection()
}

function getmonthtext(date) {
  return dateFormat(date, FORMAT_MONTH)
}

function monthMarkers(config) {
  //min/max -months
  console.assert(config.months[0].columns[0].d, "d must be defined")
  console.assert(config.months[config.months.length-1].columns[0].d, "d must be defined")

  left_month = monthId(config.months[0].columns[0].d)
  right_month = monthId(config.months[config.months.length-1].columns[0].d)

  return left_month+"-"+right_month
}

function roundNumber(number) {
  return Math.round(number).toPrecision(3)
}

function roundNumberText(number) {
  var num = roundNumber(number)
  var prefix = d3.formatPrefix(num);
  return  "" + prefix.scale(num) + (prefix.symbol ===  "y" ? "" : prefix.symbol)
}

function withinSelection(d) {
  return (start && end && d.d && dates.inRange(d.d, start, end))
}

function colorRange(s_date, e_date, color) {
  if (!s_date || !e_date || !color) return
  var ixd = new Date(s_date)
  do {
    d3.select('#'+dateId(ixd)+_BG).attr("fill", color)
    ixd.setDate(ixd.getDate() + 1);
  } while(dates.compare(ixd, e_date) < 1)
}

function show_tip(data) {
  var mid = monthId(data.d)
  var bg = document.getElementById(dateId(data.d) + _BG).getBoundingClientRect()
  var offsetRect = document.getElementsByClassName("col-md-12")[0].getBoundingClientRect()

  d3.select('#' + mid + _TIP_I_DIV).style("display", data.i == 0 ? "none" : "table-row")
  d3.select('#' + mid + _TIP_DIV).
  style(
    {"display": "inline",
      "left" : (bg.left - offsetRect.left + slot_width) + "px",
      "top" : (bg.top - offsetRect.top) + (0.75 * datearea_height) + "px",
      "position" : "absolute"
    })
  d3.select("#" + mid +_DAY_TEXT).text(dateFormat(data.d,FORMAT_DATE))
  d3.select("#" + mid +_B_TEXT).text(data.b.toFixed(2))
  d3.select("#" + mid +_B_COLOR).style("background-color", iColor(data))
  d3.select("#" + mid +_I_TEXT).text(data.i.toFixed(2))
}

function hide_tip(data) {
  d3.select('#'+monthId(data.d) +_TIP_DIV).style("display", "none")
}

function select(start_, end_) {
  console.assert(null != start_ && null != end_) 
  start = start_
  end = end_
  normalize_selection()
}

function mouseover(data, i) {
  //console.log("mouseover")
  show_tip(data, i)
  var point = d3.select('#' + dateId(data.d) +_BG)
  point.attr("fill", COLOR_DAY_BACKGROUND_FOCUS)
  if (start && !end && Math.abs(dateDiffInDays(start, data.d)) > max_selection_days) {
    cursor("not-allowed")
  } else if (start && !end) {
    cursor("col-resize")
  } else {
    cursor("pointer")
  }
}

function mouseout(data) {
  //console.log("mouseout")
  hide_tip(data)
  var point = d3.select('#' + dateId(data.d) +_BG)
  point.attr("fill", bgColor(data))
  //cursor(data, "default")
}

var _MS_PER_DAY = 1000 * 60 * 60 * 24;

// a and b are javascript Date objects
function dateDiffInDays(a, b) {
  // Discard the time and time-zone information.
  var utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
  var utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

  return Math.floor((utc2 - utc1) / _MS_PER_DAY);
}

var prev_start = null
var prev_end = null
function normalize_selection() {
  var _s = d3.min([start, end])
  var _e = d3.max([start, end])
  start = _s
  end = _e
  colorRange(prev_start, prev_end, COLOR_DAY_BACKGROUND_NORMAL)
  prev_start = start
  prev_end = end

  colorRange(start, end, COLOR_DAY_BACKGROUND_SELECTED)

  //call back
  if (cb_select) {
    cb_select(start, end)
  }
}

function cursor(cursor) {
  console.log("cursor: " + cursor)
  document.body.style.cursor = cursor
}

function click(data) {
  if (start == null || (start && end)) {
    start = data.d
    end = null
     cursor("col-resize")
    colorRange(prev_start, prev_end, COLOR_DAY_BACKGROUND_NORMAL)
  } else if (end  == null) {
    if (start && Math.abs(dateDiffInDays(start, data.d)) > max_selection_days) {
      return;
    }
    end = data.d
    cursor("pointer")
    normalize_selection()
  } 
  //console.log("s:" + start + " e:" + end)
  show_tip(data)
  d3.select('#' + dateId(data.d) + _BG).attr("fill", COLOR_DAY_BACKGROUND_FOCUS)
}

var clicks = 
  {
      "click": click,
      "mouseover": mouseover,
      "mouseout": mouseout
  }

function create(month) {
  var mid = monthId(month.columns[0].d)
  var width = month.columns.length * slot_width + line_width
  var bindTo = d3.select('#' + bindto)
  //console.log("div_width:" + (width + (2 * line_width)) + "px");

  var minibar_div =
    bindTo
    .append("div")
    .attr("id", mid +_DIV)
    .style({
      "width": width  + "px",
      "height": height + "px",
      "float": "left",
      "background-color": "white",
      "border-style": "solid",       
      "border-width": div_border_width + "px",
      "border-color": "magenta",
      "margin-top": "5px" })
    
  var tip_div =
  bindTo
  .append("div")
  .attr("id", mid +_TIP_DIV)
  .style({
      "display": "none",
      "position": "absolute",
      "pointer-events": "none",
      "top": "0px",
      "left": "0px"})
  .append("table")
  .attr("class","c3-tooltip")

  var tbody =
  tip_div
  .append("tbody")

  tbody.append("tr").append("th").attr(
    { "id": mid +_DAY_TEXT,
      "colspan":"2"}).text("CCC")

  var tr2 = tbody.append("tr").attr("class","c3-tooltip-name--data2")
  tr2.append("td").attr("class","name").append("span").style("background-color", COLOR_BALANCE)
  tr2.append("td").attr("class","value").attr("id", mid +_B_TEXT).text("")

  var tr1 = tbody.append("tr").attr("id", mid +_TIP_I_DIV).attr("class","c3-tooltip-name--data1")
  tr1.append("td").attr("class","name").append("span").attr("id", mid +_B_COLOR).style("background-color", "white")
  tr1.append("td").attr("class","value").attr("id", mid +_I_TEXT).text("")

  var minibar_leadin_svg = minibar_div
    .append("svg")
    .style("shape-rendering","crispEdges")
    .attr({
      "id": mid + _LEADIN,
      "width": "0px",
      "height": height })

  minibar_leadin_svg
    .append("line")
    .attr({
    "x1" : leadin_width - (0.5 * line_width),
    "x2" : leadin_width - (0.5 * line_width),
    "y1": datearea_y,
    "y2": bottom_margin_y,
    "stroke": COLOR_MONTH_SEPARATOR_LINE,
    "stroke-width": line_width
    }) 

  minibar_leadin_svg
  .append("line")
  .attr({
    "id": mid + _LEADIN_ZERO,
    "x1" : leadin_width - 7,
    "x2" : leadin_width,
    "y1": center_margin_y - scale(0) + top_margin + line_width,
    "y2": center_margin_y - scale(0) + top_margin + line_width,
    "stroke": "black",
    "stroke-width": line_width
  })

  minibar_leadin_svg
  .append("text")
        .text(maxy_text)
        .attr({
          "id": mid + _MAX_TEXT,
          "x": leadin_width - 10,
          "y": datearea_y + 12,
          "text-anchor": "end",
          "font-family": "sans-serif",
          "font-size": "12px",
          "fill": "black"
        })

  minibar_leadin_svg
  .append("text")
        .text(miny_text)
        .attr({
          "id": mid + _MIN_TEXT,
          "x": leadin_width - 10,
          "y": center_margin_y  ,
          "text-anchor": "end",
          "font-family": "sans-serif",
          "font-size": "12px",
          "fill": "black"
        })

  var minibar_svg = minibar_div
    .append("svg")
    .style({
        "shape-rendering": "crispEdges",
        "cursor": "inherit"
    })
    .attr({ 
      "width": width,
      "height": height,
      "fill" : "red" })
    .on({
      "mouseout" : function() {cursor("default")}
    })

  
  minibar_svg
    .append("rect")
    .attr({
      "id": mid + _MONTH,
      "y": month_y,
      "x": 0,
      "width": width - line_width,
      "height" : month_height,
      "fill" : monthColor(month.columns[0].d)
    }).on({
        "click": function() {click_month(month.columns[0].d, month.columns[month.columns.length - 1].d)},
        "mouseover": function() {mouseover_month(month.columns[0].d)},
        "mouseout": function() {mouseout_month(month.columns[0].d)}
    })

  minibar_svg
  .append("text")
        .text(getmonthtext(month.columns[0].d))
        .attr({
          "x": 3,
          "y": month_y + 15,
          "text-anchor": "start",
          "font-family": "sans-serif",
          "font-size": "12px",
          "fill": COLOR_MONTH_TEXT
        }).style("cursor", "pointer")
        .on({
        "click": function() {click_month(month.columns[0].d, month.columns[month.columns.length - 1].d)},
        "mouseover": function() {mouseover_month(month.columns[0].d)},
        "mouseout": function() {mouseout_month(month.columns[0].d)}
    })

    minibar_svg
    .selectAll()
    .data(month.columns)
    .enter()    
    .append("rect")
    .attr({
      "id": function(d) { 
        console.assert(d.d, "d must be defined")
        return dateId(d.d) + _BG },
      "x" : function(d, ix) {
        //console.log("x:"+ (ix * slot_width))
        return (ix * slot_width)},
      "y": datearea_y,
      "width": slot_width,
      "height": datearea_height,
      "fill": function(d) {return bgColor(d)}
    })/*.style("cursor", "pointer") */
    .on(clicks)

    minibar_svg
    .selectAll()
    .data(month.columns)
    .enter()    
    .append("rect")
    .attr({
      "id": function(d) { return dateId(d.d) + _I },
      "x" : function(d, ix){ return ((ix + (1 - col_per_slot_ratio) / 2) * slot_width)},
      "y": function(d) { return  center_margin_y - scale(Math.abs(d.i)) + top_margin + line_width },
      "width": column_width,
      "height": function(d) { return scale(Math.abs(d.i)) - scale(0) },
      "fill": iColor
    })//.style("cursor", "pointer")
    .on(clicks)

   minibar_svg
    .selectAll()
    .data(month.columns)
    .enter()    
    .append("line")
    .attr({
      "id": function(d) { return dateId(d.d) + _LINE_ZERO },
      "x1" : function(d, ix){ return (ix * slot_width) - 7},
      "x2" : function(d, ix) { return ((ix+1) * slot_width)},
      "y1": center_margin_y - scale(0) + top_margin + line_width,
      "y2": center_margin_y - scale(0) + top_margin + line_width,
      "stroke": "black",
      "stroke-width": line_width
    })/*.style("cursor", "pointer")*/
    .on(clicks)

   minibar_svg
    .selectAll()
    .data(month.columns)
    .enter()    
    .append("line")
    .attr({
      "id": function(d){ return dateId(d.d) + _LINE_B_PREV},
      "x1" : function(d, ix){ return (ix-(null != d.prev_b ? 0.5 : -0.5)) * slot_width},
      "x2" : function(d, ix){ return (ix+0.5) * slot_width},
      "y1": function(d){
        return center_margin_y - scale(null != d.prev_b ? d.prev_b : d.b) + top_margin + line_width},
      "y2": function(d, ix) {
        return center_margin_y - scale(d.b) + top_margin + line_width},
      "stroke": COLOR_BALANCE,
      "stroke-width": line_width
    })/*.style("cursor", "pointer") */
    .on(clicks)
    

    minibar_svg
    .selectAll()
    .data(month.columns)
    .enter()    
    .append("line")
    .attr({
      "id": function(d){ return dateId(d.d) + _LINE_B_NEXT},
      "x1" : function(d, ix){ return (ix+0.5) * slot_width },
      "x2" : function(d, ix){ return (ix+(null != d.next_b ? 1.5 : 0.5)) * slot_width},
      "y1": function(d) {
        return center_margin_y - scale(d.b) + top_margin + line_width},
      "y2": function(d, ix){
        return center_margin_y - scale(null != d.next_b ? d.next_b : d.b) + top_margin + line_width},
      "stroke": COLOR_BALANCE,
      "stroke-width": line_width
    })/*.style("cursor", "pointer") */
    .on(clicks)

    if (slot_width > 5) {
      minibar_svg
      .selectAll()
      .data(month.columns)
      .enter()    
      .append("circle")
      .style("shape-rendering","auto")
      .attr({
        "id": function(d) { return dateId(d.d) + _B},
        "cx" : function(d, ix){ return ((ix + 0.5) * slot_width)},
        "cy": function(d) { return center_margin_y - scale(d.b) + top_margin + line_width },
        "r": 1.5, //slot_width / 6,
        "fill": COLOR_BALANCE,
      })/*.style("cursor", "pointer") */
      .on(clicks)
    }

    minibar_svg
    .append("line")
    .attr({
      "x1" : -2,
      "x2" : width + 2,
      "y1" : datearea_y + (0.5*line_width),
      "y2" : datearea_y + (0.5*line_width),
      "stroke": COLOR_MONTH_SEPARATOR_LINE,
      "stroke-width": line_width
    })

    minibar_svg
    .append("line")
    .attr({
      x1 : width - (0.5 * line_width),
      x2 : width - (0.5 * line_width),
      "y1" : datearea_y,
      "y2" : bottom_margin_y,
      "stroke": COLOR_MONTH_SEPARATOR_LINE,
      "stroke-width": line_width
    })

} //create(config)

function leadin(month) {
  var mid = monthId(month.columns[0].d)
  var e = document.getElementById(mid +_DIV)
  var x = e.getBoundingClientRect().left

  var width = month.columns.length * slot_width +  line_width
  if( !leadin_x ) { //init lead_in x
    leadin_x = x
  }

  d3.select('#' + mid +_DIV)
  .style({
    "width": width + (leadin_x === x ? leadin_width : 0) + "px"
  })

  d3.select('#' + mid + _LEADIN)
  .attr({
    "width": (leadin_x === x ? leadin_width : 0) + "px",
  })

  d3.select('#' + mid + _MAX_TEXT)
  .text(roundNumberText(maxy))

  d3.select('#' + mid + _MIN_TEXT)
  .text(roundNumberText(miny)) 
}

function update(month) {
  //console.log("update")
  var mid = monthId(month.columns[0].d)
  d3.select('#' + mid + _LEADIN_ZERO)
    .transition()
    .attr({
      "y1": center_margin_y - scale(0) + top_margin + line_width,
      "y2": center_margin_y - scale(0) + top_margin + line_width
    })
  d3.select('#' + mid + _LEADIN_ZERO_TEXT)
    .transition()
    .attr({
      "y": center_margin_y - scale(0) + 3 + top_margin + line_width,
    })

  for (var ix = 0, len = month.columns.length; ix < len; ix++) {
    date_id = dateId(month.columns[ix].d)

    d3.select('#' + date_id + _I)
      .datum(function(d) {
        d.i =  month.columns[ix].i
        d.b =  month.columns[ix].b
        d.prev_b =  month.columns[ix].prev_b
        d.next_b =  month.columns[ix].next_b
        return d
      })
      .transition()
      .attr({
        "y": function(d) {
          return center_margin_y - scale(Math.abs(d.i)) + top_margin + line_width
        },
        "height": function(d) {    
          return  scale(Math.abs(d.i)) - scale(0)  
        },
        "fill": function(d) {
          return iColor(d)
        }
      }
    )

    d3.select('#' + date_id + _B)
      .transition()
      .attr({
        "cy": function(d) { 
          return center_margin_y - scale(d.b) + top_margin + line_width
        }  
      })

    d3.select('#' + date_id + _LINE_ZERO)
      .transition()
      .attr({
        "y1": center_margin_y - scale(0) + top_margin + line_width,
        "y2": center_margin_y - scale(0) + top_margin + line_width
      })


    d3.select('#' + date_id + _LINE_B_PREV)
      .transition()
      .attr({
        "y1": function(d) {
          return center_margin_y - scale(null != d.prev_b ? d.prev_b : d.b) + top_margin + line_width
        },
        "y2": function(d) {
          return center_margin_y - scale(d.b) + top_margin + line_width
        }
      })

    d3.select('#' + date_id +  _LINE_B_NEXT)
      .transition()
      .attr({
        "y1": function(d) {
          return center_margin_y - scale(d.b) + top_margin + line_width
        },
        "y2": function(d) {
          return center_margin_y - scale(null != d.next_b ? d.next_b : d.b) + top_margin + line_width
        }
      })
  }
} //update(month)

var prev_config = null
function load(new_config) {
  if (!new_config && !prev_config) {
    return
  }

  var config = new_config || prev_config
  prev_config = config

  console.assert(null != config.months[0].columns[0].i, "no month given")

  var bindTo = d3.select('#'+bindto)
  var offsetRect = document.getElementsByClassName("col-md-12")[0].getBoundingClientRect()
  var new_slot_width = Math.round(offsetRect.width / (config.months.length*37))
  new_slot_width = d3.max([new_slot_width, 1.3])
  var doit //create or update
  if (!bindto) {
    slot_width = new_slot_width
    doit = create
    init(config)
  } else if (month_markers != monthMarkers(config) || (slot_width != new_slot_width)) {
    slot_width = new_slot_width
    doit = create
    init_changeables(config)
    d3.select('#'+bindto).selectAll("div").remove()
  } else {
    doit = update
  }

  init_scales(config)

  leadin_x = null
  for (var ix = 0, len = config.months.length; ix < len; ix++) {
    doit(config.months[ix])
    leadin(config.months[ix])
  }
}

return {
    "load" : load,
    "select" : select
}
}) ()

window.addEventListener("resize", function(e) {
  minibars.load()
});



