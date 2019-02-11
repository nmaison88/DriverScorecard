
$(document).ready(function () {
  console.log("ready!");

  $(document).ajaxStart(function(){
    $("#wait").css("display", "block");
  });
  $(document).ajaxComplete(function(){
    $("#wait").css("display", "none");
  });
 
  var database = [];
  // console.log("get ajax");
  $.get(
    "https://api.myjson.com/bins/1a9s0o",
    function (data) {
      $(".result").html(data);
      database = data;
      // console.log(database.list);
      var i = 0;
      var goal = 2;
      var idleTotal = [];
      var speedingTotal = [];
      var hrshturnTotal = [];
      var hrshbreakTotal = [];
      var rapidacellTotal = [];
      var assets = [];
      var datasets = [];
      var mileageTotal = [];
      var Idlesum = 0;
      var speedingsum = 0;
      var hrshbreaksum = 0;
      var hrshturnsum = 0;
      var rapidacellsum = 0;
      var mileagesum = 0;
      var activeVehicles = 0;
      // console.log(database);
      graphColors = ['#c45850','#3e95cd','#3cba9f','#e8c3b9','#8e5ea2','#A28E5E','rgba(40,40,255,0.8)', 'rgba(255,40,40,8)', 'rgba(40,255,40,8)', 'rgba(255,255,40,0.8)', 'rgba(40,255,255,0.8)', 'rgba(100,15,18,0.8)'];
      var t = 0;
      database.list.forEach(function (key) {
        mileageTotal.push(key.mileage);
        idleTotal.push(key.idle);
        speedingTotal.push(key.Speeding);
        hrshturnTotal.push(key.hrshturn);
        hrshbreakTotal.push(key.hrshbreak);
        rapidacellTotal.push(key.rapidacell);
        assets.push(key.vehicle);
        datasets.push({ "label": key.vehicle, borderColor: graphColors[t], backgroundColor: graphColors[t], "data": [key.idle, key.hrshturn, key.rapidacell, key.hrshbreak, key.Speeding], "fill": false, "lineTension": 0 })
        t++;
        // console.log("t:" ,t)
        if (t > graphColors.length) { t = 0; }


      });
      for (var w = 0; w < mileageTotal.length; w++) {
        mileagesum += mileageTotal[w];
      };
      for (var w = 0; w < idleTotal.length; w++) {
        Idlesum += idleTotal[w];
      };
      for (var w = 0; w < speedingTotal.length; w++) {
        speedingsum += speedingTotal[w];
      };
      for (var w = 0; w < hrshbreakTotal.length; w++) {
        hrshbreaksum += hrshbreakTotal[w];
      };
      for (var w = 0; w < rapidacellTotal.length; w++) {
        rapidacellsum += rapidacellTotal[w];
      };
      for (var w = 0; w < idleTotal.length; w++) {
        hrshturnsum += hrshturnTotal[w];
      };
      activeVehicles = mileageTotal.length;
      for (var w = 0; w < mileageTotal.length; w++) {
        if (mileageTotal[w] == 0) {
          activeVehicles--;
        }
      }
      Object.keys(data.list).forEach(function (key) {

        var indvidlepercent = (Math.round((data.list[i].idle * 100) / Idlesum));
        var indvspeedpercent = (Math.round((data.list[i].Speeding * 100) / speedingsum));
        var indvrapidaccpercent = (Math.round((data.list[i].rapidacell * 100) / rapidacellsum));
        var indvhrshbreakpercent = (Math.round((data.list[i].hrshbreak * 100) / hrshbreaksum));
        var indvhrshtrnpercent = (Math.round((data.list[i].hrshturn * 100) / hrshturnsum));


        if (data.list[i].hrshbreak <= goal) {
          var hrshcheck = "success";
        } else {
          var hrshcheck = "danger";

        }
        if (i == 0) {
          // var header = "bg-th text-light";
        } else {
          var header = "standard ";
        }

        if (1 > goal) {
          var redchk0 = "danger";
        } else {
          var redchk0 = "success";
        }

        if (data.list[i].rapidacell > goal) {
          var redchk1 = "danger";
        } else {
          var redchk1 = "success";
        }
        if (data.list[i].hrshturn > goal) {
          var redchk2 = "danger";
        } else {
          var redchk2 = "success";
        }
        if (data.list[i].idle > goal) {
          var redchk3 = "danger";
        } else {
          var redchk3 = "success";
        }
        var score=data.list[i].hrshturn+data.list[i].idle+data.list[i].rapidacell+data.list[i].hrshbreak+data.list[i].Speeding;
        // console.log('added score',score);

        var Inputscore=Math.round((score/data.list[i].mileage)*100*-1+100);
        // console.log('input score',Inputscore);
        if(isNaN(Inputscore)){
          Inputscore="100";}
        if(Inputscore<70){
          var grade="FScore";
        }else if(Inputscore > 70 && Inputscore < 80){
          var grade="CScore";
        }else if(Inputscore > 80 && Inputscore < 90){
          var grade="BScore";
        }else if(Inputscore > 80 &&Inputscore <=100){
          var grade="AScore";
        }

       
        var row =
          '<tr class="  d-flex">' +
          '<td class="surveyQuestion col-2 ' + header + '">' + data.list[i].vehicle + "</td>" +
          '<td class=" col-1 ' + header + '">' + data.list[i].mileage + "</td>" +
          '<td class="col-3 ' + header + '">' + '<ul id="progress" class="progress   "><li style=" width:20% " class="bar bar0 ">' + indvhrshtrnpercent + '%<li style=" width:20% " class="bar bar2">' + indvidlepercent + '%<li style=" width:20% " class="bar bar3">' + indvrapidaccpercent + '%<li style=" width:20% " class="bar bar4">' + indvhrshbreakpercent + '%<li style=" width:20%" class="bar bar5">' + indvspeedpercent + "% </ul>" + "</td>" +
          '<td class="' + redchk2 + " col-1 " + header + '">' + data.list[i].hrshturn + "</td>" +
          '<td class="' + redchk3 + " col-1 " + header + '">' + data.list[i].idle + "</td>" +
          '<td class="' + redchk1 + " col-1 " + header + '">' + data.list[i].rapidacell + "</td>" +
          '<td class="' + " col-1 " + header + '">' + data.list[i].hrshbreak + "</td>" +
          '<td class="' + redchk3 + " col-1 " + header + '">' + data.list[i].Speeding + "</td>" +
          '<td class="' + grade + " col-1 " + header + '">' + Inputscore+  "</td>" 
          + "</tr>"
          ;
        $("table").append(row);
      
        i++;
      });
      // Populate the table after grabbing the json data and parsing
      $('#table').DataTable({
        "paging": true,
        "searching": true,
        "lengthChange": false,
        "ordering": true,
        "info": false,
        "autoWidth": true,
        "sDom": 'lfrtip',
        // "sPaginationType": "full_numbers"
    });
    


      $('#activevehicles').text(activeVehicles + "/" + mileageTotal.length)
      $('label').addClass("mx-auto").css("font-size","1.2em");




      $('#milesdriven').text(mileagesum);
      var count = ($('.AScore').length + $('.BScore').length + $('.CScore').length);
      console.log("Total Score",count);
      $('#withingoal').text(count);
      $('#outsidegoal').text( $('.FScore').length);

      // console.log("F score", $('.FScore'));


      var pieTotal = (Idlesum + speedingsum + rapidacellsum + hrshbreaksum + hrshturnsum); //calculates the Pie total in order to get all values to 100% of the pie or doughnut.
      var idlepercent = (Math.round((Idlesum * 100) / pieTotal));
      var speedingpercent = (Math.round((speedingsum * 100) / pieTotal));
      var rapidaccepercent = (Math.round((rapidacellsum * 100) / pieTotal));
      var hrshbreakpercent = (Math.round((hrshbreaksum * 100) / pieTotal));
      var hrshtrnpercent = (Math.round((hrshturnsum * 100) / pieTotal));

      new Chart(document.getElementById("doughnut-chart"), {
        type: "doughnut",
        data: {
          labels: [
            "Idle",
            "Speeding",
            "rapid acelleration",
            "Sudden Stop",
            "Hard Cornering"
          ],
          datasets: [
            {
              label: "Population (millions)",
              backgroundColor: [
                "#3e95cd",
                "#8e5ea2",
                "#3cba9f",
                "#e8c3b9",
                "#c45850"
              ],
              data: [
                idlepercent,
                speedingpercent,
                rapidaccepercent,
                hrshbreakpercent,
                hrshtrnpercent
              ]
            }
          ]
        },
        options: {
          maintainAspectRatio: false,

          responsive: true,
          legend: {
            position: 'bottom',display:false
          },

          title: {
            display: true,
            text: "Total Fleet Events",
          }
        }
      });


      // console.log("Idlesum",Idlesum)
      // console.log("idleTotal",idleTotal)
      // console.log(datasets);
      // var ctx = document.getElementById("myChart").getContext('2d');
      // var myChart = new Chart(ctx, {
      //   type: 'bar',
      //   data: {
      //     labels: ["Total Idle",
      //       "Total hard corner",
      //       "Total Rapid start",
      //       "Total Sudden Stop",
      //       "Total Speeding"],
      //     datasets: [{
      //       label: 'Total # of Infractions',
      //       data: [Idlesum,
      //         hrshturnsum,
      //         rapidacellsum,
      //         hrshbreaksum,
      //         speedingsum],

      //       backgroundColor: [
      //         "#3e95cd",
      //         "#c45850",
      //         "#3cba9f",
      //         "#e8c3b9",
      //         "#8e5ea2"

      //       ],//can be an array of colors per each bar or one to rule them all.
      //       borderColor: 'rgba(1,125,132)',
      //       borderWidth: 1
      //     },
      //     ]
      //   },
      //   options: {
      //     maintainAspectRatio: false,
      //     scales: {
      //     yAxes: [{
      //         stacked: true,
      //         gridLines: {
      //         display: true,
      //         color: "rgba(255,99,132,0.2)"
      //         }
      //       }],
      //       xAxes: [{
      //         gridLines: {
      //           display: false
      //         }
      //       }]
      //     }
      //   }

      // });
      var myChart2 = new Chart(document.getElementById("area-chart"), {
        type: 'line',
        data: {
          labels: ["Idle",
            "hard corner",
            "Rapid start",
            "Sudden Stop",
            "Speeding"],
            "datasets": datasets,
        },
        options: {
          maintainAspectRatio: false,
          responsive: true,
          legend: {
          position: 'bottom',
          },
        }

      })
    }
   
  );//end of the Get Json
  function add(a, b) {
    return a + b;
  }
  
});




