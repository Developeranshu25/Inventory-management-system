namespace IMS.Core.Entities;

public class StockTransaction
{
    public int Id { get; set; }
    public int ProductId { get; set; }
    public Product Product { get; set; } = null!;
    public int WarehouseId { get; set; }
    public Warehouse Warehouse { get; set; } = null!;
    public string TransactionType { get; set; } = string.Empty; // StockIn, StockOut, Adjustment, Transfer
    public int Quantity { get; set; } // Positive for in, negative for out
    public int? ToWarehouseId { get; set; }
    public Warehouse? ToWarehouse { get; set; }
    public string? ReferenceNumber { get; set; }
    public string? Notes { get; set; }
    public int? UserId { get; set; }
    public User? User { get; set; }
    public string? BatchNumber { get; set; }
    public DateTime? ExpiryDate { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

