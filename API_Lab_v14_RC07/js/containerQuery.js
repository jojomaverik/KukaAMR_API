const kmresIP = document.getElementById('kmresIP').value;
const containerTable = document.getElementById('outputTableContainer');
var containerQuery = null;
var spsOnlineID = [];

const appFetchContainerjs = async (url, data, method) => {
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

function show_hide(botones, verTodos, verContainer, crearContainer, modificarContainer, borrarContainer) {

    //Area para ver Botones
    //document.getElementById('containerCode').style.display = botones;
    // document.getElementById('labelContainer').style.display = botones;
    // document.getElementById('filtrarContainerMenu').style.display = botones;
    // document.getElementById('filtrarContenedores').style.display = botones;
    // document.getElementById("crearContainer").style.display = botones;
    // document.getElementById('borrarContainer').style.display = botones;
    // document.getElementById('modificarContainer').style.display = botones;

    // Area para Ver Todos
    // const containerTable = document.getElementById('container-table');
    // if (containerTable) {
    //     containerTable.style.display = verTodos;
    // }

    //Area para ver Container
    const spanQuery = document.getElementById('spanQuery');
    if (spanQuery) {
        spanQuery.style.display = verContainer;
    }

    // Area para Crear Container
    const containerFormInsert = document.getElementById('spanInsertCreate');
    if (containerFormInsert) {
        containerFormInsert.style.display = crearContainer;
    }

    // Area para Modificar Container
    const spanUpdate = document.getElementById('spanUpdate');
    if (spanUpdate) {
        spanUpdate.style.display = modificarContainer;
    }

    // Area para Borrar Container 
    const containerFormRemove = document.getElementById('spanRemoveDelete');
    if (containerFormRemove) {
        containerFormRemove.style.display = borrarContainer;
    }


}

function reset() {
    show_hide('none', 'none', 'block', 'none', 'none', 'none'); //(botones, verTodos, verContainer, crearContainer, modificarContainer, borrarContainer) 
    document.getElementById("containerCode0").value = "";
    document.getElementById("nodeCode0").value = "";
    document.getElementById("containerModelCode0").value = "";
    document.getElementById("containerCode0").value = "";
    document.getElementById("areaCode0").value = "";
    document.getElementById("emptyFullStatus0").value = "";
    document.getElementById("inMapStatus0").value = "";
    document.getElementById("mapCode0").value = "";
    document.getElementById("districtCode0").value = "";
    showContainer();
    showContainer();
    showContainer();
    // const outputTable = document.getElementById('outputTableContainer').getElementsByTagName('tbody')[0];
    // outputTable.innerHTML = ''; // Limpiar la tabla antes de insertar nuevos datos
}

function regresar() {
    show_hide('none', 'none', 'block', 'none', 'none', 'none'); //(botones, verTodos, verContainer, crearContainer, modificarContainer, borrarContainer) 
    document.getElementById("containerCode0").value = "";
    document.getElementById("nodeCode0").value = "";
    document.getElementById("containerModelCode0").value = "";
    document.getElementById("containerCode0").value = "";
    document.getElementById("areaCode0").value = "";
    document.getElementById("emptyFullStatus0").value = "";
    showContainer();

    // const outputTable = document.getElementById('outputTableContainer').getElementsByTagName('tbody')[0];
    // outputTable.innerHTML = ''; // Limpiar la tabla antes de insertar nuevos datos
}


function getUrlEndPoint(endpoint) {
    const url = 'http://' + document.getElementById('kmresIP').value + ':10870/interfaces/api/amr/' + endpoint;
    return url;
}

async function getContainerModels() {
    // document.getElementById('infoContainer').addEventListener('click', () => {
    const url = getUrlEndPoint("queryAllContainerModelCode");
    const body = "";
    var method = "GET";

    try {
        var responseData = await appFetchContainerjs(url, body, method);
        if (responseData.success) {
            var containerModelCode2 = document.getElementById('containerModelCode2');
            var size = containerModelCode2.length
            if (size == 1) {
                for (var i = 0; i < size; i++) {
                    containerModelCode2.remove(0);
                }
                for (var i = 0; i < responseData.data.length; i++) {
                    const option = document.createElement('option');
                    option.value = responseData.data[i];
                    option.text = responseData.data[i];
                    containerModelCode2.appendChild(option);
                }
            }
            var containerModelCode0 = document.getElementById('containerModelCode0');
            size = containerModelCode0.length
            if (size == 1) {
                const option = document.createElement('option');
                option.value = "";
                option.text = "";
                containerModelCode0.appendChild(option);
                for (var i = 0; i < size; i++) {
                    containerModelCode0.remove(0);
                }
                for (var i = 0; i < responseData.data.length; i++) {
                    const option = document.createElement('option');
                    option.value = responseData.data[i];
                    option.text = responseData.data[i];
                    containerModelCode0.appendChild(option);
                }

            }
        }
    } catch (error) {
        console.error('Error:', error);
        // const outputTable = document.getElementById('outputTableModels').getElementsByTagName('tbody')[0];
        // outputTable.innerHTML = '<tr><td colspan="2">Error: ' + error + '</td></tr>';
    };
}

async function getAreas() {
    // document.getElementById('infoContainer').addEventListener('click', () => {
    const url = getUrlEndPoint("areaQuery");
    const body = "";
    var method = "GET";

    var responseData = await appFetchContainerjs(url, body, method);
    try {
        // console.log('Respuesta del servidor:', responseData); // Verificar la respuesta del servidor
        var containerModelCode = document.getElementById('areaCode0');
        var size = containerModelCode.length
        if (size > 1) return;
        for (var i = 0; i < size; i++) {
            containerModelCode.remove(0);
        }
        const option = document.createElement('option');
        option.value = "";
        option.text = "";
        containerModelCode.appendChild(option);
        for (var i = 0; i < responseData.data.length; i++) {
            const option = document.createElement('option');
            option.value = responseData.data[i].areaCode;
            option.text = responseData.data[i].areaCode;
            containerModelCode.appendChild(option);
        }

    } catch (error) {
        console.error('Error:', error);
        // const outputTable = document.getElementById('outputTableModels').getElementsByTagName('tbody')[0];
        // outputTable.innerHTML = '<tr><td colspan="2">Error: ' + error + '</td></tr>';
    };
}

function onlineContainer() {
    var checkOnline = document.getElementById('checkOnlineContainer')
    var interval = document.getElementById('intervalQueryContainer1').value
    showContainer();
    if (checkOnline.checked) {
        spsOnlineID = setInterval(function () {
            showContainer();
        }, interval * 1000);
    } else {
        clearInterval(spsOnlineID);
    }
}

async function showContainer() {
    getAreas();
    getContainerModels();
    // document.getElementById('infoContainer').addEventListener('click', () => {
    var labelResponse = document.getElementById("labelResponseContainer");
    const containerCode = document.getElementById('containerCode0').value;
    const nodeCode = document.getElementById('nodeCode0').value;
    const containerModelCode = document.getElementById('containerModelCode0').value;
    const areaCode = document.getElementById('areaCode0').value;
    const mapCode = document.getElementById('mapCode0').value;
    const districtCode = document.getElementById('districtCode0').value;
    const emptyFullStatus = document.getElementById('emptyFullStatus0').value;
    const inMapStatus = document.getElementById('inMapStatus0').value;
    // const QueryContainerType = document.getElementById('QueryContainerType0').value;
    var url = getUrlEndPoint("containerQueryAll");
    // var url = getUrlEndPoint("containerQuery");
    // if (QueryContainerType!="IN/INSERTED"){
    //     url = getUrlEndPoint("containerQueryAll");
    // }

    var method = "POST";
    const body = {
        containerCode: containerCode,
        nodeCode: nodeCode,
        containerModelCode: containerModelCode,
        areaCode: areaCode,
        mapCode: mapCode,
        districtCode: districtCode,
        inMapStatus: inMapStatus,
        emptyFullStatus: emptyFullStatus
        
    };

    const outputTable = document.getElementById('outputTableContainer').getElementsByTagName('tbody')[0];
    outputTable.innerHTML = ''; // Limpiar la tabla antes de insertar nuevos datos

    var responseData = await appFetchContainerjs(url, body, method)

    if (responseData.data && responseData.data.length > 0) {
        let body = ""
        body += "<tr><th data-type='string' style='cursor:pointer; background-color:rgb(60, 61, 61);'>containerCode</th>"
        body += "<th data-type='string' style='cursor:pointer'>nodeCode</th>"
        body += "<th data-type='string' style='cursor:pointer'>containerModelCode</th>"
        body += "<th data-type='number' style='cursor:pointer'>emptyFullStatus</th>"
        body += "<th data-type='number' style='cursor:pointer'>orientation</th>"
        body += "<th data-type='number' style='cursor:pointer'>inMapStatus</th>"
        body += "<th data-type='number' style='cursor:pointer'>isCarry</th>"
        body += "<th data-type='string' style='cursor:pointer'>containerCheckCode</th>"
        body += "<th style='background-color: rgb(15, 231, 87);'>IN</th>"
        body += "<th style='background-color: rgb(60, 61, 61);'>UPDATE</th>"
        body += "<th style='background-color: rgb(230, 27, 8);'>OUT</th>"
        body += "</tr>"
        for (var i = 0; i < responseData.data.length; i++) {
            body += "<tr><td style='cursor:pointer; background-color: rgb(8, 157, 216);'>" + responseData.data[i].containerCode
            body += "</td><td>" + responseData.data[i].nodeCode
            body += "</td><td>" + responseData.data[i].containerModelCode
            body += "</td><td>" + responseData.data[i].emptyFullStatus
            body += "</td><td>" + responseData.data[i].orientation
            body += "</td><td>" + responseData.data[i].inMapStatus
            body += "</td><td>" + responseData.data[i].isCarry
            body += "</td><td>" + responseData.data[i].containerCheckCode
            body += `</td><td style='cursor:pointer; background-color: rgb(60, 61, 61);'>🆕⬅️IN ` //<button id="outContainer${i}" onclick="outContainer(this,${i},1)">
            body += `</td><td style='cursor:pointer; background-color: rgb(60, 61, 61);'>UPDATE 🛠️` //<button id="outContainer${i}" onclick="outContainer(this,${i},2)">
            body += `</td><td style='cursor:pointer; background-color: rgb(60, 61, 61);'>OUT ➡️🚮` //<button id="outContainer${i}" onclick="outContainer(this,${i},3)">
            body += "</td></tr>"
        }

        document.getElementById('outputTableContainer').innerHTML = body


    } else {
        const row = outputTable.insertRow();
        const cell = row.insertCell(0);
        cell.colSpan = 2;
        cell.textContent = 'Error.   ' + responseData.message;
    }
    labelResponse.innerText = "__________________________Response___ContainerQuery___Succes:" + responseData.success + "________________________________________________";
    // });	
}

async function outContainer(obj, i, optContainer) {
    var celdas = obj.parentNode.parentNode;
    var contenedor = celdas.getElementsByTagName("td")[0].innerText;
    console.log("contenedor " + i + " contenedor:" + contenedor);


    var containerCode = document.getElementById('containerCode0').value = celdas.getElementsByTagName("td")[0].innerText;
    var nodeCode = document.getElementById('nodeCode0').value = celdas.getElementsByTagName("td")[1].innerText;
    var containerModelCode = document.getElementById('containerModelCode0').value = celdas.getElementsByTagName("td")[2].innerText;
    var emptyFullStatus = document.getElementById('emptyFullStatus0').value = celdas.getElementsByTagName("td")[3].innerText;
    var orientation = celdas.getElementsByTagName("td")[4].innerText;
    var inMapStatus = celdas.getElementsByTagName("td")[5].innerText;
    var isCarry = celdas.getElementsByTagName("td")[6].innerText;
    var containerCheckCode = celdas.getElementsByTagName("td")[7].innerText;
    await showContainer();

    switch (optContainer) {
        case 1:
            show_hide('none', 'none', 'none', 'inline-block', 'none', 'none'); //(botones, verTodos, verContainer, insertContainer, modificarContainer, borrarContainer) 
            insertContainerMenu(containerCode, nodeCode, containerModelCode, orientation);
            break;
        case 2:
            show_hide('none', 'none', 'none', 'none', 'inline-block', 'none'); //(botones, verTodos, verContainer, insertContainer, modificarContainer, borrarContainer) 
            modificarContaineMenu(containerCode, nodeCode, emptyFullStatus);
            break;
        case 3:
            show_hide('none', 'none', 'none', 'none', 'none', 'inline-block'); //(botones, verTodos, verContainer, insertContainer, modificarContainer, borrarContainer) 
            borrarContainerMenu(containerCode, nodeCode);
            break;
        default:
            //Declaraciones ejecutadas cuando ninguno de los valores coincide con el valor de la expresión
            break;
    }
}

function insertContainerMenu(containerCode, nodeCode, containerModelCode, orientation) {
    // document.getElementById('containerCode2').value=containerCode;
    // document.getElementById('containerModelCode2').value = containerModelCode;
    document.getElementById('position2').value = nodeCode
    document.getElementById('enterOrientation2').value = orientation


}

async function insertContainer() {
    // document.getElementById('insertContainer').addEventListener('click', () => {

    var labelResponse = document.getElementById("labelResponseContainer");
    const containerCode = document.getElementById('containerCode2').value;
    const containerModelCode = document.getElementById('containerModelCode2').value;
    const containerType = document.getElementById('containerType2').value;
    const enterOrientation = document.getElementById('enterOrientation2').value;
    const isNew = document.getElementById('isNew2').value;
    const position = document.getElementById('position2').value;
    const url = getUrlEndPoint("containerIn");
    var method = "POST";
    const data = {
        containerCode: containerCode,
        containerModelCode: containerModelCode,
        containerType: containerType,
        enterOrientation: enterOrientation,
        isNew: isNew,
        position: position,
        requestId: "request" + new Date().getTime()
    };
    const outputTable = document.getElementById('outputTableContainer').getElementsByTagName('tbody')[0];
    outputTable.innerHTML = ''; // Limpiar la tabla antes de insertar nuevos datos
    labelResponse.innerText = "__________________________Response___insertContainer________________________________________________";

    try {
        var responseData = await appFetchContainerjs(url, data, method);
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
        document.getElementById('outputTableContainer').innerHTML = body
    } catch (error) {
        console.error('Error:', error);
        outputTable.innerHTML = '<tr><td colspan="2">Error: ' + error + '</td></tr>';
    };
};

function modificarContaineMenu(containerCode, nodeCode, emptyFullStatus) {
    // document.getElementById('containerCode2').value=containerCode;
    document.getElementById('containerCode3').value = containerCode;
    document.getElementById('containerType3').value = "Tray(AMR)";
    document.getElementById('originPosition3').value = nodeCode;
    document.getElementById('targetPosition3').value = nodeCode;
    document.getElementById('emptyStatus3').value = emptyFullStatus;
    document.getElementById('reason3').value = "";
}

async function updateContainer() {
    // document.getElementById('updateContainer').addEventListener('click', () => {
    var labelResponse = document.getElementById("labelResponseContainer");
    const containerCode = document.getElementById('containerCode3').value;
    const containerType = document.getElementById('containerType3').value;
    const emptyStatus = document.getElementById('emptyStatus3').value;
    var emptyStatusValue = emptyStatus
    const originPosition = document.getElementById('originPosition3').value;
    const reason = document.getElementById('reason3').value;
    const targetPosition = document.getElementById('targetPosition3').value;
    const kmresIP = document.getElementById('kmresIP').value;
    const url = 'http://' + kmresIP + ':10870/interfaces/api/amr/updateContainer'
    var method = "POST";
    if (emptyStatusValue == "0") {
        emptyStatusValue = "EMPTY"
    }
    const data = {
        containerCode: containerCode,
        containerType: containerType,
        emptyStatus: emptyStatusValue,
        originPosition: originPosition,
        reason: reason,
        requestId: "request" + new Date().getTime(),
        targetPosition: targetPosition
    };
    labelResponse.innerText = "__________________________Response___UpdateContainer________________________________________________";
    const outputTable = document.getElementById('outputTableContainer').getElementsByTagName('tbody')[0];
    outputTable.innerHTML = ''; // Limpiar la tabla antes de insertar nuevos datos
    try {
        var responseData = await appFetchContainerjs(url, data, method);
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
        document.getElementById('outputTableContainer').innerHTML = body
        document.getElementById('containerCode0').value = containerCode;
        document.getElementById('nodeCode0').value = "";
        document.getElementById('containerModelCode0').value = "";
        document.getElementById('emptyFullStatus0').value = "";
        showContainer();
        modificarContaineMenu(containerCode, targetPosition, emptyStatus);

    } catch (error) {
        console.error('Error:', error);
        outputTable.innerHTML = '<tr><td colspan="2">Error: ' + error + '</td></tr>';
    };
};

function borrarContainerMenu(containerCode, nodeCode) {
    document.getElementById('containerCode1').value = containerCode;
    document.getElementById('containerType1').value = "Tray(AMR)";
    document.getElementById('position1').value = nodeCode;
}

async function removeContainer() {
    // document.getElementById('removeContainer').addEventListener('click', () => {
    var labelResponse = document.getElementById("labelResponseContainer");
    const containerCode = document.getElementById('containerCode1').value;
    const containerType = document.getElementById('containerType1').value;
    const isDelete = document.getElementById('isDelete1').value;
    const position = document.getElementById('position1').value;
    const kmresIP = document.getElementById('kmresIP').value;
    const url = 'http://' + kmresIP + ':10870/interfaces/api/amr/containerOut'
    var method = "POST";
    const data = {
        containerCode: containerCode,
        containerType: containerType,
        isDelete: isDelete,
        position: position,
        requestId: "request" + new Date().getTime()
    };
    labelResponse.innerText = "__________________________Response___RemoveContainer________________________________________________";
    const outputTable = document.getElementById('outputTableContainer').getElementsByTagName('tbody')[0];
    outputTable.innerHTML = ''; // Limpiar la tabla antes de insertar nuevos datos

    try {
        var responseData = await appFetchContainerjs(url, data, method)

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
        document.getElementById('outputTableContainer').innerHTML = body
    } catch (error) {
        console.error('Error:', error);
        outputTable.innerHTML = '<tr><td colspan="2">Error: ' + error + '</td></tr>';
    };
};


containerTable.addEventListener('click', async (event) => {
    const containerDetails = document.getElementById('containerDetails');
    var targetElement = event.target;
    var favDialog = document.getElementById("favDialog");
    var fila = targetElement.parentNode;
    var nColumna = targetElement.cellIndex;
    var containerCode = "";
    var nodeCode = "";
    var containerModelCode = "";
    var emptyFullStatus = "";
    var orientation = "";
    var inMapStatus = "";
    var isCarry = "";
    var containerCheckCode = "";

    var esCabecera = (targetElement.tagName == 'TH');
    var esFila = (targetElement.parentElement.tagName == 'TR');
    var esCelda = (targetElement.tagName == 'TD');

    var contenedor = null;
    var columnaValida = (nColumna == "0") || (nColumna == "8") || (nColumna == "9") || (nColumna == "10")
    if (esFila && esCelda && columnaValida) {
        containerCode = document.getElementById('containerCode0').value = fila.getElementsByTagName("td")[0].innerText;
        nodeCode = document.getElementById('nodeCode0').value = fila.getElementsByTagName("td")[1].innerText;
        containerModelCode = document.getElementById('containerModelCode0').value = fila.getElementsByTagName("td")[2].innerText;
        containerModelCode = document.getElementById('containerModelCode2').value = fila.getElementsByTagName("td")[2].innerText;
        emptyFullStatus = document.getElementById('emptyFullStatus0').value = fila.getElementsByTagName("td")[3].innerText;
        orientation = fila.getElementsByTagName("td")[4].innerText;
        inMapStatus = fila.getElementsByTagName("td")[5].innerText;
        isCarry = fila.getElementsByTagName("td")[6].innerText;
        containerCheckCode = fila.getElementsByTagName("td")[7].innerText;
        await showContainer();
    } else {
        if (!esCabecera) return;
        await sortTable(containerTable, nColumna)
        return;
    };


    if (nColumna == "0") {

        show_hide('none', 'none', 'inline-block', 'none', 'none', 'none'); //(botones, verTodos, verContainer, crearContainer, modificarContainer, borrarContainer)    
    }

    if (nColumna == "8") {
        show_hide('none', 'none', 'none', 'inline-block', 'none', 'none'); //(botones, verTodos, verContainer, insertContainer, modificarContainer, borrarContainer) 
        insertContainerMenu(containerCode, nodeCode, containerModelCode, orientation);
    }

    if (nColumna == "9") {
        contenedor = document.getElementById('containerCode0').value = fila.getElementsByTagName("td")[0].innerText;
        show_hide('none', 'none', 'none', 'none', 'inline-block', 'none'); //(botones, verTodos, verContainer, insertContainer, modificarContainer, borrarContainer) 
        modificarContaineMenu(containerCode, nodeCode, emptyFullStatus);
    }

    if (nColumna == "10") {
        contenedor = document.getElementById('containerCode0').value = fila.getElementsByTagName("td")[0].innerText;
        show_hide('none', 'none', 'none', 'none', 'none', 'inline-block'); //(botones, verTodos, verContainer, insertContainer, modificarContainer, borrarContainer) 
        borrarContainerMenu(containerCode, nodeCode);
    }


});

function sortTable(table, sortColumn) {
    // get the data from the table cells
    const tableBody = table.querySelector('tbody')
    const tableData = table2data(tableBody);
    // sort the extracted data
    tableData.sort((a, b) => {
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




function sortGrid(colNum, type) {
    let tbody = containerTable.querySelector('tbody');

    let rowsArray = Array.from(tbody.rows);

    // compare(a, b) compara dos filas, necesario para ordenar
    let compare;
    type = "string";
    switch (type) {
        case 'number':
            compare = function (rowA, rowB) {
                return rowA.cells[colNum].innerHTML - rowB.cells[colNum].innerHTML;
            };
            break;
        case 'string':
            compare = function (rowA, rowB) {
                return rowA.cells[colNum].innerHTML > rowB.cells[colNum].innerHTML ? 1 : -1;
            };
            break;
    }

    // sort
    rowsArray.sort(compare);

    tbody.append(...rowsArray);
}


function initContainerQuery() {
    getAreas();
    getContainerModels();
}

window.addEventListener('load', initContainerQuery);

