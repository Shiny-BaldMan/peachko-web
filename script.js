/* ═══════════════════════════════════════════════
peachko — script.js
All interactivity: language, rendering, scroll,
booking form, animations
═══════════════════════════════════════════════ */

// 1. import 문은 무조건 파일 최상단에 있어야 합니다!
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
import { collection, doc, runTransaction } from "firebase/firestore";

// 2. 환경에 따른 Firebase 설정값 분리
let firebaseConfig;

if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
  // 내 컴퓨터(로컬 테스트) 환경
  console.log("🛠️ 로컬 테스트 모드입니다.");
  firebaseConfig = {
    apiKey: "AIzaSyCnByhLp-UyVaVOpEERqNBJKeIcipPILE0",
    authDomain: "peachko-dev.firebaseapp.com",
    projectId: "peachko-dev",
    storageBucket: "peachko-dev.firebasestorage.app",
    messagingSenderId: "675915261853",
    appId: "1:675915261853:web:58dce392b1103dd6c1b174"
  };
} else {
  // Vercel 등 실제 배포 환경 (나중에 운영용 DB를 만들면 값을 교체합니다)
  console.log("🚀 실제 운영 모드입니다.");
  firebaseConfig = {
    apiKey: "AIzaSyCnByhLp-UyVaVOpEERqNBJKeIcipPILE0",
    authDomain: "peachko-dev.firebaseapp.com",
    projectId: "peachko-dev",
    storageBucket: "peachko-dev.firebasestorage.app",
    messagingSenderId: "675915261853",
    appId: "1:675915261853:web:58dce392b1103dd6c1b174"
  };
}

// 3. Firebase 초기화
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
// 선택된 설정으로 Firebase를 시작합니다.
// firebase.initializeApp(firebaseConfig);
/* ── TRANSLATIONS ── */
const T = {
EN: {
nav0: "Services", nav1: "Artists", nav2: "Book", chat: "Chat", nav_login: "Log In", nav_logout: "Log Out",
hero_tag: "Seoul’s On-Demand K-Beauty",
hero_h1a: "K-Beauty,", hero_h1b: "Delivered to", hero_h1c: "Your Door.",
hero_sub: "Skip the search. Skip the commute. Choose your artist, share your hotel address, and wake up glowing — ready for Seoul.",
hero_cta: "Reserve Now", hero_cta2: "Meet Artists",
stat1n: "500+", stat1l: "Guests", stat2n: "15", stat2l: "Artists", stat3n: "4.9★", stat3l: "Rated",
badge_sub: "Today’s Look", badge_title: "K-Glow Ready",
before: "Before", peachko_label: "peachko",
prob_label: "Why peachko", prob_h: "We Solved the Hassle",
prob_bad:  ["Searching Korean websites", "Navigating unfamiliar streets", "Language barriers at salons", "Losing precious travel time"],
prob_good: ["Book in English in minutes", "Artist comes to your hotel", "Zero language barriers", "Start your day glowing"],
how_label: "3 Simple Steps", how_h: "How It Works",
steps: [
{ n: "01", t: "Choose Your Look",  d: "Pick a service & artist from our portfolio" },
{ n: "02", t: "Share Your Hotel",  d: "Enter your address, date & time in Seoul" },
{ n: "03", t: "Glow & Go",         d: "Artist arrives — you step out radiant" },
],
svc_label: "Our Services", svc_h: "What We Offer",
services: [
{ title: "Face Makeup",       time: "60 min",  price: "From ₩80,000",  desc: "Glass skin, gradient lips & K-glam finish" },
{ title: "Face + Hair",       time: "90 min",  price: "From ₩130,000", desc: "Full look with K-pop inspired styling" },
{ title: "Full Glam",         time: "120 min", price: "From ₩180,000", desc: "Face + Hair + Lashes — red carpet ready" },
{ title: "Special Occasion",  time: "150 min", price: "From ₩220,000", desc: "Bridal, photoshoot & bespoke looks" },
],
art_label: "The Team", art_h: "Meet Your Artists", art_book: "Book", art_reviews: "reviews",
artists: [
{ name: "Soyeon", spec: "Glass Skin & Soft Glam",   rating: "4.9", rev: 128, tag: "Trending",   img: "https://images.unsplash.com/photo-1596815064285-45ed8a9c0463?w=400&q=85&fit=crop&crop=faces,top" },
{ name: "Minjae", spec: "K-Pop Idol Look",           rating: "4.8", rev: 94,  tag: "Fan Fave",   img: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&q=85&fit=crop&crop=faces,top" },
{ name: "Haerin", spec: "Bridal & Editorial",        rating: "5.0", rev: 61,  tag: "Top Rated",  img: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=400&q=85&fit=crop&crop=faces,top" },
],
rev_label: "Real Stories", rev_h: "What Guests Say",
reviews: [
{ name: "Emma L.",    flag: "🇺🇸", text: "Soyeon came to my hotel at 8am. I felt like a K-drama lead all day.",                svc: "Face + Hair" },
{ name: "Chiara M.",  flag: "🇮🇹", text: "No Korean, no stress, no getting lost. Perfect makeup at my door!",                   svc: "Full Glam"   },
{ name: "Aiko T.",    flag: "🇯🇵", text: "Better than any salon I’ve visited. She understood exactly what I wanted.",            svc: "Face Makeup" },
],
book_label: "Let’s Begin", book_h: "Book Your Look",
f_service: "Select a service", f_artist: "Select an artist",
f_date: "Date", f_time: "Time",
f_hotel: "Hotel / Address in Seoul", f_hotel_ph: "e.g. Lotte Hotel Seoul, Myeongdong",
book_sub: "Proceed to our secure booking page to enter your details.",
f_cta: "Go to Booking Page",
done_h: "You’re All Set!", done_sub: "Booking received. We’ll confirm within 30 minutes.", done_back: "Book Another",
chat_h: "Need Help?", chat_sub: "Questions about services or custom requests?",
kakao: "KakaoTalk", whatsapp: "WhatsApp",
footer: "© 2025 peachko · Seoul, Korea",
},
KO: {
nav0: "서비스", nav1: "아티스트", nav2: "예약", chat: "상담", nav_login: "로그인", nav_logout: "로그아웃",
hero_tag: "서울 출장 K-뷰티",
hero_h1a: "K-뷰티,", hero_h1b: "숙소로", hero_h1c: "찾아갑니다.",
hero_sub: "직접 찾아다닐 필요 없어요. 아티스트를 고르고 숙소 주소를 알려주세요. 메이크업 후 바로 여행을 시작하세요.",
hero_cta: "지금 예약", hero_cta2: "아티스트 보기",
stat1n: "500+", stat1l: "고객", stat2n: "15명", stat2l: "아티스트", stat3n: "4.9★", stat3l: "평점",
badge_sub: "오늘의 룩", badge_title: "K-글로우 레디",
before: "Before", peachko_label: "피치코",
prob_label: "피치코 소개", prob_h: "불편함을 해결했습니다",
prob_bad:  ["한국 사이트 검색", "낯선 길 찾아가기", "언어 장벽", "소중한 여행 시간 낭비"],
prob_good: ["영어로 간편 예약", "아티스트가 숙소로 방문", "언어 걱정 없음", "메이크업 후 바로 여행"],
how_label: "간단한 3단계", how_h: "이용 방법",
steps: [
{ n: "01", t: "서비스 선택",     d: "원하는 서비스와 아티스트를 선택하세요" },
{ n: "02", t: "숙소 정보 입력",  d: "주소, 날짜, 시간을 입력해주세요" },
{ n: "03", t: "메이크업 후 출발", d: "아티스트 방문 → 빛나는 하루 시작" },
],
svc_label: "서비스 안내", svc_h: "제공 서비스",
services: [
{ title: "페이스 메이크업",     time: "60분",  price: "₩80,000~",  desc: "글래스 스킨, 그라데이션 립 & K-글램" },
{ title: "페이스 + 헤어",       time: "90분",  price: "₩130,000~", desc: "K-팝 스타일 헤어 포함 풀 룩" },
{ title: "풀 글램",             time: "120분", price: "₩180,000~", desc: "페이스 + 헤어 + 속눈썹" },
{ title: "스페셜 오케이전",     time: "150분", price: "₩220,000~", desc: "웨딩, 화보 등 맞춤 메이크업" },
],
art_label: "아티스트", art_h: "아티스트 소개", art_book: "예약", art_reviews: "리뷰",
artists: [
{ name: "소연", spec: "글래스 스킨 & 소프트 글램", rating: "4.9", rev: 128, tag: "인기",      img: "https://images.unsplash.com/photo-1596815064285-45ed8a9c0463?w=400&q=85&fit=crop&crop=faces,top" },
{ name: "민재", spec: "K-팝 아이돌 룩",            rating: "4.8", rev: 94,  tag: "팬 최애",   img: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&q=85&fit=crop&crop=faces,top" },
{ name: "해린", spec: "웨딩 & 에디토리얼",          rating: "5.0", rev: 61,  tag: "최고 평점", img: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=400&q=85&fit=crop&crop=faces,top" },
],
rev_label: "실제 후기", rev_h: "고객 후기",
reviews: [
{ name: "Emma L.",   flag: "🇺🇸", text: "소연 아티스트가 오전 8시에 호텔로 와줬어요. 하루종일 드라마 주인공 같았어요.", svc: "페이스 + 헤어" },
{ name: "Chiara M.", flag: "🇮🇹", text: "한국어 몰라도, 길 몰라도 OK. 완벽한 메이크업을 호텔에서 받았어요!",           svc: "풀 글램" },
{ name: "Aiko T.",   flag: "🇯🇵", text: "원하는 룩을 사진 한 장으로 완벽하게 재현해줬어요.",                           svc: "페이스 메이크업" },
],
book_label: "예약하기", book_h: "원하는 룩 예약",
f_service: "서비스 선택", f_artist: "아티스트 선택",
f_date: "날짜", f_time: "시간",
f_hotel: "숙소 / 서울 주소", f_hotel_ph: "예) 롯데호텔 서울, 명동",
book_sub: "예약 페이지로 이동하여 상세 정보를 입력해주세요.",
f_cta: "예약하러 가기",
done_h: "예약 완료!", done_sub: "예약이 접수되었습니다. 30분 내로 확인 연락 드릴게요.", done_back: "다시 예약",
chat_h: "궁금하신 점이 있나요?", chat_sub: "서비스 문의나 맞춤 요청은 아래로 연락주세요.",
kakao: "카카오톡", whatsapp: "WhatsApp",
footer: "© 2025 피치코 · 서울, 대한민국",
},
JP: {
nav0: "サービス", nav1: "アーティスト", nav2: "予約", chat: "相談", nav_login: "ログイン", nav_logout: "ログアウト",
hero_tag: "ソウル出張Kビューティー",
hero_h1a: "Kビューティーを", hero_h1b: "あなたの", hero_h1c: "部屋へ。",
hero_sub: "自分でサロンを探す必要なし。アーティストを選んでホテルの住所を教えるだけ。",
hero_cta: "今すぐ予約", hero_cta2: "アーティストを見る",
stat1n: "500+", stat1l: "名のゲスト", stat2n: "15名", stat2l: "アーティスト", stat3n: "4.9★", stat3l: "評価",
badge_sub: "本日のルック", badge_title: "Kグロウ レディ",
before: "Before", peachko_label: "peachko",
prob_label: "peachkoとは", prob_h: "不便を解決しました",
prob_bad:  ["韓国語サイトで検索", "知らない道を歩く", "言語の壁", "旅行時間のロス"],
prob_good: ["英語で簡単予約", "ホテルへ出張訪問", "言語の心配なし", "メイク後すぐ観光"],
how_label: "3ステップ", how_h: "ご利用方法",
steps: [
{ n: "01", t: "サービスを選ぶ",      d: "サービスとアーティストを選択" },
{ n: "02", t: "ホテル情報を入力",    d: "住所・日時を入力してください" },
{ n: "03", t: "輝いて出発",          d: "アーティスト来訪 → 素敵な一日を" },
],
svc_label: "サービス案内", svc_h: "サービス一覧",
services: [
{ title: "フェイスメイク",    time: "60分",  price: "₩80,000〜",  desc: "グラスキン・グラデーションリップ" },
{ title: "フェイス＋ヘア",   time: "90分",  price: "₩130,000〜", desc: "K-POPスタイルのフルルック" },
{ title: "フルグラム",        time: "120分", price: "₩180,000〜", desc: "フェイス＋ヘア＋つけまつ毛" },
{ title: "スペシャル",        time: "150分", price: "₩220,000〜", desc: "ブライダル・撮影等オーダーメイド" },
],
art_label: "アーティスト", art_h: "アーティスト紹介", art_book: "予約", art_reviews: "レビュー",
artists: [
{ name: "ソヨン", spec: "グラスキン＆ソフトグラム",     rating: "4.9", rev: 128, tag: "人気",      img: "https://images.unsplash.com/photo-1596815064285-45ed8a9c0463?w=400&q=85&fit=crop&crop=faces,top" },
{ name: "ミンジェ", spec: "K-POPアイドルルック",        rating: "4.8", rev: 94,  tag: "人気No.1",  img: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&q=85&fit=crop&crop=faces,top" },
{ name: "ヘリン", spec: "ブライダル＆エディトリアル",   rating: "5.0", rev: 61,  tag: "最高評価",  img: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=400&q=85&fit=crop&crop=faces,top" },
],
rev_label: "お客様の声", rev_h: "ゲストレビュー",
reviews: [
{ name: "Emma L.",   flag: "🇺🇸", text: "朝8時にホテルへ来てくれました。一日中ドラマのヒロインみたいでした。", svc: "フェイス＋ヘア" },
{ name: "Chiara M.", flag: "🇮🇹", text: "韓国語も道もわからなくても大丈夫。部屋で完璧なメイクができました！",  svc: "フルグラム" },
{ name: "Aiko T.",   flag: "🇯🇵", text: "写真一枚で希望通りに仕上げてくれました。",                           svc: "フェイスメイク" },
],
book_label: "ご予約", book_h: "ルックを予約する",
f_service: "サービスを選択", f_artist: "アーティストを選択",
f_date: "日付", f_time: "時間",
f_hotel: "ホテル / ソウルの住所", f_hotel_ph: "例: ロッテホテルソウル 明洞",
book_sub: "予約ページに移動して詳細を入力してください。",
f_cta: "予約ページへ",
done_h: "予約完了！", done_sub: "ご予約を受け付けました。30分以内にご連絡します。", done_back: "もう一度予約",
chat_h: "お問い合わせ", chat_sub: "サービスや特別リクエストはこちら",
kakao: "KakaoTalk", whatsapp: "WhatsApp",
footer: "© 2025 peachko · ソウル, 韓国",
},
ZH: {
nav0: "服务", nav1: "艺术家", nav2: "预约", chat: "咨询", nav_login: "登录", nav_logout: "登出",
hero_tag: "首尔上门K-美妆服务",
hero_h1a: "K-美妆，", hero_h1b: "送到", hero_h1c: "你的房间。",
hero_sub: "无需自己搜索沙龙，无需担心语言障碍。选择艺术家，提供酒店地址，醒来就能光彩照人。",
hero_cta: "立即预约", hero_cta2: "查看艺术家",
stat1n: "500+", stat1l: "位顾客", stat2n: "15位", stat2l: "艺术家", stat3n: "4.9★", stat3l: "评分",
badge_sub: "今日造型", badge_title: "K光芒 准备好了",
before: "以前", peachko_label: "peachko",
prob_label: "关于peachko", prob_h: "我们解决了烦恼",
prob_bad:  ["搜索韩语网站", "在陌生街道迷路", "语言障碍", "浪费旅行时间"],
prob_good: ["用中文轻松预约", "艺术家上门服务", "无语言障碍", "化妆后直接出发"],
how_label: "简单3步", how_h: "使用方法",
steps: [
{ n: "01", t: "选择造型",    d: "从服务和艺术家中进行选择" },
{ n: "02", t: "输入酒店信息", d: "填写地址、日期和时间" },
{ n: "03", t: "焕发光彩出发", d: "艺术家上门 → 开启美好一天" },
],
svc_label: "服务介绍", svc_h: "我们的服务",
services: [
{ title: "面部彩妆",   time: "60分钟",  price: "₩80,000起",  desc: "玻璃肌、渐变唇妆 & K-魅力妆容" },
{ title: "面部+发型",  time: "90分钟",  price: "₩130,000起", desc: "K-POP风格全套造型" },
{ title: "全套精致妆", time: "120分钟", price: "₩180,000起", desc: "面部+发型+假睫毛" },
{ title: "特殊场合",   time: "150分钟", price: "₩220,000起", desc: "婚礼、写真等定制妆容" },
],
art_label: "艺术家", art_h: "认识我们的艺术家", art_book: "预约", art_reviews: "条评价",
artists: [
{ name: "素妍", spec: "玻璃肌 & 柔美妆容",  rating: "4.9", rev: 128, tag: "热门",    img: "https://images.unsplash.com/photo-1596815064285-45ed8a9c0463?w=400&q=85&fit=crop&crop=faces,top" },
{ name: "敏在", spec: "K-POP偶像妆容",       rating: "4.8", rev: 94,  tag: "粉丝最爱", img: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&q=85&fit=crop&crop=faces,top" },
{ name: "海林", spec: "婚礼 & 时尚大片",     rating: "5.0", rev: 61,  tag: "最高评分", img: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=400&q=85&fit=crop&crop=faces,top" },
],
rev_label: "真实评价", rev_h: "顾客心声",
reviews: [
{ name: "Emma L.",   flag: "🇺🇸", text: "早上8点来到我的酒店。整天都感觉像韩剧女主角一样！",   svc: "面部+发型" },
{ name: "Chiara M.", flag: "🇮🇹", text: "不懂韩语、不认识路也没关系。完美妆容直接送到房间！",   svc: "全套精致妆" },
{ name: "Aiko T.",   flag: "🇯🇵", text: "只凭一张照片就完美还原了我想要的妆容。",              svc: "面部彩妆" },
],
book_label: "开始预约", book_h: "预约您的造型",
f_service: "选择服务", f_artist: "选择艺术家",
f_date: "日期", f_time: "时间",
f_hotel: "酒店 / 首尔地址", f_hotel_ph: "例如: 首尔乐天酒店, 明洞",
book_sub: "请前往安全预约页面填写详细信息。",
f_cta: "前往预约",
done_h: "预约成功！", done_sub: "您的预约已收到，我们将在30分钟内与您确认。", done_back: "再次预约",
chat_h: "需要帮助？", chat_sub: "有关服务或特殊要求的问题，请联系我们",
kakao: "KakaoTalk", whatsapp: "WhatsApp",
footer: "© 2025 peachko · 首尔, 韩国",
},
};

/* ══════════════════════════════════════
STATE
══════════════════════════════════════ */
let currentLang = "EN";

/* ══════════════════════════════════════
   로그인 상태에 따라 버튼 업데이트 (추가)
   ══════════════════════════════════════ */
function updateAuthButton(user) {
  const loginBtn = document.querySelector('[data-key="nav_login"]');
  if (!loginBtn) return;

  if (user) {
    // [로그인 상태]
    loginBtn.textContent = T[currentLang].nav_logout;
    loginBtn.onclick = () => {
      signOut(auth).then(() => {
        alert("로그아웃 되었습니다.");
        location.reload(); // 상태 반영을 위해 새로고침
      });
    };
  } else {
    // [로그아웃 상태]
    loginBtn.textContent = T[currentLang].nav_login;
    loginBtn.onclick = () => {
      location.href = 'login.html';
    };
  }
}

// Firebase 상태 감시자 등록
onAuthStateChanged(auth, (user) => {
  updateAuthButton(user);
});

/* ══════════════════════════════════════
RENDER DYNAMIC SECTIONS
══════════════════════════════════════ */
function renderProbLists(t) {
const bad  = document.getElementById("prob-bad-list");
const good = document.getElementById("prob-good-list");
if (bad)  bad.innerHTML  = t.prob_bad.map(s  => `<li>${s}</li>`).join("");
if (good) good.innerHTML = t.prob_good.map(s => `<li>${s}</li>`).join("");
}

function renderSteps(t) {
const grid = document.getElementById("steps-grid");
if (!grid) return;
grid.innerHTML = t.steps.map((s, i) => ` <div class="step-card reveal${i === 1 ? " mid" : ""}${i > 0 ? " delay" + i : ""}"> <div class="step-num">${s.n}</div> <div class="step-title">${s.t}</div> <div class="step-desc">${s.d}</div> </div>`).join("");
observeReveal();
}

function renderServices(t) {
const grid = document.getElementById("services-grid");
if (!grid) return;
grid.innerHTML = t.services.map((s, i) => ` <div class="svc-card reveal${i > 0 ? " delay" + Math.min(i, 3) : ""}"> <div class="svc-time">⏱ ${s.time}</div> <div class="svc-title">${s.title}</div> <div class="svc-desc">${s.desc}</div> <div class="svc-price">${s.price}</div> </div>`).join("");
observeReveal();
}

function renderArtists(t) {
const grid = document.getElementById("artists-grid");
if (!grid) return;
grid.innerHTML = t.artists.map((a, i) => ` <div class="artist-card reveal${i > 0 ? " delay" + i : ""}"> <div class="artist-photo"> <img src="${a.img}" alt="${a.name} K-Makeup" onerror="this.style.display='none';this.insertAdjacentHTML('afterend','<div class=\\'artist-photo-fallback\\'>💄</div>')" /> <div class="artist-tag">${a.tag}</div> </div> <div class="artist-info"> <div class="artist-name">${a.name}</div> <div class="artist-spec">${a.spec}</div> <div class="artist-rating">★ ${a.rating} · ${a.rev} ${t.art_reviews}</div> <button class="btn-accent artist-btn" onclick="selectArtist('${a.name}')">${t.art_book} ${a.name}</button> </div> </div>`).join("");
observeReveal();
}

function renderReviews(t) {
const grid = document.getElementById("reviews-grid");
if (!grid) return;
grid.innerHTML = t.reviews.map((r, i) => ` <div class="review-card reveal${i > 0 ? " delay" + i : ""}"> <div class="review-stars">★★★★★</div> <div class="review-text">"${r.text}"</div> <div class="review-meta"> <span class="review-name">${r.flag} ${r.name}</span> <span class="review-svc">${r.svc}</span> </div> </div>`).join("");
observeReveal();
}

function populateSelects(t) {
const svcSel = document.getElementById("f-service");
const artSel = document.getElementById("f-artist");
if (svcSel) {
svcSel.innerHTML = `<option value="">${t.f_service}</option>` +
t.services.map(s => `<option value="${s.title}">${s.title} · ${s.price}</option>`).join("");
}
if (artSel) {
artSel.innerHTML = `<option value="">${t.f_artist}</option>` +
t.artists.map(a => `<option value="${a.name}">${a.name}</option>`).join("");
}
}

/* ══════════════════════════════════════
STATIC TEXT UPDATE (data-key elements)
══════════════════════════════════════ */
function applyTranslations(t) {
  document.querySelectorAll("[data-key]").forEach(el => {
    const key = el.dataset.key;
    
    // 로그인 버튼인 경우, 현재 유저 상태에 따라 텍스트 결정
    if (key === "nav_login") {
      el.textContent = auth.currentUser ? t.nav_logout : t.nav_login;
      return;
    }

    if (t[key] !== undefined && typeof t[key] === "string") el.textContent = t[key];
  });
  // ... 나머지 코드 유지
}

/* ══════════════════════════════════════
MAIN RENDER
══════════════════════════════════════ */
function render(lang) {
const t = T[lang];
applyTranslations(t);
renderProbLists(t);
renderSteps(t);
renderServices(t);
renderArtists(t);
renderReviews(t);
populateSelects(t);
}

/* ══════════════════════════════════════
LANGUAGE SWITCHER
══════════════════════════════════════ */
const LANG_LABELS = { EN: "🇬🇧 EN", KO: "🇰🇷 KO", JP: "🇯🇵 JP", ZH: "🇨🇳 ZH" };

function initLangSwitcher() {
const toggle   = document.getElementById("langToggle");
const dropdown = document.getElementById("langDropdown");
const opts     = document.querySelectorAll(".lang-opt");

toggle.addEventListener("click", (e) => {
e.stopPropagation();
dropdown.classList.toggle("open");
});

document.addEventListener("click", () => dropdown.classList.remove("open"));

opts.forEach(btn => {
btn.addEventListener("click", (e) => {
e.stopPropagation();
const lang = btn.dataset.lang;
currentLang = lang;
localStorage.setItem("peachko_lang", lang);
toggle.textContent = LANG_LABELS[lang] + " ▾";
opts.forEach(b => b.classList.toggle("active", b.dataset.lang === lang));
dropdown.classList.remove("open");
render(lang);
});
});
}

/* ══════════════════════════════════════
SCROLL — header + smooth nav
══════════════════════════════════════ */
function initScroll() {
const header = document.getElementById("header");
window.addEventListener("scroll", () => {
header.classList.toggle("scrolled", window.scrollY > 50);
});

document.querySelectorAll("[data-scroll]").forEach(btn => {
btn.addEventListener("click", () => {
const target = document.getElementById(btn.dataset.scroll);
if (target) target.scrollIntoView({ behavior: "smooth" });
});
});

document.getElementById("floatChat").addEventListener("click", () => {
document.getElementById("chat").scrollIntoView({ behavior: "smooth" });
});
}

/* ══════════════════════════════════════
REVEAL ON SCROLL (IntersectionObserver)
══════════════════════════════════════ */
function observeReveal() {
const io = new IntersectionObserver((entries) => {
entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("visible"); });
}, { threshold: 0.1 });

document.querySelectorAll(".reveal, .fade-in").forEach(el => {
if (!el.classList.contains("visible")) io.observe(el);
});
}

/* ══════════════════════════════════════
BOOKING FORM
══════════════════════════════════════ */
function selectArtist(name) {
document.getElementById("f-artist").value = name;
document.getElementById("booking").scrollIntoView({ behavior: "smooth" });
}

function initBooking() {
  const redirectBtn = document.getElementById("bookRedirectBtn");

  if (redirectBtn) {
    redirectBtn.addEventListener("click", () => {
      // script.js의 initBooking 함수 부분
      const bookingUrl = "booking.html"; // 외부 URL 대신 우리가 만든 파일로 변경
      // 새 창(새 탭)에서 예약 페이지 열기
      window.open(bookingUrl, "_blank");
      
      // (참고) 만약 현재 창에서 바로 페이지를 넘기고 싶다면 위 window.open 대신 아래 코드를 사용하세요:
      // window.location.href = bookingUrl;
    });
  }
}

/* ══════════════════════════════════════
INIT
══════════════════════════════════════ */
document.addEventListener("DOMContentLoaded", () => {
render("EN");
initLangSwitcher();
initScroll();
initBooking();
observeReveal();
});

window.selectArtist = selectArtist;