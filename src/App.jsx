import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";

const FLIGHT_TARGET = "2026-05-10T22:00:00+03:00";
const WEATHER_URL =
  "https://api.open-meteo.com/v1/forecast?latitude=-8.65&longitude=115.22&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=Asia%2FMakassar&forecast_days=7";

const icon = {
  plane: "✈️", home: "🏡", fire: "🔥", calendar: "📅", map: "📍", users: "👥", wallet: "💳",
  waves: "🌊", dive: "🤿", air: "🪂", car: "🚙", party: "🎉", bike: "🛵", check: "✅",
  palm: "🌴", sparkles: "✨", bed: "🛏️", alert: "⚠️", chef: "👨‍🍳", food: "🍽️",
  music: "🎵", trophy: "🏆", weather: "🌤️", formula: "🧮", shield: "🛡️",
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
  heroTag: { en: "5 members · 10 nights · Umalas, Bali · Code 02 enabled", ar: "٥ أعضاء · ١٠ ليالي · أومالاس، بالي · كود 02 مفعل" },
  heroTitle: { en: "Bali Squad Trip Control Center", ar: "مركز تحكم رحلة بالي" },
  heroText: { en: "Flights, villa takeover, weather checks, daily chaos planning, transport, activities, member challenges, and budget damage control.", ar: "الرحلات، السكن، الطقس، الجدول اليومي، التنقلات، الفعاليات، تحديات الأعضاء، والسيطرة على الميزانية." },
  startHype: { en: "Start the Hype", ar: "ابدأ الحماس" },
  openBudget: { en: "Open Budget Sheet", ar: "افتح الميزانية" },
  baseCamp: { en: "Base Camp", ar: "المقر الرئيسي" },
  villaCaption: { en: "Umalas · May 11–21 · pool, garden, privacy, and questionable squad decisions", ar: "أومالاس · ١١–٢١ مايو · مسبح، حديقة، خصوصية، وقرارات قروب مشكوك فيها" },
  hypeEyebrow: { en: "Countdown + Weather", ar: "العد التنازلي والطقس" },
  hypeTitle: { en: "Squad Hype Dashboard", ar: "لوحة حماس القروب" },
  countdownChip: { en: "Flight countdown to chaos", ar: "العد التنازلي لبداية الفوضى" },
  wheelsUp: { en: "Wheels up soon", ar: "قريباً الإقلاع" },
  baliLive: { en: "Bali Mode Activated", ar: "تم تفعيل وضع بالي" },
  countdownSub: { en: "Riyadh departure: 10 May 2026 at 22:00. Pack properly or panic-buy sunglasses.", ar: "المغادرة من الرياض: ١٠ مايو ٢٠٢٦ الساعة ٢٢:٠٠. جهز شنطتك أو اشتر نظارات شمسية آخر لحظة." },
  timeLeft: { en: "Time left until takeoff", ar: "الوقت المتبقي للإقلاع" },
  launchTime: { en: "Flight launch: 10 May 2026 · 22:00 Riyadh time", ar: "الإقلاع: ١٠ مايو ٢٠٢٦ · ٢٢:٠٠ بتوقيت الرياض" },
  weatherTitle: { en: "Live Bali Weather", ar: "طقس بالي المباشر" },
  weatherSub: { en: "Daily auto-update", ar: "تحديث يومي تلقائي" },
  loadingWeather: { en: "Loading Bali weather...", ar: "جاري تحميل طقس بالي..." },
  weatherFallback: { en: "Live weather is taking a nap. Showing Bali-mode fallback.", ar: "الطقس المباشر نايم شوي. عرضنا وضع بالي الاحتياطي." },
  codeTitle: { en: "Code 02 Dictionary:", ar: "قاموس كود 02:" },
  codeText: { en: "adult-only after-dark villa mode: music, dancing, suspicious coconut water, late-night confidence, and next-day recovery operations.", ar: "وضع ليلي للكبار في الفيلا: موسيقى، رقص، موية جوز هند مشبوهة، ثقة آخر الليل، وعمليات تعافي اليوم الثاني." },
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
  footer: { en: "Bali Squad Trip Website · Weather updates live · Budget is editable · Code 02 remains classified.", ar: "موقع رحلة قروب بالي · الطقس يتحدث مباشرة · الميزانية قابلة للتعديل · كود 02 يبقى سرياً." },
};


const backgroundImages = [
  "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=900&q=80",
];

const members = [
  {
    name: { en: "Saud", ar: "سعود" }, emoji: "🐼",
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
    name: { en: "Abdullah", ar: "عبدالله" }, emoji: "👑",
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
    name: { en: "Naif", ar: "نايف" }, emoji: "🔥",
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
    name: { en: "Sohel", ar: "سهيل" }, emoji: "🛵",
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
    name: { en: "Abdulrhman", ar: "عبدالرحمن" }, emoji: "🎥",
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
    name: { en: "Open Role", ar: "دور مفتوح" }, emoji: "🍽️",
    role: { en: "Restaurants, coffee shops & emergency hunger management", ar: "المطاعم، الكوفيهات، وإدارة الجوع الطارئ" },
    vibe: { en: "Food critic uniform", ar: "زي ناقد الطعام" },
    color: "bg-orange-100 text-orange-800 border-orange-200",
    challenges: [
      { en: "Pick one dinner spot nobody complains about.", ar: "اختر مطعم عشاء محد يشتكي منه." },
      { en: "Find coffee close enough that nobody says too far.", ar: "لق لنا كوفي قريب لدرجة محد يقول بعيد." },
      { en: "Confirm no pork/ham before ordering like a responsible adult.", ar: "تأكد بدون خنزير/هام قبل الطلب كشخص مسؤول." },
      { en: "Book at least one seafood dinner before last-day panic.", ar: "احجز عشاء بحري واحد على الأقل قبل هلع آخر يوم." },
    ],
  },
];

const flights = [
  {
    type: { en: "Departure", ar: "المغادرة" },
    route: { en: "Riyadh (RUH) → Bali / Denpasar (DPS)", ar: "الرياض (RUH) → بالي / دينباسار (DPS)" },
    date: { en: "10 May 2026", ar: "١٠ مايو ٢٠٢٦" },
    time: "22:00",
    number: { en: "Captain will tell us eventually", ar: "الكابتن بيعلمنا في وقتها" },
    note: { en: "Abdullah is the official source of truth for flight numbers.", ar: "عبدالله هو المصدر الرسمي لأرقام الرحلات." },
  },
  {
    type: { en: "Arrival", ar: "الوصول" },
    route: { en: "Bali / Denpasar (DPS)", ar: "بالي / دينباسار (DPS)" },
    date: { en: "11 May 2026", ar: "١١ مايو ٢٠٢٦" },
    time: "17:00",
    number: { en: "Follow the tired faces", ar: "اتبع الوجوه التعبانة" },
    note: { en: "Mission: survive immigration and find the villa before the squad turns into luggage.", ar: "المهمة: نعدي الجوازات ونلقى الفيلا قبل ما يتحول القروب إلى شنط." },
  },
  {
    type: { en: "Return", ar: "العودة" },
    route: { en: "Bali / Denpasar (DPS) → Riyadh (RUH)", ar: "بالي / دينباسار (DPS) → الرياض (RUH)" },
    date: { en: "21 May 2026", ar: "٢١ مايو ٢٠٢٦" },
    time: { en: "Maybe if we decide to come back", ar: "يمكن، إذا قررنا نرجع" },
    number: { en: "Return plan under investigation", ar: "خطة العودة تحت التحقيق" },
    note: { en: "Small chance we forget to return and accidentally become Bali locals.", ar: "في احتمال بسيط ننسى نرجع ونصير من سكان بالي بالغلط." },
  },
];

const seats = [
  [{ en: "Saud", ar: "سعود" }, { en: "Wherever the budget allows", ar: "حسب ما تسمح الميزانية" }, { en: "Budget boss seat", ar: "كرسي مسؤول الميزانية" }],
  [{ en: "Abdullah", ar: "عبدالله" }, { en: "Pilot assistant by confidence", ar: "مساعد الطيار بالثقة فقط" }, { en: "Leader seat", ar: "كرسي القائد" }],
  [{ en: "Naif", ar: "نايف" }, { en: "Next to opportunity", ar: "جنب الفرصة" }, { en: "Party energy seat", ar: "كرسي طاقة الحفلة" }],
  [{ en: "Sohel", ar: "سهيل" }, { en: "Emergency activity desk", ar: "مكتب طوارئ الفعاليات" }, { en: "Activities control seat", ar: "كرسي التحكم بالفعاليات" }],
  [{ en: "Abdulrhman", ar: "عبدالرحمن" }, { en: "Window seat or no photos", ar: "شباك أو بدون صور" }, { en: "Camera access seat", ar: "كرسي وصول الكاميرا" }],
];

const villaImages = [
  ["https://a0.muscache.com/im/pictures/miso/Hosting-594590040832411269/original/aee350cb-7e48-45bc-bfc2-d7e110fcb7d4.jpeg?im_w=1200", { en: "Infinity pool & garden", ar: "المسبح والحديقة" }],
  ["https://a0.muscache.com/im/pictures/887413dd-8e42-4a51-abaf-99c852c61f94.jpg?im_w=1200", { en: "Living & dining area", ar: "منطقة المعيشة والطعام" }],
  ["https://a0.muscache.com/im/pictures/miso/Hosting-594590040832411269/original/6397d293-8f39-4db6-8af2-94d1d0b4b170.jpeg?im_w=1200", { en: "Villa upper floor view", ar: "إطلالة الدور العلوي" }],
  ["https://a0.muscache.com/im/pictures/miso/Hosting-594590040832411269/original/af03dc6a-7b31-420a-8f04-c5bf643cd0bc.jpeg?im_w=1200", { en: "Outdoor shower vibe", ar: "أجواء الشاور الخارجي" }],
];

const itinerary = [
  { date: { en: "11 May", ar: "١١ مايو" }, day: { en: "Monday", ar: "الاثنين" }, title: { en: "Touchdown + Villa Takeover", ar: "الوصول + احتلال الفيلا" }, notes: { en: "Arrival 5 PM. Find bags, find driver, find villa, pretend we are organized.", ar: "الوصول ٥ مساءً. نلقى الشنط، السائق، الفيلا، ونتظاهر أننا منظمين." }, breakfast: { en: "Plane breakfast — survival mode", ar: "فطور الطيارة — وضع النجاة" }, lunch: { en: "Airport or delivery", ar: "المطار أو توصيل" }, dinner: { en: "Abunawas or villa delivery", ar: "أبو نواس أو توصيل للفيلا" }, entertainment: { en: "Shopping + grocery raid", ar: "تسوق + غزوة مقاضي" }, nightlife: { en: "Soft launch only", ar: "افتتاح ناعم فقط" }, ops: { en: "Saud enters Carrefour like a CFO with trauma", ar: "سعود يدخل كارفور كمدير مالي مصدوم" }, transport: { en: "Private driver from airport. No walking.", ar: "سائق خاص من المطار. بدون مشي." } },
  { date: { en: "12 May", ar: "١٢ مايو" }, day: { en: "Tuesday", ar: "الثلاثاء" }, title: { en: "Villa Chill + Pool Committee", ar: "استرخاء الفيلا + لجنة المسبح" }, notes: { en: "First proper day. No hero moves before breakfast.", ar: "أول يوم فعلي. بدون بطولات قبل الفطور." }, breakfast: { en: "Villa breakfast", ar: "فطور الفيلا" }, lunch: { en: "Nook Bali or Bali Timbungan", ar: "Nook Bali أو Bali Timbungan" }, dinner: { en: "Seasalt at Alila Seminyak", ar: "Seasalt في Alila Seminyak" }, entertainment: { en: "Pool, shopping, sunset drive", ar: "مسبح، تسوق، مشوار غروب" }, nightlife: { en: "Code 02 rehearsal", ar: "بروفة كود 02" }, ops: { en: "Confirm activities before Sohel sends 14 voice notes", ar: "أكد الفعاليات قبل سهيل يرسل ١٤ فويس" }, transport: { en: "Hire driver. Scooter only for short coffee runs.", ar: "استأجر سائق. السكوتر فقط لمشاوير كوفي قصيرة." } },
  { date: { en: "13 May", ar: "١٣ مايو" }, day: { en: "Wednesday", ar: "الأربعاء" }, title: { en: "Shopping Day + Food Hunt", ar: "يوم التسوق + صيد الأكل" }, notes: { en: "No breakfast planned because apparently we enjoy suffering.", ar: "ما فيه فطور مخطط لأن واضح أننا نستمتع بالمعاناة." }, breakfast: { en: "Coffee counts", ar: "القهوة تنحسب" }, lunch: { en: "Bali Timbungan", ar: "Bali Timbungan" }, dinner: { en: "Kenji Ramen", ar: "Kenji Ramen" }, entertainment: { en: "Shopping + cafés", ar: "تسوق + كافيهات" }, nightlife: { en: "Free night, dangerous sentence", ar: "ليلة مفتوحة، جملة خطيرة" }, ops: { en: "Restaurant owner must act like a restaurant owner", ar: "مسؤول المطاعم لازم يتصرف كمسؤول مطاعم" }, transport: { en: "Driver for shopping bags.", ar: "سائق لشنط التسوق." } },
  { date: { en: "14 May", ar: "١٤ مايو" }, day: { en: "Thursday", ar: "الخميس" }, title: { en: "ATV / Adventure + Code 02", ar: "دبابات / مغامرة + كود 02" }, notes: { en: "Starts sporty and ends with questionable accounting.", ar: "يبدأ رياضي وينتهي بحسابات مشكوك فيها." }, breakfast: { en: "Villa breakfast", ar: "فطور الفيلا" }, lunch: { en: "Near ATV area", ar: "قريب من منطقة الدبابات" }, dinner: { en: "Seafood or villa BBQ", ar: "بحري أو شواء الفيلا" }, entertainment: { en: "Kuber ATV or rafting", ar: "دبابات Kuber أو رافتنق" }, nightlife: { en: "Code 02 activated", ar: "تم تفعيل كود 02" }, ops: { en: "Sohel shares pickup time", ar: "سهيل يشارك وقت البيك أب" }, transport: { en: "Activity pickup or private driver.", ar: "بيك أب الفعالية أو سائق خاص." } },
  { date: { en: "15 May", ar: "١٥ مايو" }, day: { en: "Friday", ar: "الجمعة" }, title: { en: "Friday Prayer + Seafood + Water", ar: "صلاة الجمعة + بحري + موية" }, notes: { en: "والله بنصلي الجمعة — then seafood, then water activities.", ar: "والله بنصلي الجمعة — بعدها بحري وفعاليات مائية." }, breakfast: { en: "Light coffee", ar: "قهوة خفيفة" }, lunch: { en: "Kendi Kuning or Seasalt", ar: "Kendi Kuning أو Seasalt" }, dinner: { en: "Villa dinner or Abunawas", ar: "عشاء الفيلا أو أبو نواس" }, entertainment: { en: "Jet ski, parasailing, banana boat, diving", ar: "جت سكي، براسيليُنق، بنانا بوت، غوص" }, nightlife: { en: "Recovery unless Code 02 attacks", ar: "تعافي إلا إذا هجم كود 02" }, ops: { en: "Bring towels or become towel intern", ar: "جيب مناشف أو تصير متدرب مناشف" }, transport: { en: "Private driver to water sports.", ar: "سائق خاص للرياضات البحرية." } },
  { date: { en: "16 May", ar: "١٦ مايو" }, day: { en: "Saturday", ar: "السبت" }, title: { en: "Code 02 — Full Send", ar: "كود 02 — انطلاق كامل" }, notes: { en: "Villa chaos, dancing, adult drinks, questionable decisions, and tomorrow's headache invoice.", ar: "فوضى الفيلا، رقص، مشروبات للكبار، قرارات مشكوك فيها، وفاتورة صداع بكرة." }, breakfast: { en: "Cute idea", ar: "فكرة لطيفة" }, lunch: { en: "Delivery to villa", ar: "توصيل للفيلا" }, dinner: { en: "Naif BBQ or Arabic food", ar: "شواء نايف أو أكل عربي" }, entertainment: { en: "Pool, music, villa games", ar: "مسبح، موسيقى، ألعاب فيلا" }, nightlife: { en: "Coconut Storm", ar: "عاصفة جوز الهند" }, ops: { en: "Hide fragile items and protect the speaker", ar: "خبوا الأشياء القابلة للكسر واحموا السماعة" }, transport: { en: "Stay home. Driver only for supply runs.", ar: "نبقى بالفيلا. السائق فقط للمستلزمات." } },
  { date: { en: "17 May", ar: "١٧ مايو" }, day: { en: "Sunday", ar: "الأحد" }, title: { en: "Recovery or Repeat Court", ar: "محكمة التعافي أو التكرار" }, notes: { en: "The squad decides: recovery day or repeat the crime scene.", ar: "القروب يقرر: يوم تعافي أو تكرار مسرح الجريمة." }, breakfast: { en: "Coconut water and regret", ar: "موية جوز هند وندم" }, lunch: { en: "Nook Bali or delivery", ar: "Nook Bali أو توصيل" }, dinner: { en: "Kenji or seafood", ar: "Kenji أو بحري" }, entertainment: { en: "Pool recovery, massage, light shopping", ar: "تعافي بالمسبح، مساج، تسوق خفيف" }, nightlife: { en: "Code 02 Lite", ar: "كود 02 لايت" }, ops: { en: "Abdulrhman documents the damage", ar: "عبدالرحمن يوثق الأضرار" }, transport: { en: "Driver if we leave. No scooters.", ar: "سائق إذا طلعنا. بدون سكوترات." } },
  { date: { en: "18 May", ar: "١٨ مايو" }, day: { en: "Monday", ar: "الاثنين" }, title: { en: "Hangover National Holiday", ar: "إجازة الهانق أوفر الوطنية" }, notes: { en: "Official recovery day. No alarms. No judgement.", ar: "يوم تعافي رسمي. بدون منبهات وبدون أحكام." }, breakfast: { en: "Skipped", ar: "تم التخطي" }, lunch: { en: "Soup rescue", ar: "إنقاذ بالشوربة" }, dinner: { en: "Abunawas comfort food", ar: "أكل أبو نواس المريح" }, entertainment: { en: "Massage, pool, Netflix, silence", ar: "مساج، مسبح، نتفلكس، صمت" }, nightlife: { en: "Body may reject application", ar: "الجسم قد يرفض الطلب" }, ops: { en: "Inventory check: money, phones, dignity", ar: "جرد: فلوس، جوالات، كرامة" }, transport: { en: "Driver only.", ar: "سائق فقط." } },
  { date: { en: "19 May", ar: "١٩ مايو" }, day: { en: "Tuesday", ar: "الثلاثاء" }, title: { en: "Sea + Air Adventure", ar: "مغامرة بحر وجو" }, notes: { en: "Scuba, snorkeling, parasailing, flyboard, and bragging rights.", ar: "غوص، سنوركلنق، براسيليُنق، فلاي بورد، وحقوق المفاخرة." }, breakfast: { en: "Villa breakfast", ar: "فطور الفيلا" }, lunch: { en: "Water sports area", ar: "منطقة الرياضات البحرية" }, dinner: { en: "Seasalt or Bali Timbungan", ar: "Seasalt أو Bali Timbungan" }, entertainment: { en: "Scuba, parasailing, flyboard, jet ski", ar: "غوص، براسيليُنق، فلاي بورد، جت سكي" }, nightlife: { en: "Beach club or villa chill", ar: "بيتش كلوب أو هدوء الفيلا" }, ops: { en: "Sohel confirms waivers. Saud checks charges", ar: "سهيل يؤكد التعهدات. سعود يراجع الرسوم" }, transport: { en: "Package pickup or private driver.", ar: "بيك أب الباكيج أو سائق خاص." } },
  { date: { en: "20 May", ar: "٢٠ مايو" }, day: { en: "Wednesday", ar: "الأربعاء" }, title: { en: "Final Full Day", ar: "آخر يوم كامل" }, notes: { en: "Last proper night. Spend energy wisely. Nobody will.", ar: "آخر ليلة فعلية. استخدم طاقتك بحكمة. محد بيسويها." }, breakfast: { en: "Villa breakfast", ar: "فطور الفيلا" }, lunch: { en: "Nook Bali", ar: "Nook Bali" }, dinner: { en: "Final dinner: Seasalt or Abunawas", ar: "العشاء الأخير: Seasalt أو أبو نواس" }, entertainment: { en: "Shopping, beach club, photoshoot", ar: "تسوق، بيتش كلوب، جلسة تصوير" }, nightlife: { en: "Last Code 02", ar: "آخر كود 02" }, ops: { en: "Pack before midnight or cry at 6 AM", ar: "جهز شنطتك قبل نص الليل أو ابكِ الساعة ٦ صباحاً" }, transport: { en: "Driver all day.", ar: "سائق طول اليوم." } },
  { date: { en: "21 May", ar: "٢١ مايو" }, day: { en: "Thursday", ar: "الخميس" }, title: { en: "Airport Day", ar: "يوم المطار" }, notes: { en: "Checkout + airport. Return flight exists in theory.", ar: "تشيك آوت + مطار. رحلة العودة موجودة نظرياً." }, breakfast: { en: "Airport breakfast", ar: "فطور المطار" }, lunch: { en: "Airport lunch", ar: "غداء المطار" }, dinner: { en: "Plane food lottery", ar: "يانصيب أكل الطيارة" }, entertainment: { en: "Duty free + emotional damage", ar: "Duty Free + ضرر نفسي" }, nightlife: { en: "Season two if we miss the flight", ar: "الموسم الثاني إذا فاتتنا الرحلة" }, ops: { en: "Final payments, lost items, passport panic", ar: "مدفوعات نهائية، أغراض ضايعة، هلع الجواز" }, transport: { en: "Private driver to airport.", ar: "سائق خاص للمطار." } },
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

function runSelfTests() {
  const totals = calculateTotals(initialBudgetItems);
  console.assert(totals.confirmed === 37733, `Expected confirmed budget 37733, got ${totals.confirmed}`);
  console.assert(totals.paid === 29333, `Expected paid budget 29333, got ${totals.paid}`);
  console.assert(totals.remaining === 8400, `Expected remaining budget 8400, got ${totals.remaining}`);
  console.assert(currency(null) === "TBD", "Expected null currency value to show TBD");
  console.assert(currency(null, "ar") === "غير محدد", "Expected Arabic null currency value");
  console.assert(navItems.length === 10, `Expected 10 navigation items, got ${navItems.length}`);
  console.assert(itinerary.length === 11, `Expected 11 itinerary days, got ${itinerary.length}`);
  console.assert(members.every((m) => m.challenges.length >= 4), "Each member should have at least 4 challenges");
  console.assert(activities.length >= 8, `Expected at least 8 activity cards, got ${activities.length}`);
  console.assert(getCountdownParts("2000-01-01T00:00:00+00:00").landed === true, "Past countdown should be landed");
  console.assert(weatherEmoji(95) === "⛈️", "Thunder weather code should map to thunder emoji");
  console.assert(txt(navItems[0][1], "ar") === "الرئيسية", "Arabic navbar translation should work");
  const markedRows = markBudgetRowPaid(initialBudgetItems, 3);
  console.assert(markedRows.find((row) => row.id === 3).paid === 550, "Mark paid should set paid amount equal to total");
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
  return <div className={`rounded-3xl border border-slate-200 bg-white p-5 shadow-sm ${className}`}>{children}</div>;
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
    <div className="mt-7 rounded-[2rem] border border-slate-200 bg-white p-5 text-center text-black shadow-2xl sm:p-7 lg:p-8">
      <div className="text-xs font-black uppercase tracking-[0.22em] text-black">{txt(copy.timeLeft, lang)}</div>
      <div className="mt-3 whitespace-nowrap text-3xl font-black leading-none tracking-tight text-black sm:text-5xl lg:text-7xl">{text}</div>
      <div className="mt-4 rounded-2xl bg-slate-100 px-4 py-3 text-sm font-black text-black">{txt(copy.launchTime, lang)}</div>
    </div>
  );
}

function WeatherCard({ day, lang }) {
  const label =
    typeof day.date === "object"
      ? txt(day.date, lang)
      : new Date(day.date).toLocaleDateString(lang === "ar" ? "ar-SA" : "en-US", { weekday: "short", month: "short", day: "numeric" });

  return (
    <Card className="min-w-[190px]">
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
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden opacity-25">
      <img src={backgroundImages[0]} alt="" className="absolute -right-28 top-24 h-80 w-64 rotate-6 rounded-[3rem] object-cover blur-[0.5px] md:h-[30rem] md:w-80" />
      <img src={backgroundImages[1]} alt="" className="absolute -left-24 top-[42rem] h-80 w-64 -rotate-6 rounded-[3rem] object-cover blur-[0.5px] md:h-[30rem] md:w-80" />
      <img src={backgroundImages[2]} alt="" className="absolute bottom-24 right-8 hidden h-72 w-56 rounded-[3rem] object-cover blur-[0.5px] lg:block" />
      <div className="absolute inset-0 bg-white/55" />
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
  const [flight, setFlight] = useState(() => {
    if (typeof window === "undefined") return { number: "", date: "2026-05-10", from: "RUH", to: "DPS" };
    try {
      return JSON.parse(window.localStorage.getItem("bali-flight-status") || "null") || { number: "", date: "2026-05-10", from: "RUH", to: "DPS" };
    } catch {
      return { number: "", date: "2026-05-10", from: "RUH", to: "DPS" };
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem("bali-flight-status", JSON.stringify(flight));
    } catch {
      // Ignore storage errors.
    }
  }, [flight]);

  const normalized = String(flight.number || "").replace(/\s+/g, "").toUpperCase();
  const hasFlight = normalized.length >= 3;
  const qatarStatusUrl = "https://fs.qatarairways.com/";
  const flightAwareUrl = hasFlight ? `https://www.flightaware.com/live/flight/${normalized}` : "https://www.flightaware.com/live/fleet/QTR";
  const flightradarUrl = hasFlight ? `https://www.flightradar24.com/data/flights/${normalized.toLowerCase()}` : "https://www.flightradar24.com/data/airlines/qatar-airways-qr";

  const update = (key, value) => setFlight((current) => ({ ...current, [key]: value }));

  return (
    <Section id="flight-status" eyebrow={{ en: "Live Travel Check", ar: "متابعة السفر" }} title={{ en: "Qatar Airways Flight Status", ar: "حالة رحلة الخطوط القطرية" }} sectionIcon="plane" lang={lang}>
      <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <Card className="bg-slate-950 text-white">
          <div className="mb-3 inline-flex rounded-full bg-white/10 px-4 py-2 text-sm font-black text-white">
            {txt({ en: "Status checker", ar: "متابعة الحالة" }, lang)}
          </div>
          <h3 className="text-3xl font-black lg:text-5xl">
            {hasFlight ? normalized : txt({ en: "Add your QR flight number", ar: "أضف رقم رحلة القطرية" }, lang)}
          </h3>
          <p className="mt-4 leading-7 text-slate-300">
            {txt({
              en: "Enter the Qatar Airways flight number, then use the official status links to check if the flight is on time, delayed, cancelled, boarding, or landed.",
              ar: "أدخل رقم رحلة الخطوط القطرية، ثم استخدم روابط المتابعة الرسمية لمعرفة هل الرحلة في الوقت، متأخرة، ملغاة، في مرحلة الصعود، أو وصلت."
            }, lang)}
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <Info label={{ en: "Airline", ar: "الطيران" }} value={{ en: "Qatar Airways", ar: "الخطوط القطرية" }} lang={lang} />
            <Info label={{ en: "Route", ar: "المسار" }} value={`${flight.from || "RUH"} → ${flight.to || "DPS"}`} lang={lang} />
            <Info label={{ en: "Date", ar: "التاريخ" }} value={flight.date || "2026-05-10"} lang={lang} />
          </div>
        </Card>

        <Card>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="block">
              <span className="text-sm font-black text-slate-600">{txt({ en: "Flight number", ar: "رقم الرحلة" }, lang)}</span>
              <input value={flight.number} onChange={(e) => update("number", e.target.value)} placeholder="QR123" className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 font-black outline-none focus:border-sky-400 focus:ring-4 focus:ring-sky-100" />
            </label>
            <label className="block">
              <span className="text-sm font-black text-slate-600">{txt({ en: "Flight date", ar: "تاريخ الرحلة" }, lang)}</span>
              <input type="date" value={flight.date} onChange={(e) => update("date", e.target.value)} className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 font-black outline-none focus:border-sky-400 focus:ring-4 focus:ring-sky-100" />
            </label>
            <label className="block">
              <span className="text-sm font-black text-slate-600">{txt({ en: "From", ar: "من" }, lang)}</span>
              <input value={flight.from} onChange={(e) => update("from", e.target.value.toUpperCase())} maxLength={3} className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 font-black outline-none focus:border-sky-400 focus:ring-4 focus:ring-sky-100" />
            </label>
            <label className="block">
              <span className="text-sm font-black text-slate-600">{txt({ en: "To", ar: "إلى" }, lang)}</span>
              <input value={flight.to} onChange={(e) => update("to", e.target.value.toUpperCase())} maxLength={3} className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 font-black outline-none focus:border-sky-400 focus:ring-4 focus:ring-sky-100" />
            </label>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <a href={qatarStatusUrl} target="_blank" rel="noreferrer" className="rounded-2xl bg-slate-950 px-4 py-3 text-center text-sm font-black text-white">{txt({ en: "Qatar official status", ar: "حالة الرحلة من قطرية" }, lang)}</a>
            <a href={flightAwareUrl} target="_blank" rel="noreferrer" className="rounded-2xl bg-sky-600 px-4 py-3 text-center text-sm font-black text-white">FlightAware</a>
            <a href={flightradarUrl} target="_blank" rel="noreferrer" className="rounded-2xl bg-amber-500 px-4 py-3 text-center text-sm font-black text-white">Flightradar24</a>
          </div>
          <div className="mt-5 rounded-2xl bg-amber-50 p-4 text-sm font-bold leading-6 text-amber-900">
            {txt({
              en: "Live status usually requires the exact QR flight number. Add it here once Abdullah shares the booking details.",
              ar: "الحالة المباشرة تحتاج رقم رحلة QR الصحيح. أضفه هنا بعد ما يشارك عبدالله تفاصيل الحجز."
            }, lang)}
          </div>
        </Card>
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

  const updateBudgetRow = (id, key, value) =>
    setBudgetRows((rows) => rows.map((row) => (row.id === id ? { ...row, [key]: value } : row)));

  const markPaid = (id) => setBudgetRows((rows) => markBudgetRowPaid(rows, id));

  const resetBudget = () => {
    setBudgetRows(initialBudgetItems);
    try {
      window.localStorage.removeItem("bali-squad-budget");
    } catch {
      // Ignore storage errors.
    }
  };

  return (
    <div dir={lang === "ar" ? "rtl" : "ltr"} lang={lang} className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,_#dff7ff,_transparent_32%),linear-gradient(180deg,_#f8fafc,_#ecfeff_42%,_#fff7ed)] text-slate-900">
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
            <button
              type="button"
              onClick={() => setLang((current) => (current === "en" ? "ar" : "en"))}
              className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-black text-slate-900 hover:bg-slate-100"
            >
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
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-sky-200 bg-white/80 px-4 py-2 text-sm font-bold text-sky-800">
              <I name="sparkles" />
              {txt(copy.heroTag, lang)}
            </div>
            <h1 className="text-5xl font-black leading-[0.95] tracking-tight text-slate-950 md:text-7xl">{txt(copy.heroTitle, lang)}</h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">{txt(copy.heroText, lang)}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#hype" className="rounded-full bg-sky-600 px-6 py-3 text-sm font-black text-white">{txt(copy.startHype, lang)}</a>
              <a href="#budget" className="rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-black text-slate-900">{txt(copy.openBudget, lang)}</a>
            </div>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Stat statIcon="plane" label={{ en: "Departure", ar: "المغادرة" }} value={{ en: "10 May", ar: "١٠ مايو" }} sub={{ en: "22:00 from Riyadh", ar: "٢٢:٠٠ من الرياض" }} lang={lang} />
              <Stat statIcon="home" label={copy.villa} value={{ en: "Villa Gima 1", ar: "فيلا قيما 1" }} sub={{ en: "Capacity: depends who comes back", ar: "السعة: تعتمد مين يرجع معنا" }} lang={lang} />
              <Stat statIcon="users" label={{ en: "Members", ar: "الأعضاء" }} value={{ en: "5 Pax", ar: "٥ أشخاص" }} sub={{ en: "Main cast only", ar: "الأبطال الأساسيين فقط" }} lang={lang} />
              <Stat statIcon="wallet" label={{ en: "Known Budget", ar: "الميزانية المعروفة" }} value={currency(totals.confirmed, lang)} sub={{ en: "editable below", ar: "قابلة للتعديل بالأسفل" }} lang={lang} />
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="relative">
            <div className="absolute -inset-4 rounded-[2.5rem] bg-sky-200/40 blur-3xl" />
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

        <Section id="hype" eyebrow={copy.hypeEyebrow} title={copy.hypeTitle} sectionIcon="fire" lang={lang}>
          <Card className="bg-white p-6 text-black sm:p-8 lg:p-10">
            <div className="mb-3 inline-flex rounded-full bg-slate-100 px-4 py-2 text-sm font-black text-black">{txt(copy.countdownChip, lang)}</div>
            <h3 className="text-4xl font-black text-black lg:text-6xl">{countdown.landed ? txt(copy.baliLive, lang) : txt(copy.wheelsUp, lang)}</h3>
            <p className="mt-4 max-w-3xl text-lg leading-8 text-black">{txt(copy.countdownSub, lang)}</p>
            <CountdownDisplay countdown={countdown} lang={lang} />

            <div className="mt-8 rounded-[2rem] border border-slate-200 bg-slate-50 p-5 text-black sm:p-6">
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

            <div className="mt-5 rounded-3xl border border-slate-200 bg-slate-100 p-4 text-sm leading-6 text-black">
              <b className="text-black">{txt(copy.codeTitle, lang)}</b> {txt(copy.codeText, lang)}
            </div>
          </Card>
        </Section>

        <Section id="trip" eyebrow={copy.flights} title={copy.tripDetails} sectionIcon="plane" lang={lang}>
          <div className="grid gap-5 lg:grid-cols-3">
            {flights.map((flight) => (
              <Card key={flight.type.en}>
                <div className="mb-4 flex items-center justify-between">
                  <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-black uppercase tracking-[0.16em] text-sky-700">{txt(flight.type, lang)}</span>
                  <I name="plane" />
                </div>
                <h3 className="text-xl font-black">{txt(flight.route, lang)}</h3>
                <div className="mt-5 space-y-3 text-sm">
                  <Row label={{ en: "Date", ar: "التاريخ" }} value={flight.date} lang={lang} />
                  <Row label={{ en: "Time", ar: "الوقت" }} value={flight.time} lang={lang} />
                  <Row label={{ en: "Flight No.", ar: "رقم الرحلة" }} value={flight.number} lang={lang} />
                  <p className="pt-2 leading-6 text-slate-500">{txt(flight.note, lang)}</p>
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
              {seats.map(([member, seat, note]) => (
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
              <div className="mb-4 inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-black uppercase tracking-[0.16em] text-emerald-700">{txt({ en: "Airbnb Villa", ar: "فيلا Airbnb" }, lang)}</div>
              <h3 className="text-3xl font-black">{txt({ en: "Villa Gima 1 - 5 bedrooms", ar: "فيلا قيما 1 - خمس غرف" }, lang)}</h3>
              <p className="mt-4 leading-7 text-slate-600">{txt({ en: "Entire villa in Umalas with pool, garden, kitchen, wifi, workspace, parking, and concierge-on-demand support.", ar: "فيلا كاملة في أومالاس مع مسبح، حديقة، مطبخ، واي فاي، مساحة عمل، مواقف، وخدمة كونسيرج عند الطلب." }, lang)}</p>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <Info label={{ en: "Check-in", ar: "تسجيل الدخول" }} value={{ en: "Host said vibes first, timing second", ar: "المهم الفايب، والوقت بعدين" }} lang={lang} />
                <Info label={{ en: "Check-out", ar: "تسجيل الخروج" }} value={{ en: "When they force us to leave", ar: "لما يجبروننا نطلع" }} lang={lang} />
                <Info label={{ en: "Stay period", ar: "مدة الإقامة" }} value={{ en: "11–21 May 2026", ar: "١١–٢١ مايو ٢٠٢٦" }} lang={lang} />
                <Info label={{ en: "Capacity", ar: "السعة" }} value={{ en: "Officially 10. Unofficially depends who comes back with the squad.", ar: "رسمياً ١٠. غير رسمياً يعتمد مين يرجع مع القروب." }} lang={lang} />
              </div>
              <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
                <b><I name="alert" /> {txt({ en: "Note:", ar: "ملاحظة:" }, lang)}</b>{" "}
                {txt({ en: "Confirm final check-in and check-out timing with the host.", ar: "تأكد من وقت الدخول والخروج النهائي مع المضيف." }, lang)}
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
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <Detail detailIcon="chef" label={{ en: "Breakfast", ar: "الفطور" }} value={activeDay.breakfast} lang={lang} />
                <Detail detailIcon="food" label={{ en: "Lunch", ar: "الغداء" }} value={activeDay.lunch} lang={lang} />
                <Detail detailIcon="food" label={{ en: "Dinner", ar: "العشاء" }} value={activeDay.dinner} lang={lang} />
                <Detail detailIcon="music" label={{ en: "Entertainment", ar: "الترفيه" }} value={activeDay.entertainment} lang={lang} />
              </div>
              <div className="mt-4 grid gap-4 sm:grid-cols-3">
                <Detail label={{ en: "Night Mode", ar: "الوضع الليلي" }} value={activeDay.nightlife} lang={lang} />
                <Detail label={{ en: "Operations", ar: "العمليات" }} value={activeDay.ops} lang={lang} />
                <Detail label={{ en: "Transport", ar: "المواصلات" }} value={activeDay.transport} lang={lang} />
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

        <Section id="members" eyebrow={copy.squad} title={copy.members} sectionIcon="users" lang={lang}>
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
