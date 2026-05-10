/* ═══════════════════════════════════════════════
   PEACHKO — script.js (Dropdown & Persistence Fix)
   - 3개국어 지원 (KO, EN, ZH) / 한국어 기본
   - 드롭다운 리스트 방식 언어 전환
   - 페이지 이동 시 언어 설정 유지 (LocalStorage)
═══════════════════════════════════════════════ */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

// 1. Firebase 설정 (주신 실제 키 고정)
const firebaseConfig = {
  apiKey: "AIzaSyAyy0UF4jFUotKJubr5QcErYilCvaNn-PY",
  authDomain: "peachko-dev.firebaseapp.com",
  projectId: "peachko-dev",
  storageBucket: "peachko-dev.firebasestorage.app",
  messagingSenderId: "561367230685",
  appId: "1:561367230685:web:5576c1897b5989c243d334"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

/* ══════════════════════════════════════
   LANGUAGE & TRANSLATION (KO, EN, ZH)
══════════════════════════════════════ */

// 초기 언어 설정: 저장된 값이 없으면 'ko'(한국어)를 기본으로 함
let currentLang = localStorage.getItem("peachko_lang") || "ko";

const translations = {
  ko: {
    nav0: "서비스", nav1: "아티스트", nav2: "후기", nav_book: "지금 예약", nav_login: "로그인", nav_logout: "로그아웃",
    hero_h: "당신만을 위한 <span class='accent'>K-뷰티</span> <em>큐레이션</em>",
    hero_sub: "전문 아티스트와 함께 서울의 가장 감각적인 뷰티를 경험하세요. 외국인 관광객을 위한 프리미엄 매칭 플랫폼.",
    hero_cta: "지금 예약하기", hero_cta2: "아티스트 보기", f_cta: "예약 페이지로 이동", footer: "© 2026 Peachko · 서울"
  },
  en: {
    nav0: "Services", nav1: "Artists", nav2: "Reviews", nav_book: "Book Now", nav_login: "Login", nav_logout: "Logout",
    hero_h: "Premium <span class='accent'>K-Beauty</span> <em>Curation</em>",
    hero_sub: "Experience Seoul's most trendsetting beauty with expert artists. We connect global travelers with premium professionals.",
    hero_cta: "Book Your Look", hero_cta2: "See Artists", f_cta: "Go to Booking Page", footer: "© 2026 Peachko · Seoul"
  },
  zh: {
    nav0: "服务", nav1: "艺术家", nav2: "评价", nav_book: "现在预订", nav_login: "登录", nav_logout: "登出",
    hero_h: "为您量身定制的 <span class='accent'>K-Beauty</span> <em>策划</em>",
    hero_sub: "与专业艺术家一起体验首尔最前卫的美妆。为外国游客提供的优质匹配平台。",
    hero_cta: "现在预订", hero_cta2: "查看艺术家", f_cta: "前往预订页面", footer: "© 2026 Peachko · 首尔"
  }
};

function applyLanguage(lang) {
  document.querySelectorAll("[data-key]").forEach(el => {
    const key = el.getAttribute("data-key");
    if (translations[lang] && translations[lang][key]) {
      el.innerHTML = translations[lang][key];
    }
  });
  localStorage.setItem("peachko_lang", lang);
  currentLang = lang;

  // 버튼 텍스트 업데이트 (예: KO, EN, ZH)
  const toggleBtn = document.getElementById("langToggle");
  if (toggleBtn) toggleBtn.textContent = lang.toUpperCase();
}

/* ══════════════════════════════════════
   DROPDOWN & UI LOGIC
══════════════════════════════════════ */

function initLanguageSwitcher() {
  const toggleBtn = document.getElementById("langToggle");
  const dropdown = document.getElementById("langDropdown");
  const langOpts = document.querySelectorAll(".lang-opt");

  if (!toggleBtn || !dropdown) return;

  // 1. 버튼 클릭 시 드롭다운 열기/닫기
  // 기존의 단순 클릭 로직을 삭제하고 아래로 교체
  function initLanguageSwitcher() {
    const toggleBtn = document.getElementById("langToggle");
    const dropdown = document.getElementById("langDropdown");
    const langOpts = document.querySelectorAll(".lang-opt");

    if (!toggleBtn || !dropdown) return;

    // 1. 메인 버튼 클릭 시 리스트 열기/닫기
    toggleBtn.addEventListener("click", (e) => {
      e.stopPropagation(); // 부모로 클릭 이벤트가 전달되지 않게 막음
      dropdown.classList.toggle("open");
    });

    // 2. 언어 목록(KO, EN, ZH) 중 하나를 클릭했을 때
    langOpts.forEach(opt => {
      opt.addEventListener("click", () => {
        const selectedLang = opt.getAttribute("data-lang");
        applyLanguage(selectedLang); // 언어 적용 함수 실행
        dropdown.classList.remove("open"); // 선택 후 리스트 닫기
      });
    });

    // 3. 리스트 바깥쪽을 클릭하면 리스트 닫기
    document.addEventListener("click", () => {
      dropdown.classList.remove("open");
    });
  }

  // 초기화 부분에서 실행
  initLanguageSwitcher();

  // 2. 리스트에서 언어 선택 시
  langOpts.forEach(opt => {
    opt.addEventListener("click", () => {
      const selectedLang = opt.getAttribute("data-lang");
      applyLanguage(selectedLang);
      dropdown.classList.remove("open");
      // 선택 후 페이지 새로고침 없이 바로 적용되므로 필요시 reload() 할 수도 있음
      // 여기서는 실시간으로 텍스트만 바꿈
    });
  });

  // 3. 외부 클릭 시 드롭다운 닫기
  document.addEventListener("click", () => {
    dropdown.classList.remove("open");
  });
}

function initAuth() {
  const authBtn = document.getElementById("authBtn");
  if (!authBtn) return;

  onAuthStateChanged(auth, (user) => {
    if (user) {
      authBtn.innerHTML = translations[currentLang].nav_logout;
      authBtn.onclick = async () => {
        await signOut(auth);
        location.reload();
      };
    } else {
      authBtn.innerHTML = translations[currentLang].nav_login;
      authBtn.onclick = () => { window.location.href = "login.html"; };
    }
  });
}

/* ══════════════════════════════════════
   INIT
══════════════════════════════════════ */

document.addEventListener("DOMContentLoaded", () => {
  // 저장된 언어 즉시 적용
  applyLanguage(currentLang);

  initLanguageSwitcher();
  initAuth();

  // 스크롤 이동 로직
  document.querySelectorAll("[data-scroll]").forEach(btn => {
    btn.addEventListener("click", () => {
      const target = document.getElementById(btn.getAttribute("data-scroll"));
      if (target) window.scrollTo({ top: target.offsetTop - 80, behavior: "smooth" });
    });
  });

  // 예약 페이지 이동
  document.getElementById("bookRedirectBtn")?.addEventListener("click", () => {
    window.location.href = "booking.html";
  });

  // 애니메이션 & 데이터 로딩
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add("visible"); });
  }, { threshold: 0.1 });
  document.querySelectorAll(".reveal").forEach(el => observer.observe(el));

  loadArtists();
});

async function loadArtists() {
  const container = document.getElementById('artists-container');
  if (!container) return;
  try {
    const snapshot = await getDocs(collection(db, "artists"));
    container.innerHTML = "";
    snapshot.forEach((docSnap) => {
      const artist = docSnap.data();
      const card = `
        <div class="artist-card reveal visible" onclick="location.href='artist.html?id=${docSnap.id}'">
          <div class="artist-photo"><img src="${artist.photoUrl || ''}" alt=""></div>
          <div class="artist-info">
            <h3 class="artist-name">${artist.name}</h3>
            <p class="artist-spec">${(artist.services || []).join(' · ')}</p>
            <button class="btn-ghost artist-btn">View Portfolio</button>
          </div>
        </div>`;
      container.insertAdjacentHTML('beforeend', card);
    });
  } catch (err) { console.error(err); }
}