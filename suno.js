/* =========================================================
   suno.js — 프롬프트 박스 복사 버튼
   .prompt[data-copy] 박스 오른쪽 위에 [복사] 버튼을 붙인다.
   ========================================================= */
(function () {
  "use strict";

  function copyText(text, btn) {
    function done() {
      btn.textContent = "복사됨 ✓";
      btn.classList.add("ok");
      setTimeout(function () { btn.textContent = "복사"; btn.classList.remove("ok"); }, 1400);
    }
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(done, fallback);
    } else {
      fallback();
    }
    function fallback() {
      var ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed"; ta.style.opacity = "0";
      document.body.appendChild(ta); ta.select();
      try { document.execCommand("copy"); done(); } catch (e) {}
      ta.remove();
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".prompt[data-copy]").forEach(function (box) {
      var p = box.querySelector("p");
      if (!p) return;
      var btn = document.createElement("button");
      btn.className = "copybtn";
      btn.type = "button";
      btn.textContent = "복사";
      btn.addEventListener("click", function () { copyText(p.innerText.trim(), btn); });
      box.appendChild(btn);
    });
  });
})();
