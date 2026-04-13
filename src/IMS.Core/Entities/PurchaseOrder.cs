namespace IMS.Core.Entities;

public class PurchaseOrder
{
    public int Id { get; set; }
    public string PONumber { get; set; } = string.Empty;
    public int SupplierId { get; set; }
    public Supplier Supplier { get; set; } = null!;
    public string Status { get; set; } = "Draft"; // Draft, PendingApproval, Approved, Received, Cancelled
    public decimal TotalAmount { get; set; }
    public string PaymentStatus { get; set; } = "Pending"; // Pending, Partial, Paid
    public DateTime? OrderDate { get; set; }
    public DateTime? ExpectedDeliveryDate { get; set; }
    public DateTime? ReceivedDate { get; set; }
    public int? ApprovedByUserId { get; set; }
    public User? ApprovedByUser { get; set; }
    public int CreatedByUserId { get; set; }
    public User CreatedByUser { get; set; } = null!;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<PurchaseOrderItem> Items { get; set; } = new List<PurchaseOrderItem>();
}

