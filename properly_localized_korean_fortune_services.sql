-- Properly Localized Korean Fortune Telling Services Data
-- Execute this script in your Supabase SQL Editor
-- This creates separate fields for each language to enable proper frontend localization

-- STEP 1: Delete all existing location data (except the original sample)
DELETE FROM locations WHERE id != '550e8400-e29b-41d4-a716-446655440002';

-- STEP 2: Delete all existing places (we'll add new ones)
DELETE FROM places;

-- STEP 3: Add Korean fortune telling locations in Seoul
INSERT INTO places (id, region, city, district, postal_code, address_line, place_label, latitude, longitude) VALUES
-- Gangnam locations
('f47ac10b-58cc-4372-a567-0e02b2c3d479', '서울특별시', '강남구', '신사동', '06028', '가로수길 45-7, 2층', 'tarot-garosu', 37.5209, 127.0230),
('6ba7b810-9dad-11d1-80b4-00c04fd430c8', '서울특별시', '강남구', '청담동', '06015', '청담로 89, 청담빌딩 3층', 'saju-cheongdam', 37.5272, 127.0432),
('6ba7b811-9dad-11d1-80b4-00c04fd430c8', '서울특별시', '강남구', '압구정동', '06001', '압구정로 102, 로데오빌딩 5층', 'palmistry-apgujeong', 37.5264, 127.0286),
('6ba7b812-9dad-11d1-80b4-00c04fd430c8', '서울특별시', '강남구', '역삼동', '06236', '테헤란로 152, 강남파이낸스센터 12층', 'numerology-yeoksam', 37.5012, 127.0396),

-- Hongdae/Mapo locations  
('6ba7b813-9dad-11d1-80b4-00c04fd430c8', '서울특별시', '마포구', '홍익로2가', '04039', '홍익로5길 20, 홍대타워 4층', 'crystal-hongdae', 37.5563, 126.9236),
('6ba7b814-9dad-11d1-80b4-00c04fd430c8', '서울특별시', '마포구', '서교동', '04053', '양화로 160, 메세나폴리스 8층', 'fortune-seogyo', 37.5564, 126.9226),
('6ba7b815-9dad-11d1-80b4-00c04fd430c8', '서울특별시', '마포구', '상수동', '04055', '월드컵로 25길 19, 상수빌딩 3층', 'runes-sangsu', 37.5477, 126.9227),

-- Myeongdong/Jung-gu locations
('6ba7b816-9dad-11d1-80b4-00c04fd430c8', '서울특별시', '중구', '명동2가', '04536', '명동8길 29, 명동센트럴 6층', 'dream-myeongdong', 37.5636, 126.9834),
('6ba7b817-9dad-11d1-80b4-00c04fd430c8', '서울특별시', '중구', '을지로3가', '04548', '을지로15길 7, 을지빌딩 7층', 'wisdom-euljiro', 37.5665, 126.9910),
('6ba7b818-9dad-11d1-80b4-00c04fd430c8', '서울특별시', '중구', '회현동', '04630', '소공로 70, 회현빌딩 5층', 'chakra-hoehyeon', 37.5583, 126.9772),

-- Gangbuk locations
('6ba7b819-9dad-11d1-80b4-00c04fd430c8', '서울특별시', '종로구', '인사동', '03148', '인사동길 35, 인사아트센터 3층', 'traditional-insadong', 37.5717, 126.9854),
('6ba7b81a-9dad-11d1-80b4-00c04fd430c8', '서울특별시', '성북구', '성신여대입구역', '02844', '동소문로 47, 성신빌딩 2층', 'lunar-seongbuk', 37.5928, 127.0163),
('6ba7b81b-9dad-11d1-80b4-00c04fd430c8', '서울특별시', '종로구', '종로3가', '03189', '종로 69, 종로타워 8층', 'spiritual-jongno', 37.5703, 126.9910),

-- Gangdong locations
('6ba7b81c-9dad-11d1-80b4-00c04fd430c8', '서울특별시', '송파구', '잠실동', '05551', '올림픽로 240, 롯데월드타워 스카이31 31층', 'sky-jamsil', 37.5125, 127.1025),
('6ba7b81d-9dad-11d1-80b4-00c04fd430c8', '서울특별시', '강동구', '천호동', '05288', '천중로 206, 천호역 메가박스 6층', 'star-cheonho', 37.5387, 127.1237),
('6ba7b81e-9dad-11d1-80b4-00c04fd430c8', '서울특별시', '송파구', '문정동', '05854', '법원로 127, 문정역 센트럴 4층', 'energy-munjeong', 37.4844, 127.1221),

-- Gangnam South locations
('6ba7b81f-9dad-11d1-80b4-00c04fd430c8', '서울특별시', '서초구', '서초동', '06655', '서초대로 77길 41, 서초타워 9층', 'mystic-seocho', 37.4948, 127.0277),
('6ba7b820-9dad-11d1-80b4-00c04fd430c8', '서울특별시', '강남구', '삼성동', '06292', '영동대로 513, 코엑스몰 B1층', 'oracle-samsung', 37.5115, 127.0595),

-- Yeongdeungpo locations
('6ba7b821-9dad-11d1-80b4-00c04fd430c8', '서울특별시', '영등포구', '여의도동', '07327', '국제금융로 10, IFC몰 3층', 'fortune-yeouido', 37.5254, 126.9246),
('6ba7b822-9dad-11d1-80b4-00c04fd430c8', '서울특별시', '영등포구', '영등포동', '07305', '영중로 15, 타임스퀘어 12층', 'wisdom-yeongdeungpo', 37.5172, 126.9033);

-- STEP 4: Add new columns for localized content to locations table
ALTER TABLE locations 
ADD COLUMN IF NOT EXISTS title_en TEXT,
ADD COLUMN IF NOT EXISTS title_ko TEXT,
ADD COLUMN IF NOT EXISTS subtitle_en TEXT,
ADD COLUMN IF NOT EXISTS subtitle_ko TEXT,
ADD COLUMN IF NOT EXISTS description_en TEXT,
ADD COLUMN IF NOT EXISTS description_ko TEXT,
ADD COLUMN IF NOT EXISTS tagline_en TEXT,
ADD COLUMN IF NOT EXISTS tagline_ko TEXT,
ADD COLUMN IF NOT EXISTS price_description_en TEXT,
ADD COLUMN IF NOT EXISTS price_description_ko TEXT,
ADD COLUMN IF NOT EXISTS business_hours_en TEXT,
ADD COLUMN IF NOT EXISTS business_hours_ko TEXT;

-- STEP 5: Add Korean fortune telling services with proper localization fields
INSERT INTO locations (
  id,
  title,
  title_ko,
  title_en,
  subtitle,
  subtitle_ko,
  subtitle_en,
  description,
  description_ko,
  description_en,
  main_image_url,
  gallery_images,
  icon,
  features,
  base_price,
  price_description,
  price_description_ko,
  price_description_en,
  currency,
  rating,
  review_count,
  phone,
  email,
  address,
  website,
  business_hours,
  business_hours_ko,
  business_hours_en,
  tagline,
  tagline_ko,
  tagline_en,
  image_url,
  price_krw,
  activity_level,
  skill_level,
  max_guests_total,
  min_age,
  place_id
) VALUES 

-- 1. 타로카드 점술소 (Tarot Reading)
('a1b2c3d4-e5f6-7890-1234-567890abcdef', 
'미스틱 타로 살롱', -- default title (Korean)
'미스틱 타로 살롱', -- title_ko
'Mystic Tarot Salon', -- title_en
'신비로운 타로카드로 미래를 읽어드립니다', -- default subtitle
'신비로운 타로카드로 미래를 읽어드립니다', -- subtitle_ko
'Unlock your future with mystical tarot cards', -- subtitle_en
'프랑스에서 직수입한 정통 타로카드와 30년 경력의 타로마스터가 함께하는 프리미엄 타로 상담소입니다.', -- default description
'프랑스에서 직수입한 정통 타로카드와 30년 경력의 타로마스터가 함께하는 프리미엄 타로 상담소입니다. 연애, 진로, 인간관계 등 궁금한 모든 것을 타로카드를 통해 명확히 해답을 찾아드립니다.', -- description_ko
'Premium tarot consultation featuring authentic French-imported tarot cards and a tarot master with 30 years of experience. Find clear answers to all your questions about love, career, and relationships through the wisdom of tarot cards.', -- description_en
'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop&auto=format',
ARRAY['https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop&auto=format', 'https://images.unsplash.com/photo-1551431009-a802eeec77b1?w=800&h=600&fit=crop&auto=format'],
'🔮',
'[{"id": 1, "icon": "🃏", "text": "정통 프랑스 타로카드"}, {"id": 2, "icon": "✨", "text": "30년 경력 타로마스터"}, {"id": 3, "icon": "💕", "text": "연애운 특화 상담"}, {"id": 4, "icon": "🎯", "text": "구체적 해답 제시"}]',
45000, '30분 상담 기준', '30분 상담 기준', '30min consultation', 'KRW', 4.8, 89,
'02-555-0101', 'info@mystictarot.kr', '서울특별시 강남구 신사동 가로수길 45-7, 2층',
'https://mystictarot.kr', '매일 11:00 - 22:00', '매일 11:00 - 22:00', 'Daily 11:00 - 22:00',
'신비로운 타로카드로 미래를 읽어드립니다', '신비로운 타로카드로 미래를 읽어드립니다', 'Unlock your future with mystical tarot cards', 
'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop&auto=format',
45000, 'LIGHT', 'BEGINNER', 2, 18, 'f47ac10b-58cc-4372-a567-0e02b2c3d479'),

-- 2. 전통 사주명리학원 (Traditional Saju)
('b2c3d4e5-f6a7-8901-2345-678901bcdefb',
'동양명리 사주궁합소', '동양명리 사주궁합소', 'Oriental Saju Palace',
'천년 역사의 정통 사주명리학', '천년 역사의 정통 사주명리학', 'Traditional Saju with millennium history',
'조선왕조 궁중 명리학을 계승한 정통 사주명리 전문가가 직접 상담해드립니다.', 
'조선왕조 궁중 명리학을 계승한 정통 사주명리 전문가가 직접 상담해드립니다. 사주팔자, 궁합, 택일, 개명까지 전통 명리학의 모든 영역을 다루며, 정확하고 체계적인 해석으로 인생의 방향을 제시합니다.',
'Expert consultation by traditional Saju masters who inherited Joseon Dynasty court astrology. We cover all aspects of traditional fortune-telling including birth charts, compatibility, auspicious dates, and name changing with accurate and systematic interpretations.',
'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop&auto=format',
ARRAY['https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop&auto=format', 'https://images.unsplash.com/photo-1578662015594-3020cd5c58ae?w=800&h=600&fit=crop&auto=format'],
'📜',
'[{"id": 1, "icon": "🏛️", "text": "조선왕조 궁중 명리학"}, {"id": 2, "icon": "📚", "text": "40년 명리학 연구"}, {"id": 3, "icon": "💑", "text": "궁합 전문 상담"}, {"id": 4, "icon": "🌟", "text": "개명 및 택일 서비스"}]',
80000, '60분 정밀 상담', '60분 정밀 상담', '60min detailed consultation', 'KRW', 4.9, 156,
'02-555-0202', 'info@sajugoong.kr', '서울특별시 강남구 청담동 청담로 89, 청담빌딩 3층',
'https://sajugoong.kr', '평일 09:00 - 18:00, 토요일 10:00 - 16:00', '평일 09:00 - 18:00, 토요일 10:00 - 16:00', 'Mon-Fri 09:00-18:00, Sat 10:00-16:00',
'천년 역사의 정통 사주명리학', '천년 역사의 정통 사주명리학', 'Traditional Saju with millennium history',
'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop&auto=format',
80000, 'MODERATE', 'ADVANCED', 3, 20, '6ba7b810-9dad-11d1-80b4-00c04fd430c8'),

-- 3. 수상술 관상학원 (Palm & Face Reading)
('c3d4e5f6-a7b8-9012-3456-789012cdefab',
'관상수상 운명학당', '관상수상 운명학당', 'Physiognomy & Palm Reading Center',
'손금과 얼굴로 읽는 당신의 운명', '손금과 얼굴로 읽는 당신의 운명', 'Read your destiny through palms and face',
'손금(수상)과 관상을 통해 선천적 운명과 후천적 노력의 방향을 제시하는 전문 상담소입니다.',
'손금(수상)과 관상을 통해 선천적 운명과 후천적 노력의 방향을 제시하는 전문 상담소입니다. 중국 정통 관상학과 인도 수상술을 결합하여 정확하고 실용적인 조언을 드립니다.',
'Expert consultation center providing guidance on innate destiny and future efforts through palm reading and physiognomy. We combine traditional Chinese face reading with Indian palmistry to offer accurate and practical advice.',
'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop&auto=format',
ARRAY['https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop&auto=format', 'https://images.unsplash.com/photo-1588392382834-a891154bca4d?w=800&h=600&fit=crop&auto=format'],
'✋',
'[{"id": 1, "icon": "👁️", "text": "정통 중국 관상학"}, {"id": 2, "icon": "🤲", "text": "인도 수상술 전문"}, {"id": 3, "icon": "🔍", "text": "즉석 현장 분석"}, {"id": 4, "icon": "💡", "text": "실용적 조언 제공"}]',
35000, '20분 신속 분석', '20분 신속 분석', '20min quick analysis', 'KRW', 4.6, 73,
'02-555-0303', 'info@palmface.kr', '서울특별시 강남구 압구정동 압구정로 102, 로데오빌딩 5층',
'https://palmface.kr', '매일 12:00 - 21:00', '매일 12:00 - 21:00', 'Daily 12:00 - 21:00',
'손금과 얼굴로 읽는 당신의 운명', '손금과 얼굴로 읽는 당신의 운명', 'Read your destiny through palms and face',
'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop&auto=format',
35000, 'LIGHT', 'BEGINNER', 1, 16, '6ba7b811-9dad-11d1-80b4-00c04fd430c8'),

-- Continue with more services (4-20)...
-- 4. 크리스탈 힐링 센터
('d4e5f6a7-b8c9-0123-4567-890123defabc',
'크리스탈 오라클 센터', '크리스탈 오라클 센터', 'Crystal Oracle Center',
'수정의 에너지로 정화하고 미래를 봅니다', '수정의 에너지로 정화하고 미래를 봅니다', 'Purify and see the future with crystal energy',
'천연 수정과 보석의 에너지를 활용한 오라클 리딩과 힐링 서비스를 제공합니다.',
'천연 수정과 보석의 에너지를 활용한 오라클 리딩과 힐링 서비스를 제공합니다. 각종 수정의 파워와 오라클 카드를 통해 영적 성장과 내면의 평화를 찾아드립니다.',
'Oracle reading and healing services using the energy of natural crystals and gemstones. Find spiritual growth and inner peace through the power of various crystals and oracle cards.',
'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=600&fit=crop&auto=format',
ARRAY['https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=600&fit=crop&auto=format', 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=800&h=600&fit=crop&auto=format'],
'💎',
'[{"id": 1, "icon": "💎", "text": "천연 크리스탈 컬렉션"}, {"id": 2, "icon": "🌈", "text": "오라클 카드 리딩"}, {"id": 3, "icon": "🧘", "text": "힐링 테라피"}, {"id": 4, "icon": "✨", "text": "영적 성장 가이드"}]',
50000, '45분 힐링 포함', '45분 힐링 포함', '45min with healing', 'KRW', 4.7, 112,
'02-555-0404', 'info@crystal-oracle.kr', '서울특별시 마포구 홍익로2가 홍익로5길 20, 홍대타워 4층',
'https://crystal-oracle.kr', '화-일 14:00 - 22:00 (월요일 휴무)', '화-일 14:00 - 22:00 (월요일 휴무)', 'Tue-Sun 14:00-22:00 (Closed Mon)',
'수정의 에너지로 정화하고 미래를 봅니다', '수정의 에너지로 정화하고 미래를 봅니다', 'Purify and see the future with crystal energy',
'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=600&fit=crop&auto=format',
50000, 'LIGHT', 'BEGINNER', 4, 18, '6ba7b813-9dad-11d1-80b4-00c04fd430c8'),

-- 5. 음양오행 풍수지리원
('e5f6a7b8-c9d0-1234-5678-901234efabcd',
'음양오행 풍수원', '음양오행 풍수원', 'Yin Yang Five Elements Feng Shui',
'집과 사무실의 기운을 바꿔드립니다', '집과 사무실의 기운을 바꿔드립니다', 'Transform the energy of your home and office',
'음양오행 이론에 바탕한 전문 풍수 상담과 인테리어 컨설팅을 제공합니다.',
'음양오행 이론에 바탕한 전문 풍수 상담과 인테리어 컨설팅을 제공합니다. 집, 사무실, 상가의 기운을 분석하고 최적의 배치와 인테리어 방향을 제시하여 운세 상승을 도와드립니다.',
'Professional feng shui consultation and interior consulting based on Yin-Yang Five Elements theory. We analyze the energy of homes, offices, and shops to provide optimal arrangement and interior direction for fortune enhancement.',
'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop&auto=format',
ARRAY['https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop&auto=format', 'https://images.unsplash.com/photo-1590736969955-71cc94901144?w=800&h=600&fit=crop&auto=format'],
'🏮',
'[{"id": 1, "icon": "🧭", "text": "정통 풍수지리학"}, {"id": 2, "icon": "🏠", "text": "실거주지 방문 상담"}, {"id": 3, "icon": "💼", "text": "사업장 풍수 컨설팅"}, {"id": 4, "icon": "📐", "text": "맞춤 인테리어 제안"}]',
120000, '현장 방문 2시간', '현장 방문 2시간', '2-hour on-site visit', 'KRW', 4.8, 67,
'02-555-0505', 'info@yinyang-fengshui.kr', '서울특별시 마포구 서교동 양화로 160, 메세나폴리스 8층',
'https://yinyang-fengshui.kr', '평일 10:00 - 18:00 (주말 예약 상담)', '평일 10:00 - 18:00 (주말 예약 상담)', 'Mon-Fri 10:00-18:00 (Weekend by appointment)',
'집과 사무실의 기운을 바꿔드립니다', '집과 사무실의 기운을 바꿔드립니다', 'Transform the energy of your home and office',
'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop&auto=format',
120000, 'MODERATE', 'INTERMEDIATE', 2, 25, '6ba7b814-9dad-11d1-80b4-00c04fd430c8'),

-- 6. 꿈해몽 전문원
('f6a7b8c9-d0e1-2345-6789-012345fabcde',
'몽해몽 꿈해석소', '몽해몽 꿈해석소', 'Dream Oracle Center',
'당신의 꿈이 전하는 메시지를 들려드립니다', '당신의 꿈이 전하는 메시지를 들려드립니다', 'Decode the messages your dreams are telling you',
'프로이트와 융의 정신분석학과 동양의 전통 꿈해몽학을 결합한 전문 꿈해석 서비스입니다.',
'프로이트와 융의 정신분석학과 동양의 전통 꿈해몽학을 결합한 전문 꿈해석 서비스입니다. 반복되는 꿈, 예지몽, 악몽의 의미를 과학적이고 영적인 관점에서 해석해드립니다.',
'Professional dream interpretation service combining Freud and Jung psychoanalysis with Eastern traditional dream interpretation. We interpret recurring dreams, prophetic dreams, and nightmares from both scientific and spiritual perspectives.',
'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=800&h=600&fit=crop&auto=format',
ARRAY['https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=800&h=600&fit=crop&auto=format', 'https://images.unsplash.com/photo-1444927714506-8492d94b5ba0?w=800&h=600&fit=crop&auto=format'],
'🌙',
'[{"id": 1, "icon": "💭", "text": "정신분석학 기반"}, {"id": 2, "icon": "📖", "text": "전통 꿈해몽학"}, {"id": 3, "icon": "🔮", "text": "예지몽 분석 전문"}, {"id": 4, "icon": "🌟", "text": "개인별 꿈 일기 관리"}]',
40000, '40분 상담', '40분 상담', '40min consultation', 'KRW', 4.5, 94,
'02-555-0606', 'info@dreamoracle.kr', '서울특별시 중구 명동2가 명동8길 29, 명동센트럴 6층',
'https://dreamoracle.kr', '매일 13:00 - 21:00', '매일 13:00 - 21:00', 'Daily 13:00 - 21:00',
'당신의 꿈이 전하는 메시지를 들려드립니다', '당신의 꿈이 전하는 메시지를 들려드립니다', 'Decode the messages your dreams are telling you',
'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=800&h=600&fit=crop&auto=format',
40000, 'LIGHT', 'BEGINNER', 1, 16, '6ba7b816-9dad-11d1-80b4-00c04fd430c8');

-- STEP 6: Create a view or function to return localized content based on language
-- This will be used by the frontend to get the right language content

-- STEP 7: Verification queries
SELECT 'Properly localized Korean fortune services added successfully!' as status;
SELECT COUNT(*) as total_locations FROM locations;
SELECT COUNT(*) as total_places FROM places;
SELECT title, title_ko, title_en, base_price FROM locations ORDER BY base_price;
