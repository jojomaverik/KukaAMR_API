const delay = (s) => { return new Promise((resolve) => setTimeout(resolve, s * 1000)); };
const missionsTableElement = document.getElementById("missionTable");
const workFlowTableElement = document.getElementById("workFlowTable");
const step1 = 1 //Sent
const step2 = 2 //In Progress
const step3 = 3 //First Node reached
const step4 = 4 //Finish
const subMissionType1 = 1 //Move Or Rack_Move
const subMissionType2 = 2 //Move node alone
const subMissionType3 = 3 //WorkFlow
const subMissionType4 = 4 //Reserva
let timersMissionsID = [];
let countdownMissionsID = [];
let timersWorkFlowsID = [];
let countdownWorkFlowsID = [];
let optMission = true;
let optWorkFlow = false;
let contenedoresCode = [];
let optMissionTypes = ["MOVE", "RACK_MOVE", "CONTAINER"] //, "FORKLIFT_MOVE", "PICKER_MOVE", "ROLLER_MOVE"];
let optRobotTypes = ["LIFT"] //, "ROLLER", "PICKER", "FORKLIFT", "HCSBOX"];
let runningMissions = [];
let runningWorkFlows = [];

let timerMissionsFormID = null;
let timerMissionsForm = 0;
let timerWorkFlowsFormID = null;
let timerWorkFlowForm = 0;
let jobMissionEventID = [];
let jobEventCode = [];
let jobSpsID = [];
let codContainer = [];
let JobMissionPendant = [];
let JobWorkFlowPendant = [];
const celdasIDMissions = ["enableMission", "robotIDMission", "celdaMission", "Mision", "mapCodeMission", "floorNumberMission", "robotType", "missionType", "newContainerLabel",
    "newContainer", "rmContainerLabel", "codigoContenedor", "rmContainer", "origen", "waitingMillisOrigen", "destino1_", "waitingMillisDestino1_",
    "destino2_", "waitingMillisDestino2_", "destino3_", "waitingMillisDestino3_", "intervalMission", "resetCounterMission", "forceMission", "startStopMission"];

// const celdasIDMissions = ["enableMission", "mapCodeMission", "floorNumberMission", "robotType", "missionType",
//     "newContainer" , "codigoContenedor", "rmContainer", "origen", "waitingMillisOrigen", "destino1_", "waitingMillisDestino1_",
//     "destino2_", "waitingMillisDestino2_", "destino3_", "waitingMillisDestino3_", "intervalMission"];
const celdasIDWorkFlows = ["enableWorkFlow", "robotIDWorkFlow", "mapCodeWorkFlow", "floorNumberWorkFlow", "templateCodeWorkFlow", "intervalWorkFlow"];

let timerWorkFlowsElement = document.getElementById(`MainTimerWorkFlow`);
var timerMissionsElement = document.getElementById(`MainTimerMission`);

const kmresIPElement = document.getElementById('kmresIP');
const nWorkFlowsElement = document.getElementById('nWorkFlows');
const nMissionsElement = document.getElementById('nMissions');

//   nWorkFlowsElement.onchange = populateStorage;
//   nMissionsElement.onchange = populateStorage;

function get_URL(endpoint) {
    const url = 'http://' + kmresIPElement.value + ':10870/interfaces/api/amr/' + endpoint;
    return url;
}

const appFetchSubMissions = async (url, data, method) => {
    var response;
    try {
        console.log(data)
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

function kmresIPOnChange() {
    saveLocalStorageForm();
}

function nMissionsOnChange() {
    crearTablaMissions();
    saveLocalStorageForm();
    loadMisions();
}

function nWorkFlowsOnChange() {
    crearTablaWorkFlows();
    saveLocalStorageForm();
    loadWorkFlows();

}


function toggleWorkFlow(workFlowNumber) {
    const enableElement = document.getElementById(`enableWorkFlow${workFlowNumber}`);
    const label = document.getElementById(`WorkFlow${workFlowNumber}`);
    const interval = document.getElementById(`intervalWorkFlow${workFlowNumber}`);
    const templateCode = document.getElementById(`templateCodeWorkFlow${workFlowNumber}`);
    const resetCounterWorkFlow = document.getElementById(`resetCounterWorkFlow${workFlowNumber}`);
    const forzar = document.getElementById(`forceWorkFlow${workFlowNumber}`);
    const startStopWorkflow = document.getElementById(`startStopWorkflow${workFlowNumber}`);
    const robotIDWorkFlow = document.getElementById(`robotIDWorkFlow${workFlowNumber}`);
    const mapCode = document.getElementById(`mapCodeWorkFlow${workFlowNumber}`);
    const floorNumber = document.getElementById(`floorNumberWorkFlow${workFlowNumber}`);
    const counterElement = document.getElementById(`counterWorkFlow${workFlowNumber}`);
    const countdownElement = document.getElementById(`countdownWorkFlow${workFlowNumber}`);


    if (enableElement.checked) {
        label.style = "color: #87CEEB";
        countdownElement.style = "color: #87CEEB";
        interval.disabled = false
        templateCode.disabled = false
        forzar.disabled = false
        resetCounterWorkFlow.disabled = false
        startStopWorkflow.disabled = false
        robotIDWorkFlow.disabled = false
        mapCode.disabled = false
        floorNumber.disabled = false
        counterElement.style = "color: #87CEEB";
    } else {
        label.style = "color:rgb(120, 121, 121)"
        countdownElement.style = "color:rgb(120, 121, 121)"
        interval.disabled = true
        templateCode.disabled = true
        forzar.disabled = true
        resetCounterWorkFlow.disabled = true
        startStopWorkflow.disabled = true
        robotIDWorkFlow.disabled = true
        mapCode.disabled = true
        floorNumber.disabled = true
        counterElement.style = "color:rgb(120, 121, 121)"
        const nWorkFlows = document.getElementById('nWorkFlows');

        resetCountdown(optWorkFlow, workFlowNumber);
        clearJobEvent(optWorkFlow, workFlowNumber);
    }
}

function resetCounter(jobNumber, opt) {
    let counterElement = null;
    let timerElement = null;
    let countdownElement = null;
    if (opt == optMission) {
        counterElement = document.getElementById(`counterMission${jobNumber}`);
        countdownElement = document.getElementById(`countdownMission${jobNumber}`);
        timerElement = document.getElementById(`delayMission${jobNumber}`);
    } else {
        counterElement = document.getElementById(`counterWorkFlow${jobNumber}`);
        countdownElement = document.getElementById(`countdownWorkFlow${jobNumber}`);
        timerElement = document.getElementById(`delayWorkFlow${jobNumber}`);

    }
    counterElement.innerHTML = '0';
    countdownElement.innerHTML = '0';
    timerElement.innerHTML = '0';
}

async function toggleMission(stationNumber) {
    const Mision = document.getElementById(`Mision${stationNumber}`);
    const enableElement = document.getElementById(`enableMission${stationNumber}`);
    const robotIDMission = document.getElementById(`robotIDMission${stationNumber}`);
    const mapCode = document.getElementById(`mapCodeMission${stationNumber}`);
    const floorNumber = document.getElementById(`floorNumberMission${stationNumber}`);
    const robotType = document.getElementById(`robotType${stationNumber}`);
    const missionType = document.getElementById(`missionType${stationNumber}`);
    const newContainer = document.getElementById(`newContainer${stationNumber}`);
    const codigoContenedor = document.getElementById(`codigoContenedor${stationNumber}`);
    const rmContainer = document.getElementById(`rmContainer${stationNumber}`);
    const origen = document.getElementById(`origen${stationNumber}`);
    const waitingMillisOrigen = document.getElementById(`waitingMillisOrigen${stationNumber}`);
    const destino1 = document.getElementById(`destino1_${stationNumber}`);
    const destino2 = document.getElementById(`destino2_${stationNumber}`);
    const destino3 = document.getElementById(`destino3_${stationNumber}`);
    const waitingMillisDestino1 = document.getElementById(`waitingMillisDestino1_${stationNumber}`);
    const waitingMillisDestino2 = document.getElementById(`waitingMillisDestino2_${stationNumber}`);
    const waitingMillisDestino3 = document.getElementById(`waitingMillisDestino3_${stationNumber}`);
    const interval = document.getElementById(`intervalMission${stationNumber}`);
    const counterMission = document.getElementById(`counterMission${stationNumber}`);
    const resetCounterMission = document.getElementById(`resetCounterMission${stationNumber}`);
    const countdownElement = document.getElementById(`countdownMission${stationNumber}`);
    const forzar = document.getElementById(`forceMission${stationNumber}`);
    const startStopMission = document.getElementById(`startStopMission${stationNumber}`);

    if (enableElement.checked) {
        Mision.style = "color: #87CEEB";
        countdownElement.style = "color: #87CEEB";
        interval.disabled = false;
        origen.disabled = false;
        waitingMillisOrigen.disabled = false;
        destino1.disabled = false;
        waitingMillisDestino1.disabled = false;
        destino2.disabled = false;
        waitingMillisDestino2.disabled = false;
        destino3.disabled = false;
        waitingMillisDestino3.disabled = false;
        forzar.disabled = false;
        startStopMission.disabled = false;
        robotIDMission.disabled = false;
        mapCode.disabled = false;
        floorNumber.disabled = false;
        robotType.disabled = false;
        missionType.disabled = false;
        codigoContenedor.disabled = false;
        newContainer.disabled = false;
        resetCounterMission.disabled = false;
        rmContainer.disabled = false;
        counterMission.style = "color: #87CEEB";
        toggleMissionType(stationNumber);
        // await getContainers(stationNumber);
    } else {
        Mision.style = "color:rgb(120, 121, 121)"
        countdownElement.style = "color:rgb(120, 121, 121)"
        interval.disabled = true;
        origen.disabled = true;
        waitingMillisOrigen.disabled = true;
        destino1.disabled = true;
        waitingMillisDestino1.disabled = true;
        destino2.disabled = true;
        waitingMillisDestino2.disabled = true;
        destino3.disabled = true;
        waitingMillisDestino3.disabled = true;
        forzar.disabled = true;
        startStopMission.disabled = true;
        robotIDMission.disabled = true;
        mapCode.disabled = true;
        floorNumber.disabled = true;
        robotType.disabled = true;
        missionType.disabled = true;
        codigoContenedor.disabled = true;
        newContainer.disabled = true;
        resetCounterMission.disabled = true;
        rmContainer.disabled = true
        counterMission.style = "color:rgb(120, 121, 121)";
        const nMissions = document.getElementById('nMissions');

        resetCountdown(optMission, stationNumber);
        clearJobEvent(optMission, stationNumber);
    }

}

async function toggleMissionType(stationNumber) {
    const destino1 = document.getElementById(`destino1_${stationNumber}`)
    const destino2 = document.getElementById(`destino2_${stationNumber}`)
    const destino3 = document.getElementById(`destino3_${stationNumber}`)
    const waitingMillisOrigen = document.getElementById(`waitingMillisOrigen${stationNumber}`)
    const waitingMillisDestino1 = document.getElementById(`waitingMillisDestino1_${stationNumber}`)
    const waitingMillisDestino2 = document.getElementById(`waitingMillisDestino2_${stationNumber}`)
    const waitingMillisDestino3 = document.getElementById(`waitingMillisDestino3_${stationNumber}`)
    const origen = document.getElementById(`origen${stationNumber}`)
    const missionType = document.getElementById(`missionType${stationNumber}`)
    const newContainer = document.getElementById(`newContainer${stationNumber}`);
    const rmContainer = document.getElementById(`rmContainer${stationNumber}`);
    const codigoContenedor = document.getElementById(`codigoContenedor${stationNumber}`);
    const rmContainerLabel = document.getElementById(`rmContainerLabel${stationNumber}`);
    const newContainerLabel = document.getElementById(`newContainerLabel${stationNumber}`);

    if (missionType.value == "MOVE") {
        codigoContenedor.disabled = true;
        newContainer.disabled = true;
        rmContainer.disabled = true;
        rmContainerLabel.style = "color:rgb(120, 121, 121)";  //rmContainerLabel.checked ?  "color: #87CEEB" : "color:rgb(120, 121, 121)"; 
        newContainerLabel.style = "color:rgb(120, 121, 121)";  //newContainerLabel.checked ?  "color: #87CEEB" : "color:rgb(120, 121, 121)"; 
        destino1.disabled = false;
        destino2.disabled = false;
        destino3.disabled = false;
        waitingMillisDestino2.disabled = false;
        waitingMillisDestino3.disabled = false;

    } else if (missionType.value == "RACK_MOVE") {
        codigoContenedor.disabled = false;
        newContainer.disabled = false;
        rmContainer.disabled = false;

        rmContainerLabel.style = "color:rgb(120, 121, 121)"; //"color: #87CEEB" ;
        newContainerLabel.style = "color:rgb(120, 121, 121)"; // "color: #87CEEB" ;

        // destino1.value = origen.value;
        destino1.disabled = false;
        destino2.disabled = true;
        destino3.disabled = true;
        waitingMillisDestino2.disabled = true;
        waitingMillisDestino3.disabled = true;
        await getContainers(stationNumber);
        codigoContenedor.options.item(0).selected = 'selected';
        toggleContainerCode(stationNumber);
    } else if (missionType.value == "CONTAINER") {
        codigoContenedor.disabled = false;
        newContainer.disabled = false;
        rmContainer.disabled = false;
        destino1.disabled = false;

        rmContainerLabel.style = "color:rgb(120, 121, 121)"; //"color: #87CEEB" ;
        newContainerLabel.style = "color:rgb(120, 121, 121)"; // "color: #87CEEB" ;

        // destino1.value = origen.value;
        destino1.disabled = true;
        destino2.disabled = true;
        destino3.disabled = true;
        waitingMillisOrigen.disabled = true;
        waitingMillisDestino1.disabled = true;
        waitingMillisDestino2.disabled = true;
        waitingMillisDestino3.disabled = true;
        await getContainers(stationNumber);
        codigoContenedor.options.item(0).selected = 'selected';
        toggleContainerCode(stationNumber);
    }
}

async function toggleContainerCode(stationNumber) {
    const origen = document.getElementById(`origen${stationNumber}`)
    const destino1 = document.getElementById(`destino1_${stationNumber}`)
    const containerCode = document.getElementById(`codigoContenedor${stationNumber}`)


    const node = await getContainerNode(containerCode.value);
    origen.value = node;
    // destino1.value = node;

}

async function getContainerNode(contenedor) {
    const url = get_URL("containerQuery");
    const method = "POST";
    const body = {
        containerCode: contenedor,
        nodeCode: "",
    };

    const responseData = await appFetchSubMissions(url, body, method)
    if (responseData.data && responseData.data.length > 0) {
        return responseData.data[0].nodeCode
    } else {
        return "";
    }

}

document.getElementById('startStopAllWorkFlows').addEventListener('click', function () {
    const nWorkFlows = document.getElementById('nWorkFlows');

    let somejobRunning = false

    for (let i = 1; i <= nWorkFlows.value; i++) {
        if (runningWorkFlows[i]) {
            somejobRunning = true;
        }
    }

    if (!somejobRunning) {
        for (let i = 1; i <= nWorkFlows.value; i++) {
            setupSubMission(i, optWorkFlow);
        }
    } else {
        countdownWorkFlowsID.forEach(function (countdownWorkFlow) {
            var idx = countdownWorkFlowsID.indexOf(countdownWorkFlow);
            if (idx.includes("countdownWorkFlow")) {
                clearInterval(countdownWorkFlow);
                console.log("jobSpsID: " + countdownWorkFlow + " - " + countdownWorkFlowsID[idx] + "Removed");
            }
        });
        for (let i = 1; i <= nWorkFlows.value; i++) {
            resetCountdown(optWorkFlow, i);
            clearJobEvent(optWorkFlow, i);
        }
    }
    for (let i = 1; i <= nWorkFlows.value; i++) {
        enablepWorkflow(i);
    }


});


document.getElementById('resetAllWorkFlows').addEventListener('click', function () {
    const nWorkFlows = document.getElementById('nWorkFlows');

    clearStorageDataWorkFlows();
    nWorkFlowsOnChange()

});


document.getElementById('startStopAllMissions').addEventListener('click', function () {
    const nMissions = document.getElementById('nMissions');

    let somejobRunning = false

    for (let i = 1; i <= nMissions.value; i++) {
        if (runningMissions[i]) {
            somejobRunning = true;
        }
    }

    if (!somejobRunning) {
        for (let i = 1; i <= nMissions.value; i++) {
            setupSubMission(i, optMission);
        }
    } else {
        for (let i = 1; i <= nMissions.value; i++) {
            resetCountdown(optMission, i);
            clearJobEvent(optMission, i);
        }
    }

    for (let i = 1; i <= nMissions.value; i++) {
        enableMission(i);
    }

});

function enableMission(missionNumber) {
    const mapCode = document.getElementById(`mapCodeMission${missionNumber}`);
    const floorNumber = document.getElementById(`floorNumberMission${missionNumber}`);
    const robotType = document.getElementById(`robotType${missionNumber}`);
    const missionType = document.getElementById(`missionType${missionNumber}`);
    const newContainer = document.getElementById(`newContainer${missionNumber}`);
    const codigoContenedor = document.getElementById(`codigoContenedor${missionNumber}`);
    const origen = document.getElementById(`origen${missionNumber}`);
    const waitingMillisOrigen = document.getElementById(`waitingMillisOrigen${missionNumber}`);
    const destino1 = document.getElementById(`destino1_${missionNumber}`);
    const waitingMillisDestino1 = document.getElementById(`waitingMillisDestino1_${missionNumber}`);
    const destino2 = document.getElementById(`destino2_${missionNumber}`);
    const waitingMillisDestino2 = document.getElementById(`waitingMillisDestino2_${missionNumber}`);
    const destino3 = document.getElementById(`destino3_${missionNumber}`);
    const waitingMillisDestino3 = document.getElementById(`waitingMillisDestino3_${missionNumber}`);
    const interval = document.getElementById(`intervalMission${missionNumber}`);
    const celda = document.getElementById(`celdaMission${missionNumber}`);

    if (runningMissions[missionNumber] == true) {
        celda.setAttribute("style", "background-color: rgb(3, 88, 31)");
    } else {
        celda.setAttribute("style", "background-color: #345678)");
    }

    let elementDisabled = runningMissions[missionNumber]
    interval.disabled = elementDisabled;
    origen.disabled = elementDisabled;
    waitingMillisOrigen.disabled = elementDisabled;
    destino1.disabled = elementDisabled;
    waitingMillisDestino1.disabled = elementDisabled;
    destino2.disabled = elementDisabled;
    waitingMillisDestino2.disabled = elementDisabled;
    destino3.disabled = elementDisabled;
    waitingMillisDestino3.disabled = elementDisabled;
    mapCode.disabled = elementDisabled;
    floorNumber.disabled = elementDisabled;
    robotType.disabled = elementDisabled;
    missionType.disabled = elementDisabled;
    codigoContenedor.disabled = elementDisabled;
    newContainer.disabled = elementDisabled;

    // toggleMission(missionNumber);
}

function startStopMission(missionNumber) {
    if (runningMissions[missionNumber] == false) {
        setupSubMission(missionNumber, optMission);
    } else {
        resetCountdown(optMission, missionNumber);
        clearJobEvent(optMission, missionNumber);
    }

    enableMission(missionNumber);
}

function enablepWorkflow(workflowNumber) {
    const mapCodeWorkFlow = document.getElementById(`mapCodeWorkFlow${workflowNumber}`);
    const floorNumberWorkFlow = document.getElementById(`floorNumberWorkFlow${workflowNumber}`);
    const templateCodeWorkFlow = document.getElementById(`templateCodeWorkFlow${workflowNumber}`);
    const intervalElement = document.getElementById(`intervalWorkFlow${workflowNumber}`);
    const celda = document.getElementById(`celdaWorkFlow${workflowNumber}`);

    if (runningWorkFlows[workflowNumber] == true) {
        celda.setAttribute("style", "background-color: rgb(3, 88, 31)");
    } else {
        celda.setAttribute("style", "background-color: #345678)");
    }
    let elementDisabled = runningWorkFlows[workflowNumber]
    mapCodeWorkFlow.disabled = elementDisabled;
    floorNumberWorkFlow.disabled = elementDisabled;
    templateCodeWorkFlow.disabled = elementDisabled;
    intervalElement.disabled = elementDisabled;

    // toggleWorkFlow(workflowNumber);


}

function startStopWorkflow(workflowNumber) {
    if (runningWorkFlows[workflowNumber] == false) {
        setupSubMission(workflowNumber, optWorkFlow);
    } else {
        resetCountdown(optWorkFlow, workflowNumber);
        clearJobEvent(optWorkFlow, workflowNumber);
    }
    enablepWorkflow(workflowNumber);
}


document.getElementById('resetAllmissions').addEventListener('click', function () {

    clearStorageDataMissions()
    nMissionsOnChange()


    // const nMissions = document.getElementById('nMissions');

    // for (let i = 1; i <= nMissions.value; i++) {
    //     document.getElementById(`enableMission${i}`).checked = false;
    //     document.getElementById(`intervalMission${i}`).value = 0;
    //     document.getElementById(`countdownMission${i}`).innerHTML = '0';
    //     document.getElementById(`counterMission${i}`).innerHTML = "0";
    //     toggleMission(i); // Para aplicar el estilo de deshabilitado
    //     runningMission[i] = false;
    //     const celda = document.getElementById(`celdaMission${i}`);
    //     celda.setAttribute("style", "background-color: #345678)");
    // }
});

function resetCountdown(optionJob, i) {
    let timers;
    let countdown;
    let countdownJobElement;
    let delayJobElement;
    if (optMission == optionJob) {
        countdownJobElement = document.getElementById(`countdownMission${i}`);
        delayJobElement = document.getElementById(`delayMission${i}`);
        delayJobElement.style = "color:rgb(120, 121, 121)"
        runningMissions[i] = false;
        JobMissionPendant[i] = false;
        // clearInterval(timersMissionsID[i]);
        // console.log(countdownMissionsID);
        clearInterval(countdownMissionsID[countdownJobElement.id]);
    } else {
        countdownJobElement = document.getElementById(`countdownWorkFlow${i}`);
        delayJobElement = document.getElementById(`delayWorkFlow${i}`);
        delayJobElement.style = "color:rgb(120, 121, 121)"
        runningWorkFlows[i] = false;
        JobWorkFlowPendant[i] = false;
        // clearInterval(timersWorkFlowsID[i]);
        // console.log("countdownWorkFlowsID:" + countdownWorkFlowsID);
        clearInterval(countdownWorkFlowsID[countdownJobElement.id]);
        countdownWorkFlowsID.forEach(function (countdownWorkFlow) {
            var idx = countdownWorkFlowsID.indexOf(countdownWorkFlow);
            if (idx.includes("countdownWorkFlow")) {
                clearInterval(countdownWorkFlow);
            }
        });
    }
    countdownJobElement.innerHTML = '0';
}

function clearJobEvent(optionSubMission, jobID) {
    let filtro;
    if (optMission == optionSubMission) {
        filtro = "M--" + jobID + "-";
    } else {
        filtro = "W--" + jobID + "-";
    }
    const listaFiltrada = jobEventCode.filter(jobCode => jobCode.includes(filtro));

    jobEventCode.forEach(function (jobCode) {
        // console.log("List: " + jobCode + " - " + jobEventID[jobCode]);
        if (jobCode.includes(filtro)) {
            if (jobSpsID[jobCode]) {
                clearInterval(jobSpsID[jobCode]);
                console.log("jobSpsID: " + jobCode + " - " + jobSpsID[jobCode] + " Removed");
                jobSpsID[jobCode] = null
            }
            let index = jobEventCode.indexOf(jobCode);
            // console.log(index);
            jobEventCode.splice(index, 1);
        }
    });

    // jobEventID.forEach(function(jobCode) {
    //     if (jobCode.includes("W--" + jobID + "-")) {
    //         console.log("DElete: " + jobCode + " - " + jobEventID[jobCode]);
    //         clearInterval(jobEventID[jobCode]);
    //         jobEventID[jobCode].remove;
    //         jobCode.delte;
    //     }
    // });

}

function setupSubMission(stationNumber, opt) {
    if (opt == optMission) {
        const intervalElement = document.getElementById(`intervalMission${stationNumber}`);
        const enableElement = document.getElementById(`enableMission${stationNumber}`);
        const interval = intervalElement.value * 1000;

        if (enableElement.checked) {
            const origen = document.getElementById(`origen${stationNumber}`);
            if (origen.value == "") {
                alert("Origin Misison" + stationNumber + " must be different of NULL")
                return;
            }
            if (intervalElement.value > 0) {
                JobMissionPendant[stationNumber] = false;
                runningMissions[stationNumber] = true;
                JobMissionPendant[nWorkFlows] = false;
                startCountdownMission(interval / 1000, stationNumber);
            } else if (intervalElement.value <= 0) {
                intervalElement.value = null;
                intervalElement.placeholder = "Fill TIMER in seconds";
            }
        }
    } else if (opt == optWorkFlow) {
        const intervalElement = document.getElementById(`intervalWorkFlow${stationNumber}`);
        const enableElement = document.getElementById(`enableWorkFlow${stationNumber}`);
        const interval = intervalElement.value * 1000;


        if (enableElement.checked) {
            const workFlow = document.getElementById(`templateCodeWorkFlow${stationNumber}`);
            if (workFlow.value == "") {
                alert("WorkFlow Template " + stationNumber + " must be different of NULL")
                return;
            }
            if (intervalElement.value > 0) {
                JobWorkFlowPendant[stationNumber] = false;
                runningWorkFlows[stationNumber] = true;
                startCountdownWorkFlow(interval / 1000, stationNumber);
            } else {
                intervalElement.value = null;
                intervalElement.placeholder = "Fill TIMER in seconds";
            }
        }
    }

}

async function startCountdownMission(seconds, stationNumber) {
    var countdownElement = document.getElementById(`countdownMission${stationNumber}`);
    var delayMission = document.getElementById(`delayMission${stationNumber}`);
    clearInterval(countdownMissionsID[countdownElement.id]); // Asegurarse de que no haya múltiples temporizadores en ejecución
    let remainingTime = seconds;
    countdownElement.innerHTML = remainingTime;

    countdownMissionsID[countdownElement.id] = setInterval(function () {
        remainingTime--;
        countdownElement.innerHTML = remainingTime;
        if (remainingTime <= 0) {
            if (JobMissionPendant[stationNumber] == false) {
                remainingTime = seconds;
                startMission(stationNumber);
            } else {
                remainingTime = 1;
                incrementarCounter(delayMission);
                delayMission.style = "color:rgb(246, 6, 6)"
            }
        }
    }, 1000);
}


function startCountdownWorkFlow(seconds, stationNumber) {
    const countdownJobElement = document.getElementById(`countdownWorkFlow${stationNumber}`);
    const delayJobElement = document.getElementById(`delayWorkFlow${stationNumber}`);
    clearInterval(countdownWorkFlowsID[countdownJobElement.stationNumber]); // Asegurarse de que no haya múltiples temporizadores en ejecución
    let remainingTime = seconds;
    countdownJobElement.innerHTML = remainingTime;
    countdownWorkFlowsID[countdownJobElement.id] = setInterval(function () {
        remainingTime--;
        countdownJobElement.innerHTML = remainingTime;
        if (remainingTime <= 0) {
            if (JobWorkFlowPendant[stationNumber] == false) {
                remainingTime = seconds;
                sendWorkFlow(stationNumber);
            } else {
                remainingTime = 1;
                incrementarCounter(delayJobElement);
                delayJobElement.style = "color:rgb(246, 6, 6)"
            }
        }
    }, 1000);
}

async function incrementarCounter(counterElement) {
    let contador = parseInt(counterElement.textContent);
    contador++;
    counterElement.textContent = contador.toString();
    // counterElement.style = "color:red"
}

async function sendWorkFlow(stationNumber) {
    const contador = document.getElementById(`counterWorkFlow${stationNumber}`);
    const floorNumber = document.getElementById(`floorNumberWorkFlow${stationNumber}`).value;
    const mapCode = document.getElementById(`mapCodeWorkFlow${stationNumber}`).value;
    // const robotId = document.getElementById(`robotIDWorkFlow${stationNumber}`).value.split(',').map(id => parseInt(id.trim()));  //document.getElementById(`robotIDWorkFlow${stationNumber}`).value;
    var robotId = document.getElementById(`robotIDWorkFlow${stationNumber}`).value;
    const templateCodeElement = document.getElementById(`templateCodeWorkFlow${stationNumber}`);
    const orgId = `${mapCode}-${floorNumber}`; // Añadir el número de estación al orgId
    var now = new Date();
    var time = now.getMilliseconds() + " " + now.getFullYear() + "-" + now.getMonth() + "-" + now.getDate() + " " + now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds();
    var missionCode = "W--" + stationNumber + "-" + time
    const kmresIP = document.getElementById('kmresIP').value;
    const templateCode = templateCodeElement.value;
    const method = "POST";
    const url = `http://${kmresIP}:10870/interfaces/api/amr/submitMission`;
    var dbodyta = null;

    if (robotId == "") {
        robotId = [];
    } else {
        robotId = [robotId];
    }
    body = {
        orgId: orgId,
        requestId: "RW-" + stationNumber + "--" + time,
        missionCode: missionCode,
        missionType: 'RACK_MOVE',
        robotIds: robotId,
        templateCode: templateCode
    };

    console.log(body);

    try {
        const responseData = await appFetchSubMissions(url, body, method)
        if (responseData.success) {
            showLog("Job " + missionCode + " WorkFlow in queue", missionCode);
            JobWorkFlowPendant[stationNumber] = true;
            var count = jobEventCode.push(missionCode)
            const celdaTimerJob = document.getElementById(`celdaTimerWorkFlow${stationNumber}`);
            celdaTimerJob.setAttribute("style", "background-color: rgb(47, 97, 47)");
            jobSpsID[missionCode] = setInterval(function () {
                jobQueryStatusSPS(optWorkFlow, contador, missionCode, stationNumber, step1, subMissionType3);
            }, 1000);
        } else {
            showLog("Job " + missionCode + " WorkFlow ERROR", missionCode);
        }
    } catch (error) {
        console.error('Error:', error);
    };
}

function showLog(text, missionID) {
    console.log(text);
    var checkOnlyFinalStatus = document.getElementById(`checkOnlyFinalStatus`);

    addElement(text)

    checkSizeList()

    if (checkOnlyFinalStatus.checked) {
        if (text.includes("Deleted: true")) {
            deleteElement(missionID, "Deleted: true");
        }

        if (text.includes("Finished")) {
            deleteElement(missionID, "Finished");
        }
    }

    function checkSizeList() {
        let logElement = document.getElementsByClassName("logElement");
        let ul_lista = document.getElementById('ul_log');
        let nMaxLogInputs = document.getElementById('nMaxLogInputs').value;

        if (logElement.length > nMaxLogInputs) {
            for (i = 0; i <= logElement.length - nMaxLogInputs; i++) {
                ul_lista.removeChild(logElement[i]);
            }
        }
    }

    function addElement(text) {
        let logElement = document.createElement("li");
        let ul_log = document.getElementById('ul_log');
        var d = new Date().getTime();
        var id = "logElement" + d;
        logElement.id = id;
        logElement.className = "logElement";
        logElement.innerHTML = text;
        ul_log.appendChild(logElement);
    }

    function deleteElement(missionID, texto) {

        if (missionID != "") {
            let logElement = document.getElementsByClassName("logElement");
            let ul_lista = document.getElementById('ul_log');
            for (i = logElement.length - 1; i >= 0; i--) {
                if ((logElement[i].textContent.includes(missionID)) && (!logElement[i].textContent.includes(texto))) {
                    ul_lista.removeChild(logElement[i]);
                }
            }
        }
        if (missionID == "") {
            let logElement = document.getElementsByClassName("logElement");
            let ul_lista = document.getElementById('ul_log');
            for (i = logElement.length - 1; i >= 0; i--) {
                if ((logElement[i].textContent.includes(texto))) {
                    ul_lista.removeChild(logElement[i]);
                }
            }
        }

    }

}


function deleteLogs() {
    let logElement = document.getElementsByClassName("logElement");
    let ul_lista = document.getElementById('ul_log');
    for (i = logElement.length - 1; i >= 0; i--) {
        ul_lista.removeChild(logElement[i]);
    }
}

function getObjMissionForm(missionNumber) {
    var obj = {
        mapCode: document.getElementById(`mapCodeMission${missionNumber}`),
        floorNumber: document.getElementById(`floorNumberMission${missionNumber}`),
        robotType: document.getElementById(`robotType${missionNumber}`),
        missionType: document.getElementById(`missionType${missionNumber}`),
        newContainer: document.getElementById(`newContainer${missionNumber}`),
        codigoContenedor: document.getElementById(`codigoContenedor${missionNumber}`),
        rmContainer: document.getElementById(`rmContainer${missionNumber}`),
        origen: document.getElementById(`origen${missionNumber}`).value,
        waitingMillisOrigen: document.getElementById(`waitingMillisOrigen${missionNumber}`),
        destino1: document.getElementById(`destino1_${missionNumber}`),
        destino2: document.getElementById(`destino2_${missionNumber}`),
        destino3: document.getElementById(`destino3_${missionNumber}`),
        waitingMillisDestino1: document.getElementById(`waitingMillisDestino1_${missionNumber}`),
        waitingMillisDestino2: document.getElementById(`waitingMillisDestino2_${missionNumber}`),
        waitingMillisDestino3: document.getElementById(`waitingMillisDestino3_${missionNumber}`),
    }
    return obj;
}

function getValuesMissionForm(missionNumber) {
    var value = {
        robotIds: document.getElementById(`robotIDMission${missionNumber}`).value,
        mapCode: document.getElementById(`mapCodeMission${missionNumber}`).value,
        floorNumber: document.getElementById(`floorNumberMission${missionNumber}`).value,
        robotType: document.getElementById(`robotType${missionNumber}`).value,
        missionType: document.getElementById(`missionType${missionNumber}`).value,
        codigoContenedor: document.getElementById(`codigoContenedor${missionNumber}`).value,
        origen: document.getElementById(`origen${missionNumber}`).value,
        waitingMillisOrigen: document.getElementById(`waitingMillisOrigen${missionNumber}`).value,
        destino1: document.getElementById(`destino1_${missionNumber}`).value,
        destino2: document.getElementById(`destino2_${missionNumber}`).value,
        destino3: document.getElementById(`destino3_${missionNumber}`).value,
        waitingMillisDestino1: document.getElementById(`waitingMillisDestino1_${missionNumber}`).value,
        waitingMillisDestino2: document.getElementById(`waitingMillisDestino2_${missionNumber}`).value,
        waitingMillisDestino3: document.getElementById(`waitingMillisDestino3_${missionNumber}`).value,
    }
    return value;
}

async function sendMission(missionNumber, newCode) {
    var v = getValuesMissionForm(missionNumber);
    var missionType = subMissionType1;
    const kmresIP = document.getElementById('kmresIP').value;
    const contador = document.getElementById(`counterMission${missionNumber}`);

    const url = `http://${kmresIP}:10870/interfaces/api/amr/submitMission`;
    var body = null;
    var now = new Date();
    var time = now.getMilliseconds() + " " + now.getFullYear() + "-" + now.getMonth() + "-" + now.getDate() + "-" + now.getHours() + "-" + now.getMinutes() + "-" + now.getSeconds();
    var missionData = null;
    var requestId = "RM-" + missionNumber + "-" + time;
    var missionCode = "M--" + missionNumber + "-" + time;
    var putDownRackMove = true;

    if (newCode != "") {
        v.codigoContenedor = newCode;
    }

    if (v.missionType == "RACK_MOVE") {
        putDownRackMove = false;
        v.destino2 = "";
    }

    const secuencia1 = {
        sequence: 1,
        position: v.origen,
        type: "NODE_POINT",
        putDown: putDownRackMove,
        passStrategy: "AUTO",
        waitingMillis: v.waitingMillisOrigen * 1000
    };

    const secuencia2 = {
        sequence: 2,
        position: v.destino1,
        type: "NODE_POINT",
        putDown: true,
        passStrategy: "AUTO",
        waitingMillis: v.waitingMillisDestino1 * 1000
    };

    const secuencia3 = {
        sequence: 2,
        position: v.destino2,
        type: "NODE_POINT",
        putDown: putDownRackMove,
        passStrategy: "AUTO",
        waitingMillis: v.waitingMillisDestino2 * 1000
    };

    const secuencia4 = {
        sequence: 2,
        position: v.destino3,
        type: "NODE_POINT",
        putDown: true,
        passStrategy: "AUTO",
        waitingMillis: v.waitingMillisDestino3 * 1000
    };

    const missionData1 = [
        secuencia1,
    ];

    const missionData2 = [
        secuencia1,
        secuencia2
    ];

    const missionData3 = [
        secuencia1,
        secuencia2,
        secuencia3
    ];
    const missionData4 = [
        secuencia1,
        secuencia2,
        secuencia3,
        secuencia4
    ];


    if (v.destino1 == "") {
        missionData = missionData1;
        missionType = subMissionType2;
    } else if (v.destino2 == "") {
        missionData = missionData2;
    } else if (v.destino3 == "") {
        missionData = missionData3;
    } else {
        missionData = missionData4;
    }

    if (v.robotIds == "") {
        v.robotIds = [];
    } else {
        v.robotIds = [v.robotIds];
    }
    body = {
        orgId: v.mapCode + "-" + v.floorNumber + "-",
        requestId: requestId,
        missionCode: missionCode,
        missionType: v.missionType,
        viewBoardType: "",
        robotModels: [],
        robotIds: v.robotIds,
        robotType: v.robotType,
        priority: 1,
        containerType: "",
        containerCode: v.codigoContenedor,
        templateCode: "",
        lockRobotAfterFinish: false,
        unlockRobotId: "",
        unlockMissionCode: "",
        idleNode: "",
        missionData: missionData
    };
    const method = "POST";
    try {
        const responseData = await appFetchSubMissions(url, body, method)
        if (responseData.success) {
            showLog("Job " + missionCode + " In queue ");
            JobMissionPendant[missionNumber] = true;
            const celdaTimerMission = document.getElementById(`celdaTimerMission${missionNumber}`);
            celdaTimerMission.setAttribute("style", "background-color:rgb(47, 97, 47)");
            var cont = jobEventCode.push(missionCode);
            jobSpsID[missionCode] = setInterval(function () {
                jobQueryStatusSPS(optMission, contador, missionCode, missionNumber, step1, missionType);
            }, 1000);
        } else {
            showLog("Job " + missionCode + " ERROR ");
        }
    } catch (error) {
        console.error('Error:', error);
    };
}



function forceWorkFlow(workFlowNumber) {
    const templateCodeWorkFlow = document.getElementById(`templateCodeWorkFlow${workFlowNumber}`);
    if (templateCodeWorkFlow.value == "") {
        alert("WorkFlow Template " + workFlowNumber + " must be different of NULL")
        return;
    }
    sendWorkFlow(workFlowNumber);

}

async function startMission(stationNumber) {
    var countdownElement = document.getElementById(`countdownMission${stationNumber}`);
    const missionType = document.getElementById(`missionType${stationNumber}`).value;
    const newContainer = document.getElementById(`newContainer${stationNumber}`);
    let codigoContenedor = document.getElementById(`codigoContenedor${stationNumber}`);
    const rmContainer = document.getElementById(`rmContainer${stationNumber}`);
    const counterElement = document.getElementById(`counterMission${stationNumber}`);
    const origen = document.getElementById(`origen${stationNumber}`).value;
    var now = new Date();
    var newCode = "";
    var nodeCode = "";
    var time = now.getMilliseconds() + " " + now.getDate() + "-" + now.getHours() + "-" + now.getMinutes() + "-" + now.getSeconds();
    var now = new Date();
    var missionCode = "M--" + stationNumber + "-" + time;

    //JOSEDA TODO
    switch (missionType) {
        case "MOVE":
            if (origen == "") break;
            await sendMission(stationNumber, newCode);
            break;

        case "RACK_MOVE":
            if (origen == "") break;
            if (newContainer.checked) {
                newCode = "C-M-" + stationNumber + "-" + time;
                do {
                    nodeCode = await getContainerNode(newCode);
                    if (nodeCode == "") {
                        if (runningMissions[stationNumber] != true) {
                            return;
                        }
                        await crearContainer(newCode, stationNumber);
                    }
                    await delay(1);
                } while (nodeCode == "");
            }
            await sendMission(stationNumber, newCode);
            break;

        case "CONTAINER":
            if (origen == "") break;
            var celdaTimerMission = celdaTimerJob = document.getElementById(`celdaTimerMission${stationNumber}`);
            celdaTimerMission.setAttribute("style", "background-color:rgb(47, 97, 47)");


            newCode = "C-M-" + stationNumber + "-" + time;
            codContainer[missionCode] = newCode
            nodeCode = await getContainerNode(newCode);
            JobMissionPendant[stationNumber] = true;

            // jobSpsID[missionCode] = setInterval(function () {
            //     jobQueryStatusNewContainerSPS(stationNumber,newCode);
            // }, 1000);

            do {
                nodeCode = await getContainerNode(newCode);
                if (nodeCode == "") {
                    await crearContainer(newCode, stationNumber);
                }
                await delay(1);
                // codigoContenedor.value = newCode;
                // console.log("Contenedor:" + nodeCode)
            } while (nodeCode == "");


            if (rmContainer.checked) {
                borrarContenedor(newCode);
                JobMissionPendant[stationNumber] = false;
                celdaTimerMission.setAttribute("style", "background-color: #345678)");
            } else {
                celdaTimerMission.setAttribute("style", "background-color: #345678)");
                JobMissionPendant[stationNumber] = false;
            }

            break;
        default:
            break;
    }

}

async function jobQueryStatusNewContainerSPS(stationNumber, newCode) {
    var celdaTimerMission = celdaTimerJob = document.getElementById(`celdaTimerMission${stationNumber}`);

    const rmContainer = document.getElementById(`rmContainer${stationNumber}`);
    const newContainer = document.getElementById(`newContainer${stationNumber}`);
    var nodeCode = await getContainerNode(newCode);
    await delay(1);
    if (newContainer.checked) {
        if (nodeCode != null) {
            await crearContainer(newCode, stationNumber);
        } else {
            if (rmContainer.checked) {
                borrarContenedor(newCode);
                JobMissionPendant[stationNumber] = false;
                celdaTimerMission.setAttribute("style", "background-color: #345678)");
            } else {
                celdaTimerMission.setAttribute("style", "background-color: #345678)");
                JobMissionPendant[stationNumber] = false;
            }
        }
    } else {
        if (rmContainer.checked) {
            borrarContenedor(newCode);
            JobMissionPendant[stationNumber] = false;
            celdaTimerMission.setAttribute("style", "background-color: #345678)");
        } else {
            celdaTimerMission.setAttribute("style", "background-color: #345678)");
            JobMissionPendant[stationNumber] = false;
        }
    }
}

async function forceMission(stationNumber) {
    var countdownElement = document.getElementById(`countdownMission${stationNumber}`);
    const missionType = document.getElementById(`missionType${stationNumber}`).value;
    const newContainer = document.getElementById(`newContainer${stationNumber}`);
    let codigoContenedor = document.getElementById(`codigoContenedor${stationNumber}`);
    const rmContainer = document.getElementById(`rmContainer${stationNumber}`);
    const counterElement = document.getElementById(`counterMission${stationNumber}`);
    const origen = document.getElementById(`origen${stationNumber}`).value;
    var now = new Date();
    var newCode = "";
    var nodeCode = "";
    var time = now.getMilliseconds() + " " + now.getDate() + "-" + now.getHours() + "-" + now.getMinutes() + "-" + now.getSeconds();
    var intentos = 0;
    //JOSEDA TODO
    switch (missionType) {
        case "MOVE":
            if (origen == "") {
                alert("Origen debe ser diferente de NULL")
                break;
            }
            await sendMission(stationNumber, newCode);
            break;

        case "RACK_MOVE":
            if (origen == "") {
                alert("Origen debe ser diferente de NULL")
                break;
            }
            if (newContainer.checked) {
                newCode = "C-M-" + stationNumber + "-" + time;
                // do {
                // nodeCode = await getContainerNode(newCode);
                // if (nodeCode == "") {
                if (await crearContainer(newCode, stationNumber) == false) {
                    showLog("Error Mission " + stationNumber + ". Error al crear contenedor");
                    return;
                }
                // }
                await delay(1);
                // intentos++;
                // if (intentos>5){
                //     showLog("Error Mission " + stationNumber + ". No se puede crear contenedor");
                //     return;
                // }
                // } while (nodeCode == "");
            }
            await sendMission(stationNumber, newCode);
            break;

        case "CONTAINER":
            if (origen == "") {
                alert("Origen debe ser diferente de NULL")
                break;
            }
            var celdaTimerMission = celdaTimerJob = document.getElementById(`celdaTimerMission${stationNumber}`);
            celdaTimerMission.setAttribute("style", "background-color:rgb(47, 97, 47)");
            newCode = codigoContenedor.value
            if (newContainer.checked) {
                newCode = "C-M-" + stationNumber + "-" + time;
                // nodeCode = await getContainerNode(newCode);
                // if (nodeCode == "") {
                if (await crearContainer(newCode, stationNumber) == false) {
                    showLog("Error Mission " + stationNumber + ". Error al crear contenedor");
                    celdaTimerMission.setAttribute("style", "background-color: #345678)");
                    return;
                }
                // }else{
                //     showLog("Error Mission " + stationNumber + ". No se puede crear contenedor");
                //     return;
                // }
                await delay(1);
            }
            if (rmContainer.checked) {
                await delay(1);
                await borrarContenedor(newCode);
                await delay(1);
                celdaTimerMission.setAttribute("style", "background-color: #345678)");
            } else {
                celdaTimerMission.setAttribute("style", "background-color: #345678)");
            }
            break;
        default:
            break;
    }

}


function crearTablaWorkFlows() {
    const nWorkFlows = document.getElementById('nWorkFlows');
    const outputTable = document.getElementById('workFlowTable').getElementsByTagName('tbody')[0];
    outputTable.innerHTML = ''; // Limpiar la tabla antes de insertar nuevos datos

    let body = ""
    body += "<tr>"
    body += "<th data-type='number'style='background-color: rgb(60, 61, 61);'>WorkFlow</th>"
    body += "<th data-type='number'style='background-color: rgb(60, 61, 61);'>RobotID</th>"
    body += "<th data-type='string'style='background-color: rgb(60, 61, 61);'>Layout / District</th>"
    body += "<th data-type='string'style='background-color: rgb(60, 61, 61);'>WorkFlow</th>"
    body += "<th data-type='number'style='background-color: rgb(60, 61, 61);'>Interval (s)</th>"
    body += "<th data-type='number'style='background-color: rgb(60, 61, 61);'>Timer / Delay</th>"
    body += "<th data-type='number'style='background-color: rgb(60, 61, 61);'>Counter</th>"
    body += "<th data-type='number'style='background-color: rgb(60, 61, 61);'>Force</th>"
    body += "</tr>"

    outputTable.innerHTML = body

    for (var i = 1; i <= nWorkFlows.value; i++) {
        addWorkFlow(i)
        runningWorkFlows[i] = false;
    }
}

async function crearTablaMissions() {
    const nMissions = document.getElementById('nMissions');
    const outputTable = document.getElementById('missionTable').getElementsByTagName('tbody')[0];
    outputTable.innerHTML = ''; // Limpiar la tabla antes de insertar nuevos datos

    let body = ""
    body += "<tr>"
    body += "<th data-type='string' style='background-color: rgb(60, 61, 61);'>Mission</th>"
    body += "<th data-type='number'style='background-color: rgb(60, 61, 61);'>RobotIds</th>"
    body += "<th data-type='string'style='background-color: rgb(60, 61, 61);'>Layout / District </th>"
    body += "<th data-type='string'style='background-color: rgb(60, 61, 61);'>robotType / missionType</th>"
    body += "<th data-type='string'style='background-color: rgb(60, 61, 61);'>(new)---Container---(rm)</th>"
    body += "<th data-type='string'style='background-color: rgb(60, 61, 61);'>Destino0<br>Delay(s)</th>"
    body += "<th data-type='string'style='background-color: rgb(60, 61, 61);'>Destino1<br>Delay(s)</th>"
    body += "<th data-type='string'style='background-color: rgb(60, 61, 61);'>Destino2<br>Delay(s)</th>"
    body += "<th data-type='string'style='background-color: rgb(60, 61, 61);'>Destino3<br>Delay(s)</th>"
    body += "<th data-type='number'style='background-color: rgb(60, 61, 61);'>Interval (s)</th>"
    body += "<th data-type='number'style='background-color: rgb(60, 61, 61);'>Timer / Delay</th>"
    body += "<th data-type='number'style='background-color: rgb(60, 61, 61);'>Counter</th>"
    body += "<th data-type='number'style='background-color: rgb(60, 61, 61);'>Command</th>"
    body += "</tr>"

    document.getElementById('missionTable').innerHTML = body
    // await getContainers();
    runningMissions[0] = false
    for (var i = 1; i <= nMissions.value; i++) {
        addMision(i)
        runningMissions[i] = false
    }
}




function addMision(n) {
    const table = document.getElementById("missionTable").getElementsByTagName('tbody')[0];
    const newRow = table.insertRow();
    var label = null
    var input = null
    // const columns = ['Estación', 'Habilitar', 'WorkFlow', 'Cadencia', 'Tiempo']; 
    // columns.forEach(col => {
    //     const cell = newRow.insertCell();
    //     const input = document.createElement('input');
    //     input.type = 'text';
    //     input.name = 'mision[]${col}';
    //     input.value = n
    //     cell.appendChild(input);
    // });

    // var y = document.createElement("LABEL");
    // var yv = prompt("Enter Caption value:", "");
    // y.innerHTML = yv;
    // document.body.appendChild(y);




    const Mision = newRow.insertCell();
    checkbox = document.createElement('input');
    checkbox.type = "checkbox";
    checkbox.id = "enableMission" + n
    checkbox.text = "Mision" + n;
    // input.onchange = "toggleStation(n)";
    // checkbox.setAttribute("onchange","handleChange(this)");
    checkbox.setAttribute("onchange", "toggleMission(" + n + ")");
    Mision.appendChild(checkbox);


    label = document.createElement('label');
    label.style = "color:rgb(120, 121, 121)"
    label.innerHTML = "     -   ";
    Mision.appendChild(label);
    Mision.id = "celdaMission" + n;
    Mision.style = "background-color: #345678)";

    label = document.createElement('label');
    label.id = "Mision" + n;
    // label.class="black";
    label.style = "color:rgb(120, 121, 121)"
    label.innerHTML = "M" + n;
    Mision.appendChild(label);


    const robotIDMission = newRow.insertCell();
    input = document.createElement('input');
    input.type = 'text';
    input.size = 4;
    input.id = "robotIDMission" + n;
    input.disabled = true
    input.value = "";
    robotIDMission.appendChild(input);

    const Layout = newRow.insertCell();
    input = document.createElement('input');
    input.type = 'text';
    input.size = 4;
    input.id = "mapCodeMission" + n;
    input.disabled = true
    input.value = "Lab";
    Layout.appendChild(input);
    Layout.appendChild(document.createElement("br"));
    input = document.createElement('input');
    input.type = 'text';
    input.size = 4;
    input.id = "floorNumberMission" + n;
    input.disabled = true
    input.value = "D1";

    Layout.appendChild(input);

    // const missionType = newRow.insertCell();
    // input = document.createElement('input');
    // input.type = 'text';
    // input.id = "tipoMision" + n;
    // input.disabled = true
    // input.value = "RACK_MOVE";
    // missionType.appendChild(input);


    const robotMisisonType = newRow.insertCell();
    select = document.createElement('select');
    select.id = "robotType" + n;
    select.disabled = true
    optRobotTypes.forEach(function (opcion) {
        var option = document.createElement("option");
        option.text = opcion;
        select.add(option);
    });
    robotMisisonType.appendChild(select);

    robotMisisonType.appendChild(document.createElement("br"));
    select = document.createElement('select');
    select.id = "missionType" + n;
    select.disabled = true
    select.setAttribute("onchange", "toggleMissionType(" + n + ")");
    optMissionTypes.forEach(function (opcion) {
        var option = document.createElement("option");
        option.text = opcion;
        select.add(option);
    });
    robotMisisonType.appendChild(select);

    const contenedor = newRow.insertCell();
    input = document.createElement('input');
    input.type = "checkbox";
    input.id = "newContainer" + n;
    input.disabled = true
    // input.onchange = "toggleStation(n)";
    // checkbox.setAttribute("onchange","handleChange(this)");
    contenedor.appendChild(input);


    label = document.createElement('label');
    label.style = "color:rgb(120, 121, 121)"
    label.innerHTML = "Create";
    label.id = "newContainerLabel" + n;
    label.style = "color:rgb(120, 121, 121)"
    contenedor.appendChild(label);
    contenedor.appendChild(document.createElement("br"));

    select = document.createElement('select');
    select.id = "codigoContenedor" + n;
    select.disabled = true
    select.setAttribute("onchange", "toggleContainerCode(" + n + ")");
    contenedoresCode.forEach(function (opcion) {
        var option = document.createElement("option");
        option.text = opcion;
        select.add(option);
    });
    contenedor.appendChild(select);
    contenedor.appendChild(document.createElement("br"));
    input = document.createElement('input');
    input.type = "checkbox";
    input.id = "rmContainer" + n;
    input.disabled = true
    contenedor.appendChild(input);

    label = document.createElement('label');
    label.style = "color:rgb(120, 121, 121)"
    label.innerHTML = "Remove";
    label.style = "color:rgb(120, 121, 121)"
    label.id = "rmContainerLabel" + n;
    contenedor.appendChild(label);

    const origen = newRow.insertCell();
    input = document.createElement('input');
    input.type = 'text';
    input.size = 12;
    input.id = "origen" + n;
    input.disabled = true
    input.value = "";
    origen.appendChild(input);
    // var br = document.createElement("br");
    origen.appendChild(document.createElement("br"));

    input = document.createElement('input');
    input.type = 'number';
    input.min = 0;
    input.size = 6;
    input.style = "width: 50px;";
    input.id = "waitingMillisOrigen" + n;
    input.disabled = true
    input.value = "0";
    origen.appendChild(input);


    const destino1 = newRow.insertCell();
    input = document.createElement('input');
    input.type = 'text';
    input.size = 12;
    input.id = "destino1_" + n;
    input.disabled = true
    input.value = "";
    destino1.appendChild(input);
    var br1 = document.createElement("br");
    destino1.appendChild(br1);

    input = document.createElement('input');
    input.type = 'number';
    input.min = 0;
    input.size = 6;
    input.style = "width: 50px;";
    input.id = "waitingMillisDestino1_" + n;
    input.disabled = true
    input.value = "0";
    destino1.appendChild(input);



    const destino2 = newRow.insertCell();
    input = document.createElement('input');
    input.type = 'text';
    input.size = 12;
    input.id = "destino2_" + n;
    input.disabled = true
    input.value = "";
    destino2.appendChild(input);
    var br2 = document.createElement("br");
    destino2.appendChild(br2);

    input = document.createElement('input');
    input.type = 'number';
    input.min = 0;
    input.size = 6;
    input.style = "width: 50px;";
    input.id = "waitingMillisDestino2_" + n;
    input.disabled = true
    input.value = "0";
    destino2.appendChild(input);

    const destino3 = newRow.insertCell();
    input = document.createElement('input');
    input.type = 'text';
    input.size = 12;
    input.id = "destino3_" + n;
    input.disabled = true
    input.value = "";
    destino3.appendChild(input);
    var br3 = document.createElement("br");
    destino3.appendChild(br3);

    input = document.createElement('input');
    input.type = 'number';
    input.min = 0;
    input.size = 6;
    input.style = "width: 100px;";
    input.id = "waitingMillisDestino3_" + n;
    input.disabled = true
    input.value = "0";
    destino3.appendChild(input);

    const interval = newRow.insertCell();
    input = document.createElement('input');
    input.type = 'number';
    input.size = 4;
    input.min = 0;
    input.style = "width: 50px;";
    input.id = "intervalMission" + n
    input.disabled = true
    input.value = 0;
    // input.placeholder = "Fill Timer in seconds";
    interval.appendChild(input);


    const countdown = newRow.insertCell();
    // input = document.createElement('input');
    label = document.createElement('label');
    label.innerHTML = "0";
    label.type = 'text';
    label.id = "countdownMission" + n;
    label.style = "color:rgb(120, 121, 121)"
    label.readonly = true;
    label.disabled = true;
    countdown.appendChild(label);


    label = document.createElement('label');
    // label.class="black";
    label.style = "color:rgb(120, 121, 121)"
    label.innerHTML = " - - ";
    countdown.appendChild(label);
    // countdown.id = "celdaTimerMission" + n;
    // countdown.style = "background-color: #345678)";



    label = document.createElement('label');
    label.innerHTML = "0";
    label.type = 'text';
    label.id = "delayMission" + n;
    label.style = "color:rgb(120, 121, 121)"
    label.readonly = true;
    label.disabled = true;
    countdown.appendChild(label);


    const counter = newRow.insertCell();

    label = document.createElement('label');
    label.id = "counterMission" + n;
    // label.class="black";
    label.style = "color:rgb(120, 121, 121)"
    label.innerHTML = "0";
    counter.appendChild(label);

    label = document.createElement('label');
    // label.class="black";
    label.style = "color:rgb(120, 121, 121)"
    label.innerHTML = " - - ";
    counter.appendChild(label);

    button = document.createElement('button');
    button.id = "resetCounterMission" + n;
    button.disabled = false;
    button.setAttribute("onclick", "resetCounter(" + n + ",optMission)");
    button.innerHTML = "R";
    button.disabled = true;
    counter.appendChild(button);

    // celdaAcciones.innerHTML = `<button id="resetCounterMission${n}" onclick="resetCounterMission(${n})" disabled = "true"><i>R</i>`


    var celdaAcciones = newRow.insertCell(-1);
    // celdaAcciones.innerHTML = '<button onclick="eliminarMision(this)"><i class="fas fa-trash-alt"></i>';
    celdaAcciones.innerHTML = `<button id="forceMission${n}" onclick="forceMission(${n})" disabled = "true">ForceOnce</button><br><button id="startStopMission${n}" onclick="startStopMission(${n})" disabled = "true"><i>Start/Stop</i>`;
    celdaAcciones.id = "celdaTimerMission" + n;
    celdaAcciones.style = "background-color: #345678)";
}

function addWorkFlow(n) {
    const table = document.getElementById("workFlowTable").getElementsByTagName('tbody')[0];
    const newRow = table.insertRow();
    var label = null
    var input = null
    // const columns = ['Estación', 'Habilitar', 'WorkFlow', 'Cadencia', 'Tiempo']; 
    // columns.forEach(col => {
    //     const cell = newRow.insertCell();
    //     const input = document.createElement('input');
    //     input.type = 'text';
    //     input.name = 'mision[]${col}';
    //     input.value = n
    //     cell.appendChild(input);
    // });

    // var y = document.createElement("LABEL");
    // var yv = prompt("Enter Caption value:", "");
    // y.innerHTML = yv;
    // document.body.appendChild(y);

    const Estacion = newRow.insertCell();
    input = document.createElement('input');
    input.type = "checkbox";
    input.id = "enableWorkFlow" + n
    // input.onchange = "toggleStation(n)";
    // checkbox.setAttribute("onchange","handleChange(this)");
    input.setAttribute("onchange", "toggleWorkFlow(" + n + ")");
    Estacion.appendChild(input);

    label = document.createElement('label');
    label.style = "color:rgb(120, 121, 121)"
    label.innerHTML = "     -   ";
    Estacion.appendChild(label);
    Estacion.id = "celdaWorkFlow" + n;
    Estacion.style = "background-color: #345678)";

    label = document.createElement('label');
    label.id = "WorkFlow" + n;
    // label.class="black";
    label.style = "color:rgb(120, 121, 121)"
    label.innerHTML = "W" + n;
    Estacion.appendChild(label);

    const CeldaRobotID = newRow.insertCell();
    input = document.createElement('input');
    input.type = 'text';
    input.id = "robotIDWorkFlow" + n;
    input.disabled = false;
    input.value = "";
    CeldaRobotID.appendChild(input);

    const mapCodeFloor = newRow.insertCell();
    input = document.createElement('input');
    input.type = 'text';
    input.size = 4;
    input.id = "mapCodeWorkFlow" + n;
    input.disabled = true
    input.value = "Lab";
    mapCodeFloor.appendChild(input);

    input = document.createElement('input');
    input.type = 'text';
    input.size = 4;
    input.id = "floorNumberWorkFlow" + n;
    input.disabled = true
    input.value = "D1";
    mapCodeFloor.appendChild(input);

    const WorkFlow = newRow.insertCell();
    input = document.createElement('input');
    input.type = 'text';
    input.id = "templateCodeWorkFlow" + n;
    input.disabled = true
    input.value = "W00000000" + n;
    WorkFlow.appendChild(input);



    const interval = newRow.insertCell();
    input = document.createElement('input');
    input.type = 'number';
    input.min = 0;
    input.id = "intervalWorkFlow" + n
    input.disabled = true;
    input.style = "width: 50px;";
    input.value = 0;
    // input.setAttribute=("onchange", "saveLocalStorageValue(intervalWorkFlow"+ n + ")");
    input.placeholder = "Fill Timer in seconds";
    interval.appendChild(input);


    const countdown = newRow.insertCell();
    // input = document.createElement('input');
    input = document.createElement('label');
    input.innerHTML = "0";
    input.type = 'text';
    input.id = "countdownWorkFlow" + n;
    input.style = "color:rgb(120, 121, 121)"
    input.readonly = true;
    input.disabled = true
    countdown.appendChild(input);
    label = document.createElement('label');
    // label.class="black";
    label.style = "color:rgb(120, 121, 121)"
    label.innerHTML = " - - ";
    countdown.appendChild(label);

    label = document.createElement('label');
    label.id = "delayWorkFlow" + n;
    // label.class="black";
    label.style = "color:rgb(120, 121, 121)"
    label.innerHTML = 0;
    countdown.appendChild(label);


    // const counter = newRow.insertCell();
    // input = document.createElement('input');
    // input.id="counter" + n;
    // // label.class="black";
    // input.value = 0;
    // input.disabled = true
    // counter.appendChild(input);

    const counter = newRow.insertCell();
    label = document.createElement('label');
    label.id = "counterWorkFlow" + n;
    // label.class="black";
    label.style = "color:rgb(120, 121, 121)"
    label.innerHTML = "0";
    counter.appendChild(label);

    label = document.createElement('label');
    // label.class="black";
    label.style = "color:rgb(120, 121, 121)"
    label.innerHTML = " - - ";
    counter.appendChild(label);

    button = document.createElement('button');
    button.id = "resetCounterWorkFlow" + n;
    button.innerHTML = "R";
    button.disabled = true;
    button.setAttribute("onclick", "resetCounter(" + n + ",optWorkFlow)");
    counter.appendChild(button);

    var celdaAcciones = newRow.insertCell(-1);
    // celdaAcciones.innerHTML = '<button onclick="eliminarMision(this)"><i class="fas fa-trash-alt"></i>';
    celdaAcciones.innerHTML = `<button id="forceWorkFlow${n}" onclick="forceWorkFlow(${n})" disabled = "true"><i>Force</i>
    <button id="startStopWorkflow${n}" onclick="startStopWorkflow(${n})" disabled = "true"><i>Start/Stop</i>`;
    style = "background-color: #02376d;"
    celdaAcciones.id = "celdaTimerWorkFlow" + n;
    celdaAcciones.style = "background-color: #345678)";
}


function incrementarCounter2(stationNumber) {
    const counterElement = document.getElementById(`counterMission${stationNumber}`);
    let contador = parseInt(counterElement.textContent);
    contador++;
    counterElement.textContent = contador.toString();
}

async function crearContainer(newCode, stationNumber) {
    var origen = document.getElementById(`origen${stationNumber}`).value;
    var templateContainer = document.getElementById(`codigoContenedor${stationNumber}`).value;
    // var templateContainer = "fghjk";
    const template = await getContainer(templateContainer);
    if (template == "") {
        console.log("Error al leer contenedor plantilla");
        return false;
    }
    const method = "POST";
    const url = get_URL("containerIn");
    const body = {
        containerCode: newCode,
        containerModelCode: template.containerModelCode,
        containerType: template.containerType,
        enterOrientation: template.orientation,
        isNew: "true",
        position: origen,
        requestId: "request" + new Date().getTime()
    };
    try {
        const responseData = await appFetchSubMissions(url, body, method)

        if (responseData.success) {
            showLog("Contenedor " + newCode + " Created: " + responseData.success, newCode);
            return true;
        } else {
            console.log("Contenedor " + newCode + " Created: " + responseData.success);
            return false;
        }
    } catch (error) {
        showLog("Container " + contenedor.containerCode + " Created: error");
        return false;
    };
};

async function borrarContenedor(codigoContenedor) {
    // document.getElementById('insertContainer').addEventListener('click', () => {
    const method = "POST";
    const url = get_URL("containerOut");
    const contenedor = await getContainer(codigoContenedor);
    const body = {
        containerCode: contenedor.containerCode,
        containerType: contenedor.containerType,
        isDelete: "false",
        position: contenedor.nodeCode,
        requestId: "request" + new Date().getTime()
    };

    try {
        const responseData = await appFetchSubMissions(url, body, method)
        showLog("Container " + contenedor.containerCode + " Deleted: " + responseData.success, contenedor.containerCode);
    } catch (error) {
        showLog("Container " + contenedor.containerCode + " Deleted: error");
    };
};

function eliminarMision(boton) {
    var fila = boton.parentNode.parentNode;
    fila.parentNode.removeChild(fila);
}

async function getContainers(stationNumber) {
    const url = get_URL("containerQuery");
    const method = "POST";
    const body = {
        containerCode: "",
        nodeCode: "",
        containerModelCode: "",
        areaCode: "",
        emptyFullStatus: ""
    };
    const responseData = await appFetchSubMissions(url, body, method)

    if (responseData.data && responseData.data.length > 0) {
        contenedoresCode = []
        for (var i = 0; i < responseData.data.length; i++) {
            contenedoresCode[i] = responseData.data[i].containerCode;
            contenedoresCode.sort()
        }

        let elemento = document.getElementById(`codigoContenedor${stationNumber}`);
        contenedoresCode.forEach(function (opcion) {
            elemento.remove(opcion);
        });
        contenedoresCode.forEach(function (opcion) {
            var option = document.createElement("option");
            option.text = opcion;
            elemento.add(option);
        });
    } else {

    }
}


async function getContainer(code) {
    const url = get_URL("containerQuery");
    const method = "POST";
    const body = {
        containerCode: code,
        nodeCode: "",
        containerModelCode: "",
        areaCode: "",
        emptyFullStatus: ""
    };
    const responseData = await appFetchSubMissions(url, body, method)

    if (responseData.success) {
        for (var i = 0; i < responseData.data.length; i++) {
            const contenedor = responseData.data[i];
            return contenedor;
        }
    } else {
        return "";
    }
}

// document.addEventListener("DOMContentLoaded", agregarMision());



function startStopMainTimerMission() {
    if (timerMissionsFormID == null) {
        startTimerMissions();
    } else {
        stopTimerMissions()
    }
}

function stopTimerMissions() {
    clearInterval(timerMissionsFormID);
    timerMissionsForm = 0
    timerMissionsFormID = null;
    timerMissionsElement.innerHTML = "Timer: 0:0:0";
}

function startTimerMissions() {
    clearInterval(timerMissionsFormID); // Asegurarse de que no haya múltiples temporizadores en ejecución
    timerMissionsForm = 0;
    timerMissionsFormID = setInterval(function () {
        timerMissionsForm++;
        timerMissionsElement.innerHTML = updateTimer(timerMissionsForm);
    }, 1000);
}


function startStopMainTimerWorkFlows() {

    if (timerWorkFlowsFormID == null) {
        startTimerWorkFlows();
    } else {
        stopTimerWorkFlows()
    }
}

function stopTimerWorkFlows() {
    clearInterval(timerWorkFlowsFormID);
    timerWorkFlowsForm = 0
    timerWorkFlowsFormID = null;
    timerWorkFlowsElement.innerHTML = "Timer: 0:0:0";
}

function startTimerWorkFlows() {
    clearInterval(timerWorkFlowsFormID); // Asegurarse de que no haya múltiples temporizadores en ejecución
    timerWorkFlowsForm = 0;
    timerWorkFlowsFormID = setInterval(function () {
        timerWorkFlowsForm++;
        timerWorkFlowsElement.innerHTML = updateTimer(timerWorkFlowsForm);
    }, 1000);
}



function updateTimer(time) {

    let hours = Math.floor((time % (60 * 60)) / (60 * 60));
    let minutes = Math.floor((time % (60 * 60)) / (60));
    let seconds = Math.floor((time % (60)));

    let timerString = "Timer: " + hours + ":" + minutes.toString().padStart(2, "0") + ":" + seconds.toString().padStart(2, "0");
    return timerString;
}




// const kmresIPElement = document.getElementById('kmresIP');
// const nWorkFlowsElement = document.getElementById('nWorkFlows');
// const nMissionsElement = document.getElementById('nMissions');

// kmresIPElement.onchange = saveLocalStorage;
// kmresIPElement.addEventListener('onchange', kmresIPchange);
// nWorkFlowsElement.onchange = saveLocalStorage;
// nMissionsElement.onchange = saveLocalStorage;

// document.getElementById('kmresIP').onchange = saveLocalStorage;

function loadData() {
    if (!localStorage.getItem('kmresIP')) {
        saveLocalStorageForm();
    } else {
        readLocalStorage1();
    }
}

function loadDataTable() {
    if (!localStorage.getItem('kmresIP')) {
        saveLocalStorageTableMissions();
    } else {
        readLocalStorageTableMissions();
    }
}

function saveLocalStorageForm() {
    var serverIPElement = document.getElementById('kmresIP');
    var nWorkFlowsElement = document.getElementById(`nWorkFlows`);
    var nMissionsElement = document.getElementById(`nMissions`);

    localStorage.setItem('kmresIP', serverIPElement.value);
    if (nWorkFlowsElement.value < 1) nWorkFlowsElement.value = 1;
    if (nMissionsElement.value < 1) nMissionsElement.value = 1;
    localStorage.setItem('nWorkFlows', nWorkFlowsElement.value);
    localStorage.setItem('nMissions', nMissionsElement.value);

    // readLocalStorage();
}

function readLocalStorage1() {
    var kmresIP = localStorage.getItem('kmresIP');
    var nWorkFlows = localStorage.getItem('nWorkFlows');
    var nMissions = localStorage.getItem('nMissions');

    kmresIPElement.value = kmresIP;
    nWorkFlowsElement.value = nWorkFlows;
    nMissionsElement.value = nMissions;
}

function saveLocalStorageTableWorkFlows(id) {
    obj = document.getElementById(id);
    //   if (obj.type=="text") obj.value= localStorage.setItem(id,obj.value);
    if (obj.type == "text") localStorage.setItem(id, obj.value);
    if (obj.type == "number") localStorage.setItem(id, obj.value);
    if (obj.type == "checkbox") localStorage.setItem(id, obj.checked);
    if (obj.type == "select-one") localStorage.setItem(id, obj.selectedIndex);
    if (obj.type == undefined) localStorage.setItem(id, obj.innerHTML);
    var valor = localStorage.getItem(id);
    // console.log(id + ": " + valor);
    // readLocalStorageTableMissions(id);
}

function readLocalStorageTableWorkFlows(id) {
    obj = document.getElementById(id);

    if (localStorage.getItem(id) !== undefined && (localStorage.getItem(id) || localStorage.getItem(id) == "")) {
        if (obj.type == "text") obj.value = localStorage.getItem(id);
        if (obj.type == "number") obj.value = localStorage.getItem(id);
        if (obj.type == "checkbox") (obj.checked = localStorage.getItem(id) == "true");
        if (obj.type == "select-one") obj.selectedIndex = localStorage.getItem(id);
        if (obj.type == undefined) obj.innerHTML = localStorage.getItem(id);
        var valor = id + ":" + localStorage.getItem(id);
        // console.log(id + ": " + valor);
        valor = valor;
    } else {
        saveLocalStorageTableWorkFlows(id);
    }
}

function saveLocalStorageTableMissions(id) {
    var obj = document.getElementById(id);
    if (obj == null) return;
    //   if (obj.type=="text") obj.value= localStorage.setItem(id,obj.value);
    if (obj.type == "text") localStorage.setItem(id, obj.value);
    if (obj.type == "number") localStorage.setItem(id, obj.value);
    if (obj.type == "checkbox") localStorage.setItem(id, obj.checked);
    if (obj.type == "select-one") localStorage.setItem(id, obj.selectedIndex);
    if (obj.type == undefined) localStorage.setItem(id, obj.innerHTML);
    var valor = localStorage.getItem(id);
    // console.log(id + ": " + valor);
    // readLocalStorageTableMissions(id);
}

function readLocalStorageTableMissions(id) {
    var obj = document.getElementById(id);

    if (localStorage.getItem(id) !== undefined && (localStorage.getItem(id) || localStorage.getItem(id) == "")) {
        if (id.includes("celda")) return;
        if (obj.type == "text") obj.value = localStorage.getItem(id);
        if (obj.type == "number") obj.value = localStorage.getItem(id);
        if (obj.type == "checkbox") {
            value = localStorage.getItem(id) == "true";
            obj.checked = value;
        }
        if (obj.type == "select-one") obj.selectedIndex = localStorage.getItem(id);
        if (obj.type == undefined) obj.innerHTML = localStorage.getItem(id);
        var valor = id + ":" + localStorage.getItem(id);
        // console.log(id+":"+obj.value);
        valor = valor;
    } else {
        saveLocalStorageTableMissions(id);
    }

}


// Llama a la función crearTablaMissions al cargar la página
window.addEventListener('load', loadData);
window.addEventListener('load', crearTablaMissions);
window.addEventListener('load', crearTablaWorkFlows);
window.addEventListener('load', loadMisions);
window.addEventListener('load', loadWorkFlows);
window.addEventListener('load', initVar);

window.addEventListener("beforeunload", saveJobs);

function saveDataForm() {
    saveJobs()
}


function Debug1() {

}
function Debug2() {
    // const animales = ['perro', 'gato', 'oso', 'pájaro', 'hormiga'];

    // const resultado = animales.filter(animal => animal != 'oso');
    // console.log(resultado);

    // const filtro = jobEventCode.filter(jobCode => jobCode.includes("W--1-"));
    // console.log(filtro);

    // jobEventID.forEach(function (jobCode) {
    //     if (jobCode.includes("W--" + jobID + "-")) {
    //         console.log("List: " + jobCode + " - " + jobEventID[jobCode]);
    //         clearInterval(jobEventID[jobCode]);
    //         jobEventID[jobCode].remove;
    //         jobCode.delte;
    //     }
    // });

    // borrarContenedor("C-M-1-376 19-9-41-57", "Lab-D1-5")

    const celda = document.getElementById(`celdaCommand1`);

    celda.setAttribute("style", "background-color: rgb(3, 88, 31)");
}

function resetStorageData() {
    clearStorageData();
    logStorageData();
    loadData();
    logStorageData();

}

function clearStorageDataWorkFlows() {
    for (var i = localStorage.length - 1; i >= 0; i--) {
        let clave = localStorage.key(i);
        if ((clave != "kmresIP") && (clave !== "nMissions") && (clave != "nWorkFlows")) {
            celdasIDWorkFlows.forEach(function (id) {
                if (clave.includes(id)) localStorage.removeItem(clave);
            });
        }
    }
}

function clearStorageDataMissions() {
    for (var i = localStorage.length - 1; i >= 0; i--) {
        let clave = localStorage.key(i);
        if ((clave != "kmresIP") && (clave !== "nMissions") && (clave != "nWorkFlows")) {
            celdasIDMissions.forEach(function (id) {
                if (clave.includes(id)) localStorage.removeItem(clave);
            });
        }
    }
}

function clearStorageData() {
    for (var i = localStorage.length - 1; i >= 0; i--) {
        let clave = localStorage.key(i);
        if ((clave != "kmresIP") && (clave !== "nMissions") && (clave != "nWorkFlows")) localStorage.removeItem(clave);
    }
    if (localStorage.length > 3) clearStorageData();

}

function logStorageData() {
    var log = ""
    for (var i = 0; i < localStorage.length; i++) {
        let clave = localStorage.key(i);
        log = log + "--" + clave + ": " + localStorage.getItem(clave)
    }
    console.log(log);
}

function loadMisions() {

    for (var n = 1; n <= nMissionsElement.value; n++) {
        celdasIDMissions.forEach(function (id) {
            readLocalStorageTableMissions(id + n);
        });
    }
    for (var n = 1; n <= nMissions.value; n++) {
        toggleMission(n);
    };
}

function loadWorkFlows() {
    for (var n = 1; n <= nWorkFlowsElement.value; n++) {
        celdasIDWorkFlows.forEach(function (id) {
            readLocalStorageTableWorkFlows(id + n);
        });
    }
    for (var n = 1; n <= nWorkFlows.value; n++) {
        toggleWorkFlow(n);
    };
}

function saveJobs() {
    clearStorageData();
    for (var n = 1; n <= nWorkFlowsElement.value; n++) {
        celdasIDWorkFlows.forEach(function (id) {
            saveLocalStorageTableWorkFlows(id + n);
        });
    }
    for (var n = 1; n <= nMissionsElement.value; n++) {
        celdasIDMissions.forEach(function (id) {
            saveLocalStorageTableMissions(id + n);
        });
    }
}

// missionsTableElement.addEventListener('onchange', async (event) => {
//     var targetElement = event.target;
//     var columna = targetElement.cellIndex;
// });

function cambioTablaMisiones() {
    saveJobs();
    // console.log("Tabla salvada");
}

function cambioTablaWorkFlows() {
    saveJobs();
    // console.log("Tabla WorkFlows salvada");
}


async function jobQueryStatusSPS(optSubMission, contador, jobCode, missionNumber, step, missionType) {
    var celdaTimerJob;
    if (optSubMission == optMission) {
        celdaTimerJob = document.getElementById(`celdaTimerMission${missionNumber}`);
    } else {
        celdaTimerJob = document.getElementById(`celdaTimerWorkFlow${missionNumber}`);
    }
    celdaTimerJob.setAttribute("style", "background-color: #345678)");
    const url = get_URL("jobQuery");
    const body = {
        workflowId: "",
        containerCode: "",
        createUsername: "",
        jobCode: jobCode,
        limit: "1",
        maps: [],
        robotId: "",
        sourceValue: "",
        status: "",
        targetCellCode: "",
        workflowCode: "",
        workflowName: ""
    }
    const method = "POST";
    try {
        const responseData = await appFetchSubMissions(url, body, method)
        const misionExiste = function (responseData) {
            // intento capturar un posible error de referencia
            try {
                let existe = responseData.data[0].jobCode;
                return true;
            }
            catch (e) {
                return false;
            }
        }
        if (misionExiste(responseData) == false) {
            console.log("SPS fantasma: " + jobCode);
            JobWorkFlowPendant[missionNumber] = false;
            clearInterval(jobSpsID[jobCode]);
        }
        switch (step) {
            case 1:
                var misionConRobotAsignado = (responseData.data[0].robotId != null)
                if (misionConRobotAsignado) {
                    var jobCodeStep1 = jobSpsID[jobCode]
                    var cont = jobEventCode.push(jobCode);
                    var nextStep;
                    celdaTimerJob.setAttribute("style", "background-color: #345678)");

                    if (optSubMission == optMission) {
                        // JobMissionPendant[missionNumber] = false;
                        // celdaTimerJob = document.getElementById(`celdaTimerMission${missionNumber}`);
                        if (missionType == subMissionType1) {
                            nextStep = step2;
                            showLog("Job " + responseData.data[0].jobCode + " Started ", responseData.data[0].jobCode);
                        } else {
                            showLog("Job " + responseData.data[0].jobCode + " Single move started ", responseData.data[0].jobCode);
                            nextStep = step3;
                        }
                    } else {
                        JobWorkFlowPendant[missionNumber] = false;
                        celdaTimerJob = document.getElementById(`celdaTimerWorkFlow${missionNumber}`);
                        nextStep = step3;
                        showLog("Job " + responseData.data[0].jobCode + " WorkFlow Started ", responseData.data[0].jobCode);
                    }

                    jobSpsID[jobCode] = setInterval(function () {
                        jobQueryStatusSPS(optSubMission, contador, jobCode, missionNumber, nextStep, missionType);
                    }, 1000);
                    clearInterval(jobCodeStep1);
                }
                break;
            case 2:
                var nodoInicioDiferenteTargetNode = (responseData.data[0].beginCellCode !== responseData.data[0].targetCellCode)
                var misionConRobotAsignado = (responseData.data[0].robotId != null)
                var SoloExisteNodoOrigen = responseData.data[0].beginCellCode == responseData.data[0].finalNodeCode
                if ((nodoInicioDiferenteTargetNode)) {
                    JobMissionPendant[missionNumber] = false;
                    celdaTimerJob = document.getElementById(`celdaTimerMission${missionNumber}`);
                    var jobCodeStep1 = jobSpsID[jobCode]
                    var cont = jobEventCode.push(jobCode);

                    showLog("Job " + responseData.data[0].jobCode + " First Node Reached ", responseData.data[0].jobCode);
                    celdaTimerJob.setAttribute("style", "background-color: #345678)");

                    jobSpsID[jobCode] = setInterval(function () {
                        jobQueryStatusSPS(optSubMission, contador, jobCode, missionNumber, step3, missionType);
                    }, 1000);
                    clearInterval(jobCodeStep1);
                }

                break;
            case 3:
                // console.log("WorkFlow sps step2)");
                if (((responseData.data[0].status == 30) || (responseData.data[0].status == 31)) || (responseData.data[0].status == 60)) {
                    if (optSubMission == optMission) {
                        const missionType = document.getElementById(`missionType${missionNumber}`).value;
                        const rmContainer = document.getElementById(`rmContainer${missionNumber}`);
                        if ((rmContainer.checked) && (missionType == "RACK_MOVE")) {
                            await borrarContenedor(responseData.data[0].containerCode);
                        }
                    }
                    incrementarCounter(contador);
                    clearInterval(jobSpsID[jobCode]);
                    jobSpsID[jobCode] = null;
                    var finalStatus;
                    if (responseData.data[0].status == 30) finalStatus = " Finished ";
                    if (responseData.data[0].status == 31) finalStatus = " Cancelled ";
                    if (responseData.data[0].status == 60) finalStatus = " Startup error ";

                    showLog("Job " + responseData.data[0].jobCode + " Finished ", responseData.data[0].jobCode);
                }
                break;
            default:
                //Declaraciones ejecutadas cuando ninguno de los valores coincide con el valor de la expresión
                break;
        }
    } catch (error) {
        console.error('Error:', error);
    };

}

function initVar() {
    // for (var n = 0; n <= JobMissionPendant.length; n++) {
    //     JobMissionPendant[n]=false;
    // }
    // for (var n = 0; n <= JobWorkFlowPendant.length; n++) {
    //     JobWorkFlowPendant[n]=false;
    // }
}