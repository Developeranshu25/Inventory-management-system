namespace IMS.Core.Entities;

public class SalesReturn
{
    public int Id { get; set; }
    public int SaleId { get; set; }
    public Sale Sale { get; set; } = null!;
    public decimal TotalRefund { get; set; }
    public string? Reason { get; set; }
    public int CreatedByUserId { get; set; }
    public User CreatedByUser { get; set; } = null!;
    public DateTime ReturnDate { get; set; } = DateTime.UtcNow;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<SalesReturnItem> Items { get; set; } = new List<SalesReturnItem>();
}

public class SalesReturnItem
{
    public int Id { get; set; }
    public int SalesReturnId { get; set; }
    public SalesReturn SalesReturn { get; set; } = null!;
    public int SalesItemId { get; set; }
    public SalesItem SalesItem { get; set; } = null!;
    public int Quantity { get; set; }
    public decimal RefundAmount { get; set; }
    public string? Reason { get; set; }
}
