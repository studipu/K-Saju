-- Localized Korean Fortune Telling Services Data
-- Execute this script in your Supabase SQL Editor to replace all location data with Korean fortune telling services
-- This includes both Korean and English titles/descriptions for full localization support

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

-- STEP 4: Add Korean fortune telling services with English localization
INSERT INTO locations (
  id,
  title,
  subtitle,
  description,
  main_image_url,
  gallery_images,
  icon,
  features,
  base_price,
  price_description,
  currency,
  rating,
  review_count,
  phone,
  email,
  address,
  website,
  business_hours,
  tagline,
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
'미스틱 타로 살롱 | Mystic Tarot Salon', 
'신비로운 타로카드로 미래를 읽어드립니다 | Unlock your future with mystical tarot cards',
'프랑스에서 직수입한 정통 타로카드와 30년 경력의 타로마스터가 함께하는 프리미엄 타로 상담소입니다. 연애, 진로, 인간관계 등 궁금한 모든 것을 타로카드를 통해 명확히 해답을 찾아드립니다. | Premium tarot consultation featuring authentic French-imported tarot cards and a tarot master with 30 years of experience. Find clear answers to all your questions about love, career, and relationships through the wisdom of tarot cards.',
'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop&auto=format',
ARRAY['https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop&auto=format', 'https://images.unsplash.com/photo-1551431009-a802eeec77b1?w=800&h=600&fit=crop&auto=format'],
'🔮',
'[{"id": 1, "icon": "🃏", "text": "정통 프랑스 타로카드 | Authentic French Tarot"}, {"id": 2, "icon": "✨", "text": "30년 경력 타로마스터 | 30-Year Master"}, {"id": 3, "icon": "💕", "text": "연애운 특화 상담 | Love Reading Specialist"}, {"id": 4, "icon": "🎯", "text": "구체적 해답 제시 | Specific Answers"}]',
45000, '30분 상담 기준 | 30min consultation', 'KRW', 4.8, 89,
'02-555-0101', 'info@mystictarot.kr', '서울특별시 강남구 신사동 가로수길 45-7, 2층',
'https://mystictarot.kr', '매일 11:00 - 22:00 | Daily 11:00 - 22:00',
'신비로운 타로카드로 미래를 읽어드립니다 | Unlock your future with mystical tarot', 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop&auto=format',
45000, 'LIGHT', 'BEGINNER', 2, 18, 'f47ac10b-58cc-4372-a567-0e02b2c3d479'),

-- 2. 전통 사주명리학원 (Traditional Saju)
('b2c3d4e5-f6a7-8901-2345-678901bcdefb',
'동양명리 사주궁합소 | Oriental Saju Palace',
'천년 역사의 정통 사주명리학 | Traditional Saju with millennium history',
'조선왕조 궁중 명리학을 계승한 정통 사주명리 전문가가 직접 상담해드립니다. 사주팔자, 궁합, 택일, 개명까지 전통 명리학의 모든 영역을 다루며, 정확하고 체계적인 해석으로 인생의 방향을 제시합니다. | Expert consultation by traditional Saju masters who inherited Joseon Dynasty court astrology. We cover all aspects of traditional fortune-telling including birth charts, compatibility, auspicious dates, and name changing with accurate and systematic interpretations.',
'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop&auto=format',
ARRAY['https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop&auto=format', 'https://images.unsplash.com/photo-1578662015594-3020cd5c58ae?w=800&h=600&fit=crop&auto=format'],
'📜',
'[{"id": 1, "icon": "🏛️", "text": "조선왕조 궁중 명리학 | Joseon Court Astrology"}, {"id": 2, "icon": "📚", "text": "40년 명리학 연구 | 40 Years Research"}, {"id": 3, "icon": "💑", "text": "궁합 전문 상담 | Compatibility Expert"}, {"id": 4, "icon": "🌟", "text": "개명 및 택일 서비스 | Naming & Date Selection"}]',
80000, '60분 정밀 상담 | 60min detailed consultation', 'KRW', 4.9, 156,
'02-555-0202', 'info@sajugoong.kr', '서울특별시 강남구 청담동 청담로 89, 청담빌딩 3층',
'https://sajugoong.kr', '평일 09:00 - 18:00, 토요일 10:00 - 16:00 | Mon-Fri 09:00-18:00, Sat 10:00-16:00',
'천년 역사의 정통 사주명리학 | Traditional Saju with millennium history', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop&auto=format',
80000, 'MODERATE', 'ADVANCED', 3, 20, '6ba7b810-9dad-11d1-80b4-00c04fd430c8'),

-- 3. 수상술 관상학원 (Palm & Face Reading)
('c3d4e5f6-a7b8-9012-3456-789012cdefab',
'관상수상 운명학당 | Physiognomy & Palm Reading Center',
'손금과 얼굴로 읽는 당신의 운명 | Read your destiny through palms and face',
'손금(수상)과 관상을 통해 선천적 운명과 후천적 노력의 방향을 제시하는 전문 상담소입니다. 중국 정통 관상학과 인도 수상술을 결합하여 정확하고 실용적인 조언을 드립니다. | Expert consultation center providing guidance on innate destiny and future efforts through palm reading and physiognomy. We combine traditional Chinese face reading with Indian palmistry to offer accurate and practical advice.',
'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop&auto=format',
ARRAY['https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop&auto=format', 'https://images.unsplash.com/photo-1588392382834-a891154bca4d?w=800&h=600&fit=crop&auto=format'],
'✋',
'[{"id": 1, "icon": "👁️", "text": "정통 중국 관상학 | Traditional Chinese Physiognomy"}, {"id": 2, "icon": "🤲", "text": "인도 수상술 전문 | Indian Palmistry Expert"}, {"id": 3, "icon": "🔍", "text": "즉석 현장 분석 | Instant Analysis"}, {"id": 4, "icon": "💡", "text": "실용적 조언 제공 | Practical Advice"}]',
35000, '20분 신속 분석 | 20min quick analysis', 'KRW', 4.6, 73,
'02-555-0303', 'info@palmface.kr', '서울특별시 강남구 압구정동 압구정로 102, 로데오빌딩 5층',
'https://palmface.kr', '매일 12:00 - 21:00 | Daily 12:00 - 21:00',
'손금과 얼굴로 읽는 당신의 운명 | Read your destiny through palms and face', 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop&auto=format',
35000, 'LIGHT', 'BEGINNER', 1, 16, '6ba7b811-9dad-11d1-80b4-00c04fd430c8'),

-- 4. 크리스탈 힐링 센터 (Crystal Healing & Fortune)
('d4e5f6a7-b8c9-0123-4567-890123defabc',
'크리스탈 오라클 센터 | Crystal Oracle Center',
'수정의 에너지로 정화하고 미래를 봅니다 | Purify and see the future with crystal energy',
'천연 수정과 보석의 에너지를 활용한 오라클 리딩과 힐링 서비스를 제공합니다. 각종 수정의 파워와 오라클 카드를 통해 영적 성장과 내면의 평화를 찾아드립니다. | Oracle reading and healing services using the energy of natural crystals and gemstones. Find spiritual growth and inner peace through the power of various crystals and oracle cards.',
'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=600&fit=crop&auto=format',
ARRAY['https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=600&fit=crop&auto=format', 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=800&h=600&fit=crop&auto=format'],
'💎',
'[{"id": 1, "icon": "💎", "text": "천연 크리스탈 컬렉션 | Natural Crystal Collection"}, {"id": 2, "icon": "🌈", "text": "오라클 카드 리딩 | Oracle Card Reading"}, {"id": 3, "icon": "🧘", "text": "힐링 테라피 | Healing Therapy"}, {"id": 4, "icon": "✨", "text": "영적 성장 가이드 | Spiritual Growth Guide"}]',
50000, '45분 힐링 포함 | 45min with healing', 'KRW', 4.7, 112,
'02-555-0404', 'info@crystal-oracle.kr', '서울특별시 마포구 홍익로2가 홍익로5길 20, 홍대타워 4층',
'https://crystal-oracle.kr', '화-일 14:00 - 22:00 (월요일 휴무) | Tue-Sun 14:00-22:00 (Closed Mon)',
'수정의 에너지로 정화하고 미래를 봅니다 | Purify and see the future with crystal energy', 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=600&fit=crop&auto=format',
50000, 'LIGHT', 'BEGINNER', 4, 18, '6ba7b813-9dad-11d1-80b4-00c04fd430c8'),

-- 5. 음양오행 풍수지리원 (Feng Shui & Five Elements)
('e5f6a7b8-c9d0-1234-5678-901234efabcd',
'음양오행 풍수원 | Yin Yang Five Elements Feng Shui',
'집과 사무실의 기운을 바꿔드립니다 | Transform the energy of your home and office',
'음양오행 이론에 바탕한 전문 풍수 상담과 인테리어 컨설팅을 제공합니다. 집, 사무실, 상가의 기운을 분석하고 최적의 배치와 인테리어 방향을 제시하여 운세 상승을 도와드립니다. | Professional feng shui consultation and interior consulting based on Yin-Yang Five Elements theory. We analyze the energy of homes, offices, and shops to provide optimal arrangement and interior direction for fortune enhancement.',
'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop&auto=format',
ARRAY['https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop&auto=format', 'https://images.unsplash.com/photo-1590736969955-71cc94901144?w=800&h=600&fit=crop&auto=format'],
'🏮',
'[{"id": 1, "icon": "🧭", "text": "정통 풍수지리학 | Traditional Feng Shui"}, {"id": 2, "icon": "🏠", "text": "실거주지 방문 상담 | On-site Home Consultation"}, {"id": 3, "icon": "💼", "text": "사업장 풍수 컨설팅 | Business Feng Shui"}, {"id": 4, "icon": "📐", "text": "맞춤 인테리어 제안 | Custom Interior Design"}]',
120000, '현장 방문 2시간 | 2-hour on-site visit', 'KRW', 4.8, 67,
'02-555-0505', 'info@yinyang-fengshui.kr', '서울특별시 마포구 서교동 양화로 160, 메세나폴리스 8층',
'https://yinyang-fengshui.kr', '평일 10:00 - 18:00 (주말 예약 상담) | Mon-Fri 10:00-18:00 (Weekend by appointment)',
'집과 사무실의 기운을 바꿔드립니다 | Transform the energy of your home and office', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop&auto=format',
120000, 'MODERATE', 'INTERMEDIATE', 2, 25, '6ba7b814-9dad-11d1-80b4-00c04fd430c8'),

-- 6. 꿈해몽 전문원 (Dream Interpretation)
('f6a7b8c9-d0e1-2345-6789-012345fabcde',
'몽해몽 꿈해석소 | Dream Oracle Center',
'당신의 꿈이 전하는 메시지를 들려드립니다 | Decode the messages your dreams are telling you',
'프로이트와 융의 정신분석학과 동양의 전통 꿈해몽학을 결합한 전문 꿈해석 서비스입니다. 반복되는 꿈, 예지몽, 악몽의 의미를 과학적이고 영적인 관점에서 해석해드립니다. | Professional dream interpretation service combining Freud and Jung psychoanalysis with Eastern traditional dream interpretation. We interpret recurring dreams, prophetic dreams, and nightmares from both scientific and spiritual perspectives.',
'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=800&h=600&fit=crop&auto=format',
ARRAY['https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=800&h=600&fit=crop&auto=format', 'https://images.unsplash.com/photo-1444927714506-8492d94b5ba0?w=800&h=600&fit=crop&auto=format'],
'🌙',
'[{"id": 1, "icon": "💭", "text": "정신분석학 기반 | Psychoanalysis Based"}, {"id": 2, "icon": "📖", "text": "전통 꿈해몽학 | Traditional Dream Study"}, {"id": 3, "icon": "🔮", "text": "예지몽 분석 전문 | Prophetic Dream Expert"}, {"id": 4, "icon": "🌟", "text": "개인별 꿈 일기 관리 | Personal Dream Journal"}]',
40000, '40분 상담 | 40min consultation', 'KRW', 4.5, 94,
'02-555-0606', 'info@dreamoracle.kr', '서울특별시 중구 명동2가 명동8길 29, 명동센트럴 6층',
'https://dreamoracle.kr', '매일 13:00 - 21:00 | Daily 13:00 - 21:00',
'당신의 꿈이 전하는 메시지를 들려드립니다 | Decode the messages your dreams are telling you', 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=800&h=600&fit=crop&auto=format',
40000, 'LIGHT', 'BEGINNER', 1, 16, '6ba7b816-9dad-11d1-80b4-00c04fd430c8'),

-- 7. 지혜의 주역점소 (I-Ching Divination)
('a7b8c9d0-e1f2-3456-7890-123456abcdef',
'주역오행 지혜원 | I-Ching Five Elements Wisdom Center',
'3000년 주역의 지혜로 인생을 밝혀드립니다 | Illuminate your life with 3000 years of I-Ching wisdom',
'중국 고전 주역(易經)의 64괘를 통해 현재 상황을 분석하고 미래의 변화를 예측하는 동양 최고의 점술입니다. 복잡한 인생 문제에 대한 명확한 방향과 행동 지침을 제시합니다. | The supreme Oriental divination analyzing current situations and predicting future changes through the 64 hexagrams of the ancient Chinese I-Ching. Provides clear direction and action guidelines for complex life problems.',
'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop&auto=format',
ARRAY['https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop&auto=format', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop&auto=format'],
'☯️',
'[{"id": 1, "icon": "📿", "text": "정통 주역 64괘 | Authentic 64 Hexagrams"}, {"id": 2, "icon": "🎋", "text": "신전 방식 점술 | Temple-style Divination"}, {"id": 3, "icon": "🔍", "text": "상세한 괘사 해석 | Detailed Hexagram Reading"}, {"id": 4, "icon": "🗓️", "text": "시기별 행동 지침 | Timing Action Guide"}]',
60000, '50분 정밀 해석 | 50min detailed reading', 'KRW', 4.9, 128,
'02-555-0707', 'info@iching-wisdom.kr', '서울특별시 중구 을지로3가 을지로15길 7, 을지빌딩 7층',
'https://iching-wisdom.kr', '평일 10:00 - 19:00, 토요일 11:00 - 17:00 | Mon-Fri 10:00-19:00, Sat 11:00-17:00',
'3000년 주역의 지혜로 인생을 밝혀드립니다 | Illuminate your life with 3000 years of I-Ching wisdom', 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop&auto=format',
60000, 'MODERATE', 'INTERMEDIATE', 2, 21, '6ba7b817-9dad-11d1-80b4-00c04fd430c8'),

-- 8. 전통차와 명상 점술소 (Traditional Tea & Meditation Divination)
('b8c9d0e1-f2a3-4567-8901-234567bcdef8',
'다선일체 명상원 | Tea Zen Unity Meditation Center',
'차 한 잔의 여유 속에서 찾는 내면의 목소리 | Find your inner voice in the tranquility of tea',
'전통 차문화와 명상을 결합한 독특한 점술 공간입니다. 정성스럽게 우린 차를 마시며 마음을 정화하고, 명상을 통해 내면의 지혜와 직감을 깨워 인생의 답을 찾아드립니다. | Unique divination space combining traditional tea culture with meditation. Purify your mind with carefully brewed tea and awaken inner wisdom and intuition through meditation to find lifes answers.',
'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=800&h=600&fit=crop&auto=format',
ARRAY['https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=800&h=600&fit=crop&auto=format', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop&auto=format'],
'🍵',
'[{"id": 1, "icon": "🍃", "text": "명품 전통차 | Premium Traditional Tea"}, {"id": 2, "icon": "🧘‍♀️", "text": "가이드 명상 | Guided Meditation"}, {"id": 3, "icon": "🕯️", "text": "힐링 공간 | Healing Space"}, {"id": 4, "icon": "💆‍♀️", "text": "차크라 정화 | Chakra Cleansing"}]',
55000, '90분 풀코스 | 90min full course', 'KRW', 4.6, 85,
'02-555-0808', 'info@tea-meditation.kr', '서울특별시 종로구 인사동 인사동길 35, 인사아트센터 3층',
'https://tea-meditation.kr', '매일 11:00 - 20:00 | Daily 11:00 - 20:00',
'차 한 잔의 여유 속에서 찾는 내면의 목소리 | Find your inner voice in the tranquility of tea', 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=800&h=600&fit=crop&auto=format',
55000, 'LIGHT', 'BEGINNER', 3, 18, '6ba7b819-9dad-11d1-80b4-00c04fd430c8'),

-- 9. 달과 별자리 점성술원 (Lunar & Astrology)
('c9d0e1f2-a3b4-5678-9012-345678cdefab',
'문스타 점성술원 | Moon Star Astrology Center',
'달의 리듬과 별자리가 알려주는 우주의 메시지 | Cosmic messages revealed by lunar rhythms and constellations',
'서양 점성술과 동양의 음력 체계를 결합한 특별한 점술 서비스입니다. 개인의 출생 차트 분석, 달의 위상에 따른 운세, 별자리별 운명 해석을 통해 우주적 관점에서 인생을 조망합니다. | Special divination service combining Western astrology with Eastern lunar calendar systems. View life from a cosmic perspective through personal birth chart analysis, lunar phase fortune reading, and zodiac destiny interpretation.',
'https://images.unsplash.com/photo-1519608487953-e999c86e7455?w=800&h=600&fit=crop&auto=format',
ARRAY['https://images.unsplash.com/photo-1519608487953-e999c86e7455?w=800&h=600&fit=crop&auto=format', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop&auto=format'],
'🌟',
'[{"id": 1, "icon": "🌙", "text": "음력 체계 점술 | Lunar Calendar Divination"}, {"id": 2, "icon": "⭐", "text": "서양 점성술 | Western Astrology"}, {"id": 3, "icon": "🔭", "text": "출생 차트 분석 | Birth Chart Analysis"}, {"id": 4, "icon": "🌌", "text": "우주적 관점 해석 | Cosmic Perspective"}]',
65000, '60분 차트 분석 | 60min chart analysis', 'KRW', 4.7, 103,
'02-555-0909', 'info@moonstar-astro.kr', '서울특별시 성북구 성신여대입구역 동소문로 47, 성신빌딩 2층',
'https://moonstar-astro.kr', '화-토 15:00 - 22:00 (일, 월 휴무) | Tue-Sat 15:00-22:00 (Closed Sun-Mon)',
'달의 리듬과 별자리가 알려주는 우주의 메시지 | Cosmic messages revealed by lunar rhythms and constellations', 'https://images.unsplash.com/photo-1519608487953-e999c86e7455?w=800&h=600&fit=crop&auto=format',
65000, 'MODERATE', 'INTERMEDIATE', 2, 20, '6ba7b81a-9dad-11d1-80b4-00c04fd430c8'),

-- 10. 하늘에서 내린 운명학원 (Sky Fortune Reading)
('d0e1f2a3-b4c5-6789-0123-456789defabc',
'하늘궁전 운명원 | Sky Palace Destiny Center',
'하늘의 뜻을 읽어 지상의 길을 밝힙니다 | Read heavens will to illuminate the earthly path',
'높은 곳에서 내려다보는 하늘의 시선으로 인생 전체를 조망하는 특별한 점술 서비스입니다. 31층 하늘 위 전망과 함께 광활한 우주의 기운을 받아 더욱 정확하고 깊이 있는 운세를 제공합니다. | Special divination service viewing life from the perspective of heaven looking down from high above. Receive more accurate and profound fortune readings with the vast cosmic energy alongside the 31st floor sky view.',
'https://images.unsplash.com/photo-1480497490787-505ec076689f?w=800&h=600&fit=crop&auto=format',
ARRAY['https://images.unsplash.com/photo-1480497490787-505ec076689f?w=800&h=600&fit=crop&auto=format', 'https://images.unsplash.com/photo-1519608487953-e999c86e7455?w=800&h=600&fit=crop&auto=format'],
'🏯',
'[{"id": 1, "icon": "🌅", "text": "31층 하늘 뷰 | 31st Floor Sky View"}, {"id": 2, "icon": "☁️", "text": "우주 기운 점술 | Cosmic Energy Divination"}, {"id": 3, "icon": "🗻", "text": "인생 전체 조망 | Whole Life Overview"}, {"id": 4, "icon": "🎆", "text": "프리미엄 공간 | Premium Space"}]',
150000, '90분 VIP 상담 | 90min VIP consultation', 'KRW', 4.9, 76,
'02-555-1010', 'info@sky-palace.kr', '서울특별시 송파구 잠실동 올림픽로 240, 롯데월드타워 스카이31 31층',
'https://sky-palace.kr', '매일 10:00 - 20:00 (완전 예약제) | Daily 10:00-20:00 (By appointment only)',
'하늘의 뜻을 읽어 지상의 길을 밝힙니다 | Read heavens will to illuminate the earthly path', 'https://images.unsplash.com/photo-1480497490787-505ec076689f?w=800&h=600&fit=crop&auto=format',
150000, 'LIGHT', 'BEGINNER', 1, 25, '6ba7b81c-9dad-11d1-80b4-00c04fd430c8'),

-- 11. 별자리 운세 카페 (Star Sign Cafe)
('e1f2a3b4-c5d6-7890-1234-567890efabcd',
'스타사인 카페 | Star Sign Cafe',
'맛있는 커피와 함께 즐기는 가벼운 별자리 운세 | Light zodiac fortune with delicious coffee',
'캐주얼하고 편안한 분위기에서 즐기는 별자리 운세 카페입니다. 특제 커피나 차를 마시며 오늘의 운세, 주간 운세, 월간 운세를 확인하고, 간단한 타로나 별자리 상담을 받을 수 있습니다. | Zodiac fortune cafe in a casual and comfortable atmosphere. Check daily, weekly, and monthly horoscopes while enjoying specialty coffee or tea, and receive simple tarot or zodiac consultations.',
'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&h=600&fit=crop&auto=format',
ARRAY['https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&h=600&fit=crop&auto=format', 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=800&h=600&fit=crop&auto=format'],
'☕',
'[{"id": 1, "icon": "☕", "text": "프리미엄 커피 | Premium Coffee"}, {"id": 2, "icon": "🌟", "text": "12별자리 운세 | 12 Zodiac Signs"}, {"id": 3, "icon": "🍰", "text": "디저트 포함 | Dessert Included"}, {"id": 4, "icon": "📱", "text": "SNS 운세 제공 | SNS Fortune Service"}]',
25000, '30분 + 음료 | 30min + drink', 'KRW', 4.4, 142,
'02-555-1111', 'info@starsign-cafe.kr', '서울특별시 강동구 천호동 천중로 206, 천호역 메가박스 6층',
'https://starsign-cafe.kr', '매일 10:00 - 23:00 | Daily 10:00 - 23:00',
'맛있는 커피와 함께 즐기는 가벼운 별자리 운세 | Light zodiac fortune with delicious coffee', 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&h=600&fit=crop&auto=format',
25000, 'LIGHT', 'BEGINNER', 4, 16, '6ba7b81d-9dad-11d1-80b4-00c04fd430c8'),

-- 12. 수비학 전문원 (Numerology Center) - NEW for discount section
('f1f2a3b4-c5d6-7890-1234-567890efabce',
'신비 수비학 연구소 | Mystic Numerology Institute',
'숫자로 풀어내는 당신만의 운명 코드 | Decode your unique destiny through numbers',
'고대부터 전해내려온 수비학의 신비한 힘으로 개인의 운명 번호를 분석합니다. 생년월일과 이름의 숫자 조합을 통해 성격, 적성, 연애운, 재물운 등을 정확히 해석해드립니다. | Analyze personal destiny numbers through the mystical power of numerology passed down from ancient times. Accurately interpret personality, aptitude, love fortune, and wealth fortune through the numerical combination of birth date and name.',
'https://images.unsplash.com/photo-1509909756405-be0199881695?w=800&h=600&fit=crop&auto=format',
ARRAY['https://images.unsplash.com/photo-1509909756405-be0199881695?w=800&h=600&fit=crop&auto=format', 'https://images.unsplash.com/photo-1516690561799-46d8f74f9abf?w=800&h=600&fit=crop&auto=format'],
'🔢',
'[{"id": 1, "icon": "📊", "text": "개인 운명 번호 분석 | Personal Destiny Number"}, {"id": 2, "icon": "💰", "text": "재물운 특화 | Wealth Fortune Specialist"}, {"id": 3, "icon": "🎯", "text": "정확한 수치 해석 | Precise Numerical Reading"}, {"id": 4, "icon": "📈", "text": "미래 예측 차트 | Future Prediction Chart"}]',
38000, '35분 수비 분석 | 35min numerology analysis', 'KRW', 4.5, 67,
'02-555-1212', 'info@numerology-mystic.kr', '서울특별시 강남구 역삼동 테헤란로 152, 강남파이낸스센터 12층',
'https://numerology-mystic.kr', '평일 09:00 - 19:00, 토요일 10:00 - 17:00 | Mon-Fri 09:00-19:00, Sat 10:00-17:00',
'숫자로 풀어내는 당신만의 운명 코드 | Decode your unique destiny through numbers', 'https://images.unsplash.com/photo-1509909756405-be0199881695?w=800&h=600&fit=crop&auto=format',
38000, 'LIGHT', 'BEGINNER', 2, 18, '6ba7b812-9dad-11d1-80b4-00c04fd430c8'),

-- 13. 룬 문자 점술소 (Rune Divination) - NEW for discount section
('f2f3a4b5-c6d7-8901-2345-678901efabcf',
'바이킹 룬 스톤 | Viking Rune Stone',
'고대 바이킹의 신비한 룬 문자로 미래를 예언합니다 | Prophesy the future with ancient Viking rune stones',
'북유럽 바이킹 시대부터 내려온 신성한 룬 문자의 힘으로 운명을 점칩니다. 24개의 룬 스톤을 통해 과거, 현재, 미래의 흐름을 읽고 중요한 결정에 도움이 되는 조언을 제공합니다. | Divine destiny through the power of sacred rune letters passed down from the Nordic Viking era. Read the flow of past, present, and future through 24 rune stones and provide advice for important decisions.',
'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop&auto=format',
ARRAY['https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop&auto=format', 'https://images.unsplash.com/photo-1551431009-a802eeec77b1?w=800&h=600&fit=crop&auto=format'],
'🪨',
'[{"id": 1, "icon": "⚔️", "text": "바이킹 전통 룬 | Viking Traditional Runes"}, {"id": 2, "icon": "🔮", "text": "24개 룬 스톤 | 24 Rune Stones"}, {"id": 3, "icon": "🌊", "text": "과거현재미래 | Past Present Future"}, {"id": 4, "icon": "🛡️", "text": "의사결정 가이드 | Decision Making Guide"}]',
42000, '25분 룬 리딩 | 25min rune reading', 'KRW', 4.6, 89,
'02-555-1313', 'info@viking-runes.kr', '서울특별시 마포구 상수동 월드컵로 25길 19, 상수빌딩 3층',
'https://viking-runes.kr', '매일 12:00 - 20:00 | Daily 12:00 - 20:00',
'고대 바이킹의 신비한 룬 문자로 미래를 예언합니다 | Prophesy the future with ancient Viking rune stones', 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop&auto=format',
42000, 'LIGHT', 'BEGINNER', 1, 16, '6ba7b815-9dad-11d1-80b4-00c04fd430c8'),

-- 14. 차크라 힐링 센터 (Chakra Healing) - NEW for discount section
('f3f4a5b6-c7d8-9012-3456-789012efabcd',
'차크라 밸런스 센터 | Chakra Balance Center',
'7개 차크라의 균형으로 완전한 치유를 경험하세요 | Experience complete healing through 7 chakra balance',
'인체의 7개 차크라 에너지 센터를 정화하고 균형을 맞춰주는 전문 힐링 센터입니다. 차크라 진단, 에너지 클렌징, 음성 치료, 크리스탈 테라피를 통해 몸과 마음의 완전한 회복을 도와드립니다. | Professional healing center that purifies and balances the 7 chakra energy centers of the human body. Help complete recovery of body and mind through chakra diagnosis, energy cleansing, sound therapy, and crystal therapy.',
'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop&auto=format',
ARRAY['https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop&auto=format', 'https://images.unsplash.com/photo-1578662015594-3020cd5c58ae?w=800&h=600&fit=crop&auto=format'],
'🌈',
'[{"id": 1, "icon": "🔴", "text": "7개 차크라 진단 | 7 Chakra Diagnosis"}, {"id": 2, "icon": "🎵", "text": "음성 치료 | Sound Therapy"}, {"id": 3, "icon": "💎", "text": "크리스탈 테라피 | Crystal Therapy"}, {"id": 4, "icon": "✨", "text": "에너지 클렌징 | Energy Cleansing"}]',
75000, '60분 차크라 힐링 | 60min chakra healing', 'KRW', 4.8, 94,
'02-555-1414', 'info@chakra-balance.kr', '서울특별시 중구 회현동 소공로 70, 회현빌딩 5층',
'https://chakra-balance.kr', '화-일 11:00 - 21:00 (월요일 휴무) | Tue-Sun 11:00-21:00 (Closed Mon)',
'7개 차크라의 균형으로 완전한 치유를 경험하세요 | Experience complete healing through 7 chakra balance', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop&auto=format',
75000, 'MODERATE', 'INTERMEDIATE', 3, 20, '6ba7b818-9dad-11d1-80b4-00c04fd430c8'),

-- 15. 영성 상담소 (Spiritual Counseling) - NEW for discount section
('f4f5a6b7-c8d9-0123-4567-890123efabce',
'영혼의 안식처 | Soul Sanctuary',
'깊은 영적 통찰로 인생의 진정한 의미를 찾아드립니다 | Find true meaning of life through deep spiritual insights',
'영성 상담 전문가와 함께 내면의 목소리에 귀 기울이고 영혼의 성장을 도모하는 특별한 공간입니다. 명상 가이드, 영적 상담, 전생 회귀, 아카식 레코드 리딩을 통해 인생의 근본적인 질문에 답을 찾아드립니다. | Special space to listen to inner voice and promote soul growth with spiritual counseling experts. Find answers to fundamental life questions through meditation guidance, spiritual counseling, past life regression, and Akashic Records reading.',
'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=800&h=600&fit=crop&auto=format',
ARRAY['https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=800&h=600&fit=crop&auto=format', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop&auto=format'],
'🕊️',
'[{"id": 1, "icon": "🧘", "text": "명상 가이드 | Meditation Guide"}, {"id": 2, "icon": "👁️", "text": "전생 회귀 | Past Life Regression"}, {"id": 3, "icon": "📜", "text": "아카식 레코드 | Akashic Records"}, {"id": 4, "icon": "💫", "text": "영혼 성장 코칭 | Soul Growth Coaching"}]',
90000, '75분 영성 상담 | 75min spiritual counseling', 'KRW', 4.9, 112,
'02-555-1515', 'info@soul-sanctuary.kr', '서울특별시 종로구 종로3가 종로 69, 종로타워 8층',
'https://soul-sanctuary.kr', '평일 10:00 - 18:00, 토요일 09:00 - 15:00 | Mon-Fri 10:00-18:00, Sat 09:00-15:00',
'깊은 영적 통찰로 인생의 진정한 의미를 찾아드립니다 | Find true meaning of life through deep spiritual insights', 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=800&h=600&fit=crop&auto=format',
90000, 'MODERATE', 'INTERMEDIATE', 2, 21, '6ba7b81b-9dad-11d1-80b4-00c04fd430c8'),

-- 16. 미스틱 오라클 센터 (Mystic Oracle) - NEW for discount section
('f5f6a7b8-c9d0-1234-5678-901234efabcf',
'미스틱 오라클 센터 | Mystic Oracle Center',
'신비한 오라클 카드가 전하는 우주의 메시지 | Cosmic messages delivered by mystical oracle cards',
'세계 각국의 다양한 오라클 카드를 활용한 전문 리딩 센터입니다. 천사 카드, 여신 카드, 동물 영혼 카드 등을 통해 우주와 영혼의 가이던스를 받아 현재 상황에 맞는 최적의 조언을 제공합니다. | Professional reading center utilizing various oracle cards from around the world. Receive cosmic and soul guidance through angel cards, goddess cards, animal spirit cards, etc., providing optimal advice for current situations.',
'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=600&fit=crop&auto=format',
ARRAY['https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=600&fit=crop&auto=format', 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=800&h=600&fit=crop&auto=format'],
'🃏',
'[{"id": 1, "icon": "👼", "text": "천사 카드 리딩 | Angel Card Reading"}, {"id": 2, "icon": "🦋", "text": "동물 영혼 가이드 | Animal Spirit Guide"}, {"id": 3, "icon": "🌙", "text": "여신 카드 | Goddess Cards"}, {"id": 4, "icon": "🌟", "text": "우주 메시지 | Cosmic Messages"}]',
48000, '40분 오라클 리딩 | 40min oracle reading', 'KRW', 4.7, 156,
'02-555-1616', 'info@mystic-oracle.kr', '서울특별시 서초구 서초동 서초대로 77길 41, 서초타워 9층',
'https://mystic-oracle.kr', '매일 13:00 - 21:00 | Daily 13:00 - 21:00',
'신비한 오라클 카드가 전하는 우주의 메시지 | Cosmic messages delivered by mystical oracle cards', 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=600&fit=crop&auto=format',
48000, 'LIGHT', 'BEGINNER', 2, 18, '6ba7b81f-9dad-11d1-80b4-00c04fd430c8'),

-- 17. 오라클 카드 카페 (Oracle Card Cafe) - NEW for discount section
('f6f7a8b9-c0d1-2345-6789-012345efabcd',
'오라클 가든 카페 | Oracle Garden Cafe',
'힐링 음료와 함께하는 편안한 오라클 카드 체험 | Comfortable oracle card experience with healing beverages',
'아늑한 카페 분위기에서 즐기는 오라클 카드 리딩 공간입니다. 허브티나 디톡스 주스를 마시며 일상의 고민이나 궁금증을 오라클 카드로 해결해보세요. 친구들과 함께 가볍게 즐길 수 있는 그룹 리딩도 가능합니다. | Oracle card reading space in a cozy cafe atmosphere. Solve daily worries and curiosities with oracle cards while enjoying herbal tea or detox juice. Group readings for light enjoyment with friends are also available.',
'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&h=600&fit=crop&auto=format',
ARRAY['https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&h=600&fit=crop&auto=format', 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=800&h=600&fit=crop&auto=format'],
'🌸',
'[{"id": 1, "icon": "☕", "text": "힐링 음료 | Healing Beverages"}, {"id": 2, "icon": "👥", "text": "그룹 리딩 | Group Reading"}, {"id": 3, "icon": "🌿", "text": "허브 가든 | Herb Garden"}, {"id": 4, "icon": "📱", "text": "셀프 카드 체험 | Self Card Experience"}]',
28000, '20분 + 음료 | 20min + drink', 'KRW', 4.3, 198,
'02-555-1717', 'info@oracle-garden.kr', '서울특별시 강남구 삼성동 영동대로 513, 코엑스몰 B1층',
'https://oracle-garden.kr', '매일 09:00 - 22:00 | Daily 09:00 - 22:00',
'힐링 음료와 함께하는 편안한 오라클 카드 체험 | Comfortable oracle card experience with healing beverages', 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&h=600&fit=crop&auto=format',
28000, 'LIGHT', 'BEGINNER', 6, 16, '6ba7b820-9dad-11d1-80b4-00c04fd430c8'),

-- 18. 포춘 플라자 (Fortune Plaza) - NEW for discount section
('f7f8a9b0-c1d2-3456-7890-123456efabce',
'포춘 플라자 | Fortune Plaza',
'여의도 금융가의 프리미엄 종합 운세 센터 | Premium comprehensive fortune center in Yeouido financial district',
'여의도 금융 중심가에 위치한 고급 종합 운세 센터입니다. 사주, 타로, 관상, 수상을 한 곳에서 모두 경험할 수 있으며, 비즈니스 운세와 투자 타이밍 상담에 특화되어 있습니다. 금융인들이 신뢰하는 전문 상담소입니다. | Luxury comprehensive fortune center located in Yeouido financial district. Experience Saju, tarot, physiognomy, and palmistry all in one place, specializing in business fortune and investment timing consultation. A professional consulting center trusted by financial professionals.',
'https://images.unsplash.com/photo-1480497490787-505ec076689f?w=800&h=600&fit=crop&auto=format',
ARRAY['https://images.unsplash.com/photo-1480497490787-505ec076689f?w=800&h=600&fit=crop&auto=format', 'https://images.unsplash.com/photo-1519608487953-e999c86e7455?w=800&h=600&fit=crop&auto=format'],
'💼',
'[{"id": 1, "icon": "📈", "text": "비즈니스 운세 | Business Fortune"}, {"id": 2, "icon": "💰", "text": "투자 타이밍 | Investment Timing"}, {"id": 3, "icon": "🏢", "text": "금융가 전문 | Financial District Expert"}, {"id": 4, "icon": "🎯", "text": "종합 상담 | Comprehensive Reading"}]',
95000, '70분 종합 상담 | 70min comprehensive consultation', 'KRW', 4.8, 124,
'02-555-1818', 'info@fortune-plaza.kr', '서울특별시 영등포구 여의도동 국제금융로 10, IFC몰 3층',
'https://fortune-plaza.kr', '평일 08:00 - 20:00, 토요일 10:00 - 17:00 | Mon-Fri 08:00-20:00, Sat 10:00-17:00',
'여의도 금융가의 프리미엄 종합 운세 센터 | Premium comprehensive fortune center in Yeouido financial district', 'https://images.unsplash.com/photo-1480497490787-505ec076689f?w=800&h=600&fit=crop&auto=format',
95000, 'MODERATE', 'ADVANCED', 3, 25, '6ba7b821-9dad-11d1-80b4-00c04fd430c8'),

-- 19. 타임스퀘어 운명학원 (Times Square Destiny) - NEW for discount section
('f8f9a0b1-c2d3-4567-8901-234567efabcf',
'타임스퀘어 운명학원 | Times Square Destiny Academy',
'현대적 감각의 젊은 운세 상담소 | Modern young fortune consultation center',
'영등포 타임스퀘어에 위치한 젊은 세대를 위한 현대적 운세 상담소입니다. SNS 맞춤 운세, 연애 상담, 진로 상담에 특화되어 있으며, 20-30대가 편안하게 방문할 수 있는 트렌디한 분위기를 자랑합니다. | Modern fortune consultation center for young generation located in Yeongdeungpo Times Square. Specialized in SNS-customized fortune, love consultation, and career counseling, boasting a trendy atmosphere where people in their 20s-30s can visit comfortably.',
'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop&auto=format',
ARRAY['https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop&auto=format', 'https://images.unsplash.com/photo-1551431009-a802eeec77b1?w=800&h=600&fit=crop&auto=format'],
'📱',
'[{"id": 1, "icon": "💕", "text": "연애 상담 특화 | Love Consultation"}, {"id": 2, "icon": "🎓", "text": "진로 상담 | Career Guidance"}, {"id": 3, "icon": "📸", "text": "SNS 맞춤 운세 | SNS Custom Fortune"}, {"id": 4, "icon": "🌟", "text": "젊은 감각 | Young Sensibility"}]',
32000, '25분 젊은 운세 | 25min young fortune', 'KRW', 4.4, 267,
'02-555-1919', 'info@times-destiny.kr', '서울특별시 영등포구 영등포동 영중로 15, 타임스퀘어 12층',
'https://times-destiny.kr', '매일 11:00 - 23:00 | Daily 11:00 - 23:00',
'현대적 감각의 젊은 운세 상담소 | Modern young fortune consultation center', 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop&auto=format',
32000, 'LIGHT', 'BEGINNER', 3, 16, '6ba7b822-9dad-11d1-80b4-00c04fd430c8'),

-- 20. 문정 에너지 센터 (Munjeong Energy Center) - NEW for discount section
('f9f0a1b2-c3d4-5678-9012-345678efabcd',
'문정 에너지 센터 | Munjeong Energy Center',
'에너지 힐링과 운세의 완벽한 조화 | Perfect harmony of energy healing and fortune telling',
'송파구 문정동에 위치한 에너지 힐링과 운세 상담을 결합한 통합 센터입니다. 레이키, 프라닉 힐링, 에너지 클렌징과 함께 개인 맞춤 운세 상담을 제공하여 몸과 마음, 영혼의 전인적 치유를 도와드립니다. | Integrated center combining energy healing and fortune consultation located in Munjeong-dong, Songpa-gu. Provides holistic healing of body, mind, and soul by offering personalized fortune consultation along with Reiki, pranic healing, and energy cleansing.',
'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop&auto=format',
ARRAY['https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop&auto=format', 'https://images.unsplash.com/photo-1590736969955-71cc94901144?w=800&h=600&fit=crop&auto=format'],
'⚡',
'[{"id": 1, "icon": "🙌", "text": "레이키 힐링 | Reiki Healing"}, {"id": 2, "icon": "💨", "text": "프라닉 힐링 | Pranic Healing"}, {"id": 3, "icon": "🌀", "text": "에너지 클렌징 | Energy Cleansing"}, {"id": 4, "icon": "🎯", "text": "통합 상담 | Integrated Consultation"}]',
68000, '50분 통합 힐링 | 50min integrated healing', 'KRW', 4.6, 78,
'02-555-2020', 'info@munjeong-energy.kr', '서울특별시 송파구 문정동 법원로 127, 문정역 센트럴 4층',
'https://munjeong-energy.kr', '화-토 10:00 - 19:00, 일요일 11:00 - 17:00 | Tue-Sat 10:00-19:00, Sun 11:00-17:00',
'에너지 힐링과 운세의 완벽한 조화 | Perfect harmony of energy healing and fortune telling', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop&auto=format',
68000, 'MODERATE', 'INTERMEDIATE', 2, 20, '6ba7b81e-9dad-11d1-80b4-00c04fd430c8');

-- STEP 5: Verify the clean localized data
SELECT 'All unrelated location data deleted and localized Korean fortune services added successfully!' as status;
SELECT COUNT(*) as total_locations FROM locations;
SELECT COUNT(*) as total_places FROM places;
SELECT title, base_price, rating FROM locations ORDER BY base_price;
