# دليل تشغيل Backend

## 🚀 **خطوات تشغيل Backend:**

### **1. فتح Terminal في مجلد Backend:**
```bash
cd Backend/ElectronicsStore.WebAPI
```

### **2. تثبيت الحزم:**
```bash
dotnet restore
```

### **3. تشغيل قاعدة البيانات:**
```bash
# إنشاء قاعدة البيانات
dotnet ef database update

# أو تشغيل SQL Server Express
# تأكد أن SQL Server يعمل على localhost
```

### **4. تشغيل Backend:**
```bash
dotnet run
```

### **5. التحقق من التشغيل:**
- افتح المتصفح واذهب إلى: `http://localhost:5000`
- يجب أن ترى صفحة Swagger API

## 🔧 **إعدادات مهمة:**

### **في appsettings.json:**
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=ElectronicsStoreDB;Trusted_Connection=true;TrustServerCertificate=true;"
  },
  "JwtSettings": {
    "SecretKey": "your-secret-key-here",
    "Issuer": "ElectronicsStore",
    "Audience": "ElectronicsStoreUsers",
    "ExpiryInMinutes": 60
  }
}
```

## 🐛 **حل المشاكل الشائعة:**

### **مشكلة: لا يمكن الاتصال بقاعدة البيانات**
```bash
# تأكد أن SQL Server يعمل
# أو استخدم SQL Server Express
# أو غير Connection String
```

### **مشكلة: Port 5000 مستخدم**
```bash
# في launchSettings.json غير المنفذ
"applicationUrl": "http://localhost:5001"
```

### **مشكلة: JWT Secret Key**
```bash
# في appsettings.json أضف مفتاح سري
"SecretKey": "MySuperSecretKey123456789"
```

## ✅ **التحقق من النجاح:**

1. **Backend يعمل** على `http://localhost:5000`
2. **Swagger UI** يظهر
3. **Frontend يتصل** مع Backend بنجاح
4. **تسجيل الدخول** يعمل مع قاعدة البيانات

## 📝 **ملاحظات:**

- تأكد أن Frontend يعمل على `http://localhost:5173`
- تأكد أن Backend يعمل على `http://localhost:5000`
- تأكد أن قاعدة البيانات متصلة ومليئة بالبيانات
