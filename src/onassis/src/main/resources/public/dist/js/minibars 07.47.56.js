var minibars = (function() {

  //id constants
  var _DIV = "_div_minibar";
  var _TIP_DIV = "_tip_div_minibar";
  var _DAY_TEXT = "_day_text"
  var _B_TEXT = "_b_text"
  var _B_COLOR = "_b_color"
  var _I_TEXT = "_i_text"
  var _LEADIN = "_leadin_minibar";
  var _LEADIN_ZERO = "_zero_leadin_minibar"
  var _LEADIN_ZERO_TEXT = "_zero_leadin_text_minibar"
  var _MAX_TEXT = "_max_text_minibar"
  var _MIN_TEXT = "_min_text_minibar"
  var _RANGE = "_range_minibar";
  var _BG = "_slot_bg_minibar"
  var _I = "_i_minibar"
  var _B = "_b_minibar"
  var _LINE_B_PREV = "_b_prev_minibar"
  var _LINE_B_NEXT = "_b_next_minibar"
  var _LINE_ZERO = "_zero_minibar"

  //name of the element to bind to
  var bindto = null
  
  //widths
  var div_border_width
  var column_width
  var slot_width

  var leadin_width

  var col_per_slot_ratio = 0.8

  //x-coords
  var leadin_x

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

  //min/max -months shown
  var month_markers

  var miny, maxy
  var miny_text, maxy_text, minmax_width
  var scale

  //date range selection
  var start = null;
  var end = null;

  function init_scales(config) {
    //common min and max for all
    //init

    miny = d3.min([0,config.data[0].columns[0].b])
    maxy = d3.max([0,config.data[0].columns[0].b])

    for (var ix = 0, len = config.data.length; ix < len; ix++) {
      miny = d3.min([miny, d3.min(config.data[ix].columns,function(d) {
        console.assert((null != d.i) && (null != d.b) && d.d , "i, b and d must be defined")
        return d3.min([Math.abs(d.i), d.b]) 
      })])
      maxy = d3.max([maxy, d3.max(config.data[ix].columns,function(d) {
        return d3.max([Math.abs(d.i), d.b]) 
      })])
    }
    console.log("miny:"+miny+" maxy:"+maxy)

    scale = d3.scale.linear().domain([miny, maxy]).range([barcanvas_y, center_margin_y])

    miny_text = roundNumberText(miny)
    maxy_text  = roundNumberText(maxy)
  }


  function init_changeables(config) {
    //properties that may change dynamically in addition to basic data (ie. by update)
    //widths
    slot_width = config.slot_width || slot_width || 12
    column_width = slot_width * col_per_slot_ratio
    line_width = 1  //slot_width / 10

    //min/max -months shown (used to decide wheter to create or update)
    month_markers = monthMarkers(config)
  }

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

    //heights
    top_margin = config.top_margin || top_margin || 10
    barcanvas_height = config.barcanvas_height || barcanvas_height || 80
    center_margin = config.center_margin || center_margin || 2
    range_height = config.range_height || range_height || 15
    bottom_margin = config.bottom_margin || bottom_margin || 3 

    //y-coords
    top_margin_y = 0
    barcanvas_y = top_margin
    center_margin_y = barcanvas_y + barcanvas_height
    range_y = center_margin_y + center_margin
    bottom_margin_y = range_y + range_height
    height = bottom_margin_y + bottom_margin
  
    init_changeables(config)
  }

  //helpers
  function dateId(day) {
    return "_" + day.getDate() + "_" + (day.getMonth()+1) + "_" + day.getFullYear()
  }
  
  function monthId(day) {
    return "_" + (day.getMonth() + 1) + "_" + day.getFullYear()
  }

  function bgcolor(data) {
    if (start && !end && !dates.compare(data.d, start)) {
      return "brown"
    }
    if (withinrange(data)) {
      return "gray"
    }
      return "white" //bg normal color
  }

  function columncolor(data) {
    return (data.i < 0) ? "red" : "green"
  }

  function mouseover(data) {
    var point = d3.select('#' + dateId(data.d) +_BG)
    point.attr("fill", "red")
    point.style("cursor", "pointer")
  }

  function mouseout(data) {
    d3.select('#'+monthId(data.d) +_TIP_DIV).style("display", "none")
    var point = d3.select('#' + dateId(data.d) +_BG)
    point.attr("fill", bgcolor(data))
    point.style("cursor", "default")
  }

  function mouseover_month(day) {
    var point = d3.select('#' + monthId(day) + _RANGE)
    point.attr("fill", "red")
    point.style("cursor", "pointer")
  }

  function mouseout_month(day) {
    var point = d3.select('#' + monthId(day) + _RANGE)
    point.attr("fill", "lightblue")
    point.style("cursor", "default")
  }

  function click_month(s, e) {
    if (start) {
      var point = d3.select('#'+dateId(start) + _BG)
      point.attr("fill", "white") //bg normal color
     }
    start = s
    end = e
    normalize_month()
  }

  function monthMarkers(config) {
    //min/max -months
    console.assert(config.data[0].columns[0].d, "d must be defined")
    console.assert(config.data[config.data.length-1].columns[0].d, "d must be defined")

    left_month = monthId(config.data[0].columns[0].d)
    right_month = monthId(config.data[config.data.length-1].columns[0].d)

    return left_month+"-"+right_month
  }

  function roundNumber(n) {
    return Math.round(n).toPrecision(3)
  }

  function roundNumberText(n) {
    var num = roundNumber(n)
    var prefix = d3.formatPrefix(num);
    return "~" + prefix.scale(num) + (prefix.symbol ===  "y" ? "" : prefix.symbol)
  }

  function withinrange(d) {
    return (start && end && d.d && dates.inRange(d.d, start, end)) ||
           (prev_start && dates.inRange(d.d, prev_start, prev_end))
  }

  function colorrange(s, e, c) {
      if (!s || !e || !c) return
      var ixd = new Date(s)
      do {
        d3.select('#'+dateId(ixd)+_BG).attr("fill", c)
        ixd.setDate(ixd.getDate() + 1);
      } while(dates.compare(ixd, e) < 1)
  }

  var prev_start = null
  var prev_end = null
  function normalize_month() {
      var _s = d3.min([start, end])
      var _e = d3.max([start, end])
      start = _s
      end = _e
      colorrange(prev_start, prev_end, "white")
      prev_start = start
      prev_end = end
      colorrange(start, end, "gray")
      console.log("DO SOMETHIG")
  }

  function click(data) {
    console.log("click")
    console.log(d3.mouse(this));
    console.log(data)
    if (start == null) {
      start = data.d 
    } else if (end  == null) {
      end = data.d
      normalize_month()
    } else if(start != null) {
      start = data.d 
      end = null
    }
    var mid = monthId(data.d)
    var point = d3.mouse(this)
    console.log(point)
    var e = document.getElementById(mid + _TIP_DIV)
    console.log(e)
    var x = e.getBoundingClientRect().left
    var y = e.getBoundingClientRect().top
    d3.select('#' + mid + _TIP_DIV).
    style(
      {"display": "inline",
       "left" : (point[0] + x) + "px",
       "top" : (point[1] + y) + "px",
       "position" : "absolute"
      })
    d3.select("#" + mid +_DAY_TEXT).text(data.d.toLocaleDateString())
    d3.select("#" + mid +_B_TEXT).text(data.b)
    d3.select("#" + mid +_B_COLOR).style("background-color", data.i < 0 ? "red" : "green")
    d3.select("#" + mid +_I_TEXT).text(data.i)
    d3.select('#' + dateId(data.d) + _BG).attr("fill", "brown")
  }

  function create(data) {
    var mid = monthId(data.columns[0].d)

    var width = data.columns.length * slot_width
    console.log("div width:" + (width + (2 * div_border_width)) + "px")
    var bindTo = d3.select('#' + bindto)
   
    var minibar_div =
      bindTo
      .append("div")
      .attr("id", mid +_DIV)
      .style({
        "width": (width + (2 * div_border_width)) + "px",
        "height": (height + (2 * div_border_width)) + "px",
        "float": "left",
        "background-color": "lightgreen",
        "border-style": "solid",       
        "border-width": div_border_width + "px",
        "border-color": "magenta",
        "margin-top": "5px" })

    /*
        <div class="c3-tooltip-container" style="position: absolute; pointer-events: none; top: 135.5px; left: 568.5px;">
      <table class="c3-tooltip">
        <tbody>
            <tr>
                <th colspan="2">06.01.2013</th>
            </tr>
            <tr class="c3-tooltip-name--data2">
                <td class="name"><span style="background-color: blue"></span>data3</td>
                <td class="value">500</td>
            </tr>
            <tr class="c3-tooltip-name--data1">
                <td class="name"><span style="background-color: red"></span>data2</td>
                <td class="value">350</td>
            </tr>
        </tbody>
      </table>
    </div> */
    var tip_div =
    bindTo
    .append("div")
    .attr("id", mid +_TIP_DIV)
    .style({
        "display": "none",
        "position": "absolute",
        "pointer-events": "none",
        "top": "135.5px",
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
    tr2.append("td").attr("class","name").append("span").style("background-color", "blue")
    tr2.append("td").attr("class","value").attr("id", mid +_B_TEXT).text("AAA")

    var tr1 = tbody.append("tr").attr("class","c3-tooltip-name--data1")
    tr1.append("td").attr("class","name").append("span").attr("id", mid +_B_COLOR).style("background-color", "yellow")
    tr1.append("td").attr("class","value").attr("id", mid +_I_TEXT).text("BBB")

    var minibar_leadin_svg = minibar_div
      .append("svg")
      .style("shape-rendering","crispEdges")
      //.style("shape-rendering","pixelated")
      .attr({
        "id": mid + _LEADIN,
        "width": "0px",
        "height": height })

    var path = "M " + (leadin_width - 7) + " " + barcanvas_y  + " " +
               "H " + (leadin_width - 1) + " " +    
               "V " + center_margin_y    + " " +
               "H " + (leadin_width - 7) 

    console.log("path: " + path)
    minibar_leadin_svg
      .append("path")
      .attr({
        "d": path,
        "stroke": "black",
        "stroke-width": "1",
        "fill" : "none",
        "stroke-linecap" : "round"
      })

    minibar_leadin_svg
    .append("line")
    //.style("shape-rendering","crispEdges")
    .attr({
      "id": mid + _LEADIN_ZERO,
      "x1" : leadin_width - 7,
      "x2" : leadin_width - 1,
      "y1": center_margin_y - scale(0) + top_margin,
      "y2": center_margin_y - scale(0) + top_margin,
      "stroke": "black",
      "stroke-width": line_width,
      "stroke-linecap" : "round"
    })

   /* minibar_leadin_svg
    .style("shape-rendering","crispEdges")
    .append("text")
          .text("0")
          .attr({
            "id": mid + _LEADIN_ZERO_TEXT,
            "x": leadin_width - 10,
            "y": center_margin_y - scale(0) + 3 + top_margin,
            "text-anchor": "end",
            "font-family": "sans-serif",
            "font-size": "10px",
            "fill": "black"
          })
*/
    minibar_leadin_svg
    //.style("shape-rendering","crispEdges")
    .append("text")
          .text(maxy_text)
          .attr({
            "id": mid + _MAX_TEXT,
            "x": leadin_width - 10,
            "y": barcanvas_y + 3,
            "text-anchor": "end",
            "font-family": "sans-serif",
            "font-size": "10px",
            "fill": "black"
          })

    minibar_leadin_svg
   //.style("shape-rendering","crispEdges")
    .append("text")
          .text(miny_text)
          .attr({
            "id": mid + _MIN_TEXT,
            "x": leadin_width - 10,
            "y": center_margin_y  +  3 ,
            "text-anchor": "end",
            "font-family": "sans-serif",
            "font-size": "10px",
            "fill": "black"
          })

    var minibar_svg = minibar_div
      .append("svg")
      .style("shape-rendering","crispEdges")
      .attr({ 
        "width": width,
        "height": height })

    var range_svg = minibar_svg
      .append("rect")
      .attr({
        "id": mid + _RANGE,
        "y": range_y,
        "width": width,
        "height" : range_height,
        "fill" : "lightblue"
      }).on({
          "click": function() {click_month(data.columns[0].d, data.columns[data.columns.length - 1].d)},
          "mouseover": function() {mouseover_month(data.columns[0].d)},
          "mouseout": function() {mouseout_month(data.columns[0].d)}
      })

      minibar_svg
      .selectAll()
      .data(data.columns)
      .enter()    
      .append("rect")
      .attr({
        "id": function(d) { 
          console.assert(d.d, "d must be defined")
          return dateId(d.d) + _BG },
        "x" : function(d, ix) {return (ix * slot_width)},
        "y": barcanvas_y,
        "width": slot_width,
        "height": barcanvas_height,
        "fill": function(d) {return bgcolor(d)}
      })
      .on({
        "click": click,
        "mouseover": mouseover,
        "mouseout": mouseout
      })

      minibar_svg
      .selectAll()
      .data(data.columns)
      .enter()    
      .append("rect")
      .attr({
        "id": function(d) { return dateId(d.d) + _I },
        "x" : function(d, ix){ return ((ix + (1 - col_per_slot_ratio) / 2) * slot_width)},
        "y": function(d) { return  center_margin_y - scale(Math.abs(d.i)) + top_margin },
        "width": column_width,
        "height": function(d) { return scale(Math.abs(d.i)) - scale(0) },
        "fill": columncolor
      })
      .on({
        "click": click,
        "mouseover": mouseover,
        "mouseout": mouseout
      })

     minibar_svg
      .selectAll()
      .data(data.columns)
      .enter()    
      .append("line")
     // .style("shape-rendering","crispEdges")
      .attr({
        "id": function(d) { return dateId(d.d) + _LINE_ZERO },
        "x1" : function(d, ix){ return (ix * slot_width) - 7},
        "x2" : function(d, ix) { return ((ix+1) * slot_width)},
        "y1": center_margin_y - scale(0) + top_margin,
        "y2": center_margin_y - scale(0) + top_margin,
        "stroke": "black",
        "stroke-width": line_width
      })

     minibar_svg
      .selectAll()
      .data(data.columns)
      .enter()    
      .append("line")
      //.style("shape-rendering","crispEdges")
      .attr({
        "id": function(d){ return dateId(d.d) + _LINE_B_PREV},
        "x1" : function(d, ix){ return (ix-(d.prev_b ? 0.5 : -0.5)) * slot_width},
        "x2" : function(d, ix){ return (ix+0.5) * slot_width},
        "y1": function(d){
          return center_margin_y - scale(d.prev_b ? d.prev_b : d.b) + top_margin},
        "y2": function(d, ix) {
          return center_margin_y - scale(d.b) + top_margin},
        "stroke": "blue",
        "stroke-width": line_width
      })

      minibar_svg
      .selectAll()
      .data(data.columns)
      .enter()    
      .append("line")
      //.style("shape-rendering","crispEdges")
      .attr({
        "id": function(d){ return dateId(d.d) + _LINE_B_NEXT},
        "x1" : function(d, ix){ return (ix+0.5) * slot_width },
        "x2" : function(d, ix){ return (ix+(d.next_b ? 1.5 : 0.5)) * slot_width},
        "y1": function(d) {
          return center_margin_y - scale(d.b) + top_margin},
        "y2": function(d, ix){
          return center_margin_y - scale(d.next_b ? d.next_b : d.b) + top_margin},
        "stroke": "blue",
        "stroke-width": line_width
      })

      minibar_svg
      .selectAll()
      .data(data.columns)
      .enter()    
      .append("circle")
      .style("shape-rendering","auto")
      .attr({
        "id": function(d) { return dateId(d.d) + _B},
        "cx" : function(d, ix){ return ((ix + 0.5) * slot_width)},
        "cy": function(d) { return center_margin_y - scale(d.b) + top_margin },
        "r": 1.5, //slot_width / 6,
        "fill": "blue",
      }).on({
        "click": click,
        "mouseover": mouseover,
        "mouseout": mouseout
      })
  }

  function leadin(data) {
    var mid = monthId(data.columns[0].d)
    var e = document.getElementById(mid +_DIV)
    var x = e.getBoundingClientRect().left
    console.log("mid: "+mid+ " left: " + x)
    var width = data.columns.length * slot_width
    if( !leadin_x ) { //init lead_in x
      leadin_x = x
    }
    d3.select('#' + mid +_DIV)
    .style({
      "width": ((width + (2 * div_border_width)) + (leadin_x === x ? leadin_width : 0)) + "px"
    })

    d3.select('#' + mid + _LEADIN)
    .attr({
      "width": (leadin_x === x ? leadin_width : 0) + "px",
    })

    d3.select('#' + mid + _MAX_TEXT)
    .text(roundNumberText(maxy))

    d3.select('#' + mid + _MIN_TEXT)
    .text(roundNumberText(miny)) 
    console.log("do leadin : -> "  +  (leadin_x === x ? leadin_width : 0) + "px")
  }

  function update(data) {

    var mid = monthId(data.columns[0].d)

    d3.select('#' + mid + _LEADIN_ZERO)
      .transition()
      .attr({
        "y1": center_margin_y - scale(0) + top_margin,
        "y2": center_margin_y - scale(0) + top_margin
      })
    d3.select('#' + mid + _LEADIN_ZERO_TEXT)
      .transition()
      .attr({
        "y": center_margin_y - scale(0) + 3 + top_margin,
      })

    for (var ix = 0, len = data.columns.length; ix < len; ix++) {
      date_id = dateId(data.columns[ix].d)

      d3.select('#' + date_id + _I)
        .datum(function(d) {
          d.i =  data.columns[ix].i
          d.b =  data.columns[ix].b
          d.prev_b =  data.columns[ix].prev_b
          d.next_b =  data.columns[ix].next_b
          return d
        })
        .transition()
        .attr({
          "y": function(d) {
            return center_margin_y - scale(Math.abs(d.i)) + top_margin
          },
          "height": function(d) {    
            return  scale(Math.abs(d.i)) - scale(0)  
          },
          "fill": function(d) {
            return columncolor(d)
          }
        }
      )

      d3.select('#' + date_id + _B)
        .transition()
        .attr({
          "cy": function(d) { 
            return center_margin_y - scale(d.b) + top_margin
          }  
        })

      d3.select('#' + date_id + _LINE_ZERO)
        .transition()
        .attr({
          "y1": center_margin_y - scale(0) + top_margin,
          "y2": center_margin_y - scale(0) + top_margin
        })


      d3.select('#' + date_id + _LINE_B_PREV)
        .transition()
        .attr({
          "y1": function(d) {
            return center_margin_y - scale(null != d.prev_b ? d.prev_b : d.b) + top_margin
          },
          "y2": function(d) {
            return center_margin_y - scale(d.b) + top_margin
          }
        })

      d3.select('#' + date_id +  _LINE_B_NEXT)
        .transition()
        .attr({
          "y1": function(d) {
            return center_margin_y - scale(d.b) + top_margin
          },
          "y2": function(d) {
            return center_margin_y - scale(null != d.next_b ? d.next_b : d.b) + top_margin
          }
        })
    }
  }

  var prev_config = null
  function load(new_config) {
    if (!new_config && !prev_config) {
      return
    }

    var config = new_config || prev_config
    prev_config = config

    console.assert(null != config.data[0].columns[0].i, "no data given")
    //create or update existing?
    var bindTo = d3.select('#'+bindto)
    var new_slot_width = Math.round((bindTo[0].parentNode.clientWidth / 31) + 0.5)//year in one row
//    console.log("parent width:" + bindTo[0].parentNode.clientWidth + " slot_width:" + new_slot_width)


    new_slot_width = 10
    var doit
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
      console.log("update")
      doit = update
    }

    init_scales(config)
    leadin_x = null
    for (var ix = 0, len = config.data.length; ix < len; ix++) {
      doit(config.data[ix])
      leadin(config.data[ix])
    }
  }

  return {
      "load" : load
  }
}) ()

window.addEventListener("resize", function(e) {
  minibars.load()
});



