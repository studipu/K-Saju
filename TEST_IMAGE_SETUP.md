# 🔍 **Testing Your Image Setup**

## 🎯 **Quick Diagnostic Steps**

### **Step 1: Check if SQL Script Ran**
Run this query in your Supabase SQL Editor to check if the images were saved:

```sql
SELECT 
  id,
  title,
  main_image_url,
  gallery_images
FROM locations 
WHERE id = '550e8400-e29b-41d4-a716-446655440002';
```

**Expected Result:**
```
main_image_url: "/images/main_photo.png"
gallery_images: ["/images/main_photo.png", "/images/sub_photo1.jpg", "/images/sub_photo2.jpg"]
```

### **Step 2: Check Images Are Accessible**
Open these URLs in your browser (while your dev server is running):
- `http://localhost:5173/images/main_photo.png`
- `http://localhost:5173/images/sub_photo1.jpg`
- `http://localhost:5173/images/sub_photo2.jpg`

**If images don't load:**
- Images weren't copied correctly to `public/images/`
- Dev server isn't serving the public folder

### **Step 3: Check Console Output**
1. **Start your dev server**: `npm run dev`
2. **Visit the business page**: Click any service card
3. **Open browser console** (F12)
4. **Look for debug output**: Should show image URLs

**Expected Console Output:**
```
Business Data: {
  main_image_url: "/images/main_photo.png",
  gallery_images: ["/images/main_photo.png", "/images/sub_photo1.jpg", "/images/sub_photo2.jpg"],
  title: "K-SAJU 프리미엄 사주상담소"
}
```

---

## 🚨 **Common Issues & Fixes**

### **Issue 1: SQL Script Didn't Run**
**Symptoms:** Database still has old/empty image URLs
**Fix:** 
```sql
-- Re-run this part of the SQL script:
UPDATE locations 
SET 
  main_image_url = '/images/main_photo.png',
  gallery_images = ARRAY[
    '/images/main_photo.png',
    '/images/sub_photo1.jpg',
    '/images/sub_photo2.jpg'
  ]
WHERE id = '550e8400-e29b-41d4-a716-446655440002';
```

### **Issue 2: Images Not Found (404)**
**Symptoms:** Console shows 404 errors for image URLs
**Fix:** 
```bash
# Verify images are in the right place:
ls -la public/images/

# If not there, copy again:
cp src/assets/pseudo/* public/images/
```

### **Issue 3: Gallery Shows Placeholders**
**Symptoms:** Still shows "Main Photo", "Photo 2", "Photo 3"
**Fix:** 
- Check console for business data
- Verify image URLs are in the database
- Clear browser cache and refresh

### **Issue 4: Images Show but Don't Load**
**Symptoms:** Gallery layout works but images are broken
**Fix:**
- Check image file formats (PNG/JPG supported)
- Verify file permissions
- Try different browser

---

## ✅ **Success Checklist**

- [ ] SQL query shows correct image URLs in database
- [ ] Direct image URLs load in browser
- [ ] Console shows business data with image URLs
- [ ] Main gallery image displays (not placeholder text)
- [ ] Thumbnail images display (not placeholder text)
- [ ] Modal/lightbox works with real images
- [ ] Images are responsive on mobile

---

## 🔧 **Quick Fix Commands**

```bash
# 1. Ensure images are in public folder
ls public/images/

# 2. If missing, copy them:
cp src/assets/pseudo/* public/images/

# 3. Start dev server
npm run dev

# 4. Test image URLs directly:
# http://localhost:5173/images/main_photo.png
# http://localhost:5173/images/sub_photo1.jpg  
# http://localhost:5173/images/sub_photo2.jpg
```

---

## 📞 **Still Not Working?**

If images still don't show:

1. **Check the console output** - this will tell us what data the component is receiving
2. **Verify the SQL update worked** - run the database query above
3. **Test image accessibility** - try the direct URLs
4. **Clear browser cache** - hard refresh with Ctrl+F5

The debug logging I added will help us identify exactly where the issue is! 🔍
