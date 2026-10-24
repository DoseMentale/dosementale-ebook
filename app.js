(function () {
  var bar = document.querySelector(".progress > span");
  var nav = document.querySelector(".nav");
  addEventListener("scroll", function () {
    var h = document.documentElement.scrollHeight - innerHeight;
    if (bar) bar.style.width = (h > 0 ? (scrollY / h) * 100 : 0) + "%";
    if (nav) nav.classList.toggle("solid", scrollY > 24);
  }, { passive: true });

  var burger = document.querySelector(".burger");
  var drawer = document.querySelector(".drawer");
  burger.addEventListener("click", function () {
    var open = drawer.classList.toggle("open");
    burger.setAttribute("aria-expanded", open ? "true" : "false");
    drawer.setAttribute("aria-hidden", open ? "false" : "true");
  });
  drawer.addEventListener("click", function (e) {
    if (e.target.closest("a")) {
      drawer.classList.remove("open");
      burger.setAttribute("aria-expanded", "false");
    }
  });

  var canvas = document.querySelector("canvas.drops");
  if (canvas && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
    var ctx = canvas.getContext("2d");
    var drops = [];
    function size() {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      drops = Array.from({ length: 90 }, function () {
        return { x: Math.random() * canvas.width, y: Math.random() * canvas.height, z: 8 + Math.random() * 16, o: 0.15 + Math.random() * 0.35 };
      });
    }
    size();
    addEventListener("resize", size);
    (function tick() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = "rgba(243,239,230,0.55)";
      drops.forEach(function (d) {
        ctx.globalAlpha = d.o;
        ctx.beginPath();
        ctx.moveTo(d.x, d.y);
        ctx.lineTo(d.x + 0.6, d.y + d.z);
        ctx.stroke();
        d.y += d.z * 0.55;
        if (d.y > canvas.height) { d.y = -20; d.x = Math.random() * canvas.width; }
      });
      ctx.globalAlpha = 1;
      requestAnimationFrame(tick);
    })();
  }

  var chapters = [
    ["01", "Qui est le Sigma", "Aucune case ne le tient.", "Origines. Pourquoi aucune étiquette ne tient."],
    ["02", "Alpha. Bêta. Sigma.", "Pourquoi il reste inclassable.", "Le classement te sert à être vu. Pas à te tenir."],
    ["03", "L'esprit", "Observation. La solitude comme levier.", "Indépendance. Tu ne remplis pas le silence. Tu t'en sers."],
    ["04", "Les relations", "Respect sans demande.", "Respect sans spectacle. Amour et amitié sans demande."],
    ["05", "Les forces cachées", "Imprévisible.", "Résilience. Calme dans le chaos. La stratégie qu'on ne voit pas."],
    ["06", "Appliquer", "Le mental, appliqué.", "Exercices. Discipline. Le mental, au quotidien."],
    ["—", "Conclusion", "Les clés. Un plan.", "Pas une théorie de plus."]
  ];
  var buttons = [].slice.call(document.querySelectorAll("[data-chapter]"));
  var view = document.querySelector("[data-view]");
  function show(i) {
    buttons.forEach(function (b, n) {
      b.classList.toggle("is-on", n === i);
      b.setAttribute("aria-pressed", n === i ? "true" : "false");
    });
    var c = chapters[i];
    view.innerHTML = "<p class='kicker'>" + c[0] + "</p><p><strong>" + c[1] + ".</strong> " + c[2] + "</p><p>" + c[3] + "</p>";
    view.classList.remove("fade");
    void view.offsetWidth;
    view.classList.add("fade");
  }
  buttons.forEach(function (b, i) { b.addEventListener("click", function () { show(i); }); });

  var qs = [
    ["Quand la pièce se remplit, tu…", [["Prends la parole pour qu'on te compte.", "scene"], ["Regardes, puis tu choisis si tu parles.", "line"], ["T'effaces pour qu'on ne te voie pas hésiter.", "fade"]]],
    ["On te cherche. Tu…", [["Réponds dans la seconde.", "scene"], ["Laisses trois secondes. Puis tu décides.", "line"], ["Disparais.", "fade"]]],
    ["Ce que tu veux vraiment.", [["Plaire.", "scene"], ["Une indépendance qui ne plie pas.", "line"], ["Qu'on te range dans une case.", "fade"]]],
    ["Le silence, pour toi.", [["Un vide à remplir.", "scene"], ["Plus de bruit qu'un discours.", "line"], ["Une fuite.", "fade"]]]
  ];
  var qi = 0, counts = { scene: 0, line: 0, fade: 0 };
  var qRoot = document.querySelector("[data-quiz]");
  function paint() {
    var q = qs[qi];
    var html = "<p class='q-progress'>" + (qi + 1) + " / " + qs.length + "</p><h3 class='display'>" + q[0] + "</h3><div class='choices'>";
    q[1].forEach(function (opt, i) { html += "<button type='button' data-pick='" + i + "'>" + opt[0] + "</button>"; });
    qRoot.innerHTML = html + "</div>";
    qRoot.className = "q fade";
    qRoot.querySelectorAll("button").forEach(function (b) {
      b.addEventListener("click", function () {
        counts[q[1][+b.getAttribute("data-pick")][1]] += 1;
        qi += 1;
        if (qi < qs.length) paint();
        else end();
      });
    });
  }
  function end() {
    var lead = "Tu as déjà la ligne. Le livre la tient quand personne ne regarde.";
    if (counts.scene >= counts.line && counts.scene >= counts.fade) lead = "Tu joues encore leur pièce. Si tu joues leurs règles, tu restes dedans.";
    else if (counts.fade > counts.line) lead = "Disparaître n'est pas choisir.";
    qRoot.innerHTML = "<p class='kicker'>Le miroir</p><h3 class='display'>" + lead + "</h3><hr class='rule'><p>Pas un test. Une clé.</p><a class='btn' href='https://www.dosementale.fr/paiement'>Télécharge ton exemplaire</a>";
  }
  paint();

  document.querySelectorAll(".faq button").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var open = btn.getAttribute("aria-expanded") === "true";
      btn.setAttribute("aria-expanded", open ? "false" : "true");
      btn.nextElementSibling.classList.toggle("open", !open);
    });
  });
})();
