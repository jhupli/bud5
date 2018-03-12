/*var chart = c3.generate({
    bindto: '#chart',
    data: {
      columns: [
        ['data1', 30, 200, 100, 400, 150, 250],
        ['data2', 50, 20, 10, 40, 15, 25]
      ],
      axes: {
        data2: 'y2'
      },
      types: {
        data2: 'bar'
      }
    },
    axis: {
      y: {
        label: {
          text: 'Y Label',
          position: 'outer-middle'
        },
        tick: {
          format: d3.format("$,") // ADD
        }
      },
      y2: {
        show: true,
        label: {
          text: 'Y2 Label',
          position: 'outer-middle'
        }
      }
    }
});*/

/*var chart = c3.generate({
    bindto: '#chart',
    data: {
        columns: [
            ['data1', 30, 20, 50, 40, 60, 50],
            ['data2', 200, 130, 90, 240, 130, 220],
            ['data3', 300, 200, 160, 400, 250, 250],
            ['data4', 200, 130, 90, 240, 130, 220],
            ['data5', 130, 120, 150, 140, 160, 150],
            ['data6', 90, 70, 20, 50, 60, 120],
        ],
        onclick: function (d, element) { alert(d); },
        type: 'bar',
        types: {
            data3: 'spline',
            data4: 'line',
            data6: 'area',
        },
        groups: [
            ['data1','data2']
        ]
    }
   ,
    subchart: {
      show: true,
      onbrush: function (domain) { console.log(domain); }
    },

});*/

/*
var chart2 = c3.generate({
    bindto: '#chart2',
    data: {
        x: 'date',
        columns: [
            ['date', '2014-01-01', '2014-01-10', '2014-01-20', '2014-01-30', '2014-02-01'],
            ['sample', 30, 200, 100, 400, 150],
            ['sample2', 130, 250, 100, 400, 15]
        ],
        onclick: function (d, element) { 
          console.log("CLICK");
          console.log(d); 
          console.log(chart2.selected());
        },
        onmouseover: function (d, element) { 
          console.log("ONMOUSEOVER");
          console.log(d); 
        },       
        onmouseout: function (d, element) { 
          console.log("ONMOUSEOUT");
          console.log(d); 
        },

    },

   regions: [
        {start: '2014-01-05', end: '2014-01-10'}
    ],

    axis: {
      x: {
          type: 'timeseries',
          tick: {
              count: 3,
              format: '%d.%m.%Y'
          }
      }
    }

});
*/

var chart3 = c3.generate({
    bindto: '#chart2',
    grid: {
        y: {
            lines: [{value: 0}]
        }
    },
    data: {

        x: 'x',
        xFormat: '%Y%m%d', // 'xFormat' can be used as custom format of 'x'
        columns: [
           // ['date', '2013-01-01', '2013-01-02', '2013-01-03', '2013-01-04', '2013-01-05', '2013-01-06'],
            ['x', '20130101', '20130102', '20130103', '20130104', '20130105', '20130106'
                , '20130107', '20130108', '20130109', '20130110', '20130111', '20130112'
                , '20130113', '20130114', '20130115', '20130116', '20130117', '20130118'

                , '20130119', '20130120', '20130121', '20130122', '20130123', '20130124'
                , '20130125', '20130126', '20130127', '20130128', '20130129', '20130130'
                , '20130131', '20130201', '20130202', '20130203', '20130204', '20130205'                
            ],
            ['Income', 30, 20, 50, 40, 0, 50, 30, 20, 50, 40, 0, 50, 30, 20, 50, 40, 0, 50
            , 30, 20, 50, 40, 0, 50, 30, 20, 50, 40, 0, 50, 30, 20, 50, 40, 0, 50],
            ['Expence', -200, -130, -90, -240, 0, -220, -200, -130, -90, -240, 0, -220, -200, -130, -90, -240, 0, -220
            , -200, -130, -90, -240, 0, -220, -200, -130, -90, -240, 0, -220, -200, -130, -90, -240, 0, -220],
            ['VISA', 200, 130, -1, 140, 4, 229, 200, 130, -1, 140, 4, 229, 200, 130, -1, 140, 4, 229
            , 200, 130, -1, 140, 4, 229, 200, 130, -1, 140, 4, 229, 200, 130, -1, 140, 4, 229],
            ['Cash', 100, 13, 90, 40, 0, 20, 100, 13, 90, 40, 0, 20, 100, 13, 90, 40, 0, 20
            , 100, 13, 90, 40, 0, 20, 100, 13, 90, 40, 0, 20, 100, 13, 90, 40, 0, 20],
            ['All', 250, 130, 90, 240, 0, 220, 250, 130, 90, 240, 0, 220, 250, 130, 90, 240, 0, 220
            , 250, 130, 90, 240, 0, 220, 250, 130, 90, 240, 0, 220, 250, 130, 90, 240, 0, 220],
         ],

        type: 'bar',
        types: {
            All: 'spline',
            Cash: 'line',
            VISA: 'line',
          },
        groups: [
            ['Income','Expence']
        ],
        //regions: [
        //  {start:0, end:1}
        //],
        selection: {
          //grouped: true,
          //enabled: true,
          //draggable: true
        },
        onclick: function (d, element) { console.log("CLICK");
                                         console.log(d); 
                                         console.log(chart3.selected());



                                       },
        onmouseover: function (d, element) { console.log("ONMOUSEOVER");
                                         console.log(d); },       

        onmouseout: function (d, element) { console.log("ONMOUSEOUT");
                                         console.log(d); },                                                                    
    },
    regions: [
          { start: '20130101', end: '20130104' },
          { start: '20130106', end: '20130110' }
    ],
   /* selection: {
          //grouped: true,
      enabled: true,
      draggable: false
    },*/
    axis: {
        x: {
            type: 'timeseries',
            tick: {
              //  count: 6,
                format: '%d.%m.'
               // format: '%d.%m.%Y'
            }
        }
    },
    legend: {
    	  item: {
    	    onclick: function (id) {  console.log("LEGEND"); console.log(id); }
    	  }
    	}
});


/*setTimeout(function () {
    chart3.load({
        columns: [
            ['A', 400, 500, 450, 700, 600, 500]
        ]
    });
}, 3000);
*/
