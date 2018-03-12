var pie = c3.generate({
    bindto: '#pie',
    data: {
        columns: [
            ['data1', 1],
            ['data2', 50],
            ['data3', 10],
            ['data4', 15],
            ['data5', 30],
            ['data6', 40],
            ['data7', 50],
            ['data8', 100],

        ],
        onclick: function (d) { alert(d); },
        type: 'pie'
    },
    pie: {
        label: {
            format: function (value, ratio, id) {
                return d3.format('$')(value);
            }
        }
    },
    legend: {
  	  item: {
  	    onclick: function (id) {  console.log("LEGEND"); console.log(id); }
  	  }
  	}
});