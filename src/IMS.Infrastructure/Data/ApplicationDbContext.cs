using IMS.Core.Entities;
using Microsoft.EntityFrameworkCore;

namespace IMS.Infrastructure.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options) { }

    public DbSet<User> Users => Set<User>();
    public DbSet<Category> Categories => Set<Category>();
    public DbSet<Supplier> Suppliers => Set<Supplier>();
    public DbSet<Warehouse> Warehouses => Set<Warehouse>();
    public DbSet<Product> Products => Set<Product>();
    public DbSet<StockLevel> StockLevels => Set<StockLevel>();
    public DbSet<StockTransaction> StockTransactions => Set<StockTransaction>();
    public DbSet<PurchaseOrder> PurchaseOrders => Set<PurchaseOrder>();
    public DbSet<PurchaseOrderItem> PurchaseOrderItems => Set<PurchaseOrderItem>();
    public DbSet<Sale> Sales => Set<Sale>();
    public DbSet<SalesItem> SalesItems => Set<SalesItem>();
    public DbSet<SalesReturn> SalesReturns => Set<SalesReturn>();
    public DbSet<SalesReturnItem> SalesReturnItems => Set<SalesReturnItem>();
    public DbSet<AuditLog> AuditLogs => Set<AuditLog>();
    public DbSet<Alert> Alerts => Set<Alert>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Category>(e =>
        {
            e.HasOne(c => c.ParentCategory)
                .WithMany(c => c.SubCategories)
                .HasForeignKey(c => c.ParentCategoryId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<Product>(e =>
        {
            e.HasIndex(p => p.Sku).IsUnique().HasFilter("[Sku] IS NOT NULL");
            e.HasIndex(p => p.Barcode).IsUnique().HasFilter("[Barcode] IS NOT NULL");
        });

        modelBuilder.Entity<StockLevel>(e =>
        {
            e.HasIndex(s => new { s.ProductId, s.WarehouseId }).IsUnique();
        });

        modelBuilder.Entity<StockTransaction>(e =>
        {
            e.HasOne(t => t.Warehouse)
                .WithMany()
                .HasForeignKey(t => t.WarehouseId)
                .OnDelete(DeleteBehavior.Restrict);
            e.HasOne(t => t.ToWarehouse)
                .WithMany()
                .HasForeignKey(t => t.ToWarehouseId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<PurchaseOrder>(e =>
        {
            e.HasIndex(p => p.PONumber).IsUnique();
        });

        modelBuilder.Entity<Sale>(e =>
        {
            e.HasIndex(s => s.InvoiceNumber).IsUnique();
        });

        modelBuilder.Entity<SalesReturn>(e =>
        {
            e.HasOne(sr => sr.Sale)
                .WithMany(s => s.Returns)
                .HasForeignKey(sr => sr.SaleId)
                .OnDelete(DeleteBehavior.Restrict);
        });
    }
}

