-- ==============================================================================
-- Sri Lanka Local Services Finder — Seed Data: Administrative Taxonomy & Demo Data
-- ==============================================================================

-- 1. All 9 Provinces of Sri Lanka
INSERT INTO public.provinces (id, slug, name_en, name_si, name_ta) VALUES
(1, 'western', 'Western Province', 'බස්නාහිර පළාත', 'மேல் மாகாணம்'),
(2, 'central', 'Central Province', 'මධ්‍යම පළාත', 'மத்திய மாகாணம்'),
(3, 'southern', 'Southern Province', 'දකුණු පළාත', 'தென் மாகாணம்'),
(4, 'northern', 'Northern Province', 'උතුරු පළාත', 'வட மாகாணம்'),
(5, 'eastern', 'Eastern Province', 'නැගෙනහිර පළාත', 'கிழக்கு மாகாணம்'),
(6, 'north-western', 'North Western Province', 'වයඹ පළාත', 'வடமேல் மாகாணம்'),
(7, 'north-central', 'North Central Province', 'උතුරු මැද පළාත', 'வடமத்திய மாகாணம்'),
(8, 'uva', 'Uva Province', 'ඌව පළාත', 'ஊவா மாகாணம்'),
(9, 'sabaragamuwa', 'Sabaragamuwa Province', 'සබරගමුව පළාත', 'சப்ரகமுவ மாகாணம்')
ON CONFLICT (id) DO UPDATE SET 
  slug = EXCLUDED.slug, name_en = EXCLUDED.name_en, name_si = EXCLUDED.name_si, name_ta = EXCLUDED.name_ta;

-- 2. All 25 Districts of Sri Lanka
INSERT INTO public.districts (id, province_id, slug, name_en, name_si, name_ta) VALUES
-- Western
(1, 1, 'colombo', 'Colombo', 'කොළඹ', 'கொழும்பு'),
(2, 1, 'gampaha', 'Gampaha', 'ගම්පහ', 'கம்பஹா'),
(3, 1, 'kalutara', 'Kalutara', 'කළුතර', 'களுத்துறை'),
-- Central
(4, 2, 'kandy', 'Kandy', 'මහනුවර', 'கண்டி'),
(5, 2, 'matale', 'Matale', 'මාතලේ', 'மாத்தளை'),
(6, 2, 'nuwara-eliya', 'Nuwara Eliya', 'නුවරඑළිය', 'நுவரெலியா'),
-- Southern (Pilot Region)
(7, 3, 'galle', 'Galle', 'ගාල්ල', 'காலி'),
(8, 3, 'matara', 'Matara', 'මාතර', 'மாத்தறை'),
(9, 3, 'hambantota', 'Hambantota', 'හම්බන්තොට', 'அம்பாந்தோட்டை'),
-- Northern
(10, 4, 'jaffna', 'Jaffna', 'යාපනය', 'யாழ்ப்பாணம்'),
(11, 4, 'kilinochchi', 'Kilinochchi', 'කිලිනොච්චිය', 'கிளிநொச்சி'),
(12, 4, 'mannar', 'Mannar', 'මන්නාරම', 'மன்னார்'),
(13, 4, 'vavuniya', 'Vavuniya', 'වවුනියාව', 'வவுனியா'),
(14, 4, 'mullaitivu', 'Mullaitivu', 'මුලතිව්', 'முல்லைத்தீவு'),
-- Eastern
(15, 5, 'batticaloa', 'Batticaloa', 'මඩකලපුව', 'மட்டக்களப்பு'),
(16, 5, 'ampara', 'Ampara', 'අම්පාර', 'அம்பாறை'),
(17, 5, 'trincomalee', 'Trincomalee', 'ත්රිකුණාමලය', 'திருகோணமலை'),
-- North Western
(18, 6, 'kurunegala', 'Kurunegala', 'කුරුණෑගල', 'குருநாகல்'),
(19, 6, 'puttalam', 'Puttalam', 'පුත්තලම', 'புத்தளம்'),
-- North Central
(20, 7, 'anuradhapura', 'Anuradhapura', 'අනුරාධපුරය', 'அனுராதபுரம்'),
(21, 7, 'polonnaruwa', 'Polonnaruwa', 'පොළොන්නරුව', 'பொலன்னறுவை'),
-- Uva
(22, 8, 'badulla', 'Badulla', 'බදුල්ල', 'பதுளை'),
(23, 8, 'monaragala', 'Monaragala', 'මොණරාගල', 'மொணராகலை'),
-- Sabaragamuwa
(24, 9, 'ratnapura', 'Ratnapura', 'රත්නපුර', 'இரத்தினபுரி'),
(25, 9, 'kegalle', 'Kegalle', 'කෑගල්ල', 'கேகாலை')
ON CONFLICT (id) DO UPDATE SET 
  province_id = EXCLUDED.province_id, slug = EXCLUDED.slug, name_en = EXCLUDED.name_en, name_si = EXCLUDED.name_si, name_ta = EXCLUDED.name_ta;

-- 3. Launch Localities (Centroids in WGS84 for PostGIS)
INSERT INTO public.localities (id, district_id, slug, name_en, name_si, name_ta, location_point) VALUES
-- Galle District (Pilot)
('a0000000-0000-0000-0000-000000000001', 7, 'galle-fort', 'Galle Town / Fort', 'ගාල්ල නගරය', 'காலி நகரம்', extensions.ST_SetSRID(extensions.ST_MakePoint(80.2170, 6.0535), 4326)::extensions.GEOGRAPHY),
('a0000000-0000-0000-0000-000000000002', 7, 'unawatuna', 'Unawatuna', 'උණවටුන', 'உனவட்டுன', extensions.ST_SetSRID(extensions.ST_MakePoint(80.2505, 6.0104), 4326)::extensions.GEOGRAPHY),
('a0000000-0000-0000-0000-000000000003', 7, 'hikkaduwa', 'Hikkaduwa', 'හික්කඩුව', 'ஹிக்கடுவ', extensions.ST_SetSRID(extensions.ST_MakePoint(80.1000, 6.1395), 4326)::extensions.GEOGRAPHY),
('a0000000-0000-0000-0000-000000000004', 7, 'ambalangoda', 'Ambalangoda', 'අම්බලන්ගොඩ', 'அம்பலாங்கொடை', extensions.ST_SetSRID(extensions.ST_MakePoint(80.0543, 6.2364), 4326)::extensions.GEOGRAPHY),
-- Colombo District
('a0000000-0000-0000-0000-000000000005', 1, 'colombo-03', 'Colombo 03 (Kollupitiya)', 'කොළඹ 03 (කොල්ලුපිටිය)', 'கொழும்பு 03', extensions.ST_SetSRID(extensions.ST_MakePoint(79.8510, 6.9038), 4326)::extensions.GEOGRAPHY),
('a0000000-0000-0000-0000-000000000006', 1, 'dehiwala', 'Dehiwala', 'දෙහිවල', 'தெஹிவளை', extensions.ST_SetSRID(extensions.ST_MakePoint(79.8660, 6.8510), 4326)::extensions.GEOGRAPHY),
('a0000000-0000-0000-0000-000000000007', 1, 'moratuwa', 'Moratuwa', 'මොරටුව', 'மொறட்டுவ', extensions.ST_SetSRID(extensions.ST_MakePoint(79.8829, 6.7730), 4326)::extensions.GEOGRAPHY),
-- Kandy District
('a0000000-0000-0000-0000-000000000008', 4, 'kandy-city', 'Kandy City', 'මහනුවර නගරය', 'கண்டி நகரம்', extensions.ST_SetSRID(extensions.ST_MakePoint(80.6337, 7.2906), 4326)::extensions.GEOGRAPHY),
-- Matara District
('a0000000-0000-0000-0000-000000000009', 8, 'matara-town', 'Matara Town', 'මාතර නගරය', 'மாத்தறை நகரம்', extensions.ST_SetSRID(extensions.ST_MakePoint(80.5353, 5.9549), 4326)::extensions.GEOGRAPHY),
-- Jaffna District
('a0000000-0000-0000-0000-000000000010', 10, 'jaffna-town', 'Jaffna Town', 'යාපනය නගරය', 'யாழ்ப்பாணம் நகரம்', extensions.ST_SetSRID(extensions.ST_MakePoint(80.0074, 9.6615), 4326)::extensions.GEOGRAPHY)
ON CONFLICT (slug) DO NOTHING;

-- 4. Service Categories
INSERT INTO public.service_categories (id, parent_id, slug, name_en, name_si, name_ta, description_en, icon, sort_order) VALUES
('c0000000-0000-0000-0000-000000000001', NULL, 'home-property', 'Home & Property', 'නිවාස හා දේපළ', 'வீடு & சொத்து', 'Residential repairs, maintenance, and upkeep services', '🏠', 1),
('c0000000-0000-0000-0000-000000000002', NULL, 'automotive-transport', 'Automotive & Transport', 'වාහන හා ප්‍රවාහන', 'வாகனம் & போக்குவரத்து', 'Vehicle repairs, roadside help, and transport services', '🚗', 2),
('c0000000-0000-0000-0000-000000000003', NULL, 'personal-lifestyle', 'Personal & Lifestyle', 'පුද්ගලික හා ජීවන රටා', 'தனிப்பட்ட & வாழ்க்கைமுறை', 'Personal care, wellness, and bespoke services', '✨', 3),
('c0000000-0000-0000-0000-000000000004', NULL, 'education-professional', 'Education & Professional', 'අධ්‍යාපන හා වෘත්තීය', 'கல்வி & தொழில்முறை', 'Tutoring, IT support, tax, and consulting services', '📚', 4)
ON CONFLICT (slug) DO NOTHING;

-- Subcategories under Home & Property
INSERT INTO public.service_categories (id, parent_id, slug, name_en, name_si, name_ta, description_en, icon, sort_order) VALUES
('c0000000-0000-0000-0000-000000000011', 'c0000000-0000-0000-0000-000000000001', 'plumbing', 'Plumbing', 'නල කාර්මික', 'குழாய் பழுது', 'Water leaks, pipe repairs, bathroom fixtures, and pumps', '🔧', 1),
('c0000000-0000-0000-0000-000000000012', 'c0000000-0000-0000-0000-000000000001', 'electrical', 'Electrical Work', 'විදුලි කාර්මික', 'மின்சார வேலை', 'Wiring, lighting, trip switch fixes, and sockets', '⚡', 2),
('c0000000-0000-0000-0000-000000000013', 'c0000000-0000-0000-0000-000000000001', 'ac-repair', 'Air Conditioning', 'වායු සමීකරණ සේවා', 'ஏசி பழுது', 'AC repair, servicing, installation, and gas charging', '❄️', 3),
('c0000000-0000-0000-0000-000000000014', 'c0000000-0000-0000-0000-000000000001', 'cleaning', 'Cleaning Services', 'පිරිසිදු කිරීම් සේවා', 'துப்புரவு சேவைகள்', 'Deep home cleaning, sofa, carpet, and office cleaning', '🧹', 4),
('c0000000-0000-0000-0000-000000000015', 'c0000000-0000-0000-0000-000000000001', 'carpentry', 'Carpentry & Woodwork', 'වඩු කාර්මික', 'தச்சு வேலை', 'Custom timber, door fittings, and furniture repair', '🪚', 5),
-- Subcategories under Automotive
('c0000000-0000-0000-0000-000000000021', 'c0000000-0000-0000-0000-000000000002', 'vehicle-mechanic', 'Vehicle Mechanic', 'වාහන කාර්මික', 'வாகன மெக்கானிக்', 'Engine tune-up, brake service, and roadside mechanic', '🚙', 1)
ON CONFLICT (slug) DO NOTHING;

-- 5. Curated Search Synonyms / Aliases
INSERT INTO public.service_category_aliases (category_id, locale, alias, normalized_alias) VALUES
('c0000000-0000-0000-0000-000000000011', 'en', 'pipe leak', 'pipe leak'),
('c0000000-0000-0000-0000-000000000011', 'si', 'නල බාස්', 'nala baas'),
('c0000000-0000-0000-0000-000000000012', 'en', 'electrician', 'electrician'),
('c0000000-0000-0000-0000-000000000012', 'si', 'කරන්ට් බාස්', 'current baas'),
('c0000000-0000-0000-0000-000000000013', 'en', 'AC service', 'ac service')
ON CONFLICT DO NOTHING;

-- 6. Demo Seed Providers (Clearly marked as test fixtures)
-- Note: Uses deterministic test UUIDs for reproducible testing
INSERT INTO public.profiles (id, display_name, phone, email, preferred_locale, account_status) VALUES
('b0000000-0000-0000-0000-000000000001', 'Bandara Perera (Demo)', '+94771234567', 'bandara.demo@localservices.lk', 'en', 'active'),
('b0000000-0000-0000-0000-000000000002', 'Kamal Silva (Demo)', '+94772345678', 'kamal.demo@localservices.lk', 'si', 'active'),
('b0000000-0000-0000-0000-000000000003', 'Southern AC Care (Demo)', '+94773456789', 'southernac.demo@localservices.lk', 'en', 'active'),
('b0000000-0000-0000-0000-000000000004', 'Lanka Clean Pro (Demo)', '+94774567890', 'cleanpro.demo@localservices.lk', 'en', 'active')
ON CONFLICT (id) DO NOTHING;

-- Demo Businesses (Approved for public discovery)
INSERT INTO public.businesses (id, owner_id, business_type, name, slug, description, status, public_phone, public_whatsapp, published_at) VALUES
('d0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'sole_proprietor', 'Southern Coastal Plumbing', 'southern-coastal-plumbing', 'Experienced residential and commercial plumbing specialist serving Galle, Unawatuna, and surrounding areas. Over 12 years of hands-on experience in water pump installation, drainage fixes, and leak detection.', 'approved', '+94771234567', '+94771234567', NOW()),
('d0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000002', 'individual', 'Silva Electrical & Power Works', 'silva-electrical-works', 'Certified auto and domestic electrician in Galle district. Emergency call-outs for power failures, circuit breaker resets, and full home electrical wiring.', 'approved', '+94772345678', '+94772345678', NOW()),
('d0000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000003', 'registered_company', 'Southern AC & Refrigeration Care', 'southern-ac-refrigeration', 'Specialist in split-unit, inverter, and commercial cassette AC servicing. Fast breakdown response, chemical coil wash, and eco-friendly gas recharging across the Southern Province.', 'approved', '+94773456789', '+94773456789', NOW()),
('d0000000-0000-0000-0000-000000000004', 'b0000000-0000-0000-0000-000000000004', 'sole_proprietor', 'Galle Pure Clean Services', 'galle-pure-clean', 'Professional deep cleaning for tourist villas, private homes, and commercial premises. Eco-friendly cleaning products and trained staff.', 'approved', '+94774567890', '+94774567890', NOW())
ON CONFLICT (slug) DO NOTHING;

-- Demo Provider Services
INSERT INTO public.provider_services (business_id, category_id, title, description, pricing_type, price_min, price_max, currency) VALUES
('d0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000011', 'Pipe Leak Repair & Tap Replacement', 'Inspection and fix for leaking pipes, valves, and water mixers.', 'starting_at', 2500.00, NULL, 'LKR'),
('d0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000011', 'Water Pump Installation & Servicing', 'Pressure pump setup and motor servicing.', 'fixed', 6500.00, 6500.00, 'LKR'),
('d0000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000012', 'Domestic Wiring & Trip Switch Inspection', 'Safety audit and fault clearance on residential consumer units.', 'starting_at', 3000.00, NULL, 'LKR'),
('d0000000-0000-0000-0000-000000000003', 'c0000000-0000-0000-0000-000000000013', 'Split AC Chemical Service & Filter Clean', 'Thorough pressure cleaning, indoor/outdoor coil flush, and gas pressure check.', 'fixed', 4500.00, 4500.00, 'LKR'),
('d0000000-0000-0000-0000-000000000004', 'c0000000-0000-0000-0000-000000000014', 'Villa & Residential Deep Cleaning', 'Complete floor scrub, window wash, kitchen degrease, and sanitization.', 'quote', NULL, NULL, 'LKR')
ON CONFLICT DO NOTHING;

-- Demo Service Areas (PostGIS coverage)
INSERT INTO public.provider_service_areas (business_id, locality_id, coverage_type, radius_km, location_point) VALUES
('d0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'radius', 25.00, extensions.ST_SetSRID(extensions.ST_MakePoint(80.2170, 6.0535), 4326)::extensions.GEOGRAPHY),
('d0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 'radius', 20.00, extensions.ST_SetSRID(extensions.ST_MakePoint(80.2170, 6.0535), 4326)::extensions.GEOGRAPHY),
('d0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000002', 'radius', 35.00, extensions.ST_SetSRID(extensions.ST_MakePoint(80.2505, 6.0104), 4326)::extensions.GEOGRAPHY),
('d0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000003', 'radius', 15.00, extensions.ST_SetSRID(extensions.ST_MakePoint(80.1000, 6.1395), 4326)::extensions.GEOGRAPHY)
ON CONFLICT DO NOTHING;
