var database = [];
var groups = [];
var groupContainer = [];
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
var GroupNames = [];
var GroupIdle = [];
var GroupSpeed = [];
var GroupHrshBrk = [];
var GroupHrshTrn = [];
var GrouphMielage = [];
var GroupRapidacell = [];
var graphColors = [
  "#c45850",
  "#3e95cd",
  "#3cba9f",
  "#e8c3b9",
  "#8e5ea2",
  "#A28E5E",
  "rgba(40,40,255,0.8)",
  "rgba(255,40,40,8)",
  "rgba(40,255,40,8)",
  "rgba(255,255,40,0.8)",
  "rgba(40,255,255,0.8)",
  "rgba(100,15,18,0.8)"
];
$(document).ready(function() {
  // console.log("ready!");

  $(document).ajaxStart(function() {
    $("#wait").css("display", "block");
  });
  $(document).ajaxComplete(function() {
    $("#wait").css("display", "none");
  });

  $.get(
    "https://api.myjson.com/bins/quch2", //with better names
    // 'https://api.myjson.com/bins/zxsfq', //large records but no groups
    function(data) {
      $(".result").html(data);
      database = data;
console.log(data)
      getTotals();

      for (var w = 0; w < mileageTotal.length; w++) {
        mileagesum += mileageTotal[w];
      }
      for (var w = 0; w < idleTotal.length; w++) {
        Idlesum += idleTotal[w];
      }
      for (var w = 0; w < speedingTotal.length; w++) {
        speedingsum += speedingTotal[w];
      }
      for (var w = 0; w < hrshbreakTotal.length; w++) {
        hrshbreaksum += hrshbreakTotal[w];
      }
      for (var w = 0; w < rapidacellTotal.length; w++) {
        rapidacellsum += rapidacellTotal[w];
      }
      for (var w = 0; w < idleTotal.length; w++) {
        hrshturnsum += hrshturnTotal[w];
      }
      activeVehicles = mileageTotal.length;
      for (var w = 0; w < mileageTotal.length; w++) {
        if (mileageTotal[w] == 0) {
          activeVehicles--;
        }
      }

      var sumObjectsByKey = (...objs) => {
        return objs.reduce((a, b) => {
          for (let k in b) {
            if (typeof b[k] === "number" && b.hasOwnProperty(k))
              a[k] = (a[k] || 0) + b[k];
          }
          return a || null;
        }, {});
      };
      let getNewObj = arr => {
        obj = {};
        arr.forEach(item => {
          obj[item.group] = sumObjectsByKey(
            ...arr.filter(a => {
              return a.group === item.group;
            })
          );
        });

        return obj;
      };

      groups = getNewObj(data.list);

      Object.entries(groups).forEach(entry => {
        let key = entry[0];
        let value = entry[1];
        let objcreater = { Group: key, value };
        groupContainer.push(objcreater);
      });

      $("#activevehicles").text(activeVehicles + "/" + mileageTotal.length);
      $("label")
        .addClass("mx-auto")
        .css("font-size", "1.2em");

      $("#milesdriven").text(mileagesum.toLocaleString());

      Object.values(groupContainer).forEach(function(key) {
        GroupNames.push(key.Group);
        GroupIdle.push(key.value.idle);
        GroupSpeed.push(key.value.Speeding);
        GroupHrshBrk.push(key.value.hrshbreak);
        GroupHrshTrn.push(key.value.hrshturn);
        GrouphMielage.push(key.value.mileage);
        GroupRapidacell.push(key.value.rapidacell);
      });
    

      tableMaker();
      graph();
      var items=GroupNames.forEach((element)=>{
    var dropdownItems='<option value="'+ element + '">'+ element +'</option>' ;
    $('#GroupDropdown').append(dropdownItems)
  })
      var count =
        $(".AScore").length + $(".BScore").length + $(".CScore").length;
      $("#withingoal").text(count);
      $("#outsidegoal").text($(".FScore").length);
    }
  );
}); //end of the Get Json

$("#GroupView").click(() => {
  $("#VehicleViewContainer").css("display", "none");
  $("#OverViewContainer").css("display", "none");
  $("#GroupViewContainer").css("display", "block");
  Groupgraph();
  
});

$("#VehicleView").click(() => {
  $("#GroupViewContainer").css("display", "none");
  $("#OverViewContainer").css("display", "none");
  $("#VehicleViewContainer").css("display", "block");
});

$("#Overview").click(() => {
  $("#GroupViewContainer").css("display", "none");
  $("#VehicleViewContainer").css("display", "none");
  $("#OverViewContainer").css("display", "block");

  graph();
});


add = (a, b) => {
  return a + b;
};
graph = () => {
  var pieTotal =
    Idlesum + speedingsum + rapidacellsum + hrshbreaksum + hrshturnsum; //calculates the Pie total in order to get all values to 100% of the pie or doughnut.
  var idlepercent = Math.round((Idlesum * 100) / pieTotal);
  var speedingpercent = Math.round((speedingsum * 100) / pieTotal);
  var rapidaccepercent = Math.round((rapidacellsum * 100) / pieTotal);
  var hrshbreakpercent = Math.round((hrshbreaksum * 100) / pieTotal);
  var hrshtrnpercent = Math.round((hrshturnsum * 100) / pieTotal);

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
        position: "bottom",
        display: true
      },

      title: {
        display: true,
        text: "Total Fleet Events"
      }
    }
  });
  new Chart(document.getElementById("area-chart"), {
    type: "bar",
    data: {
      labels: ["Idle", "hard corner", "Rapid start", "Sudden Stop", "Speeding"],
      datasets: datasets
    },
    options: {
      maintainAspectRatio: false,
      responsive: true,
      legend: {
        display: false,
        position: "bottom"
      }
    }
  });
};
Groupgraph = () => {
  new Chart(document.getElementById("mychartfourth"), {
    type: "bar",
    data: {
      labels: GroupNames,
      datasets: [
        {
          label: "Groups",
          backgroundColor: "#3e95cd",
          data: GroupHrshBrk
        }
      ]
    },

    options: {
      title: {
        display: true,
        text: "# Hard Breaking"
      },
      maintainAspectRatio: false,
      scales: {
        yAxes: [
          {
            stacked: false,
            gridLines: {
              display: true,
              color: "rgba(255,99,132,0.2)"
            }
          }
        ],
        xAxes: [
          {
            gridLines: {
              display: false
            }
          }
        ]
      }
    }
  });
  new Chart(document.getElementById("myChart"), {
    type: "bar",
    data: {
      labels: GroupNames,
      datasets: [
        {
          label: "Groups",
          backgroundColor: "#3e95cd",
          data: GroupIdle
        }
      ]
    },

    options: {
      title: {
        display: true,
        text: "Minutes Idle/Miles Driven"
      },
      maintainAspectRatio: false,
      scales: {
        yAxes: [
          {
            stacked: false,
            gridLines: {
              display: true,
              color: "rgba(255,99,132,0.2)"
            }
          }
        ],
        xAxes: [
          {
            gridLines: {
              display: false
            }
          }
        ]
      }
    }
  });
  new Chart(document.getElementById("myChartsecond"), {
    type: "bar",

    data: {
      labels: GroupNames,
      datasets: [
        {
          label: "Total # of Infractions",
          data: GroupRapidacell,

          backgroundColor: "#3e95cd"
        }
      ]
    },
    options: {
      title: {
        display: true,
        text: "# Hard Accelleration"
      },
      maintainAspectRatio: false,
      scales: {
        yAxes: [
          {
            stacked: false,
            gridLines: {
              display: true,
              color: "rgba(255,99,132,0.2)"
            }
          }
        ],
        xAxes: [
          {
            gridLines: {
              display: false
            }
          }
        ]
      }
    }
  });
  new Chart(document.getElementById("myChartthird"), {
    type: "bar",
    data: {
      labels: GroupNames,
      datasets: [
        {
          label: "Groups",
          backgroundColor: "#3e95cd",
          data: GroupSpeed
        }
      ]
    },

    options: {
      title: {
        display: true,
        text: "# Speeding Notices"
      },
      maintainAspectRatio: false,
      scales: {
        yAxes: [
          {
            stacked: false,
            gridLines: {
              display: true,
              color: "rgba(255,99,132,0.2)"
            }
          }
        ],
        xAxes: [
          {
            gridLines: {
              display: false
            }
          }
        ]
      }
    }
  });
};
getTotals = () => {
  t = 0;

  database.list.forEach(function(key) {
    mileageTotal.push(key.mileage);
    idleTotal.push(key.idle);
    speedingTotal.push(key.Speeding);
    hrshturnTotal.push(key.hrshturn);
    hrshbreakTotal.push(key.hrshbreak);
    rapidacellTotal.push(key.rapidacell);
    assets.push(key.vehicle);
    datasets.push({
      label: key.vehicle,
      borderWidth: 1,
      borderColor: graphColors[t],
      backgroundColor: graphColors[t],
      data: [
        key.idle,
        key.hrshturn,
        key.rapidacell,
        key.hrshbreak,
        key.Speeding
      ],
      fill: false,
      lineTension: 0
    });
    t++;
    if (t > graphColors.length) {
      t = 0;
    }
  });
};

tableMaker = () => {
  var i = 0;
  Object.keys(database.list).forEach(function(key) {
    var indvidlepercent = Math.round((database.list[i].idle * 100) / Idlesum);
    var indvspeedpercent = Math.round(
      (database.list[i].Speeding * 100) / speedingsum
    );
    var indvrapidaccpercent = Math.round(
      (database.list[i].rapidacell * 100) / rapidacellsum
    );
    var indvhrshbreakpercent = Math.round(
      (database.list[i].hrshbreak * 100) / hrshbreaksum
    );
    var indvhrshtrnpercent = Math.round(
      (database.list[i].hrshturn * 100) / hrshturnsum
    );

    if (database.list[i].hrshbreak <= goal) {
      var hrshcheck = "success";
    } else {
      var hrshcheck = "danger";
    }
    if (i == 0) {
    } else {
      var header = "standard ";
    }

    if (1 > goal) {
      var redchk0 = "danger";
    } else {
      var redchk0 = "success";
    }

    if (database.list[i].rapidacell > goal) {
      var redchk1 = "danger";
    } else {
      var redchk1 = "success";
    }
    if (database.list[i].hrshturn > goal) {
      var redchk2 = "danger";
    } else {
      var redchk2 = "success";
    }
    if (database.list[i].idle > goal) {
      var redchk3 = "danger";
    } else {
      var redchk3 = "success";
    }
    var score =
      database.list[i].hrshturn +
      database.list[i].idle +
      database.list[i].rapidacell +
      database.list[i].hrshbreak +
      database.list[i].Speeding;
    // console.log('added score',score);

    var Inputscore = Math.round(
      (score / database.list[i].mileage) * 100 * -1 + 100
    );
    // console.log('input score',Inputscore);
    if (isNaN(Inputscore)) {
      Inputscore = "100";
    }
    if (Inputscore < 70) {
      var grade = "FScore";
    } else if (Inputscore > 70 && Inputscore < 80) {
      var grade = "CScore";
    } else if (Inputscore > 80 && Inputscore < 90) {
      var grade = "BScore";
    } else if (Inputscore > 80 && Inputscore <= 100) {
      var grade = "AScore";
    }

    var row =
      '<tr class="  d-flex">' +
      '<td class="surveyQuestion col-1 ' +
      header +
      '">' +
      database.list[i].vehicle +
      "</td>" +
      '<td class="surveyQuestion col-1 ' +
      header +
      '">' +
      database.list[i].group +
      "</td>" +
      '<td class=" col-1 ' +
      header +
      '">' +
      database.list[i].mileage.toLocaleString() +
      "</td>" +
      '<td class="col-3 ' +
      header +
      '">' +
      '<ul id="progress" class="progress   "><li style=" width:20% " class="bar bar0 ">' +
      indvhrshtrnpercent +
      '%<li style=" width:20% " class="bar bar2">' +
      indvidlepercent +
      '%<li style=" width:20% " class="bar bar3">' +
      indvrapidaccpercent +
      '%<li style=" width:20% " class="bar bar4">' +
      indvhrshbreakpercent +
      '%<li style=" width:20%" class="bar bar5">' +
      indvspeedpercent +
      "% </ul>" +
      "</td>" +
      '<td class="' +
      redchk2 +
      " col-1 " +
      header +
      '">' +
      database.list[i].hrshturn +
      "</td>" +
      '<td class="' +
      redchk3 +
      " col-1 " +
      header +
      '">' +
      database.list[i].idle +
      "</td>" +
      '<td class="' +
      redchk1 +
      " col-1 " +
      header +
      '">' +
      database.list[i].rapidacell +
      "</td>" +
      '<td class="' +
      " col-1 " +
      header +
      '">' +
      database.list[i].hrshbreak +
      "</td>" +
      '<td class="' +
      redchk3 +
      " col-1 " +
      header +
      '">' +
      database.list[i].Speeding +
      "</td>" +
      '<td class="' +
      grade +
      " col-1 " +
      header +
      '">' +
      Inputscore +
      "<span>%</span></td>" +
      "</tr>";
    $("#table").append(row);

    i++;
  });
  // Populate the table after grabbing the json data and parsing
  $("#table").DataTable({
    paging: true,
    searching: true,
    lengthChange: false,
    ordering: true,
    info: true,
    autoWidth: true,
    dom: "lfrtipB",
    buttons: [{ extend: "csv", text: "Export csv" }],
    sPaginationType: "numbers"
  });
};
$('select').change(function() {
    // alert($(this).val());
    $("#Grouptable").DataTable({
    destroy: true,
    paging: true,
    searching: true,
    lengthChange: false,
    ordering: true,
    info: true,
    autoWidth: true,
    dom: "lfrtipB",
    buttons: [{ extend: "csv", text: "Export csv" }],
    sPaginationType: "numbers"
  }).destroy();

    var compareGroup=$(this).val();
    console.log('compareGroup',compareGroup);
    
    var i = 0;
  Object.keys(database.list).forEach(function(key) {
    var indvidlepercent = Math.round((database.list[i].idle * 100) / Idlesum);
    var indvspeedpercent = Math.round(
      (database.list[i].Speeding * 100) / speedingsum
    );
    var indvrapidaccpercent = Math.round(
      (database.list[i].rapidacell * 100) / rapidacellsum
    );
    var indvhrshbreakpercent = Math.round(
      (database.list[i].hrshbreak * 100) / hrshbreaksum
    );
    var indvhrshtrnpercent = Math.round(
      (database.list[i].hrshturn * 100) / hrshturnsum
    );

    if (database.list[i].hrshbreak <= goal) {
      var hrshcheck = "success";
    } else {
      var hrshcheck = "danger";
    }
    if (i == 0) {
    } else {
      var header = "standard ";
    }

    if (1 > goal) {
      var redchk0 = "danger";
    } else {
      var redchk0 = "success";
    }

    if (database.list[i].rapidacell > goal) {
      var redchk1 = "danger";
    } else {
      var redchk1 = "success";
    }
    if (database.list[i].hrshturn > goal) {
      var redchk2 = "danger";
    } else {
      var redchk2 = "success";
    }
    if (database.list[i].idle > goal) {
      var redchk3 = "danger";
    } else {
      var redchk3 = "success";
    }
    var score =
      database.list[i].hrshturn +
      database.list[i].idle +
      database.list[i].rapidacell +
      database.list[i].hrshbreak +
      database.list[i].Speeding;
    // console.log('added score',score);

    var Inputscore = Math.round(
      (score / database.list[i].mileage) * 100 * -1 + 100
    );
    // console.log('input score',Inputscore);
    if (isNaN(Inputscore)) {
      Inputscore = "100";
    }
    if (Inputscore < 70) {
      var grade = "FScore";
    } else if (Inputscore > 70 && Inputscore < 80) {
      var grade = "CScore";
    } else if (Inputscore > 80 && Inputscore < 90) {
      var grade = "BScore";
    } else if (Inputscore > 80 && Inputscore <= 100) {
      var grade = "AScore";
    }
    

// if (database.list[i].group ===compareGroup){
  // console.log('Filtering');
    var row =
      '<tr class="  d-flex">' +
      '<td class="surveyQuestion col-1 ' +
      header +
      '">' +
      database.list[i].vehicle +
      "</td>" +
      '<td class="surveyQuestion col-1 ' +
      header +
      '">' +
      database.list[i].group +
      "</td>" +
      '<td class=" col-1 ' +
      header +
      '">' +
      database.list[i].mileage.toLocaleString() +
      "</td>" +
      '<td class="col-3 ' +
      header +
      '">' +
      '<ul id="progress" class="progress   "><li style=" width:20% " class="bar bar0 ">' +
      indvhrshtrnpercent +
      '%<li style=" width:20% " class="bar bar2">' +
      indvidlepercent +
      '%<li style=" width:20% " class="bar bar3">' +
      indvrapidaccpercent +
      '%<li style=" width:20% " class="bar bar4">' +
      indvhrshbreakpercent +
      '%<li style=" width:20%" class="bar bar5">' +
      indvspeedpercent +
      "% </ul>" +
      "</td>" +
      '<td class="' +
      redchk2 +
      " col-1 " +
      header +
      '">' +
      database.list[i].hrshturn +
      "</td>" +
      '<td class="' +
      redchk3 +
      " col-1 " +
      header +
      '">' +
      database.list[i].idle +
      "</td>" +
      '<td class="' +
      redchk1 +
      " col-1 " +
      header +
      '">' +
      database.list[i].rapidacell +
      "</td>" +
      '<td class="' +
      " col-1 " +
      header +
      '">' +
      database.list[i].hrshbreak +
      "</td>" +
      '<td class="' +
      redchk3 +
      " col-1 " +
      header +
      '">' +
      database.list[i].Speeding +
      "</td>" +
      '<td class="' +
      grade +
      " col-1 " +
      header +
      '">' +
      Inputscore +
      "<span>%</span></td>" +
      "</tr>";
    $("#Grouptable").append(row);

    
// }
i++;
  });

  // Populate the table after grabbing the json data and parsing
  var table = $("#Grouptable").DataTable({
    destroy: true,
    paging: true,
    searching: true,
    lengthChange: false,
    ordering: true,
    info: true,
    autoWidth: true,
    dom: "lfrtipB",
    buttons: [{ extend: "csv", text: "Export csv" }],
    sPaginationType: "numbers"
  });

  table.search( compareGroup).draw();


});