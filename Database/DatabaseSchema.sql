-- 1. إنشاء قاعدة البيانات (إن لم تكن موجودة) 
IF DB_ID(N'ElectronicsStoreDB') IS NULL 
    CREATE DATABASE ElectronicsStoreDB; 
GO 
USE ElectronicsStoreDB; 
GO 
 
-------------------------------------------------------------------------------- 
-- 2. الأصناف (Categories) 
CREATE TABLE categories ( 
    id   INT IDENTITY(1,1) PRIMARY KEY, 
    name NVARCHAR(100) NOT NULL UNIQUE 
); 
GO 
 
-- 3. الموردين (Suppliers) 
CREATE TABLE suppliers ( 
    id      INT IDENTITY(1,1) PRIMARY KEY, 
    name    NVARCHAR(100) NOT NULL, 
    phone   NVARCHAR(20), 
    email   NVARCHAR(100), 
    address NVARCHAR(200) 
); 
GO 
 
-------------------------------------------------------------------------------- 
-- 4. الأدوار (Roles) 
CREATE TABLE roles ( 
    id   INT IDENTITY(1,1) PRIMARY KEY, 
    name NVARCHAR(50) NOT NULL UNIQUE 
); 
GO 
 
-- 5. الصلاحيات (Permissions) 
CREATE TABLE permissions ( 
    id          INT IDENTITY(1,1) PRIMARY KEY, 
    name        NVARCHAR(100) NOT NULL UNIQUE, 
    description NVARCHAR(200) 
); 
GO 
 
-- 6. ربط الأدوار بالصلاحيات (Role_Permissions) 
CREATE TABLE role_permissions ( 
    role_id       INT NOT NULL, 
    permission_id INT NOT NULL, 
    PRIMARY KEY (role_id,permission_id), 
    FOREIGN KEY (role_id)       REFERENCES roles(id), 
    FOREIGN KEY (permission_id) REFERENCES permissions(id) 
); 
GO 
 
-------------------------------------------------------------------------------- 
-- 7. المستخدمين (Users) 
CREATE TABLE users ( 
    id         INT IDENTITY(1,1) PRIMARY KEY, 
    username   NVARCHAR(50)  NOT NULL UNIQUE, 
    password   NVARCHAR(100) NOT NULL, 
    role_id    INT           NOT NULL, 
    created_at DATETIME      DEFAULT GETDATE(), 
    FOREIGN KEY (role_id) REFERENCES roles(id) 
); 
GO 
 
-------------------------------------------------------------------------------- 
-- 8. المنتجات (Products) 
CREATE TABLE products ( 
    id                    INT IDENTITY(1,1) PRIMARY KEY, 
    name                  NVARCHAR(150) NOT NULL, 
    barcode               NVARCHAR(50) UNIQUE, 
    category_id           INT          NOT NULL, 
    supplier_id           INT          NULL, 
    default_cost_price    DECIMAL(10,2) NOT NULL CHECK(default_cost_price >= 0), 
    default_selling_price DECIMAL(10,2) NOT NULL CHECK(default_selling_price >= 0), 
    min_selling_price     DECIMAL(10,2) NOT NULL CHECK(min_selling_price >= 0), 
    description           NVARCHAR(500) NULL, 
    created_at            DATETIME      DEFAULT GETDATE(), 
    FOREIGN KEY (category_id) REFERENCES categories(id), 
    FOREIGN KEY (supplier_id) REFERENCES suppliers(id) 
); 
GO

--------------------------------------------------------------------------------
-- 9. فواتير الشراء (Purchase Invoices) والتفاصيل
CREATE TABLE purchase_invoices (
    id             INT IDENTITY(1,1) PRIMARY KEY,
    invoice_number NVARCHAR(50)  NOT NULL UNIQUE,
    supplier_id    INT           NOT NULL,
    invoice_date   DATETIME      DEFAULT GETDATE(),
    user_id        INT           NOT NULL,
    total_amount   DECIMAL(14,2) NOT NULL,
    FOREIGN KEY (supplier_id) REFERENCES suppliers(id),
    FOREIGN KEY (user_id)       REFERENCES users(id)
);
GO

CREATE TABLE purchase_invoice_details (
    id                  INT IDENTITY(1,1) PRIMARY KEY,
    purchase_invoice_id INT           NOT NULL,
    product_id          INT           NOT NULL,
    quantity            INT           NOT NULL CHECK(quantity > 0),
    unit_cost           DECIMAL(10,2) NOT NULL CHECK(unit_cost >= 0),
    line_total          AS (quantity * unit_cost) PERSISTED,
    FOREIGN KEY (purchase_invoice_id) REFERENCES purchase_invoices(id),
    FOREIGN KEY (product_id)          REFERENCES products(id)
);
GO

--------------------------------------------------------------------------------
-- 10. فواتير البيع (Sales Invoices) والتفاصيل
CREATE TABLE sales_invoices (
    id                  INT IDENTITY(1,1) PRIMARY KEY,
    invoice_number      NVARCHAR(50)  NOT NULL UNIQUE,
    customer_name       NVARCHAR(100) NULL,
    invoice_date        DATETIME      DEFAULT GETDATE(),
    discount_total      DECIMAL(12,2) NOT NULL DEFAULT 0 CHECK(discount_total >= 0),
    total_amount        DECIMAL(14,2) NOT NULL CHECK(total_amount >= 0),
    payment_method      NVARCHAR(20)  NOT NULL CHECK(payment_method IN('cash','card','deferred')),
    override_by_user_id INT           NULL,
    override_date       DATETIME      NULL,
    user_id             INT           NOT NULL,
    FOREIGN KEY (override_by_user_id) REFERENCES users(id),
    FOREIGN KEY (user_id)               REFERENCES users(id)
);
GO

CREATE TABLE sales_invoice_details (
    id               INT IDENTITY(1,1) PRIMARY KEY,
    sales_invoice_id INT           NOT NULL,
    product_id       INT           NOT NULL,
    quantity         INT           NOT NULL CHECK(quantity > 0),
    unit_price       DECIMAL(10,2) NOT NULL CHECK(unit_price >= 0),
    discount_amount  DECIMAL(10,2) NOT NULL DEFAULT 0 CHECK(discount_amount >= 0),
    line_total       AS ((unit_price - discount_amount) * quantity) PERSISTED,
    FOREIGN KEY (sales_invoice_id) REFERENCES sales_invoices(id),
    FOREIGN KEY (product_id)          REFERENCES products(id)
);
GO

-------------------------------------------------------------------------------- 
-- 11. Trigger للتحقق من الحد الأدنى للسعر 
IF OBJECT_ID(N'dbo.trg_CheckMinSellingPrice','TR') IS NOT NULL 
    DROP TRIGGER dbo.trg_CheckMinSellingPrice; 
GO 
CREATE TRIGGER trg_CheckMinSellingPrice 
ON sales_invoice_details 
AFTER INSERT, UPDATE 
AS 
BEGIN 
    SET NOCOUNT ON; 
    IF EXISTS ( 
        SELECT 1 
        FROM inserted i 
        JOIN products p ON i.product_id = p.id 
        JOIN sales_invoices s ON i.sales_invoice_id = s.id 
        WHERE (i.unit_price - i.discount_amount) < p.min_selling_price 
          AND s.override_by_user_id IS NULL 
    ) 
    BEGIN 
        RAISERROR('سعر البيع أقل من الحد الأدنى بدون تفويض مدير.', 16, 1); 
        ROLLBACK TRANSACTION; 
    END 
END; 
GO 
 
-------------------------------------------------------------------------------- 
-- 12. سجل حركة المخزون (Inventory Logs) 
CREATE TABLE inventory_logs ( 
    id             INT IDENTITY(1,1) PRIMARY KEY, 
    product_id     INT           NOT NULL, 
    movement_type  NVARCHAR(20)  NOT NULL CHECK(movement_type IN('purchase','sale','return_sale','return_purchase','adjust')), 
    quantity       INT           NOT NULL, 
    unit_cost      DECIMAL(10,2) NOT NULL, 
    reference_tbl  NVARCHAR(50)  NOT NULL, 
    reference_id   INT           NOT NULL, 
    note           NVARCHAR(200) NULL, 
    user_id        INT           NOT NULL, 
    created_at     DATETIME      DEFAULT GETDATE(), 
    FOREIGN KEY (product_id) REFERENCES products(id), 
    FOREIGN KEY (user_id)    REFERENCES users(id) 
); 
GO 
 
-------------------------------------------------------------------------------- 
-- 13. مرتجعات المبيعات (Sales Returns) 
CREATE TABLE sales_returns ( 
    id               INT IDENTITY(1,1) PRIMARY KEY, 
    sales_invoice_id INT           NOT NULL, 
    product_id       INT           NOT NULL, 
    quantity         INT           NOT NULL CHECK(quantity > 0), 
    reason           NVARCHAR(200) NULL, 
    user_id          INT           NOT NULL, 
    created_at       DATETIME      DEFAULT GETDATE(), 
    FOREIGN KEY (sales_invoice_id) REFERENCES sales_invoices(id), 
    FOREIGN KEY (product_id)         REFERENCES products(id), 
    FOREIGN KEY (user_id)            REFERENCES users(id) 
); 
GO 
 
-------------------------------------------------------------------------------- 
-- 14. مرتجعات المشتريات (Purchase Returns) 
CREATE TABLE purchase_returns ( 
    id                  INT IDENTITY(1,1) PRIMARY KEY, 
    purchase_invoice_id INT           NOT NULL, 
    product_id          INT           NOT NULL, 
    quantity            INT           NOT NULL CHECK(quantity > 0), 
    reason              NVARCHAR(200) NULL, 
    user_id             INT           NOT NULL, 
    created_at          DATETIME      DEFAULT GETDATE(), 
    FOREIGN KEY (purchase_invoice_id) REFERENCES purchase_invoices(id), 
    FOREIGN KEY (product_id)            REFERENCES products(id), 
    FOREIGN KEY (user_id)               REFERENCES users(id) 
); 
GO 
 
-------------------------------------------------------------------------------- 
-- 15. المصروفات (Expenses) 
CREATE TABLE expenses ( 
    id           INT IDENTITY(1,1) PRIMARY KEY, 
    expense_type NVARCHAR(100) NOT NULL, 
    amount       DECIMAL(12,2)  NOT NULL CHECK(amount > 0), 
    note         NVARCHAR(200)  NULL, 
    user_id      INT            NOT NULL, 
    created_at   DATETIME       DEFAULT GETDATE(), 
    FOREIGN KEY (user_id) REFERENCES users(id) 
); 
GO
