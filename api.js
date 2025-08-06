// api.js

// --- 1) Yardımcı fonksiyonlar ------------------------------------

// KUKA AMR Fleet API temel URL’ini getirir
function getBaseUrl() {
  const ip = document.getElementById('kmresIP').value;
  return `http://${ip}:10870/interfaces/api/amr/`;
}

// Genel fetch wrapper
async function appFetch(url, data, method = 'POST') {
  try {
    const opts = {
      method,
      headers: { 'Content-Type': 'application/json' }
    };
    if (method !== 'GET') opts.body = JSON.stringify(data);
    const res = await fetch(url, opts);
    return await res.json();
  } catch (e) {
    console.error('API hata:', e);
    throw e;
  }
}


// --- 2) Alt Görev (SubMission) ----------------------------------

// Tabloya gelen cevabı basar
function renderMissionResponse(resp) {
  const tb = document.querySelector('#outputTableMission tbody');
  tb.innerHTML = `
    <tr>
      <th>data</th><th>code</th><th>message</th><th>success</th>
    </tr>
    <tr>
      <td>${resp.data}</td>
      <td>${resp.code}</td>
      <td>${resp.message}</td>
      <td>${resp.success}</td>
    </tr>`;
}

// Alt görev gönderir
async function subMission() {
  const base = getBaseUrl();

  // Yeni id’leri oku
  const robotId   = document.getElementById('robotIdCtrl').value;
  const mapCode   = document.getElementById('layoutCtrl').value;
  const floorNo   = document.getElementById('districtCtrl').value;
  const missionCodeInput = document.getElementById('codeCtrl').value;
  const interval  = parseInt(document.getElementById('intervalCtrl').value, 10) || 5;

  const url = base + 'submitMission';
  const payload = {
    orgId:        `${mapCode}-${floorNo}-`,
    requestId:    `req-${Date.now()}`,
    missionCode:  missionCodeInput || `msn-${Date.now()}`,
    missionType:  'MOVE',   // eğer missionType girişi yoksa sabit MOVE
    robotIds:     [robotId],
    missionData: [
      {
        sequence:       1,
        position:       missionCodeInput,     // ya da başka bir alan
        type:           "NODE_POINT",
        passStrategy:   "AUTO",
        waitingMillis:  interval * 1000
      }
    ]
  };

  console.log('subMission payload:', payload);
  try {
    const resp = await appFetch(url, payload);
    renderMissionResponse(resp);
  } catch (e) {
    alert('Görev gönderilirken hata: ' + e);
  }
}



// --- 3) Özel Workflow Başlat ------------------------------------

// Tabloya gelen cevabı basar (aynı renderMissionResponse da kullanılabilir)
async function startWorkflow() {
  const kmresIP = getBaseUrl();
  const url     = kmresIP + 'submitMission';
  const templateCode = document.getElementById('workflow6').value;
  const mapCode  = document.getElementById('mapCode6').value;
  const floorNo  = document.getElementById('floorNumber6').value;

  const payload = {
    orgId:       `${mapCode}-${floorNo}-`,
    requestId:   `req-${Date.now()}`,
    missionCode: `msn-${Date.now()}`,
    missionType: 'RACK_MOVE',
    templateCode
  };

  try {
    const resp = await appFetch(url, payload, 'POST');
    renderMissionResponse(resp);
  } catch (e) {
    alert('Workflow başlatılırken hata: ' + e);
  }
}


// --- 4) Robot Sorgu (Show AMR) -----------------------------------

function renderRobotResponse(data) {
  const tb = document.querySelector('#outputTableAMR tbody');
  let html = `
    <tr>
      <th>Robot ID</th><th>Tip</th><th>Map</th><th>Floor</th>
      <th>containerCode</th><th>status</th><th>missionCode</th><th>nodeCode</th>
    </tr>`;
  data.forEach(d => {
    html += `<tr>
      <td class="link_tabla">${d.robotId}</td>
      <td>${d.robotType}</td>
      <td>${d.mapCode}</td>
      <td>${d.floorNumber}</td>
      <td>${d.containerCode}</td>
      <td>${d.status}</td>
      <td>${d.missionCode}</td>
      <td>${d.nodeCode}</td>
    </tr>`;
  });
  tb.innerHTML = html;
}

async function showAMR() {
  const kmresIP   = getBaseUrl();
  const robotId   = document.getElementById('robotIdCtrl').value;
  const mapCode   = document.getElementById('layoutCtrl').value + '-' + document.getElementById('districtCtrl').value;
  const url       = kmresIP + 'robotQuery';
  const payload   = { floorNumber:"", mapCode, robotId, robotType:"" };

  try {
    const resp = await appFetch(url, payload, 'POST');
    if (resp.data && resp.data.length) renderRobotResponse(resp.data);
    else alert('Robot verisi bulunamadı.');
  } catch (e) {
    alert('Robot sorgulama hatası: ' + e);
  }
}


// --- 5) Container Sorgu -----------------------------------------

function renderContainerResponse(data) {
  const tb = document.querySelector('#outputTableContainer tbody');
  let html = '<tr><th>containerCode</th><th>nodeCode</th><th>model</th><th>area</th><th>full?</th></tr>';
  data.forEach(c => {
    html += `<tr>
      <td>${c.containerCode}</td>
      <td>${c.nodeCode}</td>
      <td>${c.containerModelCode}</td>
      <td>${c.areaCode}</td>
      <td>${c.emptyFullStatus}</td>
    </tr>`;
  });
  tb.innerHTML = html;
}

async function showContainer() {
  const kmresIP                 = getBaseUrl();
  const code = document.getElementById('containerCode0').value;
  const node = document.getElementById('nodeCode0').value;
  const model= document.getElementById('containerModelCode0').value;
  const area = document.getElementById('areaCode0').value;
  const status=document.getElementById('emptyFullStatus0').value;
  const url = kmresIP + 'containerQuery';
  const payload = { containerCode:code, nodeCode:node, containerModelCode:model, areaCode:area, emptyFullStatus:status };

  try {
    const resp = await appFetch(url, payload, 'POST');
    if (resp.data) renderContainerResponse(resp.data);
    else alert('Container verisi bulunamadı.');
  } catch (e) {
    alert('Container sorgulama hatası: ' + e);
  }
}


//  --- 6) Event Listener’lar  ------------------------------------

document.getElementById('saveIPBtn').addEventListener('click', () => {
  localStorage.setItem('kmresIP', document.getElementById('kmresIP').value);
  alert('IP kaydedildi.');
});
document.getElementById('toggleBtn').addEventListener('click', subMission);
document.getElementById('forceBtn').addEventListener('click', () => {
  alert('Force komutu yollandı.');
});

// Formlardaki “Alt Görev Başlat” ve “Başlat” butonları
document.querySelector('[onclick="subMission()"]').addEventListener('click', subMission);
document.querySelector('[onclick="startWorkflow()"]').addEventListener('click', startWorkflow);

window.subMission = subMission;

