import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";

const FLIGHT_TARGET = "2026-05-10T22:00:00+03:00";
const WEATHER_URL = "https://api.open-meteo.com/v1/forecast?latitude=-8.65&longitude=115.22&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=Asia%2FMakassar&forecast_days=7";

const icon = {
  plane: "✈️", home: "🏡", fire: "🔥", calendar: "📅", map: "📍", users: "👥", wallet: "💳",
  waves: "🌊", dive: "🤿", air: "🪂", car: "🚙", party: "🎉", bike: "🛵", check: "✅",
  palm: "🌴", sparkles: "✨", bed: "🛏️", alert: "⚠️", chef: "👨‍🍳", food: "🍽️",
  music: "🎵", trophy: "🏆", weather: "🌤️", formula: "🧮", shield: "🛡️",
};

const navItems = [
  ["home", "Home"], ["hype", "Squad Hype"], ["trip", "Trip"], ["accommodation", "Accommodation"],
  ["itinerary", "Itinerary"], ["things", "Things To Do"], ["members", "Trip Members"], ["budget", "Budget"],
];

const LanguageContext = React.createContext("en");

const arText = {
  "Home": "الرئيسية",
  "Squad Hype": "حماس القروب",
  "Trip": "الرحلة",
  "Accommodation": "السكن",
  "Itinerary": "الجدول",
  "Things To Do": "أشياء نسويها",
  "Trip Members": "الأعضاء",
  "Budget": "الميزانية",
  "Bali Squad": "قروب بالي",
  "May 2026": "مايو ٢٠٢٦",
  "Launch Mode": "وضع الانطلاق",
  "5 members · 10 nights · Umalas, Bali · Code 02 enabled": "٥ أعضاء · ١٠ ليالي · أومالاس، بالي · كود 02 مفعل",
  "Bali Squad Trip Control Center": "مركز تحكم رحلة بالي",
  "Flights, villa takeover, weather checks, daily chaos planning, transport, activities, member challenges, and budget damage control.": "الرحلات، السكن، الطقس، الجدول اليومي، التنقلات، الفعاليات، تحديات الأعضاء، والسيطرة على الميزانية.",
  "Start the Hype": "ابدأ الحماس",
  "Open Budget Sheet": "افتح الميزانية",
  "Departure": "المغادرة",
  "Arrival": "الوصول",
  "Return": "العودة",
  "Villa": "الفيلا",
  "Villa Gima 1": "فيلا قيما 1",
  "Capacity: depends who comes back": "السعة: تعتمد مين يرجع معنا",
  "Members": "الأعضاء",
  "5 Pax": "٥ أشخاص",
  "Main cast only": "الأبطال الأساسيين فقط",
  "Known Budget": "الميزانية المعروفة",
  "editable below": "قابلة للتعديل بالأسفل",
  "Base Camp": "المقر الرئيسي",
  "Umalas · May 11–21 · pool, garden, privacy, and questionable squad decisions": "أومالاس · ١١–٢١ مايو · مسبح، حديقة، خصوصية، وقرارات قروب مشكوك فيها",
  "Countdown + Weather": "العد التنازلي والطقس",
  "Squad Hype Dashboard": "لوحة حماس القروب",
  "Flight countdown to chaos": "العد التنازلي لبداية الفوضى",
  "Wheels up soon": "قريباً الإقلاع",
  "Bali Mode Activated": "تم تفعيل وضع بالي",
  "Riyadh departure: 10 May 2026 at 22:00. Pack properly or panic-buy sunglasses.": "المغادرة من الرياض: ١٠ مايو ٢٠٢٦ الساعة ٢٢:٠٠. جهز شنطتك أو اشتر نظارات شمسية آخر لحظة.",
  "Time left until takeoff": "الوقت المتبقي للإقلاع",
  "Flight launch: 10 May 2026 · 22:00 Riyadh time": "الإقلاع: ١٠ مايو ٢٠٢٦ · ٢٢:٠٠ بتوقيت الرياض",
  "Live Bali Weather": "طقس بالي المباشر",
  "Daily auto-update": "تحديث يومي تلقائي",
  "Loading Bali weather...": "جاري تحميل طقس بالي...",
  "Code 02 Dictionary:": "قاموس كود 02:",
  "adult-only after-dark villa mode: music, dancing, suspicious coconut water, late-night confidence, and next-day recovery operations.": "وضع ليلي للكبار في الفيلا: موسيقى، رقص، موية جوز هند مشبوهة، ثقة آخر الليل، وعمليات تعافي اليوم الثاني.",
  "Live weather is taking a nap. Showing Bali-mode fallback.": "الطقس المباشر نايم شوي. عرضنا وضع بالي الاحتياطي.",
  "Today": "اليوم",
  "Tomorrow": "بكرة",
  "Bali forecast": "توقعات بالي",
  "Rain chance:": "احتمالية المطر:",
  "Clear. Sunscreen tax applies.": "الجو صافي. ضريبة واقي الشمس واجبة.",
  "Partly cloudy. Perfect for acting productive.": "غائم جزئياً. ممتاز للتظاهر بالإنتاجية.",
  "Rainy. Pool still counts.": "ممطر. المسبح ما زال محسوب.",
  "Thunder vibes. Villa mode recommended.": "أجواء رعد. وضع الفيلا أفضل.",
  "Bali weather doing Bali things.": "طقس بالي يسوي حركات بالي.",
  "Hot, humid, and ready for bad decisions.": "حر ورطوبة وجاهز للقرارات السيئة.",
  "Pool first. Weather later.": "المسبح أولاً، الطقس لاحقاً.",
  "Flights": "الرحلات",
  "Trip Details": "تفاصيل الرحلة",
  "Riyadh (RUH) → Bali / Denpasar (DPS)": "الرياض (RUH) → بالي / دينباسار (DPS)",
  "Bali / Denpasar (DPS)": "بالي / دينباسار (DPS)",
  "Bali / Denpasar (DPS) → Riyadh (RUH)": "بالي / دينباسار (DPS) → الرياض (RUH)",
  "10 May": "١٠ مايو",
  "10 May 2026": "١٠ مايو ٢٠٢٦",
  "11 May 2026": "١١ مايو ٢٠٢٦",
  "21 May 2026": "٢١ مايو ٢٠٢٦",
  "22:00 from Riyadh": "٢٢:٠٠ من الرياض",
  "Maybe if we decide to come back": "يمكن، إذا قررنا نرجع",
  "Captain will tell us eventually": "الكابتن بيعلمنا في وقتها",
  "Follow the tired faces": "اتبع الوجوه التعبانة",
  "Return plan under investigation": "خطة العودة تحت التحقيق",
  "Abdullah is the official source of truth for flight numbers.": "عبدالله هو المصدر الرسمي لأرقام الرحلات.",
  "Mission: survive immigration and find the villa before the squad turns into luggage.": "المهمة: نعدي الجوازات ونلقى الفيلا قبل ما يتحول القروب إلى شنط.",
  "Small chance we forget to return and accidentally become Bali locals.": "في احتمال بسيط ننسى نرجع ونصير من سكان بالي بالغلط.",
  "Date": "التاريخ",
  "Time": "الوقت",
  "Flight No.": "رقم الرحلة",
  "Seat Assignment": "توزيع المقاعد",
  "Saud": "سعود",
  "Abdullah": "عبدالله",
  "Naif": "نايف",
  "Sohel": "سهيل",
  "Abdulrhman": "عبدالرحمن",
  "Wherever the budget allows": "حسب ما تسمح الميزانية",
  "Pilot assistant by confidence": "مساعد الطيار بالثقة فقط",
  "Next to opportunity": "جنب الفرصة",
  "Emergency activity desk": "مكتب طوارئ الفعاليات",
  "Window seat or no photos": "شباك أو بدون صور",
  "Budget boss seat": "كرسي مسؤول الميزانية",
  "Leader seat": "كرسي القائد",
  "Party energy seat": "كرسي طاقة الحفلة",
  "Activities control seat": "كرسي التحكم بالفعاليات",
  "Camera access seat": "كرسي وصول الكاميرا",
  "Airbnb Villa": "فيلا Airbnb",
  "Villa Gima 1 - 5 bedrooms": "فيلا قيما 1 - خمس غرف",
  "Entire villa in Umalas with pool, garden, kitchen, wifi, workspace, parking, and concierge-on-demand support.": "فيلا كاملة في أومالاس مع مسبح، حديقة، مطبخ، واي فاي، مساحة عمل، مواقف، وخدمة كونسيرج عند الطلب.",
  "Check-in": "تسجيل الدخول",
  "Check-out": "تسجيل الخروج",
  "Stay period": "مدة الإقامة",
  "Capacity": "السعة",
  "Host said vibes first, timing second": "المهم الفايب، والوقت بعدين",
  "When they force us to leave": "لما يجبروننا نطلع",
  "11–21 May 2026": "١١–٢١ مايو ٢٠٢٦",
  "Officially 10. Unofficially depends who comes back with the squad.": "رسمياً ١٠. غير رسمياً يعتمد مين يرجع مع القروب.",
  "Note:": "ملاحظة:",
  "Confirm final check-in and check-out timing with the host.": "تأكد من وقت الدخول والخروج النهائي مع المضيف.",
  "Infinity pool & garden": "المسبح والحديقة",
  "Living & dining area": "منطقة المعيشة والطعام",
  "Villa upper floor view": "إطلالة الدور العلوي",
  "Outdoor shower vibe": "أجواء الشاور الخارجي",
  "Schedule": "الجدول",
  "Daily Itinerary": "الجدول اليومي",
  "Monday": "الاثنين",
  "Tuesday": "الثلاثاء",
  "Wednesday": "الأربعاء",
  "Thursday": "الخميس",
  "Friday": "الجمعة",
  "Saturday": "السبت",
  "Sunday": "الأحد",
  "11 May": "١١ مايو",
  "12 May": "١٢ مايو",
  "13 May": "١٣ مايو",
  "14 May": "١٤ مايو",
  "15 May": "١٥ مايو",
  "16 May": "١٦ مايو",
  "17 May": "١٧ مايو",
  "18 May": "١٨ مايو",
  "19 May": "١٩ مايو",
  "20 May": "٢٠ مايو",
  "21 May": "٢١ مايو",
  "Breakfast": "الفطور",
  "Lunch": "الغداء",
  "Dinner": "العشاء",
  "Entertainment": "الترفيه",
  "Night Mode": "الوضع الليلي",
  "Operations": "العمليات",
  "Transport": "المواصلات",
  "Touchdown + Villa Takeover": "الوصول + احتلال الفيلا",
  "Villa Chill + Pool Committee": "استرخاء الفيلا + لجنة المسبح",
  "Shopping Day + Food Hunt": "يوم التسوق + صيد الأكل",
  "ATV / Adventure + Code 02": "دبابات / مغامرة + كود 02",
  "Friday Prayer + Seafood + Water": "صلاة الجمعة + بحري + موية",
  "Code 02 — Full Send": "كود 02 — انطلاق كامل",
  "Recovery or Repeat Court": "محكمة التعافي أو التكرار",
  "Hangover National Holiday": "إجازة الهانق أوفر الوطنية",
  "Sea + Air Adventure": "مغامرة بحر وجو",
  "Final Full Day": "آخر يوم كامل",
  "Airport Day": "يوم المطار",
  "Arrival 5 PM. Find bags, find driver, find villa, pretend we are organized.": "الوصول ٥ مساءً. نلقى الشنط، السائق، الفيلا، ونتظاهر أننا منظمين.",
  "First proper day. No hero moves before breakfast.": "أول يوم فعلي. بدون بطولات قبل الفطور.",
  "No breakfast planned because apparently we enjoy suffering.": "ما فيه فطور مخطط لأن واضح أننا نستمتع بالمعاناة.",
  "Starts sporty and ends with questionable accounting.": "يبدأ رياضي وينتهي بحسابات مشكوك فيها.",
  "والله بنصلي الجمعة — then seafood, then water activities.": "والله بنصلي الجمعة — بعدها بحري وفعاليات مائية.",
  "Villa chaos, dancing, adult drinks, questionable decisions, and tomorrow's headache invoice.": "فوضى الفيلا، رقص، مشروبات للكبار، قرارات مشكوك فيها، وفاتورة صداع بكرة.",
  "The squad decides: recovery day or repeat the crime scene.": "القروب يقرر: يوم تعافي أو تكرار مسرح الجريمة.",
  "Official recovery day. No alarms. No judgement.": "يوم تعافي رسمي. بدون منبهات وبدون أحكام.",
  "Scuba, snorkeling, parasailing, flyboard, and bragging rights.": "غوص، سنوركلنق، براسيليُنق، فلاي بورد، وحقوق المفاخرة.",
  "Last proper night. Spend energy wisely. Nobody will.": "آخر ليلة فعلية. استخدم طاقتك بحكمة. محد بيسويها.",
  "Checkout + airport. Return flight exists in theory.": "تشيك آوت + مطار. رحلة العودة موجودة نظرياً.",
  "Plane breakfast — survival mode": "فطور الطيارة — وضع النجاة",
  "Airport or delivery": "المطار أو توصيل",
  "Abunawas or villa delivery": "أبو نواس أو توصيل للفيلا",
  "Shopping + grocery raid": "تسوق + غزوة مقاضي",
  "Soft launch only": "افتتاح ناعم فقط",
  "Saud enters Carrefour like a CFO with trauma": "سعود يدخل كارفور كمدير مالي مصدوم",
  "Private driver from airport. No walking.": "سائق خاص من المطار. بدون مشي.",
  "Villa breakfast": "فطور الفيلا",
  "Nook Bali or Bali Timbungan": "Nook Bali أو Bali Timbungan",
  "Seasalt at Alila Seminyak": "Seasalt في Alila Seminyak",
  "Pool, shopping, sunset drive": "مسبح، تسوق، مشوار غروب",
  "Code 02 rehearsal": "بروفة كود 02",
  "Confirm activities before Sohel sends 14 voice notes": "أكد الفعاليات قبل سهيل يرسل ١٤ فويس",
  "Hire driver. Scooter only for short coffee runs.": "استأجر سائق. السكوتر فقط لمشاوير كوفي قصيرة.",
  "Coffee counts": "القهوة تنحسب",
  "Bali Timbungan": "Bali Timbungan",
  "Kenji Ramen": "Kenji Ramen",
  "Shopping + cafés": "تسوق + كافيهات",
  "Free night, dangerous sentence": "ليلة مفتوحة، جملة خطيرة",
  "Restaurant owner must act like a restaurant owner": "مسؤول المطاعم لازم يتصرف كمسؤول مطاعم",
  "Driver for shopping bags.": "سائق لشنط التسوق.",
  "Near ATV area": "قريب من منطقة الدبابات",
  "Seafood or villa BBQ": "بحري أو شواء الفيلا",
  "Kuber ATV or rafting": "دبابات Kuber أو رافتنق",
  "Code 02 activated": "تم تفعيل كود 02",
  "Sohel shares pickup time": "سهيل يشارك وقت البيك أب",
  "Activity pickup or private driver.": "بيك أب الفعالية أو سائق خاص.",
  "Light coffee": "قهوة خفيفة",
  "Kendi Kuning or Seasalt": "Kendi Kuning أو Seasalt",
  "Villa dinner or Abunawas": "عشاء الفيلا أو أبو نواس",
  "Jet ski, parasailing, banana boat, diving": "جت سكي، براسيليُنق، بنانا بوت، غوص",
  "Recovery unless Code 02 attacks": "تعافي إلا إذا هجم كود 02",
  "Bring towels or become towel intern": "جيب مناشف أو تصير متدرب مناشف",
  "Private driver to water sports.": "سائق خاص للرياضات البحرية.",
  "Cute idea": "فكرة لطيفة",
  "Delivery to villa": "توصيل للفيلا",
  "Naif BBQ or Arabic food": "شواء نايف أو أكل عربي",
  "Pool, music, villa games": "مسبح، موسيقى، ألعاب فيلا",
  "Coconut Storm": "عاصفة جوز الهند",
  "Hide fragile items and protect the speaker": "خبوا الأشياء القابلة للكسر واحموا السماعة",
  "Stay home. Driver only for supply runs.": "نبقى بالفيلا. السائق فقط للمستلزمات.",
  "Coconut water and regret": "موية جوز هند وندم",
  "Nook Bali or delivery": "Nook Bali أو توصيل",
  "Kenji or seafood": "Kenji أو بحري",
  "Pool recovery, massage, light shopping": "تعافي بالمسبح، مساج، تسوق خفيف",
  "Code 02 Lite": "كود 02 لايت",
  "Abdulrhman documents the damage": "عبدالرحمن يوثق الأضرار",
  "Driver if we leave. No scooters.": "سائق إذا طلعنا. بدون سكوترات.",
  "Skipped": "تم التخطي",
  "Soup rescue": "إنقاذ بالشوربة",
  "Abunawas comfort food": "أكل أبو نواس المريح",
  "Massage, pool, Netflix, silence": "مساج، مسبح، نتفلكس، صمت",
  "Body may reject application": "الجسم قد يرفض الطلب",
  "Inventory check: money, phones, dignity": "جرد: فلوس، جوالات، كرامة",
  "Driver only.": "سائق فقط.",
  "Water sports area": "منطقة الرياضات البحرية",
  "Seasalt or Bali Timbungan": "Seasalt أو Bali Timbungan",
  "Scuba, parasailing, flyboard, jet ski": "غوص، براسيليُنق، فلاي بورد، جت سكي",
  "Beach club or villa chill": "بيتش كلوب أو هدوء الفيلا",
  "Sohel confirms waivers. Saud checks charges": "سهيل يؤكد التعهدات. سعود يراجع الرسوم",
  "Package pickup or private driver.": "بيك أب الباكيج أو سائق خاص.",
  "Nook Bali": "Nook Bali",
  "Final dinner: Seasalt or Abunawas": "العشاء الأخير: Seasalt أو أبو نواس",
  "Shopping, beach club, photoshoot": "تسوق، بيتش كلوب، جلسة تصوير",
  "Last Code 02": "آخر كود 02",
  "Pack before midnight or cry at 6 AM": "جهز شنطتك قبل نص الليل أو ابكِ الساعة ٦ صباحاً",
  "Driver all day.": "سائق طول اليوم.",
  "Airport breakfast": "فطور المطار",
  "Airport lunch": "غداء المطار",
  "Plane food lottery": "يانصيب أكل الطيارة",
  "Duty free + emotional damage": "Duty Free + ضرر نفسي",
  "Season two if we miss the flight": "الموسم الثاني إذا فاتتنا الرحلة",
  "Final payments, lost items, passport panic": "مدفوعات نهائية، أغراض ضايعة، هلع الجواز",
  "Private driver to airport.": "سائق خاص للمطار.",
  "Recommendations": "التوصيات",
  "Trip Rules": "قوانين الرحلة",
  "Restaurant & Coffee Shortlist": "قائمة المطاعم والكوفيهات",
  "Open location": "افتح الموقع",
  "Book / Compare Main": "احجز / قارن الرئيسي",
  "Water Sports": "الرياضات البحرية",
  "Scuba / Snorkeling": "غوص وسنوركلنق",
  "Air Activities": "الفعاليات الجوية",
  "ATV / Rafting": "دبابات ورافتنق",
  "Beach Clubs": "بيتش كلوب",
  "Scooter Rental": "تأجير سكوتر",
  "Private Driver": "سائق خاص",
  "Fancy Car Mode": "وضع السيارة الفخمة",
  "Jet ski": "جت سكي",
  "Banana boat": "بنانا بوت",
  "Parasailing": "براسيليُنق",
  "Flyboard": "فلاي بورد",
  "Kayaking": "كاياك",
  "Beginner scuba": "غوص للمبتدئين",
  "Snorkeling": "سنوركلنق",
  "Underwater photos": "تصوير تحت الماء",
  "Boat day": "يوم بالقارب",
  "Paragliding": "باراقلايدنق",
  "Scenic options": "خيارات إطلالات",
  "Kuber ATV": "دبابات Kuber",
  "Telaga Waja rafting": "رافتنق Telaga Waja",
  "Quad bike": "دباب رباعي",
  "Mud photos": "صور طين",
  "Villa after-party": "أفتر بارتي الفيلا",
  "Short café runs": "مشاوير كوفي قصيرة",
  "Nearby shopping": "تسوق قريب",
  "Backup transport": "مواصلات احتياطية",
  "Confident riders only": "للي يعرف يسوق فقط",
  "Airport transfer": "نقل المطار",
  "Shopping day": "يوم التسوق",
  "Water sports": "رياضات بحرية",
  "No walking policy": "سياسة بدون مشي",
  "Luxury car": "سيارة فخمة",
  "Alphard style": "ستايل ألفارد",
  "CEO arrival": "وصول المدير التنفيذي",
  "Beach club entrance": "دخول بيتش كلوب",
  "Good all-in-one sea activities option.": "خيار ممتاز للأنشطة البحرية في مكان واحد.",
  "Compare operators and reviews on Klook.": "قارن الشركات والتقييمات في Klook.",
  "Low walking. High drama.": "مشي قليل ودراما عالية.",
  "For adventure photo evidence.": "عشان صور المغامرة تثبت أننا سوينا شيء.",
  "Book ahead for a group.": "احجز بدري إذا القروب كبير.",
  "No scooter missions after Code 02.": "ممنوع مشاوير السكوتر بعد كود 02.",
  "Simple private car with driver booking.": "حجز بسيط لسيارة خاصة مع سائق.",
  "For sunglasses board-meeting arrival.": "لوصول رسمي بنظارات شمسية.",
  "Abunawas Restaurant Bali": "مطعم أبو نواس بالي",
  "Arabic / Middle Eastern": "عربي / شرق أوسطي",
  "Indonesian / Balinese": "إندونيسي / بالي",
  "Japanese / Ramen": "ياباني / رامن",
  "Seafood / Beach view": "مأكولات بحرية / إطلالة بحر",
  "Seafood / Indonesian": "مأكولات بحرية / إندونيسي",
  "Indonesian / Western": "إندونيسي / غربي",
  "Comfort food and halal-friendly backup.": "أكل مريح وخيار مناسب للحلال.",
  "Local food night. Confirm no pork or ham.": "ليلة أكل محلي. تأكد بدون خنزير أو هام.",
  "Good late dinner vibe. Check broth and toppings.": "مناسب للعشاء المتأخر. تأكد من المرق والإضافات.",
  "Final dinner candidate with ocean views.": "مرشح للعشاء الأخير مع إطلالة بحر.",
  "Good fish lunch or easy dinner.": "غداء سمك ممتاز أو عشاء بسيط.",
  "Close and relaxed for lunch or coffee.": "قريب ورايق للغداء أو القهوة.",
  "Safe choice": "خيار آمن",
  "Local food": "أكل محلي",
  "Late-night vibe": "أجواء آخر الليل",
  "Seafood view": "إطلالة بحرية",
  "Fish day": "يوم السمك",
  "Near villa": "قريب من الفيلا",
  "Squad": "القروب",
  "Main style": "الستايل الأساسي",
  "Challenges": "التحديات",
  "Budget Boss, schedule wizard, logistics officer & grocery negotiator": "رئيس الميزانية، ساحر الجدول، مسؤول اللوجستيات، ومفاوض البقالة",
  "Trip Leader, booking king & official +21 chaos supervisor": "قائد الرحلة، ملك الحجوزات، ومشرف فوضى +21 الرسمي",
  "BBQ commander, party starter & social department director": "قائد الشواء، مشعل الحفلات، ومدير العلاقات الاجتماعية",
  "Activities CEO, booking machine & schedule detail hunter": "مدير الفعاليات، ماكينة الحجوزات، وصياد تفاصيل الجدول",
  "Cameraman — Bali After-Dark Documentary Unit": "المصور — وحدة توثيق بالي بعد المغرب",
  "Restaurants, coffee shops & emergency hunger management": "المطاعم، الكوفيهات، وإدارة الجوع الطارئ",
  "Light blue + panda theme": "أزرق فاتح + ستايل باندا",
  "Boss mode / black & gold": "وضع القائد / أسود وذهبي",
  "Red party shirt / villa flame mode": "قميص أحمر للحفلات / وضع لهب الفيلا",
  "Sporty adventure fit": "ستايل رياضي للمغامرات",
  "Clean white / always camera-ready": "أبيض نظيف / جاهز للتصوير دائماً",
  "Food critic uniform": "زي ناقد الطعام",
  "Open Role": "دور مفتوح",
  "Wear the panda/light-blue fit for one full villa day.": "البس ستايل الباندا/الأزرق الفاتح يوم كامل في الفيلا.",
  "Do the morning budget audit while everyone pretends to be alive.": "سو تدقيق الميزانية الصباحي والكل يتظاهر أنه صاحي.",
  "Buy groceries without letting anyone add random nonsense.": "اشتر المقاضي بدون ما تخلي أحد يضيف أشياء عشوائية.",
  "Lead one emergency hangover recovery meeting by the pool.": "قد اجتماع تعافي طارئ من الهانق أوفر عند المسبح.",
  "Approve every major plan in 30 seconds or pay snack tax.": "وافق على أي خطة كبيرة خلال ٣٠ ثانية أو ادفع ضريبة سناكات.",
  "Give one dramatic leader speech before beach club entry.": "اعطِ خطاب قائد درامي قبل دخول البيتش كلوب.",
  "Keep all booking screenshots ready like classified files.": "خلي كل صور الحجوزات جاهزة كأنها ملفات سرية.",
  "Save the squad once when everyone forgets what day it is.": "أنقذ القروب مرة لما الكل ينسى اليوم.",
  "Start one BBQ night with a chef speech nobody asked for.": "ابدأ ليلة الشواء بخطاب شيف محد طلبه.",
  "Create one playlist that does not get skipped in 2 minutes.": "سو بلاي لست ما تنسحب بعد دقيقتين.",
  "Bring the party energy before everyone becomes furniture.": "جيب طاقة الحفلة قبل ما يصير الكل أثاث.",
  "Organize one villa night that gets named forever.": "نظم ليلة في الفيلا يصير لها اسم للأبد.",
  "Book one activity without changing the time 3 times.": "احجز فعالية بدون تغيير الوقت ٣ مرات.",
  "Make everyone arrive 15 minutes early using pure pressure.": "خل الكل يوصل قبل الوقت بـ١٥ دقيقة بالضغط فقط.",
  "Negotiate one group activity like he owns the company.": "فاوض على فعالية للقروب كأنه يملك الشركة.",
  "Create a daily activity voice note under 45 seconds.": "سجل فويس يومي للفعاليات أقل من ٤٥ ثانية.",
  "Take one cinematic group shot every day before the squad collapses.": "خذ لقطة سينمائية للقروب كل يوم قبل الانهيار.",
  "Capture the before-and-after hangover transformation professionally.": "وثق تحول قبل وبعد الهانق أوفر باحتراف.",
  "Make a trip recap video that looks expensive.": "سو فيديو ملخص للرحلة يبان غالي.",
  "No blurry photos allowed. Blurry memories are enough.": "ممنوع الصور المهزوزة. الذكريات المهزوزة تكفي.",
  "Pick one dinner spot nobody complains about.": "اختر مطعم عشاء محد يشتكي منه.",
  "Find coffee close enough that nobody says too far.": "لق لنا كوفي قريب لدرجة محد يقول بعيد.",
  "Confirm no pork/ham before ordering like a responsible adult.": "تأكد بدون خنزير/هام قبل الطلب كشخص مسؤول.",
  "Book at least one seafood dinner before last-day panic.": "احجز عشاء بحري واحد على الأقل قبل هلع آخر يوم.",
  "Money": "الفلوس",
  "Editable Budget Sheet": "جدول الميزانية القابل للتعديل",
  "Known confirmed budget": "الميزانية المؤكدة",
  "Paid so far": "المدفوع حتى الآن",
  "Remaining known": "المتبقي المعروف",
  "Known cost / person": "التكلفة للشخص",
  "excludes optional/TBD rows": "بدون البنود الاختيارية/غير المحددة",
  "updates from table": "يتحدث من الجدول",
  "confirmed minus paid": "المؤكد ناقص المدفوع",
  "based on 5 pax": "على أساس ٥ أشخاص",
  "Live trip calculator": "حاسبة الرحلة المباشرة",
  "Change total or paid amounts. It updates automatically and saves in this browser.": "غيّر الإجمالي أو المدفوع، والحسبة تتحدث تلقائياً وتنحفظ في هذا المتصفح.",
  "Balance = Total - Paid": "المتبقي = الإجمالي - المدفوع",
  "Reset sheet": "إعادة ضبط",
  "Item": "البند",
  "Total": "الإجمالي",
  "Paid": "المدفوع",
  "Balance": "المتبقي",
  "Per Person": "لكل شخص",
  "Action": "الإجراء",
  "Mark paid": "تم الدفع",
  "Paid ✓": "مدفوع ✓",
  "Grand total incl. optional": "الإجمالي مع الاختياري",
  "Remaining / person": "المتبقي للشخص",
  "Suspicious Coconut Water": "موية جوز الهند المشبوهة",
  "TBD because nobody tells the truth before the trip.": "غير محدد لأن محد يقول الحقيقة قبل الرحلة.",
  "Accommodation / Villa": "السكن / الفيلا",
  "Logistics": "اللوجستيات",
  "F&B": "الأكل والشرب",
  "Private Nightlife Extras": "إضافات ليلية خاصة",
  "No ham or pork food stops": "بدون مطاعم فيها هام أو خنزير",
  "No temple visits": "بدون زيارات معابد",
  "No hiking": "بدون هايكينق",
  "No long walks": "بدون مشاوير مشي طويلة",
  "No ritual-related activities": "بدون أي فعاليات طقوسية",
  "No random 6 AM adventure plans": "بدون خطط مفاجئة الساعة ٦ الصباح",
  "Bali mode is live": "وضع بالي شغال",
  "17:00": "١٧:٠٠",
  "22:00": "٢٢:٠٠",
  "Grand total incl. optional": "الإجمالي مع الاختياري",
  "Remaining / person": "المتبقي للشخص",
  "Bali Squad Trip Website · Weather updates live · Budget is editable · Code 02 remains classified.": "موقع رحلة قروب بالي · الطقس يتحدث مباشرة · الميزانية قابلة للتعديل · كود 02 يبقى سرياً."
};

function tr(value, lang) {
  if (typeof value !== "string") return value;
  if (lang !== "ar") return value;
  return arText[value] || value;
}

function useLang() {
  return React.useContext(LanguageContext);
}

const members = [
  { name: "Saud", emoji: "🐼", role: "Budget Boss, schedule wizard, logistics officer & grocery negotiator", vibe: "Light blue + panda theme", color: "bg-sky-100 text-sky-800 border-sky-200", challenges: ["Wear the panda/light-blue fit for one full villa day.", "Do the morning budget audit while everyone pretends to be alive.", "Buy groceries without letting anyone add random nonsense.", "Lead one emergency hangover recovery meeting by the pool."] },
  { name: "Abdullah", emoji: "👑", role: "Trip Leader, booking king & official +21 chaos supervisor", vibe: "Boss mode / black & gold", color: "bg-amber-100 text-amber-800 border-amber-200", challenges: ["Approve every major plan in 30 seconds or pay snack tax.", "Give one dramatic leader speech before beach club entry.", "Keep all booking screenshots ready like classified files.", "Save the squad once when everyone forgets what day it is."] },
  { name: "Naif", emoji: "🔥", role: "BBQ commander, party starter & social department director", vibe: "Red party shirt / villa flame mode", color: "bg-rose-100 text-rose-800 border-rose-200", challenges: ["Start one BBQ night with a chef speech nobody asked for.", "Create one playlist that does not get skipped in 2 minutes.", "Bring the party energy before everyone becomes furniture.", "Organize one villa night that gets named forever."] },
  { name: "Sohel", emoji: "🛵", role: "Activities CEO, booking machine & schedule detail hunter", vibe: "Sporty adventure fit", color: "bg-emerald-100 text-emerald-800 border-emerald-200", challenges: ["Book one activity without changing the time 3 times.", "Make everyone arrive 15 minutes early using pure pressure.", "Negotiate one group activity like he owns the company.", "Create a daily activity voice note under 45 seconds."] },
  { name: "Abdulrhman", emoji: "🎥", role: "Cameraman — Bali After-Dark Documentary Unit", vibe: "Clean white / always camera-ready", color: "bg-violet-100 text-violet-800 border-violet-200", challenges: ["Take one cinematic group shot every day before the squad collapses.", "Capture the before-and-after hangover transformation professionally.", "Make a trip recap video that looks expensive.", "No blurry photos allowed. Blurry memories are enough."] },
  { name: "Open Role", emoji: "🍽️", role: "Restaurants, coffee shops & emergency hunger management", vibe: "Food critic uniform", color: "bg-orange-100 text-orange-800 border-orange-200", challenges: ["Pick one dinner spot nobody complains about.", "Find coffee close enough that nobody says too far.", "Confirm no pork/ham before ordering like a responsible adult.", "Book at least one seafood dinner before last-day panic."] },
];

const flights = [
  { type: "Departure", route: "Riyadh (RUH) → Bali / Denpasar (DPS)", date: "10 May 2026", time: "22:00", number: "Captain will tell us eventually", note: "Abdullah is the official source of truth for flight numbers." },
  { type: "Arrival", route: "Bali / Denpasar (DPS)", date: "11 May 2026", time: "17:00", number: "Follow the tired faces", note: "Mission: survive immigration and find the villa before the squad turns into luggage." },
  { type: "Return", route: "Bali / Denpasar (DPS) → Riyadh (RUH)", date: "21 May 2026", time: "Maybe if we decide to come back", number: "Return plan under investigation", note: "Small chance we forget to return and accidentally become Bali locals." },
];

const seats = [
  ["Saud", "Wherever the budget allows", "Budget boss seat"],
  ["Abdullah", "Pilot assistant by confidence", "Leader seat"],
  ["Naif", "Next to opportunity", "Party energy seat"],
  ["Sohel", "Emergency activity desk", "Activities control seat"],
  ["Abdulrhman", "Window seat or no photos", "Camera access seat"],
];

const villaImages = [
  ["https://a0.muscache.com/im/pictures/miso/Hosting-594590040832411269/original/aee350cb-7e48-45bc-bfc2-d7e110fcb7d4.jpeg?im_w=1200", "Infinity pool & garden"],
  ["https://a0.muscache.com/im/pictures/887413dd-8e42-4a51-abaf-99c852c61f94.jpg?im_w=1200", "Living & dining area"],
  ["https://a0.muscache.com/im/pictures/miso/Hosting-594590040832411269/original/6397d293-8f39-4db6-8af2-94d1d0b4b170.jpeg?im_w=1200", "Villa upper floor view"],
  ["https://a0.muscache.com/im/pictures/miso/Hosting-594590040832411269/original/af03dc6a-7b31-420a-8f04-c5bf643cd0bc.jpeg?im_w=1200", "Outdoor shower vibe"],
];

const itinerary = [
  { date: "11 May", day: "Monday", title: "Touchdown + Villa Takeover", notes: "Arrival 5 PM. Find bags, find driver, find villa, pretend we are organized.", breakfast: "Plane breakfast — survival mode", lunch: "Airport or delivery", dinner: "Abunawas or villa delivery", entertainment: "Shopping + grocery raid", nightlife: "Soft launch only", ops: "Saud enters Carrefour like a CFO with trauma", transport: "Private driver from airport. No walking." },
  { date: "12 May", day: "Tuesday", title: "Villa Chill + Pool Committee", notes: "First proper day. No hero moves before breakfast.", breakfast: "Villa breakfast", lunch: "Nook Bali or Bali Timbungan", dinner: "Seasalt at Alila Seminyak", entertainment: "Pool, shopping, sunset drive", nightlife: "Code 02 rehearsal", ops: "Confirm activities before Sohel sends 14 voice notes", transport: "Hire driver. Scooter only for short coffee runs." },
  { date: "13 May", day: "Wednesday", title: "Shopping Day + Food Hunt", notes: "No breakfast planned because apparently we enjoy suffering.", breakfast: "Coffee counts", lunch: "Bali Timbungan", dinner: "Kenji Ramen", entertainment: "Shopping + cafés", nightlife: "Free night, dangerous sentence", ops: "Restaurant owner must act like a restaurant owner", transport: "Driver for shopping bags." },
  { date: "14 May", day: "Thursday", title: "ATV / Adventure + Code 02", notes: "Starts sporty and ends with questionable accounting.", breakfast: "Villa breakfast", lunch: "Near ATV area", dinner: "Seafood or villa BBQ", entertainment: "Kuber ATV or rafting", nightlife: "Code 02 activated", ops: "Sohel shares pickup time", transport: "Activity pickup or private driver." },
  { date: "15 May", day: "Friday", title: "Friday Prayer + Seafood + Water", notes: "والله بنصلي الجمعة — then seafood, then water activities.", breakfast: "Light coffee", lunch: "Kendi Kuning or Seasalt", dinner: "Villa dinner or Abunawas", entertainment: "Jet ski, parasailing, banana boat, diving", nightlife: "Recovery unless Code 02 attacks", ops: "Bring towels or become towel intern", transport: "Private driver to water sports." },
  { date: "16 May", day: "Saturday", title: "Code 02 — Full Send", notes: "Villa chaos, dancing, adult drinks, questionable decisions, and tomorrow's headache invoice.", breakfast: "Cute idea", lunch: "Delivery to villa", dinner: "Naif BBQ or Arabic food", entertainment: "Pool, music, villa games", nightlife: "Coconut Storm", ops: "Hide fragile items and protect the speaker", transport: "Stay home. Driver only for supply runs." },
  { date: "17 May", day: "Sunday", title: "Recovery or Repeat Court", notes: "The squad decides: recovery day or repeat the crime scene.", breakfast: "Coconut water and regret", lunch: "Nook Bali or delivery", dinner: "Kenji or seafood", entertainment: "Pool recovery, massage, light shopping", nightlife: "Code 02 Lite", ops: "Abdulrhman documents the damage", transport: "Driver if we leave. No scooters." },
  { date: "18 May", day: "Monday", title: "Hangover National Holiday", notes: "Official recovery day. No alarms. No judgement.", breakfast: "Skipped", lunch: "Soup rescue", dinner: "Abunawas comfort food", entertainment: "Massage, pool, Netflix, silence", nightlife: "Body may reject application", ops: "Inventory check: money, phones, dignity", transport: "Driver only." },
  { date: "19 May", day: "Tuesday", title: "Sea + Air Adventure", notes: "Scuba, snorkeling, parasailing, flyboard, and bragging rights.", breakfast: "Villa breakfast", lunch: "Water sports area", dinner: "Seasalt or Bali Timbungan", entertainment: "Scuba, parasailing, flyboard, jet ski", nightlife: "Beach club or villa chill", ops: "Sohel confirms waivers. Saud checks charges", transport: "Package pickup or private driver." },
  { date: "20 May", day: "Wednesday", title: "Final Full Day", notes: "Last proper night. Spend energy wisely. Nobody will.", breakfast: "Villa breakfast", lunch: "Nook Bali", dinner: "Final dinner: Seasalt or Abunawas", entertainment: "Shopping, beach club, photoshoot", nightlife: "Last Code 02", ops: "Pack before midnight or cry at 6 AM", transport: "Driver all day." },
  { date: "21 May", day: "Thursday", title: "Airport Day", notes: "Checkout + airport. Return flight exists in theory.", breakfast: "Airport breakfast", lunch: "Airport lunch", dinner: "Plane food lottery", entertainment: "Duty free + emotional damage", nightlife: "Season two if we miss the flight", ops: "Final payments, lost items, passport panic", transport: "Private driver to airport." },
];

const restaurants = [
  ["Abunawas Restaurant Bali", "Arabic / Middle Eastern", "Comfort food and halal-friendly backup.", "Safe choice"],
  ["Bali Timbungan", "Indonesian / Balinese", "Local food night. Confirm no pork or ham.", "Local food"],
  ["Kenji Ramen & Izakaya", "Japanese / Ramen", "Good late dinner vibe. Check broth and toppings.", "Late-night vibe"],
  ["Seasalt at Alila Seminyak", "Seafood / Beach view", "Final dinner candidate with ocean views.", "Seafood view"],
  ["Kendi Kuning", "Seafood / Indonesian", "Good fish lunch or easy dinner.", "Fish day"],
  ["Nook Bali", "Indonesian / Western", "Close and relaxed for lunch or coffee.", "Near villa"],
];

const activities = [
  { icon: "waves", title: "Water Sports", items: ["Jet ski", "Banana boat", "Parasailing", "Flyboard", "Kayaking"], book: "https://baliwatersports.com/", note: "Good all-in-one sea activities option." },
  { icon: "dive", title: "Scuba / Snorkeling", items: ["Beginner scuba", "Snorkeling", "Underwater photos", "Boat day"], book: "https://www.klook.com/destination/c8-bali/1-things-to-do/", note: "Compare operators and reviews on Klook." },
  { icon: "air", title: "Air Activities", items: ["Parasailing", "Paragliding", "Flyboard", "Scenic options"], book: "https://baliwatersports.com/", note: "Low walking. High drama." },
  { icon: "car", title: "ATV / Rafting", items: ["Kuber ATV", "Telaga Waja rafting", "Quad bike", "Mud photos"], book: "https://www.ubudcenter.com/kuber-atv-quad-rafting/", note: "For adventure photo evidence." },
  { icon: "party", title: "Beach Clubs", items: ["Finns", "Potato Head", "Atlas", "Villa after-party"], book: "https://finnsbeachclub.com/", note: "Book ahead for a group." },
  { icon: "bike", title: "Scooter Rental", items: ["Short café runs", "Nearby shopping", "Backup transport", "Confident riders only"], book: "https://www.bali4ride.com/", note: "No scooter missions after Code 02." },
  { icon: "car", title: "Private Driver", items: ["Airport transfer", "Shopping day", "Water sports", "No walking policy"], book: "https://www.balicab.com/", note: "Simple private car with driver booking." },
  { icon: "sparkles", title: "Fancy Car Mode", items: ["Luxury car", "Alphard style", "CEO arrival", "Beach club entrance"], book: "https://privatedriverbali.com/", note: "For sunglasses board-meeting arrival." },
];

const recommendationLinks = {
  "Jet ski": "https://baliwatersports.com/jet-ski/",
  "Banana boat": "https://baliwatersports.com/banana-boat/",
  "Parasailing": "https://baliwatersports.com/parasailing-adventure/",
  "Flyboard": "https://baliwatersports.com/fly-board/",
  "Kayaking": "https://baliwatersports.com/kayaking/",
  "Beginner scuba": "https://www.klook.com/en-US/activity/1598-scuba-diving-bali/",
  "Snorkeling": "https://www.klook.com/en-US/search/result/?query=bali%20snorkeling",
  "Underwater photos": "https://www.klook.com/en-US/search/result/?query=bali%20underwater%20photos",
  "Boat day": "https://www.klook.com/en-US/search/result/?query=bali%20boat%20trip",
  "Paragliding": "https://www.klook.com/en-US/search/result/?query=bali%20paragliding",
  "Scenic options": "https://www.klook.com/en-US/search/result/?query=bali%20helicopter%20tour",
  "Kuber ATV": "https://www.ubudcenter.com/kuber-atv-quad-rafting/",
  "Telaga Waja rafting": "https://www.ubudcenter.com/telaga-waja-rafting/",
  "Quad bike": "https://www.ubudcenter.com/kuber-atv-quad-rafting/",
  "Mud photos": "https://www.ubudcenter.com/kuber-atv-quad-rafting/",
  "Finns": "https://finnsbeachclub.com/",
  "Potato Head": "https://seminyak.potatohead.co/",
  "Atlas": "https://atlasbeachfest.com/",
  "Villa after-party": "https://www.airbnb.com/rooms/594590040832411269",
  "Short café runs": "https://www.bali4ride.com/",
  "Nearby shopping": "https://www.bali4ride.com/",
  "Backup transport": "https://www.bali4ride.com/",
  "Confident riders only": "https://www.bali4ride.com/",
  "Airport transfer": "https://www.balicab.com/",
  "Shopping day": "https://www.balicab.com/",
  "Water sports": "https://www.balicab.com/",
  "No walking policy": "https://www.balicab.com/",
  "Luxury car": "https://privatedriverbali.com/",
  "Alphard style": "https://privatedriverbali.com/",
  "CEO arrival": "https://privatedriverbali.com/",
  "Beach club entrance": "https://privatedriverbali.com/",
};

const restaurantLinks = {
  "Abunawas Restaurant Bali": "https://www.google.com/maps/search/?api=1&query=Abunawas%20Restaurant%20Bali",
  "Bali Timbungan": "https://www.google.com/maps/search/?api=1&query=Bali%20Timbungan",
  "Kenji Ramen & Izakaya": "https://www.google.com/maps/search/?api=1&query=Kenji%20Ramen%20Izakaya%20Bali",
  "Seasalt at Alila Seminyak": "https://www.google.com/maps/search/?api=1&query=Seasalt%20Alila%20Seminyak",
  "Kendi Kuning": "https://www.google.com/maps/search/?api=1&query=Kendi%20Kuning%20Bali",
  "Nook Bali": "https://www.google.com/maps/search/?api=1&query=Nook%20Bali%20Umalas",
};

const rules = ["No ham or pork food stops", "No temple visits", "No hiking", "No long walks", "No ritual-related activities", "No random 6 AM adventure plans"];

const initialBudgetItems = [
  { id: 1, item: "Flights", total: 14000, paid: 14000, status: "Paid" },
  { id: 2, item: "Accommodation / Villa", total: 15333, paid: 15333, status: "Paid" },
  { id: 3, item: "Logistics", total: 550, paid: 0, status: "Not paid" },
  { id: 4, item: "F&B", total: 3850, paid: 0, status: "Not paid" },
  { id: 5, item: "Entertainment", total: 4000, paid: 0, status: "Not paid" },
  { id: 6, item: "Private Nightlife Extras", total: 7500, paid: 0, status: "Optional" },
  { id: 7, item: "Suspicious Coconut Water", total: 0, paid: 0, status: "TBD" },
];

function I({ name, className = "" }) { return <span className={`inline-flex items-center justify-center ${className}`}>{icon[name] || "•"}</span>; }
function currency(value, lang = "en") {
  if (value === null || value === undefined || Number.isNaN(Number(value))) return lang === "ar" ? "غير محدد" : "TBD";
  const locale = lang === "ar" ? "ar-SA" : "en-SA";
  const suffix = lang === "ar" ? "ر.س" : "SAR";
  return `${new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }).format(Number(value))} ${suffix}`;
}
function calculateTotals(items) {
  const confirmed = items.filter((x) => x.status !== "Optional" && x.status !== "TBD").reduce((s, x) => s + Number(x.total || 0), 0);
  const paid = items.reduce((s, x) => s + Number(x.paid || 0), 0);
  const optional = items.filter((x) => x.status === "Optional" || x.status === "TBD").reduce((s, x) => s + Number(x.total || 0), 0);
  return { confirmed, paid, optional, remaining: Math.max(confirmed - paid, 0), grandTotal: confirmed + optional };
}
function markBudgetRowPaid(rows, id) { return rows.map((row) => (row.id === id ? { ...row, paid: Number(row.total || 0), status: "Paid" } : row)); }
function getCountdownParts(targetDate) {
  const diff = new Date(targetDate).getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, landed: true };
  return { days: Math.floor(diff / 86400000), hours: Math.floor((diff / 3600000) % 24), minutes: Math.floor((diff / 60000) % 60), seconds: Math.floor((diff / 1000) % 60), landed: false };
}
function weatherEmoji(code) { if (code === 0) return "☀️"; if ([1, 2, 3].includes(code)) return "⛅"; if ([45, 48].includes(code)) return "🌫️"; if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code)) return "🌧️"; if ([95, 96, 99].includes(code)) return "⛈️"; return "🌤️"; }
function weatherText(code) { if (code === 0) return "Clear. Sunscreen tax applies."; if ([1, 2, 3].includes(code)) return "Partly cloudy. Perfect for acting productive."; if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code)) return "Rainy. Pool still counts."; if ([95, 96, 99].includes(code)) return "Thunder vibes. Villa mode recommended."; return "Bali weather doing Bali things."; }

function useCountdown() {
  const [countdown, setCountdown] = useState(() => getCountdownParts(FLIGHT_TARGET));
  useEffect(() => { const timer = setInterval(() => setCountdown(getCountdownParts(FLIGHT_TARGET)), 1000); return () => clearInterval(timer); }, []);
  return countdown;
}

function useWeather() {
  const fallback = [
    { date: "Today", max: 30, min: 25, rain: 40, emoji: "🌴", text: "Hot, humid, and ready for bad decisions." },
    { date: "Tomorrow", max: 30, min: 25, rain: 45, emoji: "🌦️", text: "Pool first. Weather later." },
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
          return { date, max: Math.round(data.daily.temperature_2m_max?.[i] || 0), min: Math.round(data.daily.temperature_2m_min?.[i] || 0), rain: data.daily.precipitation_probability_max?.[i] || 0, emoji: weatherEmoji(code), text: weatherText(code) };
        });
        if (!cancelled) setState({ loading: false, error: "", days });
      } catch {
        if (!cancelled) setState({ loading: false, error: "Live weather is taking a nap. Showing Bali-mode fallback.", days: fallback });
      }
    }
    load();
    const interval = setInterval(load, 21600000);
    return () => { cancelled = true; clearInterval(interval); };
  }, []);
  return state;
}

function runSelfTests() {
  const totals = calculateTotals(initialBudgetItems);
  console.assert(totals.confirmed === 37733, `Expected confirmed budget 37733, got ${totals.confirmed}`);
  console.assert(totals.paid === 29333, `Expected paid budget 29333, got ${totals.paid}`);
  console.assert(totals.remaining === 8400, `Expected remaining budget 8400, got ${totals.remaining}`);
  console.assert(currency(null) === "TBD", "Expected null currency value to show TBD");
  console.assert(currency(null, "ar") === "غير محدد", "Expected null Arabic currency value to show غير محدد");
  console.assert(tr("Budget", "ar") === "الميزانية", "Arabic translation should work");
  console.assert(navItems.length === 8, `Expected 8 navigation items, got ${navItems.length}`);
  console.assert(itinerary.length === 11, `Expected 11 itinerary days, got ${itinerary.length}`);
  console.assert(members.every((m) => m.challenges.length >= 4), "Each member should have at least 4 challenges");
  console.assert(activities.length >= 8, `Expected at least 8 activity cards, got ${activities.length}`);
  console.assert(getCountdownParts("2000-01-01T00:00:00+00:00").landed === true, "Past countdown should be landed");
  console.assert(weatherEmoji(95) === "⛈️", "Thunder weather code should map to thunder emoji");
  console.assert(Boolean(recommendationLinks["Jet ski"]), "Jet ski should have a direct recommendation link");
  console.assert(Boolean(restaurantLinks["Kenji Ramen & Izakaya"]), "Restaurant recommendations should have direct links");
  const markedRows = markBudgetRowPaid(initialBudgetItems, 3);
  console.assert(markedRows.find((row) => row.id === 3).paid === 550, "Mark paid should set paid amount equal to total");
}
if (typeof window !== "undefined") runSelfTests();

function Section({ id, eyebrow, title, icon, children }) {
  const lang = useLang();
  return (
    <section id={id} className="scroll-mt-24 py-12">
      <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-7">
        <div className="mb-2 flex items-center gap-2 text-sm font-bold uppercase tracking-[0.2em] text-sky-700"><I name={icon} />{tr(eyebrow, lang)}</div>
        <h2 className="text-3xl font-black text-slate-950 md:text-5xl">{tr(title, lang)}</h2>
      </motion.div>
      {children}
    </section>
  );
}
function Card({ children, className = "" }) { return <div className={`rounded-3xl border border-slate-200 bg-white p-5 shadow-sm ${className}`}>{children}</div>; }
function Stat({ icon, label, value, sub }) {
  const lang = useLang();
  return <Card><div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-xl text-white"><I name={icon} /></div><div className="text-sm font-semibold text-slate-500">{tr(label, lang)}</div><div className="mt-1 text-2xl font-black text-slate-950">{tr(value, lang)}</div>{sub ? <div className="mt-1 text-sm text-slate-500">{tr(sub, lang)}</div> : null}</Card>;
}
function Info({ label, value }) { const lang = useLang(); return <div className="rounded-2xl bg-slate-50 p-4"><div className="text-xs font-bold uppercase text-slate-400">{tr(label, lang)}</div><div className="mt-1 font-black">{tr(value, lang)}</div></div>; }
function Detail({ icon, label, value }) { const lang = useLang(); return <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5">{icon ? <I name={icon} className="mb-3 text-xl" /> : null}<div className="text-sm font-bold text-slate-500">{tr(label, lang)}</div><div className="text-lg font-black">{tr(value, lang)}</div></div>; }
function Row({ label, value }) { const lang = useLang(); return <div className="flex justify-between gap-4"><span className="font-semibold text-slate-500">{tr(label, lang)}</span><span className="font-black">{tr(value, lang)}</span></div>; }

function CountdownDisplay({ countdown }) {
  const lang = useLang();
  const text = countdown.landed ? tr("Bali mode is live", lang) : `${String(countdown.days).padStart(2, "0")}d : ${String(countdown.hours).padStart(2, "0")}h : ${String(countdown.minutes).padStart(2, "0")}m : ${String(countdown.seconds).padStart(2, "0")}s`;
  return <div className="mt-7 rounded-[2rem] border border-slate-200 bg-white p-5 text-center text-black shadow-2xl sm:p-7 lg:p-8"><div className="text-xs font-black uppercase tracking-[0.22em] text-black">{tr("Time left until takeoff", lang)}</div><div className="mt-3 whitespace-nowrap text-4xl font-black leading-none tracking-tight text-black sm:text-5xl lg:text-7xl">{text}</div><div className="mt-4 rounded-2xl bg-slate-100 px-4 py-3 text-sm font-black text-black">{tr("Flight launch: 10 May 2026 · 22:00 Riyadh time", lang)}</div></div>;
}

function WeatherCard({ day }) {
  const lang = useLang();
  const label = day.date === "Today" || day.date === "Tomorrow" ? tr(day.date, lang) : new Date(day.date).toLocaleDateString(lang === "ar" ? "ar-SA" : "en-US", { weekday: "short", month: "short", day: "numeric" });
  return <Card className="min-w-[190px]"><div className="flex items-center justify-between"><div><div className="text-sm font-black">{label}</div><div className="text-xs font-bold text-slate-500">{tr("Bali forecast", lang)}</div></div><div className="text-3xl">{day.emoji}</div></div><div className="mt-4 text-2xl font-black">{day.max}° / {day.min}°</div><div className="text-sm font-bold text-sky-700">{tr("Rain chance:", lang)} {day.rain}%</div><p className="mt-3 text-sm leading-6 text-slate-600">{tr(day.text, lang)}</p></Card>;
}

function NumberInput({ value, onChange }) {
  return <input type="number" min="0" value={value} onChange={(e) => onChange(Number(e.target.value || 0))} className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm font-black outline-none focus:border-sky-400 focus:ring-4 focus:ring-sky-100" />;
}

function ActivityCard({ activity }) {
  const lang = useLang();
  return <Card><div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-50 text-xl text-sky-700"><I name={activity.icon} /></div><h3 className="text-xl font-black">{tr(activity.title, lang)}</h3><ul className="mt-4 space-y-2">{activity.items.map((item) => { const link = recommendationLinks[item] || activity.book; return <li key={item} className="flex gap-2 text-sm leading-6 text-slate-600"><I name="check" /><a href={link} target="_blank" rel="noreferrer" className="font-bold text-slate-700 underline decoration-slate-300 underline-offset-4 transition hover:text-sky-700 hover:decoration-sky-400">{tr(item, lang)}</a></li>; })}</ul><p className="mt-4 text-sm leading-6 text-slate-500">{tr(activity.note, lang)}</p><a href={activity.book} target="_blank" rel="noreferrer" className="mt-5 inline-flex rounded-full bg-slate-950 px-4 py-2 text-sm font-black text-white">{tr("Book / Compare Main", lang)}</a></Card>;
}

function MemberCard({ member }) {
  const lang = useLang();
  return <motion.div whileHover={{ y: -6 }}><Card><div className={`mb-5 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm font-black ${member.color}`}><span>{member.emoji}</span>{tr(member.name, lang)}</div><h3 className="text-xl font-black">{tr(member.role, lang)}</h3><Info label="Main style" value={member.vibe} /><div className="mt-5 text-sm font-black uppercase tracking-[0.16em] text-slate-500"><I name="trophy" /> {tr("Challenges", lang)}</div><ul className="mt-3 space-y-3">{member.challenges.map((challenge) => <li key={challenge} className="rounded-2xl border border-slate-100 p-3 text-sm font-bold leading-6 text-slate-700">{tr(challenge, lang)}</li>)}</ul></Card></motion.div>;
}

function BudgetRow({ row, index, pax, onChange, onPaid }) {
  const lang = useLang();
  const balance = Math.max(Number(row.total || 0) - Number(row.paid || 0), 0);
  const isPaid = Number(row.paid || 0) >= Number(row.total || 0) && Number(row.total || 0) > 0;
  return <div className={`grid grid-cols-[1.4fr_1fr_1fr_1fr_1fr_1.05fr] items-center gap-3 px-4 py-3 text-sm ${index % 2 ? "bg-slate-50" : "bg-white"}`}><input value={tr(row.item, lang)} onChange={(e) => onChange(row.id, "item", e.target.value)} className="rounded-2xl border border-slate-200 bg-white px-3 py-2 font-black outline-none" /><NumberInput value={row.total} onChange={(value) => onChange(row.id, "total", value)} /><NumberInput value={row.paid} onChange={(value) => onChange(row.id, "paid", value)} /><div className="rounded-2xl bg-slate-100 px-3 py-2 font-black">{currency(balance, lang)}</div><div className="rounded-2xl bg-slate-100 px-3 py-2 font-black">{currency(Number(row.total || 0) / pax, lang)}</div><button type="button" onClick={() => onPaid(row.id)} className={`rounded-full px-3 py-2 text-xs font-black text-white transition hover:-translate-y-0.5 ${isPaid ? "bg-slate-500" : "bg-emerald-600 hover:bg-emerald-700"}`}>{isPaid ? tr("Paid ✓", lang) : tr("Mark paid", lang)}</button></div>;
}

export default function BaliTripWebsite() {
  const [lang, setLang] = useState(() => {
    if (typeof window === "undefined") return "en";
    return window.localStorage.getItem("bali-squad-lang") || "en";
  });
  const [activeDay, setActiveDay] = useState(itinerary[0]);
  const [budgetRows, setBudgetRows] = useState(() => {
    if (typeof window === "undefined") return initialBudgetItems;
    try { const saved = window.localStorage.getItem("bali-squad-budget"); return saved ? JSON.parse(saved) : initialBudgetItems; } catch { return initialBudgetItems; }
  });
  const countdown = useCountdown();
  const weather = useWeather();
  const totals = useMemo(() => calculateTotals(budgetRows), [budgetRows]);
  const pax = 5;

  useEffect(() => {
    try { window.localStorage.setItem("bali-squad-lang", lang); } catch { /* Ignore storage errors. */ }
  }, [lang]);

  useEffect(() => {
    try { window.localStorage.setItem("bali-squad-budget", JSON.stringify(budgetRows)); } catch { /* Ignore storage errors. */ }
  }, [budgetRows]);

  const updateBudgetRow = (id, key, value) => setBudgetRows((rows) => rows.map((row) => (row.id === id ? { ...row, [key]: value } : row)));
  const markPaid = (id) => setBudgetRows((rows) => markBudgetRowPaid(rows, id));
  const resetBudget = () => { setBudgetRows(initialBudgetItems); try { window.localStorage.removeItem("bali-squad-budget"); } catch { /* Ignore storage errors. */ } };

  return (
    <LanguageContext.Provider value={lang}>
      <div dir={lang === "ar" ? "rtl" : "ltr"} lang={lang} className="min-h-screen bg-[radial-gradient(circle_at_top_left,_#dff7ff,_transparent_32%),linear-gradient(180deg,_#f8fafc,_#ecfeff_42%,_#fff7ed)] text-slate-900">
      <nav className="sticky top-0 z-50 border-b border-white/60 bg-white/75 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-6">
          <a href="#home" className="flex items-center gap-3"><div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-xl text-white"><I name="palm" /></div><div><div className="font-black">{tr("Bali Squad", lang)}</div><div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{tr("May 2026", lang)}</div></div></a>
          <div className="hidden items-center gap-1 rounded-full border border-slate-200 bg-white/80 p-1 shadow-sm xl:flex">{navItems.map(([id, label]) => <a key={id} href={`#${id}`} className="whitespace-nowrap rounded-full px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-950 hover:text-white">{tr(label, lang)}</a>)}</div>
          <div className="flex items-center gap-2"><button type="button" onClick={() => setLang((current) => (current === "en" ? "ar" : "en"))} className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-black text-slate-900">{lang === "en" ? "العربية" : "English"}</button><a href="#hype" className="rounded-full bg-slate-950 px-4 py-2 text-sm font-black text-white">{tr("Launch Mode", lang)}</a></div>
        </div>
        <div className="flex gap-2 overflow-x-auto border-t border-slate-100 px-4 py-2 xl:hidden">{navItems.map(([id, label]) => <a key={id} href={`#${id}`} className="whitespace-nowrap rounded-full bg-white px-3 py-2 text-xs font-bold text-slate-700 shadow-sm">{tr(label, lang)}</a>)}</div>
      </nav>

      <main className="mx-auto max-w-7xl px-4 md:px-6">
        <section id="home" className="grid min-h-[82vh] scroll-mt-24 items-center gap-8 py-12 lg:grid-cols-[1.1fr_0.9fr]">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-sky-200 bg-white/80 px-4 py-2 text-sm font-bold text-sky-800"><I name="sparkles" />{tr("5 members · 10 nights · Umalas, Bali · Code 02 enabled", lang)}</div>
            <h1 className="text-5xl font-black leading-[0.95] tracking-tight text-slate-950 md:text-7xl">{tr("Bali Squad Trip Control Center", lang)}</h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">{tr("Flights, villa takeover, weather checks, daily chaos planning, transport, activities, member challenges, and budget damage control.", lang)}</p>
            <div className="mt-8 flex flex-wrap gap-3"><a href="#hype" className="rounded-full bg-sky-600 px-6 py-3 text-sm font-black text-white">{tr("Start the Hype", lang)}</a><a href="#budget" className="rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-black text-slate-900">{tr("Open Budget Sheet", lang)}</a></div>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"><Stat icon="plane" label="Departure" value="10 May" sub="22:00 from Riyadh" /><Stat icon="home" label="Villa" value="Villa Gima 1" sub="Capacity: depends who comes back" /><Stat icon="users" label="Members" value="5 Pax" sub="Main cast only" /><Stat icon="wallet" label="Known Budget" value={currency(totals.confirmed, lang)} sub="editable below" /></div>
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="relative"><div className="absolute -inset-4 rounded-[2.5rem] bg-sky-200/40 blur-3xl" /><div className="relative overflow-hidden rounded-[2.5rem] border border-white bg-white shadow-2xl"><img src={villaImages[0][0]} alt="Villa pool" className="h-[520px] w-full object-cover" /><div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent p-7 text-white"><div className="mb-2 text-sm font-bold uppercase tracking-[0.2em] text-sky-200">{tr("Base Camp", lang)}</div><div className="text-3xl font-black">{tr("Villa Gima 1", lang)}</div><div className="mt-2 text-sm text-slate-200">{tr("Umalas · May 11–21 · pool, garden, privacy, and questionable squad decisions", lang)}</div></div></div></motion.div>
        </section>

        <Section id="hype" eyebrow="Countdown + Weather" title="Squad Hype Dashboard" icon="fire">
          <Card className="bg-white p-6 text-black sm:p-8 lg:p-10">
            <div className="mb-3 inline-flex rounded-full bg-slate-100 px-4 py-2 text-sm font-black text-black">{tr("Flight countdown to chaos", lang)}</div>
            <h3 className="text-4xl font-black text-black lg:text-6xl">{countdown.landed ? tr("Bali Mode Activated", lang) : tr("Wheels up soon", lang)}</h3>
            <p className="mt-4 max-w-3xl text-lg leading-8 text-black">{tr("Riyadh departure: 10 May 2026 at 22:00. Pack properly or panic-buy sunglasses.", lang)}</p>
            <CountdownDisplay countdown={countdown} />
            <div className="mt-8 rounded-[2rem] border border-slate-200 bg-slate-50 p-5 text-black sm:p-6"><div className="flex items-start justify-between gap-4"><div><div className="text-sm font-black uppercase tracking-[0.2em] text-black">{tr("Live Bali Weather", lang)}</div><h3 className="mt-1 text-3xl font-black text-black">{tr("Daily auto-update", lang)}</h3></div><div className="text-4xl"><I name="weather" /></div></div>{weather.error ? <div className="mt-4 rounded-2xl bg-white p-3 text-sm font-bold text-black">{tr(weather.error, lang)}</div> : null}{weather.loading ? <div className="mt-4 rounded-3xl bg-white p-6 text-sm font-bold text-black">{tr("Loading Bali weather...", lang)}</div> : <div className="mt-5 flex gap-4 overflow-x-auto pb-2">{weather.days.map((day) => <WeatherCard key={day.date} day={day} />)}</div>}</div>
            <div className="mt-5 rounded-3xl border border-slate-200 bg-slate-100 p-4 text-sm leading-6 text-black"><b className="text-black">{tr("Code 02 Dictionary:", lang)}</b> {tr("adult-only after-dark villa mode: music, dancing, suspicious coconut water, late-night confidence, and next-day recovery operations.", lang)}</div>
          </Card>
        </Section>

        <Section id="trip" eyebrow="Flights" title="Trip Details" icon="plane">
          <div className="grid gap-5 lg:grid-cols-3">{flights.map((flight) => <Card key={flight.type}><div className="mb-4 flex items-center justify-between"><span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-black uppercase tracking-[0.16em] text-sky-700">{flight.type}</span><I name="plane" /></div><h3 className="text-xl font-black">{flight.route}</h3><div className="mt-5 space-y-3 text-sm"><Row label="Date" value={flight.date} /><Row label="Time" value={flight.time} /><Row label="Flight No." value={flight.number} /><p className="pt-2 leading-6 text-slate-500">{flight.note}</p></div></Card>)}</div>
          <Card className="mt-6"><div className="mb-5 flex items-center gap-2"><I name="bed" /><h3 className="text-xl font-black">Seat Assignment</h3></div><div className="grid gap-3 md:grid-cols-5">{seats.map(([member, seat, note]) => <div key={member} className="rounded-2xl bg-slate-50 p-4"><div className="text-sm font-semibold text-slate-500">{member}</div><div className="mt-1 text-xl font-black">{seat}</div><div className="text-xs text-slate-500">{note}</div></div>)}</div></Card>
        </Section>

        <Section id="accommodation" eyebrow="Villa" title="Accommodation" icon="home">
          <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]"><Card><div className="mb-4 inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-black uppercase tracking-[0.16em] text-emerald-700">Airbnb Villa</div><h3 className="text-3xl font-black">Villa Gima 1 - 5 bedrooms</h3><p className="mt-4 leading-7 text-slate-600">Entire villa in Umalas with pool, garden, kitchen, wifi, workspace, parking, and concierge-on-demand support.</p><div className="mt-6 grid gap-3 sm:grid-cols-2"><Info label="Check-in" value="Host said vibes first, timing second" /><Info label="Check-out" value="When they force us to leave" /><Info label="Stay period" value="11–21 May 2026" /><Info label="Capacity" value="Officially 10. Unofficially depends who comes back with the squad." /></div><div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900"><b><I name="alert" /> Note:</b> Confirm final check-in and check-out timing with the host.</div></Card><div className="grid gap-4 sm:grid-cols-2">{villaImages.map(([src, title]) => <Card key={title} className="overflow-hidden p-0"><img src={src} alt={title} className="h-56 w-full object-cover" /><div className="p-4 text-sm font-black">{title}</div></Card>)}</div></div>
        </Section>

        <Section id="itinerary" eyebrow="Schedule" title="Daily Itinerary" icon="calendar">
          <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]"><Card><div className="grid gap-2">{itinerary.map((day) => <button key={day.date} onClick={() => setActiveDay(day)} className={`rounded-2xl p-4 text-left transition ${activeDay.date === day.date ? "bg-slate-950 text-white" : "bg-slate-50 text-slate-700 hover:bg-sky-50"}`}><div className="flex items-center justify-between gap-3"><div><div className="text-xs font-black uppercase tracking-[0.16em] opacity-70">{tr(day.day, lang)}</div><div className="mt-1 text-lg font-black">{tr(day.date, lang)}</div></div><div className="text-right text-sm font-bold opacity-80">{tr(day.title, lang)}</div></div></button>)}</div></Card><Card><div className="mb-2 text-sm font-black uppercase tracking-[0.2em] text-sky-700">{tr(activeDay.day, lang)} · {tr(activeDay.date, lang)}</div><h3 className="text-4xl font-black">{tr(activeDay.title, lang)}</h3><p className="mt-3 leading-7 text-slate-600">{tr(activeDay.notes, lang)}</p><div className="mt-8 grid gap-4 sm:grid-cols-2"><Detail icon="chef" label="Breakfast" value={activeDay.breakfast} /><Detail icon="food" label="Lunch" value={activeDay.lunch} /><Detail icon="food" label="Dinner" value={activeDay.dinner} /><Detail icon="music" label="Entertainment" value={activeDay.entertainment} /></div><div className="mt-4 grid gap-4 sm:grid-cols-3"><Detail label="Night Mode" value={activeDay.nightlife} /><Detail label="Operations" value={activeDay.ops} /><Detail label="Transport" value={activeDay.transport} /></div></Card></div>
        </Section>

        <Section id="things" eyebrow="Recommendations" title="Things To Do" icon="map">
          <Card className="mb-6 bg-emerald-50"><div className="mb-3 font-black text-emerald-900"><I name="shield" /> {tr("Trip Rules", lang)}</div><div className="flex flex-wrap gap-2">{rules.map((rule) => <span key={rule} className="rounded-full border border-emerald-200 bg-white px-3 py-2 text-sm font-bold text-emerald-800">{tr(rule, lang)}</span>)}</div></Card>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">{activities.map((activity) => <ActivityCard key={activity.title} activity={activity} />)}</div>
          <Card className="mt-8"><div className="mb-5 flex items-center gap-2"><I name="food" /><h3 className="text-2xl font-black">{tr("Restaurant & Coffee Shortlist", lang)}</h3></div><div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">{restaurants.map(([name, type, why, badge]) => <a key={name} href={restaurantLinks[name]} target="_blank" rel="noreferrer" className="block rounded-2xl bg-slate-50 p-5 transition hover:-translate-y-1 hover:bg-sky-50"><div className="mb-3 inline-flex rounded-full bg-white px-3 py-1 text-xs font-black text-sky-700">{tr(badge, lang)}</div><h4 className="text-lg font-black text-slate-950 underline decoration-slate-300 underline-offset-4">{tr(name, lang)}</h4><div className="mt-1 text-sm font-bold text-slate-500">{tr(type, lang)}</div><p className="mt-3 text-sm leading-6 text-slate-600">{tr(why, lang)}</p><div className="mt-4 text-xs font-black uppercase tracking-[0.16em] text-sky-700">{tr("Open location", lang)}</div></a>)}</div></Card>
        </Section>

        <Section id="members" eyebrow="Squad" title="Trip Members" icon="users"><div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">{members.map((member) => <MemberCard key={member.name} member={member} />)}</div></Section>

        <Section id="budget" eyebrow="Money" title="Editable Budget Sheet" icon="wallet">
          <div className="grid gap-5 lg:grid-cols-4"><Stat icon="wallet" label="Known confirmed budget" value={currency(totals.confirmed, lang)} sub="excludes optional/TBD rows" /><Stat icon="check" label="Paid so far" value={currency(totals.paid, lang)} sub="updates from table" /><Stat icon="alert" label="Remaining known" value={currency(totals.remaining, lang)} sub="confirmed minus paid" /><Stat icon="formula" label="Known cost / person" value={currency(totals.confirmed / pax, lang)} sub="based on 5 pax" /></div>
          <Card className="mt-6"><div className="mb-4 flex flex-col justify-between gap-3 md:flex-row md:items-center"><div><h3 className="text-2xl font-black">{tr("Live trip calculator", lang)}</h3><p className="text-sm font-semibold text-slate-500">{tr("Change total or paid amounts. It updates automatically and saves in this browser.", lang)}</p></div><div className="flex flex-wrap gap-2"><div className="rounded-2xl bg-slate-950 px-4 py-3 text-sm font-black text-white">{tr("Balance = Total - Paid", lang)}</div><button onClick={resetBudget} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-black text-slate-700">{tr("Reset sheet", lang)}</button></div></div><div className="overflow-x-auto"><div className="min-w-[900px] overflow-hidden rounded-2xl border border-slate-200"><div className="grid grid-cols-[1.4fr_1fr_1fr_1fr_1fr_1.05fr] bg-slate-950 px-4 py-3 text-sm font-black text-white"><div>{tr("Item", lang)}</div><div>{tr("Total", lang)}</div><div>{tr("Paid", lang)}</div><div>{tr("Balance", lang)}</div><div>{tr("Per Person", lang)}</div><div>{tr("Action", lang)}</div></div>{budgetRows.map((row, index) => <BudgetRow key={row.id} row={row} index={index} pax={pax} onChange={updateBudgetRow} onPaid={markPaid} />)}</div></div><div className="mt-5 grid gap-4 md:grid-cols-3"><Info label="Grand total incl. optional" value={currency(totals.grandTotal, lang)} /><Info label="Remaining / person" value={currency(totals.remaining / pax, lang)} /><Info label="Suspicious Coconut Water" value="TBD because nobody tells the truth before the trip." /></div></Card>
        </Section>
      </main>

      <footer className="mt-10 border-t border-slate-200 bg-white/80 py-10 text-center text-sm font-semibold text-slate-500">
        {tr("Bali Squad Trip Website · Weather updates live · Budget is editable · Code 02 remains classified.", lang)}
      </footer>
      </div>
    </LanguageContext.Provider>
  );
}