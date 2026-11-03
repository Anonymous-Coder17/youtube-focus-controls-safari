const defaults = {
  enabled: true,
  hideHomeFeed: false, hideVideoSidebar: false, hideRecommended: false,
  hideLiveChat: false, hidePlaylist: false, hideShorts: false,
  hideEndScreenVideos: false, hideEndScreenCards: false, hideComments: false,
  hideMixes: false, hideMerch: false, hideVideoInfo: false,
  hideButtonsBar: false, hideChannel: false, hideDescription: false,
  hideHeader: false, hideNotifications: false, hideInaptSearch: false,
  hideExploreTrending: false, hideMoreFromYouTube: false,
  hideSubscriptions: false, disableAutoplay: false, disableAnnotations: false
};

const api = globalThis.browser ?? globalThis.chrome;
const controls = [...document.querySelectorAll('[data-key]')];
const master = document.getElementById('enabled');
const status = document.getElementById('status');

function setPaused(paused) {
  document.body.classList.toggle('paused', paused);
  for (const control of controls) control.disabled = paused;
}

async function initialize() {
  const values = await api.storage.local.get(defaults);
  master.checked = values.enabled !== false;
  for (const control of controls) control.checked = Boolean(values[control.dataset.key]);
  setPaused(!master.checked);
}

async function save(key, value) {
  await api.storage.local.set({ [key]: value });
  status.textContent = 'Saved just now';
}

master.addEventListener('change', async () => {
  setPaused(!master.checked);
  await save('enabled', master.checked);
});

for (const control of controls) {
  control.addEventListener('change', () => save(control.dataset.key, control.checked));
}

initialize().catch(() => { status.textContent = 'Could not load settings'; });
