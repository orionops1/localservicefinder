import { Province, District, Locality, ServiceCategory, ProviderDetailView } from "@/types/database";

export const PROVINCES: Province[] = [
  { id: 1, slug: "western", name_en: "Western Province", name_si: "බස්නාහිර පළාත", name_ta: "மேல் மாகாணம்" },
  { id: 2, slug: "central", name_en: "Central Province", name_si: "මධ්‍යම පළාත", name_ta: "மத்திய மாகாணம்" },
  { id: 3, slug: "southern", name_en: "Southern Province", name_si: "දකුණු පළාත", name_ta: "தென் மாகாணம்" },
  { id: 4, slug: "northern", name_en: "Northern Province", name_si: "උතුරු පළාත", name_ta: "வட மாகாணம்" },
  { id: 5, slug: "eastern", name_en: "Eastern Province", name_si: "නැගෙනහිර පළාත", name_ta: "கிழக்கு மாகாணம்" },
  { id: 6, slug: "north-western", name_en: "North Western Province", name_si: "වයඹ පළාත", name_ta: "வடமேல் மாகாணம்" },
  { id: 7, slug: "north-central", name_en: "North Central Province", name_si: "උතුරු මැද පළාත", name_ta: "வடமத்திய மாகாணம்" },
  { id: 8, slug: "uva", name_en: "Uva Province", name_si: "ඌව පළාත", name_ta: "ஊவா மாகாணம்" },
  { id: 9, slug: "sabaragamuwa", name_en: "Sabaragamuwa Province", name_si: "සබරගමුව පළාත", name_ta: "சப்ரகமுவ மாகாணம்" },
];

export const DISTRICTS: District[] = [
  // Western
  { id: 1, province_id: 1, slug: "colombo", name_en: "Colombo", name_si: "කොළඹ", name_ta: "கொழும்பு" },
  { id: 2, province_id: 1, slug: "gampaha", name_en: "Gampaha", name_si: "ගම්පහ", name_ta: "கம்பஹா" },
  { id: 3, province_id: 1, slug: "kalutara", name_en: "Kalutara", name_si: "කළුතර", name_ta: "களுத்துறை" },
  // Central
  { id: 4, province_id: 2, slug: "kandy", name_en: "Kandy", name_si: "මහනුවර", name_ta: "கண்டி" },
  { id: 5, province_id: 2, slug: "matale", name_en: "Matale", name_si: "මාතලේ", name_ta: "மாத்தளை" },
  { id: 6, province_id: 2, slug: "nuwara-eliya", name_en: "Nuwara Eliya", name_si: "නුවරඑළිය", name_ta: "நுவரெலியா" },
  // Southern
  { id: 7, province_id: 3, slug: "galle", name_en: "Galle", name_si: "ගාල්ල", name_ta: "காலி" },
  { id: 8, province_id: 3, slug: "matara", name_en: "Matara", name_si: "මාතර", name_ta: "மாத்தறை" },
  { id: 9, province_id: 3, slug: "hambantota", name_en: "Hambantota", name_si: "හම්බන්තොට", name_ta: "அம்பாந்தோட்டை" },
  // Northern
  { id: 10, province_id: 4, slug: "jaffna", name_en: "Jaffna", name_si: "යාපනය", name_ta: "யாழ்ப்பாணம்" },
  { id: 11, province_id: 4, slug: "kilinochchi", name_en: "Kilinochchi", name_si: "කිලිනොච්චිය", name_ta: "கிளிநொச்சி" },
  { id: 12, province_id: 4, slug: "mannar", name_en: "Mannar", name_si: "මන්නාරම", name_ta: "மன்னார்" },
  { id: 13, province_id: 4, slug: "vavuniya", name_en: "Vavuniya", name_si: "වවුනියාව", name_ta: "வவுனியா" },
  { id: 14, province_id: 4, slug: "mullaitivu", name_en: "Mullaitivu", name_si: "මුලතිව්", name_ta: "முல்லைத்தீவு" },
  // Eastern
  { id: 15, province_id: 5, slug: "batticaloa", name_en: "Batticaloa", name_si: "මඩකලපුව", name_ta: "மட்டக்களப்பு" },
  { id: 16, province_id: 5, slug: "ampara", name_en: "Ampara", name_si: "අම්පාර", name_ta: "அம்பாறை" },
  { id: 17, province_id: 5, slug: "trincomalee", name_en: "Trincomalee", name_si: "ත්රිකුණාමලය", name_ta: "திருகோணமலை" },
  // North Western
  { id: 18, province_id: 6, slug: "kurunegala", name_en: "Kurunegala", name_si: "කුරුණෑගල", name_ta: "குருநாகல்" },
  { id: 19, province_id: 6, slug: "puttalam", name_en: "Puttalam", name_si: "පුත්තලම", name_ta: "புத்தளம்" },
  // North Central
  { id: 20, province_id: 7, slug: "anuradhapura", name_en: "Anuradhapura", name_si: "අනුරාධපුරය", name_ta: "அனுராதபுரம்" },
  { id: 21, province_id: 7, slug: "polonnaruwa", name_en: "Polonnaruwa", name_si: "පොළොන්නරුව", name_ta: "பொலன்னறுவை" },
  // Uva
  { id: 22, province_id: 8, slug: "badulla", name_en: "Badulla", name_si: "බදුල්ල", name_ta: "பதுளை" },
  { id: 23, province_id: 8, slug: "monaragala", name_en: "Monaragala", name_si: "මොණරාගල", name_ta: "மொணராகலை" },
  // Sabaragamuwa
  { id: 24, province_id: 9, slug: "ratnapura", name_en: "Ratnapura", name_si: "රත්නපුර", name_ta: "இரத்தினபுரி" },
  { id: 25, province_id: 9, slug: "kegalle", name_en: "Kegalle", name_si: "කෑගල්ල", name_ta: "கேகாலை" },
];

export const LOCALITIES: Locality[] = [
  // 1. Colombo
  { id: "loc-col-1", district_id: 1, slug: "kollupitiya", name_en: "Kollupitiya (Colombo 03)", name_si: "කොල්ලුපිටිය", name_ta: "கொள்ளுப்பிட்டி", lat: 6.9038, lng: 79.8510 },
  { id: "loc-col-2", district_id: 1, slug: "dehiwala", name_en: "Dehiwala", name_si: "දෙහිවල", name_ta: "தெஹிவளை", lat: 6.8510, lng: 79.8660 },
  { id: "loc-col-3", district_id: 1, slug: "moratuwa", name_en: "Moratuwa", name_si: "මොරටුව", name_ta: "மொறட்டுவ", lat: 6.7730, lng: 79.8829 },
  { id: "loc-col-4", district_id: 1, slug: "nugegoda", name_en: "Nugegoda", name_si: "නුගේගොඩ", name_ta: "நுகேகொட", lat: 6.8722, lng: 79.8997 },
  { id: "loc-col-5", district_id: 1, slug: "rajagiriya", name_en: "Rajagiriya", name_si: "රාජගිරිය", name_ta: "இராஜகிரிய", lat: 6.9092, lng: 79.8967 },
  { id: "loc-col-6", district_id: 1, slug: "maharagama", name_en: "Maharagama", name_si: "මහරගම", name_ta: "மகரகம", lat: 6.8480, lng: 79.9265 },

  // 2. Gampaha
  { id: "loc-gam-1", district_id: 2, slug: "negombo", name_en: "Negombo", name_si: "මීගමුව", name_ta: "நீர்கொழும்பு", lat: 7.2008, lng: 79.8736 },
  { id: "loc-gam-2", district_id: 2, slug: "wattala", name_en: "Wattala", name_si: "වත්තල", name_ta: "வத்தளை", lat: 6.9897, lng: 79.8913 },
  { id: "loc-gam-3", district_id: 2, slug: "kelaniya", name_en: "Kelaniya", name_si: "කැලණිය", name_ta: "களனி", lat: 6.9553, lng: 79.9153 },
  { id: "loc-gam-4", district_id: 2, slug: "kadawatha", name_en: "Kadawatha", name_si: "කඩවත", name_ta: "கடவத", lat: 7.0016, lng: 79.9532 },

  // 3. Kalutara
  { id: "loc-kal-1", district_id: 3, slug: "panadura", name_en: "Panadura", name_si: "පානදුර", name_ta: "பாணந்துறை", lat: 6.7133, lng: 79.9074 },
  { id: "loc-kal-2", district_id: 3, slug: "kalutara-south", name_en: "Kalutara South", name_si: "කළුතර දකුණ", name_ta: "தெற்கு களுத்துறை", lat: 6.5854, lng: 79.9607 },
  { id: "loc-kal-3", district_id: 3, slug: "horana", name_en: "Horana", name_si: "හොරණ", name_ta: "ஹொரண", lat: 6.7144, lng: 80.0631 },

  // 4. Kandy
  { id: "loc-kan-1", district_id: 4, slug: "kandy-city", name_en: "Kandy City", name_si: "මහනුවර නගරය", name_ta: "கண்டி நகரம்", lat: 7.2906, lng: 80.6337 },
  { id: "loc-kan-2", district_id: 4, slug: "peradeniya", name_en: "Peradeniya", name_si: "පේරාදෙණිය", name_ta: "பேராதனை", lat: 7.2588, lng: 80.5969 },
  { id: "loc-kan-3", district_id: 4, slug: "katugastota", name_en: "Katugastota", name_si: "කටුගස්තොට", name_ta: "கடுகஸ்தோட்டை", lat: 7.3247, lng: 80.6178 },

  // 5. Matale
  { id: "loc-mtl-1", district_id: 5, slug: "matale-town", name_en: "Matale Town", name_si: "මාතලේ නගරය", name_ta: "மாத்தளை நகரம்", lat: 7.4675, lng: 80.6234 },
  { id: "loc-mtl-2", district_id: 5, slug: "dambulla", name_en: "Dambulla", name_si: "දඹුල්ල", name_ta: "தம்புள்ளை", lat: 7.8742, lng: 80.6511 },

  // 6. Nuwara Eliya
  { id: "loc-nwe-1", district_id: 6, slug: "nuwara-eliya-town", name_en: "Nuwara Eliya Town", name_si: "නුවරඑළිය නගරය", name_ta: "நுவரெலியா நகரம்", lat: 6.9497, lng: 80.7891 },
  { id: "loc-nwe-2", district_id: 6, slug: "hatton", name_en: "Hatton", name_si: "හැටන්", name_ta: "ஹட்டன்", lat: 6.8916, lng: 80.5960 },

  // 7. Galle
  { id: "loc-galle-1", district_id: 7, slug: "galle-fort", name_en: "Galle Fort", name_si: "ගාල්ල කොටුව", name_ta: "காலி கோட்டை", lat: 6.0270, lng: 80.2170 },
  { id: "loc-galle-2", district_id: 7, slug: "unawatuna", name_en: "Unawatuna", name_si: "උණවටුන", name_ta: "உனவட்டுன", lat: 6.0104, lng: 80.2505 },
  { id: "loc-galle-3", district_id: 7, slug: "hikkaduwa", name_en: "Hikkaduwa", name_si: "හික්කඩුව", name_ta: "ஹிக்கடுவ", lat: 6.1395, lng: 80.1000 },
  { id: "loc-galle-4", district_id: 7, slug: "ambalangoda", name_en: "Ambalangoda", name_si: "අම්බලන්ගොඩ", name_ta: "அம்பலாங்கொடை", lat: 6.2364, lng: 80.0543 },

  // 8. Matara
  { id: "loc-mat-1", district_id: 8, slug: "matara-town", name_en: "Matara Town", name_si: "මාතර නගරය", name_ta: "மாத்தறை நகரம்", lat: 5.9549, lng: 80.5353 },
  { id: "loc-mat-2", district_id: 8, slug: "weligama", name_en: "Weligama", name_si: "වැලිගම", name_ta: "வெலிகம", lat: 5.9750, lng: 80.4286 },
  { id: "loc-mat-3", district_id: 8, slug: "mirissa", name_en: "Mirissa", name_si: "මිරිස්ස", name_ta: "மிரிஸ்ஸ", lat: 5.9482, lng: 80.4578 },

  // 9. Hambantota
  { id: "loc-hbt-1", district_id: 9, slug: "tangalle", name_en: "Tangalle", name_si: "තංගල්ල", name_ta: "தங்கalle", lat: 6.0244, lng: 80.7941 },
  { id: "loc-hbt-2", district_id: 9, slug: "hambantota-town", name_en: "Hambantota Town", name_si: "හම්බන්තොට නගරය", name_ta: "அம்பாந்தோட்டை நகரம்", lat: 6.1246, lng: 81.1185 },

  // 10. Jaffna
  { id: "loc-jaf-1", district_id: 10, slug: "jaffna-town", name_en: "Jaffna Town", name_si: "යාපනය නගරය", name_ta: "யாழ்ப்பாணம் நகரம்", lat: 9.6615, lng: 80.0074 },
  { id: "loc-jaf-2", district_id: 10, slug: "nallur", name_en: "Nallur", name_si: "නල්ලූර්", name_ta: "நல்லூர்", lat: 9.6744, lng: 80.0298 },

  // 11. Kilinochchi
  { id: "loc-kln-1", district_id: 11, slug: "kilinochchi-town", name_en: "Kilinochchi Town", name_si: "කිලිනොච්චිය නගරය", name_ta: "கிளிநொச்சி நகரம்", lat: 9.3803, lng: 80.3992 },

  // 12. Mannar
  { id: "loc-mnr-1", district_id: 12, slug: "mannar-town", name_en: "Mannar Town", name_si: "මන්නාරම නගරය", name_ta: "மன்னார் நகரம்", lat: 8.9810, lng: 79.9044 },

  // 13. Vavuniya
  { id: "loc-vav-1", district_id: 13, slug: "vavuniya-town", name_en: "Vavuniya Town", name_si: "වවුනියාව නගරය", name_ta: "வவுனியா நகரம்", lat: 8.7514, lng: 80.4971 },

  // 14. Mullaitivu
  { id: "loc-mul-1", district_id: 14, slug: "mullaitivu-town", name_en: "Mullaitivu Town", name_si: "මුලතිව් නගරය", name_ta: "முல்லைத்தீவு நகரம்", lat: 9.2671, lng: 80.8142 },

  // 15. Batticaloa
  { id: "loc-bat-1", district_id: 15, slug: "batticaloa-town", name_en: "Batticaloa Town", name_si: "මඩකලපුව නගරය", name_ta: "மட்டக்களப்பு நகரம்", lat: 7.7102, lng: 81.6924 },
  { id: "loc-bat-2", district_id: 15, slug: "kattankudy", name_en: "Kattankudy", name_si: "කාත්තන්කුඩි", name_ta: "காத்தான்குடி", lat: 7.6833, lng: 81.7167 },

  // 16. Ampara
  { id: "loc-amp-1", district_id: 16, slug: "ampara-town", name_en: "Ampara Town", name_si: "අම්පාර නගරය", name_ta: "அம்பாறை நகரம்", lat: 7.2912, lng: 81.6724 },
  { id: "loc-amp-2", district_id: 16, slug: "kalmunai", name_en: "Kalmunai", name_si: "කල්මුනේ", name_ta: "கல்முனை", lat: 7.4167, lng: 81.8333 },

  // 17. Trincomalee
  { id: "loc-tri-1", district_id: 17, slug: "trincomalee-town", name_en: "Trincomalee Town", name_si: "ත්රිකුණාමලය නගරය", name_ta: "திருகோணமலை நகரம்", lat: 8.5711, lng: 81.2335 },

  // 18. Kurunegala
  { id: "loc-kur-1", district_id: 18, slug: "kurunegala-town", name_en: "Kurunegala Town", name_si: "කුරුණෑගල නගරය", name_ta: "குருநாகல் நகரம்", lat: 7.4863, lng: 80.3623 },
  { id: "loc-kur-2", district_id: 18, slug: "kuliyapitiya", name_en: "Kuliyapitiya", name_si: "කුලියාපිටිය", name_ta: "குளியாப்பிட்டிய", lat: 7.4688, lng: 80.0401 },

  // 19. Puttalam
  { id: "loc-put-1", district_id: 19, slug: "chilaw", name_en: "Chilaw", name_si: "හලාවත", name_ta: "சிலாபம்", lat: 7.5758, lng: 79.7953 },
  { id: "loc-put-2", district_id: 19, slug: "puttalam-town", name_en: "Puttalam Town", name_si: "පුත්තලම නගරය", name_ta: "புத்தளம் நகரம்", lat: 8.0362, lng: 79.8283 },

  // 20. Anuradhapura
  { id: "loc-anu-1", district_id: 20, slug: "anuradhapura-city", name_en: "Anuradhapura City", name_si: "අනුරාධපුර නගරය", name_ta: "அனுராதபுரம் நகரம்", lat: 8.3114, lng: 80.4037 },

  // 21. Polonnaruwa
  { id: "loc-pol-1", district_id: 21, slug: "polonnaruwa-town", name_en: "Polonnaruwa Town", name_si: "පොළොන්නරුව නගරය", name_ta: "பொலன்னறுவை நகரம்", lat: 7.9403, lng: 81.0188 },

  // 22. Badulla
  { id: "loc-bad-1", district_id: 22, slug: "badulla-town", name_en: "Badulla Town", name_si: "බදුල්ල නගරය", name_ta: "பதுளை நகரம்", lat: 6.9895, lng: 81.0557 },
  { id: "loc-bad-2", district_id: 22, slug: "bandarawela", name_en: "Bandarawela", name_si: "බණ්ඩාරවෙල", name_ta: "பண்டாரவளை", lat: 6.8294, lng: 80.9859 },

  // 23. Monaragala
  { id: "loc-mon-1", district_id: 23, slug: "monaragala-town", name_en: "Monaragala Town", name_si: "මොණරාගල නගරය", name_ta: "மொணராகலை நகரம்", lat: 6.8728, lng: 81.3507 },

  // 24. Ratnapura
  { id: "loc-rat-1", district_id: 24, slug: "ratnapura-city", name_en: "Ratnapura City", name_si: "රත්නපුර නගරය", name_ta: "இரத்தினபுரி நகரம்", lat: 6.7056, lng: 80.3847 },

  // 25. Kegalle
  { id: "loc-keg-1", district_id: 25, slug: "kegalle-town", name_en: "Kegalle Town", name_si: "කෑගල්ල නගරය", name_ta: "கேகாலை நகரம்", lat: 7.2513, lng: 80.3464 },
];

export const CATEGORIES: ServiceCategory[] = [
  {
    id: "cat-home",
    slug: "home-property",
    name_en: "Home & Property",
    name_si: "නිවාස හා දේපළ",
    name_ta: "வீடு & சொத்து",
    description_en: "Essential repairs, installations, and residential maintenance services.",
    icon: "🏠",
    sort_order: 1,
    is_active: true,
    subcategories: [
      {
        id: "cat-plumbing",
        parent_id: "cat-home",
        slug: "plumbing",
        name_en: "Plumbing",
        name_si: "නල කාර්මික",
        name_ta: "குழாய் பழுது",
        description_en: "Pipes, water leaks, bathroom fittings, and motor pump repairs.",
        icon: "🔧",
        sort_order: 1,
        is_active: true,
      },
      {
        id: "cat-electrical",
        parent_id: "cat-home",
        slug: "electrical",
        name_en: "Electrical Work",
        name_si: "විදුලි කාර්මික",
        name_ta: "மின்சார வேலை",
        description_en: "Wiring, switchboard fixes, lights, tripping issues, and socket installations.",
        icon: "⚡",
        sort_order: 2,
        is_active: true,
      },
      {
        id: "cat-ac",
        parent_id: "cat-home",
        slug: "ac-repair",
        name_en: "AC Repair & Servicing",
        name_si: "වායු සමීකරණ සේවා",
        name_ta: "ஏசி பழுது",
        description_en: "Split AC servicing, chemical coil flush, inverter repair, and gas refilling.",
        icon: "❄️",
        sort_order: 3,
        is_active: true,
      },
      {
        id: "cat-cleaning",
        parent_id: "cat-home",
        slug: "cleaning",
        name_en: "Cleaning Services",
        name_si: "පිරිසිදු කිරීම් සේවා",
        name_ta: "துப்புரவு சேவைகள்",
        description_en: "Deep home cleaning, sofa, carpet, water tank, and commercial maintenance.",
        icon: "🧹",
        sort_order: 4,
        is_active: true,
      },
      {
        id: "cat-carpentry",
        parent_id: "cat-home",
        slug: "carpentry",
        name_en: "Carpentry & Woodwork",
        name_si: "වඩු කාර්මික",
        name_ta: "தச்சு வேலை",
        description_en: "Door fittings, window frames, custom timber furniture, and lock repair.",
        icon: "🪚",
        sort_order: 5,
        is_active: true,
      },
    ],
  },
  {
    id: "cat-auto",
    slug: "automotive-transport",
    name_en: "Automotive & Transport",
    name_si: "වාහන හා ප්‍රවාහන",
    name_ta: "வாகனம் & போக்குவரத்து",
    description_en: "Vehicle repairs, mobile roadside mechanics, breakdown assistance, and towing.",
    icon: "🚗",
    sort_order: 2,
    is_active: true,
    subcategories: [
      {
        id: "cat-mechanic",
        parent_id: "cat-auto",
        slug: "vehicle-mechanic",
        name_en: "Vehicle Mechanic",
        name_si: "වාහන කාර්මික",
        name_ta: "வாகன மெக்கானிக்",
        description_en: "Brake service, routine tune-up, roadside mobile breakdown recovery.",
        icon: "🚙",
        sort_order: 1,
        is_active: true,
      },
    ],
  },
  {
    id: "cat-personal",
    slug: "personal-lifestyle",
    name_en: "Personal & Lifestyle",
    name_si: "පුද්ගලික හා ජීවන රටා",
    name_ta: "தனிப்பட்ட & வாழ்க்கைமுறை",
    description_en: "Salon, event photography, tailoring, fitness, and lifestyle services.",
    icon: "✨",
    sort_order: 3,
    is_active: true,
  },
  {
    id: "cat-edu",
    slug: "education-professional",
    name_en: "Education & Professional",
    name_si: "අධ්‍යාපන හා වෘත්තීය",
    name_ta: "கல்வி & தொழில்முறை",
    description_en: "Tutoring, IT maintenance, graphic design, and bookkeeping assistance.",
    icon: "📚",
    sort_order: 4,
    is_active: true,
  },
];

export const DEMO_PROVIDERS: ProviderDetailView[] = [
  {
    id: "prov-1",
    name: "Southern Coastal Plumbing",
    slug: "southern-coastal-plumbing",
    description: "Reliable residential and commercial plumbing specialist based in Galle with over 12 years of hands-on experience. We handle urgent water leaks, overhead water tank fittings, bathroom sanitaryware, and booster pump installations.",
    business_type: "sole_proprietor",
    status: "approved",
    primary_category: "Plumbing",
    categories: ["Plumbing", "Home & Property"],
    district: "Galle",
    towns: ["Galle Fort", "Unawatuna", "Hikkaduwa", "Ambalangoda"],
    public_phone: "+94771234567",
    public_whatsapp: "+94771234567",
    public_email: "southern.plumbing@demo.lk",
    rating_summary: {
      average_rating: 4.9,
      total_reviews: 28,
    },
    starting_price: {
      amount: 2500,
      currency: "LKR",
      type: "starting_at",
    },
    badges: [
      { type: "identity_checked", label: "NIC Checked" },
      { type: "phone_confirmed", label: "Phone Confirmed" },
      { type: "qualification_checked", label: "NVQ Certified" },
    ],
    featured_services: [
      "Pipe Leak Repair & Tap Replacement",
      "Water Pressure Pump Installation",
      "Bathroom Sanitaryware Setup",
      "Overhead Water Tank Connection",
    ],
    services: [
      {
        id: "srv-101",
        title: "Emergency Pipe Leak Repair",
        description: "Fast detection and pipe replacement for PVC and PPR water lines.",
        pricing_type: "starting_at",
        price_min: 2500,
        currency: "LKR",
        category_slug: "plumbing",
      },
      {
        id: "srv-102",
        title: "Water Pump Installation & Motor Servicing",
        description: "Installation of domestic pressure pumps and automatic level controllers.",
        pricing_type: "fixed",
        price_min: 6500,
        price_max: 6500,
        currency: "LKR",
        category_slug: "plumbing",
      },
      {
        id: "srv-103",
        title: "Bathroom Commode & Basin Replacement",
        description: "Full fitting replacement, silicone sealing, and waste-pipe connection.",
        pricing_type: "starting_at",
        price_min: 5000,
        currency: "LKR",
        category_slug: "plumbing",
      },
    ],
    coverage_areas: [
      { locality_name: "Galle Fort", district_name: "Galle", radius_km: 25 },
      { locality_name: "Unawatuna", district_name: "Galle", radius_km: 20 },
      { locality_name: "Hikkaduwa", district_name: "Galle", radius_km: 15 },
    ],
    media: [
      { id: "m-1", storage_path: "demo/portfolio-1.webp", media_type: "portfolio", alt_text: "Clean copper and PVC piping installation", sort_order: 1 },
      { id: "m-2", storage_path: "demo/portfolio-2.webp", media_type: "portfolio", alt_text: "Water pump replacement in residential building", sort_order: 2 },
    ],
    published_at: "2026-01-15T08:00:00Z",
  },
  {
    id: "prov-2",
    name: "Silva Electrical & Power Works",
    slug: "silva-electrical-works",
    description: "Licensed domestic and commercial electrical technician in Galle District. Prompt assistance for circuit breaker trips, complete house re-wiring, sub-meter installations, and surge protector setups.",
    business_type: "individual",
    status: "approved",
    primary_category: "Electrical Work",
    categories: ["Electrical Work", "Home & Property"],
    district: "Galle",
    towns: ["Galle Fort", "Unawatuna", "Koggala"],
    public_phone: "+94772345678",
    public_whatsapp: "+94772345678",
    rating_summary: {
      average_rating: 4.8,
      total_reviews: 19,
    },
    starting_price: {
      amount: 3000,
      currency: "LKR",
      type: "starting_at",
    },
    badges: [
      { type: "identity_checked", label: "NIC Checked" },
      { type: "phone_confirmed", label: "Phone Confirmed" },
    ],
    featured_services: [
      "Short Circuit & Trip Switch Inspection",
      "Full House Re-Wiring with CEB Compliance",
      "Solar Inverter AC Connection",
    ],
    services: [
      {
        id: "srv-201",
        title: "Trip Switch & Short Circuit Fault Finding",
        description: "Megger insulation resistance testing and tracing neutral-ground leaks.",
        pricing_type: "starting_at",
        price_min: 3000,
        currency: "LKR",
        category_slug: "electrical",
      },
      {
        id: "srv-202",
        title: "Ceiling Fan, Light Fixture & Chandelier Installation",
        description: "Secure ceiling mounting and switchboard wiring.",
        pricing_type: "starting_at",
        price_min: 2000,
        currency: "LKR",
        category_slug: "electrical",
      },
    ],
    coverage_areas: [
      { locality_name: "Galle Fort", district_name: "Galle", radius_km: 20 },
      { locality_name: "Unawatuna", district_name: "Galle", radius_km: 15 },
    ],
    media: [
      { id: "m-3", storage_path: "demo/panel-wiring.webp", media_type: "portfolio", alt_text: "Clean consumer unit breaker panel wiring", sort_order: 1 },
    ],
    published_at: "2026-02-10T10:30:00Z",
  },
  {
    id: "prov-3",
    name: "Southern AC & Refrigeration Care",
    slug: "southern-ac-refrigeration",
    description: "Professional HVAC and air conditioning specialists serving villas, hotels, and residences across the Southern Province. We service all brands including Panasonic, LG, Daikin, and Abans.",
    business_type: "registered_company",
    status: "approved",
    primary_category: "AC Repair & Servicing",
    categories: ["AC Repair & Servicing", "Home & Property"],
    district: "Galle",
    towns: ["Galle Fort", "Unawatuna", "Hikkaduwa", "Matara Town"],
    public_phone: "+94773456789",
    public_whatsapp: "+94773456789",
    public_email: "service@southernac.demo.lk",
    website_url: "https://southernac.demo.lk",
    rating_summary: {
      average_rating: 4.9,
      total_reviews: 42,
    },
    starting_price: {
      amount: 4500,
      currency: "LKR",
      type: "fixed",
    },
    badges: [
      { type: "business_details_checked", label: "BR Registered" },
      { type: "identity_checked", label: "NIC Checked" },
      { type: "phone_confirmed", label: "Phone Confirmed" },
    ],
    featured_services: [
      "Inverter AC Full Chemical Servicing",
      "Gas Top-Up (R32 / R410A)",
      "New Split AC Installation",
    ],
    services: [
      {
        id: "srv-301",
        title: "Split Unit Chemical Wash & Servicing",
        description: "High-pressure evaporator and condenser flush, drain pipe unclog, and airflow check.",
        pricing_type: "fixed",
        price_min: 4500,
        price_max: 4500,
        currency: "LKR",
        category_slug: "ac-repair",
      },
      {
        id: "srv-302",
        title: "Refrigerant Gas Refill (R32 / R410A)",
        description: "System leak test followed by precise refrigerant charge to OEM PSI.",
        pricing_type: "starting_at",
        price_min: 6000,
        currency: "LKR",
        category_slug: "ac-repair",
      },
    ],
    coverage_areas: [
      { locality_name: "Galle Fort", district_name: "Galle", radius_km: 35 },
      { locality_name: "Matara Town", district_name: "Matara", radius_km: 30 },
    ],
    media: [
      { id: "m-4", storage_path: "demo/ac-cleaning.webp", media_type: "portfolio", alt_text: "Technician performing pressure chemical flush on split AC", sort_order: 1 },
    ],
    published_at: "2026-01-20T09:15:00Z",
  },
  {
    id: "prov-4",
    name: "Galle Pure Clean Services",
    slug: "galle-pure-clean",
    description: "Premium villa and residential deep cleaning team in coastal Southern Sri Lanka. Reliable staff trained for high-end hospitality hygiene standards and residential move-in/move-out cleans.",
    business_type: "sole_proprietor",
    status: "approved",
    primary_category: "Cleaning Services",
    categories: ["Cleaning Services", "Home & Property"],
    district: "Galle",
    towns: ["Galle Fort", "Unawatuna", "Hikkaduwa"],
    public_phone: "+94774567890",
    public_whatsapp: "+94774567890",
    rating_summary: {
      average_rating: 4.7,
      total_reviews: 15,
    },
    starting_price: {
      amount: 8000,
      currency: "LKR",
      type: "starting_at",
    },
    badges: [
      { type: "phone_confirmed", label: "Phone Confirmed" },
      { type: "identity_checked", label: "NIC Checked" },
    ],
    featured_services: [
      "Villa Deep Cleaning",
      "Sofa & Upholstery Shampooing",
      "Post-Renovation Dust Clearance",
    ],
    services: [
      {
        id: "srv-401",
        title: "Villa & Holiday Home Deep Clean",
        description: "Floor scrubbing, bathroom scaling removal, window shine, and kitchen degrease.",
        pricing_type: "quote",
        currency: "LKR",
        category_slug: "cleaning",
      },
    ],
    coverage_areas: [
      { locality_name: "Unawatuna", district_name: "Galle", radius_km: 20 },
      { locality_name: "Hikkaduwa", district_name: "Galle", radius_km: 20 },
    ],
    media: [
      { id: "m-5", storage_path: "demo/cleaning-team.webp", media_type: "portfolio", alt_text: "Cleaning team working in coastal villa living area", sort_order: 1 },
    ],
    published_at: "2026-03-01T11:00:00Z",
  },
  {
    id: "prov-5",
    name: "Apex Precision Electrical & Solar Colombo",
    slug: "apex-electrical-colombo",
    description: "CEB-licensed master electricians serving Colombo and suburbs. Residential electrical wiring, three-phase distribution boards, inverter installations, and EV charger setups.",
    business_type: "registered_company",
    status: "approved",
    primary_category: "Electrical Work",
    categories: ["Electrical Work", "Home & Property"],
    district: "Colombo",
    towns: ["Kollupitiya (Colombo 03)", "Dehiwala", "Moratuwa"],
    public_phone: "+94775678901",
    public_whatsapp: "+94775678901",
    public_email: "contact@apexelectrical.demo.lk",
    website_url: "https://apexelectrical.demo.lk",
    rating_summary: {
      average_rating: 4.9,
      total_reviews: 38,
    },
    starting_price: {
      amount: 3500,
      currency: "LKR",
      type: "starting_at",
    },
    badges: [
      { type: "business_details_checked", label: "BR Registered" },
      { type: "identity_checked", label: "NIC Checked" },
      { type: "qualification_checked", label: "CEB Licensed" },
    ],
    featured_services: [
      "Three-Phase DB Wiring & Surge Protection",
      "EV Home Charger Installation",
      "Emergency Power Breakdown Resolution",
    ],
    services: [
      {
        id: "srv-501",
        title: "Distribution Board (DB) Upgrade & Tripping Repair",
        description: "Full circuit load balancing, RCCB/MCB replacement, and earth resistance certification.",
        pricing_type: "starting_at",
        price_min: 4500,
        currency: "LKR",
        category_slug: "electrical",
      },
      {
        id: "srv-502",
        title: "Residential Solar Inverter Wiring",
        description: "DC isolator and grid-tie inverter AC sync wiring with certified testing.",
        pricing_type: "starting_at",
        price_min: 8000,
        currency: "LKR",
        category_slug: "electrical",
      },
    ],
    coverage_areas: [
      { locality_name: "Kollupitiya (Colombo 03)", district_name: "Colombo", radius_km: 25 },
      { locality_name: "Dehiwala", district_name: "Colombo", radius_km: 20 },
      { locality_name: "Moratuwa", district_name: "Colombo", radius_km: 20 },
    ],
    media: [
      { id: "m-6", storage_path: "demo/colombo-db.webp", media_type: "portfolio", alt_text: "Precision DB panel wiring in Colombo apartment", sort_order: 1 },
    ],
    published_at: "2026-02-15T09:00:00Z",
  },
  {
    id: "prov-6",
    name: "Hill Country Woodcraft & Renovations Kandy",
    slug: "hill-country-woodcraft-kandy",
    description: "Experienced carpenters crafting custom teak pantry cupboards, timber staircases, solid wood door frames, and furniture restoration in Kandy and Central Province.",
    business_type: "sole_proprietor",
    status: "approved",
    primary_category: "Carpentry & Woodwork",
    categories: ["Carpentry & Woodwork", "Home & Property"],
    district: "Kandy",
    towns: ["Kandy City", "Peradeniya", "Katugastota"],
    public_phone: "+94776789012",
    public_whatsapp: "+94776789012",
    rating_summary: {
      average_rating: 4.9,
      total_reviews: 24,
    },
    starting_price: {
      amount: 5000,
      currency: "LKR",
      type: "starting_at",
    },
    badges: [
      { type: "identity_checked", label: "NIC Checked" },
      { type: "phone_confirmed", label: "Phone Confirmed" },
    ],
    featured_services: [
      "Custom Teak & Mahogany Pantry Cupboards",
      "Solid Timber Door & Window Frames",
      "Antique Furniture Refinishing & Polishing",
    ],
    services: [
      {
        id: "srv-601",
        title: "Modern Modular Pantry Cabinet Installation",
        description: "Moisture-resistant plywood and natural solid wood pantry layout design and fitting.",
        pricing_type: "quote",
        currency: "LKR",
        category_slug: "carpentry",
      },
    ],
    coverage_areas: [
      { locality_name: "Kandy City", district_name: "Kandy", radius_km: 30 },
    ],
    media: [
      { id: "m-7", storage_path: "demo/kandy-pantry.webp", media_type: "portfolio", alt_text: "Handcrafted teak pantry cupboard in Kandy home", sort_order: 1 },
    ],
    published_at: "2026-03-05T10:00:00Z",
  },
];
