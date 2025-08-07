// main.js

// — Yardımcılar — //
const delay = s => new Promise(r => setTimeout(r, s * 1000));
const intervals = {};         // Her satır için interval ID’leri
let mainTimerId = null;       // Ana timer
let mainTimerSeconds = 0;

// — 1) DOMContentLoaded — //
window.addEventListener('DOMContentLoaded', () => {
  // a) Ana timer
  document.getElementById('startStopMainTimerWorkFlows')
          .addEventListener('click', toggleMainTimer);
  // b) Kaç satır
  const nInp = document.getElementById('nWorkFlows');
  nInp.addEventListener('change', renderWorkFlowRows);
  // c) Hepsini başlat/durdur
  document.getElementById('startStopAllWorkFlows')
          .addEventListener('click', () => {
    for (let i=1; i<= getRowCount(); i++) {
      toggleWorkFlow(i);
    }
  });
  // d) Hepsini sıfırla
  document.getElementById('resetAllWorkFlows')
          .addEventListener('click', () => {
    for (let i=1; i<= getRowCount(); i++) {
      clearInterval(intervals[i]);
      intervals[i] = null;
      updateCell(i, 0);
      setButtonText(i, 'Start');
    }
  });

  // İlk tablo render
  renderWorkFlowRows();
});

// — 2) Satır sayısını döner — //
function getRowCount() {
  return parseInt(document.getElementById('nWorkFlows').value, 10) || 1;
}

// — 3) Tablo satırlarını yeniden çiz — //
function renderWorkFlowRows() {
  const tbody = document.getElementById('tbodyWorkFlows');
  tbody.innerHTML = '';
  const n = getRowCount();

  for (let i=1; i<=n; i++) {
    const tr = document.createElement('tr');
    tr.id = `row_${i}`;
    tr.innerHTML = `
      <td>${i}</td>
      <td><input id="robotIdCtrl_${i}"  class="form-control" placeholder="RobotID"></td>
      <td>
        <input id="layoutCtrl_${i}"   class="form-control d-inline-block" style="width:4rem" placeholder="Lab">
        /
        <input id="districtCtrl_${i}" class="form-control d-inline-block" style="width:4rem" placeholder="D1">
      </td>
      <td><input id="codeCtrl_${i}"  class="form-control" placeholder="W00000001"></td>
      <td><input id="intervalCtrl_${i}" class="form-control d-inline-block" style="width:4rem"
                 type="number" value="5" min="1"></td>
      <td id="timerCell_${i}">0:00</td>
      <td>
        <button type="button" id="forceBtn_${i}" class="btn btn-sm btn-warning me-1">Force</button>
        <button type="button" id="toggleBtn_${i}" class="btn btn-sm btn-info">Start</button>
      </td>`;
    tbody.appendChild(tr);

    // O satırın düğmelerine click handler ekle
    document.getElementById(`forceBtn_${i}`)
            .addEventListener('click', () => runSubMissionRow(i, true));
    document.getElementById(`toggleBtn_${i}`)
            .addEventListener('click', () => toggleWorkFlow(i));
  }
}

// — 4) Start/Stop ana timer — //
function toggleMainTimer() {
  const btn = document.getElementById('startStopMainTimerWorkFlows');
  const disp = document.getElementById('mainFlowTimer');
  if (!mainTimerId) {
    mainTimerId = setInterval(() => {
      mainTimerSeconds++;
      const h = Math.floor(mainTimerSeconds/3600);
      const m = Math.floor((mainTimerSeconds%3600)/60).toString().padStart(2,'0');
      const s = (mainTimerSeconds%60).toString().padStart(2,'0');
      disp.textContent = `${h}:${m}:${s}`;
    }, 1000);
    btn.textContent = 'Stop Timer';
  } else {
    clearInterval(mainTimerId);
    mainTimerId = null;
    btn.textContent = 'Start Timer';
  }
}

// — 5) Her satır için Start/Stop — //
function toggleWorkFlow(i) {
  const btn = document.getElementById(`toggleBtn_${i}`);
  if (!intervals[i]) {
    // 1) İlk tetikleme
    runSubMissionRow(i, false);
    // 2) Döngüye al
    const sec = parseInt(
      document.getElementById(`intervalCtrl_${i}`).value, 10
    ) || 5;
    let counter = 0;
    intervals[i] = setInterval(() => {
      counter++;
      updateCell(i, counter * sec);
      runSubMissionRow(i, false);
    }, sec * 1000);
    btn.textContent = 'Stop';
    btn.classList.replace('btn-info','btn-danger');
  } else {
    clearInterval(intervals[i]);
    intervals[i] = null;
    btn.textContent = 'Start';
    btn.classList.replace('btn-danger','btn-info');
  }
}

// — 6) Sayaç hücresini güncelle — //
function updateCell(i, totalSec) {
  const m = Math.floor(totalSec/60);
  const s = (totalSec%60).toString().padStart(2,'0');
  document.getElementById(`timerCell_${i}`)
          .textContent = `${m}:${s}`;
}

// 7) Force veya normal WorkFlow çağrısı — güncellendi!
async function runSubMissionRow(i, force = false) {
  // 1. Input’ları oku
  const robotId     = document.getElementById(`robotIdCtrl_${i}`).value.trim();
  const layout      = document.getElementById(`layoutCtrl_${i}`).value.trim();
  const district    = document.getElementById(`districtCtrl_${i}`).value.trim();
  const templateCode= document.getElementById(`codeCtrl_${i}`).value.trim();

  // 2. missionCode & requestId oluştur (örnekteki format)
  const now       = new Date();
  const timeStamp = now.getMilliseconds() + "-" + now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds();
  const station   = i;
  const missionCode = `RW-${station}--${timeStamp}`;

  // 3. Payload’u örnekteki gibi hazırla
  const url = getBaseUrl() + 'submitMission';
  const body = {
    orgId:       `${layout}-${district}`, // ör. Lab-D1
    requestId:   missionCode,             // ör. "RW-1--123-14:05:09"
    missionCode: missionCode,             // aynı değer
    missionType: 'RACK_MOVE',             // sabit
    robotIds:    [robotId],               // dizi içinde robot ID
    templateCode: templateCode,           // input’tan gelen şablon kodu
    force:       force                    // örnekte yok ama ekledik
  };

  console.log('Submitting WorkFlow:', body);

  // 4. Çağrıyı yap ve sonucu göster
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

