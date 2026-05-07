import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";

const FLIGHT_TARGET = "2026-05-10T22:00:00+03:00";
const WEATHER_URL =
  "https://api.open-meteo.com/v1/forecast?latitude=-8.65&longitude=115.22&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=Asia%2FMakassar&forecast_days=14";

const icon = {
  plane: "✈️",
  home: "🏡",
  fire: "🔥",
  calendar: "📅",
  map: "📍",
  users: "👥",
  wallet: "💳",
  waves: "🌊",
  dive: "🤿",
  air: "🪂",
  car: "🚙",
  party: "🎉",
  bike: "🛵",
  check: "✅",
  palm: "🌴",
  sparkles: "✨",
  bed: "🛏️",
  alert: "⚠️",
  chef: "👨‍🍳",
  food: "🍽️",
  music: "🎵",
  trophy: "🏆",
  weather: "🌤️",
  formula: "🧮",
  shield: "🛡️",
  block: "🚫",
  heart: "💘",
  elephant: "🐘",
  drink: "🍹",
  road: "🛣️",
  clock: "⏰",
  pin: "📌",
  status: "🛰️",
};

const navItems = [
  ["home", { en: "Home", ar: "الرئيسية" }],
  ["hype", { en: "Squad Hype", ar: "حماس القروب" }],
  ["trip", { en: "Trip", ar: "الرحلة" }],
  ["flight-status", { en: "Flight Status", ar: "حالة الرحلة" }],
  ["accommodation", { en: "Accommodation", ar: "السكن" }],
  ["itinerary", { en: "Itinerary", ar: "الجدول" }],
  ["todo", { en: "To Do", ar: "المهام" }],
  ["things", { en: "Things To Do", ar: "أشياء نسويها" }],
  ["members", { en: "Trip Members", ar: "الأعضاء" }],
  ["budget", { en: "Budget", ar: "الميزانية" }],
];

function txt(value, lang) {
  if (value && typeof value === "object") return value[lang] || value.en || "";
  return value ?? "";
}

const copy = {
  brand: { en: "Bali Squad", ar: "قروب بالي" },
  month: { en: "May 2026", ar: "مايو ٢٠٢٦" },
  launch: { en: "Launch Mode", ar: "وضع الانطلاق" },
  heroTag: {
    en: "5 members · 10 nights · Umalas, Bali · wedding raid before takeoff",
    ar: "٥ أعضاء · ١٠ ليالي · أومالاس، بالي · مداهمة زواج قبل الإقلاع",
  },
  heroTitle: { en: "Bali Squad Trip Control Center", ar: "مركز تحكم رحلة بالي" },
  heroText: {
    en: "Flights, villa takeover, weather checks, road missions, daily chaos planning, live flight ops, to-do tracking, squad challenges, and budget damage control.",
    ar: "الرحلات، احتلال الفيلا، الطقس، مشوار السيارة، التخطيط اليومي للفوضى، متابعة الرحلات، قائمة المهام، تحديات القروب، والسيطرة على الميزانية.",
  },
  startHype: { en: "Start the Hype", ar: "ابدأ الحماس" },
  openBudget: { en: "Open Budget Sheet", ar: "افتح الميزانية" },
  baseCamp: { en: "Base Camp", ar: "المقر الرئيسي" },
  villaCaption: {
    en: "Umalas · 11–21 May · pool, privacy, lovely host, and elite poor decisions",
    ar: "أومالاس · ١١–٢١ مايو · مسبح، خصوصية، مضيفة لطيفة، وقرارات نخبوية سيئة",
  },
  hypeEyebrow: { en: "Countdown + Weather + Wedding Chaos", ar: "العد التنازلي والطقس وفوضى الزواج" },
  hypeTitle: { en: "Squad Hype Dashboard", ar: "لوحة حماس القروب" },
  countdownChip: { en: "Wedding raid → Riyadh reset → Bali takeoff", ar: "مداهمة الزواج ← رجعة الرياض ← إقلاع بالي" },
  wheelsUp: { en: "This is not a drill", ar: "الموضوع جد مو تدريب" },
  baliLive: { en: "Bali Mode Activated", ar: "تم تفعيل وضع بالي" },
  countdownSub: {
    en: "First we attack Onenfr's wedding in Buraydah, then Saud kidnaps the boys back to Riyadh, then Qatar Airways launches the chaos toward Bali.",
    ar: "أول شيء نهجم على زواج عنيفر في بريدة، وبعدها سعود يخطف الشباب ويرجعهم للرياض، وبعدها الخطوط القطرية تطلق الفوضى إلى بالي.",
  },
  timeLeft: { en: "Time left until the squad becomes airport content", ar: "الوقت المتبقي قبل ما يصير القروب محتوى مطار" },
  launchTime: { en: "Main departure: 10 May 2026 · 22:00 · Riyadh Terminal 5", ar: "المغادرة الرئيسية: ١٠ مايو ٢٠٢٦ · ٢٢:٠٠ · صالة ٥ الرياض" },
  weatherTitle: { en: "Live Bali Weather", ar: "طقس بالي المباشر" },
  weatherSub: { en: "Daily auto-update", ar: "تحديث يومي تلقائي" },
  loadingWeather: { en: "Loading Bali weather...", ar: "جاري تحميل طقس بالي..." },
  weatherFallback: { en: "Live weather is taking a nap. Showing Bali-mode fallback.", ar: "الطقس المباشر نايم شوي. عرضنا وضع بالي الاحتياطي." },
  codeTitle: { en: "Code 02 Dictionary:", ar: "قاموس كود 02:" },
  codeText: {
    en: "night-mode villa operations: music, dancing, suspicious coconut water, dangerous confidence, and next-day recovery damage.",
    ar: "عمليات الوضع الليلي في الفيلا: موسيقى، رقص، موية جوز هند مشبوهة، ثقة خطيرة، وضرر تعافي اليوم التالي.",
  },
  tripDetails: { en: "Trip Details", ar: "تفاصيل الرحلة" },
  flights: { en: "Flights", ar: "الرحلات" },
  villa: { en: "Villa", ar: "الفيلا" },
  accommodation: { en: "Accommodation", ar: "السكن" },
  itineraryTitle: { en: "Daily Itinerary", ar: "الجدول اليومي" },
  schedule: { en: "Schedule", ar: "الجدول" },
  recommendations: { en: "Recommendations", ar: "التوصيات" },
  things: { en: "Things To Do", ar: "أشياء نسويها" },
  squad: { en: "Squad", ar: "القروب" },
  members: { en: "Trip Members", ar: "الأعضاء" },
  money: { en: "Money", ar: "الفلوس" },
  budget: { en: "Editable Budget Sheet", ar: "جدول الميزانية القابل للتعديل" },
  footer: {
    en: "Bali Squad Trip Website · Weather updates live · Budget is editable · Flight ops are armed · Code 02 stays classified.",
    ar: "موقع رحلة قروب بالي · الطقس مباشر · الميزانية قابلة للتعديل · عمليات الرحلات جاهزة · كود 02 يبقى سرياً.",
  },
};

const backgroundImages = [
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1546182990-dffeafbe841d?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1552410260-0fd9b577afa6?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80",
];

const villaImages = [
  ["https://a0.muscache.com/im/pictures/miso/Hosting-594590040832411269/original/aee350cb-7e48-45bc-bfc2-d7e110fcb7d4.jpeg?im_w=1200", { en: "Infinity pool & garden", ar: "المسبح والحديقة" }],
  ["https://a0.muscache.com/im/pictures/887413dd-8e42-4a51-abaf-99c852c61f94.jpg?im_w=1200", { en: "Living & dining area", ar: "منطقة المعيشة والطعام" }],
  ["https://a0.muscache.com/im/pictures/miso/Hosting-594590040832411269/original/6397d293-8f39-4db6-8af2-94d1d0b4b170.jpeg?im_w=1200", { en: "Villa upper floor view", ar: "إطلالة الدور العلوي" }],
  ["https://a0.muscache.com/im/pictures/miso/Hosting-594590040832411269/original/af03dc6a-7b31-420a-8f04-c5bf643cd0bc.jpeg?im_w=1200", { en: "Outdoor shower vibe", ar: "أجواء الشاور الخارجي" }],
];

const tripLegs = [
  {
    id: "ROAD-BRY-RUH",
    kind: "road",
    number: { en: "Road mission", ar: "مهمة الطريق" },
    from: { en: "Buraydah", ar: "بريدة" },
    to: { en: "Riyadh", ar: "الرياض" },
    terminalFrom: { en: "Wedding battlefield", ar: "ساحة الزواج" },
    terminalTo: { en: "Recovery staging area", ar: "منطقة إعادة التجهيز" },
    depart: "2026-05-10T00:30:00+03:00",
    arrive: "2026-05-10T04:30:00+03:00",
    operator: { en: "Saud Kidnap Express", ar: "سعود كيدناب إكسبريس" },
    duration: "~04:00",
    cabin: { en: "Car vibes", ar: "أجواء السيارة" },
    baggage: { en: "Everyone + drama", ar: "الكل + الدراما" },
    note: { en: "Attend Onenfr's wedding, collect the squad, and bring them back to Riyadh alive enough for check-in.", ar: "نحضر زواج عنيفر، نجمع القروب، ونرجعهم الرياض وهم لسه صالحين للتشيك إن." },
    statusLinks: [],
  },
  {
    id: "QR1165",
    kind: "flight",
    number: "QR1165",
    from: { en: "Riyadh King Khalid Intl", ar: "مطار الملك خالد الدولي - الرياض" },
    to: { en: "Doha Hamad International", ar: "مطار حمد الدولي - الدوحة" },
    terminalFrom: { en: "Terminal 5", ar: "الصالة ٥" },
    terminalTo: { en: "Main terminal", ar: "الصالة الرئيسية" },
    depart: "2026-05-10T22:00:00+03:00",
    arrive: "2026-05-10T23:40:00+03:00",
    operator: { en: "Qatar Airways", ar: "الخطوط القطرية" },
    duration: "01:40",
    cabin: { en: "Economy · ECLASSIC · Fare OLSAP1RE", ar: "اقتصادي · ECLASSIC · فئة OLSAP1RE" },
    baggage: { en: "25K · Booking OK", ar: "25 كجم · حالة الحجز OK" },
    note: { en: "Marketed and operated by Qatar Airways.", ar: "مسوقة ومشغلة بواسطة الخطوط القطرية." },
    statusLinks: [
      { label: "Qatar", href: "https://fs.qatarairways.com/" },
      { label: "FlightAware", href: "https://www.flightaware.com/live/flight/QTR1165" },
      { label: "FR24", href: "https://www.flightradar24.com/data/flights/qr1165" },
    ],
  },
  {
    id: "QR962",
    kind: "flight",
    number: "QR962",
    from: { en: "Doha Hamad International", ar: "مطار حمد الدولي - الدوحة" },
    to: { en: "Denpasar-Bali Ngurah Rai", ar: "مطار نجوراه راي - بالي" },
    terminalFrom: { en: "Main terminal", ar: "الصالة الرئيسية" },
    terminalTo: { en: "Terminal I", ar: "الصالة I" },
    depart: "2026-05-11T02:10:00+03:00",
    arrive: "2026-05-11T16:55:00+08:00",
    operator: { en: "Qatar Airways", ar: "الخطوط القطرية" },
    duration: "09:45",
    cabin: { en: "Economy · ECLASSIC · Fare OLSAP1RE", ar: "اقتصادي · ECLASSIC · فئة OLSAP1RE" },
    baggage: { en: "25K · Booking OK", ar: "25 كجم · حالة الحجز OK" },
    note: { en: "The long-haul leg. Sleep, eat, stare at the map, repeat.", ar: "رحلة المسافة الطويلة. نم، كل، طالع بالخريطة، وكرر." },
    statusLinks: [
      { label: "Qatar", href: "https://fs.qatarairways.com/" },
      { label: "FlightAware", href: "https://www.flightaware.com/live/flight/QTR962" },
      { label: "FR24", href: "https://www.flightradar24.com/data/flights/qr962" },
    ],
  },
  {
    id: "QR963",
    kind: "flight",
    number: "QR963",
    from: { en: "Denpasar-Bali Ngurah Rai", ar: "مطار نجوراه راي - بالي" },
    to: { en: "Doha Hamad International", ar: "مطار حمد الدولي - الدوحة" },
    terminalFrom: { en: "Terminal I", ar: "الصالة I" },
    terminalTo: { en: "Main terminal", ar: "الصالة الرئيسية" },
    depart: "2026-05-21T18:35:00+08:00",
    arrive: "2026-05-21T23:40:00+03:00",
    operator: { en: "Qatar Airways", ar: "الخطوط القطرية" },
    duration: "10:05",
    cabin: { en: "Economy · ECLASSIC · Fare OLSAP1RE", ar: "اقتصادي · ECLASSIC · فئة OLSAP1RE" },
    baggage: { en: "25K · Booking OK", ar: "25 كجم · حالة الحجز OK" },
    note: { en: "The sad goodbye flight. Bali tries to keep us one last time.", ar: "رحلة الوداع الحزينة. بالي تحاول تحتفظ بنا للمرة الأخيرة." },
    statusLinks: [
      { label: "Qatar", href: "https://fs.qatarairways.com/" },
      { label: "FlightAware", href: "https://www.flightaware.com/live/flight/QTR963" },
      { label: "FR24", href: "https://www.flightradar24.com/data/flights/qr963" },
    ],
  },
  {
    id: "QR1172",
    kind: "flight",
    number: "QR1172",
    from: { en: "Doha Hamad International", ar: "مطار حمد الدولي - الدوحة" },
    to: { en: "Riyadh King Khalid Intl", ar: "مطار الملك خالد الدولي - الرياض" },
    terminalFrom: { en: "Main terminal", ar: "الصالة الرئيسية" },
    terminalTo: { en: "Terminal 5", ar: "الصالة ٥" },
    depart: "2026-05-22T01:25:00+03:00",
    arrive: "2026-05-22T03:30:00+03:00",
    operator: { en: "Qatar Airways", ar: "الخطوط القطرية" },
    duration: "02:05",
    cabin: { en: "Economy · ECLASSIC · Fare OLSAP1RE", ar: "اقتصادي · ECLASSIC · فئة OLSAP1RE" },
    baggage: { en: "25K · Booking OK", ar: "25 كجم · حالة الحجز OK" },
    note: { en: "Final landing. Riyadh receives the damaged but experienced squad.", ar: "الهبوط الأخير. الرياض تستقبل القروب المتضرر لكن الخبير." },
    statusLinks: [
      { label: "Qatar", href: "https://fs.qatarairways.com/" },
      { label: "FlightAware", href: "https://www.flightaware.com/live/flight/QTR1172" },
      { label: "FR24", href: "https://www.flightradar24.com/data/flights/qr1172" },
    ],
  },
];

const members = [
  {
    name: { en: "Saud", ar: "سعود" },
    emoji: "🐼",
    role: { en: "Budget Boss, schedule wizard, logistics officer & grocery negotiator", ar: "رئيس الميزانية، ساحر الجدول، مسؤول اللوجستيات، ومفاوض البقالة" },
    vibe: { en: "Light blue + panda theme", ar: "أزرق فاتح + ستايل باندا" },
    color: "bg-sky-100 text-sky-800 border-sky-200",
    challenges: [
      { en: "Wear the panda/light-blue fit for one full villa day.", ar: "البس ستايل الباندا/الأزرق الفاتح يوم كامل في الفيلا." },
      { en: "Do the morning budget audit while everyone pretends to be alive.", ar: "سو تدقيق الميزانية الصباحي والكل يتظاهر أنه صاحي." },
      { en: "Buy groceries without letting anyone add random nonsense.", ar: "اشتر المقاضي بدون ما تخلي أحد يضيف أشياء عشوائية." },
      { en: "Lead one emergency hangover recovery meeting by the pool.", ar: "قد اجتماع تعافي طارئ عند المسبح." },
    ],
  },
  {
    name: { en: "Abdullah", ar: "عبدالله" },
    emoji: "👑",
    role: { en: "Trip Leader, booking king & official +21 chaos supervisor", ar: "قائد الرحلة، ملك الحجوزات، ومشرف فوضى +21 الرسمي" },
    vibe: { en: "Boss mode / black & gold", ar: "وضع القائد / أسود وذهبي" },
    color: "bg-amber-100 text-amber-800 border-amber-200",
    challenges: [
      { en: "Approve every major plan in 30 seconds or pay snack tax.", ar: "وافق على أي خطة كبيرة خلال ٣٠ ثانية أو ادفع ضريبة سناكات." },
      { en: "Give one dramatic leader speech before beach club entry.", ar: "اعطِ خطاب قائد درامي قبل دخول البيتش كلوب." },
      { en: "Keep all booking screenshots ready like classified files.", ar: "خلي كل صور الحجوزات جاهزة كأنها ملفات سرية." },
      { en: "Save the squad once when everyone forgets what day it is.", ar: "أنقذ القروب مرة لما الكل ينسى اليوم." },
    ],
  },
  {
    name: { en: "Naif", ar: "نايف" },
    emoji: "🔥",
    role: { en: "BBQ commander, party starter & social department director", ar: "قائد الشواء، مشعل الحفلات، ومدير العلاقات الاجتماعية" },
    vibe: { en: "Red party shirt / villa flame mode", ar: "قميص أحمر للحفلات / وضع لهب الفيلا" },
    color: "bg-rose-100 text-rose-800 border-rose-200",
    challenges: [
      { en: "Start one BBQ night with a chef speech nobody asked for.", ar: "ابدأ ليلة الشواء بخطاب شيف محد طلبه." },
      { en: "Create one playlist that does not get skipped in 2 minutes.", ar: "سو بلاي لست ما تنسحب بعد دقيقتين." },
      { en: "Bring the party energy before everyone becomes furniture.", ar: "جيب طاقة الحفلة قبل ما يصير الكل أثاث." },
      { en: "Organize one villa night that gets named forever.", ar: "نظم ليلة في الفيلا يصير لها اسم للأبد." },
    ],
  },
  {
    name: { en: "Sohel", ar: "سهيل" },
    emoji: "🛵",
    role: { en: "Activities CEO, booking machine & schedule detail hunter", ar: "مدير الفعاليات، ماكينة الحجوزات، وصياد تفاصيل الجدول" },
    vibe: { en: "Sporty adventure fit", ar: "ستايل رياضي للمغامرات" },
    color: "bg-emerald-100 text-emerald-800 border-emerald-200",
    challenges: [
      { en: "Book one activity without changing the time 3 times.", ar: "احجز فعالية بدون تغيير الوقت ٣ مرات." },
      { en: "Make everyone arrive 15 minutes early using pure pressure.", ar: "خل الكل يوصل قبل الوقت بـ١٥ دقيقة بالضغط فقط." },
      { en: "Negotiate one group activity like he owns the company.", ar: "فاوض على فعالية للقروب كأنه يملك الشركة." },
      { en: "Create a daily activity voice note under 45 seconds.", ar: "سجل فويس يومي للفعاليات أقل من ٤٥ ثانية." },
    ],
  },
  {
    name: { en: "Abdulrhman", ar: "عبدالرحمن" },
    emoji: "🎥",
    role: { en: "Cameraman — Bali After-Dark Documentary Unit", ar: "المصور — وحدة توثيق بالي بعد المغرب" },
    vibe: { en: "Clean white / always camera-ready", ar: "أبيض نظيف / جاهز للتصوير دائماً" },
    color: "bg-violet-100 text-violet-800 border-violet-200",
    challenges: [
      { en: "Take one cinematic group shot every day before the squad collapses.", ar: "خذ لقطة سينمائية للقروب كل يوم قبل الانهيار." },
      { en: "Capture the before-and-after hangover transformation professionally.", ar: "وثق تحول قبل وبعد الهانق أوفر باحتراف." },
      { en: "Make a trip recap video that looks expensive.", ar: "سو فيديو ملخص للرحلة يبان غالي." },
      { en: "No blurry photos allowed. Blurry memories are enough.", ar: "ممنوع الصور المهزوزة. الذكريات المهزوزة تكفي." },
    ],
  },
  {
    name: { en: "Booking Closed", ar: "الحجز مقفل" },
    emoji: "🚫",
    role: { en: "Too late to join. The villa roster is sealed and the chaos quota is full.", ar: "فاتك الوقت. قائمة الفيلا مقفلة وحصة الفوضى اكتملت." },
    vibe: { en: "Apply next season", ar: "قدم الموسم القادم" },
    color: "bg-slate-200 text-slate-800 border-slate-300",
    challenges: [
      { en: "Watch the Instagram stories and regret not booking.", ar: "تابع الستوري واندم أنك ما حجزت." },
      { en: "Wait for season two applications.", ar: "انتظر فتح التقديم للموسم الثاني." },
      { en: "No last-minute seat requests accepted.", ar: "لا نقبل طلبات مقعد في آخر لحظة." },
      { en: "The squad is already over capacity emotionally.", ar: "القروب فوق سعته الاستيعابية عاطفياً بالفعل." },
    ],
  },
];

const itinerary = [
  { date: { en: "11 May", ar: "١١ مايو" }, day: { en: "Monday", ar: "الاثنين" }, title: { en: "Touchdown + Villa Takeover", ar: "الوصول + احتلال الفيلا" }, notes: { en: "Arrival 16:55 in Bali, villa check-in at 5 PM, hug the lovely host, claim beds, launch operation groceries.", ar: "الوصول ١٦:٥٥ في بالي، دخول الفيلا ٥ مساءً، نحيي المضيفة اللطيفة، نثبت الأسرة، ونطلق عملية المقاضي." }, breakfast: { en: "Plane breakfast — survival mode", ar: "فطور الطيارة — وضع النجاة" }, lunch: { en: "Transit snacks / airport fuel", ar: "سناكات الترانزيت / وقود المطار" }, dinner: { en: "Abunawas or villa delivery", ar: "أبو نواس أو توصيل للفيلا" }, entertainment: { en: "Pool dip + small shopping run", ar: "سباحة خفيفة + مشوار تسوق صغير" }, nightlife: { en: "Soft landing vibes", ar: "أجواء هبوط ناعمة" }, ops: { en: "Operation groceries + SIM cards", ar: "عملية المقاضي + شرائح الاتصال" }, transport: { en: "Private driver from airport.", ar: "سائق خاص من المطار." }, weather: { en: "Warm and humid, around 29° / 25°, likely partly cloudy.", ar: "دافئ ورطب، تقريباً ٢٩° / ٢٥°، غالباً غيوم جزئية." } },
  { date: { en: "12 May", ar: "١٢ مايو" }, day: { en: "Tuesday", ar: "الثلاثاء" }, title: { en: "Villa Chill + Pool Committee", ar: "استرخاء الفيلا + لجنة المسبح" }, notes: { en: "First proper day. No hero moves before breakfast.", ar: "أول يوم فعلي. بدون بطولات قبل الفطور." }, breakfast: { en: "Villa breakfast", ar: "فطور الفيلا" }, lunch: { en: "Nook Bali or Bali Timbungan", ar: "Nook Bali أو Bali Timbungan" }, dinner: { en: "Seasalt at Alila Seminyak", ar: "Seasalt في Alila Seminyak" }, entertainment: { en: "Pool, chill, coffee, sunset", ar: "مسبح، راحة، قهوة، غروب" }, nightlife: { en: "Easy mode", ar: "وضع سهل" }, ops: { en: "Villa supplies top-up", ar: "تكملة احتياجات الفيلا" }, transport: { en: "Driver or short scooter runs.", ar: "سائق أو مشاوير سكوتر قصيرة." }, weather: { en: "Sunny with light clouds, around 30° / 25°.", ar: "مشمس مع غيوم خفيفة، تقريباً ٣٠° / ٢٥°." } },
  { date: { en: "13 May", ar: "١٣ مايو" }, day: { en: "Wednesday", ar: "الأربعاء" }, title: { en: "Shopping Day + Food Hunt", ar: "يوم التسوق + صيد الأكل" }, notes: { en: "No breakfast planned because apparently we enjoy suffering.", ar: "ما فيه فطور مخطط لأن واضح أننا نستمتع بالمعاناة." }, breakfast: { en: "Coffee counts", ar: "القهوة تنحسب" }, lunch: { en: "Bali Timbungan", ar: "Bali Timbungan" }, dinner: { en: "Kenji Ramen", ar: "Kenji Ramen" }, entertainment: { en: "Shopping + cafés", ar: "تسوق + كافيهات" }, nightlife: { en: "Light mischief", ar: "شغب خفيف" }, ops: { en: "Gift hunting + outfit rescue", ar: "صيد هدايا + إنقاذ الأوتفتات" }, transport: { en: "Private driver — no long walks policy.", ar: "سائق خاص — سياسة بدون مشي طويل." }, weather: { en: "Partly cloudy and hot, around 30° / 24°.", ar: "غائم جزئياً وحار، تقريباً ٣٠° / ٢٤°." } },
  { date: { en: "14 May", ar: "١٤ مايو" }, day: { en: "Thursday", ar: "الخميس" }, title: { en: "ATV / Adventure + Code 02", ar: "دبابات / مغامرة + كود 02" }, notes: { en: "Starts sporty and ends with questionable accounting.", ar: "يبدأ رياضي وينتهي بحسابات مشكوك فيها." }, breakfast: { en: "Villa breakfast", ar: "فطور الفيلا" }, lunch: { en: "Near ATV area", ar: "قريب من منطقة الدبابات" }, dinner: { en: "Seafood or villa BBQ", ar: "بحري أو شواء الفيلا" }, entertainment: { en: "Kuber ATV or rafting", ar: "Kuber ATV أو رافتنق" }, nightlife: { en: "Code 02 warm-up", ar: "إحماء كود 02" }, ops: { en: "Bring dry clothes and confidence", ar: "خذ ملابس ناشفة وثقة" }, transport: { en: "Driver package for the whole day.", ar: "باكيج سائق لليوم كامل." }, weather: { en: "Adventure-friendly, warm with small rain chance.", ar: "جو مناسب للمغامرات، دافئ مع احتمال مطر خفيف." } },
  { date: { en: "15 May", ar: "١٥ مايو" }, day: { en: "Friday", ar: "الجمعة" }, title: { en: "Friday Prayer + Seafood + Water", ar: "صلاة الجمعة + بحري + موية" }, notes: { en: "Friday prayer first, then seafood, then water activities.", ar: "صلاة الجمعة أولاً، بعدها بحري، وبعدها فعاليات مائية." }, breakfast: { en: "Light coffee", ar: "قهوة خفيفة" }, lunch: { en: "Kendi Kuning or Seasalt", ar: "Kendi Kuning أو Seasalt" }, dinner: { en: "Villa dinner or Abunawas", ar: "عشاء الفيلا أو أبو نواس" }, entertainment: { en: "Water activity day", ar: "يوم فعاليات مائية" }, nightlife: { en: "Easy landing", ar: "ختام هادئ" }, ops: { en: "Waterproof phone mode", ar: "وضع حماية الجوال من الماء" }, transport: { en: "Private driver to marina / activity zone.", ar: "سائق خاص إلى المارينا / منطقة الفعاليات." }, weather: { en: "Hot and beach-friendly, around 30° / 25°.", ar: "حار ومناسب للبحر، تقريباً ٣٠° / ٢٥°." } },
  { date: { en: "16 May", ar: "١٦ مايو" }, day: { en: "Saturday", ar: "السبت" }, title: { en: "Code 02 — Full Send", ar: "كود 02 — انطلاق كامل" }, notes: { en: "Villa chaos, dancing, suspicious coconut water, and tomorrow's headache invoice.", ar: "فوضى الفيلا، رقص، موية جوز هند مشبوهة، وفاتورة صداع بكرة." }, breakfast: { en: "Cute idea", ar: "فكرة لطيفة" }, lunch: { en: "Delivery to villa", ar: "توصيل للفيلا" }, dinner: { en: "Naif BBQ or Arabic food", ar: "شواء نايف أو أكل عربي" }, entertainment: { en: "Villa party mode", ar: "وضع حفلة الفيلا" }, nightlife: { en: "Code 02", ar: "كود 02" }, ops: { en: "Charge speakers, protect phones, hide evidence", ar: "اشحن السماعات، احمِ الجوالات، وأخفِ الأدلة" }, transport: { en: "Nobody should be driving late. Stay villa-side.", ar: "محد يسوق متأخر. خلك في الفيلا." }, weather: { en: "Warm night, sticky air, party-approved conditions.", ar: "ليل دافئ، جو رطب، وظروف مناسبة للحفلة." } },
  { date: { en: "17 May", ar: "١٧ مايو" }, day: { en: "Sunday", ar: "الأحد" }, title: { en: "Recovery or Repeat Court", ar: "محكمة التعافي أو التكرار" }, notes: { en: "The squad decides: recovery day or repeat the crime scene.", ar: "القروب يقرر: يوم تعافي أو تكرار مسرح الجريمة." }, breakfast: { en: "Coconut water and regret", ar: "موية جوز هند وندم" }, lunch: { en: "Nook Bali or delivery", ar: "Nook Bali أو توصيل" }, dinner: { en: "Kenji or seafood", ar: "Kenji أو بحري" }, entertainment: { en: "Pool recovery / beach detour", ar: "تعافي عند المسبح / طلعة شاطئ" }, nightlife: { en: "Decision pending", ar: "القرار معلق" }, ops: { en: "Lost & found and memory reconstruction", ar: "مفقودات واستعادة الذاكرة" }, transport: { en: "Driver if the squad is functional.", ar: "سائق إذا القروب كان قادر يتحرك." }, weather: { en: "Mostly sunny, great for recovery by water.", ar: "مشمس غالباً، ممتاز للتعافي عند الماء." } },
  { date: { en: "18 May", ar: "١٨ مايو" }, day: { en: "Monday", ar: "الاثنين" }, title: { en: "Hangover National Holiday", ar: "إجازة الهانق أوفر الوطنية" }, notes: { en: "Official recovery day. No alarms. No judgement.", ar: "يوم تعافي رسمي. بدون منبهات وبدون أحكام." }, breakfast: { en: "Skipped", ar: "تم التخطي" }, lunch: { en: "Soup rescue", ar: "إنقاذ بالشوربة" }, dinner: { en: "Abunawas comfort food", ar: "أكل أبو نواس المريح" }, entertainment: { en: "Massage, pool, Netflix, silence", ar: "مساج، مسبح، نتفلكس، صمت" }, nightlife: { en: "Absolutely not", ar: "أبداً" }, ops: { en: "Hydration & emotional repair", ar: "ترطيب وإصلاح نفسي" }, transport: { en: "Stay near the villa.", ar: "خلك قريب من الفيلا." }, weather: { en: "Humid with possible brief showers, stay flexible.", ar: "رطوبة مع احتمال زخات خفيفة، خلك مرن." } },
  { date: { en: "19 May", ar: "١٩ مايو" }, day: { en: "Tuesday", ar: "الثلاثاء" }, title: { en: "Sea + Air Adventure", ar: "مغامرة بحر وجو" }, notes: { en: "Scuba, snorkeling, parasailing, flyboard, and bragging rights.", ar: "غوص، سنوركلنق، براسيليُنق، فلاي بورد، وحقوق المفاخرة." }, breakfast: { en: "Villa breakfast", ar: "فطور الفيلا" }, lunch: { en: "Water sports area", ar: "منطقة الرياضات البحرية" }, dinner: { en: "Seasalt or Bali Timbungan", ar: "Seasalt أو Bali Timbungan" }, entertainment: { en: "Scuba, parasailing, flyboard, jet ski", ar: "غوص، براسيليُنق، فلاي بورد، جت سكي" }, nightlife: { en: "Beach club or villa chill", ar: "بيتش كلوب أو هدوء الفيلا" }, ops: { en: "Sohel confirms waivers. Saud checks charges", ar: "سهيل يؤكد التعهدات. سعود يراجع الرسوم" }, transport: { en: "Package pickup or private driver.", ar: "بيك أب الباكيج أو سائق خاص." }, weather: { en: "Great water-sports weather, sunny and breezy.", ar: "جو ممتاز للرياضات البحرية، مشمس مع نسيم." } },
  { date: { en: "20 May", ar: "٢٠ مايو" }, day: { en: "Wednesday", ar: "الأربعاء" }, title: { en: "Final Full Day", ar: "آخر يوم كامل" }, notes: { en: "Last proper night. Spend energy wisely. Nobody will.", ar: "آخر ليلة فعلية. استخدم طاقتك بحكمة. محد بيسويها." }, breakfast: { en: "Villa breakfast", ar: "فطور الفيلا" }, lunch: { en: "Nook Bali", ar: "Nook Bali" }, dinner: { en: "Final dinner: Seasalt or Abunawas", ar: "العشاء الأخير: Seasalt أو أبو نواس" }, entertainment: { en: "Shopping, beach club, photoshoot", ar: "تسوق، بيتش كلوب، جلسة تصوير" }, nightlife: { en: "Last Code 02", ar: "آخر كود 02" }, ops: { en: "Pack before midnight or cry at 6 AM", ar: "جهز شنطتك قبل نص الليل أو ابكِ الساعة ٦ صباحاً" }, transport: { en: "Driver all day.", ar: "سائق طول اليوم." }, weather: { en: "Warm and photogenic, strong sunset potential.", ar: "دافئ ومناسب للصور، مع فرصة غروب قوية." } },
  { date: { en: "21 May", ar: "٢١ مايو" }, day: { en: "Thursday", ar: "الخميس" }, title: { en: "Airport Day", ar: "يوم المطار" }, notes: { en: "Checkout, airport, and emotional damage. The lovely host says goodbye.", ar: "تشيك آوت، مطار، وضرر نفسي. المضيفة اللطيفة تودعنا." }, breakfast: { en: "Airport breakfast", ar: "فطور المطار" }, lunch: { en: "Airport lunch", ar: "غداء المطار" }, dinner: { en: "Plane food lottery", ar: "يانصيب أكل الطيارة" }, entertainment: { en: "Duty free + emotional damage", ar: "Duty Free + ضرر نفسي" }, nightlife: { en: "Season two if we miss the flight", ar: "الموسم الثاني إذا فاتتنا الرحلة" }, ops: { en: "Final payments, lost items, passport panic", ar: "مدفوعات نهائية، أغراض ضايعة، هلع الجواز" }, transport: { en: "Private driver to airport.", ar: "سائق خاص للمطار." }, weather: { en: "Warm departure weather, maybe one last tropical tease.", ar: "جو مغادرة دافئ، مع احتمال لمسة استوائية أخيرة." } },
];

const restaurants = [
  [{ en: "Abunawas Restaurant Bali", ar: "مطعم أبو نواس بالي" }, { en: "Arabic / Middle Eastern", ar: "عربي / شرق أوسطي" }, { en: "Comfort food and halal-friendly backup.", ar: "أكل مريح وخيار مناسب للحلال." }, { en: "Safe choice", ar: "خيار آمن" }, "https://www.google.com/maps/search/?api=1&query=Abunawas%20Restaurant%20Bali"],
  [{ en: "Bali Timbungan", ar: "Bali Timbungan" }, { en: "Indonesian / Balinese", ar: "إندونيسي / بالي" }, { en: "Local food night. Confirm no pork or ham.", ar: "ليلة أكل محلي. تأكد بدون خنزير أو هام." }, { en: "Local food", ar: "أكل محلي" }, "https://www.google.com/maps/search/?api=1&query=Bali%20Timbungan"],
  [{ en: "Kenji Ramen & Izakaya", ar: "Kenji Ramen & Izakaya" }, { en: "Japanese / Ramen", ar: "ياباني / رامن" }, { en: "Good late dinner vibe. Check broth and toppings.", ar: "مناسب للعشاء المتأخر. تأكد من المرق والإضافات." }, { en: "Late-night vibe", ar: "أجواء آخر الليل" }, "https://www.google.com/maps/search/?api=1&query=Kenji%20Ramen%20Izakaya%20Bali"],
  [{ en: "Seasalt at Alila Seminyak", ar: "Seasalt في Alila Seminyak" }, { en: "Seafood / Beach view", ar: "مأكولات بحرية / إطلالة بحر" }, { en: "Final dinner candidate with ocean views.", ar: "مرشح للعشاء الأخير مع إطلالة بحر." }, { en: "Seafood view", ar: "إطلالة بحرية" }, "https://www.google.com/maps/search/?api=1&query=Seasalt%20Alila%20Seminyak"],
  [{ en: "Kendi Kuning", ar: "Kendi Kuning" }, { en: "Seafood / Indonesian", ar: "مأكولات بحرية / إندونيسي" }, { en: "Good fish lunch or easy dinner.", ar: "غداء سمك ممتاز أو عشاء بسيط." }, { en: "Fish day", ar: "يوم السمك" }, "https://www.google.com/maps/search/?api=1&query=Kendi%20Kuning%20Bali"],
  [{ en: "Nook Bali", ar: "Nook Bali" }, { en: "Indonesian / Western", ar: "إندونيسي / غربي" }, { en: "Close and relaxed for lunch or coffee.", ar: "قريب ورايق للغداء أو القهوة." }, { en: "Near villa", ar: "قريب من الفيلا" }, "https://www.google.com/maps/search/?api=1&query=Nook%20Bali%20Umalas"],
];

const activities = [
  { icon: "waves", title: { en: "Water Sports", ar: "الرياضات البحرية" }, book: "https://baliwatersports.com/", note: { en: "Good all-in-one sea activities option.", ar: "خيار ممتاز للأنشطة البحرية في مكان واحد." }, items: [["Jet ski", "جت سكي", "https://baliwatersports.com/jet-ski/"], ["Banana boat", "بنانا بوت", "https://baliwatersports.com/banana-boat/"], ["Parasailing", "براسيليُنق", "https://baliwatersports.com/parasailing-adventure/"], ["Flyboard", "فلاي بورد", "https://baliwatersports.com/fly-board/"], ["Kayaking", "كاياك", "https://baliwatersports.com/kayaking/"]] },
  { icon: "dive", title: { en: "Scuba / Snorkeling", ar: "غوص وسنوركلنق" }, book: "https://www.klook.com/destination/c8-bali/1-things-to-do/", note: { en: "Compare operators and reviews on Klook.", ar: "قارن الشركات والتقييمات في Klook." }, items: [["Beginner scuba", "غوص للمبتدئين", "https://www.klook.com/en-US/activity/1598-scuba-diving-bali/"], ["Snorkeling", "سنوركلنق", "https://www.klook.com/en-US/search/result/?query=bali%20snorkeling"], ["Underwater photos", "تصوير تحت الماء", "https://www.klook.com/en-US/search/result/?query=bali%20underwater%20photos"], ["Boat day", "يوم بالقارب", "https://www.klook.com/en-US/search/result/?query=bali%20boat%20trip"]] },
  { icon: "air", title: { en: "Air Activities", ar: "الفعاليات الجوية" }, book: "https://baliwatersports.com/", note: { en: "Low walking. High drama.", ar: "مشي قليل ودراما عالية." }, items: [["Parasailing", "براسيليُنق", "https://baliwatersports.com/parasailing-adventure/"], ["Paragliding", "باراقلايدنق", "https://www.klook.com/en-US/search/result/?query=bali%20paragliding"], ["Flyboard", "فلاي بورد", "https://baliwatersports.com/fly-board/"], ["Scenic options", "خيارات إطلالات", "https://www.klook.com/en-US/search/result/?query=bali%20helicopter%20tour"]] },
  { icon: "car", title: { en: "ATV / Rafting", ar: "دبابات ورافتنق" }, book: "https://www.ubudcenter.com/kuber-atv-quad-rafting/", note: { en: "For adventure photo evidence.", ar: "عشان صور المغامرة تثبت أننا سوينا شيء." }, items: [["Kuber ATV", "دبابات Kuber", "https://www.ubudcenter.com/kuber-atv-quad-rafting/"], ["Telaga Waja rafting", "رافتنق Telaga Waja", "https://www.ubudcenter.com/telaga-waja-rafting/"], ["Quad bike", "دباب رباعي", "https://www.ubudcenter.com/kuber-atv-quad-rafting/"], ["Mud photos", "صور طين", "https://www.ubudcenter.com/kuber-atv-quad-rafting/"]] },
  { icon: "party", title: { en: "Beach Clubs", ar: "بيتش كلوب" }, book: "https://finnsbeachclub.com/", note: { en: "Book ahead for a group.", ar: "احجز بدري إذا القروب كبير." }, items: [["Finns", "Finns", "https://finnsbeachclub.com/"], ["Potato Head", "Potato Head", "https://seminyak.potatohead.co/"], ["Atlas", "Atlas", "https://atlasbeachfest.com/"], ["Villa after-party", "أفتر بارتي الفيلا", "https://www.airbnb.com/rooms/594590040832411269"]] },
  { icon: "bike", title: { en: "Scooter Rental", ar: "تأجير سكوتر" }, book: "https://www.bali4ride.com/", note: { en: "No scooter missions after Code 02.", ar: "ممنوع مشاوير السكوتر بعد كود 02." }, items: [["Short café runs", "مشاوير كوفي قصيرة", "https://www.bali4ride.com/"], ["Nearby shopping", "تسوق قريب", "https://www.bali4ride.com/"], ["Backup transport", "مواصلات احتياطية", "https://www.bali4ride.com/"], ["Confident riders only", "للي يعرف يسوق فقط", "https://www.bali4ride.com/"]] },
  { icon: "car", title: { en: "Private Driver", ar: "سائق خاص" }, book: "https://www.balicab.com/", note: { en: "Simple private car with driver booking.", ar: "حجز بسيط لسيارة خاصة مع سائق." }, items: [["Airport transfer", "نقل المطار", "https://www.balicab.com/"], ["Shopping day", "يوم التسوق", "https://www.balicab.com/"], ["Water sports", "رياضات بحرية", "https://www.balicab.com/"], ["No walking policy", "سياسة بدون مشي", "https://www.balicab.com/"]] },
  { icon: "sparkles", title: { en: "Fancy Car Mode", ar: "وضع السيارة الفخمة" }, book: "https://privatedriverbali.com/", note: { en: "For sunglasses board-meeting arrival.", ar: "لوصول رسمي بنظارات شمسية." }, items: [["Luxury car", "سيارة فخمة", "https://privatedriverbali.com/"], ["Alphard style", "ستايل ألفارد", "https://privatedriverbali.com/"], ["CEO arrival", "وصول المدير التنفيذي", "https://privatedriverbali.com/"], ["Beach club entrance", "دخول بيتش كلوب", "https://privatedriverbali.com/"]] },
];

const rules = [
  { en: "No ham or pork food stops", ar: "بدون مطاعم فيها هام أو خنزير" },
  { en: "No temple visits", ar: "بدون زيارات معابد" },
  { en: "No hiking", ar: "بدون هايكينق" },
  { en: "No long walks", ar: "بدون مشاوير مشي طويلة" },
  { en: "No ritual-related activities", ar: "بدون أي فعاليات طقوسية" },
  { en: "No random 6 AM adventure plans", ar: "بدون خطط مفاجئة الساعة ٦ الصباح" },
];

const initialBudgetItems = [
  { id: 1, item: { en: "Flights", ar: "الرحلات" }, total: 14000, paid: 14000, status: "Paid" },
  { id: 2, item: { en: "Accommodation / Villa", ar: "السكن / الفيلا" }, total: 15333, paid: 15333, status: "Paid" },
  { id: 3, item: { en: "Logistics", ar: "اللوجستيات" }, total: 550, paid: 0, status: "Not paid" },
  { id: 4, item: { en: "F&B", ar: "الأكل والشرب" }, total: 3850, paid: 0, status: "Not paid" },
  { id: 5, item: { en: "Entertainment", ar: "الترفيه" }, total: 4000, paid: 0, status: "Not paid" },
  { id: 6, item: { en: "Private Nightlife Extras", ar: "إضافات ليلية خاصة" }, total: 7500, paid: 0, status: "Optional" },
  { id: 7, item: { en: "Suspicious Coconut Water", ar: "موية جوز الهند المشبوهة" }, total: 0, paid: 0, status: "TBD" },
];

function I({ name, className = "" }) {
  return <span className={`inline-flex items-center justify-center ${className}`}>{icon[name] || "•"}</span>;
}

function currency(value, lang = "en") {
  if (value === null || value === undefined || Number.isNaN(Number(value))) return lang === "ar" ? "غير محدد" : "TBD";
  const locale = lang === "ar" ? "ar-SA" : "en-SA";
  const suffix = lang === "ar" ? "ر.س" : "SAR";
  return `${new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }).format(Number(value))} ${suffix}`;
}

function calculateTotals(items) {
  const confirmed = items
    .filter((x) => x.status !== "Optional" && x.status !== "TBD")
    .reduce((s, x) => s + Number(x.total || 0), 0);
  const paid = items.reduce((s, x) => s + Number(x.paid || 0), 0);
  const optional = items
    .filter((x) => x.status === "Optional" || x.status === "TBD")
    .reduce((s, x) => s + Number(x.total || 0), 0);
  return { confirmed, paid, optional, remaining: Math.max(confirmed - paid, 0), grandTotal: confirmed + optional };
}

function markBudgetRowPaid(rows, id) {
  return rows.map((row) => (row.id === id ? { ...row, paid: Number(row.total || 0), status: "Paid" } : row));
}

function getCountdownParts(targetDate) {
  const diff = new Date(targetDate).getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, landed: true };
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff / 3600000) % 24),
    minutes: Math.floor((diff / 60000) % 60),
    seconds: Math.floor((diff / 1000) % 60),
    landed: false,
  };
}

function weatherEmoji(code) {
  if (code === 0) return "☀️";
  if ([1, 2, 3].includes(code)) return "⛅";
  if ([45, 48].includes(code)) return "🌫️";
  if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code)) return "🌧️";
  if ([95, 96, 99].includes(code)) return "⛈️";
  return "🌤️";
}

function weatherText(code) {
  if (code === 0) return { en: "Clear. Sunscreen tax applies.", ar: "الجو صافي. ضريبة واقي الشمس واجبة." };
  if ([1, 2, 3].includes(code)) return { en: "Partly cloudy. Perfect for acting productive.", ar: "غائم جزئياً. ممتاز للتظاهر بالإنتاجية." };
  if ([45, 48].includes(code)) return { en: "Foggy. Good luck finding your sunglasses.", ar: "ضبابي. الله يعينك تلقى نظارتك." };
  if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code)) return { en: "Rainy. Pool still counts.", ar: "ممطر. المسبح ما زال محسوب." };
  if ([95, 96, 99].includes(code)) return { en: "Thunder vibes. Villa mode recommended.", ar: "أجواء رعد. وضع الفيلا أفضل." };
  return { en: "Bali weather doing Bali things.", ar: "طقس بالي يسوي حركات بالي." };
}

function useCountdown() {
  const [countdown, setCountdown] = useState(() => getCountdownParts(FLIGHT_TARGET));
  useEffect(() => {
    const timer = setInterval(() => setCountdown(getCountdownParts(FLIGHT_TARGET)), 1000);
    return () => clearInterval(timer);
  }, []);
  return countdown;
}

function useWeather() {
  const fallback = [
    { date: { en: "Today", ar: "اليوم" }, max: 30, min: 25, rain: 40, emoji: "🌴", text: { en: "Hot, humid, and ready for bad decisions.", ar: "حر ورطوبة وجاهز للقرارات السيئة." } },
    { date: { en: "Tomorrow", ar: "بكرة" }, max: 30, min: 25, rain: 45, emoji: "🌦️", text: { en: "Pool first. Weather later.", ar: "المسبح أولاً، الطقس لاحقاً." } },
  ];
  const [state, setState] = useState({ loading: true, error: "", days: [] });

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const response = await fetch(WEATHER_URL);
        if (!response.ok) throw new Error("weather failed");
        const data = await response.json();
        const days = (data.daily?.time || []).map((date, i) => {
          const code = data.daily.weather_code?.[i];
          return {
            date,
            max: Math.round(data.daily.temperature_2m_max?.[i] || 0),
            min: Math.round(data.daily.temperature_2m_min?.[i] || 0),
            rain: data.daily.precipitation_probability_max?.[i] || 0,
            emoji: weatherEmoji(code),
            text: weatherText(code),
          };
        });
        if (!cancelled) setState({ loading: false, error: "", days });
      } catch {
        if (!cancelled) setState({ loading: false, error: "weather", days: fallback });
      }
    }
    load();
    const interval = setInterval(load, 21600000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);
  return state;
}

function legStatus(leg) {
  const now = Date.now();
  const depart = new Date(leg.depart).getTime();
  const arrive = new Date(leg.arrive).getTime();
  if (leg.kind === "road") {
    if (now < depart - 60 * 60 * 1000) return { label: { en: "Planned", ar: "مخطط" }, className: "bg-rose-100 text-rose-800", progress: 10 };
    if (now < depart) return { label: { en: "Engines warming up", ar: "نسخن المكينة" }, className: "bg-amber-100 text-amber-800", progress: 30 };
    if (now < arrive) return { label: { en: "Kidnap mission in progress", ar: "عملية الخطف شغالة" }, className: "bg-sky-100 text-sky-800", progress: 70 };
    return { label: { en: "Delivered to Riyadh", ar: "تم التسليم للرياض" }, className: "bg-emerald-100 text-emerald-800", progress: 100 };
  }
  if (now < depart - 3 * 60 * 60 * 1000) return { label: { en: "Scheduled", ar: "مجدولة" }, className: "bg-sky-100 text-sky-800", progress: 10 };
  if (now < depart - 45 * 60 * 1000) return { label: { en: "Check-in open", ar: "التشيك إن مفتوح" }, className: "bg-amber-100 text-amber-800", progress: 25 };
  if (now < depart + 15 * 60 * 1000) return { label: { en: "Boarding / departing", ar: "صعود / إقلاع" }, className: "bg-orange-100 text-orange-800", progress: 45 };
  if (now < arrive) return { label: { en: "In the air", ar: "في الجو" }, className: "bg-indigo-100 text-indigo-800", progress: 75 };
  if (now < arrive + 90 * 60 * 1000) return { label: { en: "Just landed", ar: "هبطت الآن" }, className: "bg-emerald-100 text-emerald-800", progress: 95 };
  return { label: { en: "Completed", ar: "مكتملة" }, className: "bg-slate-200 text-slate-800", progress: 100 };
}

function formatDateTime(value, lang) {
  const d = new Date(value);
  return d.toLocaleString(lang === "ar" ? "ar-SA" : "en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function runSelfTests() {
  const totals = calculateTotals(initialBudgetItems);
  console.assert(totals.confirmed === 37733, `Expected confirmed budget 37733, got ${totals.confirmed}`);
  console.assert(totals.paid === 29333, `Expected paid budget 29333, got ${totals.paid}`);
  console.assert(totals.remaining === 8400, `Expected remaining budget 8400, got ${totals.remaining}`);
  console.assert(navItems.length === 10, `Expected 10 navigation items, got ${navItems.length}`);
  console.assert(itinerary.length === 11, `Expected 11 itinerary days, got ${itinerary.length}`);
  console.assert(members.every((m) => m.challenges.length >= 4), "Each member should have at least 4 challenges");
  console.assert(tripLegs.length === 5, `Expected 5 trip legs, got ${tripLegs.length}`);
  console.assert(getCountdownParts("2000-01-01T00:00:00+00:00").landed === true, "Past countdown should be landed");
}
if (typeof window !== "undefined") runSelfTests();

function Section({ id, eyebrow, title, sectionIcon, children, lang }) {
  return (
    <section id={id} className="scroll-mt-24 py-12">
      <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-7">
        <div className="mb-2 flex items-center gap-2 text-sm font-bold uppercase tracking-[0.2em] text-sky-700">
          <I name={sectionIcon} />
          {txt(eyebrow, lang)}
        </div>
        <h2 className="text-3xl font-black text-slate-950 md:text-5xl">{txt(title, lang)}</h2>
      </motion.div>
      {children}
    </section>
  );
}

function Card({ children, className = "" }) {
  return <div className={`rounded-3xl border border-slate-200 bg-white/95 p-5 shadow-sm backdrop-blur-sm ${className}`}>{children}</div>;
}

function Stat({ statIcon, label, value, sub, lang }) {
  return (
    <Card>
      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-xl text-white">
        <I name={statIcon} />
      </div>
      <div className="text-sm font-semibold text-slate-500">{txt(label, lang)}</div>
      <div className="mt-1 text-2xl font-black text-slate-950">{txt(value, lang)}</div>
      {sub ? <div className="mt-1 text-sm text-slate-500">{txt(sub, lang)}</div> : null}
    </Card>
  );
}

function Info({ label, value, lang }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <div className="text-xs font-bold uppercase text-slate-400">{txt(label, lang)}</div>
      <div className="mt-1 font-black">{txt(value, lang)}</div>
    </div>
  );
}

function Detail({ detailIcon, label, value, lang }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5">
      {detailIcon ? <I name={detailIcon} className="mb-3 text-xl" /> : null}
      <div className="text-sm font-bold text-slate-500">{txt(label, lang)}</div>
      <div className="text-lg font-black">{txt(value, lang)}</div>
    </div>
  );
}

function Row({ label, value, lang }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="font-semibold text-slate-500">{txt(label, lang)}</span>
      <span className="font-black">{txt(value, lang)}</span>
    </div>
  );
}

function CountdownDisplay({ countdown, lang }) {
  const text = countdown.landed
    ? txt({ en: "Bali mode is live", ar: "وضع بالي شغال" }, lang)
    : `${String(countdown.days).padStart(2, "0")}d : ${String(countdown.hours).padStart(2, "0")}h : ${String(countdown.minutes).padStart(2, "0")}m : ${String(countdown.seconds).padStart(2, "0")}s`;

  return (
    <div className="mt-7 rounded-[2rem] border border-white/30 bg-gradient-to-r from-fuchsia-500 via-orange-400 to-amber-300 p-5 text-center text-slate-950 shadow-[0_0_80px_rgba(236,72,153,0.35)] sm:p-7 lg:p-8">
      <div className="text-xs font-black uppercase tracking-[0.22em] text-slate-950">{txt(copy.timeLeft, lang)}</div>
      <div className="mt-3 whitespace-nowrap text-3xl font-black leading-none tracking-tight text-slate-950 sm:text-5xl lg:text-7xl">{text}</div>
      <div className="mt-4 rounded-2xl bg-white/70 px-4 py-3 text-sm font-black text-slate-950">{txt(copy.launchTime, lang)}</div>
    </div>
  );
}

function WeatherCard({ day, lang }) {
  const label =
    typeof day.date === "object"
      ? txt(day.date, lang)
      : new Date(day.date).toLocaleDateString(lang === "ar" ? "ar-SA" : "en-US", { weekday: "short", month: "short", day: "numeric" });

  return (
    <Card className="min-w-[190px] bg-white/90">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm font-black">{label}</div>
          <div className="text-xs font-bold text-slate-500">{txt({ en: "Bali forecast", ar: "توقعات بالي" }, lang)}</div>
        </div>
        <div className="text-3xl">{day.emoji}</div>
      </div>
      <div className="mt-4 text-2xl font-black">
        {day.max}° / {day.min}°
      </div>
      <div className="text-sm font-bold text-sky-700">
        {txt({ en: "Rain chance:", ar: "احتمالية المطر:" }, lang)} {day.rain}%
      </div>
      <p className="mt-3 text-sm leading-6 text-slate-600">{txt(day.text, lang)}</p>
    </Card>
  );
}

function NumberInput({ value, onChange }) {
  return (
    <input
      type="number"
      min="0"
      value={value}
      onChange={(e) => onChange(Number(e.target.value || 0))}
      className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm font-black outline-none focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
    />
  );
}

function ActivityCard({ activity, lang }) {
  return (
    <Card>
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-50 text-xl text-sky-700">
        <I name={activity.icon} />
      </div>
      <h3 className="text-xl font-black">{txt(activity.title, lang)}</h3>
      <ul className="mt-4 space-y-2">
        {activity.items.map(([en, ar, link]) => (
          <li key={en} className="flex gap-2 text-sm leading-6 text-slate-600">
            <I name="check" />
            <a href={link} target="_blank" rel="noreferrer" className="font-bold text-slate-700 underline decoration-slate-300 underline-offset-4 transition hover:text-sky-700 hover:decoration-sky-400">
              {lang === "ar" ? ar : en}
            </a>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-sm leading-6 text-slate-500">{txt(activity.note, lang)}</p>
      <a href={activity.book} target="_blank" rel="noreferrer" className="mt-5 inline-flex rounded-full bg-slate-950 px-4 py-2 text-sm font-black text-white">
        {txt({ en: "Book / Compare Main", ar: "احجز / قارن الرئيسي" }, lang)}
      </a>
    </Card>
  );
}

function MemberCard({ member, lang }) {
  return (
    <motion.div whileHover={{ y: -6 }}>
      <Card>
        <div className={`mb-5 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm font-black ${member.color}`}>
          <span>{member.emoji}</span>
          {txt(member.name, lang)}
        </div>
        <h3 className="text-xl font-black">{txt(member.role, lang)}</h3>
        <Info label={{ en: "Main style", ar: "الستايل الأساسي" }} value={member.vibe} lang={lang} />
        <div className="mt-5 text-sm font-black uppercase tracking-[0.16em] text-slate-500">
          <I name="trophy" /> {txt({ en: "Challenges", ar: "التحديات" }, lang)}
        </div>
        <ul className="mt-3 space-y-3">
          {member.challenges.map((challenge) => (
            <li key={challenge.en} className="rounded-2xl border border-slate-100 p-3 text-sm font-bold leading-6 text-slate-700">
              {txt(challenge, lang)}
            </li>
          ))}
        </ul>
      </Card>
    </motion.div>
  );
}

function BackgroundVibes() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden opacity-45">
      <img src={backgroundImages[0]} alt="" className="absolute -right-16 top-20 h-80 w-60 rotate-6 rounded-[3rem] object-cover shadow-2xl md:h-[30rem] md:w-72" />
      <img src={backgroundImages[1]} alt="" className="absolute -left-12 top-[24rem] h-72 w-56 -rotate-6 rounded-[3rem] object-cover shadow-2xl md:h-[28rem] md:w-72" />
      <img src={backgroundImages[2]} alt="" className="absolute bottom-[12rem] right-6 hidden h-72 w-56 rounded-[3rem] object-cover shadow-2xl lg:block" />
      <img src={backgroundImages[3]} alt="" className="absolute bottom-10 left-8 hidden h-60 w-48 rotate-3 rounded-[3rem] object-cover shadow-2xl lg:block" />
      <img src={backgroundImages[4]} alt="" className="absolute right-[28%] top-[60%] hidden h-52 w-40 -rotate-3 rounded-[3rem] object-cover shadow-2xl xl:block" />
      <img src={backgroundImages[5]} alt="" className="absolute left-[32%] top-24 hidden h-48 w-36 rotate-6 rounded-[3rem] object-cover shadow-2xl xl:block" />
      <img src={backgroundImages[6]} alt="" className="absolute right-[8%] top-[56%] hidden h-48 w-36 -rotate-6 rounded-[3rem] object-cover shadow-2xl 2xl:block" />
      <div className="absolute inset-0 bg-white/30" />
    </div>
  );
}

function VibeRibbon({ lang }) {
  return (
    <div className="grid gap-4 md:grid-cols-4">
      {[
        [backgroundImages[0], { en: "Girls + drinks energy", ar: "أجواء البنات والمشاريب" }],
        [backgroundImages[4], { en: "Elephant safari fantasy", ar: "خيال سفاري الفيلة" }],
        [backgroundImages[1], { en: "Beach look inspiration", ar: "إلهام إطلالات الشاطئ" }],
        [backgroundImages[5], { en: "Bali wild postcard", ar: "بطاقة بالي البرية" }],
      ].map(([src, label]) => (
        <Card key={src} className="overflow-hidden p-0">
          <img src={src} alt={txt(label, lang)} className="h-56 w-full object-cover" />
          <div className="bg-white px-4 py-3 text-sm font-black">{txt(label, lang)}</div>
        </Card>
      ))}
    </div>
  );
}

function BudgetRow({ row, index, pax, onPaid, onChange, lang }) {
  const balance = Math.max(Number(row.total || 0) - Number(row.paid || 0), 0);
  const isPaid = Number(row.paid || 0) >= Number(row.total || 0) && Number(row.total || 0) > 0;

  return (
    <div className={`grid grid-cols-[1.4fr_1fr_1fr_1fr_1fr_1.05fr] items-center gap-3 px-4 py-3 text-sm ${index % 2 ? "bg-slate-50" : "bg-white"}`}>
      <input value={txt(row.item, lang)} readOnly className="rounded-2xl border border-slate-200 bg-white px-3 py-2 font-black outline-none" />
      <NumberInput value={row.total} onChange={(value) => onChange(row.id, "total", value)} />
      <NumberInput value={row.paid} onChange={(value) => onChange(row.id, "paid", value)} />
      <div className="rounded-2xl bg-slate-100 px-3 py-2 font-black">{currency(balance, lang)}</div>
      <div className="rounded-2xl bg-slate-100 px-3 py-2 font-black">{currency(Number(row.total || 0) / pax, lang)}</div>
      <button
        type="button"
        onClick={() => onPaid(row.id)}
        className={`rounded-full px-3 py-2 text-xs font-black text-white transition hover:-translate-y-0.5 ${isPaid ? "bg-slate-500" : "bg-emerald-600 hover:bg-emerald-700"}`}
      >
        {isPaid ? txt({ en: "Paid ✓", ar: "مدفوع ✓" }, lang) : txt({ en: "Mark paid", ar: "تم الدفع" }, lang)}
      </button>
    </div>
  );
}

function FlightStatusSection({ lang }) {
  const [refreshTick, setRefreshTick] = useState(Date.now());
  useEffect(() => {
    const id = setInterval(() => setRefreshTick(Date.now()), 60000);
    return () => clearInterval(id);
  }, []);
  void refreshTick;

  const activeLeg = tripLegs.find((leg) => legStatus(leg).progress < 100) || tripLegs[tripLegs.length - 1];
  const activeStatus = legStatus(activeLeg);

  return (
    <Section id="flight-status" eyebrow={{ en: "Live Travel Ops", ar: "عمليات السفر المباشرة" }} title={{ en: "Qatar Airways Flight Status Center", ar: "مركز حالة رحلات الخطوط القطرية" }} sectionIcon="status" lang={lang}>
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <Card className="bg-gradient-to-br from-slate-950 via-sky-950 to-cyan-700 text-white">
          <div className="mb-3 inline-flex rounded-full bg-white/10 px-4 py-2 text-sm font-black text-white">
            {txt({ en: "Live ops snapshot", ar: "لقطة مباشرة للعمليات" }, lang)}
          </div>
          <h3 className="text-3xl font-black lg:text-5xl">{typeof activeLeg.number === "string" ? activeLeg.number : txt(activeLeg.number, lang)}</h3>
          <p className="mt-4 leading-7 text-slate-100">
            {txt({ en: "This board auto-tracks each leg based on the schedule so you can instantly see what stage the squad is in right now.", ar: "هذه اللوحة تتابع كل مرحلة حسب الجدول حتى تعرف فوراً وضع القروب الحالي." }, lang)}
          </p>
          <div className="mt-6 rounded-3xl bg-white/10 p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="text-xs font-black uppercase tracking-[0.18em] text-cyan-100">{txt({ en: "Current live phase", ar: "المرحلة الحالية" }, lang)}</div>
                <div className="mt-1 text-2xl font-black">{txt(activeStatus.label, lang)}</div>
              </div>
              <span className={`rounded-full px-4 py-2 text-xs font-black ${activeStatus.className}`}>{txt(activeStatus.label, lang)}</span>
            </div>
            <div className="mt-4 h-3 overflow-hidden rounded-full bg-white/15">
              <div className="h-full rounded-full bg-gradient-to-r from-fuchsia-400 via-orange-300 to-amber-200" style={{ width: `${activeStatus.progress}%` }} />
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <Info label={{ en: "From", ar: "من" }} value={activeLeg.from} lang={lang} />
              <Info label={{ en: "To", ar: "إلى" }} value={activeLeg.to} lang={lang} />
              <Info label={{ en: "Departure", ar: "المغادرة" }} value={formatDateTime(activeLeg.depart, lang)} lang={lang} />
              <Info label={{ en: "Arrival", ar: "الوصول" }} value={formatDateTime(activeLeg.arrive, lang)} lang={lang} />
            </div>
          </div>
          <div className="mt-5 rounded-2xl bg-white/10 p-4 text-sm leading-6 text-slate-100">
            <b>{txt({ en: "Note:", ar: "ملاحظة:" }, lang)}</b>{" "}
            {txt({ en: "Public airline APIs for real delay/cancel flags are limited, so this section tracks the live scheduled phase inside the site and keeps the official trackers handy below.", ar: "واجهات الطيران العامة لتأخير/إلغاء الرحلات محدودة، لذلك هذا القسم يتابع المرحلة الحية حسب الجدول داخل الموقع ويُبقي الروابط الرسمية جاهزة بالأسفل." }, lang)}
          </div>
        </Card>

        <div className="grid gap-4">
          {tripLegs.map((leg) => {
            const status = legStatus(leg);
            return (
              <Card key={leg.id} className="overflow-hidden">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">{txt(leg.operator, lang)}</div>
                    <h3 className="text-2xl font-black text-slate-950">{typeof leg.number === "string" ? leg.number : txt(leg.number, lang)}</h3>
                  </div>
                  <span className={`rounded-full px-4 py-2 text-xs font-black ${status.className}`}>{txt(status.label, lang)}</span>
                </div>
                <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                  <Info label={{ en: "From", ar: "من" }} value={leg.from} lang={lang} />
                  <Info label={{ en: "To", ar: "إلى" }} value={leg.to} lang={lang} />
                  <Info label={{ en: "Departure", ar: "المغادرة" }} value={formatDateTime(leg.depart, lang)} lang={lang} />
                  <Info label={{ en: "Arrival", ar: "الوصول" }} value={formatDateTime(leg.arrive, lang)} lang={lang} />
                </div>
                <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                  <Info label={{ en: "Terminal out", ar: "صالة المغادرة" }} value={leg.terminalFrom} lang={lang} />
                  <Info label={{ en: "Terminal in", ar: "صالة الوصول" }} value={leg.terminalTo} lang={lang} />
                  <Info label={{ en: "Duration", ar: "المدة" }} value={leg.duration} lang={lang} />
                  <Info label={{ en: "Cabin / Fare", ar: "المقصورة / الفئة" }} value={leg.cabin} lang={lang} />
                </div>
                <div className="mt-4 rounded-2xl bg-slate-50 p-4 text-sm font-bold leading-6 text-slate-600">{txt(leg.note, lang)}</div>
                {leg.statusLinks.length > 0 ? (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {leg.statusLinks.map((link) => (
                      <a key={link.label} href={link.href} target="_blank" rel="noreferrer" className="rounded-full bg-slate-950 px-4 py-2 text-xs font-black text-white">
                        {link.label}
                      </a>
                    ))}
                  </div>
                ) : null}
              </Card>
            );
          })}
        </div>
      </div>
    </Section>
  );
}

function TodoSection({ lang }) {
  const [tasks, setTasks] = useState(() => {
    if (typeof window === "undefined") return [];
    try {
      return JSON.parse(window.localStorage.getItem("bali-todo-list") || "[]");
    } catch {
      return [];
    }
  });
  const [form, setForm] = useState({ text: "", date: "", time: "" });

  useEffect(() => {
    try {
      window.localStorage.setItem("bali-todo-list", JSON.stringify(tasks));
    } catch {
      // Ignore storage errors.
    }
  }, [tasks]);

  const addTask = () => {
    const text = form.text.trim();
    if (!text) return;
    setTasks((current) => [
      { id: Date.now(), text, date: form.date, time: form.time, done: false },
      ...current,
    ]);
    setForm({ text: "", date: "", time: "" });
  };

  const toggleTask = (id) => setTasks((current) => current.map((task) => task.id === id ? { ...task, done: !task.done } : task));
  const deleteTask = (id) => setTasks((current) => current.filter((task) => task.id !== id));

  return (
    <Section id="todo" eyebrow={{ en: "Planning Board", ar: "لوحة التخطيط" }} title={{ en: "Trip To Do List", ar: "قائمة مهام الرحلة" }} sectionIcon="check" lang={lang}>
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <Card>
          <h3 className="text-2xl font-black">{txt({ en: "Add a plan", ar: "أضف مهمة" }, lang)}</h3>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            {txt({ en: "Use this for grocery runs, driver pickups, activity booking deadlines, restaurant reservations, and squad reminders.", ar: "استخدمها للمقاضي، مواعيد السائق، حجوزات الفعاليات، حجوزات المطاعم، وتذكيرات القروب." }, lang)}
          </p>
          <div className="mt-5 grid gap-3">
            <textarea value={form.text} onChange={(e) => setForm((current) => ({ ...current, text: e.target.value }))} placeholder={txt({ en: "Example: Book Finns Beach Club table", ar: "مثال: احجز طاولة في Finns Beach Club" }, lang)} className="min-h-28 rounded-2xl border border-slate-200 px-4 py-3 font-bold outline-none focus:border-sky-400 focus:ring-4 focus:ring-sky-100" />
            <div className="grid gap-3 sm:grid-cols-2">
              <input type="date" value={form.date} onChange={(e) => setForm((current) => ({ ...current, date: e.target.value }))} className="rounded-2xl border border-slate-200 px-4 py-3 font-black outline-none focus:border-sky-400 focus:ring-4 focus:ring-sky-100" />
              <input type="time" value={form.time} onChange={(e) => setForm((current) => ({ ...current, time: e.target.value }))} className="rounded-2xl border border-slate-200 px-4 py-3 font-black outline-none focus:border-sky-400 focus:ring-4 focus:ring-sky-100" />
            </div>
            <button type="button" onClick={addTask} className="rounded-2xl bg-slate-950 px-5 py-3 text-sm font-black text-white hover:bg-slate-800">
              {txt({ en: "Add to list", ar: "أضف للقائمة" }, lang)}
            </button>
          </div>
        </Card>

        <Card>
          <div className="mb-4 flex items-center justify-between gap-3">
            <h3 className="text-2xl font-black">{txt({ en: "Current plans", ar: "المهام الحالية" }, lang)}</h3>
            <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-black text-sky-700">{tasks.length}</span>
          </div>
          {tasks.length === 0 ? (
            <div className="rounded-3xl bg-slate-50 p-6 text-sm font-bold leading-6 text-slate-500">
              {txt({ en: "No tasks yet. Add the first mission before the squad starts improvising.", ar: "لا توجد مهام حالياً. أضف أول مهمة قبل ما يبدأ القروب بالارتجال." }, lang)}
            </div>
          ) : (
            <div className="space-y-3">
              {tasks.map((task) => (
                <div key={task.id} className={`rounded-3xl border p-4 ${task.done ? "border-emerald-200 bg-emerald-50" : "border-slate-200 bg-white"}`}>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className={`font-black ${task.done ? "text-emerald-800 line-through" : "text-slate-950"}`}>{task.text}</div>
                      <div className="mt-2 text-sm font-bold text-slate-500">
                        {task.date || txt({ en: "No date", ar: "بدون تاريخ" }, lang)} {task.time ? `· ${task.time}` : ""}
                      </div>
                    </div>
                    <div className="flex shrink-0 gap-2">
                      <button type="button" onClick={() => toggleTask(task.id)} className="rounded-full bg-emerald-600 px-3 py-2 text-xs font-black text-white">
                        {task.done ? txt({ en: "Undo", ar: "تراجع" }, lang) : txt({ en: "Done", ar: "تم" }, lang)}
                      </button>
                      <button type="button" onClick={() => deleteTask(task.id)} className="rounded-full bg-rose-600 px-3 py-2 text-xs font-black text-white">
                        {txt({ en: "Delete", ar: "حذف" }, lang)}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </Section>
  );
}

export default function BaliTripWebsite() {
  const [lang, setLang] = useState(() => {
    if (typeof window === "undefined") return "en";
    return window.localStorage.getItem("bali-squad-lang") || "en";
  });

  const [activeDay, setActiveDay] = useState(itinerary[0]);
  const [budgetRows, setBudgetRows] = useState(() => {
    if (typeof window === "undefined") return initialBudgetItems;
    try {
      const saved = window.localStorage.getItem("bali-squad-budget");
      return saved ? JSON.parse(saved) : initialBudgetItems;
    } catch {
      return initialBudgetItems;
    }
  });

  const countdown = useCountdown();
  const weather = useWeather();
  const totals = useMemo(() => calculateTotals(budgetRows), [budgetRows]);
  const pax = 5;

  useEffect(() => {
    try {
      window.localStorage.setItem("bali-squad-lang", lang);
    } catch {
      // Ignore storage errors.
    }
  }, [lang]);

  useEffect(() => {
    try {
      window.localStorage.setItem("bali-squad-budget", JSON.stringify(budgetRows));
    } catch {
      // Ignore storage errors.
    }
  }, [budgetRows]);

  const updateBudgetRow = (id, key, value) => setBudgetRows((rows) => rows.map((row) => (row.id === id ? { ...row, [key]: value } : row)));
  const markPaid = (id) => setBudgetRows((rows) => markBudgetRowPaid(rows, id));
  const resetBudget = () => {
    setBudgetRows(initialBudgetItems);
    try {
      window.localStorage.removeItem("bali-squad-budget");
    } catch {
      // Ignore storage errors.
    }
  };

  const hypeLine = countdown.days < 3
    ? { en: "Less than 3 days. Onenfr gets married, Buraydah gets raided, the boys get kidnapped back to Riyadh, and then Bali gets the full squad.", ar: "باقي أقل من ٣ أيام. عنيفر يتزوج، بريدة تنمداهم، الشباب ينخطفون للرياض، وبعدها بالي تستقبل القروب كامل." }
    : { en: "Countdown is active. Keep the passport close and your bad decisions closer.", ar: "العد شغال. خل الجواز قريب والقرارات السيئة أقرب." };

  return (
    <div dir={lang === "ar" ? "rtl" : "ltr"} lang={lang} className="relative min-h-screen overflow-x-hidden bg-[radial-gradient(circle_at_top_left,_#dff7ff,_transparent_32%),linear-gradient(180deg,_#f8fafc,_#ecfeff_42%,_#fff7ed)] text-slate-900">
      <BackgroundVibes />
      <nav className="sticky top-0 z-50 border-b border-white/60 bg-white/75 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-6">
          <a href="#home" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-xl text-white">
              <I name="palm" />
            </div>
            <div>
              <div className="font-black">{txt(copy.brand, lang)}</div>
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{txt(copy.month, lang)}</div>
            </div>
          </a>

          <div className="hidden items-center gap-1 rounded-full border border-slate-200 bg-white/80 p-1 shadow-sm xl:flex">
            {navItems.map(([id, label]) => (
              <a key={id} href={`#${id}`} className="whitespace-nowrap rounded-full px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-950 hover:text-white">
                {txt(label, lang)}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button type="button" onClick={() => setLang((current) => (current === "en" ? "ar" : "en"))} className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-black text-slate-900 hover:bg-slate-100">
              {lang === "en" ? "العربية" : "English"}
            </button>
            <a href="#hype" className="rounded-full bg-slate-950 px-4 py-2 text-sm font-black text-white">
              {txt(copy.launch, lang)}
            </a>
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto border-t border-slate-100 px-4 py-2 xl:hidden">
          {navItems.map(([id, label]) => (
            <a key={id} href={`#${id}`} className="whitespace-nowrap rounded-full bg-white px-3 py-2 text-xs font-bold text-slate-700 shadow-sm">
              {txt(label, lang)}
            </a>
          ))}
        </div>
      </nav>

      <main className="relative z-10 mx-auto max-w-7xl px-4 md:px-6">
        <section id="home" className="grid min-h-[82vh] scroll-mt-24 items-center gap-8 py-12 lg:grid-cols-[1.1fr_0.9fr]">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-sky-200 bg-white/90 px-4 py-2 text-sm font-bold text-sky-800">
              <I name="sparkles" />
              {txt(copy.heroTag, lang)}
            </div>
            <h1 className="text-5xl font-black leading-[0.95] tracking-tight text-slate-950 md:text-7xl">{txt(copy.heroTitle, lang)}</h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-700">{txt(copy.heroText, lang)}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#hype" className="rounded-full bg-sky-600 px-6 py-3 text-sm font-black text-white">{txt(copy.startHype, lang)}</a>
              <a href="#budget" className="rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-black text-slate-900">{txt(copy.openBudget, lang)}</a>
            </div>
            <div className="mt-6 rounded-3xl border border-fuchsia-200 bg-gradient-to-r from-fuchsia-100 via-orange-100 to-amber-100 p-5 text-sm font-black leading-7 text-slate-900 shadow-lg">
              <I name="fire" /> {txt(hypeLine, lang)}
            </div>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Stat statIcon="plane" label={{ en: "Departure", ar: "المغادرة" }} value={{ en: "10 May", ar: "١٠ مايو" }} sub={{ en: "22:00 from Riyadh T5", ar: "٢٢:٠٠ من الرياض صالة ٥" }} lang={lang} />
              <Stat statIcon="home" label={copy.villa} value={{ en: "Villa Gima 1", ar: "فيلا قيما 1" }} sub={{ en: "Check-in 5 PM · lovely host", ar: "دخول ٥ مساءً · مضيفة لطيفة" }} lang={lang} />
              <Stat statIcon="users" label={{ en: "Members", ar: "الأعضاء" }} value={{ en: "5 Pax", ar: "٥ أشخاص" }} sub={{ en: "Booking closed 🚫", ar: "الحجز مقفل 🚫" }} lang={lang} />
              <Stat statIcon="wallet" label={{ en: "Known Budget", ar: "الميزانية المعروفة" }} value={currency(totals.confirmed, lang)} sub={{ en: "editable below", ar: "قابلة للتعديل بالأسفل" }} lang={lang} />
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="relative">
            <div className="absolute -inset-4 rounded-[2.5rem] bg-fuchsia-200/50 blur-3xl" />
            <div className="relative overflow-hidden rounded-[2.5rem] border border-white bg-white shadow-2xl">
              <img src={villaImages[0][0]} alt="Villa pool" className="h-[520px] w-full object-cover" />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent p-7 text-white">
                <div className="mb-2 text-sm font-bold uppercase tracking-[0.2em] text-sky-200">{txt(copy.baseCamp, lang)}</div>
                <div className="text-3xl font-black">{txt({ en: "Villa Gima 1", ar: "فيلا قيما 1" }, lang)}</div>
                <div className="mt-2 text-sm text-slate-200">{txt(copy.villaCaption, lang)}</div>
              </div>
            </div>
          </motion.div>
        </section>

        <VibeRibbon lang={lang} />

        <Section id="hype" eyebrow={copy.hypeEyebrow} title={copy.hypeTitle} sectionIcon="fire" lang={lang}>
          <Card className="border-fuchsia-200 bg-gradient-to-br from-fuchsia-100 via-orange-50 to-amber-100 p-6 text-black shadow-[0_0_50px_rgba(244,114,182,0.2)] sm:p-8 lg:p-10">
            <div className="mb-3 inline-flex rounded-full bg-white/80 px-4 py-2 text-sm font-black text-fuchsia-700 shadow-sm">{txt(copy.countdownChip, lang)}</div>
            <h3 className="text-4xl font-black text-slate-950 lg:text-6xl">{countdown.landed ? txt(copy.baliLive, lang) : txt(copy.wheelsUp, lang)}</h3>
            <p className="mt-4 max-w-4xl text-lg leading-8 text-slate-900">{txt(copy.countdownSub, lang)}</p>
            <div className="mt-4 rounded-3xl border border-white/70 bg-white/70 p-4 text-sm font-black leading-7 text-slate-900">
              <I name="car" /> {txt(hypeLine, lang)}
            </div>
            <CountdownDisplay countdown={countdown} lang={lang} />

            <div className="mt-8 rounded-[2rem] border border-white/70 bg-white/80 p-5 text-black sm:p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-sm font-black uppercase tracking-[0.2em] text-black">{txt(copy.weatherTitle, lang)}</div>
                  <h3 className="mt-1 text-3xl font-black text-black">{txt(copy.weatherSub, lang)}</h3>
                </div>
                <div className="text-4xl"><I name="weather" /></div>
              </div>
              {weather.error ? <div className="mt-4 rounded-2xl bg-white p-3 text-sm font-bold text-black">{txt(copy.weatherFallback, lang)}</div> : null}
              {weather.loading ? (
                <div className="mt-4 rounded-3xl bg-white p-6 text-sm font-bold text-black">{txt(copy.loadingWeather, lang)}</div>
              ) : (
                <div className="mt-5 flex gap-4 overflow-x-auto pb-2">{weather.days.map((day) => <WeatherCard key={typeof day.date === "string" ? day.date : day.date.en} day={day} lang={lang} />)}</div>
              )}
            </div>

            <div className="mt-5 rounded-3xl border border-white/70 bg-white/75 p-4 text-sm leading-6 text-black">
              <b className="text-black">{txt(copy.codeTitle, lang)}</b> {txt(copy.codeText, lang)}
            </div>
          </Card>
        </Section>

        <Section id="trip" eyebrow={copy.flights} title={copy.tripDetails} sectionIcon="plane" lang={lang}>
          <Card className="mb-6 border-sky-200 bg-white/90">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-white"><I name="road" /></div>
              <div>
                <div className="text-sm font-black uppercase tracking-[0.18em] text-slate-500">{txt({ en: "Whole journey", ar: "الرحلة كاملة" }, lang)}</div>
                <h3 className="text-2xl font-black">{txt({ en: "Buraydah → Riyadh → Doha → Bali → Doha → Riyadh", ar: "بريدة ← الرياض ← الدوحة ← بالي ← الدوحة ← الرياض" }, lang)}</h3>
              </div>
            </div>
            <div className="grid gap-4 lg:grid-cols-5">
              {tripLegs.map((leg) => (
                <div key={leg.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                  <div className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">{typeof leg.number === "string" ? leg.number : txt(leg.number, lang)}</div>
                  <div className="mt-2 text-lg font-black">{txt(leg.from, lang)} → {txt(leg.to, lang)}</div>
                  <div className="mt-2 text-sm font-bold text-slate-500">{formatDateTime(leg.depart, lang)}</div>
                  <div className="text-sm font-semibold text-slate-500">{txt(leg.operator, lang)}</div>
                </div>
              ))}
            </div>
          </Card>

          <div className="grid gap-5 lg:grid-cols-3">
            {tripLegs.map((leg) => (
              <Card key={leg.id}>
                <div className="mb-4 flex items-center justify-between">
                  <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-black uppercase tracking-[0.16em] text-sky-700">{typeof leg.number === "string" ? leg.number : txt(leg.number, lang)}</span>
                  <I name={leg.kind === "road" ? "road" : "plane"} />
                </div>
                <h3 className="text-xl font-black">{txt(leg.from, lang)} → {txt(leg.to, lang)}</h3>
                <div className="mt-5 space-y-3 text-sm">
                  <Row label={{ en: "Operator", ar: "المشغل" }} value={leg.operator} lang={lang} />
                  <Row label={{ en: "Departure", ar: "المغادرة" }} value={formatDateTime(leg.depart, lang)} lang={lang} />
                  <Row label={{ en: "Arrival", ar: "الوصول" }} value={formatDateTime(leg.arrive, lang)} lang={lang} />
                  <Row label={{ en: "Terminal", ar: "الصالة" }} value={leg.terminalFrom} lang={lang} />
                  <Row label={{ en: "Duration", ar: "المدة" }} value={leg.duration} lang={lang} />
                  <Row label={{ en: "Baggage / Status", ar: "العفش / الحالة" }} value={leg.baggage} lang={lang} />
                  <p className="pt-2 leading-6 text-slate-500">{txt(leg.note, lang)}</p>
                </div>
              </Card>
            ))}
          </div>

          <Card className="mt-6">
            <div className="mb-5 flex items-center gap-2">
              <I name="bed" />
              <h3 className="text-xl font-black">{txt({ en: "Seat Assignment", ar: "توزيع المقاعد" }, lang)}</h3>
            </div>
            <div className="grid gap-3 md:grid-cols-5">
              {[
                [{ en: "Saud", ar: "سعود" }, { en: "Wherever the budget allows", ar: "حسب ما تسمح الميزانية" }, { en: "Budget boss seat", ar: "كرسي مسؤول الميزانية" }],
                [{ en: "Abdullah", ar: "عبدالله" }, { en: "Pilot assistant by confidence", ar: "مساعد الطيار بالثقة فقط" }, { en: "Leader seat", ar: "كرسي القائد" }],
                [{ en: "Naif", ar: "نايف" }, { en: "Next to opportunity", ar: "جنب الفرصة" }, { en: "Party energy seat", ar: "كرسي طاقة الحفلة" }],
                [{ en: "Sohel", ar: "سهيل" }, { en: "Emergency activity desk", ar: "مكتب طوارئ الفعاليات" }, { en: "Activities control seat", ar: "كرسي التحكم بالفعاليات" }],
                [{ en: "Abdulrhman", ar: "عبدالرحمن" }, { en: "Window seat or no photos", ar: "شباك أو بدون صور" }, { en: "Camera access seat", ar: "كرسي وصول الكاميرا" }],
              ].map(([member, seat, note]) => (
                <div key={member.en} className="rounded-2xl bg-slate-50 p-4">
                  <div className="text-sm font-semibold text-slate-500">{txt(member, lang)}</div>
                  <div className="mt-1 text-xl font-black">{txt(seat, lang)}</div>
                  <div className="text-xs text-slate-500">{txt(note, lang)}</div>
                </div>
              ))}
            </div>
          </Card>
        </Section>

        <FlightStatusSection lang={lang} />

        <Section id="accommodation" eyebrow={copy.villa} title={copy.accommodation} sectionIcon="home" lang={lang}>
          <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
            <Card>
              <div className="mb-4 inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-black uppercase tracking-[0.16em] text-emerald-700">{txt({ en: "Confirmed Airbnb Villa", ar: "فيلا Airbnb مؤكدة" }, lang)}</div>
              <h3 className="text-3xl font-black">{txt({ en: "Villa Gima 1 - 5 bedrooms", ar: "فيلا قيما 1 - خمس غرف" }, lang)}</h3>
              <p className="mt-4 leading-7 text-slate-600">{txt({ en: "Entire villa in Umalas with pool, garden, kitchen, wifi, workspace, parking, and a lovely host welcoming the squad at check-in.", ar: "فيلا كاملة في أومالاس مع مسبح، حديقة، مطبخ، واي فاي، مساحة عمل، مواقف، ومضيفة لطيفة تستقبل القروب وقت الدخول." }, lang)}</p>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <Info label={{ en: "Check-in", ar: "تسجيل الدخول" }} value={{ en: "5:00 PM", ar: "٥:٠٠ مساءً" }} lang={lang} />
                <Info label={{ en: "Check-out", ar: "تسجيل الخروج" }} value={{ en: "Before airport mission", ar: "قبل مهمة المطار" }} lang={lang} />
                <Info label={{ en: "Stay period", ar: "مدة الإقامة" }} value={{ en: "11–21 May 2026", ar: "١١–٢١ مايو ٢٠٢٦" }} lang={lang} />
                <Info label={{ en: "Capacity", ar: "السعة" }} value={{ en: "Officially 10. Unofficially depends who comes back with the squad.", ar: "رسمياً ١٠. غير رسمياً يعتمد مين يرجع مع القروب." }} lang={lang} />
              </div>
              <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm leading-6 text-emerald-900">
                <b><I name="heart" /> {txt({ en: "Host update:", ar: "تحديث المضيفة:" }, lang)}</b>{" "}
                {txt({ en: "Accommodation is confirmed and the host is lovely. Just arrive with passports, manners, and the squad's remaining dignity.", ar: "السكن مؤكد والمضيفة لطيفة. فقط وصلوا بالجوازات، الذوق، وبقايا كرامة القروب." }, lang)}
              </div>
            </Card>
            <div className="grid gap-4 sm:grid-cols-2">
              {villaImages.map(([src, title]) => (
                <Card key={title.en} className="overflow-hidden p-0">
                  <img src={src} alt={title.en} className="h-56 w-full object-cover" />
                  <div className="p-4 text-sm font-black">{txt(title, lang)}</div>
                </Card>
              ))}
            </div>
          </div>
        </Section>

        <Section id="itinerary" eyebrow={copy.schedule} title={copy.itineraryTitle} sectionIcon="calendar" lang={lang}>
          <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
            <Card>
              <div className="grid gap-2">
                {itinerary.map((day) => (
                  <button
                    key={day.date.en}
                    onClick={() => setActiveDay(day)}
                    className={`rounded-2xl p-4 text-start transition ${activeDay.date.en === day.date.en ? "bg-slate-950 text-white" : "bg-slate-50 text-slate-700 hover:bg-sky-50"}`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <div className="text-xs font-black uppercase tracking-[0.16em] opacity-70">{txt(day.day, lang)}</div>
                        <div className="mt-1 text-lg font-black">{txt(day.date, lang)}</div>
                      </div>
                      <div className="text-end text-sm font-bold opacity-80">{txt(day.title, lang)}</div>
                    </div>
                  </button>
                ))}
              </div>
            </Card>

            <Card>
              <div className="mb-2 text-sm font-black uppercase tracking-[0.2em] text-sky-700">
                {txt(activeDay.day, lang)} · {txt(activeDay.date, lang)}
              </div>
              <h3 className="text-4xl font-black">{txt(activeDay.title, lang)}</h3>
              <p className="mt-3 leading-7 text-slate-600">{txt(activeDay.notes, lang)}</p>
              <div className="mt-4 rounded-2xl border border-sky-200 bg-sky-50 p-4 text-sm font-black leading-6 text-sky-900">
                <I name="weather" /> {txt({ en: "Expected weather:", ar: "الطقس المتوقع:" }, lang)} {txt(activeDay.weather, lang)}
              </div>
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <Detail detailIcon="chef" label={{ en: "Breakfast", ar: "الفطور" }} value={activeDay.breakfast} lang={lang} />
                <Detail detailIcon="food" label={{ en: "Lunch", ar: "الغداء" }} value={activeDay.lunch} lang={lang} />
                <Detail detailIcon="food" label={{ en: "Dinner", ar: "العشاء" }} value={activeDay.dinner} lang={lang} />
                <Detail detailIcon="music" label={{ en: "Entertainment", ar: "الترفيه" }} value={activeDay.entertainment} lang={lang} />
              </div>
              <div className="mt-4 grid gap-4 sm:grid-cols-3">
                <Detail detailIcon="party" label={{ en: "Night Mode", ar: "الوضع الليلي" }} value={activeDay.nightlife} lang={lang} />
                <Detail detailIcon="check" label={{ en: "Operations", ar: "العمليات" }} value={activeDay.ops} lang={lang} />
                <Detail detailIcon="car" label={{ en: "Transport", ar: "المواصلات" }} value={activeDay.transport} lang={lang} />
              </div>
            </Card>
          </div>
        </Section>

        <TodoSection lang={lang} />

        <Section id="things" eyebrow={copy.recommendations} title={copy.things} sectionIcon="map" lang={lang}>
          <Card className="mb-6 bg-emerald-50">
            <div className="mb-3 font-black text-emerald-900">
              <I name="shield" /> {txt({ en: "Trip Rules", ar: "قوانين الرحلة" }, lang)}
            </div>
            <div className="flex flex-wrap gap-2">
              {rules.map((rule) => (
                <span key={rule.en} className="rounded-full border border-emerald-200 bg-white px-3 py-2 text-sm font-bold text-emerald-800">
                  {txt(rule, lang)}
                </span>
              ))}
            </div>
          </Card>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {activities.map((activity) => (
              <ActivityCard key={activity.title.en} activity={activity} lang={lang} />
            ))}
          </div>

          <Card className="mt-8">
            <div className="mb-5 flex items-center gap-2">
              <I name="food" />
              <h3 className="text-2xl font-black">{txt({ en: "Restaurant & Coffee Shortlist", ar: "قائمة المطاعم والكوفيهات" }, lang)}</h3>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {restaurants.map(([name, type, why, badge, link]) => (
                <a key={name.en} href={link} target="_blank" rel="noreferrer" className="block rounded-2xl bg-slate-50 p-5 transition hover:-translate-y-1 hover:bg-sky-50">
                  <div className="mb-3 inline-flex rounded-full bg-white px-3 py-1 text-xs font-black text-sky-700">{txt(badge, lang)}</div>
                  <h4 className="text-lg font-black text-slate-950 underline decoration-slate-300 underline-offset-4">{txt(name, lang)}</h4>
                  <div className="mt-1 text-sm font-bold text-slate-500">{txt(type, lang)}</div>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{txt(why, lang)}</p>
                  <div className="mt-4 text-xs font-black uppercase tracking-[0.16em] text-sky-700">{txt({ en: "Open location", ar: "افتح الموقع" }, lang)}</div>
                </a>
              ))}
            </div>
          </Card>
        </Section>

        <Section id="members" eyebrow={{ en: "Squad Locked", ar: "القروب مقفل" }} title={copy.members} sectionIcon="block" lang={lang}>
          <Card className="mb-6 border-rose-200 bg-rose-50">
            <div className="text-sm font-black uppercase tracking-[0.18em] text-rose-700">{txt({ en: "Booking closed", ar: "الحجز مقفل" }, lang)}</div>
            <div className="mt-2 text-2xl font-black text-rose-950">{txt({ en: "Too late to book with us 🚫", ar: "فاتك الحجز معنا 🚫" }, lang)}</div>
            <p className="mt-2 text-sm font-bold leading-6 text-rose-800">{txt({ en: "The villa is full, the flight seats are sealed, and the group already has enough bad influence. Applications are rejected with love.", ar: "الفيلا مليانة، ومقاعد الرحلات مقفلة، والقروب عنده تأثير سيئ كفاية. الطلبات مرفوضة بكل حب." }, lang)}</p>
          </Card>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {members.map((member) => (
              <MemberCard key={member.name.en} member={member} lang={lang} />
            ))}
          </div>
        </Section>

        <Section id="budget" eyebrow={copy.money} title={copy.budget} sectionIcon="wallet" lang={lang}>
          <div className="grid gap-5 lg:grid-cols-4">
            <Stat statIcon="wallet" label={{ en: "Known confirmed budget", ar: "الميزانية المؤكدة" }} value={currency(totals.confirmed, lang)} sub={{ en: "excludes optional/TBD rows", ar: "بدون البنود الاختيارية/غير المحددة" }} lang={lang} />
            <Stat statIcon="check" label={{ en: "Paid so far", ar: "المدفوع حتى الآن" }} value={currency(totals.paid, lang)} sub={{ en: "updates from table", ar: "يتحدث من الجدول" }} lang={lang} />
            <Stat statIcon="alert" label={{ en: "Remaining known", ar: "المتبقي المعروف" }} value={currency(totals.remaining, lang)} sub={{ en: "confirmed minus paid", ar: "المؤكد ناقص المدفوع" }} lang={lang} />
            <Stat statIcon="formula" label={{ en: "Known cost / person", ar: "التكلفة للشخص" }} value={currency(totals.confirmed / pax, lang)} sub={{ en: "based on 5 pax", ar: "على أساس ٥ أشخاص" }} lang={lang} />
          </div>

          <Card className="mt-6">
            <div className="mb-4 flex flex-col justify-between gap-3 md:flex-row md:items-center">
              <div>
                <h3 className="text-2xl font-black">{txt({ en: "Live trip calculator", ar: "حاسبة الرحلة المباشرة" }, lang)}</h3>
                <p className="text-sm font-semibold text-slate-500">{txt({ en: "Change total or paid amounts. It updates automatically and saves in this browser.", ar: "غيّر الإجمالي أو المدفوع، والحسبة تتحدث تلقائياً وتنحفظ في هذا المتصفح." }, lang)}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <div className="rounded-2xl bg-slate-950 px-4 py-3 text-sm font-black text-white">{txt({ en: "Balance = Total - Paid", ar: "المتبقي = الإجمالي - المدفوع" }, lang)}</div>
                <button onClick={resetBudget} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-black text-slate-700">
                  {txt({ en: "Reset sheet", ar: "إعادة ضبط" }, lang)}
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <div className="min-w-[900px] overflow-hidden rounded-2xl border border-slate-200">
                <div className="grid grid-cols-[1.4fr_1fr_1fr_1fr_1fr_1.05fr] bg-slate-950 px-4 py-3 text-sm font-black text-white">
                  <div>{txt({ en: "Item", ar: "البند" }, lang)}</div>
                  <div>{txt({ en: "Total", ar: "الإجمالي" }, lang)}</div>
                  <div>{txt({ en: "Paid", ar: "المدفوع" }, lang)}</div>
                  <div>{txt({ en: "Balance", ar: "المتبقي" }, lang)}</div>
                  <div>{txt({ en: "Per Person", ar: "لكل شخص" }, lang)}</div>
                  <div>{txt({ en: "Action", ar: "الإجراء" }, lang)}</div>
                </div>
                {budgetRows.map((row, index) => (
                  <BudgetRow key={row.id} row={row} index={index} pax={pax} onChange={updateBudgetRow} onPaid={markPaid} lang={lang} />
                ))}
              </div>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-3">
              <Info label={{ en: "Grand total incl. optional", ar: "الإجمالي مع الاختياري" }} value={currency(totals.grandTotal, lang)} lang={lang} />
              <Info label={{ en: "Remaining / person", ar: "المتبقي للشخص" }} value={currency(totals.remaining / pax, lang)} lang={lang} />
              <Info label={{ en: "Suspicious Coconut Water", ar: "موية جوز الهند المشبوهة" }} value={{ en: "TBD because nobody tells the truth before the trip.", ar: "غير محدد لأن محد يقول الحقيقة قبل الرحلة." }} lang={lang} />
            </div>
          </Card>
        </Section>
      </main>

      <footer className="relative z-10 mt-10 border-t border-slate-200 bg-white/80 py-10 text-center text-sm font-semibold text-slate-500">
        {txt(copy.footer, lang)}
      </footer>
    </div>
  );
}
