# قائمة محدثة بـ API Endpoints - دعم الصور

## 📸 **File Upload Management (إدارة رفع الملفات)**

### **User Images (صور المستخدمين)**

| المسار (Route) | طريقة HTTP | الوظيفة | المعاملات | الاستجابة | رموز الحالة |
|---|---|---|---|---|---|
| `POST /api/fileupload/user-image` | POST | رفع صورة مستخدم | **Headers:** Authorization Bearer Token <br> **Body:** `multipart/form-data` <br> `file: IFormFile` | `{ "message": "string", "imagePath": "/uploads/users/filename.jpg", "fileName": "string", "fileSize": number }` | 200, 400, 401, 500 |
| `DELETE /api/fileupload/user-image` | DELETE | حذف صورة مستخدم | **Headers:** Authorization Bearer Token <br> **Query:** `imagePath` (string) | `{ "message": "string" }` | 200, 400, 401, 404, 500 |

### **Product Images (صور المنتجات)**

| المسار (Route) | طريقة HTTP | الوظيفة | المعاملات | الاستجابة | رموز الحالة |
|---|---|---|---|---|---|
| `POST /api/fileupload/product-image` | POST | رفع صورة منتج | **Headers:** Authorization Bearer Token <br> **Body:** `multipart/form-data` <br> `file: IFormFile` | `{ "message": "string", "imagePath": "/uploads/products/filename.jpg", "fileName": "string", "fileSize": number }` | 200, 400, 401, 500 |
| `DELETE /api/fileupload/product-image` | DELETE | حذف صورة منتج | **Headers:** Authorization Bearer Token <br> **Query:** `imagePath` (string) | `{ "message": "string" }` | 200, 400, 401, 404, 500 |

### **File Information (معلومات الملفات)**

| المسار (Route) | طريقة HTTP | الوظيفة | المعاملات | الاستجابة | رموز الحالة |
|---|---|---|---|---|---|
| `GET /api/fileupload/info` | GET | الحصول على معلومات ملف | **Query:** `filePath` (string) | `{ "fileName": "string", "filePath": "string", "fileSize": number, "createdAt": "datetime", "lastModified": "datetime" }` | 200, 400, 404, 500 |

---

## 🔄 **تحديثات على Authentication & Users**

### **تحديثات على التسجيل والمستخدمين**

الآن جميع DTOs الخاصة بالمستخدمين تدعم حقل `Image`:

#### **RegisterDto المحدث:**
```json
{
  "username": "string",
  "email": "string", 
  "password": "string",
  "confirmPassword": "string",
  "fullName": "string",
  "phoneNumber": "string",
  "image": "string" // مسار الصورة أو Base64
}
```

#### **CreateUserDto المحدث:**
```json
{
  "username": "string",
  "email": "string",
  "password": "string", 
  "fullName": "string",
  "phoneNumber": "string",
  "roleId": number,
  "isActive": boolean,
  "image": "string" // مسار الصورة أو Base64
}
```

#### **UpdateUserDto المحدث:**
```json
{
  "email": "string",
  "fullName": "string", 
  "phoneNumber": "string",
  "roleId": number,
  "isActive": boolean,
  "image": "string" // مسار الصورة أو Base64
}
```

#### **UserDto المحدث:**
```json
{
  "id": number,
  "username": "string",
  "email": "string",
  "fullName": "string",
  "phoneNumber": "string", 
  "roleId": number,
  "roleName": "string",
  "isActive": boolean,
  "createdAt": "datetime",
  "lastLoginAt": "datetime",
  "image": "string", // مسار الصورة أو Base64
  "permissions": ["string"]
}
```

---

## 📝 **كيفية استخدام رفع الصور**

### **1. رفع صورة مستخدم:**

```javascript
// Frontend JavaScript Example
const formData = new FormData();
formData.append('file', fileInput.files[0]);

fetch('/api/fileupload/user-image', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer ' + token
  },
  body: formData
})
.then(response => response.json())
.then(data => {
  console.log('Image uploaded:', data.imagePath);
  // استخدم data.imagePath لتحديث بيانات المستخدم
});
```

### **2. تحديث بيانات المستخدم مع الصورة:**

```javascript
// بعد رفع الصورة، حدث بيانات المستخدم
const updateData = {
  email: "user@example.com",
  fullName: "اسم المستخدم",
  phoneNumber: "123456789",
  roleId: 2,
  isActive: true,
  image: "/uploads/users/filename.jpg" // المسار المرجع من رفع الصورة
};

fetch('/api/users/1', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + token
  },
  body: JSON.stringify(updateData)
});
```

### **3. عرض الصورة:**

```html
<!-- في HTML -->
<img src="https://localhost:7001/uploads/users/filename.jpg" alt="صورة المستخدم" />
```

---

## 🔒 **قيود الأمان:**

### **أنواع الملفات المسموحة:**
- **للمستخدمين:** `.jpg`, `.jpeg`, `.png`, `.gif`, `.bmp`
- **للمنتجات:** `.jpg`, `.jpeg`, `.png`, `.gif`, `.bmp`

### **أحجام الملفات:**
- **صور المستخدمين:** حد أقصى 5 ميجابايت
- **صور المنتجات:** حد أقصى 10 ميجابايت

### **مسارات التخزين:**
- **صور المستخدمين:** `/uploads/users/`
- **صور المنتجات:** `/uploads/products/`

### **الأمان:**
- جميع endpoints تتطلب Authentication
- التحقق من نوع وحجم الملف
- أسماء ملفات فريدة باستخدام GUID
- حماية من Path Traversal attacks

---

## 🗄️ **تحديثات قاعدة البيانات:**

تم إضافة حقل `image` إلى جدول `users`:

```sql
ALTER TABLE users 
ADD image NVARCHAR(500) NULL;
```

**خصائص الحقل:**
- **النوع:** `NVARCHAR(500)`
- **يقبل NULL:** نعم
- **الوصف:** مسار صورة المستخدم أو Base64 للصورة

---

## 🚀 **مثال كامل لتطبيق Frontend:**

```html
<!DOCTYPE html>
<html>
<head>
    <title>رفع صورة المستخدم</title>
</head>
<body>
    <form id="uploadForm">
        <input type="file" id="imageFile" accept="image/*" required>
        <button type="submit">رفع الصورة</button>
    </form>
    
    <div id="result"></div>
    <img id="previewImage" style="max-width: 200px; display: none;">

    <script>
        const token = 'YOUR_JWT_TOKEN_HERE';
        
        document.getElementById('uploadForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const fileInput = document.getElementById('imageFile');
            const file = fileInput.files[0];
            
            if (!file) {
                alert('يرجى اختيار صورة');
                return;
            }
            
            const formData = new FormData();
            formData.append('file', file);
            
            try {
                const response = await fetch('/api/fileupload/user-image', {
                    method: 'POST',
                    headers: {
                        'Authorization': 'Bearer ' + token
                    },
                    body: formData
                });
                
                const data = await response.json();
                
                if (response.ok) {
                    document.getElementById('result').innerHTML = 
                        `<p style="color: green;">${data.message}</p>
                         <p>مسار الصورة: ${data.imagePath}</p>`;
                    
                    // عرض الصورة
                    const img = document.getElementById('previewImage');
                    img.src = 'https://localhost:7001' + data.imagePath;
                    img.style.display = 'block';
                    
                    // الآن يمكنك تحديث بيانات المستخدم
                    // updateUserWithImage(data.imagePath);
                } else {
                    document.getElementById('result').innerHTML = 
                        `<p style="color: red;">${data.message}</p>`;
                }
            } catch (error) {
                console.error('Error:', error);
                document.getElementById('result').innerHTML = 
                    `<p style="color: red;">خطأ في رفع الصورة</p>`;
            }
        });
    </script>
</body>
</html>
```

هذا التحديث يوفر دعماً كاملاً لرفع وإدارة صور المستخدمين والمنتجات في نظام إدارة متجر الإلكترونيات! 🎉
