/**
 * imgTextProtect.js — Full Maximum Protection for Static Pages (Hardened)
 * Combines your original full protections + extra traps
 */


// ✅ Exempt header/footer logos from protection by enabling pointer events early
document.addEventListener("DOMContentLoaded", function () {
  const exemptLogoElements = document.querySelectorAll(".logo a, .footer-logo a");
  exemptLogoElements.forEach(el => {
    el.style.pointerEvents = "auto"; // ensure clicks work on logos
  });


document.addEventListener("DOMContentLoaded", function () {

  // 🔒 Block right-click globally
  document.addEventListener("contextmenu", function (e) {
    e.preventDefault();
    alert("Right-click is disabled on this site.");
  }, true);

  // 🔒 Disable dragging globally
  document.querySelectorAll("*").forEach(el => el.setAttribute("draggable", "false"));
  document.addEventListener("dragstart", e => e.preventDefault(), true);

  // 🔒 Prevent copy/cut/paste globally
  ["copy", "cut", "paste"].forEach(event => {
    document.addEventListener(event, e => {
      e.preventDefault();
      alert("Copying is disabled on this site.");
    }, true);
  });

  // 🔒 Block keyboard shortcuts (DevTools / Save / Copy / Print / Select All)
  document.addEventListener("keydown", function (e) {
    const key = e.key.toLowerCase();
    const keyCode = e.keyCode || e.which;
    const blockedKeys = ['c','u','i','j','a','x','v','s','p','k'];

    if (
      keyCode === 123 || // F12
      ((e.ctrlKey || e.metaKey) && blockedKeys.includes(key)) || 
      (e.ctrlKey && e.shiftKey && blockedKeys.includes(key)) || 
      (e.altKey && keyCode === 115) // Alt+F4
    ) {
      e.preventDefault();
      alert("This keyboard shortcut is disabled.");
      return false;
    }

    if ((e.ctrlKey || e.metaKey) && key === 'a') { e.preventDefault(); alert("Select All is disabled."); }
    if ((e.ctrlKey || e.metaKey) && key === 'p') { e.preventDefault(); alert("Printing is disabled."); }
  }, true);

  // 🔒 Disable double-click selection only on text
  document.querySelectorAll("p, h1, h2, h3, h4, h5, h6, span, div, li, td, th, pre, code").forEach(el => {
    el.style.userSelect = "none";
    el.addEventListener("dblclick", e => e.preventDefault(), true);
    el.addEventListener("touchstart", e => { if(e.touches.length===1) e.preventDefault(); }, {passive:false});
  });

  // 🔒 Protect images completely: block all mouse/touch interaction
  document.querySelectorAll("img").forEach(img => {
    // ✅ Skip overlay if image is inside exempt logo link
    const isExempt = img.closest(".logo a, .footer-logo a");
    if (isExempt) return;

    img.setAttribute("draggable", "false");

    const wrapper = document.createElement("div");
    wrapper.classList.add("img-wrapper");
    wrapper.style.position = "relative";
    wrapper.style.display = "inline-block";

    const overlay = document.createElement("div");
    overlay.classList.add("img-overlay");
    overlay.style.position = "absolute";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100%";
    overlay.style.height = "100%";
    overlay.style.background = "transparent";
    overlay.style.zIndex = "9999";

    // Block all mouse events on overlay
    ["mousedown", "mouseup", "click", "dblclick", "contextmenu", "dragstart"].forEach(evt => {
      overlay.addEventListener(evt, e => e.preventDefault());
    });

    img.parentNode.insertBefore(wrapper, img);
    wrapper.appendChild(img);
    wrapper.appendChild(overlay);

    // Block touch events for mobile
    ["touchstart", "touchend", "touchmove", "touchcancel"].forEach(evt => {
      img.addEventListener(evt, e => e.preventDefault(), {passive:false});
    });
  });

  // 🖨️ Block printing
  window.onbeforeprint = function () {
    document.body.innerHTML = "<h1 style='color:red;text-align:center;margin-top:20vh;'>⚠️ Printing is disabled on this site.</h1>";
    setTimeout(() => window.close(), 500);
  };

  // 🖐️ Ensure pinch zoom works
  document.documentElement.style.touchAction = "pan-x pan-y";

  // 🧱 Optional: Auto-padding for fixed headers
  const header = document.querySelector("header");
  if (header) document.body.style.paddingTop = `${header.offsetHeight}px`;

  
  // -------------------- HARDENING EXTRAS --------------------

  // 🔒 Trap PrintScreen key
  document.addEventListener("keyup", function(e){
    if(e.key === "PrintScreen"){
      navigator.clipboard.writeText("");
      alert("Screenshots are blocked!");
    }
  });

  // 🔒 Detect DevTools by resize trick
  setInterval(function(){
    if (window.outerWidth - window.innerWidth > 160 || window.outerHeight - window.innerHeight > 160){
      document.body.innerHTML = "<h1 style='color:red;text-align:center;margin-top:20vh;'>DevTools Detected — Access Denied</h1>";
    }
  }, 1000);

  // 🔒 Re-bind protections constantly
  setInterval(()=>{
    document.oncontextmenu = ()=>false;
    document.onselectstart = ()=>false;
    document.onkeydown = (e)=>{e.preventDefault();return false;};
  }, 2000);

});

// overlay creation (already in your JS)
const wrapper = document.createElement("div");
wrapper.classList.add("img-wrapper");
const overlay = document.createElement("div");
overlay.classList.add("img-overlay");

// prevent all mouse events
["mousedown", "mouseup", "click", "dblclick", "contextmenu", "dragstart"].forEach(evt => {
  overlay.addEventListener(evt, e => e.preventDefault());
});

// attach overlay above image safely
if (typeof img !== 'undefined' && img && img.parentNode) {
  const isExempt = img.closest(".logo a, .footer-logo a");
  if (!isExempt) {
    img.parentNode.insertBefore(wrapper, img);
    wrapper.appendChild(img);
    wrapper.appendChild(overlay);
  }
}

/* ============================================================
   >>> APPENDED REINFORCEMENTS (do not remove; nothing above changed)
   ============================================================ */

// 🛡️ Stronger right/middle-click suppression (keeps your original, adds redundancy)
document.oncontextmenu = function(){ return false; };
window.addEventListener("contextmenu", function(e){
  e.preventDefault();
  e.stopPropagation();
  return false;
}, true);

// Block middle-click (auxclick) to stop “open in new tab”
window.addEventListener("auxclick", function(e){
  if (e.button === 1 || e.button === 2) {
    e.preventDefault();
    e.stopPropagation();
    return false;
  }
}, true);

// ✅ Preserve normal browsing (left-clicks on links/buttons/inputs still work)
document.addEventListener("click", function(e){
  // Allow default for interactive elements
  const tag = e.target.closest("a, button, input, textarea, select, label, summary, details");
  if (tag) return; // let it through
}, true);

// 📱 Allow pinch-zoom while blocking single-finger touches on images
(function enablePinchZoomButBlockSingleFinger(){
  // 1) Override the earlier touchAction to allow pinch (we do NOT remove your line above)
  try { document.documentElement.style.touchAction = "manipulation"; } catch(_) {}

  // 2) Add capture-phase listeners that:
  //    - Block single-finger taps/long-press on images
  //    - Allow 2+ fingers (pinch) by stopping lower-level blockers
  document.addEventListener("touchstart", function(e){
    const imgEl = e.target.closest("img, .img-wrapper, .img-overlay");
    if (!imgEl) return;

    if (e.touches && e.touches.length >= 2) {
      // Allow pinch: stop the original bubble-phase preventers from firing
      e.stopImmediatePropagation();
      // no preventDefault → browser can handle pinch
      return;
    } else if (e.touches && e.touches.length === 1) {
      // Block single-finger actions on/over images
      e.preventDefault();
      e.stopImmediatePropagation();
      return false;
    }
  }, true);

  ["touchmove","touchend","touchcancel"].forEach(evt=>{
    document.addEventListener(evt, function(e){
      const imgEl = e.target.closest("img, .img-wrapper, .img-overlay");
      if (!imgEl) return;

      if (e.touches && e.touches.length >= 2) {
        e.stopImmediatePropagation(); // allow pinch gesture to proceed
      } else {
        e.preventDefault(); // block single-finger drag/hold
        e.stopImmediatePropagation();
        return false;
      }
    }, true);
  });
})();

// 🧱 Extra: periodic hardening to reapply global locks
setInterval(function(){
  document.oncontextmenu = function(){ return false; };
}, 1500);

// 🧯 Safety: don’t block scroll/wheel unintentionally
window.addEventListener("wheel", function(){ /* no-op: keep scrolling */ }, {passive:true});


/* ============================================================
   >>> FINAL RIGHT-CLICK / MOUSE / TOUCH PROTECTION LAYER
   ============================================================ */

// Strongest right-click trap (works on all elements)
window.addEventListener("contextmenu", function (e) {
  e.preventDefault();
  e.stopPropagation();
  alert("Right-click is disabled on this site.");
  return false;
}, true);

// Block middle-click (scroll wheel button & auxclick)
window.addEventListener("auxclick", function (e) {
  if (e.button === 1 || e.button === 2) {
    e.preventDefault();
    e.stopPropagation();
    return false;
  }
}, true);

// Preserve left-click for interactive elements
document.addEventListener("click", function (e) {
  const tag = e.target.closest("a, button, input, textarea, select, label, summary, details");
  if (tag) return; // let normal clicks through
}, true);

// Keep scrolling functional
window.addEventListener("wheel", function () {
  // no-op: allow scroll
}, { passive: true });

// Allow pinch zoom but block single-finger long press on images
document.addEventListener("touchstart", function (e) {
  const imgEl = e.target.closest("img, .img-wrapper, .img-overlay");
  if (!imgEl) return;

  if (e.touches && e.touches.length >= 2) {
    // Allow pinch zoom
    e.stopImmediatePropagation();
  } else if (e.touches && e.touches.length === 1) {
    // Block single finger long-press
    e.preventDefault();
    e.stopImmediatePropagation();
    return false;
  }
}, true);

// Extra: periodic re-binding to harden protections
setInterval(function () {
  document.oncontextmenu = () => false;
}, 1500);
/* ============================================================
   >>> FINAL HARDENED IMAGE / TOUCH PROTECTION
   ============================================================ */

// 🚫 Fully block images from opening or being clicked
["click","mousedown","mouseup","dblclick","auxclick"].forEach(evt => {
  document.addEventListener(evt, function(e){
    const imgEl = e.target.closest("img, .img-wrapper, .img-overlay, a[href$='.jpg'], a[href$='.png'], a[href$='.jpeg'], a[href$='.gif']");
    if (imgEl) {
      // ✅ Skip if inside logo link
      const isExempt = imgEl.closest(".logo a, .footer-logo a");
      if (isExempt) return;

      e.preventDefault();
      e.stopImmediatePropagation();
      return false;
    }
  }, true);
});

// 📱 Mobile touch handling
document.addEventListener("touchstart", function (e) {
  const imgEl = e.target.closest("img, .img-wrapper, .img-overlay");
  if (!imgEl) return;

  // ✅ Skip if inside logo link
  const isExempt = imgEl.closest(".logo a, .footer-logo a");
  if (isExempt) return;

  if (e.touches.length >= 2) {
    // ✅ Allow pinch zoom (2+ fingers)
    e.stopImmediatePropagation();
  } else {
    // 🚫 Block single-finger tap/long press
    e.preventDefault();
    e.stopImmediatePropagation();
    return false;
  }
}, true);

["touchmove","touchend","touchcancel"].forEach(evt=>{
  document.addEventListener(evt, function(e){
    const imgEl = e.target.closest("img, .img-wrapper, .img-overlay");
    if (!imgEl) return;

    // ✅ Skip if inside logo link
    const isExempt = imgEl.closest(".logo a, .footer-logo a");
    if (isExempt) return;

    if (e.touches && e.touches.length >= 2) {
      // ✅ Allow pinch zoom
      e.stopImmediatePropagation();
    } else {
      // 🚫 Block single-finger drag/hold
      e.preventDefault();
      e.stopImmediatePropagation();
      return false;
    }
  }, true);
});
