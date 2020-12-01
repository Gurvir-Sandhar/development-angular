function addRow() {

  var firstName = document.getElementById("firstname");
  var lastName = document.getElementById("lastname");
  var team = document.getElementById("team");
  var hereToSee = document.getElementById("advisor");
  var meetTime = document.getElementById("Time");
  var meetDate = document.getElementById("Date");
  var meetDescription = document.getElementById("Description");
  var meetProgress = document.getElementById("Progress");
  var table = document.getElementById("myTableData");

  var rowCount = table.rows.length;
  var row = table.insertRow(rowCount);

  row.insertCell(0).innerHTML= '<input type="button" value = "Delete" onClick="Javacsript:deleteRow(this)">';
  row.insertCell(1).innerHTML= firstName.value;
  row.insertCell(2).innerHTML= lastName.value;
  row.insertCell(3).innerHTML= team.value;
  row.insertCell(4).innerHTML= hereToSee.value;
  row.insertCell(5).innerHTML= meetTime.value;
  row.insertCell(6).innerHTML= meetDate.value;
  row.insertCell(7).innerHTML= meetDescription.value;
  row.insertCell(8).innerHTML= meetProgress.value;

}

function deleteRow(obj) {

  var index = obj.parentNode.parentNode.rowIndex;
  var table = document.getElementById("myTableData");
  table.deleteRow(index);

}

function addTable() {

  var myTableDiv = document.getElementById("myDynamicTable");

  var table = document.createElement('TABLE');
  table.border='1';

  var tableBody = document.createElement('TBODY');
  table.appendChild(tableBody);

  for (var i=0; i<3; i++){
    var tr = document.createElement('TR');
    tableBody.appendChild(tr);

    for (var j=0; j<4; j++){
      var td = document.createElement('TD');
      td.width='75';
      td.appendChild(document.createTextNode("Cell " + i + "," + j));
      tr.appendChild(td);
    }
  }
  myTableDiv.appendChild(table);

}

function load() {

  console.log("Page load finished");

}

function toggleMenu() {
  var menu = document.getElementById("taskForm");
  var buttonText = document.getElementById("addTask")
  if(menu.style.display === "none"){
    menu.style.display = "block";
    buttonText.innerHTML = "Nevermind!"
  } else {
    menu.style.display = "none";
    buttonText.innerHTML = "Add a meeting!"
  }

}
