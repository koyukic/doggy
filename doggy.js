var password = document.getElementsByName("password")[0].value
var data = {};
var today = getDate(0)
var yesterday = getDate(-1)
function getDate(offset) {
  date = new Date();
  date.setDate(date.getDate() + offset);
  
  month = date.getUTCMonth() + 1;
  day = date.getUTCDate()
  if (month < 10) {
    month = "0"+month;
  }
  if (day < 10) {
    day = "0"+day;
  }
  return date.getUTCFullYear() + "-" + month +"-" + day;
}

function checkAccount() {
  var req = new XMLHttpRequest();
  for (var x = 0; x < accounts.length; x++) {
    var map = {}
    data[accounts[x]] = map;
    var sendData = new FormData();
    sendData.append('phone', accounts[x]);
    sendData.append('password', password);
    req.open('POST', 'http://ivg99.com/saber/index/loginserver.html', false);
    req.send(sendData);

    appointment = getTable(req, 'http://ivg99.com/saber/mills/mymillsappointment.html', []);
    //check for today and yesterday
    filterTodayYesterday(appointment);
    map['預約記錄'] = appointment
    sleep(200);
    map['買單記錄'] = getTable(req, 'http://ivg99.com/saber/trade/mytradebuy.html', [4, 0]);
    sleep(200);
    map['賣單記錄'] = getTable(req, 'http://ivg99.com/saber/trade/mytradesell.html', [4, 0]);
    sleep(200);
    map['领养中'] = getTable(req, 'http://ivg99.com/saber/mills/mymillsadopt.html', []);
    sleep(200);
    map['已成长'] = getTable(req, 'http://ivg99.com/saber/mills/mymillsgroup.html', []);
    sleep(200);
    map['交易中'] = getTable(req, 'http://ivg99.com/saber/mills/mymillstrading.html', []);
    sleep(200);
    //map['已收益'] = getTable(req, 'http://ivg99.com/saber/mills/mymillstrading.html', []);
    //sleep(200);
  }

  renderPage()
}

function filterTodayYesterday(tableElement) {
  rows = tableElement.rows;
  for (var r = 0; r < rows.length; r ++) {
    if (rows[r].cells[1] == undefined || (!rows[r].cells[1].innerText.includes(today) && !rows[r].cells[1].innerText.includes(yesterday))) {
      rows[r].setAttribute("style", "display: none");
    }
  }
}
function sleep(miliseconds) {
   var currentTime = new Date().getTime();

   while (currentTime + miliseconds >= new Date().getTime()) {
      
   }
}
function getTable(req, url, deleteCols) {
  req.open('GET', url, false);
  req.send(null);
  var dox = (new DOMParser).parseFromString(req.responseText, "text/html");
  table = dox.getElementsByTagName("table")[0]

  rows = table.rows;
  for (var r = 0; r < rows.length; r ++) {
    for (var s = 0; s < deleteCols.length; s++) {
      rows[r].deleteCell(deleteCols[s]);
    }
  }
  return table;

}

function renderPage() {
  document.getElementsByTagName("body")[0].innerHTML = '<div id="main"></div>'
  var mainDiv = document.getElementById("main")
  
  Object.keys(data).forEach(function(acctId) {
      var rez = ""
      var thisDiv = document.createElement("div");  
      rez = "<h3>"+acctId+"</h3></br><table><tr>" 
      acctData = data[acctId];
      Object.keys(acctData).forEach(function(type) {
        rez = rez + "<th>" + type + "</th>"
      });
      rez = rez + "<tr>" 
      Object.keys(acctData).forEach(function(type) {
          rez = rez + "<td style='vertical-align: top'><table class='table_will'>" + acctData[type].innerHTML + "</table></td>"
      });
      thisDiv.innerHTML = rez +"</tr></table>";
      mainDiv.appendChild(thisDiv);
  });
}
