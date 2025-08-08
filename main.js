// main.js

// Yardımcı delay (isteğe bağlı)
const delay = s => new Promise(r => setTimeout(r, s * 1000));

// Hazır butonlar sabit değerleri
const PRESET_ROBOT_ID   = '11';
const PRESET_LAYOUT     = '4';
const PRESET_DISTRICT   = '1';
const PRESET_TEMPLATE   = 'W000000033';
const PRESET_BASE_URL   = 'http://172.31.0.111:10870/interfaces/api/amr/';


// State
const intervals = {};
let mainTimerId = null;
let mainTimerSeconds = 0;

// DOMContentLoaded
window.addEventListener('DOMContentLoaded', () => {
  // 1) Tarih/Saat güncelleme
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

  // 2) Wi-Fi ikon kontrolü: Kaydet’e basınca ve IP alanından çıkınca
  document.getElementById('saveIPBtn')
          .addEventListener('click', checkConnection);
  document.getElementById('kmresIP')
          .addEventListener('blur', checkConnection);

  // 3) Main timer start/stop
  document.getElementById('startStopMainTimerWorkFlows')
          .addEventListener('click', toggleMainTimer);

  // 4) Number-of-rows change
  document.getElementById('nWorkFlows')
          .addEventListener('change', renderWorkFlowRows);

  // 5) Start/Stop All WorkFlows
  document.getElementById('startStopAllWorkFlows')
          .addEventListener('click', () => {
    for (let i = 1; i <= getRowCount(); i++) toggleWorkFlow(i);
  });

  // 6) Reset All
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

  // 7) İlk tablo render
  renderWorkFlowRows();
});

// —————————————————————————————————
// Wi-Fi ikonunu güncelleyen yardımcı
function updateIcon(isConnected, title) {
  const wifiIcon = document.getElementById('wifiIcon');
  if (isConnected) {
    wifiIcon.classList.remove('bi-wifi-off', 'text-danger');
    wifiIcon.classList.add('bi-wifi', 'text-success');
  } else {
    wifiIcon.classList.remove('bi-wifi', 'text-success');
    wifiIcon.classList.add('bi-wifi-off', 'text-danger');
  }
  wifiIcon.title = title;
}

// Bağlantıyı test eden fonksiyon
async function checkConnection() {
  let base;
  try {
    // IP geçersizse burada hata fırlatır
    base = getBaseUrl();
  } catch (e) {
    updateIcon(false, 'Geçersiz IP');
    return;
  }

  try {
    // Sunucuyla bağlantı: /nodes endpoint’i
    const resp = await fetch(base + 'nodes', { method: 'GET' });
    // HTTP 500’den azsa başarılı kabul et
    if (resp.status < 500) {
      updateIcon(true, 'Bağlı');
    } else {
      updateIcon(false, 'Bağlı değil');
    }
  } catch (e) {
    // Ağ hatası veya timeout
    updateIcon(false, 'Bağlı değil');
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
      <td><input id="intervalCtrl_${i}" class="form-control d-inline-block" style="width:4rem"
                 type="number" value="5" min="1"></td>
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

// Main timer start/stop
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

// Satır bazlı Start/Stop
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

// Timer hücresi güncelle
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

  const now         = new Date();
  const stamp       = `${now.getMilliseconds()}-${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
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

// Hazır Butonlar için subMission()
async function subMission() {
  const robotId      = PRESET_ROBOT_ID;
  const layout       = PRESET_LAYOUT;
  const district     = PRESET_DISTRICT;
  const templateCode = PRESET_TEMPLATE;

  const now         = new Date();
  const stamp       = `${now.getMilliseconds()}-${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
  const missionCode = `RW-1--${stamp}`;

  const url  = PRESET_BASE_URL + 'submitMission';
  const body = {
    orgId:        `${layout}-${district}`,
    requestId:    missionCode,
    missionCode:  missionCode,
    missionType:  'RACK_MOVE',
    robotIds:     [robotId],
    templateCode: templateCode,
    force:        false
  };

  console.log('Preset subMission payload:', body);

  try {
    const resp = await appFetch(url, body, 'POST');
    renderMissionResponse(resp);
  } catch (e) {
    console.error(e);
    document.getElementById('submissionResponse')
            .textContent = 'Hata: ' + e.message;
  }
}
