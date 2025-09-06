-------------------------------------------------------------------------------- 
-- 16. View لحساب الكمية الحالية (Inventory View) 
CREATE VIEW inventory_view AS 
SELECT 
    p.id                   AS product_id, 
    p.name                 AS product_name, 
    ISNULL(SUM(il.quantity),0) AS current_quantity 
FROM products p 
LEFT JOIN inventory_logs il  
    ON p.id = il.product_id 
GROUP BY p.id,p.name; 
GO 
 
-------------------------------------------------------------------------------- 
-- 17. View لتقييم قيمة المخزون (Inventory Valuation View) 
CREATE VIEW inventory_valuation_view AS 
SELECT 
    p.id                   AS product_id, 
    p.name                 AS product_name, 
    ISNULL(SUM(il.quantity * il.unit_cost),0) AS total_value 
FROM products p 
LEFT JOIN inventory_logs il  
    ON p.id = il.product_id 
GROUP BY p.id,p.name; 
GO 
 
-------------------------------------------------------------------------------- 
-- 18. View لحساب تكلفة البضاعة المباعة (COGS View) 
CREATE VIEW cogs_view AS 
SELECT 
    si.id                   AS sales_invoice_id, 
    si.invoice_number, 
    ISNULL(SUM(-il.quantity * il.unit_cost),0) AS cost_of_goods_sold 
FROM sales_invoices si 
JOIN inventory_logs il 
    ON il.reference_tbl = 'sales_invoice' 
   AND il.reference_id  = si.id 
   AND il.movement_type = 'sale' 
GROUP BY si.id,si.invoice_number; 
GO

-------------------------------------------------------------------------------- 
-- 19. إدراج البيانات الأساسية (Initial Data)

-- إدراج الأدوار الأساسية
INSERT INTO roles (name) VALUES 
('Admin'),
('Manager'), 
('Cashier'),
('Inventory_Clerk');
GO

-- إدراج الصلاحيات الأساسية
INSERT INTO permissions (name, description) VALUES 
('CREATE_PRODUCT', 'إنشاء منتج جديد'),
('UPDATE_PRODUCT', 'تعديل بيانات المنتج'),
('DELETE_PRODUCT', 'حذف منتج'),
('VIEW_PRODUCT', 'عرض المنتجات'),
('CREATE_PURCHASE', 'إنشاء فاتورة شراء'),
('VIEW_PURCHASE', 'عرض فواتير الشراء'),
('CREATE_SALE', 'إنشاء فاتورة بيع'),
('VIEW_SALE', 'عرض فواتير البيع'),
('OVERRIDE_MIN_PRICE', 'تجاوز الحد الأدنى للسعر'),
('VIEW_REPORTS', 'عرض التقارير'),
('MANAGE_USERS', 'إدارة المستخدمين'),
('MANAGE_INVENTORY', 'إدارة المخزون');
GO

-- ربط الأدوار بالصلاحيات
-- Admin - جميع الصلاحيات
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id 
FROM roles r, permissions p 
WHERE r.name = 'Admin';

-- Manager - معظم الصلاحيات
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id 
FROM roles r, permissions p 
WHERE r.name = 'Manager' 
AND p.name IN ('CREATE_PRODUCT', 'UPDATE_PRODUCT', 'VIEW_PRODUCT', 'CREATE_PURCHASE', 'VIEW_PURCHASE', 
               'CREATE_SALE', 'VIEW_SALE', 'OVERRIDE_MIN_PRICE', 'VIEW_REPORTS', 'MANAGE_INVENTORY');

-- Cashier - صلاحيات البيع
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id 
FROM roles r, permissions p 
WHERE r.name = 'Cashier' 
AND p.name IN ('VIEW_PRODUCT', 'CREATE_SALE', 'VIEW_SALE');

-- Inventory Clerk - صلاحيات المخزون
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id 
FROM roles r, permissions p 
WHERE r.name = 'Inventory_Clerk' 
AND p.name IN ('VIEW_PRODUCT', 'CREATE_PURCHASE', 'VIEW_PURCHASE', 'MANAGE_INVENTORY');
GO
