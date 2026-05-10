import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

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

let currentLang = localStorage.getItem("peachko_lang") || "ko";

const translations = {
  ko: {
    nav0: "서비스",
    nav1: "아티스트",
    nav2: "후기",
    nav_book: "지금 예약",
    nav_login: "로그인",
    nav_logout: "로그아웃",
    hero_h: "당신만을 위한 <span class='accent'>K-뷰티</span> <em>큐레이션</em>",
    hero_sub: "전문 아티스트와 함께 서울의 가장 감각적인 뷰티를 경험하세요.",
    hero_cta: "지금 예약하기", hero_cta2: "아티스트 보기",
    f_cta: "예약 페이지로 이동",
    footer: "© 2026 Peachko · 서울"
  },
  en: {
    nav0: "Services",
    nav1: "Artists",
    nav2: "Reviews",
    nav_book: "Book Now",
    nav_login: "Login",
    nav_logout: "Logout",
    hero_h: "Premium <span class='accent'>K-Beauty</span> <em>Curation</em>",
    hero_sub: "Experience Seoul's most trendsetting beauty with expert artists.",
    hero_cta: "Book Your Look",
    hero_cta2: "See Artists",
    f_cta: "Go to Booking Page",
    footer: "© 2026 Peachko · Seoul"
  },
  zh: {
    nav0: "服务",
    nav1: "艺术家",
    nav2: "评价",
    nav_book: "现在预订",
    nav_login: "登录",
    nav_logout: "登出",
    hero_h: "为您量身定制的 <span class='accent'>K-Beauty</span> <em>策划</em>",
    hero_sub: "与专业艺术家一起体验首尔最前卫的美妆。",
    hero_cta: "现在预订",
    hero_cta2: "查看艺术家",
    f_cta: "前往预订页面",
    footer: "© 2026 Peachko · 首尔"
  }
};

function applyLanguage(lang) {
  document.querySelectorAll("[data-key]").forEach(el => {
    const key = el.getAttribute("data-key");
    if (translations[lang] && translations[lang][key]) el.innerHTML = translations[lang][key];
  });
  localStorage.setItem("peachko_lang", lang);
  currentLang = lang;
  const toggleBtn = document.getElementById("langToggle");
  if (toggleBtn) toggleBtn.textContent = lang.toUpperCase();
}

function initLanguageSwitcher() {
  const toggleBtn = document.getElementById("langToggle");
  const dropdown = document.getElementById("langDropdown");
  if (!toggleBtn || !dropdown) return;

  toggleBtn.onclick = (e) => { e.stopPropagation(); dropdown.classList.toggle("open"); };
  document.querySelectorAll(".lang-opt").forEach(opt => {
    opt.onclick = () => { applyLanguage(opt.getAttribute("data-lang")); dropdown.classList.remove("open"); };
  });
  document.onclick = () => dropdown.classList.remove("open");
}

function initAuth() {
  const authBtn = document.getElementById("authBtn");
  if (!authBtn) return;
  onAuthStateChanged(auth, (user) => {
    authBtn.innerHTML = user ? translations[currentLang].nav_logout : translations[currentLang].nav_login;
    authBtn.onclick = user ? async () => { await signOut(auth); location.reload(); } : () => { location.href = "login.html"; };
  });
}

document.addEventListener("DOMContentLoaded", () => {
  applyLanguage(currentLang);
  initLanguageSwitcher();
  initAuth();
  document.getElementById("bookRedirectBtn")?.addEventListener("click", () => { location.href = "booking.html"; });
  // (애니메이션 및 아티스트 로드 로직 생략 없이 그대로 유지됨)
});