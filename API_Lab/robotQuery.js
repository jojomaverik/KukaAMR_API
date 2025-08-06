const outputTableAMR = document.getElementById('outputTableAMR');
const selectConatiner = document.getElementById("containerCode5");
const selectmissionType = document.getElementById("missionType5");



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
    document.getElementById("robotId4").value = "";
    document.getElementById("robotType4").value = "";
    document.getElementById("floorNumber4").value = "";
    document.getElementById("mapCode4").value = "";
    document.getElementById("robotId5").value = "";
    document.getElementById("floorNumber5").value = "";
    document.getElementById("mapCode5").value = "";
    document.getElementById("floorNumber6").value = "";
    document.getElementById("mapCode6").value = "";
    show_hide_AMR_view('none', 'inline-block', 'none', 'none', 'none');
}


function regresarMenuRobot() {
    resetAMR()
    showAMR()
}

function getContainerCode() {
    const url = getURL("containerQuery");

//Eliminando del local storage
// localStorage.removeItem('Miejemplo');
    const data = {
        containerCode: "",
        nodeCode: "",
    };

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


            if (responseData.data && responseData.data.length > 0) {

                var containerCode5 = document.getElementById('containerCode5');
                var size=containerCode5.length
                for (var i = 0; i < size; i++) {
                    containerCode5.remove(0);
                }
                for (var i = 0; i < responseData.data.length; i++) {
                    const option = document.createElement('option');
                    option.value = responseData.data[i].containerCode;
                    option.text = responseData.data[i].containerCode;
                    containerCode5.appendChild(option);
                }
                containerCode5.options.item(0).selected = 'selected';
                getContainerNode(containerCode5.options.item(0).value);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    // });	
}

function getContainerNode(contenedor) {
    const url = getURL("containerQuery");

//Eliminando del local storage
// localStorage.removeItem('Miejemplo');
    const data = {
        containerCode: contenedor,
        nodeCode: "",
    };

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
            if (responseData.data && responseData.data.length > 0) {
                document.getElementById('position5').value=responseData.data[0].nodeCode
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    // });	
}


function showAMR(){
    // getContainerCode();
    var labelResponse = document.getElementById("labelResponseAMR");
    const robotId = document.getElementById('robotId4').value;
    const robotType = document.getElementById('robotType4').value;
    const floorNumber = document.getElementById('floorNumber4').value;
    const mapCode = document.getElementById('mapCode4').value;
    const kmresIP = document.getElementById('kmresIP').value;
    const url = 'http://' + kmresIP + ':10870/interfaces/api/amr/robotQuery';
    const data = {
        floorNumber: floorNumber,
        mapCode: mapCode,
        robotId: robotId,
        robotType: robotType
    };
    labelResponse.innerText="__________________________Response___infoRoborQuery________________________________________________";
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
        // console.log(data)
        const outputTable = document.getElementById('outputTableAMR').getElementsByTagName('tbody')[0];
        outputTable.innerHTML = ''; // Limpiar la tabla antes de insertar nuevos datos

        if (responseData.data && responseData.data.length > 0) {
        
            let body = ""
            body+="<tr>"
            body+="<th>Robot ID</th>"
            body+="<th>Tipo de Robot</th>"
            body+="<th>buildingCode</th>"
            body+="<th>Map</th>"
            body+="<th>Floor</th>"
            body+="<th>containerCode</th>"
            body+="<th>status</th>"
            body+="<th>missionCode</th>"
            body+="<th>nodeCode</th>"
            body+="<th>occupyStatus</th>"
            body+="</tr>"
            for (var i = 0; i < responseData.data.length; i++) {   "<tr><td class='link_tabla'><u>" 
               body+="<tr><td class='link_tabla'><u>" +responseData.data[i].robotId+ "<u>"
               body+="</td><td>"+responseData.data[i].robotType
               body+="</td><td>"+responseData.data[i].buildingCode
               body+="</td><td>"+responseData.data[i].mapCode
               body+="</td><td>"+responseData.data[i].floorNumber
               body+="</td><td>"+responseData.data[i].containerCode
               body+="</td><td>"+responseData.data[i].status
               body+="</td><td>"+responseData.data[i].missionCode
               body+="</td><td>"+responseData.data[i].nodeCode
               body+="</td><td>"+responseData.data[i].occupyStatus
               body+="</td></tr>"
            }
            document.getElementById('outputTableAMR').innerHTML = body
            
        } else {
            //const row = outputTable.insertRow();
            const row = outputTable2.insertRow();
            const cell = row.insertCell(0);
            cell.colSpan = 2;
            cell.textContent = 'No se encontraron datos del robot.';
        }
    })
    .catch(error => {
        console.error('Error:', error);
        const outputTable = document.getElementById('outputTable').getElementsByTagName('tbody')[0];
        outputTable.innerHTML = '<tr><td colspan="2">Error: ' + error + '</td></tr>';
    });
};

function StartWorkFlow(){
// document.getElementById('StartWorkFlow').addEventListener('click', () => {
    var templateCode = document.getElementById('workflow6').value;
    const mapCode = document.getElementById('mapCode6').value;
    const floorNumber = document.getElementById('floorNumber6').value;
    const kmresIP = document.getElementById('kmresIP').value;
    const url = 'http://' + kmresIP + ':10870/interfaces/api/amr/submitMission';
    var data = {
        orgId: mapCode + "-" + floorNumber + "-",
        requestId: "request" + new Date().getTime(),
        missionCode: "mission" + new Date().getTime(),
        missionType: "RACK_MOVE",
        templateCode: templateCode
    };
    const outputTable = document.getElementById('outputTableMission').getElementsByTagName('tbody')[0];
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
            body+="<tr><th>data</th>"
            body+="<th>code</th>"
            body+="<th>message</th>"
            body+="<th>success</th>"
            body+="</tr>" 
            body+="</td><td>"+responseData.data
            body+="</td><td>"+responseData.code
            body+="</td><td>"+responseData.message
            body+="</td><td>"+responseData.success
            body+="</td></tr>" 
            outputTable.innerHTML = body	 
    })
    .catch((error) => {
        console.error('Error:', error);
        alert('Error al ejecutar el script');
    });
};

function subMission(){
// document.getElementById('SubMission').addEventListener('click', () => {
    var labelResponse = document.getElementById("labelResponseAMR");
    const robotId = String(document.getElementById('robotId5').value); //String(document.getElementById('robotId5').value.split(',').map(id => parseInt(id.trim())));
    const missionType = document.getElementById('missionType5').value;
    const robotType = document.getElementById('robotType5').value;
    const mapCode = document.getElementById('mapCode5').value;
    const containerCode = document.getElementById('containerCode5').value;
    const floorNumber = document.getElementById('floorNumber5').value;
    const position = document.getElementById('position5').value;
    const position2 = document.getElementById('position25').value;
    const kmresIP = document.getElementById('kmresIP').value;
    const url = 'http://' + kmresIP + ':10870/interfaces/api/amr/submitMission';
    var data = null;
    const data1 = {
        orgId: mapCode+"-"+ floorNumber +"-",
        requestId: "request" + new Date().getTime(),
        missionCode: "mission" + new Date().getTime(),
        missionType: missionType,
        viewBoardType: "",
        robotModels: [],
        robotIds: [robotId],
        robotType: robotType,
        priority: 1,
        containerType: "",
        containerCode: containerCode,
        templateCode: "",
        lockRobotAfterFinish: false,
        unlockRobotId: "",
        unlockMissionCode: "",
        idleNode: "",
        missionData: [
            {
                sequence: 1,
                position: position,
                type: "NODE_POINT",
                putDown: false,
                passStrategy: "AUTO",
                waitingMillis: 2
            }
        ]
    };
    const data2 = {
        orgId: mapCode+"-"+ floorNumber +"-",
        requestId: "request" + new Date().getTime(),
        missionCode: "mission" + new Date().getTime(),
        missionType: missionType,
        viewBoardType: "",
        robotType: robotType,
        robotModels: [],
        robotIds: [robotId],
        priority: 1,
        containerType: "",
        containerCode: containerCode,
        templateCode: "",
        lockRobotAfterFinish: false,
        unlockRobotId: "",
        unlockMissionCode: "",
        idleNode: "",
        missionData: [
            {
                sequence: 1,
                position: position,
                type: "NODE_POINT",
                putDown: false,
                passStrategy: "AUTO",
                waitingMillis: 2
            },
            {
                sequence: 2,
                position: position2,
                type: "NODE_POINT",
                putDown: true,
                passStrategy: "AUTO",
                waitingMillis: 2
            }
        ]
    };
    
    if(missionType=="MOVE"){
        data=data1
    }else{
        data=data2
    };
    console.log(data);
    const outputTable = document.getElementById('outputTableAMR').getElementsByTagName('tbody')[0];
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
        // labelResponse.innerText="infoRoborQuery_Response:"+JSON.stringify(responseData);
        let body = ""

            body+="<tr><th>data</th>"
            body+="<th>code</th>"
            body+="<th>message</th>"
            body+="<th>success</th>"
            body+="</tr>" 
            body+="</td><td>"+responseData.data
            body+="</td><td>"+responseData.code
            body+="</td><td>"+responseData.message
            body+="</td><td>"+responseData.success
            body+="</td></tr>" 
            outputTable.innerHTML = body	 
    })
    .catch(error => {
        console.error('Error al enviar la misión:', error);
        alert('Error al enviar la misión: ' + error);
    });
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
    var containerCode5="";
    var tdtrth = false;


    var robotId = targetElement.cellIndex;
    ncolumna = targetElement.cellIndex;
    var columnaValida = (columna == "0")
    if (targetElement.tagName === 'TD' && targetElement.parentElement.tagName === 'TR' && targetElement.parentElement.tagName !== 'TH' && columnaValida) {
        tdtrth = true;
        robotId = document.getElementById('robotId4').value = document.getElementById('robotId5').value = celdas.getElementsByTagName("td")[0].innerText;
        robotType = document.getElementById('robotType4').value = celdas.getElementsByTagName("td")[1].innerText;
        mapCode = document.getElementById('mapCode4').value = document.getElementById('mapCode5').value =  document.getElementById('mapCode6').value = celdas.getElementsByTagName("td")[3].innerText;
        floorNumber = document.getElementById('floorNumber4').value = document.getElementById('floorNumber5').value = document.getElementById('floorNumber6').value = celdas.getElementsByTagName("td")[4].innerText;
        nodeCode = document.getElementById('position5').value = document.getElementById('position25').value =celdas.getElementsByTagName("td")[8].innerText;
        document.getElementById('robotType5').value="LIFT"
        document.getElementById('missionType5').value="MOVE"
        position25 = document.getElementById('position25')
        containerCode5 = document.getElementById('containerCode5')
        position25.readOnly=true;
        position25.className ="readonly"
        containerCode5.disabled = true
        containerCode5.className ="readonly" 
        showAMR();
        show_hide_AMR_view('none', 'none','inline-block', 'none');
    } else {
        return;
    }
});



selectConatiner.addEventListener("change", (event) => {
    // sessionStorage.setItem("containerCodeBussy", true);

    // var containerCodeBussy= sessionStorage.getItem("containerCodeBussy");
    // if (containerCodeBussy==true){
    //     return;
    // }
    // const debug = document.getElementById("debug");
    // debug.innerText = `Contenedor seleccionado: ${event.target.value}`;
    if (event.target.value=="RACK_MOVE"){
        var nodeCode2 = document.getElementById('position25')
        nodeCode2.class=false;
    }
    getContainerNode(event.target.value)
});

selectmissionType.addEventListener("change", (event) => {
    var position25 = document.getElementById('position25')
    var containerCode5 = document.getElementById('containerCode5')
    if (event.target.value=="RACK_MOVE"){
        position25.readOnly=false;
        position25.className ="notreadonly"
        containerCode5.disabled = false
        containerCode5.className ="notreadonly"
        getContainerCode();
    }else{
        position25.readOnly=true;
        position25.className ="readonly"
        containerCode5.disabled = true
        containerCode5.className ="readonly" 
    }
});
// localStorage

// Opción 1 ->  localStorage.setItem(name, content)
// Opción 2 ->localStorage.name = content
// name = nombre del elemento
// content = Contenido del elemento

// localStorage.setItem('Nombre', 'Miguel Antonio')
// localStorage.Apellido = 'Márquez Montoya'


// sessionStorage

// Opción 1 ->  sessionStorage.setItem(name, content)
// Opción 2 ->sessionStorage.name = content
// name = nombre del elemento
// content = Contenido del elemento

// sessionStorage.setItem('Nombre', 'Miguel Antonio')
// sessionStorage.Apellido = 'Márquez Montoya'


// localStorage

// Opción 1 -> localStorage.getItem(name, content)
// Opción 2 -> localStorage.name

// Obtenemos los datos y los almacenamos en variables
// let firstName = localStorage.getItem('Nombre'),
//     lastName  = localStorage.Apellido

// console.log(`Hola, mi nombre es ${firstName} ${lastName}`)
// Imprime: Hola, mi nombre es Miguel Antonio Márquez Montoya
// sessionStorage

// Opción 1 -> sessionStorage.getItem(name, content)
// Opción 2 -> sessionStorage.name

// Obtenemos los datos y los almacenamos en variables
// let firstName = sessionStorage.getItem('Nombre'),
//     lastName  = sessionStorage.Apellido

// console.log(`Hola, mi nombre es ${firstName} ${lastName}`)
// Imprime: Hola, mi nombre es Miguel Antonio Márquez Montoya