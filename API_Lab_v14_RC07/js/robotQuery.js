const outputTableAMR = document.getElementById('outputTableAMR');
const selectConatiner = document.getElementById("containerCodeAMR5");
const selectmissionType = document.getElementById("missionTypeAMR5");
var spsOnlineID = null;

function geturl(endpoint) {
    const url = 'http://' + document.getElementById('kmresIP').value + ':10870/interfaces/api/amr/' + endpoint;
    return url;
}

const appFetchRobotjs = async (url, data, method) => {
    var response;
    try {
        if (method == 'GET') {
            response = await fetch(url, { method: method, headers: { 'Content-Type': 'application/json' }, })
        } else {
            response = await fetch(url, { method: method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
        }
        const reponseData = await response.json()
        console.log(reponseData)
        return reponseData;
    } catch (error) {
        console.error('Error:', error);
        class errorType {
            constructor(message) {
                this.message = message;
            }
        }
        let reponseData = new errorType(error.message);
        return reponseData
    }
}

function show_hide_AMR_view(botones, verRobots, verSubmision, verMission) {

    const spanRobotQuery = document.getElementById('spanRobotQuery');
    if (spanRobotQuery) {
        spanRobotQuery.style.display = verRobots;
    }

    const spanSubMission = document.getElementById('spanSubMission');
    if (spanSubMission) {
        spanSubMission.style.display = verSubmision;
    }

    // const spanMission = document.getElementById('spanMission');
    // if (spanMission) {
    //     spanMission.style.display = verMission;
    // }

}

// localStorage.setItem('containerCodeBussy', true);
// var ejemplo= localStorage.getItem('Miejemplo');
//Eliminando del local storage
// localStorage.removeItem('Miejemplo');

function resetAMR() {
    document.getElementById("robotIdAMR4").value = "";
    document.getElementById("robotTypeAMR4").value = "";
    document.getElementById("floorNumberAMR4").value = "";
    document.getElementById("mapCodeAMR4").value = "";
    document.getElementById("robotIdAMR5").value = "";
    document.getElementById("floorNumberAMR5").value = "";
    document.getElementById("mapCodeAMR5").value = "";
    document.getElementById("floorNumberAMR4").value = "";
    document.getElementById("mapCodeAMR6").value = "";
    show_hide_AMR_view('none', 'inline-block', 'none', 'none', 'none');
}


async function regresarMenuRobot() {
    resetAMR();
    await showAMR();
    sortTable(outputTableAMR, 0);
}

async function robotQuery() {
    await showAMR();
    sortTable(outputTableAMR, 0);
}

async function getContainerCode2() {
    const url = geturl("containerQuery");
    var method = "POST"; //GET
    //Eliminando del local storage
    // localStorage.removeItem('Miejemplo');
    const data = {
        containerCode: "",
        nodeCode: "",
    };

    try {
        var responseData = await appFetchRobotjs(url, data, method);
        console.log('Respuesta del servidor:', responseData); // Verificar la respuesta del servidor

        if (responseData.data && responseData.data.length > 0) {

            var containerCodeAMR5 = document.getElementById('containerCodeAMR5');
            var size = containerCodeAMR5.length
            for (var i = 0; i < size; i++) {
                containerCodeAMR5.remove(0);
            }
            for (var i = 0; i < responseData.data.length; i++) {
                const option = document.createElement('option');
                option.value = responseData.data[i].containerCode;
                option.text = responseData.data[i].containerCode;
                containerCodeAMR5.appendChild(option);
            }
            containerCodeAMR5.options.item(0).selected = 'selected';
            getContainerNode2(containerCodeAMR5.options.item(0).value);
        }
    } catch (error) {
        console.error('Error:', error);
    };
}


async function getContainerNode2(contenedor) {
    const url = geturl("containerQuery");
    var method = "POST"; //GET
    const data = {
        containerCode: contenedor,
        nodeCode: "",
    };
    try {
        var responseData = await appFetchRobotjs(url, data, method);
        console.log('Respuesta del servidor:', responseData); // Verificar la respuesta del servidor
        if (responseData.data && responseData.data.length > 0) {
            document.getElementById('positionAMR5').value = responseData.data[0].nodeCode
        }
    } catch (error) {
        console.error('Error:', error);
    };
}

async function onlineAMR() {
    var checkOnline = document.getElementById('checkOnlineAMR')
    var interval = document.getElementById('intervalQueryAMR1').value
    await showAMR();
    sortTable(outputTableAMR, 0)
    if (checkOnline.checked) {
        spsOnlineID = setInterval(async function () {
            await showAMR();
            sortTable(outputTableAMR, 0)
        }, interval * 1000);
    } else {
        clearInterval(spsOnlineID);
    }
}



async function showAMR() {
    // getContainerCode();
    var labelResponse = document.getElementById("labelResponseAMR");
    var robotId = document.getElementById('robotIdAMR4').value;
    var robotType = document.getElementById('robotTypeAMR4').value;
    const floorNumber = document.getElementById('floorNumberAMR4').value;
    const mapCode = document.getElementById('mapCodeAMR4').value;
    const kmresIP = document.getElementById('kmresIP').value;
    var method = "POST"; //GET
    const url = 'http://' + kmresIP + ':10870/interfaces/api/amr/robotQuery';
    const data = {
        floorNumber: floorNumber,
        mapCode: mapCode,
        robotId: robotId,
        robotType: robotType
    };
    labelResponse.innerText = "__________________________Response___infoRoborQuery________________________________________________";
    try {
        var responseData = await appFetchRobotjs(url, data, method);
        console.log('Respuesta robotQuery del servidor:', responseData); // Verificar la respuesta del servidor
        // console.log(data)
        const outputTable = document.getElementById('outputTableAMR').getElementsByTagName('tbody')[0];
        outputTable.innerHTML = ''; // Limpiar la tabla antes de insertar nuevos datos

        if (responseData.data && responseData.data.length > 0) {

            let body = ""
            body += "<tr>"
            body += "<th style='cursor:pointer'>Robot ID</th>"
            body += "<th style='cursor:pointer'>Tipo de Robot</th>"
            body += "<th style='cursor:pointer'>buildingCode</th>"
            body += "<th style='cursor:pointer'>Map</th>"
            body += "<th style='cursor:pointer'>Floor</th>"
            body += "<th style='cursor:pointer'>containerCode</th>"
            body += "<th style='cursor:pointer'>status</th>"
            body += "<th style='cursor:pointer'>missionCode</th>"
            body += "<th style='cursor:pointer'>nodeCode</th>"
            body += "<th style='cursor:pointer'>occupyStatus</th>"
            body += "<th style='cursor:pointer'>X/Y</th>"
            body += "</tr>"
            for (var i = 0; i < responseData.data.length; i++) {
                "<tr><td class='link_tabla'><u>"
                body += "<tr><td style='cursor:pointer; background-color: rgb(8, 157, 216);'>" + responseData.data[i].robotId
                body += "</td><td>" + responseData.data[i].robotType
                body += "</td><td>" + responseData.data[i].buildingCode
                body += "</td><td>" + responseData.data[i].mapCode
                body += "</td><td>" + responseData.data[i].floorNumber
                body += "</td><td>" + responseData.data[i].containerCode
                body += "</td><td>" + responseData.data[i].status
                body += "</td><td>" + responseData.data[i].missionCode
                body += "</td><td>" + responseData.data[i].nodeCode
                body += "</td><td>" + responseData.data[i].occupyStatus
                body += "</td><td>" + responseData.data[i].x + " / " + responseData.data[i].y
                body += "</td></tr>"
            }
            document.getElementById('outputTableAMR').innerHTML = body

        } else {
            //const row = outputTable.insertRow();
            const row = outputTable.insertRow();
            const cell = row.insertCell(0);
            cell.colSpan = 2;
            cell.textContent = 'No se encontraron datos del robot.';
        }
    } catch (error) {
        console.error('Error:', error);
        const outputTable = document.getElementById('outputTable').getElementsByTagName('tbody')[0];
        outputTable.innerHTML = '<tr><td colspan="2">Error: ' + error + '</td></tr>';
    };
};

async function StartWorkFlow() {
    // document.getElementById('StartWorkFlow').addEventListener('click', () => {
    var templateCode = document.getElementById('workflow6').value;
    const mapCode = document.getElementById('mapCode6').value;
    const floorNumber = document.getElementById('floorNumber6').value;
    const kmresIP = document.getElementById('kmresIP').value;
    const url = 'http://' + kmresIP + ':10870/interfaces/api/amr/submitMission';
    var method = "POST"; //GET
    var data = {
        orgId: mapCode + "-" + floorNumber + "-",
        requestId: "request" + new Date().getTime(),
        missionCode: "mission" + new Date().getTime(),
        missionType: "RACK_MOVE",
        templateCode: templateCode
    };
    const outputTable = document.getElementById('outputTableMission').getElementsByTagName('tbody')[0];
    outputTable.innerHTML = ''; // Limpiar la tabla antes de insertar nuevos datos
    try {
        var responseData = await appFetchRobotjs(url, data, method);
        console.log('Respuesta del servidor:', responseData); // Verificar la respuesta del servidor
        let body = ""
        body += "<tr><th>data</th>"
        body += "<th>code</th>"
        body += "<th>message</th>"
        body += "<th>success</th>"
        body += "</tr>"
        body += "</td><td>" + responseData.data
        body += "</td><td>" + responseData.code
        body += "</td><td>" + responseData.message
        body += "</td><td>" + responseData.success
        body += "</td></tr>"
        outputTable.innerHTML = body
    } catch (error) {
        console.error('Error:', error);
        alert('Error al ejecutar el script');
    };
};

async function subMission() {
    // document.getElementById('SubMission').addEventListener('click', () => {
    var labelResponse = document.getElementById("labelResponseAMR");
    var robotId = String(document.getElementById('robotIdAMR5').value); //String(document.getElementById('robotId5').value.split(',').map(id => parseInt(id.trim())));
    const missionType = document.getElementById('missionTypeAMR5').value;
    const robotType = document.getElementById('robotTypeAMR5').value;
    const mapCode = document.getElementById('mapCodeAMR5').value;
    const containerCode = document.getElementById('containerCodeAMR5').value;
    const floorNumber = document.getElementById('floorNumberAMR5').value;
    const position = document.getElementById('positionAMR5').value;
    const position2 = document.getElementById('positionAMR25').value;
    const kmresIP = document.getElementById('kmresIP').value;
    const url = 'http://' + kmresIP + ':10870/interfaces/api/amr/submitMission';
    var method = "POST"; //GET
    var data = null;
    var now = new Date();
    var time = now.getMilliseconds() + " " + now.getDate() + "-" + now.getHours() + "-" + now.getMinutes() + "-" + now.getSeconds();
    var requestId = "RM-Form-" + time;
    var missionCode = "M--Form-" + time;
    var putDownRackMove = true;

    if (missionType == "RACK_MOVE") {
        putDownRackMove = false;
        v.destino2 = "";
    }

    const secuencia1 = {
        sequence: 1,
        position: position,
        type: "NODE_POINT",
        putDown: putDownRackMove,
        passStrategy: "AUTO",
    };

    const secuencia2 = {
        sequence: 2,
        position: position2,
        type: "NODE_POINT",
        putDown: true,
        passStrategy: "AUTO",
    };

    const missionData1 = [
        secuencia1,
    ];

    const missionData2 = [
        secuencia1,
        secuencia2
    ];

    if (position2 == "") {
        missionData = missionData1;
    } else {
        missionData = missionData2;
    }

    if (robotId == "") {
        robotId = [];
    } else {
        robotId = [robotId];
    }

    data = {
        orgId: mapCode + "-" + floorNumber + "-",
        requestId: requestId,
        missionCode: missionCode,
        missionType: missionType,
        viewBoardType: "",
        robotModels: [],
        robotIds: robotId,
        robotType: robotType,
        priority: 1,
        containerType: "",
        containerCode: containerCode,
        templateCode: "",
        lockRobotAfterFinish: false,
        unlockRobotId: "",
        unlockMissionCode: "",
        idleNode: "",
        missionData: missionData
    };

    console.log(data);
    const outputTable = document.getElementById('outputTableAMR').getElementsByTagName('tbody')[0];
    outputTable.innerHTML = ''; // Limpiar la tabla antes de insertar nuevos datos

    try {
        var responseData = await appFetchRobotjs(url, data, method);
        console.log('Respuesta del servidor:', responseData); // Verificar la respuesta del servidor
        // labelResponse.innerText="infoRoborQuery_Response:"+JSON.stringify(responseData);
        let body = ""

        body += "<tr><th>data</th>"
        body += "<th>code</th>"
        body += "<th>message</th>"
        body += "<th>success</th>"
        body += "</tr>"
        body += "</td><td>" + responseData.data
        body += "</td><td>" + responseData.code
        body += "</td><td>" + responseData.message
        body += "</td><td>" + responseData.success
        body += "</td></tr>"
        outputTable.innerHTML = body
    } catch (error) {
        console.error('Error al enviar la misión:', error);
        alert('Error al enviar la misión: ' + error);
    };
};


outputTableAMR.addEventListener('click', (event) => {
    const targetElement = event.target;
    var ncolumna = null;
    var celdas = targetElement.parentNode;
    var columna = targetElement.cellIndex;
    var robotId = "";
    var robotType = "";
    var mapCode = "";
    var floorNumber = "";
    var nodeCode = "";
    var position25 = "";
    var containerCodeAMR5 = "";
    var posXposY = "";
    var tdtrth = false;

    var columnaValida = (columna == "0")
    if (targetElement.tagName === 'TD' && targetElement.parentElement.tagName === 'TR' && targetElement.parentElement.tagName !== 'TH' && columnaValida) {
        robotId = document.getElementById('robotIdAMR4').value = robotId = document.getElementById('robotIdAMR5').value = celdas.getElementsByTagName("td")[0].innerText;
        robotType = document.getElementById('robotTypeAMR4').value = celdas.getElementsByTagName("td")[1].innerText;
        mapCode = document.getElementById('mapCodeAMR4').value = document.getElementById('mapCodeAMR5').value = document.getElementById('mapCodeAMR6').value = celdas.getElementsByTagName("td")[3].innerText;
        floorNumber = document.getElementById('floorNumberAMR4').value = document.getElementById('floorNumberAMR5').value = document.getElementById('floorNumberAMR6').value = celdas.getElementsByTagName("td")[4].innerText;
        nodeCode = document.getElementById('positionAMR5').value = document.getElementById('positionAMR25').value = celdas.getElementsByTagName("td")[8].innerText;
        document.getElementById('robotTypeAMR5').value = "LIFT"
        document.getElementById('missionTypeAMR5').value = "MOVE"
        position25 = document.getElementById('positionAMR25')
        containerCodeAMR5 = document.getElementById('containerCodeAMR5')
        position25.readOnly = true;
        position25.className = "readonly"
        containerCodeAMR5.disabled = true
        containerCodeAMR5.className = "readonly"
        posXposY = celdas.getElementsByTagName("td")[10].innerText;
        if (posXposY=="0.0 / 0.0") alert("Robot not in map")
        showAMR();
        show_hide_AMR_view('none', 'none', 'inline-block', 'none');
    } else {
        // return;
        if (event.target.tagName != 'TH') return;

        let th = event.target;
        // si TH, entonces ordena
        // cellIndex es el número de th:
        //   0 para la primera columna
        //   1 para la segunda columna, etc.
        // sortGrid(th.cellIndex, th.dataset.type);
        sortTable(outputTableAMR, th.cellIndex)
    }
});




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



selectConatiner.addEventListener("change", (event) => {
    if (event.target.value == "RACK_MOVE") {
        var nodeCode2 = document.getElementById('positionAMR25')
        nodeCode2.class = false;
    }
    getContainerNode2(event.target.value)
});

selectmissionType.addEventListener("change", (event) => {
    var position25 = document.getElementById('positionAMR25')
    var containerCodeAMR5 = document.getElementById('containerCodeAMR5')
    if (event.target.value == "RACK_MOVE") {
        position25.readOnly = false;
        position25.className = "notreadonly"
        containerCodeAMR5.disabled = false
        containerCodeAMR5.className = "notreadonly"
        getContainerCode2();
    } else {
        position25.readOnly = true;
        position25.className = "readonly"
        containerCodeAMR5.disabled = true
        containerCodeAMR5.className = "readonly"
    }
});
