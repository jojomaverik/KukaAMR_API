const jobsTable = document.getElementById('outputTableJobsQuery');

var spsOnlineID = null;
var spsOnlineTask= null;

const appFetchJobs = async (url, body) => {
    try {
        const response = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
        const data = await response.json()
        // console.log(data)
        return data;
    } catch (error) {
        // console.error('Error:', error);
        class errorType {
            constructor(message) {
                this.message = message;
            }
        }
        let data = new errorType(error.message);
        return data
    }
}

function onlineJobs() {
    var checkOnlineJobs = document.getElementById('checkOnlineJobs')
    var intervalJobs1 = document.getElementById('intervalJobs1').value
    showJobs();
    if (checkOnlineJobs.checked) {
        spsOnlineID = setInterval(function () {
            showJobs();
        }, intervalJobs1 * 1000);
    } else {
        clearInterval(spsOnlineID);
    }
}

function getValuesJobQueryForm() {
    var value = {
        workflowNameJobs1: document.getElementById('workflowNameJobs1').value,
        workflowCodeJobs1: document.getElementById('workflowCodeJobs1').value,
        workflowIdJobs1: document.getElementById('workflowIdJobs1').value,
        jobCodeJobs1: document.getElementById('jobCodeJobs1').value,
        robotIdJobs1: document.getElementById('robotIdJobs1').value,
        containerCodeJobs1: document.getElementById('containerCodeJobs1').value,
        limitJobs1: document.getElementById('limitJobs1').value
    }
    return value;
}

async function showJobs() {
    var value = getValuesJobQueryForm();
    var labelResponsejobQuery = document.getElementById("labelResponseContainer");
    const url = get_URL("jobQuery");
    const body = {
        workflowId: value.workflowIdJobs1,
        containerCode: value.containerCodeJobs1,
        createUsername: "",
        jobCode: value.jobCodeJobs1,
        limit: value.limitJobs1,
        maps: [],
        robotId: value.robotIdJobs1,
        sourceValue: "",
        status: "",
        targetCellCode: "",
        workflowCode: value.workflowCodeJobs1,
        workflowName: value.workflowNameJobs1
    }

    const responseData = await appFetchJobs(url, body)
    if (responseData.data && responseData.data.length > 0) {
        // console.log("Jobs Online lectura realizada ");
    }

    jobsTable.innerHTML = ''; // Limpiar la tabla antes de insertar nuevos datos

    if (responseData.data && responseData.data.length > 0) {
        let body = ""
        body += "<tr><th style='cursor:pointer; background-color: rgb(60, 61, 61);'>jobCode</th>" 
        body += "<th style='cursor:pointer;'>workflowId</th>"
        body += "<th style='cursor:pointer;'>container<br>Code</th>"
        body += "<th style='cursor:pointer;'>robotId</th>"
        body += "<th style='cursor:pointer;'>status</th>"
        body += "<th style='cursor:pointer;'>workflow<br>Name</th>"
        body += "<th style='cursor:pointer;'th>workflowCode</th>"
        body += "<th style='cursor:pointer;'>workflow<br>Priority</th>"
        body += "<th style='cursor:pointer;'>begin/target<br>CellCode</th>"
        body += "<th style='cursor:pointer;'>begin/target<br>CellCodeForeign</th>"
        body += "<th style='cursor:pointer;'>completeTime</th>"
        body += "<th style='cursor:pointer;'>spend<br>Time</th>"
        body += "<th style='cursor:pointer;'>source</th>"
        body += "<th style='background-color: rgb(60, 61, 61);'>Command</th>"
        body += "</tr>"
        for (var i = 0; i < responseData.data.length; i++) {
            body += `<tr id=" ${i+1}"><td style='cursor:pointer; background-color: rgb(8, 157, 216);'>` + responseData.data[i].jobCode
            body += "</td><td>" + responseData.data[i].workflowId
            body += "</td><td>" + responseData.data[i].containerCode
            body += "</td><td>" + responseData.data[i].robotId
            body += "</td><td>" + responseData.data[i].status
            body += "</td><td>" + responseData.data[i].workflowName
            body += "</td><td>" + responseData.data[i].workflowCode
            body += "</td><td>" + responseData.data[i].workflowPriority
            body += "</td><td>" + responseData.data[i].beginCellCode + " <br> " + responseData.data[i].targetCellCode
            body += "</td><td>" + responseData.data[i].beginCellCodeForeign + " <br> " + responseData.data[i].targetCellCodeForeign
            body += "</td><td>" + responseData.data[i].completeTime
            body += "</td><td>" + responseData.data[i].spendTime
            body += "</td><td>" + responseData.data[i].source
            body += `</td><td id="celdaCancel${i+1}" style='cursor:pointer; background-color: rgb(8, 157, 216);'>CANCEL ❌` //<button id="outContainer${i}" onclick="outContainer(this,${i},1)">
            body += `<br><select name="cancelMissionType" id="cancelMissionType${i+1}">
                        <option value="FORCE">FORCE</option>
                        <option value="REDIRECT_START">REDIRECT_START</option>
                        <option value="REDIRECT_END">REDIRECT_END</option>
                    </select></td>`
            body += "</td></tr>"
        }

        jobsTable.innerHTML = body


    } else {
        const row = jobsTable.insertRow();
        const cell = row.insertCell(0);
        cell.colSpan = 2;
        cell.textContent = 'Error.   ' + responseData.message;
    }
    labelResponsejobQuery.innerText = "__________________________Response___ContainerQuery___Succes:" + responseData.success + "________________________________________________";

}

function onlineTask() {
    var checkOnlineTask = document.getElementById('checkOnlineTask')
    var jobCode1= document.getElementById('jobCode1').value;

    if (spsOnlineTask>0){
        clearInterval(spsOnlineTask);
    }

    if (jobCode1!="") showTask(document.getElementById('jobCode1').value);

    if ((checkOnlineTask.checked) && (jobCode1!="")) {
        spsOnlineTask = setInterval(function () {
            showTask(document.getElementById('jobCode1').value);
        }, 2 * 1000);
    } else if (spsOnlineTask>0){
        clearInterval(spsOnlineTask);
    }
}


async function showTask(jobCode) {
    var outputTableTaskQuery= document.getElementById('outputTableTaskQuery');
    const responseData = await appFetchTask(jobCode)
    if (responseData.data && responseData.data.length > 0) {
        // console.log("Jobs Online lectura realizada ");
    }

    outputTableTaskQuery.innerHTML = ''; // Limpiar la tabla antes de insertar nuevos datos

    if (responseData.data && responseData.data.length > 0) {
        let body = ""
        body += "<tr>" 
        body += "<th>id</th>"
        body += "<th>orgId</th>"
        body += "<th>requestId</th>"
        body += "<th>taskCode</th>"
        body += "<th>taskType</th>"
        body += "<th>viewBoardType</th>"
        body += "<th>robotCodeList</th>"
        body += "<th>robotType</th>"
        body += "<th>robotModelList</th>"
        body += "<th>priority</th>"
        body += "<th>containerCode</th>"
        body += "<th>containerOperation</th>"
        body += "<th>containerModelCode</th>"
        body += "<th>templateCode</th>"
        body += "<th>lastTaskCode</th>"
        body += "<th>robotCode</th>"
        body += "<th>idleNode</th>"
        body += "<th>lockRobot</th>"
        body += "<th>state</th>"
        body += "<th>createTime</th>"
        body += "<th>lastUpdateTime</th>"
        body += "</tr>"
        for (var i = 0; i < responseData.data.length; i++) {
            body += `<tr><td>` + responseData.data[i].id
            body += "</td><td>" + responseData.data[i].orgId
            body += "</td><td>" + responseData.data[i].requestId
            body += "</td><td>" + responseData.data[i].taskCode
            body += "</td><td>" + responseData.data[i].taskType
            body += "</td><td>" + responseData.data[i].viewBoardType
            body += "</td><td>" + responseData.data[i].robotCodeList
            body += "</td><td>" + responseData.data[i].robotType
            body += "</td><td>" + responseData.data[i].robotModelList
            body += "</td><td>" + responseData.data[i].priority
            body += "</td><td>" + responseData.data[i].containerCode
            body += "</td><td>" + responseData.data[i].containerOperation
            body += "</td><td>" + responseData.data[i].containerModelCode
            body += "</td><td>" + responseData.data[i].templateCode
            body += "</td><td>" + responseData.data[i].lastTaskCode
            body += "</td><td>" + responseData.data[i].robotCode
            body += "</td><td>" + responseData.data[i].idleNode
            body += "</td><td>" + responseData.data[i].lockRobot
            body += "</td><td>" + responseData.data[i].state
            body += "</td><td>" + responseData.data[i].createTime
            body += "</td><td>" + responseData.data[i].lastUpdateTime
            body += "</td></tr>"
        }

        outputTableTaskQuery.innerHTML = body
        if (responseData.data[0].state=='DONE') {
            if (spsOnlineTask>0){
                clearInterval(spsOnlineTask);
            }
            console.log("Task finalizada");
        }

    } else {
        const row = outputTableTaskQuery.insertRow();
        const cell = row.insertCell(0);
        cell.colSpan = 2;
        cell.textContent = 'Error.   ' + responseData.message;
        if (spsOnlineTask>0){
            clearInterval(spsOnlineTask);
            console.log("Task finalizada");
        }
    }

}


const appFetchTask = async (task) => {
    // const body = {
    //     taskCode: task
    // };
    const body = "taskCode="+task;
    
    try {
        const url = 'http://' + kmresIPElement.value + ':10870/interfaces/api/maintain/queryTaskInfo';
        const response = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: body })
        const data = await response.json()
        console.log(data)
        return data;
    } catch (error) {
        // console.error('Error:', error);
        class errorType {
            constructor(message) {
                this.message = message;
            }
        }
        let data = new errorType(error.message);
        return data
    }
}




function sortTable(table, sortColumn) {
    // get the data from the table cells
    const tableBody = table.querySelector('tbody')
    const tableData = table2data(tableBody);
    // sort the extracted data
    tableData.sort((b, a) => {
        if (a[sortColumn] > b[sortColumn]) {
            return 1;
        }
        return -1;
    })
    // put the sorted data back into the table
    data2table(tableBody, tableData);
}

// this function gets data from the rows and cells 
// within an html tbody element
function table2data(tableBody) {
    const tableData = []; // create the array that'll hold the data rows
    tableBody.querySelectorAll('tr')
        .forEach(row => {  // for each table row...
            const rowData = [];  // make an array for that row
            row.querySelectorAll('td')  // for each cell in that row
                .forEach(cell => {
                    rowData.push(cell.innerText);  // add it to the row data
                })
            tableData.push(rowData);  // add the full row to the table data 
        });
    const tableData2 = []; // create the array that'll hold the data rows
    for (i = 1; i < tableData.length; i++) {
        tableData2.push(tableData[i]);
    }

    return tableData;
}

// this function puts data into an html tbody element
function data2table(tableBody, tableData) {
    tableBody.querySelectorAll('tr') // for each table row...
        .forEach((row, i) => {
            // const rowData = tableData[i]; // get the array for the row data
            row.querySelectorAll('td')  // for each table cell ...
                .forEach((cell, j) => {
                    const rowData = tableData[i - 1]; // get the array for the row data
                    cell.innerText = rowData[j]; // put the appropriate array element into the cell
                })
        });
}



jobsTable.addEventListener('click', async (event) => {
    var targetElement = event.target;
    var fila = targetElement.parentNode;
    var nColumna = targetElement.cellIndex;
    var esCabecera = (targetElement.tagName == 'TH');
    var esFila = targetElement.parentElement.tagName === 'TR';
    var esCelda = targetElement.tagName === 'TD';
    var columnaValida = (nColumna == "13") || (nColumna == "0") //|| (nColumna == "9") || (nColumna == "10")
    if (esFila && esCelda && columnaValida) {
        jobCode = fila.getElementsByTagName("td")[0].innerText;
    } else {
        if (!esCabecera) return;
        if (!nColumna>12) return;
        // sortTable(jobsTable, nColumna);
        return;
    };


    if (nColumna == "0") {
        console.log(`columna == "0"`)
        var jobCode1= document.getElementById('jobCode1');
        jobCode1.value=jobCode;
        
        onlineTask()
        // showTask(jobCode)
    }

    if (nColumna == "8") {
        console.log(`columna == "8"`)
    }

    if (nColumna == "13") {
        celdaBotonID = fila.getElementsByTagName("td")[13].id;
        celdaBoton= document.getElementById(celdaBotonID);
        celdaBoton.style="cursor:pointer; background-color: rgb(61, 133, 64);";
        var stationNumber = celdaBotonID.slice("celdacancel".length, celdaBotonID.length);
        cancelMission(jobCode,stationNumber);
        await delay(1);
        celdaBoton.style="cursor:pointer; background-color: rgb(8, 157, 216);"
    }


});

async function cancelMission(jobCode,stationNumber) {
    var now = new Date();
    var time = now.getMilliseconds() + " " + now.getFullYear() + "-" + now.getMonth() + "-" + now.getDate() + " " + now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds();
    var missionNumber=jobCode.slice(jobCode.indexOf("--")+2, jobCode.indexOf("-",jobCode.indexOf("--")+2));
    
    const cancelModel = document.getElementById(`cancelMissionType${stationNumber}`); //FORCE REDIRECT_START REDIRECT_END
    var requestId = "RCancel--" + missionNumber + "-" + time

    const url = get_URL("missionCancel");
    const body = {
        cancelMode: cancelModel.value,
        containerCode: "",
        missionCode: jobCode,
        position: "",
        reason: "UserAPILab acction",
        requestId: requestId
    }


    const responseData = await appFetchJobs(url, body)
    if (responseData.message!=null){
        if (responseData.success==false){
            window.alert(" Cancel Mission response: " + responseData.message);
        }
    }
    console.log("Cancel Mission success:" + responseData.success);

}
