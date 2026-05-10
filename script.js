/* ═══════════════════════════════════════════════
   PEACHKO — script.js (Optimized & Clean Version)
   - 3개국어 지원 (KO, EN, ZH) / 한국어 기본
   - 드롭다운 방식 언어 전환 및 설정 유지
   - Firebase v10 연동 및 UI 애니메이션
═══════════════════════════════════════════════ */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

// 1. Firebase 설정
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

// 언어 적용 함수
function applyLanguage(lang) {
  document.querySelectorAll("[data-key]").forEach(el => {
    const key = el.getAttribute("data-key");
    if (translations[lang] && translations[lang][key]) {
      el.innerHTML = translations[lang][key];
    }
  });

  localStorage.setItem("peachko_lang", lang);
  currentLang = lang;

  // 상단 버튼 텍스트 업데이트
  const toggleBtn = document.getElementById("langToggle");
  if (toggleBtn) toggleBtn.textContent = lang.toUpperCase();

  // 로그인/로그아웃 버튼 텍스트 즉시 업데이트
  updateAuthButtonText();
}

/* ══════════════════════════════════════
   UI LOGIC (Dropdown, Auth, Scroll)
══════════════════════════════════════ */

// 언어 전환 드롭다운 초기화
function initLanguageSwitcher() {
  const toggleBtn = document.getElementById("langToggle");
  const dropdown = document.getElementById("langDropdown");
  const langOpts = document.querySelectorAll(".lang-opt");

  if (!toggleBtn || !dropdown) return;

  // 버튼 클릭 시 드롭다운 토글
  toggleBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    dropdown.classList.toggle("open");
  });

  // 언어 선택 시 적용
  langOpts.forEach(opt => {
    opt.addEventListener("click", () => {
      const selectedLang = opt.getAttribute("data-lang");
      applyLanguage(selectedLang);
      dropdown.classList.remove("open");
    });
  });

  // 외부 클릭 시 드롭다운 닫기
  document.addEventListener("click", () => {
    dropdown.classList.remove("open");
  });
}

// 로그인/로그아웃 버튼 상태 및 텍스트 관리
function updateAuthButtonText() {
  const authBtn = document.getElementById("authBtn");
  if (!authBtn) return;

  const user = auth.currentUser;
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
}

// 인증 상태 감시
function initAuth() {
  onAuthStateChanged(auth, () => {
    updateAuthButtonText();
  });
}

/* ══════════════════════════════════════
   DATA & ANIMATION
══════════════════════════════════════ */

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
  } catch (err) {
    console.error("아티스트 로드 실패:", err);
  }
}

/* ══════════════════════════════════════
   전체 초기화 (DOM 로드 후 실행)
══════════════════════════════════════ */

document.addEventListener("DOMContentLoaded", () => {
  // 1. 언어 설정 적용
  applyLanguage(currentLang);

  // 2. 각 기능 초기화
  initLanguageSwitcher();
  initAuth();

  // 3. 내부 섹션 스크롤 이동
  document.querySelectorAll("[data-scroll]").forEach(btn => {
    btn.addEventListener("click", () => {
      const target = document.getElementById(btn.getAttribute("data-scroll"));
      if (target) window.scrollTo({ top: target.offsetTop - 80, behavior: "smooth" });
    });
  });

  // 4. 예약 버튼 클릭 이벤트
  document.getElementById("bookRedirectBtn")?.addEventListener("click", () => {
    window.location.href = "booking.html";
  });

  // 5. 스크롤 애니메이션 (Reveal 효과)
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add("visible");
    });
  }, { threshold: 0.1 });

  document.querySelectorAll(".reveal").forEach(el => observer.observe(el));

  // 6. 데이터 로드
  loadArtists();
});