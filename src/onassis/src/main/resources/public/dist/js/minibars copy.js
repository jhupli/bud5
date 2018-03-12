function dateId(d) {
  console.assert(d, "d cannot be null")
  return (d.getDate()+1)+"_"+(d.getMonth()+1)+"_"+d.getFullYear()
}

function monthId(d) {
  console.assert(d, "d cannot be null")
  return (d.getMonth()+1)+"_"+d.getFullYear()
}

function columncolor(d) {
  return (d.i < 0) ? "red" : "green"
}

var start = null;
var end = null;


var DIV_PREFIX = "div_minibar_"
var BG_PREFIX = "rect_bg_minibar_"
var Y_PREFIX = "rect_y_minibar_"

var LINE_ZERO_PREFIX = "line_zero_minibar_"

function minibars_load(config) {

  //widths
  var column_width = config.column_width
  var slot_div_width = column_width + 2

  //heights
  var top_margin = config.top_margin | 4
  var barcanvas_height = config.barcanvas_height | 80
  var center_margin = config.center_margin | 2
  var range_height = config.range_height | 15
  var bottom_margin = config.bottom_margin | 3 

  //y-coords
  var top_margin_y = 0
  var barcanvas_y = top_margin
  var center_margin_y = barcanvas_y + barcanvas_height
  var range_y = center_margin_y + center_margin
  var bottom_margin_y = range_y + range_height
  var height = bottom_margin_y + bottom_margin
  console.log(top_margin_y + "|"  +barcanvas_y+"|"+center_margin_y+"|"+range_y+"|"+bottom_margin_y+"|"+height)

  //common min and max for all
  //init
  var miny = config.data[0].columns[0].i
  var maxy = config.data[0].columns[0].i

  for (var ix = 0, len = config.data.length; ix < len; ix++) {
    miny = d3.min([miny, d3.min(config.data[ix].columns,function(d) {return d.i})])
    maxy = d3.max([maxy, d3.max(config.data[ix].columns,function(d) {return d.i})])
  }
  console.log("miny:"+miny+" maxy:"+maxy)

  var scale = d3.scale.linear().domain([miny, maxy]).range([barcanvas_y, center_margin_y])

  for (var ix = 0, len = config.data.length; ix < len; ix++) {
    create(config.data[ix])
  }

  function create(data) {
    var mid = monthId(data.columns[0].d)

    var width = data.columns.length * slot_div_width

    function mouseover(d) {
      var point = d3.select('#'+BG_PREFIX+dateId(d.d))
      point.transition().attr("fill", "gray")
      point.style("cursor", "pointer")
    }

    function mouseout(d) {
      var point = d3.select('#'+BG_PREFIX+dateId(d.d))
      point.transition().attr("fill", "white")
      point.style("cursor", "default")
    }

    function click(d) {
      console.log(d.d)
      if (start == null) {
        start = d 
      } else if (end  == null) {
        end = d
        console.log("DO SOMETHIG")
      } else if(start != null) {
        start = d 
        end = null
      }
      console.log("start:" + start + " end:" + end)
      d3.select('#'+BG_PREFIX+dateId(d.d)).attr("fill", "brown")
    }

    console.assert(config.bindto, "bindto is mandatory")
    var minibar_div =
      d3.select('#'+config.bindto)
      .append("div")
      .attr("id", DIV_PREFIX + mid)
      .style({
        "width": width + "px",
        "height": height + "px",
        "float": "left",
        "background-color": "lightgray" })

    var minibar_svg = minibar_div
      .append("svg")
      .attr({ 
        "width": width,
        "height": height })

    var range_svg = minibar_svg.
      append("rect")
      .attr({
        "y": range_y,
        "width": width,
        "height" : range_height,
        "fill" : "lightblue"
      })

    var slot_column_svg = minibar_svg
      .selectAll()
      .data(data.columns)
      .enter()    
      .append("rect")
      .attr({
        "id": function(d) { 
          console.assert(d.d, "d must be defined")
          return BG_PREFIX+dateId(d.d) },
        "x" : function(d, ix) { return (ix * slot_div_width)},
        "y": barcanvas_y,
        "width": slot_div_width,
        "height": barcanvas_height,
        "fill": "white",
      })
      .on({
        "click": click,
        "mouseover": mouseover,
        "mouseout": mouseout
      })

    var slot_column_svg = minibar_svg
      .selectAll()
      .data(data.columns)
      
      slot_column_svg.enter()    
      .append("rect")
      .attr({
        "id": function(d) { return Y_PREFIX+dateId(d.d) },
        "x" : function(d, ix){ return (ix * slot_div_width) + 1},
        "y": function(d) {
          console.assert(null != d.i, "d.i is mandatory") 
          return (d.i < 0) ? center_margin_y - scale(0) + top_margin
                           : center_margin_y - scale(d.i) + top_margin
                  },
        "width": column_width,
        "height": function(d) {    
                  return  (d.i < 0) ? scale(0) - scale(d.i) : scale(d.i) - scale(0) 
                },

        "fill": columncolor,
      })
      .on({
        "click": click,
        "mouseover": mouseover,
        "mouseout": mouseout
      })

    var slot_zero_svg= minibar_svg
      .selectAll()
      .data(data.columns)
      .enter()    
      .append("line")
      .attr({
        "id": function(d) { return LINE_ZERO_PREFIX+dateId(d.d) },
        "x1" : function(d, ix){ return (ix * slot_div_width)},
        "x2" : function(d, ix) { return ((ix+1) * slot_div_width)},
        "y1": center_margin_y - scale(0) + top_margin,
        "y2": center_margin_y - scale(0) + top_margin,
        "stroke": "black",
      })
      return
  }
}

function minibars_update(config) {
   var slot_div_width = config.column_width + 2

  //heights
  var top_margin = config.top_margin | 4
  var barcanvas_height = config.barcanvas_height | 80
  var center_margin = config.center_margin | 2
  var range_height = config.range_height | 15
  var bottom_margin = config.bottom_margin | 3 

  //y-coords
  var top_margin_y = 0
  var barcanvas_y = top_margin
  var center_margin_y = barcanvas_y + barcanvas_height

  var miny = config.data[0].columns[0].i
  var maxy = config.data[0].columns[0].i

  for (var ix = 0, len = config.data.length; ix < len; ix++) {
    miny = d3.min([miny, d3.min(config.data[ix].columns,function(d) {return d.i})])
    maxy = d3.max([maxy, d3.max(config.data[ix].columns,function(d) {return d.i})])
  }
  console.log("miny:"+miny+" maxy:"+maxy)

  var scale = d3.scale.linear().domain([miny, maxy]).range([barcanvas_y, center_margin_y])

  for (var ix = 0, len = config.data.length; ix < len; ix++) {
    update(config.data[ix])
  }

  function update(data) {
    console.assert(data && data.columns, "data.colums must be defined")
    for (var ix = 0, len = data.columns.length; ix < len; ix++) {
      console.assert(data.columns[ix] && data.columns[ix].d, "d must be defined")
      date_id = dateId(data.columns[ix].d)
      d3.select('#'+Y_PREFIX+date_id)
        .transition()
        .attr({
          "y": function(d) { 
            return (data.columns[ix].i < 0) ? center_margin_y - scale(0) + top_margin
                           : center_margin_y - scale(data.columns[ix].i) + top_margin
          },
          "height": function(d) {    
            return  (data.columns[ix].i < 0) ? scale(0) - scale(data.columns[ix].i) : scale(data.columns[ix].i) - scale(0) 
          },
          "fill": function(d) {
            return columncolor(data.columns[ix])
          }
        }
      )

      d3.select('#'+LINE_ZERO_PREFIX+date_id)
        .transition()
        .attr({
          "y1": center_margin_y - scale(0) + top_margin,
          "y2": center_margin_y - scale(0) + top_margin
        })
    }  
  }
}

var minibars = function() {

  //id constants
  var DIV_PREFIX = "div_minibar_"
  var BG_PREFIX = "rect_bg_minibar_"
  var Y_PREFIX = "rect_y_minibar_"
  var LINE_ZERO_PREFIX = "line_zero_minibar_"

  //name of the element to bind to
  var bindto = null
  
  //widths
  var column_width
  var slot_div_width

  //heights
  var top_margin
  var barcanvas_height
  var center_margin
  var range_height
  var bottom_margin

  //y-coords
  var top_margin_y
  var barcanvas_y
  var center_margin_y
  var range_y
  var bottom_margin_y
  var height

  //date range selection
  var start = null;
  var end = null;

  function init(config) {

    if (!bindto) {
      console.assert(config.bindto, "bindto is mandatory")
      bindto = config.bindto
    } else {
      console.assert(!config.bindto || bindto === config.bindto, "bindto can be defined only once")
    }
  
    //widths
    column_width = config.column_width | column_width | 5
    slot_div_width = column_width + 2

    //heights
    top_margin = config.top_margin | top_margin | 4
    barcanvas_height = config.barcanvas_height | barcanvas_height | 80
    center_margin = config.center_margin | center_margin | 2
    range_height = config.range_height | range_height | 15
    bottom_margin = config.bottom_margin | bottom_margin | 3 

    //y-coords
    top_margin_y = 0
    barcanvas_y = top_margin
    center_margin_y = barcanvas_y + barcanvas_height
    range_y = center_margin_y + center_margin
    bottom_margin_y = range_y + range_height
    height = bottom_margin_y + bottom_margin
    console.log("init: "+top_margin_y + "|"  +barcanvas_y+"|"+center_margin_y+"|"+range_y+"|"+bottom_margin_y+"|"+height)
  }

  //helpers
  function dateId(d) {
    console.assert(d, "d cannot be null")
    return (d.getDate()+1)+"_"+(d.getMonth()+1)+"_"+d.getFullYear()
  }

  function monthId(d) {
    console.assert(d, "d cannot be null")
    return (d.getMonth()+1)+"_"+d.getFullYear()
  }

  function columncolor(d) {
    return (d.i < 0) ? "red" : "green"
  }

  function mouseover(d) {
    var point = d3.select('#'+BG_PREFIX+dateId(d.d))
    point.transition().attr("fill", "gray")
    point.style("cursor", "pointer")
  }

  function mouseout(d) {
    var point = d3.select('#'+BG_PREFIX+dateId(d.d))
    point.transition().attr("fill", "white")
    point.style("cursor", "default")
  }

  function click(d) {
    console.log(d.d)
    if (start == null) {
      start = d 
    } else if (end  == null) {
      end = d
      console.log("DO SOMETHIG")
    } else if(start != null) {
      start = d 
      end = null
    }
    console.log("start:" + start + " end:" + end)
    d3.select('#'+BG_PREFIX+dateId(d.d)).attr("fill", "brown")
  }

  function create(data) {
    var mid = monthId(data.columns[0].d)

    var width = data.columns.length * slot_div_width

    var minibar_div =
      d3.select('#'+bindto)
      .append("div")
      .attr("id", DIV_PREFIX + mid)
      .style({
        "width": width + "px",
        "height": height + "px",
        "float": "left",
        "background-color": "lightgray" })

    var minibar_svg = minibar_div
      .append("svg")
      .attr({ 
        "width": width,
        "height": height })

    var range_svg = minibar_svg
      .append("rect")
      .attr({
        "y": range_y,
        "width": width,
        "height" : range_height,
        "fill" : "lightblue"
      })

    var slot_column_svg = minibar_svg
      .selectAll()
      .data(data.columns)
      .enter()    
      .append("rect")
      .attr({
        "id": function(d) { 
          console.assert(d.d, "d must be defined")
          return BG_PREFIX+dateId(d.d) },
        "x" : function(d, ix) { return (ix * slot_div_width)},
        "y": barcanvas_y,
        "width": slot_div_width,
        "height": barcanvas_height,
        "fill": "white",
      })
      .on({
        "click": click,
        "mouseover": mouseover,
        "mouseout": mouseout
      })

    var slot_column_svg = minibar_svg
      .selectAll()
      .data(data.columns)
      
      slot_column_svg.enter()    
      .append("rect")
      .attr({
        "id": function(d) { return Y_PREFIX+dateId(d.d) },
        "x" : function(d, ix){ return (ix * slot_div_width) + 1},
        "y": function(d) {
          console.assert(null != d.i, "d.i is mandatory") 
          return (d.i < 0) ? center_margin_y - scale(0) + top_margin
                           : center_margin_y - scale(d.i) + top_margin
                  },
        "width": column_width,
        "height": function(d) {    
                  return  (d.i < 0) ? scale(0) - scale(d.i) : scale(d.i) - scale(0) 
                },

        "fill": columncolor,
      })
      .on({
        "click": click,
        "mouseover": mouseover,
        "mouseout": mouseout
      })

    var slot_zero_svg= minibar_svg
      .selectAll()
      .data(data.columns)
      .enter()    
      .append("line")
      .attr({
        "id": function(d) { return LINE_ZERO_PREFIX+dateId(d.d) },
        "x1" : function(d, ix){ return (ix * slot_div_width)},
        "x2" : function(d, ix) { return ((ix+1) * slot_div_width)},
        "y1": center_margin_y - scale(0) + top_margin,
        "y2": center_margin_y - scale(0) + top_margin,
        "stroke": "black",
      })
      return
  }
}
}
