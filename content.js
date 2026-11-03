(() => {
  const api = globalThis.browser ?? globalThis.chrome;
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

  const rules = {
    hideHomeFeed: ["ytd-browse[page-subtype='home'] #contents.ytd-rich-grid-renderer", "ytd-browse[page-subtype='home'] ytd-rich-grid-renderer"],
    hideVideoSidebar: ["#secondary"],
    hideRecommended: ["#related", "ytd-watch-next-secondary-results-renderer"],
    hideLiveChat: ["ytd-live-chat-frame", "ytd-live-chat-renderer"],
    hidePlaylist: ["ytd-playlist-panel-renderer", "ytd-playlist-panel-video-renderer"],
    hideShorts: ["ytd-reel-shelf-renderer", "ytd-rich-shelf-renderer[is-shorts]", "ytd-guide-entry-renderer a[title='Shorts']", "ytd-mini-guide-entry-renderer a[title='Shorts']", "a[href^='/shorts']"],
    hideEndScreenVideos: [".ytp-endscreen-content", ".ytp-ce-element"],
    hideEndScreenCards: [".ytp-cards-button", ".ytp-cards-teaser", ".ytp-ce-element"],
    hideComments: ["ytd-comments", "#comments"],
    hideMixes: ["ytd-radio-renderer", "ytd-compact-radio-renderer", "ytd-rich-item-renderer:has(a[href*='list=RD'])"],
    hideMerch: ["ytd-merch-shelf-renderer", "ytd-ticket-shelf-renderer", "ytd-offer-module-renderer", "ytd-donation-shelf-renderer"],
    hideVideoInfo: ["#info-container", "#info-contents"],
    hideButtonsBar: ["#top-level-buttons-computed", "#menu-container #top-level-buttons-computed"],
    hideChannel: ["#owner", "ytd-video-owner-renderer"],
    hideDescription: ["#description", "ytd-text-inline-expander"],
    hideHeader: ["ytd-masthead"],
    hideNotifications: ["ytd-notification-topbar-button-renderer"],
    hideInaptSearch: [],
    hideExploreTrending: ["ytd-guide-entry-renderer a[href^='/feed/trending']", "ytd-guide-entry-renderer a[href^='/feed/explore']", "ytd-guide-entry-renderer a[href^='/gaming']", "ytd-guide-entry-renderer a[href^='/sports']"],
    hideMoreFromYouTube: ["ytd-guide-section-renderer #footer", "ytd-guide-entry-renderer a[href^='/premium']", "ytd-guide-entry-renderer a[href^='/music']", "ytd-guide-entry-renderer a[href^='/kids']", "ytd-guide-entry-renderer a[href^='/channel/UCqVDpXKLmKeBU_yyt_QkItQ']"],
    hideSubscriptions: ["ytd-guide-entry-renderer a[href^='/feed/subscriptions']", "ytd-mini-guide-entry-renderer a[href^='/feed/subscriptions']"],
    disableAnnotations: [".ytp-ce-element", ".ytp-cards-teaser", ".annotation"]
  };

  const style = document.createElement('style');
  style.id = 'youtube-focus-controls-style';
  (document.head || document.documentElement).appendChild(style);
  let settings = { ...defaults };
  let busy = false;

  function render() {
    const css = [];
    css.push('[data-yfc-inapt-hidden="1"] { display: none !important; }');
    if (settings.enabled !== false) {
      for (const [key, selectors] of Object.entries(rules)) {
        if (settings[key]) css.push(`${selectors.join(',\n')} { display: none !important; }`);
      }
    }
    style.textContent = css.join('\n');
  }

  function applyInaptSearch() {
    const candidates = document.querySelectorAll('ytd-shelf-renderer, ytd-horizontal-card-list-renderer, ytd-item-section-renderer');
    for (const item of candidates) {
      item.removeAttribute('data-yfc-inapt-hidden');
      if (!settings.enabled || !settings.hideInaptSearch || !location.pathname.startsWith('/results')) continue;
      const heading = item.querySelector('#title, h2, h3, [id="title"]')?.textContent?.trim() || '';
      if (/related to your search|latest from|searches related to|people also search for|you might also like/i.test(heading)) {
        item.setAttribute('data-yfc-inapt-hidden', '1');
      }
    }
  }

  function stopAutoplay() {
    if (!settings.enabled || !settings.disableAutoplay || busy || !location.pathname.startsWith('/watch')) return;
    const toggle = document.querySelector('.ytp-autonav-toggle-button');
    if (!toggle || toggle.getAttribute('aria-checked') !== 'true') return;
    busy = true;
    toggle.click();
    setTimeout(() => { busy = false; }, 250);
  }

  function handleSubscriptions() {
    if (settings.enabled && settings.hideSubscriptions && location.pathname === '/feed/subscriptions') {
      location.replace('https://www.youtube.com/');
    }
  }

  function refresh() {
    render();
    applyInaptSearch();
    stopAutoplay();
    handleSubscriptions();
  }

  api.storage.local.get(defaults).then(value => { settings = { ...defaults, ...value }; refresh(); });
  if (api.storage?.onChanged) {
    api.storage.onChanged.addListener((changes, area) => {
      if (area !== 'local') return;
      for (const [key, change] of Object.entries(changes)) settings[key] = change.newValue;
      refresh();
    });
  }

  document.addEventListener('yt-navigate-finish', refresh);
  let mutationTimer;
  new MutationObserver(() => {
    stopAutoplay();
    clearTimeout(mutationTimer);
    mutationTimer = setTimeout(applyInaptSearch, 120);
  }).observe(document.documentElement, { childList: true, subtree: true });
  refresh();
})();
