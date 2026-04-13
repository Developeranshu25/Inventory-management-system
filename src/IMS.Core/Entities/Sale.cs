namespace IMS.Core.Entities;

public class Sale
{
    public int Id { get; set; }
    public string InvoiceNumber { get; set; } = string.Empty;
    public string Status { get; set; } = "Draft"; // Draft, Completed, Cancelled, Returned
    public decimal SubTotal { get; set; }
    public decimal TaxAmount { get; set; }
    public decimal DiscountAmount { get; set; }
    public decimal TotalAmount { get; set; }
    public string PaymentStatus { get; set; } = "Pending"; // Pending, Partial, Paid
    public string? CustomerName { get; set; }
    public string? CustomerPhone { get; set; }
    public string? CustomerEmail { get; set; }
    public int CreatedByUserId { get; set; }
    public User CreatedByUser { get; set; } = null!;
    public int WarehouseId { get; set; }
    public Warehouse Warehouse { get; set; } = null!;
    public DateTime SaleDate { get; set; } = DateTime.UtcNow;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<SalesItem> Items { get; set; } = new List<SalesItem>();
    public ICollection<SalesReturn> Returns { get; set; } = new List<SalesReturn>();
}

