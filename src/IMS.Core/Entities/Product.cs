namespace IMS.Core.Entities;

public class Product
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Sku { get; set; }
    public string? Barcode { get; set; }
    public int CategoryId { get; set; }
    public Category Category { get; set; } = null!;
    public int? SupplierId { get; set; }
    public Supplier? Supplier { get; set; }
    public string Unit { get; set; } = "pcs"; // pcs, kg, liter, box
    public decimal CostPrice { get; set; }
    public decimal SellingPrice { get; set; }
    public int MinimumStockLevel { get; set; }
    public string? Description { get; set; }
    public string? ImageUrl { get; set; }
    public string? VariantInfo { get; set; } // JSON: size, color, model
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<StockLevel> StockLevels { get; set; } = new List<StockLevel>();
    public ICollection<StockTransaction> StockTransactions { get; set; } = new List<StockTransaction>();
    public ICollection<PurchaseOrderItem> PurchaseOrderItems { get; set; } = new List<PurchaseOrderItem>();
    public ICollection<SalesItem> SalesItems { get; set; } = new List<SalesItem>();
}

