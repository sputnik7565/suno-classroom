/* =========================================================
   deck.js — 슬라이드 번호 매기기, 이미지 슬롯 자동 로딩,
   PDF 인쇄 / HTML 다운로드
   ========================================================= */
(function () {
  "use strict";

  // 1) 슬라이드 번호 (타이틀 제외 전 슬라이드 우하단 표기)
  function numberSlides() {
    var slides = document.querySelectorAll(".slide");
    slides.forEach(function (s, i) {
      if (s.classList.contains("slide--title")) return;
      if (s.querySelector(".slide__num")) return;
      var n = document.createElement("div");
      n.className = "slide__num";
      n.textContent = "p." + (i + 1);
      s.appendChild(n);
    });
  }

  // 2) 이미지 슬롯: data-img 파일을 시도 → 실패 시 플레이스홀더 유지
  //    .jpg / .png 둘 다 자동 탐색
  function hydrateImages() {
    var slots = document.querySelectorAll(".imgslot[data-img]");
    slots.forEach(function (slot) {
      var base = slot.getAttribute("data-img");      // 예: images/1강/lec1_p06_01
      var exts = ["jpg", "jpeg", "png", "webp"];
      var idx = 0;

      var img = document.createElement("img");
      img.alt = slot.getAttribute("data-alt") || "";

      function tryNext() {
        if (idx >= exts.length) { return; } // 모두 실패 → 플레이스홀더 유지
        img.src = base + "." + exts[idx++] + "?v=" + Date.now();
      }
      img.onload = function () {
        var ph = slot.querySelector(".ph");
        if (ph) ph.style.display = "none";
        slot.insertBefore(img, slot.firstChild);
      };
      img.onerror = tryNext;
      tryNext();
    });
  }

  // 3) 플레이스홀더에 기대 파일명/규격 자동 표기
  function fillPlaceholders() {
    document.querySelectorAll(".imgslot[data-img]").forEach(function (slot) {
      if (slot.querySelector(".ph")) return;
      var base = slot.getAttribute("data-img");
      var fname = base.split("/").pop();
      var ratio = slot.classList.contains("r34") ? "세로 3:4" :
                  slot.classList.contains("r43") ? "4:3" :
                  slot.classList.contains("r11") ? "1:1" : "16:9";
      var ph = document.createElement("div");
      ph.className = "ph";
      ph.innerHTML =
        '<div class="ic">🖼️</div>' +
        '<div class="fn">' + fname + '.jpg</div>' +
        '<div class="spec">이 파일을 폴더에 넣으면 자동 표시 · 권장 ' + ratio + '</div>';
      slot.appendChild(ph);
    });
  }

  // 4) 툴바 버튼
  function wireToolbar() {
    var pdf = document.getElementById("btn-pdf");
    if (pdf) pdf.addEventListener("click", function () { window.print(); });
    var dl = document.getElementById("btn-html");
    if (dl) dl.addEventListener("click", function () {
      var a = document.createElement("a");
      a.href = location.href.split("?")[0];
      a.download = (document.title || "lecture") + ".html";
      document.body.appendChild(a); a.click(); a.remove();
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    fillPlaceholders();
    hydrateImages();
    numberSlides();
    wireToolbar();
  });
})();
