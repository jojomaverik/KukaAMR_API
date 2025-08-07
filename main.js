// main.js

// 1) Tarih ve saat güncelleme
window.addEventListener('DOMContentLoaded', () => {
  const dateDiv = document.getElementById('date-div');
  function updateClock() {
    const now = new Date();
    dateDiv.textContent = now.toLocaleString('tr-TR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  }
  updateClock();
  setInterval(updateClock, 1000);
});

// 2) Start/Stop ve Force butonları için kontrol
window.addEventListener('DOMContentLoaded', () => {
  const startBtn = document.getElementById('startStopWorkflowBtn');
  const forceBtn = document.getElementById('forceWorkflowBtn');
  let intervalId = null;

  // Başlat / Durdur
  startBtn.addEventListener('click', async () => {
    if (startBtn.textContent === 'Start') {
      // Tek seferlik gönder
      await runSubMission(false);
      // Ardından interval’li döngü
      const sec = parseInt(document.getElementById('intervalCtrl').value, 10) || 5;
      intervalId = setInterval(() => runSubMission(false), sec * 1000);

      startBtn.textContent = 'Stop';
      startBtn.classList.replace('btn-info', 'btn-danger');
    } else {
      // Durdur
      clearInterval(intervalId);
      startBtn.textContent = 'Start';
      startBtn.classList.replace('btn-danger', 'btn-info');
    }
  });

  // Force düğmesi (her basıldığında zorla gönderir)
  forceBtn.addEventListener('click', () => {
    runSubMission(true);
  });
});

// 3) Alt Görev API çağrısını yapan yardımcı fonksiyon
async function runSubMission(force = false) {
  const robotId  = document.getElementById('robotIdCtrl').value.trim();
  const layout   = document.getElementById('layoutCtrl').value.trim();
  const district = document.getElementById('districtCtrl').value.trim();
  const code     = document.getElementById('codeCtrl').value.trim();

  const url  = getBaseUrl() + 'submitMission';
  const body = {
    robotIds: [robotId],
    orgId: `${layout}-${district}-`,
    requestId: `req-${Date.now()}`,
    missionCode: code,
    missionType: 'MOVE',
    missionData: [{
      sequence:      1,
      position:      code,
      type:          "NODE_POINT",
      passStrategy:  "AUTO",
      waitingMillis: (parseInt(document.getElementById('intervalCtrl').value, 10) || 5) * 1000
    }],
    force: force
  };

  try {
    const resp = await appFetch(url, body, 'POST');
    renderMissionResponse(resp);
  } catch (err) {
    console.error(err);
    document.getElementById('submissionResponse')
            .textContent = 'Hata: ' + err.message;
  }
}
