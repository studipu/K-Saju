-- Delete All Locations Without Photos
-- Execute this script in your Supabase SQL Editor to remove locations without proper image URLs

-- STEP 1: Check current locations and their image status
SELECT 
  id, 
  title, 
  image_url,
  main_image_url,
  CASE 
    WHEN image_url IS NULL AND main_image_url IS NULL THEN 'NO PHOTOS'
    WHEN image_url = '' AND main_image_url = '' THEN 'EMPTY PHOTOS'
    WHEN image_url IS NULL AND main_image_url = '' THEN 'NO PHOTOS'
    WHEN image_url = '' AND main_image_url IS NULL THEN 'NO PHOTOS'
    ELSE 'HAS PHOTOS'
  END as photo_status
FROM locations 
ORDER BY photo_status DESC;

-- STEP 2: Show count of locations by photo status
SELECT 
  CASE 
    WHEN image_url IS NULL AND main_image_url IS NULL THEN 'NO PHOTOS'
    WHEN image_url = '' AND main_image_url = '' THEN 'EMPTY PHOTOS'
    WHEN image_url IS NULL AND main_image_url = '' THEN 'NO PHOTOS'
    WHEN image_url = '' AND main_image_url IS NULL THEN 'NO PHOTOS'
    ELSE 'HAS PHOTOS'
  END as photo_status,
  COUNT(*) as count
FROM locations 
GROUP BY 
  CASE 
    WHEN image_url IS NULL AND main_image_url IS NULL THEN 'NO PHOTOS'
    WHEN image_url = '' AND main_image_url = '' THEN 'EMPTY PHOTOS'
    WHEN image_url IS NULL AND main_image_url = '' THEN 'NO PHOTOS'
    WHEN image_url = '' AND main_image_url IS NULL THEN 'NO PHOTOS'
    ELSE 'HAS PHOTOS'
  END
ORDER BY count DESC;

-- STEP 3: Delete locations without photos
-- This will delete locations where both image_url and main_image_url are null or empty

DELETE FROM locations 
WHERE 
  (image_url IS NULL OR image_url = '') 
  AND 
  (main_image_url IS NULL OR main_image_url = '');

-- STEP 4: Alternative - More conservative approach (only delete if BOTH fields are completely missing)
-- Uncomment the line below and comment out STEP 3 if you want to be more conservative:
-- DELETE FROM locations WHERE image_url IS NULL AND main_image_url IS NULL;

-- STEP 5: Show results after deletion
SELECT 'Locations without photos have been deleted!' as status;
SELECT COUNT(*) as remaining_locations FROM locations;
SELECT 
  id, 
  title, 
  CASE 
    WHEN image_url IS NOT NULL AND image_url != '' THEN image_url
    WHEN main_image_url IS NOT NULL AND main_image_url != '' THEN main_image_url
    ELSE 'NO IMAGE'
  END as primary_image
FROM locations 
ORDER BY title;

-- STEP 6: Verify all remaining locations have images
SELECT 
  'All remaining locations have photos: ' || 
  CASE 
    WHEN COUNT(*) = 0 THEN 'TRUE - No locations without photos found'
    ELSE 'FALSE - ' || COUNT(*) || ' locations still without photos'
  END as verification_result
FROM locations 
WHERE 
  (image_url IS NULL OR image_url = '') 
  AND 
  (main_image_url IS NULL OR main_image_url = '');
