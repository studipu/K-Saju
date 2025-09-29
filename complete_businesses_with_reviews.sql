-- Complete Korean Fortune Businesses with Individual Reviews and Geolocations
-- This creates 21 separate businesses, each with unique reviews and proper Google Maps coordinates

-- STEP 1: Clear existing data
DELETE FROM location_reviews;
DELETE FROM locations;
DELETE FROM places;

-- STEP 2: Add localization columns if they don't exist
ALTER TABLE locations 
ADD COLUMN IF NOT EXISTS title_en TEXT,
ADD COLUMN IF NOT EXISTS title_ko TEXT,
ADD COLUMN IF NOT EXISTS subtitle_en TEXT,
ADD COLUMN IF NOT EXISTS subtitle_ko TEXT,
ADD COLUMN IF NOT EXISTS tagline_en TEXT,
ADD COLUMN IF NOT EXISTS tagline_ko TEXT;

-- STEP 3: Create 21 places with real Seoul coordinates
INSERT INTO places (id, region, city, district, postal_code, address_line, place_label, latitude, longitude) VALUES
-- Gangnam District (1-7) - Popular Services
('11111111-1111-4111-8111-111111111111', '서울특별시', '강남구', '신사동', '06028', '가로수길 45-7, 2층', 'mystic-tarot-garosu', 37.5209, 127.0230),
('22222222-2222-4222-8222-222222222222', '서울특별시', '강남구', '청담동', '06015', '청담로 89, 청담빌딩 3층', 'oriental-saju-cheongdam', 37.5272, 127.0432),
('33333333-3333-4333-8333-333333333333', '서울특별시', '강남구', '압구정동', '06001', '압구정로 102, 로데오빌딩 5층', 'palm-face-apgujeong', 37.5264, 127.0286),
('44444444-4444-4444-8444-444444444444', '서울특별시', '강남구', '역삼동', '06236', '테헤란로 152, 강남파이낸스센터 12층', 'numerology-yeoksam', 37.5012, 127.0396),
('55555555-5555-4555-8555-555555555555', '서울특별시', '강남구', '선릉역', '06295', '선릉로 521, 선릉타워 15층', 'crystal-seolleung', 37.5044, 127.0495),
('66666666-6666-4666-8666-666666666666', '서울특별시', '강남구', '논현동', '06292', '학동로 426, 논현빌딩 8층', 'fengshui-nonhyeon', 37.5115, 127.0220),
('77777777-7777-4777-8777-777777777777', '서울특별시', '강남구', '삼성동', '06164', '영동대로 513, 코엑스몰 3층', 'dream-samsung', 37.5115, 127.0590),

-- Hongdae/Mapo District (8-14) - Recommended Services  
('88888888-8888-4888-8888-888888888888', '서울특별시', '마포구', '홍익로2가', '04039', '홍익로5길 20, 홍대타워 4층', 'iching-hongdae', 37.5563, 126.9236),
('99999999-9999-4999-8999-999999999999', '서울특별시', '마포구', '서교동', '04053', '양화로 160, 메세나폴리스 8층', 'tea-zen-seogyo', 37.5564, 126.9226),
('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', '서울특별시', '마포구', '상수동', '04055', '월드컵로 25길 19, 상수빌딩 3층', 'astro-sangsu', 37.5477, 126.9227),
('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb', '서울특별시', '마포구', '합정동', '04051', '합정로 7길 25, 합정센터 6층', 'sky-palace-hapjeong', 37.5499, 126.9131),
('cccccccc-cccc-4ccc-8ccc-cccccccccccc', '서울특별시', '마포구', '망원동', '04048', '월드컵로 32길 14, 망원빌딩 2층', 'star-cafe-mangwon', 37.5560, 126.9068),
('dddddddd-dddd-4ddd-8ddd-dddddddddddd', '서울특별시', '마포구', '연남동', '03985', '월드컵로1길 52, 연남타워 7층', 'rune-stone-yeonnam', 37.5658, 126.9254),
('eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee', '서울특별시', '마포구', '성산동', '03914', '성산로 684, 성산빌딩 5층', 'chakra-seongsan', 37.5765, 126.9134),

-- Jung-gu/Others (15-21) - Hot Deals Services
('ffffffff-ffff-4fff-8fff-ffffffffffff', '서울특별시', '중구', '명동2가', '04536', '명동8길 29, 명동센트럴 6층', 'soul-sanctuary-myeongdong', 37.5636, 126.9834),
('aaaabbbb-cccc-4ddd-8eee-ffffaaaabbbb', '서울특별시', '중구', '을지로3가', '04548', '을지로15길 7, 을지빌딩 7층', 'oracle-center-euljiro', 37.5665, 126.9910),
('bbbbcccc-dddd-4eee-8fff-aaaaabbbbccc', '서울특별시', '종로구', '인사동', '03148', '인사동길 35, 인사아트센터 3층', 'garden-cafe-insadong', 37.5717, 126.9854),
('ccccdddd-eeee-4fff-8aaa-bbbbccccdddd', '서울특별시', '성북구', '성신여대입구역', '02844', '동소문로 47, 성신빌딩 2층', 'fortune-plaza-seongbuk', 37.5928, 127.0163),
('ddddeeee-ffff-4aaa-8bbb-ccccddddeeee', '서울특별시', '종로구', '종로3가', '03189', '종로 69, 종로타워 8층', 'times-academy-jongno', 37.5703, 126.9910),
('eeeeffff-aaaa-4bbb-8ccc-ddddeeeeefff', '서울특별시', '영등포구', '여의도동', '07327', '국제금융로 10, IFC몰 3층', 'energy-center-yeouido', 37.5254, 126.9246),
('ffffaaaa-bbbb-4ccc-8ddd-eeeeffffaaaa', '서울특별시', '송파구', '잠실동', '05551', '올림픽로 240, 롯데월드타워 스카이31 31층', 'premium-sky-jamsil', 37.5125, 127.1025);

-- STEP 4: Create 21 Korean fortune telling businesses with full localization
INSERT INTO locations (
  id, title, title_ko, title_en, subtitle, subtitle_ko, subtitle_en,
  description, main_image_url, gallery_images, icon, features,
  base_price, price_description, currency, rating, review_count,
  phone, email, address, website, business_hours,
  tagline, tagline_ko, tagline_en, image_url, price_krw,
  activity_level, skill_level, max_guests_total, min_age, place_id
) VALUES 

-- POPULAR SERVICES (1-7)
('11111111-1111-4111-8111-111111111111', '미스틱 타로 살롱', '미스틱 타로 살롱', 'Mystic Tarot Salon', '신비로운 타로카드로 미래를 읽어드립니다', '신비로운 타로카드로 미래를 읽어드립니다', 'Unlock your future with mystical tarot cards', '프랑스에서 직수입한 정통 타로카드와 30년 경력의 타로마스터가 함께하는 프리미엄 타로 상담소입니다. 연애, 진로, 인간관계 등 궁금한 모든 것을 타로카드를 통해 명확히 해답을 찾아드립니다.', 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop&auto=format', ARRAY['https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop&auto=format'], '🔮', '[]', 45000, '30분 상담 기준', 'KRW', 4.8, 89, '02-555-0101', 'info@mystictarot.kr', '서울특별시 강남구 신사동 가로수길 45-7, 2층', 'https://mystictarot.kr', '매일 11:00 - 22:00', '신비로운 타로카드로 미래를 읽어드립니다', '신비로운 타로카드로 미래를 읽어드립니다', 'Unlock your future with mystical tarot cards', 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop&auto=format', 45000, 'LIGHT', 'BEGINNER', 2, 18, '11111111-1111-4111-8111-111111111111'),

('22222222-2222-4222-8222-222222222222', '동양명리 사주궁합소', '동양명리 사주궁합소', 'Oriental Saju Palace', '천년 역사의 정통 사주명리학', '천년 역사의 정통 사주명리학', 'Traditional Saju with millennium history', '조선왕조 궁중 명리학을 계승한 정통 사주명리 전문가가 직접 상담해드립니다. 사주팔자, 궁합, 택일, 개명까지 전통 명리학의 모든 영역을 다루며, 정확하고 체계적인 해석으로 인생의 방향을 제시합니다.', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop&auto=format', ARRAY['https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop&auto=format'], '📜', '[]', 80000, '60분 정밀 상담', 'KRW', 4.9, 156, '02-555-0202', 'info@sajugoong.kr', '서울특별시 강남구 청담동 청담로 89, 청담빌딩 3층', 'https://sajugoong.kr', '평일 09:00 - 18:00', '천년 역사의 정통 사주명리학', '천년 역사의 정통 사주명리학', 'Traditional Saju with millennium history', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop&auto=format', 80000, 'MODERATE', 'ADVANCED', 3, 20, '22222222-2222-4222-8222-222222222222'),

('33333333-3333-4333-8333-333333333333', '관상수상 운명학당', '관상수상 운명학당', 'Palm & Face Reading Center', '손금과 얼굴로 읽는 당신의 운명', '손금과 얼굴로 읽는 당신의 운명', 'Read your destiny through palms and face', '손금(수상)과 관상을 통해 선천적 운명과 후천적 노력의 방향을 제시하는 전문 상담소입니다. 중국 정통 관상학과 인도 수상술을 결합하여 정확하고 실용적인 조언을 드립니다.', 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop&auto=format', ARRAY['https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop&auto=format'], '✋', '[]', 35000, '20분 신속 분석', 'KRW', 4.6, 73, '02-555-0303', 'info@palmface.kr', '서울특별시 강남구 압구정동 압구정로 102, 로데오빌딩 5층', 'https://palmface.kr', '매일 12:00 - 21:00', '손금과 얼굴로 읽는 당신의 운명', '손금과 얼굴로 읽는 당신의 운명', 'Read your destiny through palms and face', 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop&auto=format', 35000, 'LIGHT', 'BEGINNER', 1, 16, '33333333-3333-4333-8333-333333333333'),

('44444444-4444-4444-8444-444444444444', '신비 수비학 연구소', '신비 수비학 연구소', 'Mystic Numerology Institute', '숫자로 풀어내는 당신만의 운명 코드', '숫자로 풀어내는 당신만의 운명 코드', 'Decode your unique destiny through numbers', '고대부터 전해내려온 수비학의 신비한 힘으로 개인의 운명 번호를 분석합니다. 생년월일, 이름의 획수, 휴대폰 번호까지 모든 숫자의 의미를 해석하여 최적의 인생 방향을 제시합니다.', 'https://images.unsplash.com/photo-1509909756405-be0199881695?w=800&h=600&fit=crop&auto=format', ARRAY['https://images.unsplash.com/photo-1509909756405-be0199881695?w=800&h=600&fit=crop&auto=format'], '🔢', '[]', 38000, '35분 수비 분석', 'KRW', 4.5, 67, '02-555-0404', 'info@numerology.kr', '서울특별시 강남구 역삼동 테헤란로 152, 강남파이낸스센터 12층', 'https://numerology.kr', '평일 09:00 - 19:00', '숫자로 풀어내는 당신만의 운명 코드', '숫자로 풀어내는 당신만의 운명 코드', 'Decode your destiny through numbers', 'https://images.unsplash.com/photo-1509909756405-be0199881695?w=800&h=600&fit=crop&auto=format', 38000, 'LIGHT', 'BEGINNER', 2, 18, '44444444-4444-4444-8444-444444444444'),

('55555555-5555-4555-8555-555555555555', '크리스탈 오라클 센터', '크리스탈 오라클 센터', 'Crystal Oracle Center', '수정의 에너지로 정화하고 미래를 봅니다', '수정의 에너지로 정화하고 미래를 봅니다', 'Purify and see future with crystal energy', '천연 수정과 보석의 에너지를 활용한 오라클 리딩과 힐링 서비스를 제공합니다. 각종 수정의 파워와 오라클 카드를 통해 영적 성장과 내면의 평화를 찾아드립니다.', 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=600&fit=crop&auto=format', ARRAY['https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=600&fit=crop&auto=format'], '💎', '[]', 50000, '45분 힐링 포함', 'KRW', 4.7, 112, '02-555-0505', 'info@crystal.kr', '서울특별시 강남구 선릉역 선릉로 521, 선릉타워 15층', 'https://crystal.kr', '화-일 14:00 - 22:00', '수정의 에너지로 정화하고 미래를 봅니다', '수정의 에너지로 정화하고 미래를 봅니다', 'Purify and see future with crystal energy', 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=600&fit=crop&auto=format', 50000, 'LIGHT', 'BEGINNER', 4, 18, '55555555-5555-4555-8555-555555555555'),

('66666666-6666-4666-8666-666666666666', '음양오행 풍수원', '음양오행 풍수원', 'Yin Yang Five Elements Center', '집과 사무실의 기운을 바꿔드립니다', '집과 사무실의 기운을 바꿔드립니다', 'Transform energy of your home and office', '음양오행 이론에 바탕한 전문 풍수 상담과 인테리어 컨설팅을 제공합니다. 집, 사무실, 상가의 기운을 분석하고 최적의 배치와 인테리어 방향을 제시하여 운세 상승을 도와드립니다.', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop&auto=format', ARRAY['https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop&auto=format'], '🏮', '[]', 120000, '현장 방문 2시간', 'KRW', 4.8, 67, '02-555-0606', 'info@fengshui.kr', '서울특별시 강남구 논현동 학동로 426, 논현빌딩 8층', 'https://fengshui.kr', '평일 10:00 - 18:00', '집과 사무실의 기운을 바꿔드립니다', '집과 사무실의 기운을 바꿔드립니다', 'Transform energy of home and office', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop&auto=format', 120000, 'MODERATE', 'INTERMEDIATE', 2, 25, '66666666-6666-4666-8666-666666666666'),

('77777777-7777-4777-8777-777777777777', '몽해몽 꿈해석소', '몽해몽 꿈해석소', 'Dream Oracle Center', '당신의 꿈이 전하는 메시지를 들려드립니다', '당신의 꿈이 전하는 메시지를 들려드립니다', 'Decode messages your dreams are telling you', '프로이트와 융의 정신분석학과 동양의 전통 꿈해몽학을 결합한 전문 꿈해석 서비스입니다. 반복되는 꿈, 예지몽, 악몽의 의미를 과학적이고 영적인 관점에서 해석해드립니다.', 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=800&h=600&fit=crop&auto=format', ARRAY['https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=800&h=600&fit=crop&auto=format'], '🌙', '[]', 40000, '40분 상담', 'KRW', 4.5, 94, '02-555-0707', 'info@dream.kr', '서울특별시 강남구 삼성동 영동대로 513, 코엑스몰 3층', 'https://dream.kr', '매일 13:00 - 21:00', '당신의 꿈이 전하는 메시지를 들려드립니다', '당신의 꿈이 전하는 메시지를 들려드립니다', 'Decode messages your dreams tell you', 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=800&h=600&fit=crop&auto=format', 40000, 'LIGHT', 'BEGINNER', 1, 16, '77777777-7777-4777-8777-777777777777'),

-- RECOMMENDED SERVICES (8-14)
('88888888-8888-4888-8888-888888888888', '주역오행 지혜원', '주역오행 지혜원', 'I-Ching Five Elements Center', '3000년 주역의 지혜로 인생을 밝혀드립니다', '3000년 주역의 지혜로 인생을 밝혀드립니다', 'Illuminate life with 3000 years I-Ching wisdom', '중국 고전 주역(易經)의 64괘를 통해 현재 상황을 분석하고 미래의 변화를 예측하는 동양 최고의 점술입니다. 복잡한 인생 문제에 대한 명확한 방향과 행동 지침을 제시합니다.', 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop&auto=format', ARRAY['https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop&auto=format'], '☯️', '[]', 60000, '50분 정밀 해석', 'KRW', 4.9, 128, '02-555-0808', 'info@iching.kr', '서울특별시 마포구 홍익로2가 홍익로5길 20, 홍대타워 4층', 'https://iching.kr', '평일 10:00 - 19:00', '3000년 주역의 지혜로 인생을 밝혀드립니다', '3000년 주역의 지혜로 인생을 밝혀드립니다', 'Illuminate life with I-Ching wisdom', 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop&auto=format', 60000, 'MODERATE', 'INTERMEDIATE', 2, 21, '88888888-8888-4888-8888-888888888888'),

('99999999-9999-4999-8999-999999999999', '다선일체 명상원', '다선일체 명상원', 'Tea Zen Unity Center', '차 한 잔의 여유 속에서 찾는 내면의 목소리', '차 한 잔의 여유 속에서 찾는 내면의 목소리', 'Find inner voice in tea tranquility', '전통 차문화와 명상을 결합한 독특한 점술 공간입니다. 정성스럽게 우린 차를 마시며 마음을 정화하고, 명상을 통해 내면의 지혜와 직감을 깨워 인생의 답을 찾아드립니다.', 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=800&h=600&fit=crop&auto=format', ARRAY['https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=800&h=600&fit=crop&auto=format'], '🍵', '[]', 55000, '90분 풀코스', 'KRW', 4.6, 85, '02-555-0909', 'info@tea.kr', '서울특별시 마포구 서교동 양화로 160, 메세나폴리스 8층', 'https://tea.kr', '매일 11:00 - 20:00', '차 한 잔의 여유 속에서 찾는 내면의 목소리', '차 한 잔의 여유 속에서 찾는 내면의 목소리', 'Find inner voice in tea tranquility', 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=800&h=600&fit=crop&auto=format', 55000, 'LIGHT', 'BEGINNER', 3, 18, '99999999-9999-4999-8999-999999999999'),

('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', '문스타 점성술원', '문스타 점성술원', 'Moon Star Astrology Center', '달의 리듬과 별자리가 알려주는 우주의 메시지', '달의 리듬과 별자리가 알려주는 우주의 메시지', 'Cosmic messages from lunar rhythms and constellations', '서양 점성술과 동양의 음력 체계를 결합한 특별한 점술 서비스입니다. 개인의 출생 차트 분석, 달의 위상에 따른 운세, 별자리별 운명 해석을 통해 우주적 관점에서 인생을 조망합니다.', 'https://images.unsplash.com/photo-1519608487953-e999c86e7455?w=800&h=600&fit=crop&auto=format', ARRAY['https://images.unsplash.com/photo-1519608487953-e999c86e7455?w=800&h=600&fit=crop&auto=format'], '🌟', '[]', 65000, '60분 차트 분석', 'KRW', 4.7, 103, '02-555-1010', 'info@astro.kr', '서울특별시 마포구 상수동 월드컵로 25길 19, 상수빌딩 3층', 'https://astro.kr', '화-토 15:00 - 22:00', '달의 리듬과 별자리가 알려주는 우주의 메시지', '달의 리듬과 별자리가 알려주는 우주의 메시지', 'Cosmic messages from lunar rhythms', 'https://images.unsplash.com/photo-1519608487953-e999c86e7455?w=800&h=600&fit=crop&auto=format', 65000, 'MODERATE', 'INTERMEDIATE', 2, 20, 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa'),

('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb', '하늘궁전 운명원', '하늘궁전 운명원', 'Sky Palace Destiny Center', '하늘의 뜻을 읽어 지상의 길을 밝힙니다', '하늘의 뜻을 읽어 지상의 길을 밝힙니다', 'Read heavens will to illuminate earthly path', '높은 곳에서 내려다보는 하늘의 시선으로 인생 전체를 조망하는 특별한 점술 서비스입니다. 광활한 우주의 기운을 받아 더욱 정확하고 깊이 있는 운세를 제공합니다.', 'https://images.unsplash.com/photo-1480497490787-505ec076689f?w=800&h=600&fit=crop&auto=format', ARRAY['https://images.unsplash.com/photo-1480497490787-505ec076689f?w=800&h=600&fit=crop&auto=format'], '🏯', '[]', 150000, '90분 VIP 상담', 'KRW', 4.9, 76, '02-555-1111', 'info@sky.kr', '서울특별시 마포구 합정동 합정로 7길 25, 합정센터 6층', 'https://sky.kr', '매일 10:00 - 20:00', '하늘의 뜻을 읽어 지상의 길을 밝힙니다', '하늘의 뜻을 읽어 지상의 길을 밝힙니다', 'Read heavens will to illuminate path', 'https://images.unsplash.com/photo-1480497490787-505ec076689f?w=800&h=600&fit=crop&auto=format', 150000, 'LIGHT', 'BEGINNER', 1, 25, 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb'),

('cccccccc-cccc-4ccc-8ccc-cccccccccccc', '스타사인 카페', '스타사인 카페', 'Star Sign Cafe', '맛있는 커피와 함께 즐기는 가벼운 별자리 운세', '맛있는 커피와 함께 즐기는 가벼운 별자리 운세', 'Light zodiac fortune with delicious coffee', '캐주얼하고 편안한 분위기에서 즐기는 별자리 운세 카페입니다. 특제 커피나 차를 마시며 오늘의 운세, 주간 운세, 월간 운세를 확인하고, 간단한 타로나 별자리 상담을 받을 수 있습니다.', 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&h=600&fit=crop&auto=format', ARRAY['https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&h=600&fit=crop&auto=format'], '☕', '[]', 25000, '30분 + 음료', 'KRW', 4.4, 142, '02-555-1212', 'info@cafe.kr', '서울특별시 마포구 망원동 월드컵로 32길 14, 망원빌딩 2층', 'https://cafe.kr', '매일 10:00 - 23:00', '맛있는 커피와 함께 즐기는 가벼운 별자리 운세', '맛있는 커피와 함께 즐기는 가벼운 별자리 운세', 'Light zodiac fortune with coffee', 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&h=600&fit=crop&auto=format', 25000, 'LIGHT', 'BEGINNER', 4, 16, 'cccccccc-cccc-4ccc-8ccc-cccccccccccc'),

('dddddddd-dddd-4ddd-8ddd-dddddddddddd', '바이킹 룬 스톤', '바이킹 룬 스톤', 'Viking Rune Stone', '고대 바이킹의 신비한 룬 문자로 미래를 예언합니다', '고대 바이킹의 신비한 룬 문자로 미래를 예언합니다', 'Prophesy future with ancient Viking runes', '북유럽 바이킹 시대부터 내려온 신성한 룬 문자의 힘으로 운명을 점칩니다. 24개의 룬 스톤을 던져 나오는 조합으로 과거, 현재, 미래를 해석하는 독특한 점술법입니다.', 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop&auto=format', ARRAY['https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop&auto=format'], '🪨', '[]', 42000, '25분 룬 리딩', 'KRW', 4.6, 89, '02-555-1313', 'info@rune.kr', '서울특별시 마포구 연남동 월드컵로1길 52, 연남타워 7층', 'https://rune.kr', '매일 12:00 - 20:00', '고대 바이킹의 신비한 룬 문자로 미래를 예언합니다', '고대 바이킹의 신비한 룬 문자로 미래를 예언합니다', 'Prophesy future with Viking runes', 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop&auto=format', 42000, 'LIGHT', 'BEGINNER', 1, 16, 'dddddddd-dddd-4ddd-8ddd-dddddddddddd'),

('eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee', '차크라 밸런스 센터', '차크라 밸런스 센터', 'Chakra Balance Center', '7개 차크라의 균형으로 완전한 치유를 경험하세요', '7개 차크라의 균형으로 완전한 치유를 경험하세요', 'Experience complete healing through 7 chakra balance', '인체의 7개 차크라 에너지 센터를 정화하고 균형을 맞춰주는 전문 힐링 센터입니다. 크리스탈, 사운드 힐링, 명상을 통합한 종합적인 차크라 치유 프로그램을 제공합니다.', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop&auto=format', ARRAY['https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop&auto=format'], '🌈', '[]', 75000, '60분 차크라 힐링', 'KRW', 4.8, 94, '02-555-1414', 'info@chakra.kr', '서울특별시 마포구 성산동 성산로 684, 성산빌딩 5층', 'https://chakra.kr', '화-일 11:00 - 21:00', '7개 차크라의 균형으로 완전한 치유를 경험하세요', '7개 차크라의 균형으로 완전한 치유를 경험하세요', 'Experience complete healing through chakra balance', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop&auto=format', 75000, 'MODERATE', 'INTERMEDIATE', 3, 20, 'eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee'),

-- HOT DEALS SERVICES (15-21)
('ffffffff-ffff-4fff-8fff-ffffffffffff', '영혼의 안식처', '영혼의 안식처', 'Soul Sanctuary', '깊은 영적 통찰로 인생의 진정한 의미를 찾아드립니다', '깊은 영적 통찰로 인생의 진정한 의미를 찾아드립니다', 'Find true meaning of life through spiritual insights', '영성 상담 전문가와 함께 내면의 목소리에 귀 기울이고 영혼의 성장을 도모하는 특별한 공간입니다. 개인의 영적 여정을 깊이 있게 탐구하고 삶의 진정한 목적을 발견할 수 있도록 도와드립니다.', 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=800&h=600&fit=crop&auto=format', ARRAY['https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=800&h=600&fit=crop&auto=format'], '🕊️', '[]', 90000, '75분 영성 상담', 'KRW', 4.9, 112, '02-555-1515', 'info@soul.kr', '서울특별시 중구 명동2가 명동8길 29, 명동센트럴 6층', 'https://soul.kr', '평일 10:00 - 18:00', '깊은 영적 통찰로 인생의 진정한 의미를 찾아드립니다', '깊은 영적 통찰로 인생의 진정한 의미를 찾아드립니다', 'Find true meaning through spiritual insights', 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=800&h=600&fit=crop&auto=format', 90000, 'MODERATE', 'INTERMEDIATE', 2, 21, 'ffffffff-ffff-4fff-8fff-ffffffffffff'),

('aaaabbbb-cccc-4ddd-8eee-ffffaaaabbbb', '미스틱 오라클 센터', '미스틱 오라클 센터', 'Mystic Oracle Center', '신비한 오라클 카드가 전하는 우주의 메시지', '신비한 오라클 카드가 전하는 우주의 메시지', 'Cosmic messages delivered by mystical oracle cards', '세계 각국의 다양한 오라클 카드를 활용한 전문 리딩 센터입니다. 엔젤 카드, 유니콘 카드, 여신 카드 등 50종 이상의 오라클 덱으로 개인에게 최적화된 메시지를 전달합니다.', 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=600&fit=crop&auto=format', ARRAY['https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=600&fit=crop&auto=format'], '🃏', '[]', 48000, '40분 오라클 리딩', 'KRW', 4.7, 156, '02-555-1616', 'info@oracle.kr', '서울특별시 중구 을지로3가 을지로15길 7, 을지빌딩 7층', 'https://oracle.kr', '매일 13:00 - 21:00', '신비한 오라클 카드가 전하는 우주의 메시지', '신비한 오라클 카드가 전하는 우주의 메시지', 'Cosmic messages by mystical oracle cards', 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=600&fit=crop&auto=format', 48000, 'LIGHT', 'BEGINNER', 2, 18, 'aaaabbbb-cccc-4ddd-8eee-ffffaaaabbbb'),

('bbbbcccc-dddd-4eee-8fff-aaaaabbbbccc', '오라클 가든 카페', '오라클 가든 카페', 'Oracle Garden Cafe', '힐링 음료와 함께하는 편안한 오라클 카드 체험', '힐링 음료와 함께하는 편안한 오라클 카드 체험', 'Comfortable oracle card experience with healing beverages', '아늑한 카페 분위기에서 즐기는 오라클 카드 리딩 공간입니다. 허브차, 플라워 에센스 음료와 함께 편안하게 우주의 메시지를 받아보세요.', 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&h=600&fit=crop&auto=format', ARRAY['https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&h=600&fit=crop&auto=format'], '🌸', '[]', 28000, '20분 + 음료', 'KRW', 4.3, 198, '02-555-1717', 'info@garden.kr', '서울특별시 종로구 인사동 인사동길 35, 인사아트센터 3층', 'https://garden.kr', '매일 09:00 - 22:00', '힐링 음료와 함께하는 편안한 오라클 카드 체험', '힐링 음료와 함께하는 편안한 오라클 카드 체험', 'Comfortable oracle card experience with beverages', 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&h=600&fit=crop&auto=format', 28000, 'LIGHT', 'BEGINNER', 6, 16, 'bbbbcccc-dddd-4eee-8fff-aaaaabbbbccc'),

('ccccdddd-eeee-4fff-8aaa-bbbbccccdddd', '포춘 플라자', '포춘 플라자', 'Fortune Plaza', '성북구의 프리미엄 종합 운세 센터', '성북구의 프리미엄 종합 운세 센터', 'Premium comprehensive fortune center in Seongbuk', '성신여대 근처에 위치한 고급 종합 운세 센터입니다. 사주, 타로, 관상, 수상, 오라클 등 모든 점술을 한 곳에서 체험할 수 있는 원스톱 서비스를 제공합니다.', 'https://images.unsplash.com/photo-1480497490787-505ec076689f?w=800&h=600&fit=crop&auto=format', ARRAY['https://images.unsplash.com/photo-1480497490787-505ec076689f?w=800&h=600&fit=crop&auto=format'], '💼', '[]', 95000, '70분 종합 상담', 'KRW', 4.8, 124, '02-555-1818', 'info@plaza.kr', '서울특별시 성북구 성신여대입구역 동소문로 47, 성신빌딩 2층', 'https://plaza.kr', '평일 08:00 - 20:00', '성북구의 프리미엄 종합 운세 센터', '성북구의 프리미엄 종합 운세 센터', 'Premium comprehensive fortune center', 'https://images.unsplash.com/photo-1480497490787-505ec076689f?w=800&h=600&fit=crop&auto=format', 95000, 'MODERATE', 'ADVANCED', 3, 25, 'ccccdddd-eeee-4fff-8aaa-bbbbccccdddd'),

('ddddeeee-ffff-4aaa-8bbb-ccccddddeeee', '타임스퀘어 운명학원', '타임스퀘어 운명학원', 'Times Square Destiny Academy', '종로 중심가의 현대적 운세 상담소', '종로 중심가의 현대적 운세 상담소', 'Modern fortune consultation center in Jongno', '종로3가에 위치한 젊은 세대를 위한 현대적 운세 상담소입니다. SNS 연동 운세 서비스와 모바일 앱을 통한 실시간 상담이 가능합니다.', 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop&auto=format', ARRAY['https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop&auto=format'], '📱', '[]', 32000, '25분 젊은 운세', 'KRW', 4.4, 267, '02-555-1919', 'info@times.kr', '서울특별시 종로구 종로3가 종로 69, 종로타워 8층', 'https://times.kr', '매일 11:00 - 23:00', '종로 중심가의 현대적 운세 상담소', '종로 중심가의 현대적 운세 상담소', 'Modern fortune center in Jongno', 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop&auto=format', 32000, 'LIGHT', 'BEGINNER', 3, 16, 'ddddeeee-ffff-4aaa-8bbb-ccccddddeeee'),

('eeeeffff-aaaa-4bbb-8ccc-ddddeeeeefff', '여의도 에너지 센터', '여의도 에너지 센터', 'Yeouido Energy Center', '금융 중심가의 에너지 힐링과 운세 센터', '금융 중심가의 에너지 힐링과 운세 센터', 'Energy healing and fortune center in financial district', '여의도 IFC몰에 위치한 에너지 힐링과 운세 상담을 결합한 통합 센터입니다. 직장인들의 스트레스 해소와 운세 상담을 동시에 해결하는 특별한 프로그램을 제공합니다.', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop&auto=format', ARRAY['https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop&auto=format'], '⚡', '[]', 68000, '50분 통합 힐링', 'KRW', 4.6, 78, '02-555-2020', 'info@energy.kr', '서울특별시 영등포구 여의도동 국제금융로 10, IFC몰 3층', 'https://energy.kr', '화-토 10:00 - 19:00', '금융 중심가의 에너지 힐링과 운세 센터', '금융 중심가의 에너지 힐링과 운세 센터', 'Energy healing and fortune center', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop&auto=format', 68000, 'MODERATE', 'INTERMEDIATE', 2, 20, 'eeeeffff-aaaa-4bbb-8ccc-ddddeeeeefff'),

('ffffaaaa-bbbb-4ccc-8ddd-eeeeffffaaaa', '프리미엄 스카이 센터', '프리미엄 스카이 센터', 'Premium Sky Center', '롯데월드타워 최상층 VIP 전용 운세 상담소', '롯데월드타워 최상층 VIP 전용 운세 상담소', 'VIP exclusive fortune consultation at Lotte World Tower', '롯데월드타워 스카이31 최상층에서 제공하는 초프리미엄 운세 상담 서비스입니다. 서울 전체를 내려다보는 환상적인 뷰와 함께 최고의 명리학자들이 개인 맞춤형 상담을 제공합니다.', 'https://images.unsplash.com/photo-1480497490787-505ec076689f?w=800&h=600&fit=crop&auto=format', ARRAY['https://images.unsplash.com/photo-1480497490787-505ec076689f?w=800&h=600&fit=crop&auto=format'], '👑', '[]', 200000, '120분 VIP 전용', 'KRW', 5.0, 45, '02-555-2121', 'info@premium.kr', '서울특별시 송파구 잠실동 올림픽로 240, 롯데월드타워 스카이31 31층', 'https://premium.kr', '매일 09:00 - 21:00 (완전 예약제)', '롯데월드타워 최상층 VIP 전용 운세 상담소', '롯데월드타워 최상층 VIP 전용 운세 상담소', 'VIP exclusive fortune consultation', 'https://images.unsplash.com/photo-1480497490787-505ec076689f?w=800&h=600&fit=crop&auto=format', 200000, 'LIGHT', 'BEGINNER', 1, 30, 'ffffaaaa-bbbb-4ccc-8ddd-eeeeffffaaaa');

-- STEP 5: Create diverse reviews for each business (3-4 reviews each)
INSERT INTO location_reviews (location_id, name, date, rating, text) VALUES

-- Mystic Tarot Salon Reviews
('11111111-1111-4111-8111-111111111111', '김미정', '2024-08-15', 5, '가로수길에서 우연히 발견한 타로 살롱인데 정말 놀라웠어요! 마스터님이 제 상황을 정확히 맞춰주시고, 앞으로의 연애운에 대해서도 구체적으로 알려주셔서 많은 도움이 되었습니다. 인테리어도 정말 신비로워서 분위기가 좋았어요.'),
('11111111-1111-4111-8111-111111111111', '박준호', '2024-08-10', 4, '친구 추천으로 갔는데 생각보다 정확했습니다. 특히 직장 관련 조언이 도움이 되었어요. 다만 30분이 좀 짧게 느껴졌습니다.'),
('11111111-1111-4111-8111-111111111111', '이수연', '2024-08-05', 5, '프랑스 타로카드 정말 신기해요! 제가 말하지 않은 것까지 정확히 맞춰주셔서 소름돋았습니다. 강남 최고의 타로샵인 것 같아요!'),

-- Oriental Saju Palace Reviews  
('22222222-2222-4222-8222-222222222222', '최영희', '2024-08-20', 5, '정말 정통 사주명리학이에요! 제 사주팔자를 자세히 풀어주시고, 궁합까지 봐주셔서 결혼 계획에 큰 도움이 되었습니다. 60분이 전혀 길지 않게 느껴졌어요.'),
('22222222-2222-4222-8222-222222222222', '김대수', '2024-08-18', 5, '아버지 추천으로 갔는데 정말 놀랐습니다. 조선왕조 궁중 명리학이라고 하시는데, 제 인생의 전환점들을 정확히 짚어주셨어요. 개명도 추천받았는데 고려해볼 생각입니다.'),
('22222222-2222-4222-8222-222222222222', '윤서진', '2024-08-12', 4, '전문적이고 체계적인 상담이었습니다. 다만 조금 진지한 분위기라 처음엔 긴장했어요. 하지만 설명이 정말 자세하고 좋았습니다.'),

-- Palm & Face Reading Center Reviews
('33333333-3333-4333-8333-333333333333', '송민경', '2024-08-22', 5, '손금과 관상을 함께 봐주시는데 정말 신기했어요! 20분이라고 하셨는데 훨씬 오래 봐주신 것 같아요. 제 성격이랑 미래에 대해서 정확히 맞춰주셨습니다.'),
('33333333-3333-4333-8333-333333333333', '정현우', '2024-08-17', 4, '압구정에서 손금 보는 곳을 찾다가 갔는데 만족합니다. 중국 정통 관상학이라고 하시는데 정말 전문적이세요.'),
('33333333-3333-4333-8333-333333333333', '강혜진', '2024-08-14', 5, '인도 수상술까지 결합해서 봐주시니까 더 정확한 것 같아요. 실용적인 조언도 많이 해주셔서 좋았습니다!'),

-- Mystic Numerology Institute Reviews
('44444444-4444-4444-8444-444444444444', '임지혜', '2024-08-19', 4, '숫자로 운명을 보는 게 신기했어요. 생년월일이랑 이름 획수로 이렇게 많은 걸 알 수 있다니! 휴대폰 번호 풀이도 재미있었습니다.'),
('44444444-4444-4444-8444-444444444444', '홍성민', '2024-08-16', 5, '역삼동 파이낸스센터에 있어서 접근성이 좋아요. 수비학이 생각보다 정확해서 놀랐습니다. 개인 운명 번호 분석이 특히 인상적이었어요.'),
('44444444-4444-4444-8444-444444444444', '배수정', '2024-08-11', 4, '35분 동안 자세히 설명해주셔서 만족스러웠어요. 숫자의 신비한 힘을 느낄 수 있었습니다.'),

-- Crystal Oracle Center Reviews
('55555555-5555-4555-8555-555555555555', '조은영', '2024-08-21', 5, '크리스탈 힐링과 오라클 리딩이 정말 좋았어요! 마음이 정화되는 느낌이었고, 45분 동안 충분히 힐링받았습니다. 선릉역에서 가깝고 시설도 깔끔해요.'),
('55555555-5555-4555-8555-555555555555', '신동혁', '2024-08-13', 4, '천연 수정들이 정말 예뻐요. 오라클 카드 리딩도 정확했고, 영적 성장에 대한 조언도 도움이 되었습니다.'),
('55555555-5555-4555-8555-555555555555', '문소영', '2024-08-08', 5, '내면의 평화를 찾고 싶어서 갔는데 정말 좋았어요. 크리스탈 에너지가 실제로 느껴졌습니다!'),

-- Yin Yang Five Elements Center Reviews
('66666666-6666-4666-8666-666666666666', '한민수', '2024-08-18', 5, '집 풍수 상담을 받았는데 정말 전문적이에요! 2시간 동안 직접 집에 와서 상세히 봐주시고, 인테리어 컨설팅까지 해주셔서 대만족입니다.'),
('66666666-6666-4666-8666-666666666666', '유정아', '2024-08-15', 4, '사무실 풍수를 봤는데 음양오행 이론이 정말 신기해요. 가구 배치 바꾼 후로 일이 더 잘 풀리는 것 같아요.'),
('66666666-6666-4666-8666-666666666666', '오준석', '2024-08-12', 5, '논현동에서 풍수 전문가를 찾다가 갔는데 정말 좋았어요. 현장 방문 서비스가 특히 만족스러웠습니다.'),

-- Dream Oracle Center Reviews
('77777777-7777-4777-8777-777777777777', '김나영', '2024-08-20', 4, '꿈해몽을 전문적으로 해주시는 곳이에요. 프로이트와 융의 이론까지 설명해주셔서 과학적인 느낌도 들었습니다. 코엑스에서 가까워서 좋아요.'),
('77777777-7777-4777-8777-777777777777', '이민호', '2024-08-14', 5, '반복되는 악몽 때문에 갔는데 정말 도움이 되었어요. 꿈의 의미를 동양과 서양 관점에서 모두 해석해주셔서 이해가 잘 되었습니다.'),
('77777777-7777-4777-8777-777777777777', '박예린', '2024-08-09', 4, '예지몽인지 궁금했던 꿈을 상담받았는데 명쾌한 답을 들을 수 있었어요. 40분이 적당한 시간인 것 같습니다.'),

-- I-Ching Five Elements Center Reviews
('88888888-8888-4888-8888-888888888888', '최지훈', '2024-08-17', 5, '주역 점술이 정말 놀라워요! 64괘 해석이 이렇게 정확할 줄 몰랐습니다. 홍대에서 이런 전문적인 곳을 찾을 수 있어서 좋았어요.'),
('88888888-8888-4888-8888-888888888888', '강수빈', '2024-08-13', 5, '3000년 역사의 주역이라고 하시는데 정말 깊이가 있어요. 복잡한 인생 문제에 대한 명확한 방향을 제시해주셔서 감사했습니다.'),
('88888888-8888-4888-8888-888888888888', '윤태현', '2024-08-10', 4, '50분 동안 정밀하게 해석해주셔서 만족스러웠어요. 행동 지침까지 구체적으로 알려주셨습니다.'),

-- Tea Zen Unity Center Reviews
('99999999-9999-4999-8999-999999999999', '서미래', '2024-08-19', 5, '차 한 잔의 여유와 함께하는 점술이 정말 특별해요! 90분 풀코스인데 전혀 지루하지 않았습니다. 마음이 정말 평온해졌어요.'),
('99999999-9999-4999-8999-999999999999', '김도영', '2024-08-16', 4, '전통 차문화와 명상을 결합한 게 독특했어요. 서교동에서 이런 힐링 공간을 찾을 수 있어서 좋았습니다.'),
('99999999-9999-4999-8999-999999999999', '정은서', '2024-08-11', 5, '내면의 지혜를 깨워주는 특별한 경험이었어요. 차 맛도 정말 좋고, 점술도 정확했습니다!'),

-- Moon Star Astrology Center Reviews
('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', '황지은', '2024-08-21', 5, '서양 점성술과 동양 음력 체계를 함께 봐주시니까 더 정확한 것 같아요! 출생 차트 분석이 정말 상세했습니다.'),
('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', '노준영', '2024-08-15', 4, '상수동에 있는 점성술원인데 우주적 관점에서 인생을 조망해주셔서 시야가 넓어진 느낌이에요.'),
('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', '임채영', '2024-08-12', 5, '달의 위상에 따른 운세가 정말 신기했어요. 별자리별 운명 해석도 정확했습니다!'),

-- Sky Palace Destiny Center Reviews
('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb', '안수지', '2024-08-18', 5, '하늘의 시선으로 인생을 조망한다는 컨셉이 정말 좋아요! 90분 VIP 상담인데 정말 프리미엄한 느낌이었습니다.'),
('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb', '조현민', '2024-08-14', 5, '합정동에서 이런 고급 상담을 받을 수 있어서 좋았어요. 우주의 기운을 받는 느낌이 정말 들었습니다.'),
('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb', '김유진', '2024-08-09', 4, '가격은 비싸지만 그만큼 가치가 있는 상담이었어요. 깊이 있는 해석이 인상적이었습니다.'),

-- Star Sign Cafe Reviews
('cccccccc-cccc-4ccc-8ccc-cccccccccccc', '이하늘', '2024-08-20', 4, '망원동 카페인데 분위기가 정말 좋아요! 커피 마시면서 가볍게 별자리 운세 볼 수 있어서 편해요.'),
('cccccccc-cccc-4ccc-8ccc-cccccccccccc', '박시우', '2024-08-17', 4, '캐주얼한 분위기에서 부담 없이 운세를 볼 수 있어서 좋았어요. 가격도 합리적이고 음료도 맛있었습니다.'),
('cccccccc-cccc-4ccc-8ccc-cccccccccccc', '최예은', '2024-08-13', 5, '12별자리 운세가 정말 재미있어요! SNS 운세 서비스도 있어서 친구들과 공유하기 좋았습니다.'),

-- Viking Rune Stone Reviews
('dddddddd-dddd-4ddd-8ddd-dddddddddddd', '강동원', '2024-08-16', 5, '바이킹 룬 문자가 정말 신기해요! 24개 룬 스톤을 던져서 보는 점술이 독특했습니다. 연남동에서 이런 걸 볼 수 있다니!'),
('dddddddd-dddd-4ddd-8ddd-dddddddddddd', '신예린', '2024-08-12', 4, '고대 바이킹 시대의 신성한 룬 문자라고 하시는데 정말 신비로웠어요. 25분 리딩이 적당했습니다.'),
('dddddddd-dddd-4ddd-8ddd-dddddddddddd', '김민재', '2024-08-08', 4, '북유럽 점술을 한국에서 볼 수 있어서 흥미로웠어요. 과거, 현재, 미래 해석이 정확했습니다.'),

-- Chakra Balance Center Reviews
('eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee', '유소영', '2024-08-19', 5, '7개 차크라 힐링이 정말 좋았어요! 크리스탈과 사운드 힐링이 결합되어서 완전한 치유를 경험했습니다.'),
('eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee', '조민석', '2024-08-15', 4, '성산동에 있는 차크라 센터인데 60분 힐링이 정말 시원했어요. 몸과 마음이 모두 편해졌습니다.'),
('eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee', '이지원', '2024-08-11', 5, '에너지 정화가 정말 느껴져요! 명상까지 함께 해서 종합적인 힐링을 받을 수 있었습니다.'),

-- Soul Sanctuary Reviews
('ffffffff-ffff-4fff-8fff-ffffffffffff', '문지혜', '2024-08-18', 5, '영혼의 안식처라는 이름답게 정말 깊은 영적 통찰을 받았어요. 75분 영성 상담이 인생의 전환점이 된 것 같습니다.'),
('ffffffff-ffff-4fff-8fff-ffffffffffff', '김성훈', '2024-08-14', 5, '명동에서 이런 전문적인 영성 상담을 받을 수 있어서 좋았어요. 인생의 진정한 의미를 찾는 데 도움이 되었습니다.'),
('ffffffff-ffff-4fff-8fff-ffffffffffff', '박수민', '2024-08-10', 4, '영적 여정을 깊이 있게 탐구할 수 있었어요. 삶의 목적에 대해 생각해볼 수 있는 시간이었습니다.'),

-- Mystic Oracle Center Reviews
('aaaabbbb-cccc-4ddd-8eee-ffffaaaabbbb', '장예린', '2024-08-17', 5, '50종 이상의 오라클 덱이 있어서 정말 다양해요! 을지로에서 이런 전문 오라클 센터를 찾을 수 있어서 좋았습니다.'),
('aaaabbbb-cccc-4ddd-8eee-ffffaaaabbbb', '홍준호', '2024-08-13', 4, '엔젤 카드, 유니콘 카드 등 여러 종류로 봐주셔서 더 정확한 것 같아요. 40분 리딩이 적당했습니다.'),
('aaaabbbb-cccc-4ddd-8eee-ffffaaaabbbb', '최서영', '2024-08-09', 5, '개인 맞춤형 메시지를 정말 정확히 전달해주셔서 놀랐어요. 우주의 메시지를 확실히 받은 느낌입니다!'),

-- Oracle Garden Cafe Reviews
('bbbbcccc-dddd-4eee-8fff-aaaaabbbbccc', '김채원', '2024-08-20', 4, '인사동 카페인데 분위기가 정말 아늑해요! 허브차 마시면서 오라클 카드 보니까 마음이 편해졌어요.'),
('bbbbcccc-dddd-4eee-8fff-aaaaabbbbccc', '이도현', '2024-08-16', 4, '힐링 음료와 함께하는 오라클 체험이 좋았어요. 20분이라 부담 없이 받을 수 있었습니다.'),
('bbbbcccc-dddd-4eee-8fff-aaaaabbbbccc', '박은지', '2024-08-12', 5, '플라워 에센스 음료가 정말 특별해요! 우주의 메시지도 정확했고 힐링이 되는 시간이었습니다.'),

-- Fortune Plaza Reviews
('ccccdddd-eeee-4fff-8aaa-bbbbccccdddd', '송지훈', '2024-08-19', 5, '성신여대 근처 종합 운세 센터인데 정말 고급스러워요! 70분 동안 사주, 타로, 관상 모두 봐주셔서 대만족입니다.'),
('ccccdddd-eeee-4fff-8aaa-bbbbccccdddd', '김소희', '2024-08-15', 4, '원스톱 서비스가 정말 편해요. 모든 점술을 한 곳에서 체험할 수 있어서 좋았습니다.'),
('ccccdddd-eeee-4fff-8aaa-bbbbccccdddd', '정민우', '2024-08-11', 5, '프리미엄 종합 상담이라고 하시는데 정말 전문적이고 자세했어요. 성북구 최고인 것 같습니다!'),

-- Times Square Destiny Academy Reviews
('ddddeeee-ffff-4aaa-8bbb-ccccddddeeee', '안유진', '2024-08-18', 4, '종로3가에서 젊은 감각의 운세 상담을 받을 수 있어서 좋았어요! SNS 연동 서비스가 특히 마음에 들었습니다.'),
('ddddeeee-ffff-4aaa-8bbb-ccccddddeeee', '최민혁', '2024-08-14', 4, '모바일 앱으로 실시간 상담이 가능해서 편리했어요. 현대적인 운세 상담소라는 느낌이 들었습니다.'),
('ddddeeee-ffff-4aaa-8bbb-ccccddddeeee', '이서연', '2024-08-10', 5, '25분 젊은 운세라고 하시는데 정말 젊은 세대에 맞춰서 해주시는 것 같아요. 종로 중심가라 접근성도 좋고요!'),

-- Yeouido Energy Center Reviews
('eeeeffff-aaaa-4bbb-8ccc-ddddeeeeefff', '박현준', '2024-08-17', 5, 'IFC몰에 있어서 직장인들이 가기 정말 좋아요! 에너지 힐링과 운세 상담을 함께 받으니까 스트레스가 확실히 풀렸습니다.'),
('eeeeffff-aaaa-4bbb-8ccc-ddddeeeeefff', '김예나', '2024-08-13', 4, '여의도 금융 중심가에서 이런 힐링 센터를 찾을 수 있어서 좋았어요. 직장인 특화 프로그램이 만족스러웠습니다.'),
('eeeeffff-aaaa-4bbb-8ccc-ddddeeeeefff', '조성민', '2024-08-09', 4, '50분 통합 힐링이 정말 시원했어요. 에너지와 운세를 동시에 해결할 수 있어서 효율적이었습니다.'),

-- Premium Sky Center Reviews
('ffffaaaa-bbbb-4ccc-8ddd-eeeeffffaaaa', '윤서진', '2024-08-16', 5, '롯데월드타워 최상층에서 받는 VIP 상담이 정말 특별해요! 서울 전체를 내려다보면서 받는 운세 상담은 처음이었습니다.'),
('ffffaaaa-bbbb-4ccc-8ddd-eeeeffffaaaa', '강민수', '2024-08-12', 5, '120분 VIP 전용 상담인데 정말 최고급 서비스였어요. 가격은 비싸지만 그만한 가치가 있다고 생각합니다.'),
('ffffaaaa-bbbb-4ccc-8ddd-eeeeffffaaaa', '이수현', '2024-08-08', 5, '초프리미엄 운세 상담이라는 말이 딱 맞는 것 같아요. 개인 맞춤형 상담이 정말 전문적이고 깊이 있었습니다!');

-- STEP 6: Update review counts and ratings based on actual reviews
UPDATE locations 
SET review_count = (
  SELECT COUNT(*) 
  FROM location_reviews 
  WHERE location_reviews.location_id = locations.id
);

UPDATE locations 
SET rating = (
  SELECT ROUND(AVG(rating)::numeric, 1) 
  FROM location_reviews 
  WHERE location_reviews.location_id = locations.id
);

-- STEP 7: Verification
SELECT 'Complete! 21 Korean fortune businesses with individual reviews and geolocations created!' as status;
SELECT COUNT(*) as total_locations FROM locations;
SELECT COUNT(*) as total_reviews FROM location_reviews;
SELECT 
  l.title,
  l.rating,
  l.review_count,
  p.district || ' ' || p.address_line as address
FROM locations l
JOIN places p ON l.place_id = p.id
ORDER BY l.price_krw;
