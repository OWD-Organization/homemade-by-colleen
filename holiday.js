/* Holiday notices. One place to turn them off.
   Set banner.enabled or popup.enabled to false, then ship that file.
   Banner hides itself at the start of Nov 26, 2026 (America/New_York).
   Popup hides itself after the end of Dec 15, 2026 (America/New_York).
   Preview another clock with ?holidayNow=2026-11-20 on any page. */
(function () {
  var CFG = {
    banner: {
      enabled: true,
      hideOn: "20261126",
      storageKey: "hmbc-thanksgiving-banner"
    },
    popup: {
      enabled: true,
      hideAfter: "20261215",
      storageKey: "hmbc-holiday-popup",
      delayMs: 900,
      webp: "build-assets/colleen-christmas-party.webp",
      jpg: "build-assets/colleen-christmas-party.jpg",
      reel: "https://www.instagram.com/reel/DfDDYyugFFU/"
    }
  };

  function nyYMD(date) {
    var parts = new Intl.DateTimeFormat("en-US", {
      timeZone: "America/New_York",
      year: "numeric",
      month: "2-digit",
      day: "2-digit"
    }).formatToParts(date);
    var y = "", m = "", d = "";
    parts.forEach(function (p) {
      if (p.type === "year") y = p.value;
      if (p.type === "month") m = p.value;
      if (p.type === "day") d = p.value;
    });
    return y + m + d;
  }

  function clock() {
    var q = "";
    try { q = new URLSearchParams(location.search).get("holidayNow") || ""; } catch (e) {}
    if (/^\d{4}-\d{2}-\d{2}$/.test(q)) return new Date(q + "T12:00:00-05:00");
    return new Date();
  }

  function stored(key) {
    try { return sessionStorage.getItem(key) === "1"; } catch (e) { return false; }
  }
  function remember(key) {
    try { sessionStorage.setItem(key, "1"); } catch (e) {}
  }

  var today = nyYMD(clock());
  var bannerOn = CFG.banner.enabled && today < CFG.banner.hideOn && !stored(CFG.banner.storageKey);
  var popupOn = CFG.popup.enabled && today <= CFG.popup.hideAfter && !stored(CFG.popup.storageKey);

  if (!bannerOn) document.documentElement.classList.add("hol-banner-off");

  var opener = null;
  var overlay = null;
  var dialog = null;
  var onKey = null;

  function focusables(root) {
    return Array.prototype.slice.call(root.querySelectorAll("a[href], button:not([disabled])"));
  }

  function closePopup() {
    if (!overlay) return;
    document.removeEventListener("keydown", onKey);
    var back = opener;
    overlay.remove();
    overlay = null;
    dialog = null;
    onKey = null;
    if (back && typeof back.focus === "function") back.focus();
  }

  function openPopup() {
    if (dialog || !popupOn) return;
    remember(CFG.popup.storageKey);
    opener = document.activeElement;

    var root = document.createElement("div");
    root.className = "hol-pop";
    root.innerHTML =
      '<div class="hol-pop-panel" role="dialog" aria-modal="true" aria-labelledby="hol-party-title" aria-describedby="hol-party-body">' +
        '<button type="button" class="hol-x" data-hol-close aria-label="Close">X</button>' +
        '<a class="hol-pop-pic" href="' + CFG.popup.reel + '" target="_blank" rel="noopener noreferrer">' +
          '<picture>' +
            '<source srcset="' + CFG.popup.webp + '" type="image/webp">' +
            '<img src="' + CFG.popup.jpg + '" alt="Colleen inviting you to book your Christmas party" width="360" height="640" decoding="async">' +
          '</picture>' +
        '</a>' +
        '<div class="hol-pop-copy">' +
          '<p class="hol-eye">Holiday parties</p>' +
          '<h2 id="hol-party-title">Hosting a holiday party this year?</h2>' +
          '<p id="hol-party-body">You deserve to enjoy your own party. Let me handle the food with the same love and care I\'d use for my own family\'s celebration. Every dish is made in small batches using the same Italian family recipes I\'ve perfected over 40+ years.</p>' +
          '<div class="hol-actions">' +
            '<a class="hol-call" href="tel:+14129988404">Call Colleen: (412) 998-8404</a>' +
            '<button type="button" class="hol-no" data-hol-close>No thanks</button>' +
          '</div>' +
        '</div>' +
      '</div>';

    root.addEventListener("click", function (e) {
      if (e.target === root || e.target.closest("[data-hol-close]")) closePopup();
    });

    onKey = function (e) {
      if (e.key === "Escape") { e.preventDefault(); closePopup(); return; }
      if (e.key !== "Tab" || !dialog) return;
      var nodes = focusables(dialog);
      if (!nodes.length) return;
      var first = nodes[0], last = nodes[nodes.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", onKey);

    document.body.appendChild(root);
    overlay = root;
    dialog = root.querySelector(".hol-pop-panel");
    var closeBtn = root.querySelector(".hol-x");
    if (closeBtn) closeBtn.focus();
  }

  function boot() {
    var banner = document.querySelector(".hol-banner");
    if (banner && bannerOn) {
      var dismiss = banner.querySelector(".hol-x");
      if (dismiss) {
        dismiss.addEventListener("click", function () {
          remember(CFG.banner.storageKey);
          document.documentElement.classList.add("hol-banner-off");
        });
      }
    }
    if (popupOn) window.setTimeout(openPopup, CFG.popup.delayMs);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
