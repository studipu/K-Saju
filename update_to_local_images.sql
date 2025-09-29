-- K-Saju Local Images Update Script
-- Replaces external Unsplash images with local pseudo folder images
-- Generated: 2024-09-29

BEGIN;

-- Copy images from pseudo to public for web access
-- Note: You should copy these files to public/images/ directory first

-- Update services to use local images from pseudo folder
-- We'll distribute the available images across different services

-- Group 1: Popular Services (main_photo.png variations)
UPDATE locations SET 
  main_image_url = '/images/main_photo.png',
  image_url = '/images/main_photo.png',
  gallery_images = ARRAY['/images/main_photo.png', '/images/sub_photo1.jpg', '/images/sub_photo2.jpg']
WHERE id IN (
  '11111111-1111-4111-8111-111111111111', -- Mystic Tarot Salon
  '22222222-2222-4222-8222-222222222222', -- Oriental Saju Palace
  '33333333-3333-4333-8333-333333333333'  -- Palm & Face Reading Center
);

-- Group 2: Recommended Services (1651732113097.jpg variations)
UPDATE locations SET 
  main_image_url = '/images/1651732113097.jpg',
  image_url = '/images/1651732113097.jpg',
  gallery_images = ARRAY['/images/1651732113097.jpg', '/images/main_photo.png', '/images/sub_photo1.jpg']
WHERE id IN (
  '44444444-4444-4444-8444-444444444444', -- Mystic Numerology Institute
  '55555555-5555-4555-8555-555555555555', -- Crystal Healing Center
  '66666666-6666-4666-8666-666666666666'  -- Feng Shui Harmony Institute
);

-- Group 3: Hot Deals Services (1651734489956.jpg variations)
UPDATE locations SET 
  main_image_url = '/images/1651734489956.jpg',
  image_url = '/images/1651734489956.jpg',
  gallery_images = ARRAY['/images/1651734489956.jpg', '/images/sub_photo2.jpg', '/images/main_photo.png']
WHERE id IN (
  '77777777-7777-4777-8777-777777777777', -- Dream Interpretation Center
  '88888888-8888-4888-8888-888888888888', -- I-Ching Wisdom Center
  '99999999-9999-4999-8999-999999999999'  -- Tea Zen Unity Center
);

-- Group 4: Additional Services (1713242744077-photo variations)
UPDATE locations SET 
  main_image_url = '/images/1713242744077-photo-6l22g-601275-0.jpeg',
  image_url = '/images/1713242744077-photo-6l22g-601275-0.jpeg',
  gallery_images = ARRAY['/images/1713242744077-photo-6l22g-601275-0.jpeg', '/images/1651732113097.jpg', '/images/sub_photo1.jpg']
WHERE id IN (
  'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', -- Moon Star Astrology Center
  'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb', -- Sky Palace Destiny Center
  'cccccccc-cccc-4ccc-8ccc-cccccccccccc'  -- Star Sign Cafe
);

-- Group 5: Remaining Services (8rPK21688101602.jpg variations)
UPDATE locations SET 
  main_image_url = '/images/8rPK21688101602.jpg',
  image_url = '/images/8rPK21688101602.jpg',
  gallery_images = ARRAY['/images/8rPK21688101602.jpg', '/images/1651734489956.jpg', '/images/sub_photo2.jpg']
WHERE id IN (
  'dddddddd-dddd-4ddd-8ddd-dddddddddddd', -- Viking Rune Stone
  'eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee', -- Celtic Druid Circle
  'ffffffff-ffff-4fff-8fff-ffffffffffff'  -- Native Spirit Center
);

-- Group 6: Final Services (A6knw1705443007.jpg variations)
UPDATE locations SET 
  main_image_url = '/images/A6knw1705443007.jpg',
  image_url = '/images/A6knw1705443007.jpg',
  gallery_images = ARRAY['/images/A6knw1705443007.jpg', '/images/8rPK21688101602.jpg', '/images/main_photo.png']
WHERE id IN (
  'aaaabbbb-cccc-4ddd-8eee-ffffaaaabbbb', -- Hawaiian Healing Center
  'ccccdddd-eeee-4fff-8aaa-bbbbccccdddd', -- Tibetan Mandala Center
  'eeeeaaaa-bbbb-4ccc-8ddd-eeeeffff1111'  -- Egyptian Oracle Center
);

-- Group 7: Alternative images for remaining services
UPDATE locations SET 
  main_image_url = '/images/images.jpeg',
  image_url = '/images/images.jpeg',
  gallery_images = ARRAY['/images/images.jpeg', '/images/A6knw1705443007.jpg', '/images/sub_photo1.jpg']
WHERE id IN (
  'aaaacccc-eeee-4bbb-8fff-dddd22222222', -- Mayan Calendar Center
  'bbbbcccc-dddd-4eee-8fff-aaaaabbbbccc', -- Oracle Garden Cafe
  'ddddeeee-ffff-4aaa-8bbb-ccccddddeeee'  -- Himalayan Crystal Center
);

-- Verify all updates
SELECT 
  id, 
  title, 
  main_image_url,
  CASE 
    WHEN main_image_url LIKE '/images/%' THEN '✅ Local Image'
    ELSE '❌ External Image'
  END as image_status
FROM locations 
ORDER BY title;

-- Count updated records
SELECT 
  COUNT(*) as total_services,
  COUNT(CASE WHEN main_image_url LIKE '/images/%' THEN 1 END) as local_images,
  COUNT(CASE WHEN main_image_url NOT LIKE '/images/%' THEN 1 END) as external_images
FROM locations;

COMMIT;

-- Success message
SELECT '🎉 All services now use local images from pseudo folder!' as result;
