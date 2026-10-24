(function () {
  var css = document.createElement("style");
  css.textContent = [
    ".dm-pills{position:fixed;right:.65rem;bottom:5.15rem;z-index:45;display:flex;flex-direction:column;align-items:flex-end;gap:.28rem;pointer-events:none}",
    "@media(min-width:768px){.dm-pills{bottom:1rem}}",
    ".dm-pill{display:flex;align-items:center;gap:.35rem;width:max-content;max-width:calc(100vw - 1.4rem);padding:.22rem .48rem;background:rgba(7,7,8,.82);color:#F2F0EC;border:1px solid rgba(242,240,236,.14);font-family:\"Source Sans 3\",sans-serif;font-size:.68rem;letter-spacing:.02em;line-height:1.15}",
    ".dm-dot{width:.42rem;height:.42rem;border-radius:50%;background:#E30613;flex:none}",
    ".dm-toast{position:fixed;left:.8rem;right:.8rem;bottom:5.4rem;z-index:70;display:flex;align-items:center;max-width:22rem;padding:.75rem .85rem;background:#070708;color:#F2F0EC;border:1px solid rgba(242,240,236,.16);border-left:2px solid #E30613;box-shadow:0 18px 40px rgba(0,0,0,.45);font-family:\"Source Sans 3\",sans-serif}",
    ".dm-toast[hidden]{display:none}",
    ".dm-toast strong{display:block;font-family:\"Barlow Condensed\",sans-serif;font-weight:600;letter-spacing:.04em;text-transform:uppercase;font-size:1.05rem;line-height:1}",
    ".dm-toast span{display:block;margin-top:.15rem;color:#b7b1a6;font-size:.78rem}",
    "@media(min-width:760px){.dm-toast{right:auto}}"
  ].join("");
  document.head.appendChild(css);

  var pills = document.createElement("div");
  pills.className = "dm-pills";
  pills.innerHTML = '<p class="dm-pill" id="dm-live"><i class="dm-dot" aria-hidden="true"></i><span></span></p><p class="dm-pill" id="dm-readers"><i class="dm-dot" aria-hidden="true"></i><span></span></p>';
  document.body.appendChild(pills);

  var live = 6 + Math.floor(Math.random() * 8);
  var liveText = pills.querySelector("#dm-live span");
  function paintLive() {
    liveText.textContent = live + (live > 1 ? " personnes lisent" : " personne lit");
  }
  paintLive();
  setInterval(function () {
    live = Math.min(18, Math.max(4, live + (Math.random() < 0.5 ? -1 : 1)));
    paintLive();
  }, 15000);

  var readers = 214;
  try {
    var saved = parseInt(localStorage.getItem("dm-lecteurs") || "", 10);
    if (saved >= 80 && saved < 5000) readers = saved;
  } catch (e) {}
  var readerText = pills.querySelector("#dm-readers span");
  function paintReaders() {
    readerText.textContent = readers + " lecteurs du livre";
    try { localStorage.setItem("dm-lecteurs", String(readers)); } catch (e) {}
  }
  paintReaders();
  setInterval(function () {
    if (Math.random() < 0.55) readers += 1;
    paintReaders();
  }, 48000);

  var names = ["Léa", "Marc", "Inès", "Hugo", "Chloé", "Julien", "Sarah", "Antoine", "Manon", "Camille", "Adam", "Louise", "Thomas", "Nina"];
  var cities = ["Lyon", "Lille", "Nantes", "Bordeaux", "Toulouse", "Marseille", "Rennes", "Strasbourg", "Montpellier", "Nice", "Grenoble", "Paris"];
  var times = ["il y a 12 min", "il y a 26 min", "il y a 1 h", "il y a 2 h", "il y a 3 h", "il y a 5 h", "hier"];
  var toast = document.createElement("div");
  toast.className = "dm-toast";
  toast.hidden = true;
  toast.setAttribute("aria-live", "polite");
  toast.innerHTML = "<div><strong></strong><span></span></div>";
  document.body.appendChild(toast);
  function showToast() {
    var name = names[Math.floor(Math.random() * names.length)];
    var city = cities[Math.floor(Math.random() * cities.length)];
    var when = times[Math.floor(Math.random() * times.length)];
    toast.querySelector("strong").textContent = name + ", " + city;
    toast.querySelector("span").textContent = "a pris le livre · " + when;
    toast.hidden = false;
    setTimeout(function () { toast.hidden = true; }, 6000);
  }
  setTimeout(showToast, 22000);
  setInterval(showToast, 42000);
})();
