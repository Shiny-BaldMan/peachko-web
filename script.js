/* ═══════════════════════════════════════════════
   PEACHKO — script.js (Full Site Translation)
═══════════════════════════════════════════════ */

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

/* ── 전역 번역 데이터 ── */
const translations = {
  ko: {
    nav0: "서비스", nav1: "아티스트", nav2: "후기", nav_book: "지금 예약", nav_login: "로그인", nav_logout: "로그아웃",
    hero_h: "당신만을 위한 <span class='accent'>K-뷰티</span> <em>큐레이션</em>",
    hero_sub: "전문 아티스트와 함께 서울의 가장 감각적인 뷰티를 경험하세요.",
    hero_cta: "지금 예약하기", hero_cta2: "아티스트 보기",
    svc_h: "우리의 서비스", svc_sub: "당신만을 위한 맞춤형 뷰티 솔루션",
    svc1_t: "퍼스널 메이크업", svc1_d: "당신의 고유한 특징을 살리는 맞춤형 메이크업.",
    svc2_t: "K-팝 스타일링", svc2_d: "아이돌의 감각적인 헤어와 메이크업을 경험하세요.",
    svc3_t: "웨딩 & 스페셜", svc3_d: "가장 특별한 날을 위한 완벽한 스타일링.",
    step_h: "이용 방법", step_sub: "간단한 3단계로 만나는 럭셔리 뷰티",
    step1_t: "아티스트 선택", step1_d: "포트폴리오를 보고 취향에 맞는 전문가를 고르세요.",
    step2_t: "날짜 & 장소 예약", step2_d: "원하는 시간과 호텔 주소를 입력하세요.",
    step3_t: "방문 서비스 체험", step3_d: "숙소에서 편안하게 최고급 뷰티 서비스를 받으세요.",
    art_h: "최고의 아티스트", art_sub: "당신의 아름다움을 책임질 뷰티 전문가들",
    rev_h: "실제 고객 후기", rev_sub: "PEACHKO와 함께한 특별한 순간들",
    book_h: "새로운 변화의 시작", book_sub: "지금 바로 예약 페이지에서 상세 정보를 입력하세요.",
    f_cta: "예약 페이지로 이동",
    chat_h: "도움이 필요하신가요?", chat_sub: "서비스나 맞춤 예약에 대해 궁금한 점을 물어보세요.",
    footer: "© 2026 Peachko · 서울",
    // Login & Signup
    login_tab: "로그인", signup_tab: "회원가입",
    login_h2: "다시 오신 것을 환영합니다", login_p: "계정에 접속하여 예약을 관리하세요.",
    email_label: "이메일 주소", pass_label: "비밀번호", btn_login: "로그인",
    signup_h2: "계정 만들기", signup_p: "멤버가 되어 프리미엄 서비스를 예약하세요.",
    name_label: "이름", nation_label: "국적", phone_label: "전화번호", btn_signup: "회원가입",
    // Booking
    book_title: "뷰티 예약하기", book_desc: "원하시는 서비스와 일정을 선택해주세요.",
    svc_label: "서비스 선택", art_label: "아티스트 선택", date_label: "날짜 선택",
    time_label: "시간 선택", hotel_label: "호텔 주소 (방문지)", req_label: "요청 사항",
    btn_confirm: "예약 확정하기",
    done_h2: "예약이 완료되었습니다!", done_p: "아티스트가 확인 후 연락드릴 예정입니다.",
    summary_h3: "예약 요약", btn_home: "홈으로 돌아가기"
  },
  en: {
    nav0: "Services", nav1: "Artists", nav2: "Reviews", nav_book: "Book Now", nav_login: "Login", nav_logout: "Logout",
    hero_h: "Premium <span class='accent'>K-Beauty</span> <em>Curation</em>",
    hero_sub: "Experience Seoul's most trendsetting beauty with expert artists.",
    hero_cta: "Book Your Look", hero_cta2: "See Artists",
    svc_h: "Our Services", svc_sub: "Bespoke beauty solutions tailored for you",
    svc1_t: "Personal Makeup", svc1_d: "Custom makeup that enhances your unique features.",
    svc2_t: "K-Pop Styling", svc2_d: "Experience the iconic hair and makeup of K-pop idols.",
    svc3_t: "Wedding & Special", svc3_d: "Perfect styling for your most memorable days.",
    step_h: "How It Works", step_sub: "Luxury beauty in 3 simple steps",
    step1_t: "Select Artist", step1_d: "Choose a professional based on their portfolio.",
    step2_t: "Book Date & Place", step2_d: "Enter your preferred time and hotel address.",
    step3_t: "Experience Service", step3_d: "Enjoy top-tier beauty service at your stay.",
    art_h: "Top Artists", art_sub: "Beauty experts dedicated to your transformation",
    rev_h: "Client Reviews", rev_sub: "Special moments shared with PEACHKO",
    book_h: "Begin Your Transformation", book_sub: "Proceed to our booking page to enter details.",
    f_cta: "Go to Booking Page",
    chat_h: "Need Help?", chat_sub: "Questions about services or custom requests?",
    footer: "© 2026 Peachko · Seoul",
    // Login & Signup
    login_tab: "Login", signup_tab: "Sign Up",
    login_h2: "Welcome Back", login_p: "Access your account to manage bookings.",
    email_label: "Email Address", pass_label: "Password", btn_login: "Login",
    signup_h2: "Create Account", signup_p: "Become a member to book premium services.",
    name_label: "Name", nation_label: "Nationality", phone_label: "Phone Number", btn_signup: "Create Account",
    // Booking
    book_title: "Book Your Look", book_desc: "Please select your service and schedule.",
    svc_label: "Select Service", art_label: "Select Artist", date_label: "Select Date",
    time_label: "Select Time", hotel_label: "Hotel Address", req_label: "Special Requests",
    btn_confirm: "Confirm Reservation",
    done_h2: "Booking Complete!", done_p: "Our artist will contact you shortly.",
    summary_h3: "Booking Summary", btn_home: "Back to Home"
  },
  zh: {
    nav0: "服务", nav1: "艺术家", nav2: "评价", nav_book: "现在预订", nav_login: "登录", nav_logout: "登出",
    hero_h: "为您量身定制的 <span class='accent'>K-Beauty</span> <em>策划</em>",
    hero_sub: "与专业艺术家一起体验首尔最前卫的美妆。",
    hero_cta: "现在预订", hero_cta2: "查看艺术家",
    svc_h: "我们的服务", svc_sub: "为您定制的美容方案",
    svc1_t: "个人彩妆", svc1_d: "展现您独特魅力的定制妆容。",
    svc2_t: "K-Pop 造型", svc2_d: "体验韩国偶像的标志性发型和妆容。",
    svc3_t: "婚礼及特别活动", svc3_d: "为您最重要的日子打造完美造型。",
    step_h: "使用方法", step_sub: "只需三步，即可享受豪华美容服务",
    step1_t: "选择艺术家", step1_d: "根据作品集选择您喜欢的专家。",
    step2_t: "预约日期和地点", step2_d: "输入您方便的时间和酒店地址。",
    step3_t: "享受上门服务", step3_d: "在您的住所舒适地享受顶级美容服务。",
    art_h: "顶级艺术家", art_sub: "致力于为您带来改变的美容专家",
    rev_h: "客户评价", rev_sub: "在 PEACHKO 度过的特别时刻",
    book_h: "开启您的改变", book_sub: "前往预约页面输入详细信息。",
    f_cta: "前往预约页面",
    chat_h: "需要帮助吗？", chat_sub: "对服务或定制预约有疑问？",
    footer: "© 2026 Peachko · 首尔",
    // Login & Signup
    login_tab: "登录", signup_tab: "注册",
    login_h2: "欢迎回来", login_p: "登录您的账户以管理预约。",
    email_label: "电子邮箱", pass_label: "密码", btn_login: "登录",
    signup_h2: "创建账户", signup_p: "成为会员以预约高级服务。",
    name_label: "姓名", nation_label: "国籍", phone_label: "电话号码", btn_signup: "创建账户",
    // Booking
    book_title: "预约您的服务", book_desc: "请选择您的服务项目和时间。",
    svc_label: "选择服务", art_label: "选择艺术家", date_label: "选择日期",
    time_label: "选择时间", hotel_label: "酒店地址", req_label: "备注要求",
    btn_confirm: "确认预约",
    done_h2: "预约完成！", done_p: "我们的艺术家将很快与您联系。",
    summary_h3: "预约详情", btn_home: "返回首页"
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

// 언어 적용 함수를 전역(window)에 등록하여 다른 파일에서도 쓸 수 있게 함
window.applyLanguage = function (lang) {
  document.querySelectorAll("[data-key]").forEach(el => {
    const key = el.getAttribute("data-key");
    if (translations[lang] && translations[lang][key]) {
      el.innerHTML = translations[lang][key];
    }
  });
  localStorage.setItem("peachko_lang", lang);
  const toggleBtn = document.getElementById("langToggle");
  if (toggleBtn) toggleBtn.textContent = lang.toUpperCase();
};

/* ── 초기화 ── */
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