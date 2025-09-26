-- locations 테이블에 business-detail.tsx에서 필요한 필드들을 추가하는 SQL 스크립트

-- 먼저 필요한 컬럼들을 추가 (이미 존재하는 경우 무시)
ALTER TABLE locations 
ADD COLUMN IF NOT EXISTS subtitle TEXT,
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS main_image_url TEXT,
ADD COLUMN IF NOT EXISTS gallery_images TEXT[], -- PostgreSQL 배열 타입
ADD COLUMN IF NOT EXISTS icon TEXT,
ADD COLUMN IF NOT EXISTS features JSONB, -- JSON 형태로 저장
ADD COLUMN IF NOT EXISTS base_price INTEGER,
ADD COLUMN IF NOT EXISTS price_description TEXT,
ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'KRW',
ADD COLUMN IF NOT EXISTS rating DECIMAL(2,1),
ADD COLUMN IF NOT EXISTS review_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS email TEXT,
ADD COLUMN IF NOT EXISTS address TEXT,
ADD COLUMN IF NOT EXISTS website TEXT,
ADD COLUMN IF NOT EXISTS business_hours TEXT;

-- 30개의 location에 대한 샘플 데이터 업데이트
UPDATE locations SET 
  subtitle = '전통 사주와 현대 기술의 만남',
  description = '수백 년의 전통 사주학과 최신 AI 기술을 결합하여 정확하고 상세한 사주 분석을 제공합니다. 개인의 운명과 미래를 과학적으로 해석해드립니다.',
  main_image_url = 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=600&fit=crop',
  gallery_images = ARRAY[
    'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop'
  ],
  icon = '🔮',
  features = '[
    {"id": 1, "icon": "🤖", "text": "AI 기반 정확한 분석"},
    {"id": 2, "icon": "📊", "text": "상세한 운세 리포트"},
    {"id": 3, "icon": "🔮", "text": "다양한 관점의 해석"},
    {"id": 4, "icon": "💡", "text": "개인 맞춤 조언"},
    {"id": 5, "icon": "📱", "text": "모바일 최적화"}
  ]'::jsonb,
  base_price = 29000,
  price_description = '1회 상담 기준',
  currency = 'KRW',
  rating = 4.8,
  review_count = 127,
  phone = '02-1234-5678',
  email = 'info@sajuai.com',
  address = '서울특별시 강남구 역삼동 123-45',
  website = 'https://www.sajuai.com',
  business_hours = 'Open 09:00 - 21:00'
WHERE id = 1;

UPDATE locations SET 
  subtitle = '전문 사주명리학자의 정확한 해석',
  description = '30년 경력의 전문 사주명리학자가 직접 상담하여 정확하고 깊이 있는 사주 분석을 제공합니다. 전통 명리학의 정수를 경험해보세요.',
  main_image_url = 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
  gallery_images = ARRAY[
    'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop'
  ],
  icon = '🏮',
  features = '[
    {"id": 1, "icon": "👨‍🏫", "text": "전문 사주명리학자 상담"},
    {"id": 2, "icon": "📚", "text": "전통 명리학 기반"},
    {"id": 3, "icon": "🎯", "text": "정확한 사주 해석"},
    {"id": 4, "icon": "💎", "text": "프리미엄 상담 서비스"},
    {"id": 5, "icon": "📞", "text": "1:1 개인 상담"}
  ]'::jsonb,
  base_price = 49000,
  price_description = '전문가 상담 기준',
  currency = 'KRW',
  rating = 4.9,
  review_count = 89,
  phone = '02-2345-6789',
  email = 'master@saju.com',
  address = '서울특별시 서초구 서초동 456-78',
  website = 'https://www.mastersaju.com',
  business_hours = 'Open 10:00 - 20:00'
WHERE id = 2;

UPDATE locations SET 
  subtitle = 'AI와 전통 사주의 완벽한 조화',
  description = '최첨단 AI 기술과 전통 사주학을 결합하여 더욱 정확하고 개인화된 사주 분석을 제공합니다. 과학적 접근으로 운명을 해석합니다.',
  main_image_url = 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=600&fit=crop',
  gallery_images = ARRAY[
    'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop'
  ],
  icon = '⚡',
  features = '[
    {"id": 1, "icon": "🤖", "text": "AI 기반 분석"},
    {"id": 2, "icon": "🏮", "text": "전통 사주학"},
    {"id": 3, "icon": "📊", "text": "데이터 기반 예측"},
    {"id": 4, "icon": "🎯", "text": "개인 맞춤 분석"},
    {"id": 5, "icon": "📱", "text": "실시간 상담"}
  ]'::jsonb,
  base_price = 39000,
  price_description = 'AI 분석 기준',
  currency = 'KRW',
  rating = 4.7,
  review_count = 156,
  phone = '02-3456-7890',
  email = 'ai@saju.com',
  address = '서울특별시 마포구 홍대동 789-12',
  website = 'https://www.aisaju.com',
  business_hours = 'Open 09:00 - 22:00'
WHERE id = 3;

-- 나머지 27개 location에 대한 데이터 업데이트 (패턴 반복)
UPDATE locations SET 
  subtitle = '전통 사주와 현대 기술의 만남',
  description = '수백 년의 전통 사주학과 최신 AI 기술을 결합하여 정확하고 상세한 사주 분석을 제공합니다.',
  main_image_url = 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=600&fit=crop',
  gallery_images = ARRAY[
    'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop'
  ],
  icon = '🔮',
  features = '[
    {"id": 1, "icon": "🤖", "text": "AI 기반 정확한 분석"},
    {"id": 2, "icon": "📊", "text": "상세한 운세 리포트"},
    {"id": 3, "icon": "🔮", "text": "다양한 관점의 해석"},
    {"id": 4, "icon": "💡", "text": "개인 맞춤 조언"},
    {"id": 5, "icon": "📱", "text": "모바일 최적화"}
  ]'::jsonb,
  base_price = 29000 + (id * 1000),
  price_description = '1회 상담 기준',
  currency = 'KRW',
  rating = 4.5 + (id * 0.1),
  review_count = 50 + (id * 5),
  phone = '02-' || LPAD((1234 + id)::text, 4, '0') || '-' || LPAD((5678 + id)::text, 4, '0'),
  email = 'info' || id || '@saju.com',
  address = '서울특별시 강남구 역삼동 ' || (123 + id) || '-' || (45 + id),
  website = 'https://www.saju' || id || '.com',
  business_hours = 'Open 09:00 - 21:00'
WHERE id BETWEEN 4 AND 30;

-- 추가적인 다양성을 위해 일부 location의 데이터를 수동으로 업데이트
UPDATE locations SET 
  subtitle = '프리미엄 사주 상담 서비스',
  description = '최고급 사주 상담 서비스로 개인의 운명과 미래를 정확하게 해석해드립니다.',
  base_price = 79000,
  rating = 4.9,
  review_count = 200,
  business_hours = 'Open 10:00 - 19:00'
WHERE id IN (5, 10, 15, 20, 25);

UPDATE locations SET 
  subtitle = '전통 명리학 전문 상담',
  description = '전통 명리학을 바탕으로 한 정확하고 깊이 있는 사주 분석을 제공합니다.',
  base_price = 59000,
  rating = 4.8,
  review_count = 150,
  business_hours = 'Open 11:00 - 20:00'
WHERE id IN (7, 14, 21, 28);

UPDATE locations SET 
  subtitle = 'AI 기반 사주 분석',
  description = '최신 AI 기술을 활용한 정확하고 빠른 사주 분석 서비스를 제공합니다.',
  base_price = 19000,
  rating = 4.6,
  review_count = 100,
  business_hours = 'Open 08:00 - 23:00'
WHERE id IN (6, 12, 18, 24, 30);

-- 특별한 아이콘과 특징들 추가
UPDATE locations SET 
  icon = '🌟',
  features = '[
    {"id": 1, "icon": "⭐", "text": "프리미엄 서비스"},
    {"id": 2, "icon": "👑", "text": "VIP 상담"},
    {"id": 3, "icon": "💎", "text": "고급 분석"},
    {"id": 4, "icon": "🎯", "text": "정확한 예측"},
    {"id": 5, "icon": "🏆", "text": "최고 품질"}
  ]'::jsonb
WHERE id IN (5, 10, 15, 20, 25);

UPDATE locations SET 
  icon = '🏮',
  features = '[
    {"id": 1, "icon": "📚", "text": "전통 명리학"},
    {"id": 2, "icon": "👨‍🏫", "text": "전문가 상담"},
    {"id": 3, "icon": "🎭", "text": "깊이 있는 분석"},
    {"id": 4, "icon": "🔍", "text": "상세한 해석"},
    {"id": 5, "icon": "📖", "text": "전통 기법"}
  ]'::jsonb
WHERE id IN (7, 14, 21, 28);

UPDATE locations SET 
  icon = '⚡',
  features = '[
    {"id": 1, "icon": "🤖", "text": "AI 분석"},
    {"id": 2, "icon": "⚡", "text": "빠른 결과"},
    {"id": 3, "icon": "📊", "text": "데이터 기반"},
    {"id": 4, "icon": "🎯", "text": "정확한 예측"},
    {"id": 5, "icon": "📱", "text": "모바일 최적화"}
  ]'::jsonb
WHERE id IN (6, 12, 18, 24, 30);


