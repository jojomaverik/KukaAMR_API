// api.js

// --- 1) Temel URL & Fetch Wrapper -------------------------------
function getBaseUrl() {
  const ip = document.getElementById('kmresIP').value.trim();
  if (!/^(\d{1,3}\.){3}\d{1,3}$/.test(ip)) {
    throw new Error('Geçersiz IP adresi');
  }
  return `http://${ip}:10870/interfaces/api/amr/`;
}

async function appFetch(url, data, method = 'POST') {
  try {
    const opts = {
      method,
      headers: { 'Content-Type': 'application/json' }
    };
    if (method !== 'GET') opts.body = JSON.stringify(data);

    const res = await fetch(url, opts);
    if (!res.ok) throw new Error(`Sunucu hata: ${res.status}`);
    return await res.json();
  } catch (e) {
    console.error('API hata:', e);
    throw e;
  }
}

// --- 2) Alt Görev Sonuçlarını Görüntüleme -----------------------
function renderMissionResponse(resp) {
  document.getElementById('submissionResponse')
          .textContent = JSON.stringify(resp, null, 2);
}
