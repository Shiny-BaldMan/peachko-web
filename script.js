import { initializeApp, getApp, getApps } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
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

// 중복 초기화 방지
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

let currentLang = localStorage.getItem("peachko_lang") || "ko";

// 로그인/예약 페이지 텍스트까지 포함된 전체 번역 데이터
const translations = {
  ko: {
    nav0: "서비스", nav1: "아티스트", nav2: "후기", nav_book: "지금 예약", nav_login: "로그인", nav_logout: "로그아웃",
    hero_h: "당신만을 위한 <span class='accent'>K-뷰티</span> <em>큐레이션</em>",
    hero_sub: "전문 아티스트와 함께 서울의 가장 감각적인 뷰티를 경험하세요.",
    hero_cta: "지금 예약하기", hero_cta2: "아티스트 보기", f_cta: "예약 페이지로 이동", footer: "© 2026 Peachko · 서울",
    login_t: "로그인", signup_t: "회원가입", email_l: "이메일 주소", pass_l: "비밀번호", name_l: "이름", nation_l: "국적", phone_l: "전화번호",
    book_t: "뷰티 경험 예약하기", svc_l: "서비스 선택", art_l: "아티스트", date_l: "날짜", time_l: "시간", hotel_l: "호텔 주소", req_l: "요청 사항"
  },
  en: {
    nav0: "Services", nav1: "Artists", nav2: "Reviews", nav_book: "Book Now", nav_login: "Login", nav_logout: "Logout",
    hero_h: "Premium <span class='accent'>K-Beauty</span> <em>Curation</em>",
    hero_sub: "Experience Seoul's most trendsetting beauty with expert artists.",
    hero_cta: "Book Your Look", hero_cta2: "See Artists", f_cta: "Go to Booking Page", footer: "© 2026 Peachko · Seoul",
    login_t: "Login", signup_t: "Sign Up", email_l: "Email Address", pass_l: "Password", name_l: "Full Name", nation_l: "Nationality", phone_l: "Phone",
    book_t: "Book Your Beauty Experience", svc_l: "Select Service", art_l: "Artist", date_l: "Date", time_l: "Time", hotel_l: "Hotel Address", req_l: "Requests"
  },
  zh: {
    nav0: "服务", nav1: "艺术家", nav2: "评价", nav_book: "现在预订", nav_login: "登录", nav_logout: "登出",
    hero_h: "为您量身定制的 <span class='accent'>K-Beauty</span> <em>策划</em>",
    hero_sub: "与专业艺术家一起体验首尔最前卫的美妆。",
    hero_cta: "现在预订", hero_cta2: "查看艺术家", f_cta: "前往预订页面", footer: "© 2026 Peachko · 首尔",
    login_t: "登录", signup_t: "注册", email_l: "电子邮箱", pass_l: "密码", name_l: "姓名", nation_l: "国籍", phone_l: "电话",
    book_t: "预约美妆服务", svc_l: "选择服务", art_l: "艺术家", date_l: "日期", time_l: "时间", hotel_l: "酒店地址", req_l: "备注"
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

async function loadArtists() {
  const container = document.getElementById('artists-container');
  if (!container) return;
  try {
    const snapshot = await getDocs(collection(db, "artists"));
    container.innerHTML = "";
    snapshot.forEach((docSnap) => {
      const artist = docSnap.data();
      container.insertAdjacentHTML('beforeend', `
        <div class="artist-card reveal visible" onclick="location.href='artist.html?id=${docSnap.id}'">
          <div class="artist-photo"><img src="${artist.photoUrl || ''}" alt=""></div>
          <div class="artist-info">
            <h3 class="artist-name">${artist.name}</h3>
            <p class="artist-spec">${(artist.services || []).join(' · ')}</p>
            <button class="btn-ghost artist-btn">View Portfolio</button>
          </div>
        </div>`);
    });
  } catch (err) { console.error(err); }
}

document.addEventListener("DOMContentLoaded", () => {
  applyLanguage(currentLang);
  initLanguageSwitcher();
  initAuth();
  loadArtists();
  document.getElementById("bookRedirectBtn")?.addEventListener("click", () => { location.href = "booking.html"; });

  // 화면 나타내기 로직 (이게 없으면 화면이 하얗게 보입니다)
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add("visible"); });
  }, { threshold: 0.1 });
  document.querySelectorAll(".reveal").forEach(el => observer.observe(el));
});