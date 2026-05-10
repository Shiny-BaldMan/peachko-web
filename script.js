/* ═══════════════════════════════════════════════
   PEACHKO — script.js  (Translation System v2)
═══════════════════════════════════════════════ */

import { initializeApp, getApps, getApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
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

// Firebase 중복 초기화 방지
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

/* ── 현재 언어 (반드시 선언 먼저) ── */
let currentLang = localStorage.getItem("peachko_lang") || "ko";

/* ── 전역 번역 데이터 ── */
const translations = {
  ko: {
    // Header nav
    nav0: "서비스", nav1: "아티스트", nav2: "후기",
    nav_book: "지금 예약", nav_login: "로그인", nav_logout: "로그아웃",
    // Hero
    hero_label: "프리미엄 경험",
    hero_h: "당신만을 위한 <span class='accent'>K-뷰티</span> <em>큐레이션</em>",
    hero_sub: "전문 아티스트와 함께 서울의 가장 감각적인 뷰티를 경험하세요.",
    hero_cta: "지금 예약하기", hero_cta2: "아티스트 보기",
    // Stats
    stat_art: "아티스트", stat_exp: "경험", stat_rev: "리뷰",
    // Problem section
    prob_bad_t: "불편했던 점들", prob_good_t: "Peachko 솔루션",
    prob_bad_1: "예약 시 언어 장벽",
    prob_bad_2: "불투명한 가격 구조",
    prob_bad_3: "검증되지 않은 서비스 품질",
    prob_good_1: "실시간 다국어 지원",
    prob_good_2: "투명한 고정 가격",
    prob_good_3: "엄격하게 검증된 전문가",
    // How it works
    how_h: "이용 방법",
    step1_t: "스타일 찾기", step1_d: "포트폴리오를 보고 원하는 스타일을 고르세요.",
    step2_t: "간편 예약", step2_d: "날짜와 시간을 선택하고 즉시 확정하세요.",
    step3_t: "프리미엄 케어", step3_d: "현장에서 최고급 뷰티 서비스를 경험하세요.",
    // Services
    svc_h: "우리의 서비스",
    svc1_t: "퍼스널 메이크업", svc1_d: "당신의 고유한 특징을 살리는 맞춤형 메이크업.",
    svc2_t: "K-팝 아이돌 헤어", svc2_d: "트렌디한 아이돌 스타일링과 전문 헤어 케어.",
    svc3_t: "웨딩 & 스냅", svc3_d: "가장 아름다운 순간을 완벽하게.",
    // Artists
    art_h: "최고의 아티스트", art_sub: "국제 고객을 위해 검증된 K-뷰티 전문가들.",
    // Reviews
    rev_h: "고객 후기",
    rev1: "\"여행 중 최고의 선택이었어요! 아티스트가 정말 친절하고 전문적이었습니다.\"",
    rev2: "\"언어가 걱정됐는데 서비스 덕분에 정말 편했어요.\"",
    rev3: "\"아이돌 콘셉트 메이크업이 꿈만 같았어요.\"",
    // Booking CTA
    book_h: "새로운 변화의 시작", book_sub: "지금 바로 예약 페이지에서 상세 정보를 입력하세요.",
    f_cta: "예약 페이지로 이동",
    // Chat
    chat_h: "도움이 필요하신가요?", chat_sub: "서비스나 맞춤 예약에 대해 궁금한 점을 물어보세요.",
    // Footer
    footer: "© 2026 Peachko · 서울, 한국",

    // ── Login page ──
    login_tab: "로그인", signup_tab: "회원가입",
    login_h2: "다시 오신 것을 환영합니다",
    login_p: "계정에 접속하여 예약을 관리하세요.",
    email_label: "이메일 주소", pass_label: "비밀번호",
    btn_login: "로그인",
    signup_h2: "계정 만들기",
    signup_p: "멤버가 되어 프리미엄 서비스를 예약하세요.",
    name_label: "이름", nation_label: "국적", phone_label: "전화번호",
    btn_signup: "회원가입",
    forgot_pw: "비밀번호를 잊으셨나요?",
    consent_text: "개인정보 처리방침에 동의합니다.",

    // ── Booking page ──
    book_page_title: "뷰티 예약하기",
    book_page_label: "예약",
    book_page_sub: "원하시는 아티스트, 날짜, 시간을 선택해주세요.",
    svc_label: "서비스 선택",
    svc_opt_makeup: "퍼스널 메이크업 ($120)",
    svc_opt_hair: "K-팝 아이돌 헤어 ($80)",
    svc_opt_full: "웨딩/스냅 풀 스타일링 ($250)",
    art_label: "아티스트",
    art_placeholder: "아티스트 선택...",
    date_label: "날짜",
    time_label: "시간",
    time_placeholder: "시간...",
    time_10: "오전 10:00",
    time_1130: "오전 11:30",
    time_13: "오후 01:00",
    time_1430: "오후 02:30",
    time_16: "오후 04:00",
    time_1730: "오후 05:30",
    check_avail_btn: "예약 가능 여부 확인",
    hotel_label: "서울 내 호텔/숙소 주소",
    hotel_placeholder: "아티스트 방문 주소를 상세히 입력해주세요",
    req_label: "특별 요청사항",
    req_placeholder: "알레르기, 원하는 스타일, 기타 문의사항을 입력해주세요.",
    btn_confirm: "예약 확정하기",
    done_h: "예약이 신청되었습니다!",
    done_p: "예약 요청이 전송되었습니다. 아티스트가 검토 후 곧 확인 이메일을 보내드립니다.",
    summary_service: "서비스",
    summary_artist: "아티스트",
    summary_schedule: "일정",
    summary_location: "장소",
    btn_home: "홈으로 돌아가기"
  },

  en: {
    nav0: "Services", nav1: "Artists", nav2: "Reviews",
    nav_book: "Book Now", nav_login: "Login", nav_logout: "Logout",
    hero_label: "Premium Experience",
    hero_h: "Premium <span class='accent'>K-Beauty</span> <em>Curation</em>",
    hero_sub: "Experience Seoul's most trendsetting beauty with expert artists.",
    hero_cta: "Book Your Look", hero_cta2: "See Artists",
    stat_art: "Artists", stat_exp: "Experiences", stat_rev: "Reviews",
    prob_bad_t: "Common Issues", prob_good_t: "Peachko Solution",
    prob_bad_1: "Language barriers in booking",
    prob_bad_2: "Unclear pricing structures",
    prob_bad_3: "Unverified service quality",
    prob_good_1: "Real-time multilingual support",
    prob_good_2: "Transparent fixed pricing",
    prob_good_3: "Strictly vetted professionals",
    how_h: "How it Works",
    step1_t: "Find Style", step1_d: "Explore portfolios and pick your favorite look.",
    step2_t: "Easy Booking", step2_d: "Select date & time and confirm instantly.",
    step3_t: "Premium Care", step3_d: "Enjoy top-tier beauty services on-site.",
    svc_h: "Our Services",
    svc1_t: "Personal Makeup", svc1_d: "Custom makeup that enhances your unique features.",
    svc2_t: "K-Pop Idol Hair", svc2_d: "Trendy idol styling and professional hair care.",
    svc3_t: "Wedding & Snap", svc3_d: "Perfecting your most beautiful moments.",
    art_h: "Meet Our Artists", art_sub: "Professional K-beauty artists vetted for international clients.",
    rev_h: "Happy Clients",
    rev1: "\"Best decision of my trip! The artist was so kind and professional.\"",
    rev2: "\"I was worried about the language, but the service made it easy.\"",
    rev3: "\"Getting an idol-style makeup was like a dream come true.\"",
    book_h: "Begin Your Transformation", book_sub: "Proceed to our secure booking page to enter your details.",
    f_cta: "Go to Booking Page",
    chat_h: "Need Help?", chat_sub: "Questions about services or custom requests?",
    footer: "© 2026 Peachko · Seoul, Korea",

    login_tab: "Login", signup_tab: "Sign Up",
    login_h2: "Welcome Back",
    login_p: "Access your account to manage bookings.",
    email_label: "Email Address", pass_label: "Password",
    btn_login: "Login",
    signup_h2: "Create Account",
    signup_p: "Become a member to book premium services.",
    name_label: "Full Name", nation_label: "Nationality", phone_label: "Phone",
    btn_signup: "Create Account",
    forgot_pw: "Forgot password?",
    consent_text: "I agree to the Privacy Policy.",

    book_page_title: "Book Your Beauty Experience",
    book_page_label: "Reservation",
    book_page_sub: "Select your preferred artist, date, and time.",
    svc_label: "Select Service",
    svc_opt_makeup: "Personal Makeup ($120)",
    svc_opt_hair: "K-Pop Idol Hair ($80)",
    svc_opt_full: "Full Wedding/Snap Styling ($250)",
    art_label: "Artist",
    art_placeholder: "Select Artist...",
    date_label: "Date",
    time_label: "Time",
    time_placeholder: "Time...",
    time_10: "10:00 AM",
    time_1130: "11:30 AM",
    time_13: "01:00 PM",
    time_1430: "02:30 PM",
    time_16: "04:00 PM",
    time_1730: "05:30 PM",
    check_avail_btn: "Check Availability",
    hotel_label: "Hotel / Accommodation Address in Seoul",
    hotel_placeholder: "Detailed address for the artist to visit",
    req_label: "Special Requests",
    req_placeholder: "Any allergies, specific styles, or questions?",
    btn_confirm: "Confirm Reservation",
    done_h: "Reservation Requested!",
    done_p: "Your booking request has been sent. The artist will review it and you'll receive a confirmation email shortly.",
    summary_service: "Service",
    summary_artist: "Artist",
    summary_schedule: "Schedule",
    summary_location: "Location",
    btn_home: "Return to Home"
  },

  zh: {
    nav0: "服务", nav1: "艺术家", nav2: "评价",
    nav_book: "现在预订", nav_login: "登录", nav_logout: "登出",
    hero_label: "尊享体验",
    hero_h: "为您量身定制的 <span class='accent'>K-Beauty</span> <em>策划</em>",
    hero_sub: "与专业艺术家一起体验首尔最前卫的美妆。",
    hero_cta: "现在预订", hero_cta2: "查看艺术家",
    stat_art: "艺术家", stat_exp: "体验次数", stat_rev: "好评",
    prob_bad_t: "常见问题", prob_good_t: "Peachko 解决方案",
    prob_bad_1: "预约时的语言障碍",
    prob_bad_2: "不透明的价格结构",
    prob_bad_3: "未经验证的服务质量",
    prob_good_1: "实时多语言支持",
    prob_good_2: "透明的固定价格",
    prob_good_3: "严格审核的专业人员",
    how_h: "使用方法",
    step1_t: "选择风格", step1_d: "浏览作品集，选择您喜欢的造型。",
    step2_t: "轻松预约", step2_d: "选择日期和时间，立即确认。",
    step3_t: "尊享服务", step3_d: "在现场享受顶级美容服务。",
    svc_h: "我们的服务",
    svc1_t: "个人彩妆", svc1_d: "展现您独特魅力的定制妆容。",
    svc2_t: "K-Pop 偶像发型", svc2_d: "体验韩国偶像的标志性发型和专业护发。",
    svc3_t: "婚礼及写真", svc3_d: "为您最美丽的时刻打造完美造型。",
    art_h: "我们的艺术家", art_sub: "专为国际客户认证的K美容专业人士。",
    rev_h: "客户评价",
    rev1: "\"旅途中最好的决定！艺术家非常亲切专业。\"",
    rev2: "\"我很担心语言问题，但服务让一切变得简单。\"",
    rev3: "\"体验偶像风格妆容简直像梦一样。\"",
    book_h: "开启您的改变", book_sub: "前往预约页面输入详细信息。",
    f_cta: "前往预约页面",
    chat_h: "需要帮助吗？", chat_sub: "对服务或定制预约有疑问？",
    footer: "© 2026 Peachko · 韩国首尔",

    login_tab: "登录", signup_tab: "注册",
    login_h2: "欢迎回来",
    login_p: "登录您的账户以管理预约。",
    email_label: "电子邮箱", pass_label: "密码",
    btn_login: "登录",
    signup_h2: "创建账户",
    signup_p: "成为会员以预约高级服务。",
    name_label: "姓名", nation_label: "国籍", phone_label: "电话号码",
    btn_signup: "创建账户",
    forgot_pw: "忘记密码？",
    consent_text: "我同意隐私政策。",

    book_page_title: "预约您的美容体验",
    book_page_label: "预约",
    book_page_sub: "请选择您偏好的艺术家、日期和时间。",
    svc_label: "选择服务",
    svc_opt_makeup: "个人彩妆 ($120)",
    svc_opt_hair: "K-Pop 偶像发型 ($80)",
    svc_opt_full: "婚礼/写真全套造型 ($250)",
    art_label: "艺术家",
    art_placeholder: "选择艺术家...",
    date_label: "日期",
    time_label: "时间",
    time_placeholder: "时间...",
    time_10: "上午 10:00",
    time_1130: "上午 11:30",
    time_13: "下午 01:00",
    time_1430: "下午 02:30",
    time_16: "下午 04:00",
    time_1730: "下午 05:30",
    check_avail_btn: "查询可用时段",
    hotel_label: "首尔酒店/住宿地址",
    hotel_placeholder: "请输入艺术家上门服务的详细地址",
    req_label: "特别要求",
    req_placeholder: "如有过敏史、特定风格要求或其他问题，请在此填写。",
    btn_confirm: "确认预约",
    done_h: "预约请求已提交！",
    done_p: "您的预约请求已发送。艺术家审核后将很快向您发送确认邮件。",
    summary_service: "服务",
    summary_artist: "艺术家",
    summary_schedule: "时间安排",
    summary_location: "地点",
    btn_home: "返回首页"
  }
};

/* ══════════════════════════════════════════════
   핵심 번역 함수
══════════════════════════════════════════════ */
function applyLanguage(lang) {
  if (!translations[lang]) return;
  currentLang = lang;
  localStorage.setItem("peachko_lang", lang);

  // data-key 텍스트 교체
  document.querySelectorAll("[data-key]").forEach(el => {
    const key = el.getAttribute("data-key");
    const val = translations[lang][key];
    if (val !== undefined) el.innerHTML = val;
  });

  // data-ph-key → placeholder 교체
  document.querySelectorAll("[data-ph-key]").forEach(el => {
    const key = el.getAttribute("data-ph-key");
    const val = translations[lang][key];
    if (val !== undefined) el.placeholder = val;
  });

  // 언어 토글 버튼 텍스트
  const toggleBtn = document.getElementById("langToggle");
  if (toggleBtn) toggleBtn.textContent = lang.toUpperCase();

  // authBtn 즉시 갱신
  const authBtn = document.getElementById("authBtn");
  if (authBtn && authBtn.dataset.loggedIn !== undefined) {
    const loggedIn = authBtn.dataset.loggedIn === "true";
    authBtn.innerHTML = loggedIn
      ? translations[lang].nav_logout
      : translations[lang].nav_login;
  }
}

/* 전역 노출 */
window.peachkoLang = {
  apply: applyLanguage,
  get: () => currentLang,
  t: (key) => translations[currentLang]?.[key] ?? key
};
window.applyLanguage = applyLanguage; // 하위 호환

/* ══════════════════════════════════════════════
   언어 스위처 초기화
══════════════════════════════════════════════ */
function initLanguageSwitcher() {
  const toggleBtn = document.getElementById("langToggle");
  const dropdown = document.getElementById("langDropdown");
  if (!toggleBtn || !dropdown) return;

  toggleBtn.onclick = (e) => {
    e.stopPropagation();
    dropdown.classList.toggle("open");
  };
  document.querySelectorAll(".lang-opt").forEach(opt => {
    opt.onclick = () => {
      applyLanguage(opt.getAttribute("data-lang"));
      dropdown.classList.remove("open");
    };
  });
  document.addEventListener("click", () => dropdown.classList.remove("open"));
}

/* ══════════════════════════════════════════════
   Auth 버튼 (index.html 전용)
══════════════════════════════════════════════ */
function initAuth() {
  const authBtn = document.getElementById("authBtn");
  if (!authBtn) return;
  onAuthStateChanged(auth, (user) => {
    authBtn.dataset.loggedIn = user ? "true" : "false";
    authBtn.innerHTML = user
      ? translations[currentLang].nav_logout
      : translations[currentLang].nav_login;
    authBtn.onclick = user
      ? async () => { await signOut(auth); location.reload(); }
      : () => { location.href = "login.html"; };
  });
}

/* ══════════════════════════════════════════════
   아티스트 목록 (index.html 전용)
══════════════════════════════════════════════ */
async function loadArtists() {
  const container = document.getElementById("artists-container");
  if (!container) return;
  try {
    const snapshot = await getDocs(collection(db, "artists"));
    container.innerHTML = "";
    if (snapshot.empty) {
      container.innerHTML = `<p style="grid-column:1/-1;text-align:center;font-family:var(--fb);color:var(--muted-lt);">등록된 아티스트가 없습니다.</p>`;
      return;
    }
    snapshot.forEach((docSnap) => {
      const artist = docSnap.data();
      container.insertAdjacentHTML("beforeend", `
        <div class="artist-card reveal visible" onclick="location.href='artist.html?id=${docSnap.id}'">
          <div class="artist-photo"><img src="${artist.photoUrl || ""}" alt="${artist.name}" loading="lazy"></div>
          <div class="artist-info">
            <h3 class="artist-name">${artist.name}</h3>
            <p class="artist-spec">${(artist.services || []).join(" · ")}</p>
            <button class="btn-ghost artist-btn">View Portfolio</button>
          </div>
        </div>`);
    });
  } catch (err) { console.error("loadArtists:", err); }
}

/* ══════════════════════════════════════════════
   스크롤 헤더 & 기타
══════════════════════════════════════════════ */
function initScrollHeader() {
  const header = document.getElementById("header");
  if (!header || header.classList.contains("scrolled")) return;
  window.addEventListener("scroll", () => {
    header.classList.toggle("scrolled", window.scrollY > 40);
  }, { passive: true });
}

function initReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("visible"); });
  }, { threshold: 0.08 });
  document.querySelectorAll(".reveal").forEach(el => observer.observe(el));
}

function initNavScroll() {
  document.querySelectorAll("[data-scroll]").forEach(btn => {
    btn.addEventListener("click", () => {
      const target = document.getElementById(btn.dataset.scroll);
      if (target) target.scrollIntoView({ behavior: "smooth" });
    });
  });
}

/* ══════════════════════════════════════════════
   초기화 진입점
══════════════════════════════════════════════ */
document.addEventListener("DOMContentLoaded", () => {
  applyLanguage(currentLang);
  initLanguageSwitcher();
  initScrollHeader();
  initReveal();
  initNavScroll();
  initAuth();
  loadArtists();
  document.getElementById("bookRedirectBtn")
    ?.addEventListener("click", () => { location.href = "booking.html"; });
});