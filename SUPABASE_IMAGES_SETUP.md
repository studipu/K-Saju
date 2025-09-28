# 📸 **Supabase Storage Setup for Business Images**

## 🎯 **Step-by-Step Instructions**

### **Step 1: Create Storage Bucket**
1. Go to your **Supabase Dashboard**
2. Navigate to **Storage** in the left sidebar
3. Click **New bucket**
4. Name it `business-images`
5. Make it **Public** (so images can be accessed via URL)
6. Click **Create bucket**

### **Step 2: Upload Your Images**
1. Click on the `business-images` bucket
2. Click **Upload file**
3. Upload these 3 files from `src/assets/pseudo/`:
   - `main_photo.png` → Rename to `k-saju-main.png`
   - `sub_photo1.jpg` → Rename to `k-saju-gallery-1.jpg`
   - `sub_photo2.jpg` → Rename to `k-saju-gallery-2.jpg`

### **Step 3: Get Public URLs**
After uploading, you'll get URLs like:
```
https://[your-project].supabase.co/storage/v1/object/public/business-images/k-saju-main.png
https://[your-project].supabase.co/storage/v1/object/public/business-images/k-saju-gallery-1.jpg
https://[your-project].supabase.co/storage/v1/object/public/business-images/k-saju-gallery-2.jpg
```

### **Step 4: Update SQL Script**
Replace the image URLs in `complete_localized_business_data.sql`:

```sql
-- Replace this section in the SQL file:
main_image_url = 'https://[your-project].supabase.co/storage/v1/object/public/business-images/k-saju-main.png',
gallery_images = ARRAY[
  'https://[your-project].supabase.co/storage/v1/object/public/business-images/k-saju-main.png',
  'https://[your-project].supabase.co/storage/v1/object/public/business-images/k-saju-gallery-1.jpg',
  'https://[your-project].supabase.co/storage/v1/object/public/business-images/k-saju-gallery-2.jpg'
],
```

### **Step 5: Run Updated SQL**
Execute the updated SQL script in Supabase SQL Editor.

---

## 🚀 **Quick Alternative: Using Vite's Public Folder**

If you want to test immediately without Supabase Storage:

### **Step 1: Move Images to Public Folder**
```bash
# Move your images to the public folder so they're accessible
mkdir -p public/images
cp src/assets/pseudo/* public/images/
```

### **Step 2: Update SQL Script**
```sql
main_image_url = '/images/main_photo.png',
gallery_images = ARRAY[
  '/images/main_photo.png',
  '/images/sub_photo1.jpg', 
  '/images/sub_photo2.jpg'
],
```

---

## 🎨 **Image Optimization Tips**

### **Recommended Sizes:**
- **Main Image**: 1200x800px (3:2 ratio)
- **Gallery Images**: 800x600px or 1000x750px
- **Format**: JPG for photos, PNG for graphics with transparency

### **Optimization:**
- Compress images to under 500KB each
- Use modern formats (WebP) if possible
- Consider responsive image sizes

---

## 🔧 **React Component Updates**

The business detail component will automatically display your images once the URLs are updated in the database. The component already handles:

- ✅ **Main image display**
- ✅ **Gallery thumbnail grid**
- ✅ **Image modal/lightbox**
- ✅ **Responsive layout**
- ✅ **Loading states**

---

## 📝 **Final Checklist**

- [ ] Create `business-images` bucket in Supabase Storage
- [ ] Upload your 3 images with descriptive names
- [ ] Copy the public URLs
- [ ] Update the SQL script with real URLs
- [ ] Run the updated SQL script
- [ ] Test the business detail page
- [ ] Verify images load properly on mobile and desktop

Your business images will then display beautifully in the Airbnb-style gallery! 🌟
