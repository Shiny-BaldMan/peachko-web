/* ═══════════════════════════════════════════════
   PEACHKO — script.js (Merged & Optimized Version)
   UI/UX: Premium Edition (vanilla JS)
   Backend: Firebase v10, Firestore DB, LocalStorage
═══════════════════════════════════════════════ */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
import { getFirestore, collection, getDocs, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

// 1. Firebase Configuration (Local & Production Support)
let firebaseConfig;

if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
  console.log("🛠️ 로컬 테스트 모드입니다.");
  firebaseConfig = {
    apiKey: "AIzaSyAyy0UF4jFUotKJubr5QcErYilCvaNn-PY",
    authDomain: "peachko-dev.firebaseapp.com",
    projectId: "peachko-dev",
    storageBucket: "peachko-dev.firebasestorage.app",
    messagingSenderId: "561367230685",
    appId: "1:561367230685:web:5576c1897b598"
  };
} else {
  firebaseConfig = {
    apiKey: "AIzaSyAyy0UF4jFUotKJubr5QcErYilCvaNn-PY",
    authDomain: "peachko-dev.firebaseapp.com",
    projectId: "peachko-dev",
    storageBucket: "peachko-dev.firebasestorage.app",
    messagingSenderId: "561367230685",
    appId: "1:561367230685:web:5576c1897b598"
  };
}

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

/* ══════════════════════════════════════
   LANGUAGE & TRANSLATION ENGINE
══════════════════════════════════════ */

const LANG_LABELS = { en: "EN", ko: "KO" };
let currentLang = localStorage.getItem("peachko_lang") || "en";

const translations = {
  en: {
    nav0: "Services", nav1: "Artists", nav2: "Reviews", nav_book: "Book Now", nav_login: "Login", nav_logout: "Logout",
    hero_h: "Premium <span class='accent'>K-Beauty</span> <em>Curation</em>",
    hero_sub: "Experience Seoul's most trendsetting beauty with expert artists. We connect global travelers with premium K-beauty professionals.",
    hero_cta: "Book Your Look", hero_cta2: "See Artists",
    stat_art: "Artists", stat_exp: "Experiences", stat_rev: "Reviews",
    prob_bad_t: "Common Issues", prob_good_t: "Peachko Solution",
    prob_bad_1: "Language barriers in booking", prob_bad_2: "Unclear pricing structures", prob_bad_3: "Unverified service quality",
    prob_good_1: "Real-time multilingual support", prob_good_2: "Transparent fixed pricing", prob_good_3: "Strictly vetted professionals",
    how_h: "How it Works",
    step1_t: "Find Style", step1_d: "Explore portfolios and pick your favorite look.",
    step2_t: "Easy Booking", step2_d: "Select date & time and confirm instantly.",
    step3_t: "Premium Care", step3_d: "Enjoy top-tier beauty services on-site.",
    svc_h: "Our Services",
    svc1_t: "Personal Makeup", svc1_d: "Tailored makeup based on your features and tone.",
    svc2_t: "K-Pop Idol Hair", svc2_d: "Trendy idol styling and professional hair care.",
    svc3_t: "Wedding & Snap", svc3_d: "Perfecting your most beautiful moments.",
    art_h: "Meet Our Artists",
    art_sub: "Professional K-beauty artists vetted for international clients.",
    rev_h: "Happy Clients",
    rev1: "Best decision of my trip! The artist was so kind and professional.",
    rev2: "I was worried about the language, but the service made it easy.",
    rev3: "Getting an idol-style makeup was like a dream come true.",
    book_h: "Begin Your Transformation",
    book_sub: "Proceed to our secure booking page to enter your details.",
    f_cta: "Go to Booking Page",
    chat_h: "Need Help?",
    chat_sub: "Questions about services or custom requests?",
    footer: "© 2026 Peachko · Seoul, Korea",
  },
  ko: {
    nav0: "서비스", nav1: "아티스트", nav2: "후기", nav_book: "지금 예약", nav_login: "로그인", nav_logout: "로그아웃",
    hero_h: "당신만을 위한 <span class='accent'>K-뷰티</span> <em>큐레이션</em>",
    hero_sub: "전문 아티스트와 함께 서울의 가장 감각적인 뷰티를 경험하세요. 외국인 관광객을 위한 프리미엄 매칭 플랫폼.",
    hero_cta: "지금 예약하기", hero_cta2: "아티스트 보기",
    stat_art: "아티스트", stat_exp: "누적 경험", stat_rev: "고객 만족",
    prob_bad_t: "기존의 불편함", prob_good_t: "PEACHKO의 솔루션",
    prob_bad_1: "예약 과정의 언어 장벽", prob_bad_2: "불투명한 가격 체계", prob_bad_3: "검증되지 않은 퀄리티",
    prob_good_1: "다국어 실시간 예약 지원", prob_good_2: "정찰제 기반의 투명한 결제", prob_good_3: "엄격하게 선별된 전문가",
    how_h: "이용 방법",
    step1_t: "스타일 탐색", step1_d: "포트폴리오를 보고 원하는 스타일을 선택하세요.",
    step2_t: "간편 예약", step2_d: "날짜와 시간을 정하고 예약을 확정합니다.",
    step3_t: "프리미엄 케어", step3_d: "현장에서 최상의 서비스를 경험하세요.",
    svc_h: "제공 서비스",
    svc1_t: "퍼스널 메이크업", svc1_d: "개인의 특징과 톤에 맞춘 맞춤형 메이크업.",
    svc2_t: "K-Pop 아이돌 헤어", svc2_d: "트렌디한 아이돌 스타일링과 전문 케어.",
    svc3_t: "웨딩 & 스냅", svc3_d: "특별한 날을 위한 가장 아름다운 순간의 완성.",
    art_h: "전문 아티스트",
    art_sub: "외국인 고객 응대에 최적화된 검증된 아티스트들을 만나보세요.",
    rev_h: "생생한 후기",
    rev1: "한국 여행 중 최고의 선택이었어요! 아티스트분이 정말 친절하셨습니다.",
    rev2: "언어 소통이 걱정됐는데 서비스 덕분에 정말 편안했습니다.",
    rev3: "아이돌 스타일 메이크업을 직접 받아보니 꿈만 같았어요.",
    book_h: "특별한 변화의 시작",
    book_sub: "보안 예약 페이지로 이동하여 상세 정보를 입력해 주세요.",
    f_cta: "예약 페이지로 이동",
    chat_h: "도움이 필요하신가요?",
    chat_sub: "서비스나 특별 요청 사항에 대해 궁금한 점이 있으신가요?",
    footer: "© 2026 Peachko · 대한민국 서울",
  }
};

function applyLanguage(lang) {
  document.querySelectorAll("[data-key]").forEach(el => {
    const key = el.getAttribute("data-key");
    if (translations[lang][key]) {
      el.innerHTML = translations[lang][key];
    }
  });
  localStorage.setItem("peachko_lang", lang);
  currentLang = lang;

  const toggleBtn = document.getElementById("langToggle");
  if (toggleBtn) toggleBtn.textContent = LANG_LABELS[lang];
}

/* ══════════════════════════════════════
   UI & INTERACTION LOGIC
══════════════════════════════════════ */

function initHeader() {
  const header = document.getElementById("header");
  window.addEventListener("scroll", () => {
    header.classList.toggle("scrolled", window.scrollY > 50);
  });
}

function initReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add("visible");
    });
  }, { threshold: 0.15 });

  document.querySelectorAll(".reveal").forEach(el => observer.observe(el));
}

function initScroll() {
  document.querySelectorAll("[data-scroll]").forEach(btn => {
    btn.addEventListener("click", () => {
      const targetId = btn.getAttribute("data-scroll");
      const target = document.getElementById(targetId);
      if (target) {
        window.scrollTo({ top: target.offsetTop - 80, behavior: "smooth" });
      }
    });
  });
}

function initBooking() {
  const redirectBtn = document.getElementById("bookRedirectBtn");
  if (redirectBtn) {
    redirectBtn.addEventListener("click", () => {
      window.location.href = "booking.html";
    });
  }
}

/* ══════════════════════════════════════
   DATA LOADING (FIRESTORE)
══════════════════════════════════════ */

async function loadArtists() {
  const container = document.getElementById('artists-container');
  if (!container) return;

  try {
    const snapshot = await getDocs(collection(db, "artists"));
    container.innerHTML = "";

    snapshot.forEach((docSnap) => {
      const artist = docSnap.data();
      const id = docSnap.id;

      const card = `
        <div class="artist-card reveal" onclick="location.href='artist.html?id=${id}'">
          <div class="artist-photo">
            <img src="${artist.photoUrl || 'https://via.placeholder.com/300x400'}" alt="${artist.name}">
            <div class="artist-tag">TOP RATED</div>
          </div>
          <div class="artist-info">
            <h3 class="artist-name">${artist.name}</h3>
            <p class="artist-spec">${artist.services ? artist.services.join(' · ') : 'Expert Artist'}</p>
            <div class="artist-rating">★ 5.0 (48 reviews)</div>
            <button class="btn-ghost artist-btn" data-key="art_btn">View Portfolio</button>
          </div>
        </div>
      `;
      container.insertAdjacentHTML('beforeend', card);
    });
    initReveal(); // 로드된 요소들에 애니메이션 적용
  } catch (error) {
    console.error("Error loading artists:", error);
    container.innerHTML = "<p>Failed to load artists.</p>";
  }
}

/* ══════════════════════════════════════
   AUTH STATE MANAGEMENT
══════════════════════════════════════ */

function initAuth() {
  const authBtn = document.getElementById("authBtn");
  if (!authBtn) return;

  onAuthStateChanged(auth, (user) => {
    if (user) {
      authBtn.innerHTML = translations[currentLang].nav_logout;
      authBtn.onclick = async () => {
        await signOut(auth);
        alert("Logged out successfully.");
        location.reload();
      };
    } else {
      authBtn.innerHTML = translations[currentLang].nav_login;
      authBtn.onclick = () => { window.location.href = "login.html"; };
    }
  });
}

/* ══════════════════════════════════════
   INITIALIZATION
══════════════════════════════════════ */

document.addEventListener("DOMContentLoaded", () => {
  // 다국어 초기화
  applyLanguage(currentLang);

  const toggleBtn = document.getElementById("langToggle");
  if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
      const nextLang = currentLang === "en" ? "ko" : "en";
      applyLanguage(nextLang);
    });
  }

  // UI 초기화
  initHeader();
  initReveal();
  initScroll();
  initBooking();
  initAuth();

  // 데이터 로드
  loadArtists();
});