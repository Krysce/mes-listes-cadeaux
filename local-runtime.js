/* Mes listes cadeaux — fonctionnement autonome sur le téléphone.
   Remplace les services de Claude (sauvegarde, photos, téléchargement) par
   leur équivalent local : tout est enregistré sur l'appareil (IndexedDB). */
(function () {
  'use strict';
  if (window.claude) return; // dans Claude, on garde les vrais services
  window.__localApp = true;

  const DB_NAME = 'mes-listes-cadeaux';
  const dbp = new Promise((res, rej) => {
    const r = indexedDB.open(DB_NAME, 1);
    r.onupgradeneeded = () => { r.result.createObjectStore('docs'); r.result.createObjectStore('blobs'); };
    r.onsuccess = () => res(r.result);
    r.onerror = () => rej(r.error);
  });
  const req = (store, mode, fn) => dbp.then(d => new Promise((res, rej) => {
    const t = d.transaction(store, mode); const q = fn(t.objectStore(store));
    t.oncomplete = () => res(q ? q.result : undefined);
    t.onerror = () => rej(t.error); t.onabort = () => rej(t.error);
  }));
  const get = (s, k) => req(s, 'readonly', o => o.get(k));
  const put = (s, k, v) => req(s, 'readwrite', o => o.put(v, k));
  const del = (s, k) => req(s, 'readwrite', o => o.delete(k));
  const keys = s => req(s, 'readonly', o => o.getAllKeys());
  const clone = v => JSON.parse(JSON.stringify(v));

  // Demande au navigateur de ne pas effacer les données
  try { navigator.storage && navigator.storage.persist && navigator.storage.persist(); } catch (e) {}

  const snap = (path, v) => ({ id: path.split('/').pop(), exists: !!v, data: () => (v ? clone(v) : undefined), metadata: {} });
  const db = {
    doc: path => ({
      id: path.split('/').pop(), path,
      get: async () => snap(path, await get('docs', path)),
      set: async v => { await put('docs', path, clone(v)); },
      update: async v => { const cur = (await get('docs', path)) || {}; await put('docs', path, Object.assign(cur, clone(v))); },
      delete: async () => { await del('docs', path); }
    }),
    collection: c => ({
      get: async () => {
        const all = (await keys('docs')).filter(k => typeof k === 'string' && k.startsWith(c + '/') && k.split('/').length === c.split('/').length + 1);
        const docs = [];
        for (const k of all) docs.push(snap(k, await get('docs', k)));
        return { docs, size: docs.length, empty: !docs.length };
      }
    })
  };

  // Photos : stockées sur l'appareil, affichées via des URL locales
  const urls = new Map();
  window.__assetUrl = id => urls.get(id) || null;
  const preload = (async () => {
    try { for (const k of await keys('blobs')) { const b = await get('blobs', k); if (b) urls.set(k, URL.createObjectURL(b)); } } catch (e) {}
  })();
  const newId = () => Array.from(crypto.getRandomValues(new Uint8Array(16)), x => x.toString(16).padStart(2, '0')).join('');
  const assets = {
    upload: async blob => { const id = newId(); await put('blobs', id, blob); urls.set(id, URL.createObjectURL(blob)); return { id, url: urls.get(id), sizeBytes: blob.size, contentType: blob.type }; },
    delete: async id => { await del('blobs', id); const u = urls.get(id); if (u) URL.revokeObjectURL(u); urls.delete(id); },
    list: async () => ({ assets: (await keys('blobs')).map(id => ({ id })), usage: {} })
  };

  // Fichiers : sur téléphone, ouvre le menu de partage (WhatsApp, Mail…), sinon télécharge
  const downloads = {
    save: async ({ filename, data }) => {
      const type = /\.pdf$/i.test(filename) ? 'application/pdf' : /\.json$/i.test(filename) ? 'application/json' : 'application/octet-stream';
      const blob = data instanceof Blob ? data : new Blob([data], { type });
      const file = new File([blob], filename, { type: blob.type || type });
      const touch = matchMedia('(pointer: coarse)').matches;
      if (touch && navigator.canShare && navigator.canShare({ files: [file] })) {
        try { await navigator.share({ files: [file], title: filename }); return; }
        catch (e) { if (e && e.name === 'AbortError') { const err = new Error('cancelled'); err.code = 'cancelled'; throw err; } }
      }
      const a = document.createElement('a'); const u = URL.createObjectURL(blob);
      a.href = u; a.download = filename; document.body.appendChild(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(u), 4000);
    }
  };

  const services = { db, assets, downloads };
  window.claude = { use: async name => { if (name === 'assets') await preload; return services[name] || null; } };

  // Hors ligne : active le service worker
  if ('serviceWorker' in navigator) window.addEventListener('load', () => navigator.serviceWorker.register('./sw.js').catch(() => {}));
})();
