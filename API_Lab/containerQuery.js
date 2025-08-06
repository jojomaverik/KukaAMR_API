const kmresIP = document.getElementById('kmresIP').value;
const containerTable = document.getElementById('outputTableContainer');
var containerQuery = null;

const appFetch = async (url, body) => {
    try {
        const response = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
        const data = await response.json()
        console.log(data)
        return data;
    } catch (error) {
        console.error('Error:', error);
        class errorType {
            constructor(message) {
                this.message = message;
            }
        }
        let data = new errorType(error.message);
        return data
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


function getURL(endpoint) {
    const url = 'http://' + document.getElementById('kmresIP').value + ':10870/interfaces/api/amr/' + endpoint;
    return url;
}

function getContainerModels() {
    // document.getElementById('infoContainer').addEventListener('click', () => {
    const url = getURL("queryAllContainerModelCode");

    fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
    })
        .then(response => response.json())
        .then(responseData => {
            console.log('Respuesta del servidor:', responseData); // Verificar la respuesta del servidor
            // const outputTable = document.getElementById('outputTableModels').getElementsByTagName('tbody')[0];
            // outputTable.innerHTML = ''; // Limpiar la tabla antes de insertar nuevos datos

            // let body = ""

            // body += "<tr><th>code</th>"
            // body += "<th>message</th>"
            // body += "<th>success</th>"
            // body += "<th>data</th>"
            // body += "</tr>"
            // body += "</td><td>" + responseData.code
            // body += "</td><td>" + responseData.message
            // body += "</td><td>" + responseData.success
            // body += "</td><td>" + responseData.data
            // body += "</td></tr>"
            // document.getElementById('outputTableModels').innerHTML = body


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
        })
        .catch(error => {
            console.error('Error:', error);
            // const outputTable = document.getElementById('outputTableModels').getElementsByTagName('tbody')[0];
            // outputTable.innerHTML = '<tr><td colspan="2">Error: ' + error + '</td></tr>';
        });
}

function getAreas() {
    // document.getElementById('infoContainer').addEventListener('click', () => {
    const url = getURL("areaQuery");

    fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
    })
        .then(response => response.json())
        .then(responseData => {
            console.log('Respuesta del servidor:', responseData); // Verificar la respuesta del servidor
            // const outputTable = document.getElementById('outputTableModels').getElementsByTagName('tbody')[0];
            // outputTable.innerHTML = ''; // Limpiar la tabla antes de insertar nuevos datos

            // let body = ""

            // body += "<tr><th>code</th>"
            // body += "<th>message</th>"
            // body += "<th>success</th>"
            // body += "<th>data</th>"
            // body += "</tr>"
            // body += "</td><td>" + responseData.code
            // body += "</td><td>" + responseData.message
            // body += "</td><td>" + responseData.success
            // body += "</td><td>" + responseData.data
            // body += "</td></tr>"
            // document.getElementById('outputTableModels').innerHTML = body


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

        })
        .catch(error => {
            console.error('Error:', error);
            // const outputTable = document.getElementById('outputTableModels').getElementsByTagName('tbody')[0];
            // outputTable.innerHTML = '<tr><td colspan="2">Error: ' + error + '</td></tr>';
        });
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
    const emptyFullStatus = document.getElementById('emptyFullStatus0').value;
    const url = getURL("containerQuery");
    const body = {
        containerCode: containerCode,
        nodeCode: nodeCode,
        containerModelCode: containerModelCode,
        areaCode: areaCode,
        emptyFullStatus: emptyFullStatus
    };

    const outputTable = document.getElementById('outputTableContainer').getElementsByTagName('tbody')[0];
    outputTable.innerHTML = ''; // Limpiar la tabla antes de insertar nuevos datos

    const responseData = await appFetch(url, body)
    // .catch(error => {
    //     console.error('Error:', error);
    //     outputTable.innerHTML = '<tr><td colspan="2">Error: ' + error + '</td></tr>';
    // });



    // console.log('Respuesta del servidor:', responseData); // Verificar la respuesta del servidor

    if (responseData.data && responseData.data.length > 0) {
        let body = ""
        body += "<tr><th>containerCode</th>"
        body += "<th data-type='string'>nodeCode</th>"
        body += "<th data-type='string'>containerModelCode</th>"
        body += "<th data-type='number'>emptyFullStatus</th>"
        body += "<th data-type='number'>orientation</th>"
        body += "<th data-type='number'>inMapStatus</th>"
        body += "<th data-type='number'>isCarry</th>"
        body += "<th data-type='string'>containerCheckCode</th>"
        body += "<th style='background-color: rgb(15, 231, 87);'><-IN</th>"
        body += "<th style='background-color: rgb(10, 14, 236);'>UPDATE</th>"
        body += "<th style='background-color: rgb(230, 27, 8);'>OUT-></th>"
        body += "</tr>"
        for (var i = 0; i < responseData.data.length; i++) {
            body += "<tr><td class='link_tabla'><u>" + responseData.data[i].containerCode + "<u>"
            body += "</td><td>" + responseData.data[i].nodeCode
            body += "</td><td>" + responseData.data[i].containerModelCode
            body += "</td><td>" + responseData.data[i].emptyFullStatus
            body += "</td><td>" + responseData.data[i].orientation
            body += "</td><td>" + responseData.data[i].inMapStatus
            body += "</td><td>" + responseData.data[i].isCarry
            body += "</td><td>" + responseData.data[i].containerCheckCode
            body += "</td><td class='link_tabla'><u>Input<u>"
            body += "</td><td class='link_tabla'><u>   Update    </u>"
            body += "</td><td class='link_tabla'><u>   Output    </u>"
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


function insertContainerMenu(containerCode, nodeCode, containerModelCode, orientation) {
    // document.getElementById('containerCode2').value=containerCode;
    getContainerModels()
    // document.getElementById('containerModelCode2').value = containerModelCode;
    document.getElementById('position2').value = nodeCode
    document.getElementById('enterOrientation2').value = orientation


}

function insertContainer() {
    // document.getElementById('insertContainer').addEventListener('click', () => {

    var labelResponse = document.getElementById("labelResponseContainer");
    const containerCode = document.getElementById('containerCode2').value;
    const containerModelCode = document.getElementById('containerModelCode2').value;
    const containerType = document.getElementById('containerType2').value;
    const enterOrientation = document.getElementById('enterOrientation2').value;
    const isNew = document.getElementById('isNew2').value;
    const position = document.getElementById('position2').value;
    const url = getURL("containerIn");
    const body = {
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
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    })
        .then(response => response.json())
        .then(responseData => {
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
        })
        .catch(error => {
            console.error('Error:', error);
            outputTable.innerHTML = '<tr><td colspan="2">Error: ' + error + '</td></tr>';
        });
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

function updateContainer() {
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
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(response => response.json())
        .then(responseData => {
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

        })
        .catch(error => {
            console.error('Error:', error);
            outputTable.innerHTML = '<tr><td colspan="2">Error: ' + error + '</td></tr>';
        });
};

function borrarContainerMenu(containerCode, nodeCode) {
    // document.getElementById('containerCode2').value=containerCode;
    document.getElementById('containerCode1').value = containerCode;
    document.getElementById('containerType1').value = "Tray(AMR)";
    document.getElementById('position1').value = nodeCode;
}

function removeContainer() {
    // document.getElementById('removeContainer').addEventListener('click', () => {
    var labelResponse = document.getElementById("labelResponseContainer");
    const containerCode = document.getElementById('containerCode1').value;
    const containerType = document.getElementById('containerType1').value;
    const isDelete = document.getElementById('isDelete1').value;
    const position = document.getElementById('position1').value;
    const kmresIP = document.getElementById('kmresIP').value;
    const url = 'http://' + kmresIP + ':10870/interfaces/api/amr/containerOut'
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

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(response => response.json())
        .then(responseData => {
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
        })
        .catch(error => {
            console.error('Error:', error);
            outputTable.innerHTML = '<tr><td colspan="2">Error: ' + error + '</td></tr>';
        });
};


containerTable.addEventListener('click', (event) => {
    const containerDetails = document.getElementById('containerDetails');
    const targetElement = event.target;
    var ncolumna = null;
    var favDialog = document.getElementById("favDialog");
    var celdas = targetElement.parentNode;
    var columna = targetElement.cellIndex;
    var containerCode = "";
    var nodeCode = "";
    var containerModelCode = "";
    var emptyFullStatus = "";
    var orientation = "";
    var inMapStatus = "";
    var isCarry = "";
    var containerCheckCode = "";
    var tdtrth = false;


    var contenedor = targetElement.cellIndex;
    ncolumna = targetElement.cellIndex;
    var columnaValida = (columna == "0") || (columna == "8") || (columna == "9") || (columna == "10")
    if (targetElement.tagName === 'TD' && targetElement.parentElement.tagName === 'TR' && targetElement.parentElement.tagName !== 'TH' && columnaValida) {
        tdtrth = true;
        containerCode = document.getElementById('containerCode0').value = celdas.getElementsByTagName("td")[0].innerText;
        nodeCode = document.getElementById('nodeCode0').value = celdas.getElementsByTagName("td")[1].innerText;
        containerModelCode = document.getElementById('containerModelCode0').value = celdas.getElementsByTagName("td")[2].innerText;
        emptyFullStatus = document.getElementById('emptyFullStatus0').value = celdas.getElementsByTagName("td")[3].innerText;
        orientation = celdas.getElementsByTagName("td")[4].innerText;
        inMapStatus = celdas.getElementsByTagName("td")[5].innerText;
        isCarry = celdas.getElementsByTagName("td")[6].innerText;
        containerCheckCode = celdas.getElementsByTagName("td")[7].innerText;
        showContainer();
    } else {
        // return;
        if (event.target.tagName != 'TH') return;

        let th = event.target;
        // si TH, entonces ordena
        // cellIndex es el número de th:
        //   0 para la primera columna
        //   1 para la segunda columna, etc.
        // sortGrid(th.cellIndex, th.dataset.type);
        sortTable(containerTable,th.cellIndex)
    };


    if (columna == "0") {
        // alert('Por favor, ingrese un número de contenedor.');
        show_hide('none', 'none', 'inline-block', 'none', 'none', 'none'); //(botones, verTodos, verContainer, crearContainer, modificarContainer, borrarContainer)    
    }

    if (columna == "8") {
        // favDialog.showModal();
        show_hide('none', 'none', 'none', 'inline-block', 'none', 'none'); //(botones, verTodos, verContainer, insertContainer, modificarContainer, borrarContainer) 
        insertContainerMenu(containerCode, nodeCode, containerModelCode, orientation);
    }

    if (columna == "9") {
        contenedor = document.getElementById('containerCode0').value = celdas.getElementsByTagName("td")[0].innerText;
        // containerTable.style.display = 'none'
        show_hide('none', 'none', 'none', 'none', 'inline-block', 'none'); //(botones, verTodos, verContainer, insertContainer, modificarContainer, borrarContainer) 
        modificarContaineMenu(containerCode, nodeCode, emptyFullStatus);
    }

    if (columna == "10") {
        contenedor = document.getElementById('containerCode0').value = celdas.getElementsByTagName("td")[0].innerText;
        // favDialog.showModal();
        show_hide('none', 'none', 'none', 'none', 'none', 'inline-block'); //(botones, verTodos, verContainer, insertContainer, modificarContainer, borrarContainer) 
        borrarContainerMenu(containerCode, nodeCode);
    }


});

function sortTable(table, sortColumn){
    // get the data from the table cells
    const tableBody = table.querySelector('tbody')
    const tableData = table2data(tableBody);
    // sort the extracted data
    tableData.sort((a, b)=>{
      if(a[sortColumn] > b[sortColumn]){
        return 1;
      }
      return -1;
    })
    // put the sorted data back into the table
    data2table(tableBody, tableData);
  }

// this function gets data from the rows and cells 
// within an html tbody element
function table2data(tableBody){
    const tableData = []; // create the array that'll hold the data rows
    tableBody.querySelectorAll('tr')
      .forEach(row=>{  // for each table row...
        const rowData = [];  // make an array for that row
        row.querySelectorAll('td')  // for each cell in that row
          .forEach(cell=>{
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
  function data2table(tableBody, tableData){
    tableBody.querySelectorAll('tr') // for each table row...
      .forEach((row, i)=>{  
        // const rowData = tableData[i]; // get the array for the row data
        row.querySelectorAll('td')  // for each table cell ...
          .forEach((cell, j)=>{
            const rowData = tableData[i-1]; // get the array for the row data
            cell.innerText = rowData[j]; // put the appropriate array element into the cell
          })
      });
  }




function sortGrid(colNum, type) {
    let tbody = containerTable.querySelector('tbody');

    let rowsArray = Array.from(tbody.rows);

    // compare(a, b) compara dos filas, necesario para ordenar
    let compare;
type="string";
    switch (type) {
      case 'number':
        compare = function(rowA, rowB) {
          return rowA.cells[colNum].innerHTML - rowB.cells[colNum].innerHTML;
        };
        break;
      case 'string':
        compare = function(rowA, rowB) {
          return rowA.cells[colNum].innerHTML > rowB.cells[colNum].innerHTML ? 1 : -1;
        };
        break;
    }

    // sort
    rowsArray.sort(compare);

    tbody.append(...rowsArray);
  }

// function showContainerOri() {
//     // document.getElementById('infoContainer').addEventListener('click', () => {
//     var labelResponse = document.getElementById("labelResponseContainer");
//     const containerCode = document.getElementById('containerCode0').value;
//     const nodeCode = document.getElementById('nodeCode0').value;
//     const containerModelCode = document.getElementById('containerModelCode0').value;
//     const areaCode = document.getElementById('areaCode0').value;
//     const emptyFullStatus = document.getElementById('emptyFullStatus0').value;
//     const url = getURL("containerQuery");
//     // Request message example (Current rack entry)
//     // {
//     // "nodeCode": "M001-A001-30",
//     // "containerModelCode": "10001",
//     // "containerCode": "10",
//     // "areaCode": "A000000014",
//     // "emptyFullStatus": 2
//     // }
//     const data = {
//         containerCode: containerCode,
//         nodeCode: nodeCode,
//         containerModelCode: containerModelCode,
//         areaCode: areaCode,
//         emptyFullStatus: emptyFullStatus
//     };

//     labelResponse.innerText = "__________________________Response___ContainerQuery________________________________________________";
//     fetch(url, {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify(data)
//     })
//         .then(response => response.json())
//         .then(responseData => {
//             console.log('Respuesta del servidor:', responseData); // Verificar la respuesta del servidor
//             const outputTable = document.getElementById('outputTableContainer').getElementsByTagName('tbody')[0];
//             outputTable.innerHTML = ''; // Limpiar la tabla antes de insertar nuevos datos

//             if (responseData.data && responseData.data.length > 0) {
//                 let body = ""
//                 body += "<tr><th>containerCode</th>"
//                 body += "<th>nodeCode</th>"
//                 body += "<th>containerModelCode</th>"
//                 body += "<th>emptyFullStatus</th>"
//                 body += "<th>orientation</th>"
//                 body += "<th>inMapStatus</th>"
//                 body += "<th>isCarry</th>"
//                 body += "<th>containerCheckCode</th>"
//                 body += "<th style='background-color: rgb(15, 231, 87);'><-IN</th>"
//                 body += "<th style='background-color: rgb(10, 14, 236);'>UPDATE</th>"
//                 body += "<th style='background-color: rgb(230, 27, 8);'>OUT-></th>"
//                 body += "</tr>"
//                 for (var i = 0; i < responseData.data.length; i++) {
//                     body += "<tr><td class='link_tabla'><u>" + responseData.data[i].containerCode + "<u>"
//                     body += "</td><td>" + responseData.data[i].nodeCode
//                     body += "</td><td>" + responseData.data[i].containerModelCode
//                     body += "</td><td>" + responseData.data[i].emptyFullStatus
//                     body += "</td><td>" + responseData.data[i].orientation
//                     body += "</td><td>" + responseData.data[i].inMapStatus
//                     body += "</td><td>" + responseData.data[i].isCarry
//                     body += "</td><td>" + responseData.data[i].containerCheckCode
//                     body += "</td><td class='link_tabla'><u>Input<u>"
//                     body += "</td><td class='link_tabla'><u>   Update    </u>"
//                     body += "</td><td class='link_tabla'><u>   Output    </u>"
//                     body += "</td></tr>"
//                 }

//                 document.getElementById('outputTableContainer').innerHTML = body

//             } else {
//                 const row = outputTable.insertRow();
//                 const cell = row.insertCell(0);
//                 cell.colSpan = 2;
//                 cell.textContent = 'No se encontraron datos de contenedores.';
//             }
//         })
//         .catch(error => {
//             console.error('Error:', error);
//             const outputTable = document.getElementById('outputTableContainer').getElementsByTagName('tbody')[0];
//             outputTable.innerHTML = '<tr><td colspan="2">Error: ' + error + '</td></tr>';
//         });
//     // });
// }
