namespace IMS.Core.Entities;

public class StockLevel
{
    public int Id { get; set; }
    public int ProductId { get; set; }
    public Product Product { get; set; } = null!;
    public int WarehouseId { get; set; }
    public Warehouse Warehouse { get; set; } = null!;
    public int Quantity { get; set; }
    public string? BatchNumber { get; set; }
    public DateTime? ExpiryDate { get; set; }
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}

