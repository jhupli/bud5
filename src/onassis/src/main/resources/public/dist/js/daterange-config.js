var pickeroptions = {
    "dateLimit": {
        "days": 90
    },
    "showWeekNumbers": true,
    "autoApply": true,
    "locale": {
      "direction": "ltr",
      "format": "DD.MM.YYYY",
      "separator": " - ",
      "applyLabel": "Apply",
      "cancelLabel": "Cancel",
      "fromLabel": "From",
      "toLabel": "To",
      "customRangeLabel": "Custom",
      "daysOfWeek": ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
      "monthNames": ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
      "firstDay": 1
    },
    "linkedCalendars": false,
    "startDate": new Date(),
    "endDate": new Date(),
    "ranges": {
        'Today': [moment(), moment()],
        'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
        'Last 7 Days': [moment().subtract(6, 'days'), moment()],
        'Last 30 Days': [moment().subtract(29, 'days'), moment()],
        'This Month': [moment().startOf('month'), moment().endOf('month')],
        'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
     }
  }

$(document).ready(function() {
  $('#config-demo').daterangepicker(pickeroptions, function(start, end, label) { 
    console.log(start)
    console.log(end)
    console.log('New date range selected: ' + start.format('YYYY-MM-DD') + ' to ' + end.format('YYYY-MM-DD') + ' (predefined range: ' + label + ')'); 
    minibars.select(new Date(start), new Date(end))
    });
});

$("document").ready(function(){
    var f = $("foo1");
       console.log(f);
       $("pic#foo1").bind("click", function(event){alert("clicked svg foo1")});
       $("foo2").bind("click", function(event){alert("clicked svg foo2")});
   });
