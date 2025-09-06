-- إضافة حقل الصورة إلى جدول المستخدمين
-- Add Image Column to Users Table

USE ElectronicsStoreDB;
GO

-- التحقق من وجود العمود قبل الإضافة
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS 
               WHERE TABLE_NAME = 'users' AND COLUMN_NAME = 'image')
BEGIN
    -- إضافة حقل الصورة
    ALTER TABLE users 
    ADD image NVARCHAR(500) NULL;
    
    PRINT 'تم إضافة حقل الصورة إلى جدول المستخدمين بنجاح';
END
ELSE
BEGIN
    PRINT 'حقل الصورة موجود بالفعل في جدول المستخدمين';
END
GO

-- إضافة تعليق على العمود (اختياري)
EXEC sp_addextendedproperty 
    @name = N'MS_Description',
    @value = N'مسار صورة المستخدم أو Base64 للصورة',
    @level0type = N'SCHEMA', @level0name = 'dbo',
    @level1type = N'TABLE', @level1name = 'users',
    @level2type = N'COLUMN', @level2name = 'image';
GO

-- عرض هيكل الجدول المحدث
SELECT 
    COLUMN_NAME as 'اسم العمود',
    DATA_TYPE as 'نوع البيانات',
    CHARACTER_MAXIMUM_LENGTH as 'الحد الأقصى للطول',
    IS_NULLABLE as 'يقبل NULL'
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_NAME = 'users'
ORDER BY ORDINAL_POSITION;
GO
