// main.js

// Yardımcı delay (isteğe bağlı)
const delay = s => new Promise(r => setTimeout(r, s * 1000));
// Hazır butonlar sabit değer değişimi ---
const PRESET_ROBOT_ID   = '11';      
const PRESET_LAYOUT     = '4';           
const PRESET_DISTRICT   = '1';            
const PRESET_TEMPLATE   = 'W000000033';   


// State
const intervals = {};
let mainTimerId = null;
let mainTimerSeconds = 0;

// DOMContentLoaded
window.addEventListener('DOMContentLoaded', () => {
  // Tarih/Saat güncelleme
  const dateDiv = document.getElementById('date-div');
  function updateClock() {
    const now = new Date();
    dateDiv.textContent = now.toLocaleString('tr-TR', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
      hour: '2-digit', minute: '2-digit', second: '2-digit'
    });
  }
  updateClock();
  setInterval(updateClock, 1000);

  // Wi-Fi icon kontrolü
  document.getElementById('saveIPBtn')
          .addEventListener('click', async () => { await checkConnection(); });

  // Main timer start/stop
  document.getElementById('startStopMainTimerWorkFlows')
          .addEventListener('click', toggleMainTimer);

  // Number-of-rows change
  document.getElementById('nWorkFlows')
          .addEventListener('change', renderWorkFlowRows);

  // Start/Stop All
  document.getElementById('startStopAllWorkFlows')
          .addEventListener('click', () => {
    for (let i = 1; i <= getRowCount(); i++) toggleWorkFlow(i);
  });

  // Reset All
  document.getElementById('resetAllWorkFlows')
          .addEventListener('click', () => {
    for (let i = 1; i <= getRowCount(); i++) {
      clearInterval(intervals[i]);
      intervals[i] = null;
      updateCell(i, 0);
      const btn = document.getElementById(`toggleBtn_${i}`);
      btn.textContent = 'Start';
      btn.classList.replace('btn-danger', 'btn-info');
    }
  });

  // İlk tablo render
  renderWorkFlowRows();
});

// Bağlantı testi: /nodes endpoint’ine GET
async function checkConnection() {
  const wifiIcon = document.getElementById('wifiIcon');
  try {
    await appFetch(getBaseUrl() + 'nodes', null, 'GET');
    // Bağlı
    wifiIcon.classList.remove('bi-wifi-off', 'text-danger');
    wifiIcon.classList.add('bi-wifi', 'text-success');
    wifiIcon.title = 'Bağlı';
  } catch {
    // Bağlı değil
    wifiIcon.classList.remove('bi-wifi', 'text-success');
    wifiIcon.classList.add('bi-wifi-off', 'text-danger');
    wifiIcon.title = 'Bağlı değil';
  }
}

// Kaç satır var?
function getRowCount() {
  return parseInt(document.getElementById('nWorkFlows').value, 10) || 1;
}

// Dinamik tablo oluştur
function renderWorkFlowRows() {
  const tbody = document.getElementById('tbodyWorkFlows');
  tbody.innerHTML = '';
  const n = getRowCount();
        
  // Disable Kaldırılacak
  for (let i = 1; i <= n; i++) {
    const tr = document.createElement('tr');
    tr.id = `row_${i}`;
    tr.innerHTML = `
      <td>${i}</td>
      <td><input id="robotIdCtrl_${i}" class="form-control" placeholder="RobotID"></td>
      <td>
        <input id="layoutCtrl_${i}" class="form-control d-inline-block" style="width:4rem" placeholder="Lab"> /
        <input id="districtCtrl_${i}" class="form-control d-inline-block" style="width:4rem" placeholder="D1">
      </td>
      <td><input id="codeCtrl_${i}" class="form-control" placeholder="W00000001"></td>
      <td><input id="intervalCtrl_${i}" class="form-control d-inline-block" style="width:4rem" type="number" value="5" min="1"></td>
      <td id="timerCell_${i}">0:00</td>
      <td>
        <button type="button" id="forceBtn_${i}" class="btn btn-sm btn-warning me-1 disabled">Force</button>
        <button type="button" id="toggleBtn_${i}" class="btn btn-sm btn-info">Start</button>
      </td>`;
    tbody.appendChild(tr);

    document.getElementById(`forceBtn_${i}`)
            .addEventListener('click', () => runSubMissionRow(i, true));
    document.getElementById(`toggleBtn_${i}`)
            .addEventListener('click', () => toggleWorkFlow(i));
  }
}

// Main timer
function toggleMainTimer() {
  const btn  = document.getElementById('startStopMainTimerWorkFlows');
  const disp = document.getElementById('mainFlowTimer');

  if (!mainTimerId) {
    mainTimerId = setInterval(() => {
      mainTimerSeconds++;
      const h = Math.floor(mainTimerSeconds / 3600);
      const m = Math.floor((mainTimerSeconds % 3600) / 60).toString().padStart(2, '0');
      const s = (mainTimerSeconds % 60).toString().padStart(2, '0');
      disp.textContent = `${h}:${m}:${s}`;
    }, 1000);
    btn.textContent = 'Stop Timer';
  } else {
    clearInterval(mainTimerId);
    mainTimerId = null;
    btn.textContent = 'Start Timer';
  }
}

// Her satır için Start/Stop
function toggleWorkFlow(i) {
  const btn = document.getElementById(`toggleBtn_${i}`);

  if (!intervals[i]) {
    runSubMissionRow(i, false);
    const sec = parseInt(document.getElementById(`intervalCtrl_${i}`).value, 10) || 5;
    let counter = 0;
    intervals[i] = setInterval(() => {
      counter++;
      updateCell(i, counter * sec);
      runSubMissionRow(i, false);
    }, sec * 1000);
    btn.textContent = 'Stop';
    btn.classList.replace('btn-info', 'btn-danger');
  } else {
    clearInterval(intervals[i]);
    intervals[i] = null;
    btn.textContent = 'Start';
    btn.classList.replace('btn-danger', 'btn-info');
  }
}

// Satır timer hücresi güncelle
function updateCell(i, totalSec) {
  const m = Math.floor(totalSec / 60);
  const s = (totalSec % 60).toString().padStart(2, '0');
  document.getElementById(`timerCell_${i}`).textContent = `${m}:${s}`;
}

// Template-based workflow çağrısı
async function runSubMissionRow(i, force = false) {
  const robotId      = document.getElementById(`robotIdCtrl_${i}`).value.trim();
  const layout       = document.getElementById(`layoutCtrl_${i}`).value.trim();
  const district     = document.getElementById(`districtCtrl_${i}`).value.trim();
  const templateCode = document.getElementById(`codeCtrl_${i}`).value.trim();

  const now       = new Date();
  const stamp     = `${now.getMilliseconds()}-${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
  const missionCode = `RW-${i}--${stamp}`;

  const url  = getBaseUrl() + 'submitMission';
  const body = {
    orgId:        `${layout}-${district}`,
    requestId:    missionCode,
    missionCode:  missionCode,
    missionType:  'RACK_MOVE',
    robotIds:     [robotId],
    templateCode: templateCode,
    force:        force
  };

  console.log('Submitting WorkFlow:', body);

  try {
    const resp = await appFetch(url, body, 'POST');
    document.getElementById('submissionResponse')
            .textContent = JSON.stringify(resp, null, 2);
  } catch (e) {
    console.error(e);
    document.getElementById('submissionResponse')
            .textContent = 'Hata: ' + e.message;
  }
}

// --- Hazır Butonlar için subMission() Fonksiyonu ---
async function subMission() {
  // 1) Sabit değerleri al
  const robotId      = PRESET_ROBOT_ID;
  const layout       = PRESET_LAYOUT;
  const district     = PRESET_DISTRICT;
  const templateCode = PRESET_TEMPLATE;

  // 2) Benzersiz missionCode/requestId oluştur
  const now         = new Date();
  const stamp       = `${now.getMilliseconds()}-${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
  const missionCode = `RW-1--${stamp}`;  // "1" tek butonun satır numarası

  // 3) Payload’u hazırla
  const url  = getBaseUrl() + 'submitMission';
  const body = {
    orgId:        `${layout}-${district}`, // örn. "4-1"
    requestId:    missionCode,
    missionCode:  missionCode,
    missionType:  'RACK_MOVE',
    robotIds:     [robotId],               // örn. ['11']
    templateCode: templateCode,            // 'W000000033'
    force:        false
  };

  console.log('Preset subMission payload:', body);

  // 4) API çağrısı ve sonucu göster
  try {
    const resp = await appFetch(url, body, 'POST');
    renderMissionResponse(resp);
  } catch (e) {
    console.error(e);
    document.getElementById('submissionResponse')
            .textContent = 'Hata: ' + e.message;
  }
}

