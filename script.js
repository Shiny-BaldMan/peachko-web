/* ═══════════════════════════════════════════════
   PEACHKO — script.js (ReferenceError & Ghosting Fix)
═══════════════════════════════════════════════ */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

// 1. 변수 미정의 방지를 위해 최상단에 명시적으로 선언 및 할당
const firebaseConfig = {
  apiKey: "AIzaSyAyy0UF4jFUotKJubr5QcErYilCvaNn-PY",
  authDomain: "peachko-dev.firebaseapp.com",
  projectId: "peachko-dev",
  storageBucket: "peachko-dev.firebasestorage.app",
  messagingSenderId: "561367230685",
  appId: "1:561367230685:web:5576c1897b5989c243d334"
};

// 안전한 초기화
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

/* 2. [중요] 'Reveal' 무한 대기 방지 로직 (Fail-safe)
   자바스크립트 에러가 나더라도 1.5초 뒤엔 무조건 화면을 보여줍니다. */
window.onload = () => {
  setTimeout(() => {
    document.querySelectorAll('.reveal').forEach(el => {
      el.classList.add('visible');
      el.style.opacity = "1"; // CSS 강제 덮어쓰기
    });
  }, 1500);
};

/* 3. 다국어 처리 로직 (ReferenceError 방지) */
const translations = {
  en: { nav_login: "Login", hero_h: "Premium K-Beauty", hero_sub: "Expert curation for you." },
  ko: { nav_login: "로그인", hero_h: "프리미엄 K-뷰티", hero_sub: "당신을 위한 전문가 큐레이션" }
};

let currentLang = localStorage.getItem("peachko_lang") || "en";

function applyLanguage(lang) {
  const elements = document.querySelectorAll("[data-key]");
  elements.forEach(el => {
    const key = el.getAttribute("data-key");
    if (translations[lang] && translations[lang][key]) {
      el.innerHTML = translations[lang][key];
    }
  });
}

// 초기 실행
document.addEventListener("DOMContentLoaded", () => {
  console.log("🚀 Peachko Core Loading...");
  applyLanguage(currentLang);

  // Intersection Observer가 정상 작동할 때만 애니메이션 실행
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add("visible");
    });
  });
  document.querySelectorAll(".reveal").forEach(el => observer.observe(el));
});