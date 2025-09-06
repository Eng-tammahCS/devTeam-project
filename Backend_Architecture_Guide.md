# 🏗️ دليل هيكلية مشروع Electronics Store Backend

## 📋 جدول المحتويات
1. [نظرة عامة على المشروع](#نظرة-عامة-على-المشروع)
2. [البنية المعمارية (Clean Architecture)](#البنية-المعمارية-clean-architecture)
3. [طبقات المشروع](#طبقات-المشروع)
4. [تدفق البيانات](#تدفق-البيانات)
5. [أمثلة عملية](#أمثلة-عملية)
6. [كيفية إضافة ميزة جديدة](#كيفية-إضافة-ميزة-جديدة)

---

## 🎯 نظرة عامة على المشروع

### ما هو هذا المشروع؟
نظام إدارة متجر إلكترونيات شامل يتضمن:
- إدارة المنتجات والمخزون
- إدارة المبيعات والمشتريات
- إدارة الموردين والعملاء
- إدارة المستخدمين والصلاحيات
- نظام نقاط البيع (POS)
- التقارير والإحصائيات

### التقنيات المستخدمة:
- **ASP.NET Core 9.0** - إطار العمل الرئيسي
- **Entity Framework Core** - إدارة قاعدة البيانات
- **SQL Server** - قاعدة البيانات
- **JWT** - المصادقة والتفويض
- **Clean Architecture** - البنية المعمارية

---

## 🏛️ البنية المعمارية (Clean Architecture)

### ما هي Clean Architecture؟
هي نمط معماري يهدف إلى:
- **فصل المسؤوليات** بين طبقات التطبيق
- **استقلالية قاعدة البيانات** عن منطق الأعمال
- **سهولة الاختبار** والصيانة
- **قابلية التطوير** والتوسع

### المبادئ الأساسية:
1. **التبعية من الخارج للداخل** - الطبقات الخارجية تعتمد على الداخلية
2. **استقلالية قاعدة البيانات** - يمكن تغيير قاعدة البيانات دون التأثير على منطق الأعمال
3. **فصل المنطق** - كل طبقة لها مسؤولية محددة

---

## 📚 طبقات المشروع

### 1️⃣ **Domain Layer** (الطبقة الأساسية)
**المسؤولية:** تعريف الكيانات والمنطق الأساسي للأعمال

#### الملفات الرئيسية:
```
ElectronicsStore.Domain/
├── Entities/           # الكيانات الأساسية
│   ├── Product.cs      # كيان المنتج
│   ├── User.cs         # كيان المستخدم
│   ├── Category.cs     # كيان الفئة
│   └── ...
├── Interfaces/         # الواجهات (Interfaces)
│   ├── IGenericRepository.cs
│   └── IUnitOfWork.cs
├── Enums/             # التعدادات
│   ├── PaymentMethod.cs
│   └── PasswordStrength.cs
└── ValueObjects/      # كائنات القيمة
```

#### مثال على كيان Product:
```csharp
public class Product : BaseEntity
{
    public string Name { get; set; }
    public string Barcode { get; set; }
    public int CategoryId { get; set; }
    public int? SupplierId { get; set; }
    public decimal DefaultCostPrice { get; set; }
    public decimal DefaultSellingPrice { get; set; }
    public decimal MinSellingPrice { get; set; }
    public string Description { get; set; }
    public DateTime CreatedAt { get; set; }

    // العلاقات
    public virtual Category Category { get; set; }
    public virtual Supplier Supplier { get; set; }
    public virtual ICollection<SalesInvoiceDetail> SalesInvoiceDetails { get; set; }
    public virtual ICollection<PurchaseInvoiceDetail> PurchaseInvoiceDetails { get; set; }
    public virtual ICollection<InventoryLog> InventoryLogs { get; set; }
}
```

### 2️⃣ **Application Layer** (طبقة التطبيق)
**المسؤولية:** منطق الأعمال والخدمات

#### الملفات الرئيسية:
```
ElectronicsStore.Application/
├── DTOs/              # كائنات نقل البيانات
│   ├── ProductDto.cs
│   ├── CreateProductDto.cs
│   └── UpdateProductDto.cs
├── Interfaces/        # واجهات الخدمات
│   ├── IProductService.cs
│   ├── IUserService.cs
│   └── ...
├── Services/          # تنفيذ الخدمات
│   ├── ProductService.cs
│   ├── UserService.cs
│   └── ...
├── Models/           # نماذج التكوين
│   └── JwtSettings.cs
└── UseCases/        # حالات الاستخدام
```

#### مثال على DTO:
```csharp
public class ProductDto
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Barcode { get; set; }
    public int CategoryId { get; set; }
    public string CategoryName { get; set; }  // للعرض فقط
    public int? SupplierId { get; set; }
    public string? SupplierName { get; set; } // للعرض فقط
    public decimal DefaultCostPrice { get; set; }
    public decimal DefaultSellingPrice { get; set; }
    public decimal MinSellingPrice { get; set; }
    public string Description { get; set; }
    public DateTime CreatedAt { get; set; }
    public int CurrentQuantity { get; set; }  // محسوب من المخزون
}
```

#### مثال على Service:
```csharp
public class ProductService : IProductService
{
    private readonly IUnitOfWork _unitOfWork;

    public ProductService(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<IEnumerable<ProductDto>> GetAllProductsAsync()
    {
        // 1. جلب المنتجات من قاعدة البيانات
        var products = await _unitOfWork.Products.GetAllAsync();
        
        // 2. تحويلها إلى DTOs
        var productDtos = new List<ProductDto>();
        foreach (var product in products)
        {
            // 3. جلب البيانات المرتبطة
            var category = await _unitOfWork.Categories.GetByIdAsync(product.CategoryId);
            var supplier = product.SupplierId.HasValue ? 
                await _unitOfWork.Suppliers.GetByIdAsync(product.SupplierId.Value) : null;

            // 4. حساب الكمية الحالية
            var inventoryLogs = await _unitOfWork.InventoryLogs.FindAsync(il => il.ProductId == product.Id);
            var currentQuantity = inventoryLogs.Sum(il => il.Quantity);

            // 5. إنشاء DTO
            productDtos.Add(new ProductDto
            {
                Id = product.Id,
                Name = product.Name,
                CategoryName = category?.Name ?? "",
                SupplierName = supplier?.Name,
                CurrentQuantity = currentQuantity,
                // ... باقي الخصائص
            });
        }

        return productDtos;
    }
}
```

### 3️⃣ **Infrastructure Layer** (طبقة البنية التحتية)
**المسؤولية:** التفاعل مع قاعدة البيانات والخدمات الخارجية

#### الملفات الرئيسية:
```
ElectronicsStore.Infrastructure/
├── Data/             # إعدادات قاعدة البيانات
│   └── ElectronicsStoreDbContext.cs
├── Repositories/     # مستودعات البيانات
│   ├── GenericRepository.cs
│   └── UnitOfWork.cs
├── Configurations/   # تكوين الكيانات
└── Migrations/      # ترحيل قاعدة البيانات
```

#### مثال على DbContext:
```csharp
public class ElectronicsStoreDbContext : DbContext
{
    public DbSet<Product> Products { get; set; }
    public DbSet<Category> Categories { get; set; }
    public DbSet<User> Users { get; set; }
    // ... باقي DbSets

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // تكوين العلاقات والقيود
        modelBuilder.Entity<Product>()
            .HasOne(p => p.Category)
            .WithMany(c => c.Products)
            .HasForeignKey(p => p.CategoryId);
    }
}
```

#### مثال على Repository:
```csharp
public class GenericRepository<T> : IGenericRepository<T> where T : class
{
    protected readonly ElectronicsStoreDbContext _context;
    protected readonly DbSet<T> _dbSet;

    public GenericRepository(ElectronicsStoreDbContext context)
    {
        _context = context;
        _dbSet = context.Set<T>();
    }

    public async Task<T?> GetByIdAsync(int id)
    {
        return await _dbSet.FindAsync(id);
    }

    public async Task<IEnumerable<T>> GetAllAsync()
    {
        return await _dbSet.ToListAsync();
    }

    public async Task<T> AddAsync(T entity)
    {
        await _dbSet.AddAsync(entity);
        return entity;
    }
}
```

### 4️⃣ **WebAPI Layer** (طبقة الواجهة)
**المسؤولية:** استقبال الطلبات وإرجاع الاستجابات

#### الملفات الرئيسية:
```
ElectronicsStore.WebAPI/
├── Controllers/      # وحدات التحكم
│   ├── ProductsController.cs
│   ├── UsersController.cs
│   └── AuthController.cs
├── Middleware/       # البرمجيات الوسيطة
│   └── ErrorHandlingMiddleware.cs
├── Extensions/       # الإضافات
├── Program.cs        # نقطة البداية
└── appsettings.json  # إعدادات التطبيق
```

#### مثال على Controller:
```csharp
[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    private readonly IProductService _productService;

    public ProductsController(IProductService productService)
    {
        _productService = productService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<ProductDto>>> GetProducts()
    {
        try
        {
            var products = await _productService.GetAllProductsAsync();
            return Ok(products);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "خطأ في تحميل المنتجات", error = ex.Message });
        }
    }

    [HttpPost]
    public async Task<ActionResult<ProductDto>> CreateProduct(CreateProductDto dto)
    {
        try
        {
            var product = await _productService.CreateProductAsync(dto);
            return CreatedAtAction(nameof(GetProduct), new { id = product.Id }, product);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = "خطأ في إنشاء المنتج", error = ex.Message });
        }
    }
}
```

---

## 🔄 تدفق البيانات

### كيف تعمل الطلبات؟

#### 1️⃣ **طلب جلب المنتجات:**
```
Frontend → ProductsController → ProductService → UnitOfWork → GenericRepository → Database
```

#### 2️⃣ **طلب إنشاء منتج جديد:**
```
Frontend → ProductsController → ProductService → UnitOfWork → GenericRepository → Database
```

### مثال تفصيلي لطلب إنشاء منتج:

#### الخطوة 1: Frontend يرسل طلب
```javascript
fetch('/api/products', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        name: "لابتوب HP",
        barcode: "123456789",
        categoryId: 1,
        defaultCostPrice: 2000,
        defaultSellingPrice: 2500
    })
})
```

#### الخطوة 2: Controller يستقبل الطلب
```csharp
[HttpPost]
public async Task<ActionResult<ProductDto>> CreateProduct(CreateProductDto dto)
{
    var product = await _productService.CreateProductAsync(dto);
    return CreatedAtAction(nameof(GetProduct), new { id = product.Id }, product);
}
```

#### الخطوة 3: Service يعالج المنطق
```csharp
public async Task<ProductDto> CreateProductAsync(CreateProductDto dto)
{
    // 1. إنشاء كيان جديد
    var product = new Product
    {
        Name = dto.Name,
        Barcode = dto.Barcode,
        CategoryId = dto.CategoryId,
        DefaultCostPrice = dto.DefaultCostPrice,
        DefaultSellingPrice = dto.DefaultSellingPrice,
        CreatedAt = DateTime.UtcNow
    };

    // 2. حفظ في قاعدة البيانات
    await _unitOfWork.Products.AddAsync(product);
    await _unitOfWork.SaveChangesAsync();

    // 3. إرجاع DTO
    return await GetProductByIdAsync(product.Id);
}
```

#### الخطوة 4: Repository يحفظ البيانات
```csharp
public async Task<T> AddAsync(T entity)
{
    await _dbSet.AddAsync(entity);
    return entity;
}
```

#### الخطوة 5: إرجاع النتيجة للـ Frontend
```json
{
    "id": 1,
    "name": "لابتوب HP",
    "barcode": "123456789",
    "categoryId": 1,
    "categoryName": "أجهزة كمبيوتر",
    "defaultCostPrice": 2000.00,
    "defaultSellingPrice": 2500.00,
    "createdAt": "2024-01-15T10:30:00Z"
}
```

---

## 🛠️ أمثلة عملية

### مثال 1: جلب منتج بالباركود

#### 1. Controller:
```csharp
[HttpGet("barcode/{barcode}")]
public async Task<ActionResult<ProductDto>> GetProductByBarcode(string barcode)
{
    var product = await _productService.GetProductByBarcodeAsync(barcode);
    if (product == null)
        return NotFound(new { message = "المنتج غير موجود" });
    
    return Ok(product);
}
```

#### 2. Service:
```csharp
public async Task<ProductDto?> GetProductByBarcodeAsync(string barcode)
{
    // البحث في قاعدة البيانات
    var products = await _unitOfWork.Products.FindAsync(p => p.Barcode == barcode);
    var product = products.FirstOrDefault();
    
    if (product == null) return null;

    // جلب البيانات المرتبطة
    var category = await _unitOfWork.Categories.GetByIdAsync(product.CategoryId);
    var supplier = product.SupplierId.HasValue ? 
        await _unitOfWork.Suppliers.GetByIdAsync(product.SupplierId.Value) : null;

    // حساب الكمية
    var inventoryLogs = await _unitOfWork.InventoryLogs.FindAsync(il => il.ProductId == product.Id);
    var currentQuantity = inventoryLogs.Sum(il => il.Quantity);

    // إرجاع DTO
    return new ProductDto
    {
        Id = product.Id,
        Name = product.Name,
        Barcode = product.Barcode,
        CategoryName = category?.Name ?? "",
        SupplierName = supplier?.Name,
        CurrentQuantity = currentQuantity,
        // ... باقي الخصائص
    };
}
```

### مثال 2: إنشاء فاتورة مبيعات

#### 1. DTO:
```csharp
public class CreateSalesInvoiceDto
{
    public string CustomerName { get; set; }
    public List<SalesInvoiceDetailDto> Details { get; set; }
    public decimal DiscountTotal { get; set; }
    public PaymentMethod PaymentMethod { get; set; }
}

public class SalesInvoiceDetailDto
{
    public int ProductId { get; set; }
    public int Quantity { get; set; }
    public decimal UnitPrice { get; set; }
    public decimal DiscountAmount { get; set; }
}
```

#### 2. Service:
```csharp
public async Task<SalesInvoiceDto> CreateSalesInvoiceAsync(CreateSalesInvoiceDto dto, int userId)
{
    // 1. إنشاء الفاتورة
    var invoice = new SalesInvoice
    {
        InvoiceNumber = GenerateInvoiceNumber(),
        CustomerName = dto.CustomerName,
        InvoiceDate = DateTime.UtcNow,
        DiscountTotal = dto.DiscountTotal,
        PaymentMethod = dto.PaymentMethod,
        UserId = userId
    };

    await _unitOfWork.SalesInvoices.AddAsync(invoice);

    // 2. إنشاء تفاصيل الفاتورة
    foreach (var detail in dto.Details)
    {
        var invoiceDetail = new SalesInvoiceDetail
        {
            SalesInvoiceId = invoice.Id,
            ProductId = detail.ProductId,
            Quantity = detail.Quantity,
            UnitPrice = detail.UnitPrice,
            DiscountAmount = detail.DiscountAmount,
            LineTotal = (detail.Quantity * detail.UnitPrice) - detail.DiscountAmount
        };

        await _unitOfWork.SalesInvoiceDetails.AddAsync(invoiceDetail);

        // 3. تحديث المخزون
        var inventoryLog = new InventoryLog
        {
            ProductId = detail.ProductId,
            Quantity = -detail.Quantity, // سالب لأنها مبيعات
            UnitCost = detail.UnitPrice,
            ReferenceTable = "sales_invoices",
            ReferenceId = invoice.Id,
            Note = $"بيع - فاتورة رقم {invoice.InvoiceNumber}",
            UserId = userId
        };

        await _unitOfWork.InventoryLogs.AddAsync(inventoryLog);
    }

    // 4. حساب المجموع
    invoice.TotalAmount = dto.Details.Sum(d => (d.Quantity * d.UnitPrice) - d.DiscountAmount) - dto.DiscountTotal;

    await _unitOfWork.SaveChangesAsync();

    return await GetSalesInvoiceByIdAsync(invoice.Id);
}
```

---

## ➕ كيفية إضافة ميزة جديدة

### الخطوات:

#### 1️⃣ **إضافة الكيان في Domain Layer**
```csharp
// Entities/Order.cs
public class Order : BaseEntity
{
    public string OrderNumber { get; set; }
    public int CustomerId { get; set; }
    public DateTime OrderDate { get; set; }
    public OrderStatus Status { get; set; }
    public decimal TotalAmount { get; set; }

    public virtual Customer Customer { get; set; }
    public virtual ICollection<OrderDetail> OrderDetails { get; set; }
}
```

#### 2️⃣ **إضافة DTOs في Application Layer**
```csharp
// DTOs/OrderDto.cs
public class OrderDto
{
    public int Id { get; set; }
    public string OrderNumber { get; set; }
    public string CustomerName { get; set; }
    public DateTime OrderDate { get; set; }
    public string Status { get; set; }
    public decimal TotalAmount { get; set; }
    public List<OrderDetailDto> Details { get; set; }
}

// DTOs/CreateOrderDto.cs
public class CreateOrderDto
{
    public int CustomerId { get; set; }
    public List<CreateOrderDetailDto> Details { get; set; }
}
```

#### 3️⃣ **إضافة Interface في Application Layer**
```csharp
// Interfaces/IOrderService.cs
public interface IOrderService
{
    Task<IEnumerable<OrderDto>> GetAllOrdersAsync();
    Task<OrderDto?> GetOrderByIdAsync(int id);
    Task<OrderDto> CreateOrderAsync(CreateOrderDto dto);
    Task<OrderDto> UpdateOrderAsync(int id, UpdateOrderDto dto);
    Task DeleteOrderAsync(int id);
}
```

#### 4️⃣ **إضافة Service في Application Layer**
```csharp
// Services/OrderService.cs
public class OrderService : IOrderService
{
    private readonly IUnitOfWork _unitOfWork;

    public OrderService(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<IEnumerable<OrderDto>> GetAllOrdersAsync()
    {
        var orders = await _unitOfWork.Orders.GetAllAsync();
        var orderDtos = new List<OrderDto>();

        foreach (var order in orders)
        {
            var customer = await _unitOfWork.Customers.GetByIdAsync(order.CustomerId);
            var details = await _unitOfWork.OrderDetails.FindAsync(od => od.OrderId == order.Id);

            orderDtos.Add(new OrderDto
            {
                Id = order.Id,
                OrderNumber = order.OrderNumber,
                CustomerName = customer?.Name ?? "",
                OrderDate = order.OrderDate,
                Status = order.Status.ToString(),
                TotalAmount = order.TotalAmount,
                Details = details.Select(d => new OrderDetailDto
                {
                    ProductId = d.ProductId,
                    Quantity = d.Quantity,
                    UnitPrice = d.UnitPrice
                }).ToList()
            });
        }

        return orderDtos;
    }

    // ... باقي الطرق
}
```

#### 5️⃣ **إضافة Repository في Infrastructure Layer**
```csharp
// في UnitOfWork.cs
public IGenericRepository<Order> Orders { get; }
public IGenericRepository<OrderDetail> OrderDetails { get; }

// في Constructor
Orders = new GenericRepository<Order>(_context);
OrderDetails = new GenericRepository<OrderDetail>(_context);
```

#### 6️⃣ **إضافة Controller في WebAPI Layer**
```csharp
// Controllers/OrdersController.cs
[ApiController]
[Route("api/[controller]")]
public class OrdersController : ControllerBase
{
    private readonly IOrderService _orderService;

    public OrdersController(IOrderService orderService)
    {
        _orderService = orderService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<OrderDto>>> GetOrders()
    {
        var orders = await _orderService.GetAllOrdersAsync();
        return Ok(orders);
    }

    [HttpPost]
    public async Task<ActionResult<OrderDto>> CreateOrder(CreateOrderDto dto)
    {
        var order = await _orderService.CreateOrderAsync(dto);
        return CreatedAtAction(nameof(GetOrder), new { id = order.Id }, order);
    }

    // ... باقي الطرق
}
```

#### 7️⃣ **تسجيل الخدمة في Program.cs**
```csharp
// في Program.cs
builder.Services.AddScoped<IOrderService, OrderService>();
```

---

## 🔧 أدوات التطوير

### 1️⃣ **Swagger UI**
- الوصول: `https://localhost:7001/swagger`
- لاختبار الـ APIs مباشرة

### 2️⃣ **Entity Framework Migrations**
```bash
# إنشاء migration جديد
dotnet ef migrations add AddOrdersTable

# تطبيق التغييرات على قاعدة البيانات
dotnet ef database update
```

### 3️⃣ **Package Manager Console**
```powershell
# إنشاء migration
Add-Migration AddOrdersTable

# تحديث قاعدة البيانات
Update-Database
```

---

## 📝 ملاحظات مهمة

### 1️⃣ **أفضل الممارسات:**
- استخدم DTOs دائماً للتواصل مع Frontend
- لا تعرض الكيانات مباشرة
- استخدم async/await للعمليات غير المتزامنة
- تعامل مع الأخطاء بشكل مناسب

### 2️⃣ **الأمان:**
- تحقق من الصلاحيات قبل كل عملية
- استخدم JWT للمصادقة
- شفر كلمات المرور
- تحقق من المدخلات

### 3️⃣ **الأداء:**
- استخدم Include لتجنب N+1 queries
- استخدم Pagination للقوائم الكبيرة
- استخدم Caching عند الحاجة
- استخدم Transactions للعمليات المعقدة

---

## 🎓 خاتمة

هذا الدليل يشرح لك كيفية عمل المشروع بالكامل. المفتاح لفهم المشروع هو:

1. **افهم تدفق البيانات** من Frontend إلى Database
2. **تعرف على دور كل طبقة** ومسؤولياتها
3. **مارس إضافة ميزات جديدة** لتفهم العملية
4. **استخدم Swagger** لاختبار الـ APIs
5. **اقرأ الكود الموجود** لفهم الأنماط المستخدمة

إذا كان لديك أي استفسارات، لا تتردد في السؤال! 🚀

---

## 🔍 فهم أعمق للطبقات

### لماذا نستخدم Clean Architecture؟

#### 1️⃣ **فصل المسؤوليات:**
- **Domain Layer**: يحتوي على منطق الأعمال الأساسي
- **Application Layer**: يحتوي على حالات الاستخدام
- **Infrastructure Layer**: يتعامل مع قاعدة البيانات والخدمات الخارجية
- **WebAPI Layer**: يتعامل مع الطلبات والاستجابات

#### 2️⃣ **سهولة الاختبار:**
```csharp
// يمكن اختبار Service بدون قاعدة بيانات
public class ProductServiceTests
{
    [Fact]
    public async Task GetAllProducts_ShouldReturnProducts()
    {
        // Arrange
        var mockUnitOfWork = new Mock<IUnitOfWork>();
        var service = new ProductService(mockUnitOfWork.Object);
        
        // Act
        var result = await service.GetAllProductsAsync();
        
        // Assert
        Assert.NotNull(result);
    }
}
```

#### 3️⃣ **قابلية التطوير:**
- يمكن تغيير قاعدة البيانات دون التأثير على منطق الأعمال
- يمكن إضافة واجهات جديدة (Mobile App, Desktop App)
- يمكن تغيير إطار العمل دون التأثير على المنطق الأساسي

### كيف تعمل Dependency Injection?

```csharp
// في Program.cs
builder.Services.AddScoped<IProductService, ProductService>();
builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();

// في Controller
public class ProductsController : ControllerBase
{
    private readonly IProductService _productService; // سيتم حقنه تلقائياً

    public ProductsController(IProductService productService)
    {
        _productService = productService;
    }
}
```

### فهم Repository Pattern:

```csharp
// Interface - يحدد العمليات
public interface IGenericRepository<T>
{
    Task<T?> GetByIdAsync(int id);
    Task<IEnumerable<T>> GetAllAsync();
    Task<T> AddAsync(T entity);
    Task<T> UpdateAsync(T entity);
    Task DeleteAsync(T entity);
}

// Implementation - ينفذ العمليات
public class GenericRepository<T> : IGenericRepository<T>
{
    private readonly DbContext _context;
    
    public async Task<T?> GetByIdAsync(int id)
    {
        return await _context.Set<T>().FindAsync(id);
    }
}
```

### فهم Unit of Work Pattern:

```csharp
public class UnitOfWork : IUnitOfWork
{
    private readonly DbContext _context;
    
    public IGenericRepository<Product> Products { get; }
    public IGenericRepository<Category> Categories { get; }
    
    public async Task<int> SaveChangesAsync()
    {
        return await _context.SaveChangesAsync();
    }
    
    public async Task BeginTransactionAsync()
    {
        await _context.Database.BeginTransactionAsync();
    }
}
```

---

## 🎯 نصائح للتعلم

### 1️⃣ **ابدأ بفهم تدفق البيانات:**
```
Frontend → Controller → Service → Repository → Database
```

### 2️⃣ **افهم دور كل طبقة:**
- **Controller**: يستقبل الطلبات ويعيد الاستجابات
- **Service**: يحتوي على منطق الأعمال
- **Repository**: يتعامل مع قاعدة البيانات
- **Entity**: يمثل جدول في قاعدة البيانات
- **DTO**: يمثل البيانات المرسلة للـ Frontend

### 3️⃣ **مارس على أمثلة بسيطة:**
- أضف حقل جديد لجدول موجود
- أنشئ API جديد بسيط
- عدل منطق موجود

### 4️⃣ **استخدم أدوات التطوير:**
- **Swagger**: لاختبار الـ APIs
- **SQL Server Management Studio**: لمراجعة قاعدة البيانات
- **Visual Studio**: للتصحيح والتطوير

---

## 🚀 الخطوات التالية

1. **اقرأ الكود الموجود** في كل طبقة
2. **جرب إضافة ميزة بسيطة** مثل حقل جديد
3. **اختبر الـ APIs** باستخدام Swagger
4. **افهم قاعدة البيانات** وعلاقات الجداول
5. **مارس على أمثلة عملية**

تذكر: التعلم يأتي بالممارسة! 💪
